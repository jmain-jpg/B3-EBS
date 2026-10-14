CREATE UNIQUE INDEX IF NOT EXISTS idx_app_entities_unique_sale_voucher
  ON app_entities (lower(trim(json_extract(data, '$.voucherNumber'))))
  WHERE section = 'sales'
    AND deleted = 0
    AND json_extract(data, '$.voucherNumber') IS NOT NULL
    AND trim(json_extract(data, '$.voucherNumber')) <> '';
