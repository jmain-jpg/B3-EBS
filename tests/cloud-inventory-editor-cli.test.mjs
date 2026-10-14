import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import test from "node:test";

const run = promisify(execFile);
const script = resolve("cloudflare/inventory-data-editor.mjs");

test("inventory editor CLI downloads, previews, uploads, verifies, and rolls back", async (context) => {
  let updatedAt = 100;
  let state = {
    stock: [
      { id: "stock-1", productCode: "FS-001", description: "Bouquet", status: "available" },
      { id: "stock-2", productCode: "FS-002", description: "Box", status: "available", inventoryLocation: "pending" },
    ],
    sales: [{ id: "sale-1", voucherNumber: "001" }],
  };
  const server = createServer(async (request, response) => {
    if (request.url?.startsWith("/api/state") && request.method === "GET") {
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ updatedAt, state }));
      return;
    }
    if (request.url === "/api/state" && request.method === "POST") {
      const chunks = [];
      for await (const chunk of request) chunks.push(chunk);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
      if (body.baseUpdatedAt !== updatedAt) {
        response.statusCode = 409;
        response.end(JSON.stringify({ updatedAt, state }));
        return;
      }
      state = body.state;
      updatedAt += 1;
      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify({ updatedAt, state }));
      return;
    }
    response.statusCode = 404;
    response.end();
  });
  await new Promise((resolveListen) => server.listen(0, "127.0.0.1", resolveListen));
  context.after(() => new Promise((resolveClose) => server.close(resolveClose)));

  const workingDirectory = await mkdtemp(join(tmpdir(), "b3-inventory-editor-"));
  context.after(() => rm(workingDirectory, { recursive: true, force: true }));
  const address = server.address();
  const env = { ...process.env, B3_APP_PASSWORD: "test-password", B3_CLOUD_URL: `http://127.0.0.1:${address.port}` };

  await run(process.execPath, [script, "download"], { cwd: workingDirectory, env });
  const sessionNames = await readdir(join(workingDirectory, "backups", "cloud-inventory"));
  assert.equal(sessionNames.length, 1);
  const session = join(workingDirectory, "backups", "cloud-inventory", sessionNames[0]);
  const csvPath = join(session, "inventory-locations.csv");
  const csv = await readFile(csvPath, "utf8");
  const editedCsv = csv.split(/\r?\n/).map((line) => line.startsWith("FS-001,") ? line.replace(/,shop,shop$/, ",shop,stock") : line).join("\r\n");
  await writeFile(csvPath, editedCsv, "utf8");

  await run(process.execPath, [script, "preview", session], { cwd: workingDirectory, env });
  const preview = JSON.parse(await readFile(join(session, "inventory-preview.json"), "utf8"));
  assert.equal(preview.changedRecords, 1);
  assert.deepEqual(preview.finalCounts, { stock: 2, shop: 0 });

  await assert.rejects(
    run(process.execPath, [script, "upload", session], { cwd: workingDirectory, env }),
    /Upload blocked/
  );
  assert.equal(updatedAt, 100);

  await run(process.execPath, [script, "upload", session, "--confirm=UPLOAD-INVENTORY"], { cwd: workingDirectory, env });
  assert.equal(updatedAt, 101);
  assert.equal(state.stock[0].inventoryLocation, "pending");
  assert.deepEqual(state.sales, [{ id: "sale-1", voucherNumber: "001" }]);

  await run(process.execPath, [script, "rollback", session, "--confirm=ROLLBACK-INVENTORY"], { cwd: workingDirectory, env });
  assert.equal(updatedAt, 102);
  assert.equal(state.stock[0].inventoryLocation, "shop");
  assert.equal(state.stock[1].inventoryLocation, "pending");
});
