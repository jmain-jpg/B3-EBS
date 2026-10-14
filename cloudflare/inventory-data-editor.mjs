import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_CLOUD_URL = "https://b3-floral-ebs.laomainelove.workers.dev";
const EDITOR_FILENAME = "inventory-locations.csv";
const ORIGINAL_FILENAME = "original-cloud-state.json";
const PREVIEW_FILENAME = "inventory-preview.json";
const EDITED_FILENAME = "edited-cloud-state.json";

function csvCell(value) {
  const text = String(value ?? "");
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function encodeCsv(rows) {
  return `\uFEFF${rows.map((row) => row.map(csvCell).join(",")).join("\r\n")}\r\n`;
}

export function parseCsv(text) {
  const source = String(text || "").replace(/^\uFEFF/, "");
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        cell += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        cell += character;
      }
      continue;
    }
    if (character === '"') quoted = true;
    else if (character === ",") {
      row.push(cell);
      cell = "";
    } else if (character === "\n") {
      row.push(cell.replace(/\r$/, ""));
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
      cell = "";
    } else cell += character;
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted value.");
  if (cell || row.length) {
    row.push(cell.replace(/\r$/, ""));
    if (row.some((value) => value !== "")) rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((header) => header.trim());
  return rows.slice(1).map((values, rowIndex) => {
    const record = { __row: rowIndex + 2 };
    headers.forEach((header, index) => { record[header] = values[index] ?? ""; });
    return record;
  });
}

function inventoryValue(item) {
  return item?.inventoryLocation === "pending" ? "stock" : "shop";
}

export function normalizeInventoryTarget(value, fallback = "shop") {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized) return fallback;
  if (["stock", "stock inventory", "pending", "not arrived", "ဆိုင်ထဲမရောက်သေး"].includes(normalized)) return "stock";
  if (["shop", "shop inventory", "sale", "ဆိုင်အရောင်း", "ဆိုင်အရောင်း inventory"].includes(normalized)) return "shop";
  throw new Error(`Unknown targetInventory value: ${value}`);
}

function productKey(value) {
  return String(value || "").trim().toUpperCase();
}

export function inventoryEditorCsv(payload) {
  const stock = payload?.state?.stock;
  if (!Array.isArray(stock)) throw new Error("Cloud payload does not contain a stock array.");
  const rows = [[
    "productCode",
    "description",
    "category",
    "subCategory",
    "status",
    "quantityAvailable",
    "currentInventory",
    "targetInventory",
  ]];
  stock.forEach((item) => {
    const current = inventoryValue(item);
    rows.push([
      item.productCode || "",
      item.description || "",
      item.category || "",
      item.subCategory || "",
      item.status || "available",
      item.itemType === "sku" ? Number(item.quantityAvailable || 0) : item.status === "sold" ? 0 : 1,
      current,
      current,
    ]);
  });
  return encodeCsv(rows);
}

export function buildInventoryEdit(payload, csvText) {
  if (!payload?.state || !Array.isArray(payload.state.stock)) throw new Error("Original cloud state is invalid.");
  if (!Number.isFinite(Number(payload.updatedAt)) || Number(payload.updatedAt) <= 0) {
    throw new Error("Original cloud state has no valid version number; safe upload is not possible.");
  }
  const records = parseCsv(csvText);
  if (!records.length) throw new Error("Inventory editor CSV has no data rows.");
  const requiredHeaders = ["productCode", "currentInventory", "targetInventory"];
  requiredHeaders.forEach((header) => {
    if (!(header in records[0])) throw new Error(`Inventory editor CSV is missing ${header}.`);
  });

  const stockByCode = new Map();
  payload.state.stock.forEach((item) => {
    const key = productKey(item.productCode);
    if (!key) throw new Error("Cloud stock contains an item without a Product Code.");
    if (stockByCode.has(key)) throw new Error(`Cloud stock contains duplicate Product Code ${item.productCode}.`);
    stockByCode.set(key, item);
  });

  const targetByCode = new Map();
  records.forEach((record) => {
    const key = productKey(record.productCode);
    if (!key) throw new Error(`CSV row ${record.__row} has no Product Code.`);
    if (targetByCode.has(key)) throw new Error(`CSV contains duplicate Product Code ${record.productCode}.`);
    const stockItem = stockByCode.get(key);
    if (!stockItem) throw new Error(`CSV Product Code ${record.productCode} is not present in the cloud backup.`);
    const actualCurrent = inventoryValue(stockItem);
    const csvCurrent = normalizeInventoryTarget(record.currentInventory, actualCurrent);
    if (csvCurrent !== actualCurrent) {
      throw new Error(`CSV row ${record.__row} has stale currentInventory for ${record.productCode}.`);
    }
    targetByCode.set(key, normalizeInventoryTarget(record.targetInventory, actualCurrent));
  });

  const changes = [];
  const state = structuredClone(payload.state);
  state.stock = state.stock.map((item) => {
    const key = productKey(item.productCode);
    const before = inventoryValue(item);
    const after = targetByCode.get(key) || before;
    if (before === after) return item;
    changes.push({
      productCode: item.productCode,
      description: item.description || "",
      status: item.status || "available",
      from: before,
      to: after,
    });
    return {
      ...item,
      inventoryLocation: after === "stock" ? "pending" : "shop",
      updatedAt: new Date().toISOString(),
    };
  });

  const counts = state.stock.reduce((result, item) => {
    result[inventoryValue(item)] += 1;
    return result;
  }, { stock: 0, shop: 0 });
  return {
    editedPayload: { baseUpdatedAt: Number(payload.updatedAt || 0), state },
    preview: {
      baseUpdatedAt: Number(payload.updatedAt || 0),
      generatedAt: new Date().toISOString(),
      totalStockRecords: state.stock.length,
      changedRecords: changes.length,
      unchangedRecords: state.stock.length - changes.length,
      finalCounts: counts,
      changes,
    },
  };
}

function cloudSettings() {
  const baseUrl = (process.env.B3_CLOUD_URL || DEFAULT_CLOUD_URL).replace(/\/$/, "");
  const password = process.env.B3_APP_PASSWORD;
  if (!password) throw new Error("Set B3_APP_PASSWORD before accessing Cloudflare data.");
  return {
    baseUrl,
    headers: { Authorization: `Basic ${Buffer.from(`b3:${password}`).toString("base64")}` },
  };
}

async function fetchCloudState() {
  const { baseUrl, headers } = cloudSettings();
  const response = await fetch(`${baseUrl}/api/state?t=${Date.now()}`, { cache: "no-store", headers });
  if (!response.ok) throw new Error(`Cloud download failed (${response.status}).`);
  const payload = await response.json();
  if (!payload?.state || !Array.isArray(payload.state.stock)) throw new Error("Cloud response is missing inventory data.");
  return payload;
}

async function postCloudState(body) {
  const { baseUrl, headers } = cloudSettings();
  const response = await fetch(`${baseUrl}/api/state`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (response.status === 409) throw new Error("Cloud data changed after download. Download a fresh editor session before uploading.");
  if (!response.ok) throw new Error(`Cloud upload failed (${response.status}): ${(await response.text()).slice(0, 500)}`);
  return response.json();
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

async function resolveSession(input) {
  if (!input) throw new Error("Provide the editor session directory or inventory-locations.csv path.");
  const target = resolve(input);
  const details = await stat(target);
  const directory = details.isDirectory() ? target : dirname(target);
  const csvPath = details.isDirectory() ? join(target, EDITOR_FILENAME) : target;
  return { directory, csvPath, originalPath: join(directory, ORIGINAL_FILENAME) };
}

async function downloadCommand() {
  const payload = await fetchCloudState();
  const directory = resolve("backups", "cloud-inventory", timestamp());
  await mkdir(directory, { recursive: true });
  await writeFile(join(directory, ORIGINAL_FILENAME), `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  await writeFile(join(directory, EDITOR_FILENAME), inventoryEditorCsv(payload), "utf8");
  await writeFile(join(directory, "README.txt"), [
    "Edit only the targetInventory column in inventory-locations.csv.",
    "Allowed values: stock or shop.",
    "Do not change Product Codes or currentInventory.",
    "Run preview before upload.",
    "",
  ].join("\r\n"), "utf8");
  console.log(`Inventory editor downloaded: ${directory}`);
  console.log(`Edit: ${join(directory, EDITOR_FILENAME)}`);
}

async function previewCommand(input) {
  const session = await resolveSession(input);
  const [originalText, csvText] = await Promise.all([
    readFile(session.originalPath, "utf8"),
    readFile(session.csvPath, "utf8"),
  ]);
  const result = buildInventoryEdit(JSON.parse(originalText), csvText);
  await writeFile(join(session.directory, PREVIEW_FILENAME), `${JSON.stringify(result.preview, null, 2)}\n`, "utf8");
  await writeFile(join(session.directory, EDITED_FILENAME), `${JSON.stringify(result.editedPayload, null, 2)}\n`, "utf8");
  console.log(`Preview ready: ${join(session.directory, PREVIEW_FILENAME)}`);
  console.log(`Changed ${result.preview.changedRecords} of ${result.preview.totalStockRecords} records.`);
  console.log(`Final counts: Stock Inventory ${result.preview.finalCounts.stock}, Shop Inventory ${result.preview.finalCounts.shop}`);
}

async function uploadCommand(input, confirmation) {
  if (confirmation !== "--confirm=UPLOAD-INVENTORY") {
    throw new Error("Upload blocked. Add --confirm=UPLOAD-INVENTORY after reviewing inventory-preview.json.");
  }
  const session = await resolveSession(input);
  await previewCommand(input);
  const editedPayload = JSON.parse(await readFile(join(session.directory, EDITED_FILENAME), "utf8"));
  const preview = JSON.parse(await readFile(join(session.directory, PREVIEW_FILENAME), "utf8"));
  if (!preview.changedRecords) throw new Error("Upload blocked because the preview contains no inventory changes.");
  const latest = await fetchCloudState();
  if (Number(latest.updatedAt || 0) !== Number(editedPayload.baseUpdatedAt || 0)) {
    throw new Error("Cloud data changed after download. Download a fresh editor session before uploading.");
  }
  const response = await postCloudState(editedPayload);
  const verified = await fetchCloudState();
  const verifiedByCode = new Map(verified.state.stock.map((item) => [productKey(item.productCode), inventoryValue(item)]));
  const failed = preview.changes.filter((change) => verifiedByCode.get(productKey(change.productCode)) !== change.to);
  if (failed.length) throw new Error(`Upload verification failed for ${failed.map((item) => item.productCode).join(", ")}.`);
  const result = { uploadedAt: new Date().toISOString(), responseUpdatedAt: response.updatedAt, verifiedUpdatedAt: verified.updatedAt, changedRecords: preview.changedRecords };
  await writeFile(join(session.directory, "upload-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`Cloud inventory upload verified (${preview.changedRecords} records changed).`);
}

async function rollbackCommand(input, confirmation) {
  if (confirmation !== "--confirm=ROLLBACK-INVENTORY") {
    throw new Error("Rollback blocked. Add --confirm=ROLLBACK-INVENTORY to restore inventory locations from the session backup.");
  }
  const session = await resolveSession(input);
  const original = JSON.parse(await readFile(session.originalPath, "utf8"));
  const latest = await fetchCloudState();
  const originalLocations = new Map(original.state.stock.map((item) => [productKey(item.productCode), inventoryValue(item)]));
  const state = structuredClone(latest.state);
  let changedRecords = 0;
  state.stock = state.stock.map((item) => {
    const originalLocation = originalLocations.get(productKey(item.productCode));
    if (!originalLocation || originalLocation === inventoryValue(item)) return item;
    changedRecords += 1;
    return { ...item, inventoryLocation: originalLocation === "stock" ? "pending" : "shop", updatedAt: new Date().toISOString() };
  });
  if (!changedRecords) throw new Error("Rollback is not needed; cloud inventory locations already match the backup.");
  const response = await postCloudState({ baseUpdatedAt: Number(latest.updatedAt || 0), state });
  const verified = await fetchCloudState();
  const failed = verified.state.stock.filter((item) => {
    const originalLocation = originalLocations.get(productKey(item.productCode));
    return originalLocation && inventoryValue(item) !== originalLocation;
  });
  if (failed.length) throw new Error(`Rollback verification failed for ${failed.map((item) => item.productCode).join(", ")}.`);
  const result = {
    rolledBackAt: new Date().toISOString(),
    responseUpdatedAt: response.updatedAt,
    verifiedUpdatedAt: verified.updatedAt,
    changedRecords,
  };
  await writeFile(join(session.directory, "rollback-result.json"), `${JSON.stringify(result, null, 2)}\n`, "utf8");
  console.log(`Cloud inventory rollback completed (${changedRecords} records restored).`);
}

function usage() {
  console.log([
    "Cloud Inventory Data Editor",
    "",
    "  node cloudflare/inventory-data-editor.mjs download",
    "  node cloudflare/inventory-data-editor.mjs preview <session-directory-or-csv>",
    "  node cloudflare/inventory-data-editor.mjs upload <session-directory-or-csv> --confirm=UPLOAD-INVENTORY",
    "  node cloudflare/inventory-data-editor.mjs rollback <session-directory-or-csv> --confirm=ROLLBACK-INVENTORY",
  ].join("\n"));
}

async function main() {
  const [command, input, confirmation] = process.argv.slice(2);
  if (!command || ["help", "--help", "-h"].includes(command)) return usage();
  if (command === "download") return downloadCommand();
  if (command === "preview") return previewCommand(input);
  if (command === "upload") return uploadCommand(input, confirmation);
  if (command === "rollback") return rollbackCommand(input, confirmation);
  throw new Error(`Unknown command: ${command}`);
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;
if (isMain) main().catch((error) => {
  console.error(`Inventory editor failed: ${error.message}`);
  process.exitCode = 1;
});
