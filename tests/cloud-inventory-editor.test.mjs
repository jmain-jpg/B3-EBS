import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInventoryEdit,
  encodeCsv,
  inventoryEditorCsv,
  normalizeInventoryTarget,
  parseCsv,
} from "../cloudflare/inventory-data-editor.mjs";

const payload = {
  updatedAt: 12345,
  state: {
    stock: [
      { id: "one", productCode: "FS-001", description: "Red, rose", status: "available" },
      { id: "two", productCode: "FS-002", description: "Blue bouquet", status: "available", inventoryLocation: "pending" },
      { id: "three", productCode: "SKU-1", description: "Gift \"Box\"", itemType: "sku", quantityAvailable: 4, status: "available", inventoryLocation: "shop" },
    ],
    sales: [{ id: "sale-1", voucherNumber: "001" }],
  },
};

test("inventory editor CSV round-trips commas and quotes", () => {
  const csv = inventoryEditorCsv(payload);
  const rows = parseCsv(csv);
  assert.equal(rows.length, 3);
  assert.equal(rows[0].description, "Red, rose");
  assert.equal(rows[2].description, 'Gift "Box"');
  assert.deepEqual(rows.map((row) => row.currentInventory), ["shop", "stock", "shop"]);
});

test("inventory editor changes only requested inventory locations", () => {
  const csv = encodeCsv([
    ["productCode", "currentInventory", "targetInventory"],
    ["FS-001", "shop", "stock"],
    ["FS-002", "stock", "shop"],
    ["SKU-1", "shop", "shop"],
  ]);
  const { editedPayload, preview } = buildInventoryEdit(payload, csv);
  assert.equal(editedPayload.baseUpdatedAt, 12345);
  assert.equal(preview.changedRecords, 2);
  assert.deepEqual(preview.finalCounts, { stock: 1, shop: 2 });
  assert.equal(editedPayload.state.stock[0].inventoryLocation, "pending");
  assert.equal(editedPayload.state.stock[1].inventoryLocation, "shop");
  assert.deepEqual(editedPayload.state.sales, payload.state.sales);
});

test("inventory editor rejects stale rows, duplicates, and unknown targets", () => {
  assert.throws(() => normalizeInventoryTarget("warehouse"), /Unknown targetInventory/);
  const stale = encodeCsv([
    ["productCode", "currentInventory", "targetInventory"],
    ["FS-001", "stock", "shop"],
  ]);
  assert.throws(() => buildInventoryEdit(payload, stale), /stale currentInventory/);
  const duplicate = encodeCsv([
    ["productCode", "currentInventory", "targetInventory"],
    ["FS-001", "shop", "shop"],
    ["fs-001", "shop", "stock"],
  ]);
  assert.throws(() => buildInventoryEdit(payload, duplicate), /duplicate Product Code/);
});
