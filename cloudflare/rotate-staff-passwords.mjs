import { pbkdf2Sync, randomBytes } from "node:crypto";
import { readFile, rename, writeFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";

const ITERATIONS = 210000;
const cloudUrl = (process.env.B3_CLOUD_URL || "https://b3-floral-ebs.laomainelove.workers.dev").replace(/\/$/, "");
const cloudPassword = process.env.B3_APP_PASSWORD;
const [credentialsArgument, ...fileArguments] = process.argv.slice(2);

if (!cloudPassword) throw new Error("Set B3_APP_PASSWORD before rotating staff passwords.");
if (!credentialsArgument) {
  throw new Error("Usage: node cloudflare/rotate-staff-passwords.mjs <credentials-output.json> [local-state.json ...]");
}

const credentialsPath = resolve(credentialsArgument);
const localPaths = fileArguments.map((path) => resolve(path));
const authorization = `Basic ${Buffer.from(`b3:${cloudPassword}`).toString("base64")}`;

async function readCloudState() {
  const response = await fetch(`${cloudUrl}/api/state`, {
    cache: "no-store",
    headers: { Authorization: authorization },
  });
  if (!response.ok) throw new Error(`Cloud state read failed (${response.status}).`);
  return response.json();
}

function staffKey(staff) {
  return String(staff?.name || staff?.id || "").trim().toLocaleLowerCase("en-US");
}

function newPassword() {
  return randomBytes(18).toString("base64url");
}

function hashedCredentials(password) {
  const salt = randomBytes(16);
  return {
    passwordHash: pbkdf2Sync(password, salt, ITERATIONS, 32, "sha256").toString("base64"),
    passwordSalt: salt.toString("base64"),
    passwordIterations: ITERATIONS,
  };
}

function rotateState(state, credentialsByKey) {
  if (!Array.isArray(state?.staff)) return 0;
  let rotated = 0;
  state.staff = state.staff.map((staff) => {
    const credentials = credentialsByKey.get(staffKey(staff));
    if (!credentials) return staff;
    const updated = { ...staff, ...credentials.hash };
    delete updated.password;
    rotated += 1;
    return updated;
  });
  return rotated;
}

async function atomicJsonWrite(path, value) {
  const temporary = join(dirname(path), `.${basename(path)}.${process.pid}.tmp`);
  await writeFile(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  await rename(temporary, path);
}

const remote = await readCloudState();
const localRecords = [];
for (const path of localPaths) {
  try {
    localRecords.push({ path, record: JSON.parse(await readFile(path, "utf8")) });
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

const allStaff = [
  ...(remote?.state?.staff || []),
  ...localRecords.flatMap(({ record }) => (record?.state || record)?.staff || []),
];
const credentialsByKey = new Map();
let credentialsDocument;
try {
  credentialsDocument = JSON.parse(await readFile(credentialsPath, "utf8"));
  for (const staff of credentialsDocument.staff || []) {
    const key = staffKey(staff);
    if (key && staff.password) {
      credentialsByKey.set(key, { password: staff.password, hash: hashedCredentials(staff.password) });
    }
  }
} catch (error) {
  if (error?.code !== "ENOENT") throw error;
  credentialsDocument = {
    generatedAt: new Date().toISOString(),
    cloudUrl,
    note: "Private staff credentials. Distribute individually and delete this file after secure handoff.",
    staff: [],
  };
}

for (const staff of allStaff) {
  const key = staffKey(staff);
  if (!key || credentialsByKey.has(key)) continue;
  const password = newPassword();
  credentialsByKey.set(key, { password, hash: hashedCredentials(password) });
  credentialsDocument.staff.push({ id: staff.id || "", name: staff.name || "", password });
}
if (!credentialsByKey.size) throw new Error("No staff accounts were found to rotate.");
await atomicJsonWrite(credentialsPath, credentialsDocument);

let cloudRotated = false;
for (let attempt = 1; attempt <= 3 && !cloudRotated; attempt += 1) {
  const current = attempt === 1 ? remote : await readCloudState();
  rotateState(current.state, credentialsByKey);
  const response = await fetch(`${cloudUrl}/api/state/patch`, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      patch: { arrays: { staff: { upserts: current.state.staff, deletes: [] } }, values: {} },
      actor: { actorId: "security-rotation", actorName: "Security rotation" },
    }),
  });
  if (!response.ok) throw new Error(`Cloud password rotation failed (${response.status}): ${await response.text()}`);
  cloudRotated = true;
}
if (!cloudRotated) throw new Error("Cloud data kept changing; staff rotation could not acquire a current version after three attempts.");

for (const { path, record } of localRecords) {
  const state = record?.state || record;
  rotateState(state, credentialsByKey);
  if (record?.state) record.updatedAt = Math.max(Date.now(), Number(record.updatedAt || 0) + 1);
  await atomicJsonWrite(path, record);
}

console.log(`Rotated ${credentialsByKey.size} unique staff accounts in cloud and ${localRecords.length} local state files.`);
console.log(`Private credentials saved to ${credentialsPath}`);
