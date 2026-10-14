import { readFile } from "node:fs/promises";

const url = process.env.B3_CLOUD_URL;
const password = process.env.APP_PASSWORD;

if (!url || !password) {
  throw new Error("B3_CLOUD_URL and APP_PASSWORD are required");
}

const body = await readFile(new URL("../data/b3-state.json", import.meta.url));
const authorization = `Basic ${Buffer.from(`b3:${password}`).toString("base64")}`;
const response = await fetch(`${url.replace(/\/$/, "")}/api/state`, {
  method: "POST",
  headers: {
    Authorization: authorization,
    "Content-Type": "application/json",
  },
  body,
});

if (!response.ok) {
  throw new Error(`Upload failed (${response.status}): ${(await response.text()).slice(0, 1000)}`);
}

console.log(`Uploaded data successfully (${response.status}).`);
