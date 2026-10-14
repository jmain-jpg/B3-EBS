import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = (process.env.B3_CLOUD_URL || "https://b3-floral-ebs.laomainelove.workers.dev").replace(/\/$/, "");
const password = process.env.B3_APP_PASSWORD;
if (!password) throw new Error("Set B3_APP_PASSWORD before downloading a cloud backup.");

const response = await fetch(`${baseUrl}/api/state?t=${Date.now()}`, {
  cache: "no-store",
  headers: { Authorization: `Basic ${Buffer.from(`b3:${password}`).toString("base64")}` },
});
if (!response.ok) throw new Error(`Cloud backup failed (${response.status}).`);

const text = await response.text();
const payload = JSON.parse(text);
if (!payload?.state || typeof payload.state !== "object") throw new Error("Cloud backup response is invalid.");

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const directory = new URL("../backups/cloud/", import.meta.url);
const target = new URL(`b3-cloud-${stamp}.json`, directory);
await mkdir(directory, { recursive: true });
await writeFile(target, text, "utf8");

const sha256 = createHash("sha256").update(text).digest("hex");
console.log(`Cloud backup saved: ${target.pathname}`);
console.log(`SHA-256: ${sha256}`);
