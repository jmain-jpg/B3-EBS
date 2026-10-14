import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";

const [sqlArgument, outputArgument] = process.argv.slice(2);
if (!sqlArgument || !outputArgument) {
  throw new Error("Usage: node cloudflare/download-r2-backup.mjs <d1-export.sql> <output-directory>");
}

const sqlPath = resolve(sqlArgument);
const outputDirectory = resolve(outputArgument);
const bucket = "b3-floral-stock-photos";
const wrangler = resolve("node_modules/wrangler/bin/wrangler.js");
const sql = await readFile(sqlPath, "utf8");
const keys = [...new Set(sql.match(/stock\/[A-Za-z0-9_./-]+\.(?:webp|jpe?g)/gi) || [])].sort();
if (!keys.length) throw new Error("No R2 stock-photo keys were found in the D1 export.");

await mkdir(outputDirectory, { recursive: true });
let nextIndex = 0;
let completed = 0;

function download(key) {
  return new Promise(async (resolveDownload, rejectDownload) => {
    const destination = join(outputDirectory, ...key.split("/"));
    await mkdir(dirname(destination), { recursive: true });
    const child = spawn(process.execPath, [
      wrangler,
      "r2",
      "object",
      "get",
      `${bucket}/${key}`,
      "--remote",
      "--file",
      destination,
    ], { cwd: resolve("."), stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", rejectDownload);
    child.on("close", (code) => {
      if (code === 0) resolveDownload(destination);
      else rejectDownload(new Error(`R2 download failed for ${key}: ${stderr.trim()}`));
    });
  });
}

async function worker() {
  while (true) {
    const index = nextIndex;
    nextIndex += 1;
    if (index >= keys.length) return;
    await download(keys[index]);
    completed += 1;
    if (completed % 25 === 0 || completed === keys.length) {
      console.log(`Downloaded ${completed}/${keys.length} R2 objects`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(8, keys.length) }, worker));

const objects = [];
let totalBytes = 0;
for (const key of keys) {
  const path = join(outputDirectory, ...key.split("/"));
  const info = await stat(path);
  if (!info.isFile() || info.size < 1) throw new Error(`Downloaded R2 object is empty: ${key}`);
  const sha256 = createHash("sha256").update(await readFile(path)).digest("hex");
  totalBytes += info.size;
  objects.push({ key, bytes: info.size, sha256 });
}

const manifest = {
  createdAt: new Date().toISOString(),
  bucket,
  objectCount: objects.length,
  totalBytes,
  objects,
};
await writeFile(join(outputDirectory, "r2-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`R2 backup complete: ${objects.length} objects, ${totalBytes} bytes`);
