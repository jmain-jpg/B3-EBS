# B3 Floral EBS Cloud Deployment

The cloud build uses Cloudflare Workers static assets and a D1 database. The local Python server remains available as a fallback.

## Safety model

- `data/`, logs, and generated seed files are excluded from Git and static deployment.
- Every page and API request requires HTTP Basic authentication.
- Set the Worker secret `APP_PASSWORD` before sharing the deployment URL.
- Staff roles inside the app continue to control feature visibility after the cloud password gate.
- Production builds do not publish `cloudflare/recovery-state.json`. Keep recovery snapshots private; a new browser falls back to a full D1 bootstrap when no private recovery endpoint is available.

## First deployment

1. Install dependencies: `pnpm install`
2. Sign in: `pnpm wrangler login`
3. Create the database: `pnpm wrangler d1 create b3-floral-ebs`
4. Enable R2 in the Cloudflare Dashboard, then create the private photo bucket: `pnpm wrangler r2 bucket create b3-floral-stock-photos`.
5. Copy the D1 database ID into `wrangler.jsonc`. The `STOCK_PHOTOS` R2 binding is already configured there.
6. Apply schema: `pnpm wrangler d1 migrations apply b3-floral-ebs --remote`
7. Prepare the current private data: `pnpm run cloud:seed`
8. Import it: `pnpm run cloud:seed:upload`
9. Set the shared cloud password: `pnpm wrangler secret put APP_PASSWORD`
10. Deploy: `pnpm run cloud:deploy`

The browser username is `b3`; the password is the value stored in `APP_PASSWORD`.

## Later updates

1. Set `B3_APP_PASSWORD` in the terminal running maintenance commands.
2. Run `pnpm run cloud:backup`.
3. Run `pnpm run cloud:deploy`.
4. Run `pnpm run cloud:smoke`.

Static code changes do not overwrite D1 business data. Cloud observability retains sampled invocation logs, and sync writes emit structured audit entries with the staff ID/name supplied by the app. Keep `cloudflare/recovery-state.json` and generated `backups/cloud/` files private and test a restore before applying future database migrations.

Stock bouquet photos are compressed in the browser and stored separately in the private `b3-floral-stock-photos` R2 bucket. D1 stores only each photo's object key and metadata. D1 backups therefore do not include the image bytes: include the R2 bucket in the business backup/retention process, and restore D1 plus R2 together. The local fallback server stores the same photo keys under `data/stock-photos/`, which is intentionally excluded from Git and must be included in local machine backups.

## Inventory data maintenance

Use the version-checked CSV workflow in `CLOUD_INVENTORY_EDITOR.md` when separating existing cloud records into Stock Inventory and Shop Inventory. Do not use `cloud:seed:upload` for routine inventory corrections after the entity-sync migration.
