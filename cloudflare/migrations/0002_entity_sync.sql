CREATE TABLE IF NOT EXISTS sync_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  version INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS app_entities (
  section TEXT NOT NULL,
  entity_key TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
  data TEXT,
  PRIMARY KEY (section, entity_key)
);

CREATE INDEX IF NOT EXISTS idx_app_entities_updated_at
  ON app_entities(updated_at);

CREATE TABLE IF NOT EXISTS app_values (
  key TEXT PRIMARY KEY,
  updated_at INTEGER NOT NULL,
  deleted INTEGER NOT NULL DEFAULT 0 CHECK (deleted IN (0, 1)),
  data TEXT
);

CREATE INDEX IF NOT EXISTS idx_app_values_updated_at
  ON app_values(updated_at);

INSERT INTO sync_meta (id, version)
SELECT 1, COALESCE(updated_at, 0)
FROM app_state
WHERE id = 1
ON CONFLICT(id) DO UPDATE SET version = MAX(sync_meta.version, excluded.version);

INSERT INTO app_entities (section, entity_key, sort_order, updated_at, deleted, data)
SELECT
  section.key,
  CASE
    WHEN section.key = 'stock' THEN COALESCE(
      CAST(json_extract(item.value, '$.productCode') AS TEXT),
      CAST(json_extract(item.value, '$.id') AS TEXT),
      CAST(item.key AS TEXT)
    )
    ELSE COALESCE(
      CAST(json_extract(item.value, '$.id') AS TEXT),
      CAST(json_extract(item.value, '$.name') AS TEXT),
      CAST(json_extract(item.value, '$.productCode') AS TEXT),
      CAST(item.key AS TEXT)
    )
  END,
  CAST(item.key AS INTEGER),
  app_state.updated_at,
  0,
  item.value
FROM app_state
JOIN json_each(app_state.data) AS section
JOIN json_each(section.value) AS item
WHERE app_state.id = 1
  AND section.type = 'array'
ON CONFLICT(section, entity_key) DO NOTHING;

INSERT INTO app_values (key, updated_at, deleted, data)
SELECT section.key, app_state.updated_at, 0, json(section.value)
FROM app_state
JOIN json_each(app_state.data) AS section
WHERE app_state.id = 1
  AND section.type <> 'array'
  AND section.key <> 'currentStaffId'
ON CONFLICT(key) DO NOTHING;
