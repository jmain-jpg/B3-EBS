# Cloud Inventory Data Editor

This maintenance tool safely separates Cloudflare inventory into:

- `stock` — Stock Inventory / not yet at the shop
- `shop` — Shop Inventory / available to the cashier

It never uploads during download or preview. Upload and rollback require explicit confirmation phrases.

## 1. Set the cloud password

In PowerShell:

```powershell
$env:B3_APP_PASSWORD = "YOUR_CLOUD_PASSWORD"
```

Optionally target a different Worker:

```powershell
$env:B3_CLOUD_URL = "https://your-worker.example.com"
```

## 2. Download a protected editor session

```powershell
pnpm run cloud:inventory -- download
```

The command creates a timestamped private directory under `backups/cloud-inventory/` containing:

- `original-cloud-state.json` — immutable rollback source
- `inventory-locations.csv` — the file to edit
- `README.txt` — short instructions

## 3. Edit the CSV

Open `inventory-locations.csv` in Excel. Change only `targetInventory`:

- `stock` for Stock Inventory
- `shop` for Shop Inventory

Do not edit `productCode` or `currentInventory`.

## 4. Generate and inspect the preview

```powershell
pnpm run cloud:inventory -- preview "backups/cloud-inventory/SESSION_FOLDER"
```

Review `inventory-preview.json`. It lists every changed Product Code and the final Stock/Shop counts.

## 5. Upload and verify

```powershell
pnpm run cloud:inventory -- upload "backups/cloud-inventory/SESSION_FOLDER" --confirm=UPLOAD-INVENTORY
```

The tool uploads only when the cloud version still matches the downloaded backup. If another user changed cloud data, the upload stops and requires a fresh download. After upload, it downloads cloud data again and verifies every changed Product Code.

## Roll back inventory locations

```powershell
pnpm run cloud:inventory -- rollback "backups/cloud-inventory/SESSION_FOLDER" --confirm=ROLLBACK-INVENTORY
```

Rollback restores only inventory locations. It does not revert newer vouchers, expenses, payments, or other unrelated business data.

## Safety notes

- Keep the session directory private because it contains business data.
- Never edit or delete `original-cloud-state.json`.
- Always inspect `inventory-preview.json` before upload.
- A static code deployment does not run this tool or overwrite Cloudflare data.
