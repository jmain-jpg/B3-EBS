import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (name) => readFile(new URL(name, root), "utf8");

test("retired Girlfriend Day navigation is absent", async () => {
  const html = await read("index.html");
  assert.equal(html.includes('data-nav="girlfriend-day"'), false);
  assert.match(html, /app\.js\?v=20261006-business-transfer/);
});

test("default theme uses the modern plum, rose, and semantic support palette", async () => {
  const [html, styles] = await Promise.all([read("index.html"), read("styles.css")]);
  assert.match(html, /styles\.css\?v=20261006-business-transfer/);
  assert.match(html, /id="loginThemeToggle"/);
  assert.match(html, /id="cloudThemeToggle"/);
  assert.match(styles, /--plum: #4a1d3f;/);
  assert.match(styles, /--brand-pink: #d92d77;/);
  assert.match(styles, /--blue: #4568d4;/);
  assert.match(styles, /html\.glass-ui \.button\.primary[\s\S]*?linear-gradient\(135deg, #e43c82 0%, #c9236d 58%, #a91e5b 100%\)/);
  assert.match(styles, /html\.glass-ui\[data-theme="dark"\][\s\S]*?--brand-pink: #f05a99;/);
  assert.match(styles, /html\.glass-ui\[data-theme="dark"\] \.button\.primary[\s\S]*?linear-gradient\(135deg, #f05a99, #cf2c74 62%, #a91e5b\)/);
  assert.match(styles, /v18 final cascade — intentionally last/);
  assert.match(styles, /--ui-surface: #171a22;/);
  assert.match(styles, /--ui-control: #1f222c;/);
  assert.match(styles, /--ui-accent: #ec4f92;/);
  assert.match(styles, /\.quick-action-card:not\(\.primary\):not\(\.plum\)[\s\S]*?background: linear-gradient\(145deg, #1d2029, #181b23\) !important;/);
  assert.match(styles, /:is\(\.table-wrap, \.compact-record-table\) thead th[\s\S]*?background: #20232d !important;/);
  assert.match(styles, /Mobile theme control must remain available/);
  assert.match(styles, /\.login-theme-toggle/);
  assert.match(styles, /Header order: Back → Home → Brand → Theme → Logout/);
});

test("Production account opens its work area without a group chooser", async () => {
  const app = await read("app.js");
  assert.match(app, /const productionAccount = staff\?\.role === "production";/);
  assert.match(app, /if \(productionAccount && allowedGroups\.some\(\(group\) => group\.id === "production"\)\) activeHomeGroup = "production";/);
  assert.match(app, /els\.homeGroupBack\.hidden = !selectedGroup \|\| productionAccount;/);
  assert.match(app, /currentStaff\(\)\?\.role === "production"/);
});

test("Wati is available as a florist for stock entry and reporting", async () => {
  const app = await read("app.js");
  assert.match(app, /const stockFloristNames = \["Ah Tun", "Lone Lone", "Wati"\];/);
  assert.match(app, /return stockFloristNames\.map\(\(name\) => \(\{ value: name, label: name \}\)\);/);
  assert.match(app, /const configuredFlorists = Object\.fromEntries\([\s\S]*?stockFloristNames\.map/);
  assert.match(app, /\}, configuredFlorists\);/);
  assert.match(app, /function openReportExportModal\(\)[\s\S]*?reportMode === "month"[\s\S]*?els\.summaryMonth\.value[\s\S]*?els\.summaryDate\.value/);
  assert.match(app, /els\.reportExportButton\.addEventListener\("click", openReportExportModal\);/);
  assert.match(app, /function monthEnd\(dateValue\)[\s\S]*?new Date\(Date\.UTC\(year, month, 0\)\)/);
});

test("staff performance exports coded bouquet quantities without SKU items", async () => {
  const app = await read("app.js");
  assert.match(app, /function saleProductCodeBouquetCount\(sale, stockLookup = buildStockCostLookup\(state\.stock\)\)/);
  assert.match(app, /!normalizeCode\(item\.productCode\) \|\| item\.type === "sku_stock"/);
  assert.match(app, /if \(stockItem\?\.itemType === "sku"\) return count;/);
  assert.match(app, /bouquetCount \+= saleProductCodeBouquetCount\(sale, stockLookup\);/);
  assert.match(app, /"Product Code Bouquet Count"/);
});

test("best-selling product export groups similar items and excludes service lines", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /option value="best_selling_products">အရောင်းရဆုံး ပစ္စည်းများ/);
  assert.match(app, /function bestSellingProductGroup\(item, stockLookup\)/);
  assert.match(app, /"deli", "delivery", "ကျန်ငွေ", "ပိုငွေ", "ပိုလွှဲ", "ဆွဲထုတ်", "လဲခ"/);
  assert.match(app, /`ငွေသားပန်းစည်း \$\{moneyPattern\[1\]\} × \$\{moneyPattern\[2\]\}`/);
  assert.match(app, /function bestSellingProductsExport\(startDate, endDate\)/);
  assert.match(app, /headers: \["Rank", "Product Group", "Quantity Sold", "Voucher Count", "Sales Amount"/);
  assert.match(app, /exportType === "best_selling_products"/);
});

test("cake grouping ignores quote variants, word order, and trailing descriptions", async () => {
  const app = await read("app.js");
  assert.match(app, /function cakeSizeFromProductText\(text\)/);
  assert.match(app, /\["'\]\+\|လက်မ\|inch/);
  assert.match(app, /\(\?:cake\|ကိတ်\)\[\\s-\]\*\(\\d\{1,2\}\)/);
  assert.match(app, /const cakeSize = cakeSizeFromProductText\(text\);/);
  const normalize = (value) => String(value).toLowerCase().replace(/[“”′″]/g, '"').replace(/\s+/g, " ").trim();
  const cakeSize = (value) => {
    const text = normalize(value);
    return text.match(/(\d{1,2})[\s-]*(?:["']+|လက်မ|inch(?:es)?|in)?[\s-]*(?:cake|ကိတ်)/i)?.[1]
      || text.match(/(?:cake|ကိတ်)[\s-]*(\d{1,2})[\s-]*(?:["']+|လက်မ|inch(?:es)?|in)?/i)?.[1]
      || "";
  };
  for (const value of ['5" cake', "5''cake chocolate", "5-inch cake red", 'Cake 5" custom', "၅ လက်မ ကိတ် birthday"]) {
    const normalized = value === "၅ လက်မ ကိတ် birthday" ? "5 လက်မ ကိတ် birthday" : value;
    assert.equal(cakeSize(normalized), "5");
  }
});

test("Sale Team production orders include compressed reference photos", async () => {
  const [html, app, styles] = await Promise.all([read("index.html"), read("app.js"), read("styles.css")]);
  assert.match(app, /const productionOrdersEnabled = true;/);
  assert.match(html, /id="openProductionOrderButton">Production Order သွားမယ်/);
  assert.match(html, /<section class="panel protected view-section" id="production" data-view="production" data-permission="production">/);
  assert.match(html, /id="saleAccountHome"[\s\S]*id="saleHomeProductionOrder"[\s\S]*id="productionOrderPhotos"/);
  assert.doesNotMatch(html, /id="production"[\s\S]*class="production-compose"/);
  assert.match(app, /activeHomeGroup = "";[\s\S]*renderHome\(\);[\s\S]*goToView\("home"\);[\s\S]*#saleHomeProductionOrder/);
  assert.match(html, /id="productionOrderPhotos" type="file" accept="image\/\*" multiple/);
  assert.match(html, /Urgency \(Manual\)[\s\S]*<input id="productionOrderUrgency"/);
  assert.doesNotMatch(html, /<select id="productionOrderUrgency">/);
  assert.match(app, /productionOrderUrgencyLabel\(order\.urgency\)/);
  assert.match(app, /class="production-urgency-badge"/);
  assert.match(app, /requirementDuplicatesItem/);
  assert.match(app, /<span>\$\{escapeHtml\(order\.fulfillmentDate \|\| order\.orderDate \|\| "-"\)\}<\/span>/);
  assert.doesNotMatch(app, /escapeHtml\(fulfillmentMethodLabel\(order\.fulfillmentMethod\)\).*escapeHtml\(order\.salePerson/);
  assert.match(styles, /data-theme="dark"\] #production \.production-column:nth-child\(1\)/);
  assert.match(styles, /data-theme="dark"\] #production \.production-order-card/);
  assert.match(app, /MAX_PRODUCTION_PHOTOS = 4/);
  assert.match(app, /MAX_PRODUCTION_PHOTO_EDGE = 1600/);
  assert.match(app, /canvasToDataUrl\(canvas, "image\/jpeg", PRODUCTION_PHOTO_QUALITY\)/);
  assert.match(app, /photos: productionPhotoDraft\.map/);
  assert.match(app, /data-view-production-photo/);
  assert.match(html, /id="productionPhotoModal"/);
  assert.match(styles, /\.production-photo-modal-image/);
});

test("floral stock requires an R2-backed compressed bouquet photo", async () => {
  const [html, app, worker, config, styles] = await Promise.all([
    read("index.html"), read("app.js"), read("cloudflare/worker.js"), read("wrangler.jsonc"), read("styles.css"),
  ]);
  assert.match(html, /id="stockPhotoInput" type="file" accept="image\/\*" capture="environment"/);
  assert.match(html, /id="editStockPhotoInput"/);
  assert.match(html, /id="stockPhotoModal"/);
  assert.match(app, /mode === "floral" && !existingItem && !stockPhotoDraft/);
  assert.match(app, /await uploadStockPhoto\(stockPhotoDraft, item\.id, productCode\)/);
  assert.match(app, /MAX_STOCK_PHOTO_BYTES = 700 \* 1024/);
  assert.match(app, /photo: mode === "floral" \? uploadedPhoto : null/);
  assert.match(app, /data-action="photo"/);
  assert.match(app, /deleteStockPhoto\(previousPhoto\)/);
  assert.match(worker, /url\.pathname === "\/api\/stock-photo"/);
  assert.match(worker, /await bucket\.put\(key, body/);
  assert.match(worker, /MAX_STOCK_PHOTO_BYTES = 750 \* 1024/);
  assert.match(worker, /camera=\(self\)/);
  assert.match(config, /"binding": "STOCK_PHOTOS"/);
  assert.match(config, /"bucket_name": "b3-floral-stock-photos"/);
  assert.match(styles, /\.stock-photo-preview-card/);
});

test("Admin Home flattens Finance, Reports, and Settings without an Admin group", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /id="adminDirectHome"/);
  assert.match(html, /id="adminDirectActions"/);
  assert.match(app, /const adminAccount = staff\?\.role === "admin";/);
  assert.match(app, /adminAccount && \["finance", "admin"\]\.includes\(group\.id\)/);
  assert.match(app, /action\.group === "finance" \|\| action\.view === "settings" \|\| action\.action === "adminCash"/);
  assert.match(app, /title: "Cash Management", detail: "Business \/ Personal \/ Production Float"/);
  assert.match(app, /button\.dataset\.quickAction === "adminCash"/);
  assert.match(app, /els\.adminCashManager\?\.scrollIntoView/);
  assert.match(app, /els\.adminDirectActions\?\.addEventListener\("click", handleQuickActionClick\)/);
});

test("National Girlfriend Day vouchers return to pickup and delivery workflows", async () => {
  const app = await read("app.js");
  const fulfillmentTable = app.match(/function renderFulfillmentTable\(\)[\s\S]*?function girlfriendDayOrderRowHtml/)[0];
  const dueCount = app.match(/function todayFulfillmentDueCount\(\)[\s\S]*?function girlfriendDayPendingCount/)[0];
  const homeQueue = app.match(/function renderHome\(\)[\s\S]*?function openQueueTarget/)[0];
  assert.doesNotMatch(fulfillmentTable, /fulfillmentDueDate\(sale\) !== NATIONAL_GIRLFRIEND_DAY_DATE/);
  assert.doesNotMatch(dueCount, /fulfillmentDueDate\(sale\) !== NATIONAL_GIRLFRIEND_DAY_DATE/);
  assert.doesNotMatch(homeQueue, /fulfillmentDueDate\(sale\) !== NATIONAL_GIRLFRIEND_DAY_DATE/);
  assert.match(fulfillmentTable, /data-fulfillment-status="\$\{sale\.id\}"/);
});

test("cashier keeps every customer information field optional", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /name="customerName"/);
  assert.match(html, /name="customerPhone"/);
  assert.match(html, /name="customerAddress"/);
  assert.match(html, /Customer Name <b>Optional<\/b>/);
  assert.match(html, /Phone \/ Viber <b>Optional<\/b>/);
  assert.match(html, /Address \/ Contact Note <b>Optional<\/b>/);
  assert.doesNotMatch(app, /requireField\(form\.customerName/);
  assert.doesNotMatch(app, /requireField\(form\.customerPhone/);
  assert.doesNotMatch(app, /requireField\(form\.customerAddress/);
  assert.match(app, /customerName: form\.customerName\.value\.trim\(\)/);
  assert.match(app, /sale\.customerPhone/);
  assert.match(app, /"Customer Name", "Customer Phone", "Customer Address"/);
});

test("expenses support managed categories across entry, reporting, import, and export", async () => {
  const [html, app, styles] = await Promise.all([read("index.html"), read("app.js"), read("styles.css")]);
  assert.match(html, /<select name="category" required><\/select>/);
  assert.match(html, /id="expenseCategoryFilter"/);
  assert.match(html, /id="expenseCategoryForm"/);
  assert.match(html, /id="reportExpenseCategorySummary"/);
  assert.match(app, /const defaultExpenseCategories = \[/);
  assert.match(app, /category: form\.category\.value \|\| "Uncategorized"/);
  assert.match(app, /previousExpenseCategoryFilter/);
  assert.match(app, /!selectedCategory \|\| \(expense\.category \|\| "Uncategorized"\) === selectedCategory/);
  assert.match(app, /expenseCategoryFilter\?\.addEventListener\("change", renderExpenseTable\)/);
  assert.match(styles, /\.expense-heading-controls/);
  assert.match(app, /function expenseTotalsByCategory\(expenses\)/);
  assert.match(app, /data-edit-expense-category/);
  assert.match(app, /function editExpenseCategory\(currentName\)/);
  assert.match(app, /expense\.category = nextName/);
  assert.match(app, /editExpenseCategory\(editButton\.dataset\.editExpenseCategory\)/);
  assert.match(app, /headers: \["Date", "Category", "Description", "Payment Method", "Amount"\]/);
  assert.match(app, /\["category", "Category"\]/);
  assert.match(app, /group: isSaleTeamAccount\(\) \? "sale" : "finance"[\s\S]*?title: "Daily Expense"/);
  assert.ok(
    html.indexOf('id="expensePaymentSummary"') < html.indexOf('id="expenseTable"'),
    "Expense Payment Method summary must appear before the detail table",
  );
});

test("cash denomination stock is excluded from every inventory valuation", async () => {
  const app = await read("app.js");
  assert.match(app, /function isCashInventoryItem\(item\)/);
  assert.match(app, /String\(item\?\.category \|\| ""\)\.trim\(\) === "ငွေသား"/);
  assert.match(app, /function currentInventoryValue\(\)[\s\S]*?if \(isCashInventoryItem\(item\)\) return sum;/);
  assert.match(app, /function stockValueAt\(dateValue\)[\s\S]*?\.filter\(\(item\) => !isCashInventoryItem\(item\)\)/);
  assert.match(app, /function stockPurchaseValueInRange\(startDate, endDate\)[\s\S]*?\.filter\(\(item\) => !isCashInventoryItem\(item\)\)/);
});

test("cash denominations are non-stock while voucher quantity still drives cost", async () => {
  const app = await read("app.js");
  assert.match(app, /function isQuantityTrackedSku\(item\)/);
  assert.match(app, /item\?\.itemType === "sku" && !isCashInventoryItem\(item\)/);
  assert.match(app, /if \(isQuantityTrackedSku\(stockItem\) && availableQuantity < quantity\)/);
  assert.match(app, /if \(isCashInventoryItem\(stockItem\)\)[\s\S]*?stockItem\.quantityAvailable = 0;[\s\S]*?stockItem\.status = "available";/);
  assert.match(app, /const resolvedUnitCost = stockCost > 0 \? stockCost : unitCostInput/);
  assert.match(app, /cost: resolvedUnitCost \* quantity/);
  assert.match(app, /const qtyText = isCashDenomination \? "Non-stock"/);
  assert.match(app, /function saleStockUnitCost\(stockItem\)[\s\S]*?isCashInventoryItem\(stockItem\)[\s\S]*?stockItem\?\.unitCost \|\| stockItem\?\.productionCost \|\| stockItem\?\.salePrice/);
  assert.match(app, /function resolvedSaleItemCostState\(item, stockItem\)[\s\S]*?saleStockUnitCost\(stockItem\)/);
  assert.match(app, /function renderStockLookup\(\)[\s\S]*?const unitCost = saleStockUnitCost\(stockItem\)/);
});

test("cashier manual item code requirement follows the explicit checkbox", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /Bouquet Cash \/ Unit COGS[\s\S]*ပန်းစည်းထဲထည့်သည့်ငွေသား/);
  assert.match(html, /<input id="saleItemCost" type="number" min="0" step="1" value="0" placeholder="0" \/>/);
  assert.doesNotMatch(html, /<input id="saleItemCost" type="hidden"/);
  assert.match(app, /const unitCostInput = Math\.max\(0, Number\(els\.saleItemCost\.value \|\| 0\)\)/);
  assert.match(app, /unitCost: unitCostInput,[\s\S]*cost: unitCostInput \* quantity,[\s\S]*pendingBouquetCash: unitCostInput,[\s\S]*costSource: unitCostInput \? "pending-cash" : "missing"/);
  assert.match(
    app,
    /const requiresCode = Boolean\(stockItem \|\| productCode \|\| els\.saleRequiresCode\?\.checked\);/
  );
  assert.doesNotMatch(
    app,
    /const requiresCode = Boolean\([^;]*inferSaleItemRequiresCode\(\{ description \}\)[^;]*\);/
  );
});

test("shop sale inventory is separated from stock that has not reached the shop", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /name="inventoryLocation"/);
  assert.match(html, /id="inventoryLocationFilter"/);
  assert.match(html, /data-nav="stock-inventory"/);
  assert.match(html, /data-nav="shop-inventory"/);
  assert.match(app, /inventoryLocation: item\.inventoryLocation === "pending" \? "pending" : "shop"/);
  assert.match(app, /function permissionForView\(view\)/);
  assert.match(app, /view === "stock-inventory" \? "pending" : "shop"/);
  assert.match(app, /function moveStockInventory\(id\)/);
  assert.match(app, /\.filter\(\(item\) => isShopInventoryItem\(item\)\)/);
  assert.match(app, /if \(stockItem && !isShopInventoryItem\(stockItem\)\)/);
  assert.match(app, /els\.inventoryLocationFilter\.addEventListener\("change", renderInventory\)/);
});

test("cash bouquet money becomes the linked voucher item cost", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /ပန်းစည်းထဲထည့်သည့် ငွေသား/);
  assert.doesNotMatch(html, /name="productionCost"/);
  assert.match(app, /const bouquetCash = Number\(stockItem\?\.cashValue \|\| 0\);/);
  assert.match(app, /if \(bouquetCash > 0\) return bouquetCash;/);
  assert.match(app, /const isLegacyMoneyBouquet = stockItem\?\.itemType !== "sku" && isMoneyBouquetCategory\(stockItem\?\.category\);/);
  assert.match(app, /return isLegacyMoneyBouquet \? Number\(stockItem\?\.productionCost \|\| stockItem\?\.unitCost \|\| 0\) : 0;/);
  assert.match(app, /productionCost: Number\(item\.productionCost \|\| 0\)/);
  assert.match(app, /const unitCost = cashValue;/);
  assert.match(app, /productionCost: cashValue,[\s\S]*?unitCost: cashValue/);
  assert.match(app, /CASH_FLOAT_START_DATE = "2026-09-16"/);
  assert.match(app, /ADMIN_CASH_START_DATE = "2026-10-01"/);
  assert.match(app, /ADMIN_CASH_FIRST_MONTH = CASH_FLOAT_START_DATE\.slice/);
  assert.match(html, /cashFloatOpeningForm/);
});

test("cash float restarts on September 16 and deducts money bouquet items", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(app, /\.filter\(\(allocation\) => allocation\.allocationDate >= CASH_FLOAT_START_DATE\)/);
  assert.match(app, /const allocations = \(state\.cashFloatAllocations \|\| \[\]\)\.filter\(/);
  assert.match(app, /raw\.cashFloatOpeningUnsold\?\.effectiveDate === CASH_FLOAT_START_DATE/);
  assert.match(app, /function isCashFloatVoucherItem\(item, stockItems = state\.stock\)/);
  assert.match(app, /return code\.startsWith\("MM"\) \|\| isCashInventoryItem\(stockItem\);/);
  assert.match(app, /function cashFloatVoucherUsageDate\(sale\)/);
  assert.match(app, /function cashFloatVoucherValue\(sale, stockItems = state\.stock, asOfDate = today\)/);
  assert.match(app, /sale\?\.fulfillmentDate \|\| sale\?\.saleDate/);
  assert.match(app, /const bouquetCashUsed = bouquetUsed \+ voucherMmUsed;/);
  assert.match(app, /const used = bouquetCashUsed \+ transfersOut;/);
  assert.match(app, /voucherMmValue > availableCashFloat/);
  assert.match(app, /type: "voucher-mm"/);
  assert.doesNotMatch(app, /status: isPrevious \? "အရင်စာရင်း" : "ငွေထုတ်ပေး"/);
  assert.match(app, /CASH_FLOAT_START_DATE} မတိုင်ခင် မရောင်းရသေးပန်းစည်းငွေ/);
  assert.match(html, /စတင်ရက်မတိုင်ခင် မရောင်းရသေးပန်းစည်းငွေ/);
  assert.match(html, /name="allocationDate" type="date" min="2026-09-16"/);
  assert.match(html, /name="effectiveDate" type="date" value="2026-09-16"/);
  assert.match(html, /name="effectiveDate" type="date" value="2026-10-01"/);
  assert.match(html, /id="adminCashMonth"[^>]*type="month"/);
  assert.match(html, /id="adminCashMonth"[^>]*min="2026-09"/);
  assert.match(html, /id="adminCashPreviousMonth"/);
  assert.match(html, /id="adminCashNextMonth"/);
  assert.match(html, /id="adminCashStepper"/);
  assert.match(html, /data-admin-cash-step="accounts"/);
  assert.match(html, /data-admin-cash-step="ledger"/);
  assert.match(html, /data-admin-cash-step="usage"/);
  assert.match(html, /data-admin-cash-step="daily"/);
  assert.match(html, /data-admin-cash-panel="ledger"/);
  assert.match(html, /name="productionOpening"/);
  assert.doesNotMatch(html, /name="productionOpening"[^>]*readonly/);
  assert.match(html, /name="transferDate" type="date" min="2026-10-01"/);
  assert.match(html, /id="adminCashManager"/);
  assert.match(html, /id="adminCashAccountsSection"/);
  assert.match(html, /Opening Balance ပြန်ပြင်ရန်/);
  assert.match(html, /id="adminBusinessCashBreakdown"/);
  assert.match(html, /name="businessOpeningCash"/);
  assert.match(html, /name="businessOpeningKpay"/);
  assert.match(html, /name="businessOpeningAyaPay"/);
  assert.match(html, /name="businessOpeningAyaBanking"/);
  assert.match(html, /name="businessOpeningWave"/);
  assert.match(html, /name="businessOpeningBanking"/);
  assert.match(html, /name="personalOpening"/);
  assert.match(html, /name="productionOpening"/);
  assert.match(html, /id="adminCashTransferForm"/);
  assert.match(html, /name="toBusinessChannel"/);
  assert.match(html, /id="adminDailyCashSaleForm"/);
  assert.match(html, /name="settlementType"/);
  assert.match(html, /Expense Shortfall — Business Cash က လျှော့မယ်/);
  assert.match(html, /id="adminProductionCashUsage"/);
  assert.match(html, /Product Code \/ Voucher SKU MM/);
  assert.match(html, /id="dashboardHistoryPanel"/);
  assert.match(html, /id="dashboardLegacyHeader"/);
  assert.match(html, /id="dashboardMetricGrid"/);
  assert.match(html, /Cash Use \/ အပြင်ထုတ်/);
  assert.match(app, /function adminCashTotals\(/);
  assert.match(app, /adminCashPeriods: normalizeAdminCashPeriods/);
  assert.match(app, /function selectedAdminCashMonth\(\)/);
  assert.match(app, /function adminCashPeriodStart\(/);
  assert.match(app, /adminCashTotals\(previousMonth\)\.productionAvailable/);
  assert.match(app, /Closing Balance ကို အလိုအလျောက်ယူထားသည်/);
  assert.match(app, /2026-09-16 မှ စတင်သော မူလ Production Cash စာရင်း/);
  assert.match(app, /function setAdminCashStep\(/);
  assert.match(app, /productionCashUsageRows\(month\)/);
  assert.match(app, /const BUSINESS_CASH_CHANNELS = \[/);
  assert.match(app, /function normalizeBusinessCashBalances\(rawBalances, legacyCash = 0\)/);
  assert.match(app, /businessOpeningByChannel/);
  assert.match(app, /businessChannel: normalizeBusinessCashChannel/);
  assert.match(app, /toBusinessChannel: normalizeBusinessCashChannel/);
  assert.match(app, /function addAdminCashTransfer\(form\)/);
  assert.match(app, /fromAccount === "business" && toAccount === "production"[\s\S]*?\? "cash"/);
  assert.match(app, /function syncAdminCashTransferChannel\(\)/);
  assert.match(app, /productionEffectiveDate: CASH_FLOAT_START_DATE/);
  assert.match(app, /function saveAdminDailyCashSale\(form\)/);
  assert.match(app, /function deleteAdminCashRecord\(type, id\)/);
  assert.match(app, /function productionCashUsageRows\(/);
  assert.match(app, /source: "Voucher SKU MM"/);
  assert.match(app, /cashFloatVoucherItemValue\(item\)/);
  assert.match(app, /const isAdminDashboard = currentStaff\(\)\?\.role === "admin"/);
  assert.match(app, /els\.dashboardLegacyHeader\.hidden = isAdminDashboard/);
  assert.match(app, /els\.dashboardMetricGrid\.hidden = isAdminDashboard/);
  assert.match(app, /els\.dashboardHistoryPanel\.hidden = isAdminDashboard/);
  assert.match(app, /els\.adminCashAccountsSection\.open = !accounts\.updatedAt/);
  assert.match(app, /`Daily Sales → \$\{businessCashAccountLabel\(item\.businessChannel\)\}`/);
  assert.match(app, /`\$\{businessCashAccountLabel\(item\.businessChannel\)\} → Expense Shortfall`/);
  assert.match(app, /item\.settlementType === "expense_shortfall" \? -1 : 1/);
  assert.match(app, /state\.adminDailyCashSales\.unshift\(record\);/);
  assert.match(html, /id="dailyTransferPanel"/);
  assert.match(html, /id="dailyTransferButton"/);
  assert.match(html, /<details class="daily-transfer-panel"/);
  assert.match(app, /Adjustment \(\+\/−\)/);
  assert.match(app, /function dailyTransferBreakdown\(transferDate, includeEmpty = false\)/);
  assert.match(app, /function transferDailySummary\(\)/);
  assert.match(app, /dailyTransferId: transferId/);
  assert.match(app, /state\.adminDailyTransfers\.unshift/);
  assert.match(app, /function dailyTransferRowsFromEditor\(transferDate\)/);
  assert.match(app, /Daily Reconciliation Adjustment/);
  assert.doesNotMatch(app, /const existing = state\.adminDailyCashSales\.find\(\(item\) => item\.saleDate === saleDate\);/);
  assert.doesNotMatch(app, /\.slice\(0, 30\)/);
  assert.match(app, /amountPrefix: item\.settlementType === "expense_shortfall" \? "−" : ""/);
  assert.match(app, /source: allocation\.source === "personal" \? "personal" : "business"/);
  assert.doesNotMatch(html, /2026-08-11|၁၁ ရက်မတိုင်ခင်/);
});

test("money bouquet amount remains editable before Cash Float tracking starts", async () => {
  const app = await read("app.js");
  assert.match(
    app,
    /const isCashBouquet =\s*\(els\.stockMode\.value \|\| "floral"\) === "floral" && isMoneyBouquetCategory\(form\.category\.value\);/
  );
  assert.match(
    app,
    /const isCashFloatTracked =\s*isCashBouquet && normalizeDateValue\(form\.productionDate\.value\) >= CASH_FLOAT_START_DATE;/
  );
  assert.match(app, /if \(isCashFloatTracked && cashValue > availableCashFloat\)/);
});

test("stock edit derives cost only from bouquet cash", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  const saveStockEdit = app.match(/function saveStockEdit\(form\) \{[\s\S]*?function renderSaleItemMode/)[0];
  assert.doesNotMatch(html, /editStockProductionCostField/);
  assert.doesNotMatch(saveStockEdit, /form\.productionCost/);
  assert.match(saveStockEdit, /productionCost: cashValue,[\s\S]*?unitCost: cashValue/);
});

test("dashboard and report COGS preserve pending bouquet cash before and after code linking", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /<span>Cost of Goods Sold<\/span>/);
  assert.doesNotMatch(html, /Cost of Goods Sold \(Bouquet Cash\)/);
  assert.match(app, /const costTotal = soldItemCostInCurrentPeriod\(\)/);
  assert.match(app, /cashReceived - costTotal - expenseTotal/);
  assert.match(app, /Total Cost of Goods Sold/);
  assert.match(app, /function savedSaleItemUnitCost\(item\)[\s\S]*pendingBouquetCash[\s\S]*savedUnitCost/);
  assert.match(app, /function resolvedSaleItemCostState\(item, stockItem\)[\s\S]*stockCost > 0 \? stockCost : pendingCost[\s\S]*"pending-cash"/);
  assert.match(app, /function repairSaleItemCostsFromStock\(items, stockItems = state\.stock, lookup = buildStockCostLookup\(stockItems\)\)[\s\S]*resolvedSaleItemCostState\(item, stockItem\)[\s\S]*item\.pendingBouquetCash = pendingBouquetCash/);
  assert.equal((app.match(/const resolvedCost = resolvedSaleItemCostState\(item, stockItem\);/g) || []).length >= 3, true);
  assert.match(app, /function saleProductionCost\(sale\) \{\s*return \(sale\.items \|\| \[\]\)\.reduce\(\(sum, item\) => sum \+ saleItemCost\(item\), 0\);\s*\}/);
});

test("Accountant combines sale data entry and finance access without profit content", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(app, /staff\.name \|\| ""\)\.trim\(\)\.toLowerCase\(\) === "accountant"/);
  assert.match(app, /\["finance", "finance-details"\]\.includes\(permission\)/);
  assert.match(app, /accountant: \["sale", "stock", "sticker", "vouchers", "receivables", "codecheck", "production", "expense", "girlfriend-day", "fulfillment", "inventory", "reports", "finance", "finance-details", "home", "dashboard"\]/);
  assert.match(app, /manager: \[[^\]]*"finance", "finance-full", "profit"/);
  assert.match(app, /node\.hidden = !hasPermission\(node\.dataset\.contentPermission\)/);
  assert.match(html, /option value="accountant">Accountant - Finance \+ Sale<\/option>/);
  assert.equal((html.match(/data-content-permission="profit"/g) || []).length, 3);
});

test("login identity is isolated from shared business data and persists on its browser device", async () => {
  const app = await read("app.js");
  assert.match(app, /const AUTH_SESSION_KEY = "b3-floral-auth-device-v3"/);
  assert.match(app, /const LEGACY_AUTH_SESSION_KEY = "b3-floral-auth-session-v2"/);
  assert.match(app, /const initialDeviceSession = loadDeviceSession\(\)/);
  assert.match(app, /state\.currentStaffId = initialDeviceSession\.staffId/);
  assert.match(app, /localStorage\.getItem\(AUTH_SESSION_KEY\)[\s\S]*sessionStorage\.getItem\(LEGACY_AUTH_SESSION_KEY\)/);
  assert.match(app, /localStorage\.setItem\(AUTH_SESSION_KEY, JSON\.stringify\(\{ staffId: staff\.id, staffName: staff\.name \|\| "" \}\)\)/);
  assert.match(app, /localStorage\.removeItem\(AUTH_SESSION_KEY\)/);
  assert.match(app, /sessionStorage\.removeItem\(LEGACY_AUTH_SESSION_KEY\)/);
  assert.match(app, /const \{ currentStaffId, \.\.\.businessState \} = state;[\s\S]*JSON\.stringify\(businessState\)/);
  assert.match(app, /function sharedStatePayload\(\) \{[\s\S]*const \{ currentStaffId, \.\.\.sharedState \} = state/);
  assert.match(app, /currentStaffId: ""/);
  assert.match(app, /saveDeviceSession\(staff\)/);
  assert.match(app, /saveDeviceSession\(null\)/);
  assert.match(app, /const staffByName = session\.staffName[\s\S]*state\.currentStaffId = staffByName\.id;[\s\S]*saveDeviceSession\(staffByName\)/);
  assert.match(app, /toLowerCase\(\) === "accountant"[\s\S]*\? "accountant"/);
});

test("accountant export creates one ledger sheet per payment type", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /option value="accounting_sales">Payment Ledger Sheets \(Accountant\)<\/option>/);
  assert.match(html, /option value="excel">Excel Workbook \(\.xls\)<\/option>/);
  assert.match(html, /id="exportSalePerson"/);
  assert.match(html, /id="reportExportButton">Excel Export<\/button>/);
  assert.match(app, /function accountingSalesExport\(startDate, endDate, salePerson = "all"\)/);
  assert.match(app, /const paymentDetailHeaders = \["Vr No\.", "Date", "Description \/ Items", "Total Sale", "Received", "Balance"\]/);
  assert.match(app, /const voucherSummaryHeaders = \["Vr No\.", "Total Sale", "Total Received", "Payment Type\(s\)", "Balance", "Has Balance"\]/);
  assert.match(app, /const paymentSummaryHeaders = \["Payment Type", "Voucher Count", "Payment Count", "Total Received"\]/);
  assert.match(app, /\{ paymentType: "Cash", name: "Cash" \}/);
  assert.match(app, /\{ paymentType: "KBZPay", name: "KBZ Pay" \}/);
  assert.match(app, /\{ paymentType: "AYA Pay", name: "AYA Pay" \}/);
  assert.match(app, /\{ paymentType: "WavePay", name: "Wave Pay" \}/);
  assert.match(app, /\{ paymentType: "Bank Transfer", name: "Banking" \}/);
  assert.match(app, /const paymentDate = payment\.paymentDate \|\| sale\.saleDate \|\| ""/);
  assert.match(app, /!inDateRange\(paymentDate, startDate, endDate\)/);
  assert.match(app, /accountingSaleDescription\(sale\)/);
  assert.match(app, /balance = Math\.max\(0, balance - received\)/);
  assert.match(app, /name: "Voucher Summary"/);
  assert.match(app, /name: "Payment Summary"/);
  assert.match(app, /summaryBalance > 0 \? "Yes" : "No"/);
  assert.match(app, /sheets,/);
  assert.match(app, /downloadExcelWorkbook\(`\$\{filenameBase\}\.xls`/);
});

test("accountant payment ledgers split a voucher and carry its balance across sheets", async () => {
  const app = await read("app.js");
  const start = app.indexOf("const accountingPaymentSheets = [");
  const end = app.indexOf("function normalizedSalesProductText", start);
  assert.ok(start >= 0 && end > start);
  const context = {
    state: {
      sales: [{
        voucherNumber: "V-100",
        salePerson: "Aye",
        saleDate: "2026-09-01",
        totalPrice: 150000,
        items: [
          { productCode: "F001", description: "Rose bouquet", quantity: 1 },
          { productCode: "", description: "Delivery", quantity: 1 },
        ],
        payments: [
          { paymentDate: "2026-09-01", paymentType: "Cash", amount: 50000 },
          { paymentDate: "2026-09-02", paymentType: "KBZPay", amount: 100000 },
        ],
      }],
    },
    normalizeCode: (value) => String(value || "").trim().toUpperCase(),
    inDateRange: (date, from, to) => (!from || date >= from) && (!to || date <= to),
    sectionRow: (label) => [`__SECTION__:${label}`],
  };
  vm.createContext(context);
  vm.runInContext(`${app.slice(start, end)}\nglobalThis.result = accountingSalesExport("2026-09-01", "2026-09-02");`, context);
  assert.equal(JSON.stringify(context.result.sheets.map((sheet) => sheet.name)), JSON.stringify(["Voucher Summary", "Payment Summary", "Cash", "KBZ Pay", "AYA Pay", "Wave Pay", "Banking"]));
  assert.deepEqual(Array.from(context.result.sheets[0].rows[0]), ["V-100", 150000, 150000, "Cash: 50,000 | KBZ Pay: 100,000", 0, "No"]);
  assert.deepEqual(Array.from(context.result.sheets[1].rows[0]), ["Cash", 1, 1, 50000]);
  assert.deepEqual(Array.from(context.result.sheets[1].rows[1]), ["KBZ Pay", 1, 1, 100000]);
  assert.equal(context.result.sheets[2].rows[0][4], 50000);
  assert.equal(context.result.sheets[2].rows[0][5], 100000);
  assert.equal(context.result.sheets[3].rows[0][4], 100000);
  assert.equal(context.result.sheets[3].rows[0][5], 0);
  assert.match(context.result.sheets[2].rows[0][2], /F001 - Rose bouquet x1/);
  assert.match(context.result.sheets[2].rows[0][2], /Delivery x1/);
  assert.equal(context.result.sheets[6].rows.length, 0);
});

test("accountant finance view only exposes receivable, payable, and inventory summaries", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(app, /admin: \[[^\]]*"finance", "finance-full", "profit"/);
  assert.match(app, /manager: \[[^\]]*"finance", "finance-full", "profit"/);
  assert.doesNotMatch(app, /accountant: \[[^\]]*"finance-full"/);
  assert.match(html, /finance-period-control" data-content-permission="finance-full"/);
  assert.match(html, /finance-metric--balance" data-content-permission="finance-full"/);
  assert.match(html, /finance-metric--position" data-content-permission="finance-full"/);
  assert.match(html, /finance-columns" data-content-permission="finance-full"/);
});

test("accountant finance identifies receivable and payable vouchers", async () => {
  const [html, app] = await Promise.all([read("index.html"), read("app.js")]);
  assert.match(html, /data-content-permission="finance-details"/);
  assert.match(html, /id="financeAccountantReceivableRows"/);
  assert.match(html, /id="financeAccountantPayableRows"/);
  assert.match(app, /function renderAccountantFinanceDetails\(\)/);
  assert.match(app, /\.filter\(\(sale\) => saleBalance\(sale\) > 0\)/);
  assert.match(app, /\.filter\(\(sale\) => voucherCostPayable\(sale\) > 0\)/);
  assert.match(app, /renderAccountantFinanceDetails\(\);/);
});

test("cloud sync is paginated, privately bootstrapped, and conserves D1 reads", async () => {
  const app = await read("app.js");
  assert.match(app, /SHARED_SYNC_ACTIVE_POLL_MS = 120000/);
  assert.match(app, /SHARED_SYNC_HIDDEN_POLL_MS = 600000/);
  assert.match(app, /fetchSyncPage/);
  assert.match(app, /entitiesHasMore/);
  assert.match(app, /cachedBusinessDataAvailable/);
  assert.match(app, /offline: cachedBusinessDataAvailable/);
  assert.match(app, /function fetchFullSharedState\(\)/);
  assert.match(app, /bootstrap: "full-state"/);
  assert.doesNotMatch(app, /Recovery bootstrap unavailable; using full cloud sync/);
  assert.match(app, /Never replace a device's newer cached work/);
  assert.match(app, /recovery: true/);
  assert.match(app, /function startSharedSync\(\)[\s\S]*?pullSharedStateAndReschedule\(\);[\s\S]*?pageshow[\s\S]*?refreshSharedSyncIfStale/);
  assert.doesNotMatch(app, /pageshow[^\n]*initial: true/);
  assert.doesNotMatch(app, /setInterval\(\(\) => pullSharedState\(\), 1500\)/);
});

test("worker exposes paginated sync, health metrics, and security headers", async () => {
  const worker = await read("cloudflare/worker.js");
  assert.match(worker, /snapshotVersion/);
  assert.match(worker, /SYNC_PAGE_SIZE_DEFAULT = 2000/);
  assert.match(worker, /sync_write_failed/);
  assert.match(worker, /D1_DAILY_READ_LIMIT/);
  assert.match(worker, /sync_read_failed/);
  assert.match(worker, /Strict-Transport-Security/);
  assert.match(worker, /Content-Security-Policy/);
});

test("cloud production orders sync to the Notion workflow board", async () => {
  const [worker, wrangler] = await Promise.all([read("cloudflare/worker.js"), read("wrangler.jsonc")]);
  assert.match(worker, /NOTION_API_VERSION = "2026-03-11"/);
  assert.match(worker, /status === "done"[\s\S]*?return "Done"/);
  assert.match(worker, /status === "accepted" \|\| status === "making"[\s\S]*?return "Working"/);
  assert.match(worker, /return "Ordered"/);
  assert.match(worker, /url\.pathname === "\/api\/notion\/sync"/);
  assert.match(worker, /async scheduled\(_controller, env, ctx\)/);
  assert.match(worker, /payload\?\.patch\?\.arrays\?\.productionOrders/);
  assert.match(worker, /function notionDashboardMetrics\(state\)/);
  assert.match(worker, /notion_owner_dashboard_sync/);
  assert.match(worker, /syncNotionOperations\(env\)/);
  assert.doesNotMatch(worker, /secret_[A-Za-z0-9]+/);
  assert.match(wrangler, /"NOTION_PRODUCTION_DATABASE_ID": "3ce1c942022e80ecad54d11bdfa8ecbb"/);
  assert.match(wrangler, /"NOTION_OWNER_DASHBOARD_PAGE_ID": "3ce1c942022e8090acd9fead57ccf753"/);
  assert.match(wrangler, /"crons": \["\*\/15 \* \* \* \*"\]/);
});

test("voucher numbers open the shared voucher summary popup across sale workflows", async () => {
  const app = await read("app.js");
  const receivables = app.match(/function renderReceivables\(\)[\s\S]*?function renderReceivablePaymentModal/)[0];
  const fulfillment = app.match(/function renderFulfillmentTable\(\)[\s\S]*?function girlfriendDayOrderRowHtml/)[0];
  const codeCheck = app.match(/function renderCodeCheckTable\(\)[\s\S]*?function markSavedSaleItemCodeNotRequired/)[0];

  assert.match(app, /function voucherPopupButton\(sale, fallback = "-"\)/);
  assert.match(app, /data-view-voucher="\$\{escapeHtml\(sale\.id\)\}"/);
  assert.match(receivables, /voucherPopupButton\(sale\)/);
  assert.match(fulfillment, /voucherPopupButton\(sale\)/);
  assert.match(codeCheck, /voucherPopupButton\(sale\)/);
  assert.match(app, /document\.addEventListener\("click", \(event\) => \{[\s\S]*?\[data-view-voucher\][\s\S]*?openPaymentHistoryModal/);
  assert.match(app, /Pickup \/ Delivery: \$\{escapeHtml\(fulfillmentDueDate\(sale\)/);
});

test("sticker printing hides the application shell and prints one 60x38 label per page", async () => {
  const [app, styles] = await Promise.all([read("app.js"), read("styles.css")]);
  const finalPrintOverride = styles.match(/sticker-print-final-v2[\s\S]*$/)?.[0] || "";
  assert.match(app, /function stickerDescription\(item\)[\s\S]*?`\$\{description\} \(\$\{paperColor\}\)`/);
  assert.match(app, /<small>\$\{escapeHtml\(stickerDescription\(item\)\)\}<\/small>/);
  assert.match(app, /wrapCanvasText\(context, stickerDescription\(item\),/);
  assert.match(app, /els\.labelDescription\.textContent = stickerDescription\(item\);/);
  assert.match(finalPrintOverride, /@page\s*\{[\s\S]*?size: 60mm 38mm;[\s\S]*?margin: 0;/);
  assert.match(finalPrintOverride, /body > :not\(#printArea\)\s*\{[\s\S]*?display: none !important;/);
  assert.match(finalPrintOverride, /body > #printArea\s*\{[\s\S]*?display: block !important;/);
  assert.match(finalPrintOverride, /#printArea > \.print-label\s*\{[\s\S]*?display: grid !important;[\s\S]*?width: 60mm !important;[\s\S]*?height: 38mm !important;[\s\S]*?break-after: page;/);
  assert.match(finalPrintOverride, /#printArea > \.print-label > \.label-barcode\s*\{[\s\S]*?display: block !important;[\s\S]*?height: 9mm !important;/);
  assert.match(finalPrintOverride, /#printArea > \.print-label > small\s*\{[\s\S]*?font-size: 12px !important;[\s\S]*?font-weight: 700 !important;/);
});

