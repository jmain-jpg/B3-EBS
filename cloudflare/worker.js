const STATE_ID = 1;
const SYNC_PAGE_SIZE_DEFAULT = 2000;
const SYNC_PAGE_SIZE_MAX = 5000;
const NOTION_API_VERSION = "2026-03-11";
const NOTION_TEXT_LIMIT = 1900;
const CLOUD_APP_URL = "https://b3-floral-ebs.laomainelove.workers.dev";
const MAX_STOCK_PHOTO_BYTES = 750 * 1024;
const MAX_JSON_REQUEST_BYTES = 8 * 1024 * 1024;

function logWorkerEvent(level, event, details = {}) {
  const entry = JSON.stringify({ event, timestamp: new Date().toISOString(), ...details });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.log(entry);
}

function unauthorized() {
  return new Response("B3 Floral EBS - password required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="B3 Floral EBS", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function timingSafeEqual(left, right) {
  const encoder = new TextEncoder();
  const a = encoder.encode(left);
  const b = encoder.encode(right);
  let difference = a.length ^ b.length;
  const length = Math.max(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (a[index % a.length] || 0) ^ (b[index % b.length] || 0);
  }
  return difference === 0;
}

function isAuthorized(request, env) {
  const requestHost = new URL(request.url).hostname;
  if (env.DEV_AUTH_BYPASS === "true" && (requestHost === "127.0.0.1" || requestHost === "localhost")) return true;
  if (!env.APP_PASSWORD) return false;
  const header = request.headers.get("Authorization") || "";
  if (!header.startsWith("Basic ")) return false;
  try {
    const decoded = atob(header.slice(6));
    const separator = decoded.indexOf(":");
    const username = separator >= 0 ? decoded.slice(0, separator) : "";
    const password = separator >= 0 ? decoded.slice(separator + 1) : "";
    return timingSafeEqual(username, "b3") && timingSafeEqual(password, env.APP_PASSWORD);
  } catch {
    return false;
  }
}

function json(payload, status = 200) {
  return Response.json(payload, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function readState(env) {
  const row = await env.DB.prepare(
    "SELECT updated_at AS updatedAt, data FROM app_state WHERE id = ?1"
  ).bind(STATE_ID).first();
  if (!row) return { updatedAt: 0, state: {} };
  try {
    return { updatedAt: Number(row.updatedAt || 0), state: JSON.parse(row.data || "{}") };
  } catch {
    return { updatedAt: Number(row.updatedAt || 0), state: {} };
  }
}

async function writeState(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const state = payload?.state ?? payload;
  const baseUpdatedAt = Number(payload?.baseUpdatedAt ?? 0);
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return json({ error: "State must be an object" }, 400);
  }
  if (!Number.isFinite(baseUpdatedAt) || baseUpdatedAt < 0) {
    return json({ error: "Invalid base version" }, 400);
  }

  const current = await readEntityState(env);
  if (baseUpdatedAt > 0 && baseUpdatedAt !== current.updatedAt) return json(current, 409);
  try {
    const result = await writeEntityPatchData(buildStatePatch(current.state, state), env);
    return json({ updatedAt: result.cursor, state });
  } catch (error) {
    return json({ error: error?.message || "Shared data save failed" }, 500);
  }
}

function buildStatePatch(baseState, nextState) {
  const base = baseState || {};
  const next = nextState || {};
  const patch = { arrays: {}, values: {} };
  const keys = new Set([...Object.keys(base), ...Object.keys(next)]);
  keys.forEach((key) => {
    if (Array.isArray(base[key]) || Array.isArray(next[key])) {
      const baseItems = Array.isArray(base[key]) ? base[key] : [];
      const nextItems = Array.isArray(next[key]) ? next[key] : [];
      const baseMap = new Map(baseItems.map((item) => [patchEntityKey(item, key), item]));
      const nextMap = new Map(nextItems.map((item) => [patchEntityKey(item, key), item]));
      const upserts = [...nextMap].filter(([itemKey, item]) => itemKey && JSON.stringify(item) !== JSON.stringify(baseMap.get(itemKey))).map(([, item]) => item);
      const deletes = [...baseMap.keys()].filter((itemKey) => itemKey && !nextMap.has(itemKey));
      if (upserts.length || deletes.length) patch.arrays[key] = { upserts, deletes };
      return;
    }
    if (JSON.stringify(base[key]) !== JSON.stringify(next[key])) patch.values[key] = next[key] ?? null;
  });
  return patch;
}

function patchEntityKey(item, arrayName = "") {
  if (!item || typeof item !== "object") return "";
  if (arrayName === "stock") return String(item.productCode || item.id || "");
  return String(item.id || item.name || item.productCode || "");
}

function applyStatePatch(remoteState, patch) {
  const nextState = JSON.parse(JSON.stringify(remoteState || {}));
  const values = patch?.values && typeof patch.values === "object" ? patch.values : {};
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined) delete nextState[key];
    else nextState[key] = value;
  });

  const arrays = patch?.arrays && typeof patch.arrays === "object" ? patch.arrays : {};
  Object.entries(arrays).forEach(([key, change]) => {
    const remoteItems = Array.isArray(nextState[key]) ? nextState[key] : [];
    const upserts = Array.isArray(change?.upserts) ? change.upserts.filter((item) => patchEntityKey(item, key)) : [];
    const deletes = new Set(Array.isArray(change?.deletes) ? change.deletes.map(String) : []);
    const remoteKeys = new Set(remoteItems.map((item) => patchEntityKey(item, key)));
    const upsertMap = new Map(upserts.map((item) => [patchEntityKey(item, key), item]));
    const addedItems = [...upsertMap].filter(([itemKey]) => !remoteKeys.has(itemKey) && !deletes.has(itemKey)).map(([, item]) => item);
    const existingItems = remoteItems
      .filter((item) => !deletes.has(patchEntityKey(item, key)))
      .map((item) => upsertMap.get(patchEntityKey(item, key)) || item);
    nextState[key] = [...addedItems, ...existingItems];
  });
  return nextState;
}

async function patchState(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const patch = payload?.patch;
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return json({ error: "Patch must be an object" }, 400);
  }

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const current = await readState(env);
    const nextState = applyStatePatch(current.state, patch);
    if (JSON.stringify(nextState) === JSON.stringify(current.state)) return json({ updatedAt: current.updatedAt, applied: false });
    const updatedAt = Math.max(Date.now(), Number(current.updatedAt || 0) + 1);
    const result = await env.DB.prepare(
      "UPDATE app_state SET updated_at = ?1, data = ?2 WHERE id = ?3 AND updated_at = ?4"
    ).bind(updatedAt, JSON.stringify(nextState), STATE_ID, current.updatedAt).run();
    if (Number(result.meta?.changes || 0) > 0) return json({ updatedAt, applied: true });
  }
  return json({ error: "Concurrent update; retry" }, 409);
}

async function nextSyncVersion(env) {
  const proposed = Date.now();
  const row = await env.DB.prepare(
    `INSERT INTO sync_meta (id, version) VALUES (1, ?1)
     ON CONFLICT(id) DO UPDATE SET version = MAX(sync_meta.version + 1, excluded.version)
     RETURNING version`
  ).bind(proposed).first();
  return Number(row?.version || proposed);
}

async function currentSyncVersion(env) {
  const row = await env.DB.prepare("SELECT version FROM sync_meta WHERE id = 1").first();
  return Number(row?.version || 0);
}

async function currentDataVersion(env) {
  const row = await env.DB.prepare(
    `SELECT MAX(
       COALESCE((SELECT MAX(updated_at) FROM app_entities), 0),
       COALESCE((SELECT MAX(updated_at) FROM app_values), 0)
     ) AS version`
  ).first();
  return Number(row?.version || 0);
}

function parseStoredJson(value, fallback = null) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function readEntityState(env) {
  const [entityResult, valueResult, version] = await Promise.all([
    env.DB.prepare(
      `SELECT section, entity_key AS entityKey, sort_order AS sortOrder,
              updated_at AS updatedAt, data
       FROM app_entities
       WHERE deleted = 0
       ORDER BY section, sort_order, updated_at DESC`
    ).all(),
    env.DB.prepare(
      `SELECT key, updated_at AS updatedAt, data
       FROM app_values
       WHERE deleted = 0
       ORDER BY key`
    ).all(),
    currentDataVersion(env),
  ]);
  const state = {};
  for (const row of entityResult.results || []) {
    if (!state[row.section]) state[row.section] = [];
    const item = parseStoredJson(row.data);
    if (item && typeof item === "object") state[row.section].push(item);
  }
  for (const row of valueResult.results || []) {
    state[row.key] = parseStoredJson(row.data);
  }
  return { updatedAt: version, state };
}

async function readSyncChanges(request, env) {
  const url = new URL(request.url);
  const since = Number(url.searchParams.get("since") || 0);
  if (!Number.isFinite(since) || since < 0) return json({ error: "Invalid sync cursor" }, 400);
  const requestedUntil = Number(url.searchParams.get("until") || 0);
  const requestedPageSize = Number(url.searchParams.get("pageSize") || SYNC_PAGE_SIZE_DEFAULT);
  const entityOffset = Number(url.searchParams.get("entityOffset") || 0);
  const valueOffset = Number(url.searchParams.get("valueOffset") || 0);
  const includeEntities = url.searchParams.get("includeEntities") !== "0";
  const includeValues = url.searchParams.get("includeValues") !== "0";
  const activeOnly = url.searchParams.get("activeOnly") === "1";
  if (![requestedUntil, requestedPageSize, entityOffset, valueOffset].every(Number.isFinite) || requestedUntil < 0 || requestedPageSize < 1 || entityOffset < 0 || valueOffset < 0) {
    return json({ error: "Invalid sync pagination" }, 400);
  }
  const pageSize = Math.min(SYNC_PAGE_SIZE_MAX, Math.floor(requestedPageSize));
  const snapshotVersion = requestedUntil > 0 ? requestedUntil : await currentDataVersion(env);
  const entityWhere = activeOnly
    ? "updated_at > ?1 AND updated_at <= ?2 AND deleted = 0"
    : "updated_at > ?1 AND updated_at <= ?2";
  const valueWhere = activeOnly
    ? "updated_at > ?1 AND updated_at <= ?2 AND deleted = 0"
    : "updated_at > ?1 AND updated_at <= ?2";

  const [entityResult, valueResult] = await Promise.all([
    includeEntities ? env.DB.prepare(
      `SELECT section, entity_key AS entityKey, sort_order AS sortOrder,
              updated_at AS updatedAt, deleted, data
       FROM app_entities
       WHERE ${entityWhere}
       ORDER BY updated_at, section, sort_order, entity_key
       LIMIT ?3 OFFSET ?4`
    ).bind(since, snapshotVersion, pageSize + 1, Math.floor(entityOffset)).all() : Promise.resolve({ results: [] }),
    includeValues ? env.DB.prepare(
      `SELECT key, updated_at AS updatedAt, deleted, data
       FROM app_values
       WHERE ${valueWhere}
       ORDER BY updated_at, key
       LIMIT ?3 OFFSET ?4`
    ).bind(since, snapshotVersion, pageSize + 1, Math.floor(valueOffset)).all() : Promise.resolve({ results: [] }),
  ]);

  const entityRows = entityResult.results || [];
  const valueRows = valueResult.results || [];
  const entitiesHasMore = includeEntities && entityRows.length > pageSize;
  const valuesHasMore = includeValues && valueRows.length > pageSize;
  const entities = entityRows.slice(0, pageSize).map((row) => {
    return {
      section: row.section,
      entityKey: String(row.entityKey),
      sortOrder: Number(row.sortOrder || 0),
      updatedAt: Number(row.updatedAt || 0),
      deleted: Boolean(row.deleted),
      data: row.deleted ? null : parseStoredJson(row.data),
    };
  });
  const values = valueRows.slice(0, pageSize).map((row) => {
    return {
      key: row.key,
      updatedAt: Number(row.updatedAt || 0),
      deleted: Boolean(row.deleted),
      data: row.deleted ? null : parseStoredJson(row.data),
    };
  });
  return json({
    cursor: snapshotVersion,
    snapshotVersion,
    entities,
    values,
    entitiesHasMore,
    valuesHasMore,
    nextEntityOffset: Math.floor(entityOffset) + entities.length,
    nextValueOffset: Math.floor(valueOffset) + values.length,
    hasMore: entitiesHasMore || valuesHasMore,
  });
}

async function runStatementsInChunks(env, statements, chunkSize = 40) {
  for (let index = 0; index < statements.length; index += chunkSize) {
    await env.DB.batch(statements.slice(index, index + chunkSize));
  }
}

async function writeEntityPatchData(patch, env, audit = {}) {
  const arrays = patch?.arrays && typeof patch.arrays === "object" && !Array.isArray(patch.arrays) ? patch.arrays : {};
  const values = patch?.values && typeof patch.values === "object" && !Array.isArray(patch.values) ? patch.values : {};
  const changeCount = Object.values(arrays).reduce(
    (sum, change) => sum + (Array.isArray(change?.upserts) ? change.upserts.length : 0) + (Array.isArray(change?.deletes) ? change.deletes.length : 0),
    0
  ) + Object.keys(values).length;
  if (!changeCount) return { cursor: await currentDataVersion(env), applied: 0 };
  if (changeCount > 5000) throw new Error("Too many changes in one sync request");

  const version = await nextSyncVersion(env);
  const statements = [];
  Object.entries(arrays).forEach(([section, change]) => {
    const upserts = Array.isArray(change?.upserts) ? change.upserts : [];
    const deletes = Array.isArray(change?.deletes) ? change.deletes : [];
    upserts.forEach((item, sortOrder) => {
      const entityKey = patchEntityKey(item, section);
      if (!entityKey || !item || typeof item !== "object") return;
      statements.push(env.DB.prepare(
        `INSERT INTO app_entities (section, entity_key, sort_order, updated_at, deleted, data)
         VALUES (?1, ?2, ?3, ?4, 0, ?5)
         ON CONFLICT(section, entity_key) DO UPDATE SET
           sort_order = excluded.sort_order,
           updated_at = excluded.updated_at,
           deleted = 0,
           data = excluded.data
         WHERE app_entities.updated_at <= excluded.updated_at`
      ).bind(section, entityKey, sortOrder, version, JSON.stringify(item)));
    });
    deletes.forEach((entityKey) => {
      if (!entityKey) return;
      statements.push(env.DB.prepare(
        `INSERT INTO app_entities (section, entity_key, sort_order, updated_at, deleted, data)
         VALUES (?1, ?2, 0, ?3, 1, NULL)
         ON CONFLICT(section, entity_key) DO UPDATE SET
           updated_at = excluded.updated_at,
           deleted = 1,
           data = NULL
         WHERE app_entities.updated_at <= excluded.updated_at`
      ).bind(section, String(entityKey), version));
    });
  });

  Object.entries(values).forEach(([key, value]) => {
    const deleted = value === null;
    statements.push(env.DB.prepare(
      `INSERT INTO app_values (key, updated_at, deleted, data)
       VALUES (?1, ?2, ?3, ?4)
       ON CONFLICT(key) DO UPDATE SET
         updated_at = excluded.updated_at,
         deleted = excluded.deleted,
         data = excluded.data
       WHERE app_values.updated_at <= excluded.updated_at`
    ).bind(key, version, deleted ? 1 : 0, deleted ? null : JSON.stringify(value)));
  });

  await runStatementsInChunks(env, statements);
  logWorkerEvent("info", "sync_write", {
    version,
    applied: statements.length,
    sections: [...new Set([...Object.keys(arrays), ...Object.keys(values)])],
    actorId: String(audit.actorId || "").slice(0, 120),
    actorName: String(audit.actorName || "").slice(0, 120),
  });
  return { cursor: version, applied: statements.length };
}

async function writeSyncChanges(request, env) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const patch = payload?.patch;
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return json({ error: "Patch must be an object" }, 400);
  }
  try {
    return json(await writeEntityPatchData(patch, env, payload?.actor || {}));
  } catch (error) {
    logWorkerEvent("error", "sync_write_failed", { message: error?.message || "Sync write failed" });
    return json({ error: error?.message || "Sync write failed" }, 500);
  }
}

async function readHealth(env) {
  const [entityCounts, valueCounts, version] = await Promise.all([
    env.DB.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN deleted = 1 THEN 1 ELSE 0 END) AS tombstones FROM app_entities").first(),
    env.DB.prepare("SELECT COUNT(*) AS total, SUM(CASE WHEN deleted = 1 THEN 1 ELSE 0 END) AS tombstones FROM app_values").first(),
    currentDataVersion(env),
  ]);
  return {
    ok: true,
    service: "b3-floral-ebs",
    version,
    entities: Number(entityCounts?.total || 0),
    tombstones: Number(entityCounts?.tombstones || 0) + Number(valueCounts?.tombstones || 0),
    checkedAt: new Date().toISOString(),
  };
}

function stockPhotoBinding(env) {
  if (!env.STOCK_PHOTOS) throw new Error("Stock photo storage is not configured");
  return env.STOCK_PHOTOS;
}

function validStockPhoto(bytes, contentType) {
  if (contentType === "image/jpeg") return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (contentType === "image/webp") {
    return String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  }
  return false;
}

function safePhotoSegment(value, fallback) {
  return String(value || fallback).replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100) || fallback;
}

async function stockPhotoResponse(request, env) {
  const url = new URL(request.url);
  const bucket = stockPhotoBinding(env);

  if (request.method === "POST") {
    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > MAX_STOCK_PHOTO_BYTES) return json({ error: "Compressed photo must be 750 KB or smaller" }, 413);
    const contentType = String(request.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase();
    if (!["image/jpeg", "image/webp"].includes(contentType)) return json({ error: "Only JPEG or WebP photos are accepted" }, 415);
    const body = await request.arrayBuffer();
    if (!body.byteLength || body.byteLength > MAX_STOCK_PHOTO_BYTES) return json({ error: "Compressed photo must be 750 KB or smaller" }, 413);
    const signature = new Uint8Array(body.slice(0, 16));
    if (!validStockPhoto(signature, contentType)) return json({ error: "Invalid photo file" }, 400);

    const stockId = safePhotoSegment(request.headers.get("X-Stock-Id"), "stock");
    const productCode = safePhotoSegment(request.headers.get("X-Product-Code"), "photo");
    const extension = contentType === "image/webp" ? "webp" : "jpg";
    const now = new Date();
    const key = `stock/${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, "0")}/${stockId}/${productCode}-${crypto.randomUUID()}.${extension}`;
    const width = Math.max(0, Number(request.headers.get("X-Photo-Width") || 0));
    const height = Math.max(0, Number(request.headers.get("X-Photo-Height") || 0));
    await bucket.put(key, body, {
      httpMetadata: { contentType },
      customMetadata: {
        stockId,
        productCode,
        width: String(width),
        height: String(height),
        uploadedAt: now.toISOString(),
      },
    });
    logWorkerEvent("info", "stock_photo_uploaded", { key, stockId, productCode, size: body.byteLength });
    return json({
      photo: { key, contentType, width, height, size: body.byteLength, uploadedAt: now.toISOString() },
    }, 201);
  }

  const key = String(url.searchParams.get("key") || "");

  if (request.method === "GET" || request.method === "HEAD") {
    if (!key.startsWith("stock/") || key.includes("..")) return json({ error: "Invalid stock photo key" }, 400);
    const object = request.method === "HEAD" ? await bucket.head(key) : await bucket.get(key);
    if (!object) return json({ error: "Photo not found" }, 404);
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("ETag", object.httpEtag);
    headers.set("Cache-Control", "private, max-age=86400, immutable");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(request.method === "HEAD" ? null : object.body, { headers });
  }

  if (request.method === "DELETE") {
    let payload = {};
    try {
      payload = await request.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const deleteKey = String(payload?.key || "");
    if (!deleteKey.startsWith("stock/") || deleteKey.includes("..")) return json({ error: "Invalid stock photo key" }, 400);
    await bucket.delete(deleteKey);
    logWorkerEvent("info", "stock_photo_deleted", { key: deleteKey });
    return json({ ok: true });
  }

  return json({ error: "Method not allowed" }, 405);
}

function notionText(value, limit = NOTION_TEXT_LIMIT) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, limit);
}

function notionDashboardDate() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function notionDashboardTimestamp() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Yangon",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function notionMoney(value) {
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Number(value || 0))} MMK`;
}

function notionRichText(value) {
  const content = notionText(value);
  return content ? [{ type: "text", text: { content } }] : [];
}

function notionStatusForProduction(status) {
  if (status === "done") return "Done";
  if (status === "accepted" || status === "making") return "Working";
  return "Ordered";
}

function notionProductionKey(order) {
  return `${CLOUD_APP_URL}/?productionOrder=${encodeURIComponent(String(order?.id || ""))}`;
}

function notionProductionItems(order) {
  const itemText = (Array.isArray(order?.items) ? order.items : [])
    .map((item) => {
      const code = notionText(item?.productCode || "Manual", 120);
      const description = notionText(item?.description || "", 500);
      const quantity = Math.max(1, Number(item?.quantity || 1));
      return `${code}${description ? ` - ${description}` : ""} x ${quantity}`;
    })
    .join(" | ");
  const requirement = notionText(order?.requirement || "", 700);
  return notionText([itemText, requirement].filter(Boolean).join(" • "));
}

function notionPropertyValue(type, value) {
  const text = notionText(value);
  if (type === "title") return { title: notionRichText(text) };
  if (type === "rich_text") return { rich_text: notionRichText(text) };
  if (type === "url") return { url: text || null };
  if (type === "date") return { date: /^\d{4}-\d{2}-\d{2}$/.test(text) ? { start: text } : null };
  if (type === "select") return { select: text ? { name: text } : null };
  if (type === "status") return { status: text ? { name: text } : null };
  return null;
}

function notionProductionProperties(order, schema) {
  const values = {
    Name: order?.voucherNumber || `Production ${order?.id || "Order"}`,
    Status: notionStatusForProduction(order?.status),
    "Voucher No.": order?.voucherNumber || "",
    "Due Date": order?.fulfillmentDate || order?.orderDate || order?.saleDate || "",
    Priority: order?.urgency || "",
    "Assigned Florist": order?.assignedFlorist || order?.florist || order?.salePerson || order?.createdBy || "",
    Items: notionProductionItems(order),
    "Cloud Link": notionProductionKey(order),
  };
  return Object.fromEntries(
    Object.entries(values)
      .map(([name, value]) => [name, notionPropertyValue(schema?.[name]?.type, value)])
      .filter(([, value]) => value)
  );
}

function notionPlainProperty(property) {
  if (!property) return "";
  if (property.type === "title") return (property.title || []).map((item) => item.plain_text || item.text?.content || "").join("");
  if (property.type === "rich_text") return (property.rich_text || []).map((item) => item.plain_text || item.text?.content || "").join("");
  if (property.type === "url") return property.url || "";
  if (property.type === "date") return property.date?.start || "";
  if (property.type === "select") return property.select?.name || "";
  if (property.type === "status") return property.status?.name || "";
  return "";
}

function notionDesiredPlain(value) {
  if (value.title) return (value.title || []).map((item) => item.text?.content || "").join("");
  if (value.rich_text) return (value.rich_text || []).map((item) => item.text?.content || "").join("");
  if (Object.hasOwn(value, "url")) return value.url || "";
  if (Object.hasOwn(value, "date")) return value.date?.start || "";
  if (Object.hasOwn(value, "select")) return value.select?.name || "";
  if (Object.hasOwn(value, "status")) return value.status?.name || "";
  return "";
}

function notionPageMatches(page, desiredProperties) {
  return Object.entries(desiredProperties).every(
    ([name, value]) => notionPlainProperty(page?.properties?.[name]) === notionDesiredPlain(value)
  );
}

async function notionFetch(env, path, init = {}) {
  if (!env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not configured");
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env.NOTION_TOKEN}`,
      "Notion-Version": NOTION_API_VERSION,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Notion ${response.status}: ${payload?.message || "Request failed"}`);
  }
  return payload;
}

async function notionProductionDataSource(env) {
  if (!env.NOTION_PRODUCTION_DATABASE_ID) throw new Error("NOTION_PRODUCTION_DATABASE_ID is not configured");
  const database = await notionFetch(env, `/databases/${env.NOTION_PRODUCTION_DATABASE_ID}`);
  const dataSourceId = database?.data_sources?.[0]?.id;
  if (!dataSourceId) throw new Error("Production Board data source was not found");
  return notionFetch(env, `/data_sources/${dataSourceId}`);
}

async function queryAllNotionPages(env, dataSourceId) {
  const pages = [];
  let startCursor;
  do {
    const payload = await notionFetch(env, `/data_sources/${dataSourceId}/query`, {
      method: "POST",
      body: JSON.stringify({ page_size: 100, ...(startCursor ? { start_cursor: startCursor } : {}) }),
    });
    pages.push(...(payload.results || []));
    startCursor = payload.has_more ? payload.next_cursor : null;
  } while (startCursor);
  return pages;
}

async function queryAllNotionBlocks(env, blockId) {
  const blocks = [];
  let startCursor;
  do {
    const query = new URLSearchParams({ page_size: "100" });
    if (startCursor) query.set("start_cursor", startCursor);
    const payload = await notionFetch(env, `/blocks/${blockId}/children?${query}`);
    blocks.push(...(payload.results || []));
    startCursor = payload.has_more ? payload.next_cursor : null;
  } while (startCursor);
  return blocks;
}

function notionBlockText(block) {
  const richText = block?.[block?.type]?.rich_text || [];
  return richText.map((item) => item.plain_text || item.text?.content || "").join("");
}

function notionDashboardMetrics(state) {
  const today = notionDashboardDate();
  const month = today.slice(0, 7);
  const sales = Array.isArray(state?.sales) ? state.sales : [];
  const expenses = Array.isArray(state?.expenses) ? state.expenses : [];
  const stock = Array.isArray(state?.stock) ? state.stock : [];
  const productionOrders = Array.isArray(state?.productionOrders) ? state.productionOrders : [];
  const payments = sales.flatMap((sale) => Array.isArray(sale?.payments) ? sale.payments : []);
  const paidForSale = (sale) => (Array.isArray(sale?.payments) ? sale.payments : [])
    .reduce((sum, payment) => sum + Number(payment?.amount || 0), 0);
  const production = productionOrders.reduce((counts, order) => {
    const status = notionStatusForProduction(order?.status);
    counts[status] += 1;
    return counts;
  }, { Ordered: 0, Working: 0, Done: 0 });
  const todaySales = sales.filter((sale) => sale?.saleDate === today);
  const monthSales = sales.filter((sale) => String(sale?.saleDate || "").slice(0, 7) === month);
  const todayExpenses = expenses.filter((expense) => expense?.expenseDate === today);
  const monthExpenses = expenses.filter((expense) => String(expense?.expenseDate || "").slice(0, 7) === month);
  const shopUnits = stock
    .filter((item) => (item?.inventoryLocation || "shop") === "shop")
    .reduce((sum, item) => sum + (item?.itemType === "sku"
      ? Math.max(0, Number(item?.quantityAvailable || 0))
      : item?.status === "available" ? 1 : 0), 0);
  const fulfillmentDue = sales.filter((sale) => {
    const dueDate = sale?.fulfillmentDate || sale?.saleDate;
    return dueDate === today && !["delivered", "picked-up", "picked_up", "done"].includes(String(sale?.fulfillmentStatus || "").toLowerCase());
  }).length;
  return {
    today,
    month,
    todaySales: todaySales.reduce((sum, sale) => sum + Number(sale?.totalPrice || 0), 0),
    todayReceived: payments.filter((payment) => payment?.paymentDate === today)
      .reduce((sum, payment) => sum + Number(payment?.amount || 0), 0),
    todayExpenses: todayExpenses.reduce((sum, expense) => sum + Number(expense?.amount || 0), 0),
    monthSales: monthSales.reduce((sum, sale) => sum + Number(sale?.totalPrice || 0), 0),
    monthExpenses: monthExpenses.reduce((sum, expense) => sum + Number(expense?.amount || 0), 0),
    receivables: sales.reduce((sum, sale) => sum + Math.max(0, Number(sale?.totalPrice || 0) - paidForSale(sale)), 0),
    shopUnits,
    fulfillmentDue,
    production,
  };
}

function notionParagraph(content, annotations = {}) {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: [{ type: "text", text: { content: notionText(content) }, annotations }] },
  };
}

function notionHeading(content, level = 2) {
  const type = `heading_${level}`;
  return {
    object: "block",
    type,
    [type]: { rich_text: [{ type: "text", text: { content: notionText(content) } }] },
  };
}

function notionDashboardBlocks(metrics) {
  return [{
    object: "block",
    type: "toggle",
    toggle: {
      rich_text: [{ type: "text", text: { content: `[Cloud Dashboard] Updated ${notionDashboardTimestamp()}` }, annotations: { bold: true } }],
      children: [
        notionHeading(`Today • ${metrics.today}`, 2),
        notionParagraph(`Sales: ${notionMoney(metrics.todaySales)}    |    Received: ${notionMoney(metrics.todayReceived)}`, { bold: true }),
        notionParagraph(`Expenses: ${notionMoney(metrics.todayExpenses)}    |    Pickup / Delivery Due: ${metrics.fulfillmentDue}`),
        { object: "block", type: "divider", divider: {} },
        notionHeading(`This Month • ${metrics.month}`, 2),
        notionParagraph(`Sales: ${notionMoney(metrics.monthSales)}    |    Expenses: ${notionMoney(metrics.monthExpenses)}`, { bold: true }),
        notionParagraph(`Outstanding Receivables: ${notionMoney(metrics.receivables)}    |    Shop Stock Units: ${metrics.shopUnits}`),
        { object: "block", type: "divider", divider: {} },
        notionHeading("Production Workflow", 2),
        notionParagraph(`Ordered: ${metrics.production.Ordered}    |    Working: ${metrics.production.Working}    |    Done: ${metrics.production.Done}`, { bold: true }),
        notionParagraph("Source: B3 Floral EBS Cloud • Automatically refreshed every 15 minutes."),
      ],
    },
  }];
}

async function syncOwnerDashboardToNotion(env) {
  if (!env.NOTION_TOKEN || !env.NOTION_OWNER_DASHBOARD_PAGE_ID) {
    return { ok: false, skipped: true, reason: "Owner Dashboard is not configured" };
  }
  const [{ state }, blocks] = await Promise.all([
    readEntityState(env),
    queryAllNotionBlocks(env, env.NOTION_OWNER_DASHBOARD_PAGE_ID),
  ]);
  const managedBlocks = blocks.filter((block) => notionBlockText(block).startsWith("[Cloud Dashboard]"));
  for (const block of managedBlocks) {
    await notionFetch(env, `/blocks/${block.id}`, { method: "PATCH", body: JSON.stringify({ archived: true }) });
  }
  const metrics = notionDashboardMetrics(state);
  await notionFetch(env, `/blocks/${env.NOTION_OWNER_DASHBOARD_PAGE_ID}/children`, {
    method: "PATCH",
    body: JSON.stringify({ children: notionDashboardBlocks(metrics) }),
  });
  const summary = { ok: true, replaced: managedBlocks.length, metrics };
  logWorkerEvent("info", "notion_owner_dashboard_sync", {
    replaced: managedBlocks.length,
    productionTotal: metrics.production.Ordered + metrics.production.Working + metrics.production.Done,
  });
  return summary;
}

async function syncNotionOperations(env) {
  const [production, dashboard] = await Promise.allSettled([
    syncProductionToNotion(env),
    syncOwnerDashboardToNotion(env),
  ]);
  const result = {
    ok: production.status === "fulfilled" && production.value?.ok !== false && dashboard.status === "fulfilled" && dashboard.value?.ok !== false,
    production: production.status === "fulfilled" ? production.value : { ok: false, error: production.reason?.message || "Production sync failed" },
    dashboard: dashboard.status === "fulfilled" ? dashboard.value : { ok: false, error: dashboard.reason?.message || "Dashboard sync failed" },
  };
  return result;
}

async function syncProductionToNotion(env) {
  if (!env.NOTION_TOKEN || !env.NOTION_PRODUCTION_DATABASE_ID) {
    return { ok: false, skipped: true, reason: "Notion is not configured" };
  }
  const [{ state }, dataSource] = await Promise.all([readEntityState(env), notionProductionDataSource(env)]);
  const orders = Array.isArray(state.productionOrders) ? state.productionOrders : [];
  const pages = await queryAllNotionPages(env, dataSource.id);
  const pageByCloudLink = new Map(
    pages.map((page) => [notionPlainProperty(page?.properties?.["Cloud Link"]), page]).filter(([key]) => key)
  );
  const summary = { ok: true, total: orders.length, created: 0, updated: 0, unchanged: 0, errors: [] };

  for (const order of orders) {
    try {
      const properties = notionProductionProperties(order, dataSource.properties || {});
      const existing = pageByCloudLink.get(notionProductionKey(order));
      if (!existing) {
        await notionFetch(env, "/pages", {
          method: "POST",
          body: JSON.stringify({ parent: { type: "data_source_id", data_source_id: dataSource.id }, properties }),
        });
        summary.created += 1;
      } else if (notionPageMatches(existing, properties)) {
        summary.unchanged += 1;
      } else {
        await notionFetch(env, `/pages/${existing.id}`, {
          method: "PATCH",
          body: JSON.stringify({ properties }),
        });
        summary.updated += 1;
      }
    } catch (error) {
      summary.errors.push({ id: String(order?.id || ""), message: error?.message || "Notion sync failed" });
    }
  }
  summary.ok = summary.errors.length === 0;
  logWorkerEvent(summary.ok ? "info" : "warn", "notion_production_sync", {
    total: summary.total,
    created: summary.created,
    updated: summary.updated,
    unchanged: summary.unchanged,
    errorCount: summary.errors.length,
  });
  return summary;
}

export default {
  async fetch(request, env, ctx) {
    if (!isAuthorized(request, env)) return unauthorized();

    const url = new URL(request.url);
    if (["POST", "PUT", "PATCH", "DELETE"].includes(request.method) && url.pathname !== "/api/stock-photo") {
      const contentType = (request.headers.get("Content-Type") || "").split(";", 1)[0].trim().toLowerCase();
      if (contentType !== "application/json") return json({ error: "Content-Type must be application/json" }, 415);
      const contentLength = Number(request.headers.get("Content-Length") || 0);
      if (Number.isFinite(contentLength) && contentLength > MAX_JSON_REQUEST_BYTES) {
        return json({ error: "Request body is too large" }, 413);
      }
    }
    if (url.pathname === "/api/state") {
      if (request.method === "GET") return json(await readEntityState(env));
      if (request.method === "POST") return writeState(request, env);
      return json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/state/patch") {
      if (request.method === "POST") {
        let payload;
        try {
          payload = await request.json();
        } catch {
          return json({ error: "Invalid JSON" }, 400);
        }
        try {
          const result = await writeEntityPatchData(payload?.patch, env, payload?.actor || {});
          const changedArrays = Object.keys(payload?.patch?.arrays || {});
          const dashboardChanged = changedArrays.some((name) => ["sales", "expenses", "stock", "productionOrders"].includes(name));
          if (env.NOTION_TOKEN && (payload?.patch?.arrays?.productionOrders || dashboardChanged)) {
            ctx.waitUntil(syncNotionOperations(env));
          }
          return json({ updatedAt: result.cursor, applied: result.applied });
        } catch (error) {
          logWorkerEvent("error", "state_patch_failed", { message: error?.message || "Sync write failed" });
          return json({ error: error?.message || "Sync write failed" }, 500);
        }
      }
      return json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/sync") {
      if (request.method === "GET") {
        try {
          return await readSyncChanges(request, env);
        } catch (error) {
          const message = error?.message || "Cloud read failed";
          const dailyReadLimitReached = message.includes("exceeded D1's free tier daily row read limit");
          logWorkerEvent("error", "sync_read_failed", { message });
          return json({
            error: dailyReadLimitReached
              ? "Cloud database daily read limit reached"
              : "Cloud read failed",
            code: dailyReadLimitReached ? "D1_DAILY_READ_LIMIT" : "SYNC_READ_FAILED",
          }, dailyReadLimitReached ? 503 : 500);
        }
      }
      if (request.method === "POST") return writeSyncChanges(request, env);
      return json({ error: "Method not allowed" }, 405);
    }

    if (url.pathname === "/api/health") {
      return json(await readHealth(env));
    }

    if (url.pathname === "/api/stock-photo") {
      try {
        return await stockPhotoResponse(request, env);
      } catch (error) {
        logWorkerEvent("error", "stock_photo_failed", { message: error?.message || "Stock photo operation failed" });
        return json({ error: error?.message || "Stock photo operation failed" }, 500);
      }
    }

    if (url.pathname === "/api/notion/sync") {
      if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
      try {
        return json(await syncNotionOperations(env));
      } catch (error) {
        logWorkerEvent("error", "notion_production_sync_failed", { message: error?.message || "Notion sync failed" });
        return json({ ok: false, error: error?.message || "Notion sync failed" }, 500);
      }
    }

    const response = await env.ASSETS.fetch(request);
    const headers = new Headers(response.headers);
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Referrer-Policy", "same-origin");
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    headers.set("Permissions-Policy", "camera=(self), microphone=(), geolocation=()");
    headers.set("Content-Security-Policy", "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'");
    headers.set("Cache-Control", url.pathname.match(/\.(png|jpg|jpeg|webp)$/i) ? "public, max-age=86400" : "no-cache");
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  },
  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(syncNotionOperations(env));
  },
};
