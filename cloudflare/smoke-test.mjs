const baseUrl = (process.env.B3_CLOUD_URL || "https://b3-floral-ebs.laomainelove.workers.dev").replace(/\/$/, "");
const password = process.env.B3_APP_PASSWORD;
if (!password) throw new Error("Set B3_APP_PASSWORD before running the cloud smoke test.");

const authorization = `Basic ${Buffer.from(`b3:${password}`).toString("base64")}`;
async function read(path) {
  const response = await fetch(`${baseUrl}${path}`, { cache: "no-store", headers: { Authorization: authorization } });
  if (!response.ok) throw new Error(`${path} returned ${response.status}.`);
  return response;
}

const health = await (await read("/api/health")).json();
if (!health.ok || health.service !== "b3-floral-ebs") throw new Error("Health response is invalid.");

const html = await (await read("/")).text();
if (html.includes('data-nav="girlfriend-day"')) throw new Error("Retired Girlfriend Day menu is still deployed.");
if (!html.includes("app.js?v=20261006-business-transfer")) throw new Error("Expected app asset version is not deployed.");
if (!html.includes('id="stockPhotoInput"')) throw new Error("Stock photo entry UI is not deployed.");

const page = await (await read(`/api/sync?since=0&pageSize=1&activeOnly=1&t=${Date.now()}`)).json();
for (const key of ["snapshotVersion", "entitiesHasMore", "valuesHasMore", "nextEntityOffset", "nextValueOffset"]) {
  if (!(key in page)) throw new Error(`Paginated sync response is missing ${key}.`);
}

console.log(`Cloud smoke test passed (${health.entities} entities, ${health.tombstones} tombstones).`);
