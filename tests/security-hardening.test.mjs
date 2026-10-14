import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (name) => readFile(new URL(`../${name}`, import.meta.url), "utf8");

test("cloud build excludes the private recovery snapshot", async () => {
  const build = await read("cloudflare/build.mjs");
  assert.doesNotMatch(build, /cp\([^\n]*recovery-state\.json/);
  assert.match(build, /business data and recovery snapshots excluded/);
});

test("local server requires Basic auth and serializes state writes", async () => {
  const server = await read("b3_server.py");
  assert.match(server, /PASSWORD_FILE = DATA_DIR \/ "local-server-password\.txt"/);
  assert.match(server, /hmac\.compare_digest\(username, "b3"\)/);
  assert.match(server, /WWW-Authenticate/);
  assert.match(server, /STATE_LOCK = threading\.RLock\(\)/);
  assert.match(server, /with STATE_LOCK:/);
  assert.match(server, /MAX_JSON_BYTES = 8 \* 1024 \* 1024/);
  assert.match(server, /self\.path == "\/api\/health"/);
});

test("cloud mutations reject oversized or non-JSON requests", async () => {
  const worker = await read("cloudflare/worker.js");
  assert.match(worker, /MAX_JSON_REQUEST_BYTES = 8 \* 1024 \* 1024/);
  assert.match(worker, /Content-Type must be application\/json/);
  assert.match(worker, /Request body is too large/);
});

test("staff passwords use salted PBKDF2 hashes with legacy migration", async () => {
  const app = await read("app.js");
  assert.match(app, /STAFF_PASSWORD_ITERATIONS = 210000/);
  assert.match(app, /name: "PBKDF2", hash: "SHA-256"/);
  assert.match(app, /crypto\.getRandomValues\(new Uint8Array\(16\)\)/);
  assert.match(app, /delete staff\.password/);
  assert.match(app, /migrateLegacyPassword/);
  assert.doesNotMatch(app, /staff\.password !== els\.loginPassword\.value/);
});

test("login cannot race the initial cloud sync or change staff during async verification", async () => {
  const app = await read("app.js");
  assert.match(app, /sharedSyncInitialSettled = !location\.protocol\.startsWith\("http"\)/);
  assert.match(app, /if \(location\.protocol\.startsWith\("http"\) && !sharedSyncInitialSettled\)/);
  assert.match(app, /const selectedStaffId = els\.loginStaff\.value/);
  assert.match(app, /state\.currentStaffId = selectedStaffId/);
});
