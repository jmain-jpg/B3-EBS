import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const source = new URL("../data/b3-state.json", import.meta.url);
const destination = new URL("./seed.sql", import.meta.url);
const partsDirectory = new URL("./seed-parts/", import.meta.url);
const record = JSON.parse(await readFile(source, "utf8"));
const state = record.state && typeof record.state === "object" ? record.state : record;
const updatedAt = Math.round(Number(record.updatedAt || Date.now()) * (Number(record.updatedAt || 0) < 1e12 ? 1000 : 1));
const escaped = JSON.stringify(state).replaceAll("'", "''");
const sql = `INSERT INTO app_state (id, updated_at, data) VALUES (1, ${updatedAt}, '${escaped}')\nON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at, data = excluded.data;\n`;
await mkdir(new URL("./", destination), { recursive: true });
await writeFile(destination, sql, "utf8");

await rm(partsDirectory, { recursive: true, force: true });
await mkdir(partsDirectory, { recursive: true });
// Keep each statement below Windows' command-line size limit so Wrangler can
// send it directly instead of using its larger-file upload workflow.
const chunkSize = 20_000;
const chunks = [];
for (let offset = 0; offset < escaped.length; offset += chunkSize) {
  chunks.push(escaped.slice(offset, offset + chunkSize));
}
for (let index = 0; index < chunks.length; index += 1) {
  const statement = index === 0
    ? `INSERT INTO app_state (id, updated_at, data) VALUES (1, ${updatedAt}, '${chunks[index]}') ON CONFLICT(id) DO UPDATE SET updated_at = excluded.updated_at, data = excluded.data;\n`
    : `UPDATE app_state SET data = data || '${chunks[index]}' WHERE id = 1;\n`;
  await writeFile(new URL(`${String(index + 1).padStart(3, "0")}.sql`, partsDirectory), statement, "utf8");
}
console.log(`Private migration prepared as seed.sql and ${chunks.length} smaller seed parts (excluded from Git).`);
