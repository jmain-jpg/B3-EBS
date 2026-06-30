const STORAGE_KEY = "b3-floral-ebs-v2";
const LEGACY_STORAGE_KEY = "b3-floral-ebs-v1";
const STICKER_SETTINGS_KEY = "b3-floral-sticker-settings-v1";
const SHARED_STATE_ENDPOINT = "/api/state";

const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);

const roleLabels = {
  admin: "Admin - all access",
  production: "Production - stock / sticker",
  cashier: "Cashier - sale / voucher",
  cashier_expense: "Cashier + Expense",
  expense: "Expense - expense only",
  manager: "Manager - inventory / report",
};

const rolePermissions = {
  admin: ["home", "dashboard", "stock", "sticker", "sale", "production", "vouchers", "fulfillment", "expense", "inventory", "reports", "settings"],
  production: ["home", "dashboard", "stock", "sticker", "production", "inventory"],
  cashier: ["home", "dashboard", "sale", "production", "vouchers", "fulfillment", "inventory"],
  cashier_expense: ["home", "dashboard", "sale", "production", "vouchers", "fulfillment", "expense", "inventory"],
  expense: ["home", "expense"],
  manager: ["home", "dashboard", "inventory", "reports"],
};

const defaultFulfillmentMethod = "walkin";
const defaultFulfillmentStatus = "delivered";

const defaultStaff = [
  { id: "staff-admin", name: "Admin", role: "admin", locked: true },
  { id: "staff-ah-tun", name: "Ah Tun", role: "production", locked: true },
  { id: "staff-lone-lone", name: "Lone Lone", role: "production", locked: true },
  { id: "staff-cashier", name: "Cashier", role: "cashier" },
];
const defaultSalePersons = ["Admin", "Cashier"];

const defaultCategories = [
  { id: "cat-rose", name: "Rose Bouquet", prefix: "R", subcategories: ["Small", "Medium", "Premium"] },
  { id: "cat-mixed", name: "Mixed Bouquet", prefix: "B", subcategories: ["Birthday", "Love", "Congratulations"] },
  { id: "cat-money", name: "Money Bouquet", prefix: "M", subcategories: ["Normal", "Premium"] },
  { id: "cat-event", name: "Event Floral", prefix: "E", subcategories: ["Table", "Stage", "Lobby"] },
  { id: "cat-custom", name: "Custom Order", prefix: "C", subcategories: [] },
];
const paymentTypes = ["Cash", "KBZPay", "WavePay", "AYA Pay", "Bank Transfer"];

const state = loadState();
let selectedStockId = "";
let editingStockId = "";
let editingExpenseId = "";
let editingSaleId = "";
let activeSaleDraftId = "";
let reportMode = "day";
let saleItems = [];
let stickerSettings = loadStickerSettings();
let importRows = [];
let importHeaders = [];
let stickerQueue = [];
let activeSaleStep = "info";
let productionPhotoDraft = [];
let salePaymentDraft = [];
let editingProductionOrderId = "";
let sharedSyncReady = false;
let sharedSyncSaving = false;
let sharedSyncTimer = null;
let sharedSyncUpdatedAt = 0;

const els = {
  loginScreen: document.querySelector("#loginScreen"),
  loginForm: document.querySelector("#loginForm"),
  loginStaff: document.querySelector("#loginStaff"),
  loginPassword: document.querySelector("#loginPassword"),
  loginStatus: document.querySelector("#loginStatus"),
  appShell: document.querySelector("#appShell"),
  menuToggle: document.querySelector("#menuToggle"),
  logoutButton: document.querySelector("#logoutButton"),
  currentStaffName: document.querySelector("#currentStaffName"),
  currentStaffRole: document.querySelector("#currentStaffRole"),
  stockForm: document.querySelector("#stockForm"),
  saleForm: document.querySelector("#saleForm"),
  expenseForm: document.querySelector("#expenseForm"),
  expenseDate: document.querySelector("#expense input[name=\"expenseDate\"]"),
  stockStatus: document.querySelector("#stockStatus"),
  stickerStatus: document.querySelector("#stickerStatus"),
  saleStatus: document.querySelector("#saleStatus"),
  productionComposeStatus: document.querySelector("#productionComposeStatus"),
  metricStock: document.querySelector("#metricStock"),
  metricSales: document.querySelector("#metricSales"),
  metricExpense: document.querySelector("#metricExpense"),
  metricNet: document.querySelector("#metricNet"),
  metricProductionPending: document.querySelector("#metricProductionPending"),
  metricFulfillmentDue: document.querySelector("#metricFulfillmentDue"),
  quickActionGrid: document.querySelector("#quickActionGrid"),
  queueDateLabel: document.querySelector("#queueDateLabel"),
  todayWorkQueue: document.querySelector("#todayWorkQueue"),
  attentionQueue: document.querySelector("#attentionQueue"),
  labelCode: document.querySelector("#labelCode"),
  labelDescription: document.querySelector("#labelDescription"),
  labelPrice: document.querySelector("#labelPrice"),
  printArea: document.querySelector("#printArea"),
  stockCategory: document.querySelector("#stockCategory"),
  stockSubCategory: document.querySelector("#stockSubCategory"),
  stockFlorist: document.querySelector("#stockFlorist"),
  stockMode: document.querySelector("#stockMode"),
  stockModeSwitch: document.querySelector("#stockModeSwitch"),
  stockDateLabel: document.querySelector("#stockDateLabel"),
  stockCostLabel: document.querySelector("#stockCostLabel"),
  salePerson: document.querySelector("#salePerson"),
  fulfillmentDate: document.querySelector("input[name=\"fulfillmentDate\"]"),
  fulfillmentMethod: document.querySelector("select[name=\"fulfillmentMethod\"]"),
  fulfillmentStatus: document.querySelector("select[name=\"fulfillmentStatus\"]"),
  salePaymentType: document.querySelector("select[name=\"paymentType\"]"),
  paymentDate: document.querySelector("input[name=\"paymentDate\"]"),
  receivedAmount: document.querySelector("input[name=\"receivedAmount\"]"),
  saleItemType: document.querySelector("#saleItemType"),
  saleProductCode: document.querySelector("#saleProductCode"),
  saleProductCodeOptions: document.querySelector("#saleProductCodeOptions"),
  stockLookupDetails: document.querySelector("#stockLookupDetails"),
  manualDescription: document.querySelector("#manualDescription"),
  saleItemQty: document.querySelector("#saleItemQty"),
  saleItemPrice: document.querySelector("#saleItemPrice"),
  addSaleItemButton: document.querySelector("#addSaleItemButton"),
  openProductionOrderButton: document.querySelector("#openProductionOrderButton"),
  saveSaleButton: document.querySelector("#saveSaleButton"),
  productionOrderUrgency: document.querySelector("#productionOrderUrgency"),
  productionOrderVoucher: document.querySelector("#productionOrderVoucher"),
  productionOrderDate: document.querySelector("#productionOrderDate"),
  productionOrderPhotos: document.querySelector("#productionOrderPhotos"),
  productionOrderRequirement: document.querySelector("#productionOrderRequirement"),
  productionOrderPhotoPreview: document.querySelector("#productionOrderPhotoPreview"),
  sendProductionOrderButton: document.querySelector("#sendProductionOrderButton"),
  cancelProductionEditButton: document.querySelector("#cancelProductionEditButton"),
  newVoucherButton: document.querySelector("#newVoucherButton"),
  holdVoucherButton: document.querySelector("#holdVoucherButton"),
  deleteDraftButton: document.querySelector("#deleteDraftButton"),
  draftList: document.querySelector("#draftList"),
  saleItemList: document.querySelector("#saleItemList"),
  saleTotalPreview: document.querySelector("#saleTotalPreview"),
  saleTableTotal: document.querySelector("#saleTableTotal"),
  saleBalancePreview: document.querySelector("#saleBalancePreview"),
  cashierTotalDue: document.querySelector("#cashierTotalDue"),
  cashierAlreadyPaid: document.querySelector("#cashierAlreadyPaid"),
  cashierThisPayment: document.querySelector("#cashierThisPayment"),
  cashierBalanceAfter: document.querySelector("#cashierBalanceAfter"),
  salePaymentLineList: document.querySelector("#salePaymentLineList"),
  addSalePaymentLineButton: document.querySelector("#addSalePaymentLineButton"),
  saleItemModeSwitch: document.querySelector("#saleItemModeSwitch"),
  saleStepper: document.querySelector("#saleStepper"),
  voucherSearch: document.querySelector("#voucherSearch"),
  findVoucherButton: document.querySelector("#findVoucherButton"),
  loadVoucherButton: document.querySelector("#loadVoucherButton"),
  voucherPaymentDetails: document.querySelector("#voucherPaymentDetails"),
  extraPaymentDate: document.querySelector("#extraPaymentDate"),
  extraPaymentType: document.querySelector("#extraPaymentType"),
  extraPaymentAmount: document.querySelector("#extraPaymentAmount"),
  extraFulfillmentStatus: document.querySelector("#extraFulfillmentStatus"),
  addVoucherPaymentButton: document.querySelector("#addVoucherPaymentButton"),
  voucherHistorySearch: document.querySelector("#voucherHistorySearch"),
  voucherHistoryDate: document.querySelector("#voucherHistoryDate"),
  voucherHistoryTable: document.querySelector("#voucherHistoryTable"),
  fulfillmentSearch: document.querySelector("#fulfillmentSearch"),
  fulfillmentFilterDate: document.querySelector("#fulfillmentFilterDate"),
  fulfillmentFilterStatus: document.querySelector("#fulfillmentFilterStatus"),
  fulfillmentFilterMethod: document.querySelector("#fulfillmentFilterMethod"),
  fulfillmentTable: document.querySelector("#fulfillmentTable"),
  productionOrderSearch: document.querySelector("#productionOrderSearch"),
  productionOrderDateFilter: document.querySelector("#productionOrderDateFilter"),
  productionOrderList: document.querySelector("#productionOrderList"),
  productionOrderTable: document.querySelector("#productionOrderTable"),
  productionNewOrderCount: document.querySelector("#productionNewOrderCount"),
  inventoryTable: document.querySelector("#inventoryTable"),
  inventorySearch: document.querySelector("#inventorySearch"),
  inventoryCategoryFilter: document.querySelector("#inventoryCategoryFilter"),
  inventorySubCategoryFilter: document.querySelector("#inventorySubCategoryFilter"),
  inventoryTypeFilter: document.querySelector("#inventoryTypeFilter"),
  inventoryFilter: document.querySelector("#inventoryFilter"),
  printLatestButton: document.querySelector("#printLatestButton"),
  printStickerButton: document.querySelector("#printStickerButton"),
  stickerStockSelect: document.querySelector("#stickerStockSelect"),
  stickerCodeInput: document.querySelector("#stickerCodeInput"),
  stickerCodeOptions: document.querySelector("#stickerCodeOptions"),
  addStickerCodeButton: document.querySelector("#addStickerCodeButton"),
  clearStickerQueueButton: document.querySelector("#clearStickerQueueButton"),
  stickerQueue: document.querySelector("#stickerQueue"),
  stickerWidth: document.querySelector("#stickerWidth"),
  stickerHeight: document.querySelector("#stickerHeight"),
  stickerOrientation: document.querySelector("#stickerOrientation"),
  stickerCodeSize: document.querySelector("#stickerCodeSize"),
  stickerPriceSize: document.querySelector("#stickerPriceSize"),
  stickerShowPrice: document.querySelector("#stickerShowPrice"),
  stickerBorder: document.querySelector("#stickerBorder"),
  settingStickerWidth: document.querySelector("#settingStickerWidth"),
  settingStickerHeight: document.querySelector("#settingStickerHeight"),
  settingStickerOrientation: document.querySelector("#settingStickerOrientation"),
  settingStickerCodeSize: document.querySelector("#settingStickerCodeSize"),
  settingStickerPriceSize: document.querySelector("#settingStickerPriceSize"),
  settingStickerBorder: document.querySelector("#settingStickerBorder"),
  exportButton: document.querySelector("#exportButton"),
  exportModal: document.querySelector("#exportModal"),
  exportForm: document.querySelector("#exportForm"),
  exportType: document.querySelector("#exportType"),
  stockExportStatusWrap: document.querySelector("#stockExportStatusWrap"),
  importButton: document.querySelector("#importButton"),
  importModal: document.querySelector("#importModal"),
  importInput: document.querySelector("#importInput"),
  importType: document.querySelector("#importType"),
  importPaste: document.querySelector("#importPaste"),
  parseImportButton: document.querySelector("#parseImportButton"),
  applyImportButton: document.querySelector("#applyImportButton"),
  importStatus: document.querySelector("#importStatus"),
  importMapping: document.querySelector("#importMapping"),
  importPreviewHead: document.querySelector("#importPreviewHead"),
  importPreviewBody: document.querySelector("#importPreviewBody"),
  resetButton: document.querySelector("#resetButton"),
  summaryDate: document.querySelector("#summaryDate"),
  summaryMonth: document.querySelector("#summaryMonth"),
  summarySale: document.querySelector("#summarySale"),
  summaryCost: document.querySelector("#summaryCost"),
  summaryExpense: document.querySelector("#summaryExpense"),
  summaryProfit: document.querySelector("#summaryProfit"),
  reportInsightGrid: document.querySelector("#reportInsightGrid"),
  paymentSummary: document.querySelector("#paymentSummary"),
  paymentDetailList: document.querySelector("#paymentDetailList"),
  paymentHistoryModal: document.querySelector("#paymentHistoryModal"),
  paymentHistoryBody: document.querySelector("#paymentHistoryBody"),
  actionNoticeModal: document.querySelector("#actionNoticeModal"),
  actionNoticeIcon: document.querySelector("#actionNoticeIcon"),
  actionNoticeEyebrow: document.querySelector("#actionNoticeEyebrow"),
  actionNoticeTitle: document.querySelector("#actionNoticeTitle"),
  actionNoticeMessage: document.querySelector("#actionNoticeMessage"),
  actionNoticeDetails: document.querySelector("#actionNoticeDetails"),
  performanceSummary: document.querySelector("#performanceSummary"),
  staffForm: document.querySelector("#staffForm"),
  staffList: document.querySelector("#staffList"),
  salePersonForm: document.querySelector("#salePersonForm"),
  salePersonList: document.querySelector("#salePersonList"),
  categoryForm: document.querySelector("#categoryForm"),
  categoryList: document.querySelector("#categoryList"),
  salesHistory: document.querySelector("#salesHistory"),
  expenseHistory: document.querySelector("#expenseHistory"),
  expenseTable: document.querySelector("#expenseTable"),
  expenseTableTotal: document.querySelector("#expenseTableTotal"),
  stockEditModal: document.querySelector("#stockEditModal"),
  stockEditForm: document.querySelector("#stockEditForm"),
  editStockCategory: document.querySelector("#editStockCategory"),
  editStockSubCategory: document.querySelector("#editStockSubCategory"),
  editStockFlorist: document.querySelector("#editStockFlorist"),
};

els.stockForm.productionDate.value = today;
els.saleForm.saleDate.value = today;
els.fulfillmentDate.value = today;
els.fulfillmentMethod.value = defaultFulfillmentMethod;
els.fulfillmentStatus.value = defaultFulfillmentStatus;
els.paymentDate.value = today;
els.extraPaymentDate.value = today;
els.productionOrderDate.value = today;
els.expenseDate.value = today;
els.voucherHistoryDate.value = today;
els.fulfillmentFilterDate.value = today;
els.productionOrderDateFilter.value = today;
els.summaryDate.value = today;
els.summaryMonth.value = currentMonth;

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) return normalizeState(JSON.parse(stored));

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) return normalizeState(JSON.parse(legacy));

  return normalizeState({});
}

function loadStickerSettings() {
  const defaults = {
    width: 60,
    height: 38,
    orientation: "normal",
    codeSize: 30,
    priceSize: 17,
    showPrice: "yes",
    border: "none",
  };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem(STICKER_SETTINGS_KEY) || "{}") };
  } catch {
    return defaults;
  }
}

function saveStickerSettings() {
  localStorage.setItem(STICKER_SETTINGS_KEY, JSON.stringify(stickerSettings));
}

function normalizeState(raw) {
  const stock = Array.isArray(raw.stock) ? raw.stock : [];
  const sales = Array.isArray(raw.sales) ? raw.sales : [];
  const expenses = Array.isArray(raw.expenses) ? raw.expenses : [];
  const productionOrders = Array.isArray(raw.productionOrders) ? raw.productionOrders : [];
  const staff = (Array.isArray(raw.staff) && raw.staff.length ? raw.staff : defaultStaff).map((staff) => ({
    ...staff,
    password: staff.password || "",
  }));
  const salePersonNames = Array.isArray(raw.salePersons) && raw.salePersons.length
    ? raw.salePersons.map((person) => (typeof person === "string" ? person : person.name)).filter(Boolean)
    : [
        ...defaultSalePersons,
        ...staff.filter((item) => ["admin", "cashier", "cashier_expense"].includes(item.role)).map((item) => item.name),
        ...sales.map((sale) => sale.salePerson).filter(Boolean),
      ];
  const salePersons = [...new Set(salePersonNames.map((name) => name.trim()).filter(Boolean))].map((name, index) => {
    const existing = Array.isArray(raw.salePersons) ? raw.salePersons.find((person) => (typeof person === "string" ? person : person.name) === name) : null;
    return typeof existing === "object" && existing
      ? { ...existing, id: existing.id || `sale-person-${index}`, name }
      : { id: `sale-person-${index}-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "name"}`, name };
  });

  return {
    stock: stock.map((item) => ({
      ...item,
      itemType: item.itemType || "floral",
      florist: item.florist || item.producer || "",
      subCategory: item.subCategory || "",
      productionCost: Number(item.productionCost || 0),
      salePrice: Number(item.salePrice || 0),
      unitCost: Number(item.unitCost ?? item.productionCost ?? 0),
      quantityTotal: item.itemType === "sku" ? Number(item.quantityTotal || item.quantity || item.quantityAvailable || 0) : 1,
      quantityAvailable:
        item.itemType === "sku"
          ? Number(item.quantityAvailable ?? item.quantityTotal ?? item.quantity ?? 0)
          : item.status === "sold"
            ? 0
            : 1,
      status:
        item.itemType === "sku"
          ? Number(item.quantityAvailable ?? item.quantityTotal ?? item.quantity ?? 0) > 0
            ? "available"
            : "sold"
          : item.status || "available",
    })),
    sales: sales.map(normalizeSale),
    expenses: expenses.map((expense) => ({
      ...expense,
      description: expense.description || expense.expenseCategory || expense.note || "",
      amount: Number(expense.amount || 0),
      paidBy: expense.paidBy || "",
    })),
    productionOrders: productionOrders.map((order) => ({
      ...order,
      status: order.status || "new",
      urgency: order.urgency || "normal",
      photos: Array.isArray(order.photos) ? order.photos : [],
      items: Array.isArray(order.items) ? order.items : [],
      requirement: order.requirement || "",
      createdAt: order.createdAt || new Date().toISOString(),
      updatedAt: order.updatedAt || order.createdAt || new Date().toISOString(),
    })),
    staff,
    salePersons,
    saleDrafts: Array.isArray(raw.saleDrafts)
      ? raw.saleDrafts.map((draft) => ({
          ...draft,
          items: Array.isArray(draft.items) ? draft.items : [],
          paymentLines: Array.isArray(draft.paymentLines)
            ? draft.paymentLines.map((payment) => ({ ...payment, amount: Number(payment.amount || 0) }))
            : [],
          receivedAmount: draft.receivedAmount || "",
          fulfillmentDate: draft.fulfillmentDate || draft.saleDate || today,
          fulfillmentMethod: draft.fulfillmentMethod || defaultFulfillmentMethod,
          fulfillmentStatus: draft.fulfillmentStatus || defaultFulfillmentStatus,
          editingSaleId: draft.editingSaleId || "",
          updatedAt: draft.updatedAt || draft.createdAt || new Date().toISOString(),
        }))
      : [],
    categories: (Array.isArray(raw.categories) && raw.categories.length ? raw.categories : defaultCategories).map((category) => ({
      ...category,
      prefix: String(category.prefix || category.name?.[0] || "X").toUpperCase(),
      subcategories: Array.isArray(category.subcategories) ? category.subcategories : [],
    })),
    currentStaffId: raw.currentStaffId || "",
  };
}

function normalizeSale(sale) {
  if (Array.isArray(sale.items)) {
    const items = sale.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      unitPrice: Number(item.unitPrice || item.price || 0),
      cost: Number(item.cost || 0),
    }));
    return {
      ...sale,
      items,
      fulfillmentDate: sale.fulfillmentDate || sale.deliveryDate || sale.saleDate || today,
      fulfillmentMethod: sale.fulfillmentMethod || sale.deliveryMethod || "pickup",
      fulfillmentStatus: sale.fulfillmentStatus || (sale.delivered ? "delivered" : "pending"),
      totalPrice: Number(sale.totalPrice || items.reduce((sum, item) => sum + Number(item.price || 0), 0)),
      productionCost: Number(sale.productionCost || items.reduce((sum, item) => sum + Number(item.cost || 0), 0)),
      payments: normalizePayments(sale),
    };
  }

  const item = {
    id: uid("item"),
    type: sale.productCode ? "stock" : "manual",
    stockId: sale.stockId || "",
    productCode: sale.productCode || "",
    description: sale.productCode || sale.note || "Manual item",
    quantity: 1,
    price: Number(sale.totalPrice || 0),
    unitPrice: Number(sale.totalPrice || 0),
    cost: Number(sale.productionCost || 0),
  };

  return {
    ...sale,
    items: [item],
    fulfillmentDate: sale.fulfillmentDate || sale.deliveryDate || sale.saleDate || today,
    fulfillmentMethod: sale.fulfillmentMethod || sale.deliveryMethod || "pickup",
    fulfillmentStatus: sale.fulfillmentStatus || (sale.delivered ? "delivered" : "pending"),
    totalPrice: Number(sale.totalPrice || 0),
    productionCost: Number(sale.productionCost || 0),
    payments: normalizePayments(sale),
  };
}

function normalizePayments(sale) {
  if (Array.isArray(sale.payments)) {
    return sale.payments.map((payment) => ({
      id: payment.id || uid("payment"),
      paymentDate: payment.paymentDate || sale.saleDate || today,
      paymentType: payment.paymentType || sale.paymentType || "Cash",
      amount: Number(payment.amount || 0),
      note: payment.note || "",
    }));
  }

  return sale.totalPrice
    ? [
        {
          id: uid("payment"),
          paymentDate: sale.paymentDate || sale.saleDate || today,
          paymentType: sale.paymentType || "Cash",
          amount: Number(sale.totalPrice || 0),
          note: "Initial payment",
        },
      ]
    : [];
}

function saveLocalState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function sharedStatePayload() {
  const { currentStaffId, ...sharedState } = state;
  return sharedState;
}

function saveState() {
  saveLocalState();
  queueSharedStateSave();
}

function stateBusinessScore(data) {
  return (
    (data.stock || []).length * 4 +
    (data.sales || []).length * 5 +
    (data.expenses || []).length * 3 +
    (data.productionOrders || []).length * 3 +
    (data.saleDrafts || []).length +
    Math.max(0, (data.salePersons || []).length - defaultSalePersons.length) +
    Math.max(0, (data.staff || []).length - defaultStaff.length) +
    Math.max(0, (data.categories || []).length - defaultCategories.length)
  );
}

function applySharedState(nextState) {
  const currentStaffId = state.currentStaffId;
  const normalized = normalizeState(nextState || {});
  normalized.currentStaffId = currentStaffId;
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, normalized);
  saveLocalState();
  selectedStockId = "";
  editingStockId = "";
  editingExpenseId = "";
  editingSaleId = "";
  activeSaleDraftId = "";
  saleItems = [];
}

async function fetchSharedState() {
  const response = await fetch(`${SHARED_STATE_ENDPOINT}?t=${Date.now()}`, { cache: "no-store" });
  if (!response.ok) throw new Error("Shared data server unavailable");
  return response.json();
}

async function pushSharedState() {
  if (!sharedSyncReady || sharedSyncSaving) return;
  sharedSyncSaving = true;
  try {
    const response = await fetch(SHARED_STATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ state: sharedStatePayload() }),
    });
    if (response.ok) {
      const record = await response.json();
      sharedSyncUpdatedAt = Number(record.updatedAt || Date.now());
    }
  } catch {
    sharedSyncReady = false;
  } finally {
    sharedSyncSaving = false;
  }
}

function queueSharedStateSave() {
  if (!sharedSyncReady) return;
  clearTimeout(sharedSyncTimer);
  sharedSyncTimer = setTimeout(pushSharedState, 350);
}

async function pullSharedState({ initial = false } = {}) {
  if (sharedSyncSaving) return;
  try {
    const record = await fetchSharedState();
    const remoteState = normalizeState(record.state || {});
    const remoteUpdatedAt = Number(record.updatedAt || 0);
    const localScore = stateBusinessScore(state);
    const remoteScore = stateBusinessScore(remoteState);

    sharedSyncReady = true;
    if (initial && localScore > remoteScore) {
      await pushSharedState();
      return;
    }

    if (remoteScore > localScore || (!initial && remoteUpdatedAt > sharedSyncUpdatedAt)) {
      applySharedState(remoteState);
      sharedSyncUpdatedAt = remoteUpdatedAt;
      renderAll();
      return;
    }

    sharedSyncUpdatedAt = Math.max(sharedSyncUpdatedAt, remoteUpdatedAt);
    window.b3SharedSync = { ready: sharedSyncReady, updatedAt: sharedSyncUpdatedAt, localScore, remoteScore };
  } catch {
    sharedSyncReady = false;
    window.b3SharedSync = { ready: false, error: true };
  }
}

function startSharedSync() {
  if (!location.protocol.startsWith("http")) return;
  pullSharedState({ initial: true });
  setInterval(() => {
    if (sharedSyncReady) pullSharedState();
  }, 5000);
}

window.b3ForcePullSharedData = async () => {
  const record = await fetchSharedState();
  applySharedState(record.state || {});
  sharedSyncReady = true;
  sharedSyncUpdatedAt = Number(record.updatedAt || Date.now());
  renderAll();
  return window.b3SharedSync = { ready: true, updatedAt: sharedSyncUpdatedAt, forced: true, remoteScore: stateBusinessScore(state) };
};

function uid(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function money(value) {
  return `${Number(value || 0).toLocaleString("en-US")} MMK`;
}

function normalizeCode(code) {
  return code.trim().toUpperCase();
}

function selectedCategory() {
  return state.categories.find((category) => category.name === els.stockCategory.value);
}

function nextProductCode(categoryName) {
  const category = state.categories.find((item) => item.name === categoryName);
  const prefix = String(category?.prefix || categoryName?.[0] || "X").toUpperCase();
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const codePattern = new RegExp(`^${escapedPrefix}(\\d+)$`, "i");
  const numbers = state.stock
    .map((item) => normalizeCode(item.productCode).match(codePattern)?.[1])
    .filter(Boolean);
  const width = Math.max(4, ...numbers.map((value) => value.length));
  const next = numbers.length ? Math.max(...numbers.map(Number)) + 1 : 1;
  return `${prefix}${String(next).padStart(width, "0")}`;
}

function maybeAutoProductCode(force = false) {
  if (editingStockId || !els.stockCategory.value) return;
  const current = normalizeCode(els.stockForm.productCode.value || "");
  if (force || !current || /^FS-\d+$/i.test(current) || /^FS-\d*$/i.test(current)) {
    els.stockForm.productCode.value = nextProductCode(els.stockCategory.value);
  }
}

function forceAutoProductCode() {
  if (!editingStockId && els.stockCategory.value) {
    els.stockForm.productCode.value = nextProductCode(els.stockCategory.value);
  }
}

function renderStockEntryMode() {
  const mode = els.stockMode.value || "floral";
  document.querySelectorAll("[data-stock-entry-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.stockEntryMode === mode);
  });
  document.querySelectorAll("[data-stock-mode]").forEach((node) => {
    node.hidden = !node.dataset.stockMode.split(/\s+/).includes(mode);
  });

  const form = els.stockForm;
  form.paperColor.required = mode === "floral";
  form.florist.required = mode === "floral";
  form.quantity.required = mode === "sku";
  els.stockDateLabel.innerHTML = `${mode === "sku" ? "Purchase Date" : "Production Date"} <span class="req">*</span>`;
  els.stockCostLabel.textContent = mode === "sku" ? "Purchase Cost / Unit" : "Production Cost";
  form.productCode.placeholder = mode === "sku" ? "BB-001 / DOLL-01" : "FS-0001";
  form.description.placeholder = mode === "sku" ? "Blind box / Doll / quantity stock item" : "Red rose bouquet, medium size";
  if (mode === "sku" && !form.quantity.value) form.quantity.value = "1";
  maybeAutoProductCode();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function byDateDesc(a, b, key) {
  return String(b[key] || "").localeCompare(String(a[key] || ""));
}

function currentStaff() {
  return state.staff.find((staff) => staff.id === state.currentStaffId);
}

function hasPermission(permission) {
  const staff = currentStaff();
  if (!staff) return false;
  return rolePermissions[staff.role]?.includes(permission);
}

function requestedView() {
  return (location.hash || "#dashboard").replace("#", "") || "dashboard";
}

function canOpenView(view) {
  return hasPermission(view);
}

function firstAllowedView() {
  const staff = currentStaff();
  return rolePermissions[staff?.role]?.[0] || "dashboard";
}

function showView(nextView = requestedView()) {
  const view = canOpenView(nextView) ? nextView : firstAllowedView();
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === view);
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === view);
  });
  if (location.hash !== `#${view}`) {
    history.replaceState(null, "", `#${view}`);
  }
}

function goToView(view) {
  location.hash = `#${view}`;
  showView(view);
}

function newProductionOrderCount() {
  return state.productionOrders.filter((order) => (order.status || "new") === "new").length;
}

function pendingProductionOrderCount() {
  return (state.productionOrders || []).filter((order) => order.status !== "done").length;
}

function todayFulfillmentDueCount() {
  return state.sales.filter(
    (sale) => (sale.fulfillmentStatus || "pending") !== "delivered" && (sale.fulfillmentDate || sale.saleDate) === today
  ).length;
}

function fulfillmentAttentionCount() {
  return state.sales.filter(
    (sale) => (sale.fulfillmentStatus || "pending") !== "delivered" && (sale.fulfillmentDate || sale.saleDate) <= today
  ).length;
}

function renderNavBadges() {
  const productionCount = newProductionOrderCount();
  document.querySelectorAll('[data-nav-badge="production"]').forEach((badge) => {
    badge.textContent = productionCount;
    badge.hidden = productionCount <= 0;
  });

  const fulfillmentCount = fulfillmentAttentionCount();
  document.querySelectorAll('[data-nav-badge="fulfillment"]').forEach((badge) => {
    badge.textContent = fulfillmentCount;
    badge.hidden = fulfillmentCount <= 0;
  });
}

function setSaleStep(step, options = {}) {
  activeSaleStep = step;
  document.querySelectorAll("[data-sale-step]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.saleStep === step);
  });
  document.querySelectorAll("[data-step-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.stepPanel === step);
  });
  if (options.scroll) {
    document.querySelector(`[data-step-panel="${step}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

window.setSaleStep = setSaleStep;

function clearFieldErrors() {
  document.querySelectorAll(".field-error").forEach((field) => field.classList.remove("field-error"));
}

function requireField(control, label, step) {
  if (control?.value) return true;
  clearFieldErrors();
  setSaleStep(step);
  control.classList.add("field-error");
  control.focus();
  els.saleStatus.textContent = `${label} ထည့်ပါ`;
  showSaleNotice("warning", "လိုအပ်ချက်ရှိနေပါတယ်", `${label} ထည့်ပေးပါ`, [
    step === "info" ? "Step 1 - Voucher Info ကိုစစ်ပါ" : "Step 3 - Payment ကိုစစ်ပါ",
  ]);
  return false;
}

function validateSaleRequiredFields() {
  const form = els.saleForm;
  return (
    requireField(form.saleDate, "Sale Date", "info") &&
    requireField(form.voucherNumber, "Voucher Number", "info") &&
    requireField(form.salePerson, "Sale Person", "info") &&
    requireField(els.paymentDate, "Payment Date", "payment") &&
    requireField(els.salePaymentType, "Payment Type", "payment")
  );
}

function currentPaymentInput() {
  const amount = Number(els.receivedAmount.value || 0);
  if (!amount) return null;
  return {
    id: uid("payment"),
    paymentDate: els.paymentDate.value || today,
    paymentType: els.salePaymentType.value || "Cash",
    amount,
  };
}

function pendingSalePayments({ includeCurrent = false } = {}) {
  const payments = salePaymentDraft.map((payment) => ({ ...payment, amount: Number(payment.amount || 0) }));
  const current = includeCurrent ? currentPaymentInput() : null;
  if (current) payments.push(current);
  return payments;
}

function pendingSalePaymentTotal({ includeCurrent = false } = {}) {
  return pendingSalePayments({ includeCurrent }).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function renderSalePaymentLines() {
  if (!els.salePaymentLineList) return;
  const current = currentPaymentInput();
  const rows = salePaymentDraft
    .map(
      (payment, index) => `
        <div class="payment-line-row">
          <span>${index + 1}</span>
          <strong>${escapeHtml(payment.paymentType)}</strong>
          <small>${escapeHtml(payment.paymentDate)}</small>
          <b>${money(payment.amount)}</b>
          <button class="icon-button danger" type="button" data-remove-sale-payment-line="${payment.id}" title="Remove payment line">x</button>
        </div>
      `
    )
    .join("");

  const currentHint = current
    ? `<div class="payment-line-row current-line">
        <span>+</span>
        <strong>${escapeHtml(current.paymentType)}</strong>
        <small>${escapeHtml(current.paymentDate)}</small>
        <b>${money(current.amount)}</b>
      </div>`
    : "";

  els.salePaymentLineList.innerHTML =
    rows || currentHint
      ? `${rows}${currentHint}`
      : `<div class="empty compact-empty">Payment မရသေးရင် blank ထားပြီး Voucher သိမ်းလို့ရပါတယ်</div>`;
}

function isInPeriod(date) {
  if (reportMode === "month") return date?.slice(0, 7) === els.summaryMonth.value;
  return date === els.summaryDate.value;
}

function activeStaff() {
  return state.staff.filter((staff) => !staff.removed);
}

function productionStaff() {
  return activeStaff().filter((staff) => staff.role === "production");
}

function salesStaff() {
  return activeStaff().filter((staff) => ["cashier", "cashier_expense", "admin"].includes(staff.role));
}

function activeSalePersons() {
  return (state.salePersons || []).filter((person) => !person.removed);
}

function populateSelect(select, options, placeholder = "") {
  select.innerHTML = [
    placeholder ? `<option value="">${escapeHtml(placeholder)}</option>` : "",
    ...options.map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`),
  ].join("");
}

function renderLogin() {
  populateSelect(
    els.loginStaff,
    activeStaff().map((staff) => ({ value: staff.id, label: `${staff.name} (${roleLabels[staff.role]})` }))
  );

  const loggedIn = Boolean(currentStaff());
  els.loginScreen.hidden = loggedIn;
  document.body.classList.toggle("is-locked", !loggedIn);
}

function renderPermissions() {
  const staff = currentStaff();
  if (!staff) return;

  els.currentStaffName.textContent = staff.name;
  els.currentStaffRole.textContent = roleLabels[staff.role] || staff.role;

  document.querySelectorAll("[data-permission]").forEach((section) => {
    section.classList.toggle("is-denied", !hasPermission(section.dataset.permission));
  });

  document.querySelectorAll("[data-dashboard-permission]").forEach((node) => {
    node.hidden = !hasPermission(node.dataset.dashboardPermission);
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const nav = link.dataset.nav;
    link.classList.toggle("is-denied", !hasPermission(nav));
  });
}

function renderDropdowns() {
  const previousCategory = els.stockCategory.value;
  const previousInventoryCategory = els.inventoryCategoryFilter.value;
  const previousInventorySubCategory = els.inventorySubCategoryFilter.value;

  populateSelect(
    els.stockCategory,
    state.categories.map((category) => ({ value: category.name, label: category.name })),
    "Choose"
  );
  if (previousCategory) els.stockCategory.value = previousCategory;
  renderSubcategories();

  populateSelect(
    els.stockFlorist,
    productionStaff().map((staff) => ({ value: staff.name, label: staff.name })),
    "Choose florist"
  );
  populateSelect(
    els.editStockFlorist,
    productionStaff().map((staff) => ({ value: staff.name, label: staff.name })),
    "Choose florist"
  );

  populateSelect(
    els.salePerson,
    activeSalePersons().map((person) => ({ value: person.name, label: person.name })),
    "Choose sale person"
  );

  populateSelect(
    els.stickerStockSelect,
    state.stock
      .slice()
      .sort((a, b) => String(a.productCode || "").localeCompare(String(b.productCode || "")))
      .map((item) => ({
        value: item.id,
        label: `${item.productCode} - ${item.description || ""}${item.status === "sold" ? " (sold)" : ""}`,
      })),
    "ထုတ်မည့် code ရွေးပါ"
  );
  if (selectedStockId) els.stickerStockSelect.value = selectedStockId;
  els.stickerCodeOptions.innerHTML = state.stock
    .map((item) => `<option value="${escapeHtml(item.productCode)}">${escapeHtml(item.description || "")}</option>`)
    .join("");
  renderSaleCodeOptions();

  populateSelect(
    els.inventoryCategoryFilter,
    state.categories.map((category) => ({ value: category.name, label: category.name })),
    "All Categories"
  );
  if (previousInventoryCategory) els.inventoryCategoryFilter.value = previousInventoryCategory;
  renderInventorySubcategoryFilter(previousInventorySubCategory);
  renderStockEditCategoryOptions();
}

function renderSaleCodeOptions() {
  if (!els.saleProductCodeOptions) return;
  els.saleProductCodeOptions.innerHTML = state.stock
    .map((item) => {
      const label =
        item.itemType === "sku"
          ? `${item.description || ""} | Qty ${item.quantityAvailable || 0} | ${money(item.salePrice)}`
          : `${item.description || ""} | ${item.status || "available"}`;
      return `<option value="${escapeHtml(item.productCode)}" label="${escapeHtml(label)}"></option>`;
    })
    .join("");
}

function renderSubcategories() {
  const category = state.categories.find((item) => item.name === els.stockCategory.value);
  const subcategories = category?.subcategories || [];
  populateSelect(
    els.stockSubCategory,
    subcategories.map((subCategory) => ({ value: subCategory, label: subCategory })),
    "မရွေးထား"
  );
}

function renderInventorySubcategoryFilter(previousValue = "") {
  const category = state.categories.find((item) => item.name === els.inventoryCategoryFilter.value);
  const subcategories = category
    ? category.subcategories
    : [...new Set(state.categories.flatMap((item) => item.subcategories || []))];
  populateSelect(
    els.inventorySubCategoryFilter,
    subcategories.map((subCategory) => ({ value: subCategory, label: subCategory })),
    "All Sub Categories"
  );
  if (previousValue) els.inventorySubCategoryFilter.value = previousValue;
}

function renderStockEditCategoryOptions(previousCategory = "", previousSubCategory = "") {
  populateSelect(
    els.editStockCategory,
    state.categories.map((category) => ({ value: category.name, label: category.name })),
    "Choose"
  );
  if (previousCategory) els.editStockCategory.value = previousCategory;
  renderStockEditSubcategories(previousSubCategory);
}

function renderStockEditSubcategories(previousValue = "") {
  const category = state.categories.find((item) => item.name === els.editStockCategory.value);
  populateSelect(
    els.editStockSubCategory,
    (category?.subcategories || []).map((subCategory) => ({ value: subCategory, label: subCategory })),
    "မရွေးထား"
  );
  if (previousValue) els.editStockSubCategory.value = previousValue;
}

function setControlValue(control, value) {
  if (control) control.value = value;
}

function stickerSettingValue(settingControl, fallbackControl, fallbackValue) {
  return settingControl?.value || fallbackControl?.value || fallbackValue;
}

function applyStickerSettings() {
  setControlValue(els.stickerWidth, stickerSettings.width);
  setControlValue(els.stickerHeight, stickerSettings.height);
  setControlValue(els.stickerOrientation, stickerSettings.orientation);
  setControlValue(els.stickerCodeSize, stickerSettings.codeSize);
  setControlValue(els.stickerPriceSize, stickerSettings.priceSize);
  setControlValue(els.stickerShowPrice, stickerSettings.showPrice);
  setControlValue(els.stickerBorder, stickerSettings.border);
  setControlValue(els.settingStickerWidth, stickerSettings.width);
  setControlValue(els.settingStickerHeight, stickerSettings.height);
  setControlValue(els.settingStickerOrientation, stickerSettings.orientation);
  setControlValue(els.settingStickerCodeSize, stickerSettings.codeSize);
  setControlValue(els.settingStickerPriceSize, stickerSettings.priceSize);
  setControlValue(els.settingStickerBorder, stickerSettings.border);
  const root = document.documentElement;
  root.style.setProperty("--sticker-width", `${stickerSettings.width}mm`);
  root.style.setProperty("--sticker-height", `${stickerSettings.height}mm`);
  root.style.setProperty("--sticker-code-size", `${stickerSettings.codeSize}px`);
  root.style.setProperty("--sticker-price-size", `${stickerSettings.priceSize}px`);
  root.style.setProperty("--sticker-price-display", stickerSettings.showPrice === "yes" ? "block" : "none");
  root.style.setProperty("--sticker-border", stickerSettings.border === "light" ? "1px solid #d7d7d7" : "0");
  root.style.setProperty("--sticker-transform", stickerSettings.orientation === "rotate" ? "rotate(90deg)" : "none");
}

function updateStickerSettings() {
  stickerSettings = {
    width: Number(stickerSettingValue(els.settingStickerWidth, els.stickerWidth, 60)),
    height: Number(stickerSettingValue(els.settingStickerHeight, els.stickerHeight, 38)),
    orientation: stickerSettingValue(els.settingStickerOrientation, els.stickerOrientation, "normal"),
    codeSize: Number(stickerSettingValue(els.settingStickerCodeSize, els.stickerCodeSize, 30)),
    priceSize: Number(stickerSettingValue(els.settingStickerPriceSize, els.stickerPriceSize, 17)),
    showPrice: els.stickerShowPrice.value,
    border: stickerSettingValue(els.settingStickerBorder, els.stickerBorder, "none"),
  };
  saveStickerSettings();
  applyStickerSettings();
  els.labelPrice.hidden = stickerSettings.showPrice !== "yes";
  renderPrintArea();
}

function getSelectedStock() {
  return state.stock.find((item) => item.id === selectedStockId);
}

function stockByCode(code) {
  const normalized = normalizeCode(code);
  return state.stock.find((item) => item.productCode === normalized);
}

function setSelectedStock(id) {
  selectedStockId = id;
  if (els.stickerStockSelect.value !== id) els.stickerStockSelect.value = id;
  const item = getSelectedStock();
  if (item) els.stickerCodeInput.value = item.productCode;
  else els.stickerCodeInput.value = "";
  renderSticker();
}

function stickerItemsToPrint() {
  const queueItems = stickerQueue.map((id) => state.stock.find((item) => item.id === id)).filter(Boolean);
  if (queueItems.length) return queueItems;
  const selected = getSelectedStock();
  return selected ? [selected] : [];
}

function stickerLabelHtml(item) {
  return `
    <div class="print-label">
      <span>B3 Floral Shop</span>
      <strong>${escapeHtml(item.productCode)}</strong>
      <small>${escapeHtml(item.description || "No description")}</small>
      <b>${escapeHtml(`Sale Price: ${money(item.salePrice)}`)}</b>
    </div>
  `;
}

function renderPrintArea() {
  els.printArea.innerHTML = stickerItemsToPrint().map(stickerLabelHtml).join("");
}

function renderStickerQueue() {
  els.stickerQueue.innerHTML = stickerQueue.length
    ? stickerQueue
        .map((id) => {
          const item = state.stock.find((stockItem) => stockItem.id === id);
          if (!item) return "";
          return `<button class="sticker-chip" type="button" data-remove-sticker="${item.id}">${escapeHtml(item.productCode)} <span>x</span></button>`;
        })
        .join("")
    : `<span class="muted">Bulk ထုတ်မယ်ဆိုရင် code ရိုက်ပြီး Add နှိပ်ပါ။ မထည့်ရင် Product Code ရွေးပြီး တစ်ခုထဲထုတ်ပါမယ်။</span>`;
  renderPrintArea();
}

function addStickerCodeToQueue() {
  const item = stockByCode(els.stickerCodeInput.value) || state.stock.find((stockItem) => stockItem.id === els.stickerStockSelect.value);
  if (!item) {
    els.stickerStatus.textContent = "Product Code ရွေးပါ";
    return;
  }
  selectedStockId = item.id;
  if (!stickerQueue.includes(item.id)) stickerQueue.push(item.id);
  els.stickerCodeInput.value = "";
  els.stickerStatus.textContent = `${item.productCode} list ထဲထည့်ပြီး`;
  renderSticker();
}

function renderSticker() {
  applyStickerSettings();
  const item = getSelectedStock();
  if (!item) {
    els.labelCode.textContent = "No stock selected";
    els.labelDescription.textContent = "Stock ထည့်ပြီး sticker ထုတ်ပါ";
    els.labelPrice.textContent = "Sale Price";
    els.labelPrice.hidden = stickerSettings.showPrice !== "yes";
    renderPrintArea();
    return;
  }

  els.labelCode.textContent = item.productCode;
  els.labelDescription.textContent = item.description || "No description";
  els.labelPrice.textContent = `Sale Price: ${money(item.salePrice)}`;
  els.labelPrice.hidden = stickerSettings.showPrice !== "yes";
  renderStickerQueue();
}

function openModal(modal) {
  modal.hidden = false;
  document.body.classList.add("has-modal");
}

function closeModal(modal) {
  modal.hidden = true;
  document.body.classList.remove("has-modal");
  if (modal === els.stockEditModal) {
    editingStockId = "";
    els.stockEditForm.reset();
  }
}

function showActionNotice({ type = "success", eyebrow = "Cashier", title, message, details = [] }) {
  if (!els.actionNoticeModal) return;
  const icons = {
    success: "✓",
    warning: "!",
    error: "!",
    info: "i",
  };
  els.actionNoticeModal.dataset.noticeType = type;
  els.actionNoticeIcon.textContent = icons[type] || icons.info;
  els.actionNoticeEyebrow.textContent = eyebrow;
  els.actionNoticeTitle.textContent = title;
  els.actionNoticeMessage.textContent = message;
  const detailItems = details.filter(Boolean);
  els.actionNoticeDetails.hidden = detailItems.length === 0;
  els.actionNoticeDetails.innerHTML = detailItems.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
  openModal(els.actionNoticeModal);
}

function showSaleNotice(type, title, message, details = []) {
  showActionNotice({ type, eyebrow: "Cashier Voucher", title, message, details });
}

function cloneSaleForCompare(sale) {
  return sale ? JSON.parse(JSON.stringify(sale)) : null;
}

function paymentLinesText(payments) {
  return (payments || [])
    .filter((payment) => Number(payment.amount || 0) > 0)
    .map((payment) => `${money(payment.amount)} (${payment.paymentType || "Cash"} • ${payment.paymentDate || today})`);
}

function saleItemSignature(item) {
  return [
    item.type || "",
    item.stockId || "",
    item.productCode || "",
    item.description || "",
    Number(item.quantity || 1),
    Number(item.price || 0),
  ].join("|");
}

function describeSaleChanges(beforeSale, sale, addedPayments = []) {
  if (!beforeSale) {
    return [
      `Voucher item: ${(sale.items || []).length} ခု`,
      `Total: ${money(sale.totalPrice)}`,
      ...paymentLinesText(addedPayments).map((line) => `ငွေလက်ခံ: ${line}`),
      `Balance: ${money(saleBalance(sale))}`,
    ];
  }

  const details = [];
  const fieldChecks = [
    ["Voucher Number", beforeSale.voucherNumber, sale.voucherNumber],
    ["Sale Date", beforeSale.saleDate, sale.saleDate],
    ["Sale Person", beforeSale.salePerson, sale.salePerson],
    ["Pickup / Delivery Date", beforeSale.fulfillmentDate, sale.fulfillmentDate],
    ["Pickup / Delivery Method", fulfillmentMethodLabel(beforeSale.fulfillmentMethod), fulfillmentMethodLabel(sale.fulfillmentMethod)],
    ["ပစ္စည်းပေးအခြေအနေ", fulfillmentStatusLabel(beforeSale.fulfillmentStatus), fulfillmentStatusLabel(sale.fulfillmentStatus)],
  ];
  fieldChecks.forEach(([label, before, after]) => {
    if (String(before || "") !== String(after || "")) details.push(`${label}: ${before || "-"} → ${after || "-"}`);
  });

  const beforeItems = beforeSale.items || [];
  const afterItems = sale.items || [];
  const beforeItemText = beforeItems.map(saleItemSignature).sort().join("||");
  const afterItemText = afterItems.map(saleItemSignature).sort().join("||");
  if (beforeItemText !== afterItemText) details.push(`Item list ပြင်ပြီး: ${beforeItems.length} ခု → ${afterItems.length} ခု`);

  if (Number(beforeSale.totalPrice || 0) !== Number(sale.totalPrice || 0)) {
    details.push(`Total Amount: ${money(beforeSale.totalPrice)} → ${money(sale.totalPrice)}`);
  }

  if (String(beforeSale.note || "") !== String(sale.note || "")) details.push("Note ပြင်ပြီး");

  details.push(...paymentLinesText(addedPayments).map((line) => `ငွေထပ်သွင်း: ${line}`));

  if (!details.length) details.push("ပြောင်းလဲချက်မတွေ့ပါ၊ voucher ကိုပြန်သိမ်းထားပါတယ်");
  details.push(`Paid: ${money(salePaid(sale))}`);
  details.push(`Balance: ${money(saleBalance(sale))}`);
  return details;
}

function addStock(form) {
  if (!hasPermission("stock")) return;
  const mode = form.stockMode.value || "floral";
  const productCode = normalizeCode(form.productCode.value);
  const existingItem = editingStockId ? state.stock.find((item) => item.id === editingStockId) : null;
  const duplicateItem = state.stock.find((item) => item.productCode === productCode && item.id !== editingStockId);

  if (duplicateItem && !(mode === "sku" && duplicateItem.itemType === "sku" && !editingStockId)) {
    els.stockStatus.textContent = "Code duplicate ဖြစ်နေသည်";
    return;
  }

  const quantity = mode === "sku" ? Math.max(1, Number(form.quantity.value || 1)) : 1;
  const unitCost = Number(form.productionCost.value || 0);
  if (mode === "sku" && duplicateItem) {
    duplicateItem.itemType = "sku";
    duplicateItem.productionDate = form.productionDate.value;
    duplicateItem.description = form.description.value.trim();
    duplicateItem.category = form.category.value;
    duplicateItem.subCategory = form.subCategory.value;
    duplicateItem.paperColor = "-";
    duplicateItem.unitCost = unitCost;
    duplicateItem.productionCost = unitCost;
    duplicateItem.salePrice = Number(form.salePrice.value || duplicateItem.salePrice || 0);
    duplicateItem.florist = "";
    duplicateItem.quantityTotal = Number(duplicateItem.quantityTotal || 0) + quantity;
    duplicateItem.quantityAvailable = Number(duplicateItem.quantityAvailable || 0) + quantity;
    duplicateItem.status = duplicateItem.quantityAvailable > 0 ? "available" : "sold";
    duplicateItem.updatedAt = new Date().toISOString();
    selectedStockId = duplicateItem.id;
    saveState();
    form.reset();
    form.stockMode.value = "sku";
    form.productionDate.value = today;
    form.quantity.value = "1";
    renderStockEntryMode();
    renderDropdowns();
    els.stockStatus.textContent = `${duplicateItem.productCode} restock +${quantity} သိမ်းပြီး`;
    renderAll();
    return;
  }

  const item = existingItem || {
    id: uid("stock"),
    status: "available",
    createdAt: new Date().toISOString(),
  };

  Object.assign(item, {
    itemType: mode,
    productCode,
    productionDate: form.productionDate.value,
    description: form.description.value.trim(),
    category: form.category.value,
    subCategory: form.subCategory.value,
    paperColor: mode === "sku" ? "-" : form.paperColor.value.trim(),
    productionCost: unitCost,
    unitCost,
    salePrice: Number(form.salePrice.value || 0),
    florist: mode === "sku" ? "" : form.florist.value,
    quantityTotal: mode === "sku" ? quantity : 1,
    quantityAvailable: mode === "sku" ? quantity : 1,
    status: mode === "sku" ? (quantity > 0 ? "available" : "sold") : item.status || "available",
  });
  if (existingItem) syncSaleCostsForStock(item.id);

  if (!existingItem) state.stock.unshift(item);
  selectedStockId = item.id;
  editingStockId = "";
  saveState();
  form.reset();
  form.stockMode.value = mode;
  form.productionDate.value = today;
  form.quantity.value = "1";
  renderStockEntryMode();
  renderDropdowns();
  els.stockStatus.textContent = `${item.productCode} ${existingItem ? "ပြင်ပြီး" : "သိမ်းပြီး"}`;
  renderAll();
}

function editStock(id) {
  if (!hasPermission("stock")) return;
  const item = state.stock.find((stockItem) => stockItem.id === id);
  if (!item) return;

  editingStockId = id;
  renderStockEditCategoryOptions(item.category, item.subCategory || "");
  els.stockEditForm.productCode.value = item.productCode;
  els.stockEditForm.productionDate.value = item.productionDate;
  els.stockEditForm.description.value = item.description;
  els.stockEditForm.paperColor.value = item.paperColor;
  els.stockEditForm.productionCost.value = item.productionCost || "";
  els.stockEditForm.salePrice.value = item.salePrice || "";
  els.stockEditForm.florist.value = item.florist;
  els.stockEditForm.paperColor.required = item.itemType !== "sku";
  els.stockEditForm.florist.required = item.itemType !== "sku";
  els.stockStatus.textContent = `${item.productCode} ပြင်နေသည်`;
  openModal(els.stockEditModal);
  els.stockEditForm.productCode.focus();
}

function saveStockEdit(form) {
  if (!hasPermission("stock") || !editingStockId) return;
  const item = state.stock.find((stockItem) => stockItem.id === editingStockId);
  if (!item) return;

  const productCode = normalizeCode(form.productCode.value);
  if (state.stock.some((stockItem) => stockItem.productCode === productCode && stockItem.id !== editingStockId)) {
    els.stockStatus.textContent = "Code duplicate ဖြစ်နေသည်";
    return;
  }

  Object.assign(item, {
    productCode,
    productionDate: form.productionDate.value,
    description: form.description.value.trim(),
    category: form.category.value,
    subCategory: form.subCategory.value,
    paperColor: item.itemType === "sku" ? "-" : form.paperColor.value.trim(),
    productionCost: Number(form.productionCost.value || 0),
    unitCost: Number(form.productionCost.value || 0),
    salePrice: Number(form.salePrice.value || 0),
    florist: item.itemType === "sku" ? "" : form.florist.value,
  });
  syncSaleCostsForStock(item.id);

  selectedStockId = item.id;
  editingStockId = "";
  saveState();
  closeModal(els.stockEditModal);
  els.stockStatus.textContent = `${item.productCode} ပြင်ပြီး`;
  renderAll();
}

function renderSaleItemMode() {
  const mode = els.saleItemType.value || "stock";
  document.querySelectorAll("[data-item-mode]").forEach((node) => {
    node.hidden = false;
  });
  document.querySelectorAll("[data-sale-item-mode]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.saleItemMode === mode);
  });
  els.saleProductCode.placeholder = "Product code / SKU (optional)";
  els.manualDescription.placeholder = "Description (manual item ဆိုရင် ဒီမှာရေးပါ)";
  renderSaleCodeOptions();
  renderStockLookup();
}

function renderStockLookup() {
  const mode = "all";
  const rawQuery = els.saleProductCode.value.trim();
  const code = normalizeCode(rawQuery || "");
  if (!rawQuery) {
    els.stockLookupDetails.innerHTML = `<span>Product code / SKU ရိုက်လို့ရပါတယ်။ Code မရှိရင် Description နဲ့ manual item အဖြစ်ထည့်ပါ။</span>`;
    return;
  }

  const pool = state.stock;
  const stockItem = pool.find((item) => item.productCode === code);
  if (!stockItem) {
    const query = rawQuery.toLowerCase();
    const matches = pool
      .filter((item) => `${item.productCode} ${item.description} ${item.category} ${item.subCategory}`.toLowerCase().includes(query))
      .slice(0, 6);
    els.stockLookupDetails.innerHTML = matches.length
      ? `
        <div class="lookup-result-list">
          ${matches
            .map(
              (item) => `
                <button type="button" class="lookup-result-button" data-select-stock-code="${escapeHtml(item.productCode)}">
                  <strong>${escapeHtml(item.productCode)}</strong>
                  <span>${escapeHtml(item.description || "-")}</span>
                  <small>${item.itemType === "sku" ? `Qty ${escapeHtml(item.quantityAvailable || 0)} • ${money(item.salePrice)}` : escapeHtml(item.status || "available")}</small>
                </button>
              `
            )
            .join("")}
        </div>
      `
      : `<span class="danger-text">ဒီ Product Code / SKU ကို stock ထဲမတွေ့ပါ။ မရှိသေးတဲ့ item ဆို Description နဲ့ manual ထည့်ပါ။</span>`;
    return;
  }

  if (!Number(els.saleItemPrice.value || 0) && stockItem.salePrice) {
    els.saleItemPrice.value = stockItem.salePrice;
  }
  if (!els.manualDescription.value) {
    els.manualDescription.value = stockItem.description || "";
  }
  els.stockLookupDetails.innerHTML = `
    <span class="stock-lookup-line">
      <strong>${escapeHtml(stockItem.productCode)}</strong>
      <span>${escapeHtml(stockItem.description || "-")}</span>
      ${
        stockItem.itemType === "sku"
          ? `<span>Available: ${escapeHtml(stockItem.quantityAvailable || 0)}</span><span>Price: ${money(stockItem.salePrice)}</span>`
          : `<span>Paper: ${escapeHtml(stockItem.paperColor || "-")}</span><span>Status: ${escapeHtml(stockItem.status || "available")}</span>`
      }
    </span>
  `;
}

function clearSaleItemInputs() {
  els.saleItemType.value = "stock";
  els.saleProductCode.value = "";
  els.manualDescription.value = "";
  els.saleItemQty.value = "1";
  els.saleItemPrice.value = "0";
  renderSaleItemMode();
}

function applyFulfillmentMethodPreset() {
  if (els.fulfillmentMethod.value === "walkin") {
    els.fulfillmentDate.value = els.saleForm.saleDate.value || today;
    els.fulfillmentStatus.value = "delivered";
    return;
  }

  if (els.fulfillmentStatus.value === "delivered") {
    els.fulfillmentStatus.value = "pending";
  }
}

function addSaleItem() {
  if (!hasPermission("sale")) return;
  const productCode = normalizeCode(els.saleProductCode.value);
  const stockItem = productCode ? state.stock.find((item) => item.productCode === productCode) : null;
  const description = els.manualDescription.value.trim();
  const price = Number(els.saleItemPrice.value || 0);
  const quantity = Math.max(1, Number(els.saleItemQty.value || 1));

  if (!price) {
    els.saleStatus.textContent = "Item amount ထည့်ပါ";
    return;
  }

  if (stockItem?.itemType === "sku") {
    if (Number(stockItem.quantityAvailable || 0) < quantity) {
      els.saleStatus.textContent = `SKU လက်ကျန် ${stockItem.quantityAvailable || 0} ခုပဲရှိပါတယ်`;
      return;
    }

    saleItems.push({
      id: uid("item"),
      type: "sku_stock",
      stockId: stockItem.id,
      productCode,
      description: description || stockItem.description || productCode,
      quantity,
      price: price * quantity,
      unitPrice: price,
      cost: Number(stockItem.unitCost ?? stockItem.productionCost ?? 0) * quantity,
    });
  } else if (stockItem) {
    const alreadyAdded = saleItems.some((item) => item.productCode === productCode);
    const soldToCurrentVoucher = editingSaleId && stockItem.saleId === editingSaleId;
    if ((stockItem.status === "sold" && !soldToCurrentVoucher) || alreadyAdded) {
      els.saleStatus.textContent = "ဒီ Product Code က ရောင်းပြီးသား / voucher ထဲပါပြီးသားဖြစ်သည်";
      return;
    }

    saleItems.push({
      id: uid("item"),
      type: "stock",
      stockId: stockItem.id,
      productCode,
      description: description || stockItem.description || productCode,
      quantity,
      price: price * quantity,
      unitPrice: price,
      cost: Number(stockItem.productionCost || 0) * quantity,
    });
  } else {
    if (!description) {
      els.saleStatus.textContent = productCode ? "ဒီ Code ကိုမတွေ့ပါ။ Manual အဖြစ်ထည့်ရန် Description ထည့်ပါ" : "Description ထည့်ပါ";
      return;
    }

    saleItems.push({
      id: uid("item"),
      type: "manual",
      stockId: "",
      productCode,
      description,
      quantity,
      price: price * quantity,
      unitPrice: price,
      cost: 0,
    });
  }

  clearSaleItemInputs();
  els.saleStatus.textContent = "Item ထည့်ပြီး";
  renderSaleItems();
  setSaleStep("items");
}

function removeSaleItem(id) {
  saleItems = saleItems.filter((item) => item.id !== id);
  renderSaleItems();
}

function linkSaleItemToStock(itemId) {
  if (!hasPermission("sale")) return;
  const item = saleItems.find((saleItem) => saleItem.id === itemId);
  const input = els.saleItemList.querySelector(`[data-link-stock-code="${itemId}"]`);
  const productCode = normalizeCode(input?.value || "");
  if (!item || !productCode) {
    els.saleStatus.textContent = "Link လုပ်ရန် Product Code ထည့်ပါ";
    return;
  }

  const stockItem = state.stock.find((stock) => stock.productCode === productCode);
  if (!stockItem) {
    els.saleStatus.textContent = "ဒီ Product Code ကို Stock ထဲမတွေ့ပါ။ Production Team က stock အရင်ထည့်ပါ";
    return;
  }

  const soldToCurrentVoucher = editingSaleId && stockItem.saleId === editingSaleId;
  const usedByOtherItem = saleItems.some(
    (saleItem) => saleItem.id !== itemId && (saleItem.stockId === stockItem.id || saleItem.productCode === productCode)
  );
  if ((stockItem.status === "sold" && !soldToCurrentVoucher) || usedByOtherItem) {
    els.saleStatus.textContent = "ဒီ Product Code က ရောင်းပြီးသား / voucher ထဲပါပြီးသားဖြစ်သည်";
    return;
  }

  const quantity = Math.max(1, Number(item.quantity || 1));
  item.type = "stock";
  item.stockId = stockItem.id;
  item.productCode = productCode;
  item.description = stockItem.description || item.description;
  item.cost = Number(stockItem.productionCost || 0) * quantity;
  if (!Number(item.price || 0) && stockItem.salePrice) {
    item.unitPrice = Number(stockItem.salePrice || 0);
    item.price = item.unitPrice * quantity;
  }

  els.saleStatus.textContent = `${productCode} ကို voucher item နဲ့ link လုပ်ပြီး။ Save Voucher နှိပ်ပါ`;
  renderSaleItems();
}

function currentSaleDraftData() {
  return {
    id: activeSaleDraftId || uid("draft"),
    editingSaleId,
    saleDate: els.saleForm.saleDate.value || today,
    voucherNumber: els.saleForm.voucherNumber.value.trim(),
    salePerson: els.saleForm.salePerson.value,
    fulfillmentDate: els.fulfillmentDate.value || els.saleForm.saleDate.value || today,
    fulfillmentMethod: els.fulfillmentMethod.value,
    fulfillmentStatus: els.fulfillmentStatus.value,
    paymentType: els.salePaymentType.value,
    receivedAmount: "",
    paymentDate: els.paymentDate.value || today,
    paymentLines: pendingSalePayments({ includeCurrent: true }),
    note: els.saleForm.elements.note.value.trim(),
    items: saleItems.map((item) => ({ ...item })),
    updatedAt: new Date().toISOString(),
  };
}

function hasSaleDraftContent() {
  return Boolean(
    editingSaleId ||
      saleItems.length ||
      els.saleForm.voucherNumber.value.trim() ||
      els.fulfillmentDate.value !== today ||
      els.fulfillmentMethod.value !== defaultFulfillmentMethod ||
      els.fulfillmentStatus.value !== defaultFulfillmentStatus ||
      salePaymentDraft.length ||
      els.receivedAmount.value ||
      els.saleForm.elements.note.value.trim()
  );
}

function clearSaleForm() {
  editingSaleId = "";
  activeSaleDraftId = "";
  saleItems = [];
  salePaymentDraft = [];
  els.saleForm.reset();
  els.saleForm.saleDate.value = today;
  els.fulfillmentDate.value = today;
  els.fulfillmentMethod.value = defaultFulfillmentMethod;
  els.fulfillmentStatus.value = defaultFulfillmentStatus;
  els.paymentDate.value = today;
  els.receivedAmount.value = "";
  clearSaleItemInputs();
  renderDropdowns();
  renderSaleItems();
  renderSalePaymentLines();
  renderSaleDrafts();
  clearProductionCompose();
  setSaleStep("info");
}

function holdSaleDraft({ silent = false } = {}) {
  if (!hasPermission("sale")) return false;
  if (!hasSaleDraftContent()) {
    if (!silent) els.saleStatus.textContent = "Hold လုပ်ရန် voucher data မရှိသေးပါ";
    return false;
  }

  const draft = currentSaleDraftData();
  const index = state.saleDrafts.findIndex((item) => item.id === draft.id);
  if (index >= 0) state.saleDrafts[index] = draft;
  else state.saleDrafts.unshift({ ...draft, createdAt: new Date().toISOString() });
  activeSaleDraftId = draft.id;
  saveState();
  if (!silent) els.saleStatus.textContent = `${draft.voucherNumber || "Draft"} hold ထားပြီး`;
  renderSaleDrafts();
  return true;
}

function startNewVoucher() {
  if (hasSaleDraftContent()) holdSaleDraft({ silent: true });
  clearSaleForm();
  els.saleStatus.textContent = "New voucher စတင်ပါ";
}

function deleteActiveDraft() {
  if (!activeSaleDraftId) {
    clearSaleForm();
    els.saleStatus.textContent = "လက်ရှိ voucher draft ရှင်းပြီး";
    return;
  }

  const draft = state.saleDrafts.find((item) => item.id === activeSaleDraftId);
  state.saleDrafts = state.saleDrafts.filter((item) => item.id !== activeSaleDraftId);
  clearSaleForm();
  saveState();
  els.saleStatus.textContent = `${draft?.voucherNumber || "Draft"} ဖျက်ပြီး`;
  renderAll();
}

function openSaleDraft(id) {
  if (hasSaleDraftContent() && activeSaleDraftId !== id) holdSaleDraft({ silent: true });
  const draft = state.saleDrafts.find((item) => item.id === id);
  if (!draft) return;
  activeSaleDraftId = id;
  editingSaleId = draft.editingSaleId || "";
  saleItems = (draft.items || []).map((item) => ({ ...item }));
  salePaymentDraft = (draft.paymentLines || []).map((payment) => ({ ...payment }));
  els.saleForm.saleDate.value = draft.saleDate || today;
  els.saleForm.voucherNumber.value = draft.voucherNumber || "";
  els.saleForm.salePerson.value = draft.salePerson || "";
  els.fulfillmentDate.value = draft.fulfillmentDate || draft.saleDate || today;
  els.fulfillmentMethod.value = draft.fulfillmentMethod || defaultFulfillmentMethod;
  els.fulfillmentStatus.value = draft.fulfillmentStatus || defaultFulfillmentStatus;
  els.salePaymentType.value = draft.paymentType || "Cash";
  els.receivedAmount.value = draft.receivedAmount || "";
  els.paymentDate.value = draft.paymentDate || today;
  els.saleForm.elements.note.value = draft.note || "";
  els.saleStatus.textContent = `${draft.voucherNumber || "Draft"} ပြန်ဖွင့်ထားသည်`;
  renderSaleItems();
  renderSalePaymentLines();
  renderSaleDrafts();
  setSaleStep(saleItems.length ? "items" : "info");
}

function deleteSaleDraft(id) {
  const draft = state.saleDrafts.find((item) => item.id === id);
  state.saleDrafts = state.saleDrafts.filter((item) => item.id !== id);
  if (activeSaleDraftId === id) clearSaleForm();
  saveState();
  els.saleStatus.textContent = `${draft?.voucherNumber || "Draft"} draft ဖျက်ပြီး`;
  renderAll();
}

function renderSaleDrafts() {
  els.draftList.innerHTML = state.saleDrafts.length
    ? state.saleDrafts
        .map((draft) => {
          const total = (draft.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0);
          return `
            <div class="draft-card ${draft.id === activeSaleDraftId ? "is-active" : ""}">
              <button type="button" data-open-draft="${draft.id}">
                <strong>${escapeHtml(draft.voucherNumber || "No Voucher No.")}</strong>
                <span>${draft.items?.length || 0} items • ${money(total)}</span>
              </button>
              <button class="icon-button danger" type="button" data-delete-draft="${draft.id}" title="Delete draft">x</button>
            </div>
          `;
        })
        .join("")
    : `<div class="empty compact-empty">Hold ထားတဲ့ voucher မရှိသေးပါ</div>`;
}

function renderSaleItems() {
  const total = saleItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const existingSale = editingSaleId ? state.sales.find((sale) => sale.id === editingSaleId) : null;
  const alreadyPaid = existingSale ? salePaid(existingSale) : 0;
  const received = pendingSalePaymentTotal({ includeCurrent: true });
  const balanceAfter = Math.max(0, total - alreadyPaid - received);
  els.saleTotalPreview.textContent = money(total);
  els.saleTableTotal.textContent = money(total);
  els.saleBalancePreview.textContent = money(balanceAfter);
  els.cashierTotalDue.textContent = money(total);
  els.cashierAlreadyPaid.textContent = money(alreadyPaid);
  els.cashierThisPayment.textContent = money(received);
  els.cashierBalanceAfter.textContent = money(balanceAfter);

  els.saleItemList.innerHTML = saleItems.length
    ? saleItems
        .map(
          (item, index) => {
            const codeValue = item.productCode || "";
            const codeLabel = item.productCode
              ? `<strong>${escapeHtml(item.productCode)}</strong>`
              : `<span class="pending-code">Code Pending</span>`;
            return `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="code-link-cell">
                  ${codeLabel}
                  <div class="code-link-row">
                    <input value="${escapeHtml(codeValue)}" placeholder="Code ရရင်ထည့်" data-link-stock-code="${item.id}" />
                    <button class="button secondary tiny-button" type="button" data-link-sale-item="${item.id}">Link</button>
                  </div>
                </div>
              </td>
              <td>${escapeHtml(item.description)}</td>
              <td>${item.quantity || 1}</td>
              <td><strong>${money(item.price)}</strong></td>
              <td><button class="icon-button danger" type="button" data-remove-sale-item="${item.id}" title="Remove item">x</button></td>
            </tr>
          `;
          }
        )
        .join("")
    : `<tr><td colspan="6"><div class="empty">Voucher item မထည့်ရသေးပါ</div></td></tr>`;
  renderSalePaymentLines();
}

function addSalePaymentLine() {
  if (!hasPermission("sale")) return;
  const payment = currentPaymentInput();
  if (!payment) {
    setSaleStep("payment");
    els.saleStatus.textContent = "Payment line ထည့်ရန် Amount ရိုက်ပါ";
    els.receivedAmount.focus();
    return;
  }

  const total = saleItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const existingSale = editingSaleId ? state.sales.find((sale) => sale.id === editingSaleId) : null;
  const alreadyPaid = existingSale ? salePaid(existingSale) : 0;
  const balanceBeforeLine = Math.max(0, total - alreadyPaid - pendingSalePaymentTotal());
  if (payment.amount > balanceBeforeLine) {
    els.saleStatus.textContent = `ဒီ payment line က ကျန်ငွေ ${money(balanceBeforeLine)} ထက်များနေပါတယ်`;
    els.receivedAmount.focus();
    return;
  }

  salePaymentDraft.push(payment);
  els.receivedAmount.value = "";
  els.saleStatus.textContent = `${payment.paymentType} ${money(payment.amount)} ထည့်ပြီး`;
  renderSaleItems();
}

function removeSalePaymentLine(id) {
  salePaymentDraft = salePaymentDraft.filter((payment) => payment.id !== id);
  renderSaleItems();
}

function saveSale() {
  if (!hasPermission("sale")) return;
  if (!saleItems.length) {
    setSaleStep("items");
    els.saleStatus.textContent = "Voucher ထဲ item အနည်းဆုံးတစ်ခုထည့်ပါ";
    showSaleNotice("warning", "Item မထည့်ရသေးပါ", "Voucher သိမ်းရန် item အနည်းဆုံးတစ်ခု ထည့်ပေးပါ", [
      "Step 2 - Items ထဲမှာ Product Code / SKU / Manual item ထည့်ပါ",
    ]);
    return;
  }

  const form = els.saleForm;
  if (!validateSaleRequiredFields()) return;

  const totalPrice = saleItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const productionCost = saleItems.reduce((sum, item) => sum + Number(item.cost || 0), 0);
  const existingSale = editingSaleId ? state.sales.find((sale) => sale.id === editingSaleId) : null;
  const voucherNumber = form.voucherNumber.value.trim();
  const duplicateVoucher = state.sales.find(
    (sale) => sale.voucherNumber.toLowerCase() === voucherNumber.toLowerCase() && sale.id !== editingSaleId
  );
  if (duplicateVoucher) {
    setSaleStep("info");
    els.saleStatus.textContent = "ဒီ Voucher Number ကရှိပြီးသားဖြစ်ပါတယ်";
    showSaleNotice("warning", "Voucher Number ထပ်နေပါတယ်", `${voucherNumber} ကရှိပြီးသား voucher number ဖြစ်ပါတယ်`, [
      "အခြား voucher number သုံးပါ",
      "ရှိပြီးသား voucher ပြင်ချင်ရင် Existing Voucher ထဲကနေ Load လုပ်ပါ",
    ]);
    return;
  }

  const requestedPayment = pendingSalePaymentTotal({ includeCurrent: true });
  const balanceBeforeRequestedPayment = Math.max(0, totalPrice - (existingSale ? salePaid(existingSale) : 0));
  if (requestedPayment > balanceBeforeRequestedPayment) {
    setSaleStep("payment");
    els.saleStatus.textContent = `လက်ခံရငွေက ကျန်ငွေ ${money(balanceBeforeRequestedPayment)} ထက်များနေပါတယ်`;
    showSaleNotice("warning", "လက်ခံရငွေ များနေပါတယ်", `လက်ခံရငွေက ကျန်ငွေ ${money(balanceBeforeRequestedPayment)} ထက် မကျော်ရပါ`, [
      `အခုထည့်ထားသော payment: ${money(requestedPayment)}`,
      "Received Amount ကိုပြန်စစ်ပါ",
    ]);
    return;
  }
  const sale = existingSale || {
    id: uid("sale"),
    payments: [],
    createdAt: new Date().toISOString(),
  };
  const beforeSale = cloneSaleForCompare(existingSale);

  if (existingSale) releaseSaleStock(existingSale);

  Object.assign(sale, {
    saleDate: form.saleDate.value,
    voucherNumber,
    salePerson: form.salePerson.value,
    fulfillmentDate: form.fulfillmentDate.value || form.saleDate.value,
    fulfillmentMethod: form.fulfillmentMethod.value || defaultFulfillmentMethod,
    fulfillmentStatus: form.fulfillmentStatus.value || defaultFulfillmentStatus,
    paymentType: pendingSalePayments({ includeCurrent: true }).at(-1)?.paymentType || els.salePaymentType.value,
    totalPrice,
    productionCost,
    note: form.elements.note.value.trim(),
    items: saleItems.map((item) => ({ ...item })),
  });

  sale.payments = sale.payments || [];
  const balanceBeforePayment = Math.max(0, totalPrice - salePaid(sale));
  const paymentLines = pendingSalePayments({ includeCurrent: true });
  const addedPayments = [];
  let remainingPaymentBalance = balanceBeforePayment;
  paymentLines.forEach((payment) => {
    const paymentAmount = Math.min(Number(payment.amount || 0), remainingPaymentBalance);
    if (paymentAmount <= 0) return;
    const addedPayment = {
      id: uid("payment"),
      paymentDate: payment.paymentDate,
      paymentType: payment.paymentType,
      amount: paymentAmount,
      note: existingSale ? "Edit payment" : "Initial payment",
    };
    sale.payments.push(addedPayment);
    addedPayments.push(addedPayment);
    remainingPaymentBalance -= paymentAmount;
  });

  applySaleStock(sale);

  if (!existingSale) state.sales.unshift(sale);
  if (activeSaleDraftId) {
    state.saleDrafts = state.saleDrafts.filter((draft) => draft.id !== activeSaleDraftId);
  }
  saleItems = [];
  salePaymentDraft = [];
  editingSaleId = "";
  activeSaleDraftId = "";
  saveState();
  form.reset();
  form.saleDate.value = today;
  els.fulfillmentDate.value = today;
  els.fulfillmentMethod.value = defaultFulfillmentMethod;
  els.fulfillmentStatus.value = defaultFulfillmentStatus;
  els.paymentDate.value = today;
  els.receivedAmount.value = "";
  clearSaleItemInputs();
  setSaleStep("info");
  renderDropdowns();
  els.saleStatus.textContent = `${sale.voucherNumber} ${existingSale ? "ပြင်ပြီး" : "သိမ်းပြီး"}`;
  renderAll();
  clearVoucherSearchPanel();
  showSaleNotice(
    "success",
    existingSale ? "Voucher ပြင်ပြီးပါပြီ" : "Voucher သိမ်းပြီးပါပြီ",
    existingSale ? `${sale.voucherNumber} မှာ ပြောင်းလဲချက်များ သိမ်းပြီးပါပြီ` : `${sale.voucherNumber} voucher အသစ် သိမ်းပြီးပါပြီ`,
    describeSaleChanges(beforeSale, sale, addedPayments)
  );
}

function loadVoucherForEdit() {
  if (!hasPermission("sale")) return;
  const sale = findVoucher();
  if (!sale) {
    els.saleStatus.textContent = "ပြန်ပြင်ရန် Voucher မတွေ့ပါ";
    renderVoucherPaymentDetails();
    return;
  }

  editingSaleId = sale.id;
  activeSaleDraftId = "";
  saleItems = (sale.items || []).map((item) => ({ ...item }));
  salePaymentDraft = [];
  location.hash = "#sale";
  showView("sale");
  els.saleForm.saleDate.value = sale.saleDate || today;
  els.saleForm.voucherNumber.value = sale.voucherNumber || "";
  els.saleForm.salePerson.value = sale.salePerson || "";
  els.fulfillmentDate.value = sale.fulfillmentDate || sale.saleDate || today;
  els.fulfillmentMethod.value = sale.fulfillmentMethod || defaultFulfillmentMethod;
  els.fulfillmentStatus.value = sale.fulfillmentStatus || defaultFulfillmentStatus;
  els.salePaymentType.value = sale.payments?.at(-1)?.paymentType || sale.paymentType || "Cash";
  els.paymentDate.value = today;
  els.receivedAmount.value = "";
  els.saleForm.elements.note.value = sale.note || "";
  els.saleStatus.textContent = `${sale.voucherNumber} ပြန်ပြင်နေသည်`;
  renderSaleItems();
  renderVoucherPaymentDetails();
  setSaleStep(saleItems.length ? "items" : "info");
}

function renderVoucherHistory() {
  const keyword = els.fulfillmentSearch.value.trim().toLowerCase();
  const selectedDate = els.voucherHistoryDate.value;
  const rows = [...state.sales]
    .filter(
      (sale) =>
        !selectedDate ||
        sale.saleDate === selectedDate ||
        (sale.payments || []).some((payment) => payment.paymentDate === selectedDate)
    )
    .filter((sale) => {
      const descriptions = (sale.items || []).map((item) => item.description).join(" ");
      const paymentMethods = (sale.payments || []).map((payment) => payment.paymentType).join(" ");
      const text = `${sale.voucherNumber} ${sale.salePerson} ${sale.saleDate} ${sale.fulfillmentDate} ${paymentMethods} ${fulfillmentMethodLabel(sale.fulfillmentMethod)} ${fulfillmentStatusLabel(sale.fulfillmentStatus)} ${descriptions}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => byDateDesc(a, b, "saleDate"));

  els.voucherHistoryTable.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const descriptions = (sale.items || [])
            .map(
              (item) =>
                `${escapeHtml(item.productCode || "Code Pending")} - ${escapeHtml(item.description)} (${escapeHtml(item.quantity || 1)})`
            )
            .join("<br>");
          const paidForView = selectedDate ? salePaidForDate(sale, selectedDate) : salePaid(sale);
          const paymentBreakdown = paymentBreakdownText(sale, selectedDate || "");
          return `
            <tr>
              <td><strong>${escapeHtml(sale.voucherNumber)}</strong><br><span class="muted">${escapeHtml(sale.salePerson || "-")}</span></td>
              <td>${escapeHtml(sale.saleDate)}<br><span class="muted">Due: ${escapeHtml(sale.fulfillmentDate || sale.saleDate || "-")}</span></td>
              <td>${descriptions || "-"}</td>
              <td>Paid ${money(paidForView)}<br><span class="muted">${paymentBreakdown}</span><br><span class="muted">Balance ${money(saleBalance(sale))}</span><br><span class="fulfillment-badge ${sale.fulfillmentStatus === "delivered" ? "delivered" : ""}">${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</span></td>
              <td>
                <div class="row-actions">
                  <button class="button secondary" type="button" data-edit-voucher="${sale.id}">Edit</button>
                  <button class="icon-button danger" type="button" data-delete-voucher="${sale.id}" title="Delete voucher">x</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">ဒီရက်အတွက် Voucher မရှိသေးပါ</div></td></tr>`;
}

function loadVoucherById(id) {
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  els.voucherSearch.value = sale.voucherNumber;
  loadVoucherForEdit();
}

function findVoucher() {
  const voucherNumber = els.voucherSearch.value.trim();
  return state.sales.find((sale) => sale.voucherNumber.toLowerCase() === voucherNumber.toLowerCase());
}

function fulfillmentMethodLabel(value) {
  if (value === "walkin") return "တခါတည်းယူသွား";
  return value === "delivery" ? "ဆိုင်ကပို့ပေး" : "Customer လာယူ";
}

function fulfillmentStatusLabel(value) {
  return value === "delivered" ? "ပေးပြီး" : "မပေးရသေး";
}

function fulfillmentDueDate(sale) {
  return sale.fulfillmentDate || sale.saleDate || "";
}

function isFulfillmentOverdue(sale, compareDate = today) {
  const dueDate = fulfillmentDueDate(sale);
  return (sale.fulfillmentStatus || "pending") !== "delivered" && dueDate && dueDate < compareDate;
}

function renderFulfillmentTable() {
  const selectedDate = els.fulfillmentFilterDate.value;
  const status = els.fulfillmentFilterStatus.value;
  const method = els.fulfillmentFilterMethod.value;
  const keyword = els.fulfillmentSearch.value.trim().toLowerCase();

  const rows = [...state.sales]
    .filter((sale) => {
      const dueDate = fulfillmentDueDate(sale);
      return !selectedDate || dueDate === selectedDate || isFulfillmentOverdue(sale, selectedDate);
    })
    .filter((sale) => status === "all" || (sale.fulfillmentStatus || "pending") === status)
    .filter((sale) => method === "all" || (sale.fulfillmentMethod || "pickup") === method)
    .filter((sale) => {
      const descriptions = (sale.items || []).map((item) => item.description).join(" ");
      const text = `${sale.voucherNumber} ${sale.salePerson} ${fulfillmentDueDate(sale)} ${fulfillmentMethodLabel(sale.fulfillmentMethod)} ${fulfillmentStatusLabel(sale.fulfillmentStatus)} ${descriptions}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b))));

  els.fulfillmentTable.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const itemSummary = (sale.items || [])
            .map((item) => `${escapeHtml(item.productCode || "Code Pending")} - ${escapeHtml(item.description)}`)
            .join("<br>");
          const dueDate = fulfillmentDueDate(sale) || "-";
          const overdue = isFulfillmentOverdue(sale, selectedDate || today);
          return `
            <tr class="${overdue ? "overdue-row" : ""}">
              <td><strong>${escapeHtml(dueDate)}</strong><br><span class="muted">${escapeHtml(sale.saleDate || "-")} sale</span>${overdue ? `<br><span class="fulfillment-badge overdue">Overdue</span>` : ""}</td>
              <td><strong>${escapeHtml(sale.voucherNumber)}</strong><br><span class="muted">${escapeHtml(sale.salePerson || "-")}</span><br><span class="muted">${itemSummary || "-"}</span></td>
              <td>${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))}</td>
              <td><span class="fulfillment-badge ${sale.fulfillmentStatus === "delivered" ? "delivered" : ""}">${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</span></td>
              <td>
                <div class="row-actions">
                  <select data-fulfillment-status="${sale.id}" aria-label="Update fulfillment status">
                    <option value="pending" ${sale.fulfillmentStatus !== "delivered" ? "selected" : ""}>မပေးရသေး</option>
                    <option value="delivered" ${sale.fulfillmentStatus === "delivered" ? "selected" : ""}>ပေးပြီး</option>
                  </select>
                  <button class="button secondary" type="button" data-edit-voucher="${sale.id}">Edit</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">ဒီ filter အတွက် record မရှိသေးပါ</div></td></tr>`;
}

function updateFulfillmentStatus(id, status) {
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  sale.fulfillmentStatus = status;
  saveState();
  renderAll();
}

function clearVoucherSearchPanel() {
  els.voucherSearch.value = "";
  els.extraPaymentDate.value = today;
  els.extraPaymentAmount.value = "";
  els.extraFulfillmentStatus.value = "";
  renderVoucherPaymentDetails();
}

function renderVoucherPaymentDetails() {
  const sale = findVoucher();
  if (!sale) {
    els.voucherPaymentDetails.innerHTML = `<span>Voucher number ရိုက်ပြီးရှာပါ။ ကျန်ငွေရှိရင် payment ထပ်သွင်းနိုင်မယ်။</span>`;
    els.extraPaymentAmount.value = "";
    return;
  }

  const balance = saleBalance(sale);
  const outstanding = saleOutstanding(sale);
  const paymentRows = (sale.payments || [])
    .map(
      (payment) => `
        <div class="payment-edit-row" data-payment-row="${payment.id}">
          <input type="date" value="${escapeHtml(payment.paymentDate)}" data-payment-field="paymentDate" aria-label="Payment date" />
          <select data-payment-field="paymentType" aria-label="Payment type">
            ${paymentTypes
              .map((type) => `<option ${payment.paymentType === type ? "selected" : ""}>${type}</option>`)
              .join("")}
          </select>
          <input type="number" min="0" step="1" value="${Number(payment.amount || 0)}" data-payment-field="amount" aria-label="Payment amount" />
          <button class="button secondary" type="button" data-save-payment="${payment.id}">Save</button>
          <button class="icon-button danger" type="button" data-delete-payment="${payment.id}" title="Delete payment">x</button>
        </div>
      `
    )
    .join("");
  els.voucherPaymentDetails.innerHTML = `
    <strong>${escapeHtml(sale.voucherNumber)} • Total ${money(sale.totalPrice)} • Paid ${money(salePaid(sale))} • ${
      outstanding < 0 ? `Overpaid ${money(Math.abs(outstanding))}` : `Balance ${money(balance)}`
    }</strong>
    <span>Payment Method: ${paymentBreakdownText(sale)}</span>
    <span>${escapeHtml(sale.salePerson)} • ${escapeHtml(sale.saleDate)} • ${sale.items?.length || 0} items • ${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))} • ${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</span>
    <span>${paymentRows || "Payment မရှိသေးပါ"}</span>
    <button class="button ghost danger-text full-width" type="button" data-delete-current-voucher="${sale.id}">Voucher ဖျက်မယ်</button>
  `;
  els.extraPaymentAmount.value = balance || "";
}

function addVoucherPayment() {
  if (!hasPermission("sale")) return;
  const sale = findVoucher();
  if (!sale) {
    els.saleStatus.textContent = "Voucher မတွေ့ပါ";
    renderVoucherPaymentDetails();
    showSaleNotice("warning", "Voucher မတွေ့ပါ", "ရိုက်ထားတဲ့ Voucher Number ကို မတွေ့ပါ", [
      "Voucher number ပြန်စစ်ပါ",
    ]);
    return;
  }

  const amount = Number(els.extraPaymentAmount.value || 0);
  if (!amount) {
    els.saleStatus.textContent = "Payment amount ထည့်ပါ";
    showSaleNotice("warning", "Payment Amount လိုနေပါတယ်", "ထပ်သွင်းမယ့်ငွေပမာဏ ထည့်ပေးပါ", [
      "Amount box ထဲမှာ ရရှိသောငွေကို ရိုက်ပါ",
    ]);
    return;
  }
  const balance = saleBalance(sale);
  if (balance <= 0) {
    els.saleStatus.textContent = "ဒီ Voucher က အကုန်ရှင်းပြီးသားဖြစ်ပါတယ်";
    renderVoucherPaymentDetails();
    showSaleNotice("info", "အကုန်ရှင်းပြီးသားပါ", `${sale.voucherNumber} မှာ ကျန်ငွေမရှိတော့ပါ`, [
      `Paid: ${money(salePaid(sale))}`,
      `Balance: ${money(saleBalance(sale))}`,
    ]);
    return;
  }
  if (amount > balance) {
    els.saleStatus.textContent = `Payment amount က ကျန်ငွေ ${money(balance)} ထက်များနေပါတယ်`;
    showSaleNotice("warning", "Payment Amount များနေပါတယ်", `Payment amount က ကျန်ငွေ ${money(balance)} ထက် မကျော်ရပါ`, [
      `အခုရိုက်ထားသော amount: ${money(amount)}`,
    ]);
    return;
  }

  const paymentDate = els.extraPaymentDate.value;
  const paymentType = els.extraPaymentType.value;
  const previousFulfillmentStatus = sale.fulfillmentStatus;
  sale.payments = sale.payments || [];
  sale.payments.push({
    id: uid("payment"),
    paymentDate,
    paymentType,
    amount,
    note: "Follow-up payment",
  });
  if (els.extraFulfillmentStatus.value) {
    sale.fulfillmentStatus = els.extraFulfillmentStatus.value;
  }
  const details = [
    `ငွေထပ်သွင်း: ${money(amount)}`,
    `Payment Method: ${paymentType}`,
    `Payment Date: ${paymentDate}`,
  ];
  if (String(previousFulfillmentStatus || "") !== String(sale.fulfillmentStatus || "")) {
    details.push(`ပစ္စည်းပေးအခြေအနေ: ${fulfillmentStatusLabel(previousFulfillmentStatus)} → ${fulfillmentStatusLabel(sale.fulfillmentStatus)}`);
  }
  details.push(`Paid: ${money(salePaid(sale))}`);
  details.push(`Balance: ${money(saleBalance(sale))}`);
  saveState();
  els.saleStatus.textContent = `${sale.voucherNumber} payment ထပ်သွင်းပြီး`;
  renderAll();
  clearVoucherSearchPanel();
  showSaleNotice("success", "ငွေထပ်သွင်းပြီးပါပြီ", `${sale.voucherNumber} မှာ ကျန်ငွေထပ်သွင်းပြီးပါပြီ`, details);
}

function saveVoucherPayment(paymentId) {
  if (!hasPermission("sale")) return;
  const sale = findVoucher();
  if (!sale) return;
  const payment = (sale.payments || []).find((item) => item.id === paymentId);
  const row = els.voucherPaymentDetails.querySelector(`[data-payment-row="${paymentId}"]`);
  if (!payment || !row) return;

  const nextAmount = Number(row.querySelector('[data-payment-field="amount"]').value || 0);
  const totalWithoutThisPayment = salePaid(sale) - Number(payment.amount || 0);
  if (nextAmount <= 0) {
    els.saleStatus.textContent = "Payment amount ထည့်ပါ";
    showSaleNotice("warning", "Payment Amount လိုနေပါတယ်", "Payment ပြင်ရန် amount ထည့်ပေးပါ");
    return;
  }
  if (totalWithoutThisPayment + nextAmount > Number(sale.totalPrice || 0)) {
    const remaining = Math.max(0, Number(sale.totalPrice || 0) - totalWithoutThisPayment);
    els.saleStatus.textContent = `Payment amount က ကျန်ငွေ ${money(remaining)} ထက်များနေပါတယ်`;
    showSaleNotice("warning", "Payment Amount များနေပါတယ်", `Payment amount က ကျန်ငွေ ${money(remaining)} ထက် မကျော်ရပါ`, [
      `အခုရိုက်ထားသော amount: ${money(nextAmount)}`,
    ]);
    return;
  }

  const beforePayment = { ...payment };
  const nextPaymentDate = row.querySelector('[data-payment-field="paymentDate"]').value;
  const nextPaymentType = row.querySelector('[data-payment-field="paymentType"]').value;
  payment.paymentDate = nextPaymentDate;
  payment.paymentType = nextPaymentType;
  payment.amount = nextAmount;
  const details = [];
  if (String(beforePayment.paymentDate || "") !== String(payment.paymentDate || "")) {
    details.push(`Payment Date: ${beforePayment.paymentDate || "-"} → ${payment.paymentDate || "-"}`);
  }
  if (String(beforePayment.paymentType || "") !== String(payment.paymentType || "")) {
    details.push(`Payment Method: ${beforePayment.paymentType || "-"} → ${payment.paymentType || "-"}`);
  }
  if (Number(beforePayment.amount || 0) !== Number(payment.amount || 0)) {
    details.push(`Amount: ${money(beforePayment.amount)} → ${money(payment.amount)}`);
  }
  if (!details.length) details.push("ငွေလက်ခံစာကြောင်းကို ပြောင်းလဲချက်မရှိဘဲ ပြန်သိမ်းထားပါတယ်");
  details.push(`Paid: ${money(salePaid(sale))}`);
  details.push(`Balance: ${money(saleBalance(sale))}`);
  saveState();
  els.saleStatus.textContent = `${sale.voucherNumber} payment ပြင်ပြီး`;
  renderAll();
  clearVoucherSearchPanel();
  showSaleNotice("success", "ငွေလက်ခံစာကြောင်း ပြင်ပြီးပါပြီ", `${sale.voucherNumber} မှာ အောက်ပါအချက်တွေ ပြင်ပြီးပါပြီ`, details);
}

function deleteVoucherPayment(paymentId) {
  if (!hasPermission("sale")) return;
  const sale = findVoucher();
  if (!sale) return;
  const deletedPayment = (sale.payments || []).find((payment) => payment.id === paymentId);
  sale.payments = (sale.payments || []).filter((payment) => payment.id !== paymentId);
  saveState();
  els.saleStatus.textContent = `${sale.voucherNumber} payment ဖျက်ပြီး`;
  renderAll();
  clearVoucherSearchPanel();
  showSaleNotice("success", "ငွေလက်ခံစာကြောင်း ဖျက်ပြီးပါပြီ", `${sale.voucherNumber} ထဲက ငွေလက်ခံစာကြောင်းကို ဖျက်ပြီးပါပြီ`, [
    deletedPayment ? `ဖျက်လိုက်သောငွေ: ${money(deletedPayment.amount)} (${deletedPayment.paymentType} • ${deletedPayment.paymentDate})` : "",
    `Paid: ${money(salePaid(sale))}`,
    `Balance: ${money(saleBalance(sale))}`,
  ]);
}

function deleteVoucher(id) {
  if (!hasPermission("sale")) return;
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  const ok = confirm(`${sale.voucherNumber} voucher ကိုဖျက်မည်။ Stock status ကို available ပြန်လုပ်မည်။ သေချာပါသလား?`);
  if (!ok) return;
  releaseSaleStock(sale);
  state.sales = state.sales.filter((item) => item.id !== id);
  if (editingSaleId === id) clearSaleForm();
  if (els.voucherSearch.value.trim().toLowerCase() === sale.voucherNumber.toLowerCase()) {
    els.voucherSearch.value = "";
  }
  saveState();
  els.saleStatus.textContent = `${sale.voucherNumber} voucher ဖျက်ပြီး`;
  renderAll();
  renderVoucherPaymentDetails();
  showSaleNotice("success", "Voucher ဖျက်ပြီးပါပြီ", `${sale.voucherNumber} ကိုဖျက်ပြီး Stock status ပြန်ဖွင့်ပြီးပါပြီ`);
}

function addExpense(form) {
  if (!hasPermission("expense")) return;
  const existingExpense = editingExpenseId ? state.expenses.find((expense) => expense.id === editingExpenseId) : null;
  const expense = existingExpense || {
    id: uid("expense"),
    expenseDate: els.expenseDate.value,
    createdAt: new Date().toISOString(),
  };

  Object.assign(expense, {
    expenseDate: els.expenseDate.value,
    description: form.description.value.trim(),
    amount: Number(form.amount.value),
  });

  if (!existingExpense) state.expenses.unshift(expense);
  editingExpenseId = "";
  saveState();
  form.reset();
  els.expenseDate.value = expense.expenseDate;
  els.expenseForm.querySelector("button[type=\"submit\"]").textContent = "+ Expense ထည့်မယ်";
  renderAll();
}

function editExpense(id) {
  if (!hasPermission("expense")) return;
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) return;
  editingExpenseId = id;
  els.expenseDate.value = expense.expenseDate;
  els.expenseForm.description.value = expense.description || "";
  els.expenseForm.amount.value = expense.amount || "";
  els.expenseForm.querySelector("button[type=\"submit\"]").textContent = "Expense ပြင်မယ်";
  renderExpenseTable();
}

function deleteExpense(id) {
  if (!hasPermission("expense")) return;
  state.expenses = state.expenses.filter((expense) => expense.id !== id);
  if (editingExpenseId === id) {
    editingExpenseId = "";
    els.expenseForm.reset();
    els.expenseDate.value = today;
    els.expenseForm.querySelector("button[type=\"submit\"]").textContent = "+ Expense ထည့်မယ်";
  }
  saveState();
  renderAll();
}

function renderExpenseTable() {
  const selectedDate = els.expenseDate.value || today;
  const rows = state.expenses
    .filter((expense) => expense.expenseDate === selectedDate)
    .sort((a, b) => byDateDesc(a, b, "createdAt"));
  const total = rows.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  els.expenseTableTotal.textContent = money(total);
  els.expenseTable.innerHTML = rows.length
    ? rows
        .map(
          (expense, index) => `
            <tr>
              <td>${index + 1}</td>
              <td>${escapeHtml(expense.description || "-")}</td>
              <td><strong>${money(expense.amount)}</strong></td>
              <td>
                <div class="row-actions">
                  <button class="icon-button" type="button" data-edit-expense="${expense.id}" title="Edit expense">E</button>
                  <button class="icon-button danger" type="button" data-delete-expense="${expense.id}" title="Delete expense">x</button>
                </div>
              </td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="4"><div class="empty">${escapeHtml(selectedDate)} အတွက် Expense မရှိသေးပါ</div></td></tr>`;
}

function deleteStock(id) {
  if (!hasPermission("stock")) return;
  const item = state.stock.find((stockItem) => stockItem.id === id);
  if (!item || item.status === "sold") return;
  state.stock = state.stock.filter((stockItem) => stockItem.id !== id);
  if (selectedStockId === id) selectedStockId = "";
  saveState();
  renderAll();
}

function addStaff(form) {
  if (!hasPermission("settings")) return;
  state.staff.push({
    id: uid("staff"),
    name: form.name.value.trim(),
    role: form.role.value,
    password: form.password.value,
  });
  saveState();
  form.reset();
  renderAll();
}

function updateStaffPassword(id, password) {
  if (!hasPermission("settings")) return;
  const staff = state.staff.find((item) => item.id === id);
  if (!staff) return;
  staff.password = password;
  saveState();
  renderAll();
}

function updateStaff(id, role) {
  if (!hasPermission("settings")) return;
  const staff = state.staff.find((item) => item.id === id);
  if (!staff) return;
  staff.role = role;
  saveState();
  renderAll();
}

function removeStaff(id) {
  if (!hasPermission("settings")) return;
  const staff = state.staff.find((item) => item.id === id);
  if (!staff || staff.locked || staff.id === state.currentStaffId) return;
  state.staff = state.staff.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function addSalePerson(form) {
  if (!hasPermission("settings")) return;
  const name = form.name.value.trim();
  if (!name) return;
  const existing = activeSalePersons().find((person) => person.name.toLowerCase() === name.toLowerCase());
  if (existing) {
    form.reset();
    return;
  }
  state.salePersons.push({ id: uid("sale-person"), name });
  saveState();
  form.reset();
  renderAll();
}

function removeSalePerson(id) {
  if (!hasPermission("settings")) return;
  const person = state.salePersons.find((item) => item.id === id);
  if (!person) return;
  const isUsed = state.sales.some((sale) => sale.salePerson === person.name) || state.saleDrafts.some((draft) => draft.salePerson === person.name);
  if (isUsed) person.removed = true;
  else state.salePersons = state.salePersons.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function addCategory(form) {
  if (!hasPermission("settings")) return;
  const categoryName = form.category.value.trim();
  const prefix = normalizeCode(form.prefix.value || categoryName[0] || "X");
  const subCategory = form.subCategory.value.trim();
  let category = state.categories.find((item) => item.name.toLowerCase() === categoryName.toLowerCase());

  if (!category) {
    category = { id: uid("cat"), name: categoryName, prefix, subcategories: [] };
    state.categories.push(category);
  } else {
    category.prefix = prefix || category.prefix;
  }

  if (subCategory && !category.subcategories.includes(subCategory)) {
    category.subcategories.push(subCategory);
  }

  saveState();
  form.reset();
  renderAll();
}

function removeCategory(id) {
  if (!hasPermission("settings")) return;
  state.categories = state.categories.filter((category) => category.id !== id);
  saveState();
  renderAll();
}

function removeSubCategory(categoryId, subCategory) {
  if (!hasPermission("settings")) return;
  const category = state.categories.find((item) => item.id === categoryId);
  if (!category) return;
  category.subcategories = category.subcategories.filter((item) => item !== subCategory);
  saveState();
  renderAll();
}

function renderMetrics() {
  const todayPayments = allPayments().filter((payment) => payment.paymentDate === today);
  const todayExpenses = state.expenses.filter((expense) => expense.expenseDate === today);
  const cashReceived = paymentTotal(todayPayments);
  const costTotal = soldItemCostForSales(state.sales.filter((sale) => firstPaymentDate(sale) === today));
  const expenseTotal = todayExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const pendingProduction = pendingProductionOrderCount();
  const fulfillmentDue = todayFulfillmentDueCount();

  els.metricStock.textContent = state.stock.reduce(
    (sum, item) => sum + (item.itemType === "sku" ? Number(item.quantityAvailable || 0) : item.status === "available" ? 1 : 0),
    0
  );
  els.metricSales.textContent = money(cashReceived);
  els.metricExpense.textContent = money(expenseTotal);
  els.metricNet.textContent = money(cashReceived - costTotal - expenseTotal);
  els.metricProductionPending.textContent = pendingProduction;
  els.metricFulfillmentDue.textContent = fulfillmentDue;
}

function quickActionsForCurrentRole() {
  const actions = [
    { permission: "sale", view: "sale", action: "newSale", title: "New Voucher", detail: "ရောင်းချမှုအသစ်ထည့်ရန်", tone: "primary" },
    { permission: "production", view: "production", title: "Production Orders", detail: "Order inbox / status update", tone: "amber" },
    { permission: "vouchers", view: "vouchers", title: "Existing Voucher", detail: "ငွေထပ်သွင်း / voucher ပြန်ပြင်", tone: "green" },
    { permission: "fulfillment", view: "fulfillment", title: "Pickup / Delivery", detail: "ပစ္စည်းပေးရန်စာရင်းကြည့်ရန်", tone: "amber" },
    { permission: "expense", view: "expense", title: "Daily Expense", detail: "နေ့စဥ်အထွက်စာရင်းထည့်ရန်", tone: "coral" },
    { permission: "stock", view: "stock", title: "Add Stock", detail: "Production item အသစ်ထည့်ရန်", tone: "green" },
    { permission: "sticker", view: "sticker", title: "Sticker Print", detail: "Product code label ထုတ်ရန်", tone: "amber" },
    { permission: "inventory", view: "inventory", title: "Inventory", detail: "လက်ကျန် / sold item ပြန်ကြည့်ရန်", tone: "blue" },
    { permission: "reports", view: "reports", title: "Reports", detail: "စာရင်းချုပ် / performance", tone: "plum" },
    { permission: "settings", view: "settings", title: "Settings", detail: "Staff / category / permission", tone: "neutral" },
    { permission: "dashboard", view: "dashboard", title: "Admin Dashboard", detail: "ဆိုင်စာရင်းအကျဥ်းချုပ်", tone: "neutral" },
  ];
  return actions.filter((action) => hasPermission(action.permission));
}

function queueSaleText(sale) {
  const itemText = (sale.items || [])
    .slice(0, 2)
    .map((item) => item.description)
    .join(", ");
  return `${sale.voucherNumber} • ${itemText || "No item"} • ${fulfillmentMethodLabel(sale.fulfillmentMethod)}`;
}

function queueButton({ title, detail, amount = "", view = "vouchers", saleId = "", draftId = "", tone = "" }) {
  return `
    <button class="queue-item ${tone}" type="button" data-queue-view="${escapeHtml(view)}" data-queue-sale="${escapeHtml(saleId)}" data-queue-draft="${escapeHtml(draftId)}">
      <span>${escapeHtml(title)}<small>${escapeHtml(detail)}</small></span>
      ${amount ? `<strong>${escapeHtml(amount)}</strong>` : ""}
    </button>
  `;
}

function renderHome() {
  if (!els.quickActionGrid) return;
  const staff = currentStaff();
  els.queueDateLabel.textContent = today;
  const productionOnly = hasPermission("production") && !hasPermission("sale");

  els.quickActionGrid.innerHTML = quickActionsForCurrentRole()
    .map(
      (action) => `
        <button class="quick-action-card ${action.tone}" type="button" data-quick-view="${escapeHtml(action.view)}" data-quick-action="${escapeHtml(action.action || "")}">
          <span>${escapeHtml(action.title)}</span>
          <strong>${escapeHtml(action.detail)}</strong>
        </button>
      `
    )
    .join("");

  const orderDateValue = (order) => order.fulfillmentDate || order.orderDate || order.saleDate || today;
  if (productionOnly) {
    const openOrders = (state.productionOrders || [])
      .filter((order) => (order.status || "new") !== "done")
      .sort((a, b) => {
        const urgentCompare = Number(b.urgency === "urgent") - Number(a.urgency === "urgent");
        if (urgentCompare) return urgentCompare;
        const dateCompare = String(orderDateValue(a)).localeCompare(String(orderDateValue(b)));
        if (dateCompare) return dateCompare;
        return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
      });
    const dueOrders = openOrders.filter((order) => orderDateValue(order) <= today).slice(0, 8);
    const newOrders = openOrders.filter((order) => (order.status || "new") === "new").slice(0, 6);
    const futureOrders = openOrders.filter((order) => orderDateValue(order) > today).slice(0, 6);

    els.todayWorkQueue.innerHTML = dueOrders.length
      ? dueOrders
          .map((order) =>
            queueButton({
              title: order.urgency === "urgent" ? "Urgent Order" : "လုပ်ရန် Order",
              detail: `${orderDateValue(order)} • ${order.voucherNumber || "-"} • ${order.requirement || order.items?.[0]?.description || "Order"}`,
              amount: productionOrderStatusLabel(order.status),
              view: "production",
              tone: order.urgency === "urgent" || (order.status || "new") === "new" ? "danger" : "pickup",
            })
          )
          .join("")
      : `<div class="empty">ဒီနေ့လုပ်ရန် production order မရှိသေးပါ</div>`;

    const attentionRows = [
      ...newOrders.map((order) =>
        queueButton({
          title: "Order အသစ်",
          detail: `${orderDateValue(order)} • ${order.voucherNumber || "-"} • ${order.requirement || order.items?.[0]?.description || "Accept လုပ်ရန်"}`,
          amount: "Accept",
          view: "production",
          tone: "danger",
        })
      ),
      ...futureOrders.map((order) =>
        queueButton({
          title: "နောက်ရက် Order",
          detail: `${orderDateValue(order)} • ${order.voucherNumber || "-"} • ${order.requirement || order.items?.[0]?.description || "Order"}`,
          amount: productionOrderStatusLabel(order.status),
          view: "production",
          tone: "delivery",
        })
      ),
    ];
    els.attentionQueue.innerHTML = attentionRows.length
      ? attentionRows.join("")
      : `<div class="empty">Production team အတွက် သတိထားရန် order မရှိသေးပါ</div>`;
    return;
  }

  const dueToday = state.sales
    .filter((sale) => (sale.fulfillmentStatus || "pending") !== "delivered")
    .filter((sale) => (sale.fulfillmentDate || sale.saleDate) === today)
    .sort((a, b) => String(a.voucherNumber || "").localeCompare(String(b.voucherNumber || "")));
  const draftRows = (state.saleDrafts || []).slice(0, 3);
  const newProductionOrders = (state.productionOrders || []).filter((order) => order.status !== "done").slice(0, 4);
  const productionPendingCount = pendingProductionOrderCount();
  const fulfillmentDueCount = todayFulfillmentDueCount();

  const queueRows = [
    ...(productionPendingCount && hasPermission("production")
      ? [
          queueButton({
            title: "Production Pending",
            detail: "Order / Pending မပြီးသေး",
            amount: `${productionPendingCount}`,
            view: "production",
            tone: "danger",
          }),
        ]
      : []),
    ...(fulfillmentDueCount && hasPermission("fulfillment")
      ? [
          queueButton({
            title: "Pickup / Delivery Today",
            detail: "ဒီနေ့ ပစ္စည်းပေးရန်ကျန်",
            amount: `${fulfillmentDueCount}`,
            view: "fulfillment",
            tone: "delivery",
          }),
        ]
      : []),
    ...newProductionOrders.map((order) =>
      queueButton({
        title: "Production Order",
        detail: `${order.voucherNumber} • ${order.requirement || order.items?.[0]?.description || "New order"}`,
        amount: productionOrderStatusLabel(order.status),
        view: "production",
        tone: order.urgency === "urgent" ? "danger" : "pickup",
      })
    ),
    ...dueToday.map((sale) =>
      queueButton({
        title: "ပစ္စည်းပေးရန်",
        detail: queueSaleText(sale),
        amount: saleBalance(sale) ? `Balance ${money(saleBalance(sale))}` : "Paid",
        view: "fulfillment",
        saleId: sale.id,
        tone: sale.fulfillmentMethod === "delivery" ? "delivery" : "pickup",
      })
    ),
    ...draftRows.map((draft) =>
      queueButton({
        title: "Hold Voucher",
        detail: `${draft.voucherNumber || "No Voucher No."} • ${draft.items?.length || 0} items`,
        amount: money((draft.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0)),
        view: "sale",
        draftId: draft.id,
      })
    ),
  ];
  els.todayWorkQueue.innerHTML = queueRows.length ? queueRows.join("") : `<div class="empty">ဒီနေ့အတွက် လုပ်ရန် queue မရှိသေးပါ</div>`;

  const overdue = state.sales
    .filter((sale) => (sale.fulfillmentStatus || "pending") !== "delivered")
    .filter((sale) => (sale.fulfillmentDate || sale.saleDate) < today)
    .slice(0, 4);
  const balances = state.sales.filter((sale) => saleBalance(sale) > 0).slice(0, 4);
  const attentionRows = [
    ...overdue.map((sale) =>
      queueButton({
        title: "Overdue pickup/delivery",
        detail: `${sale.fulfillmentDate || sale.saleDate} • ${queueSaleText(sale)}`,
        amount: fulfillmentStatusLabel(sale.fulfillmentStatus),
        view: "fulfillment",
        saleId: sale.id,
        tone: "danger",
      })
    ),
    ...balances.map((sale) =>
      queueButton({
        title: "ကျန်ငွေရရန်",
        detail: `${sale.voucherNumber} • ${sale.salePerson || "-"}`,
        amount: money(saleBalance(sale)),
        view: "vouchers",
        saleId: sale.id,
        tone: "money",
      })
    ),
  ];
  els.attentionQueue.innerHTML = attentionRows.length
    ? attentionRows.join("")
    : `<div class="empty">${staff?.name || "Staff"} အတွက် သတိထားရန် record မရှိသေးပါ</div>`;
}

function openQueueTarget(view, saleId = "", draftId = "") {
  const sale = state.sales.find((item) => item.id === saleId);
  if (view === "sale" && draftId) {
    goToView("sale");
    openSaleDraft(draftId);
    return;
  }
  if (view === "vouchers" && sale) {
    els.voucherSearch.value = sale.voucherNumber || "";
    renderVoucherPaymentDetails();
  }
  if (view === "fulfillment" && sale) {
    els.fulfillmentFilterDate.value = sale.fulfillmentDate || sale.saleDate || today;
    els.fulfillmentSearch.value = sale.voucherNumber || "";
    renderFulfillmentTable();
  }
  goToView(view);
}

function productionOrderStatusLabel(status) {
  return {
    new: "New",
    accepted: "Accepted",
    making: "Making",
    done: "Done",
  }[status] || status || "New";
}

function productionOrderColumn(status) {
  if (status === "done") return "done";
  if (status === "accepted" || status === "making") return "pending";
  return "order";
}

function playProductionOrderSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = 880;
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.45);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
  } catch {
    // Notification sound is a convenience; order saving must not fail if audio is blocked.
  }
}

function notifyProductionOrder(order) {
  playProductionOrderSound();
  if (!("Notification" in window)) return;
  const title = `Production Order ${order.voucherNumber}`;
  const body = `${order.urgency === "urgent" ? "Urgent • " : ""}${order.items.map((item) => item.description).join(", ") || "New order"}`;
  if (Notification.permission === "granted") {
    new Notification(title, { body });
    return;
  }
  if (Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") new Notification(title, { body });
    });
  }
}

function productionOrderItemsFromSale() {
  return saleItems.map((item) => ({
    id: item.id,
    productCode: item.productCode || "",
    description: item.description || "",
    quantity: Number(item.quantity || 1),
  }));
}

function renderProductionPhotoPreview() {
  els.productionOrderPhotoPreview.innerHTML = productionPhotoDraft.length
    ? productionPhotoDraft
        .map(
          (photo, index) => `
            <div class="photo-preview">
              <img src="${photo.dataUrl}" alt="${escapeHtml(photo.name)}" />
              <button class="icon-button danger" type="button" data-remove-production-photo="${index}" title="Remove photo">x</button>
            </div>
          `
        )
        .join("")
    : `<span class="muted">Reference photo ရှိရင် ဒီမှာတွဲပို့နိုင်ပါတယ်</span>`;
}

function readImageFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve({ name: file.name, type: file.type, dataUrl: reader.result });
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function handleProductionPhotos(event) {
  const files = [...(event.target.files || [])].filter((file) => file.type.startsWith("image/")).slice(0, 4);
  productionPhotoDraft = await Promise.all(files.map(readImageFile));
  els.productionComposeStatus.textContent = `${productionPhotoDraft.length} photo တွဲပြီး`;
  renderProductionPhotoPreview();
}

function clearProductionCompose() {
  editingProductionOrderId = "";
  productionPhotoDraft = [];
  els.productionOrderVoucher.value = "";
  els.productionOrderRequirement.value = "";
  els.productionOrderUrgency.value = "normal";
  els.productionOrderDate.value = els.fulfillmentDate.value || els.saleForm.saleDate.value || today;
  els.productionOrderPhotos.value = "";
  els.sendProductionOrderButton.textContent = "Order တင်မယ်";
  els.cancelProductionEditButton.hidden = true;
  renderProductionPhotoPreview();
}

function openProductionOrderFromSale() {
  if (!hasPermission("production")) return;
  els.productionOrderVoucher.value = els.saleForm.voucherNumber.value.trim();
  els.productionOrderDate.value = els.fulfillmentDate.value || els.saleForm.saleDate.value || today;
  els.productionComposeStatus.textContent = saleItems.length
    ? `${saleItems.length} item နဲ့ Production Order တင်နိုင်ပါပြီ`
    : "Voucher item ထည့်ပြီး Production Order တင်ပါ";
  renderProductionPhotoPreview();
  goToView("production");
}

function sendProductionOrder() {
  if (!hasPermission("production") && !hasPermission("sale")) return;
  const existingOrder = editingProductionOrderId ? state.productionOrders.find((item) => item.id === editingProductionOrderId) : null;
  const voucherNumber = (els.productionOrderVoucher.value || els.saleForm.voucherNumber.value).trim();
  const requirement = els.productionOrderRequirement.value.trim() || els.saleForm.elements.note.value.trim();
  const items = existingOrder ? existingOrder.items || [] : productionOrderItemsFromSale();
  if (!voucherNumber) {
    els.productionComposeStatus.textContent = "Voucher Number ထည့်ပြီးမှ order တင်ပါ";
    els.productionOrderVoucher.focus();
    return;
  }
  if (!items.length && !requirement) {
    els.productionComposeStatus.textContent = "Item သို့မဟုတ် customer requirement ထည့်ပါ";
    return;
  }

  const order = existingOrder || {
    id: uid("prod"),
    voucherNumber,
    orderDate: today,
    status: "new",
    createdBy: currentStaff()?.name || "",
    createdAt: new Date().toISOString(),
  };

  Object.assign(order, {
    voucherNumber,
    saleDate: existingOrder?.saleDate || els.saleForm.saleDate.value || today,
    salePerson: existingOrder?.salePerson || els.saleForm.salePerson.value || currentStaff()?.name || "",
    fulfillmentDate: els.productionOrderDate.value || els.fulfillmentDate.value || els.saleForm.saleDate.value || today,
    fulfillmentMethod: existingOrder?.fulfillmentMethod || els.fulfillmentMethod.value || defaultFulfillmentMethod,
    urgency: els.productionOrderUrgency.value,
    requirement,
    items,
    photos: productionPhotoDraft.map((photo) => ({ ...photo })),
    updatedAt: new Date().toISOString(),
  });

  if (!existingOrder) state.productionOrders.unshift(order);
  saveState();
  clearProductionCompose();
  els.productionComposeStatus.textContent = `${order.voucherNumber} ${existingOrder ? "ပြင်ပြီး" : "Production ထဲပို့ပြီး"}`;
  if (!existingOrder) notifyProductionOrder(order);
  renderAll();
}

function renderProductionOrders() {
  if (!els.productionOrderList) return;
  const keyword = els.productionOrderSearch.value.trim().toLowerCase();
  const selectedDate = els.productionOrderDateFilter.value;
  const matchesProductionKeyword = (order) => {
    const itemText = (order.items || []).map((item) => `${item.productCode} ${item.description}`).join(" ");
    const text = `${order.voucherNumber} ${order.requirement} ${order.salePerson} ${order.createdBy} ${itemText}`.toLowerCase();
    return text.includes(keyword);
  };
  const orderDateValue = (order) => order.fulfillmentDate || order.orderDate || order.saleDate || "";
  const newOrderCount = newProductionOrderCount();
  if (els.productionNewOrderCount) els.productionNewOrderCount.textContent = newOrderCount;
  renderNavBadges();

  const rows = state.productionOrders
    .filter((order) => !selectedDate || (order.fulfillmentDate || order.orderDate || order.saleDate) === selectedDate)
    .filter(matchesProductionKeyword)
    .sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));

  const futureRows = state.productionOrders
    .filter((order) => orderDateValue(order) > today)
    .filter(matchesProductionKeyword)
    .sort((a, b) => {
      const dateCompare = String(orderDateValue(a)).localeCompare(String(orderDateValue(b)));
      if (dateCompare) return dateCompare;
      return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
    });
  renderProductionOrderTable(futureRows);

  const columns = [
    { key: "order", title: "Order", empty: "Order အသစ်မရှိသေးပါ" },
    { key: "pending", title: "Pending", empty: "လုပ်နေဆဲ order မရှိသေးပါ" },
    { key: "done", title: "Done", empty: "ပြီးသွားတဲ့ order မရှိသေးပါ" },
  ];
  const grouped = rows.reduce(
    (map, order) => {
      map[productionOrderColumn(order.status)].push(order);
      return map;
    },
    { order: [], pending: [], done: [] }
  );

  els.productionOrderList.innerHTML = columns
    .map(
      (column) => `
        <section class="production-column">
          <div class="production-column-head">
            <h3>${column.title}</h3>
            <span class="status-pill">${grouped[column.key].length}</span>
          </div>
          <div class="production-column-list">
            ${
              grouped[column.key].length
                ? grouped[column.key].map(productionOrderCardHtml).join("")
                : `<div class="empty compact-empty">${column.empty}</div>`
            }
          </div>
        </section>
      `
    )
    .join("");
}

function renderProductionOrderTable(rows = []) {
  if (!els.productionOrderTable) return;
  els.productionOrderTable.innerHTML = rows.length
    ? rows
        .slice(0, 12)
        .map((order) => {
          const itemText = (order.items || [])
            .map((item) => `${item.productCode || "Manual"} ${item.description || ""} x${item.quantity || 1}`.trim())
            .join(" | ");
          return `
            <tr>
              <td>${escapeHtml(order.fulfillmentDate || order.orderDate || "-")}</td>
              <td><strong>${escapeHtml(order.voucherNumber || "-")}</strong><br><span class="muted">${escapeHtml(order.salePerson || "-")}</span></td>
              <td>${escapeHtml(itemText || order.requirement || "-")}</td>
              <td><span class="fulfillment-badge ${order.status === "done" ? "delivered" : ""}">${escapeHtml(productionOrderStatusLabel(order.status))}</span></td>
              <td>
                <div class="row-actions">
                  <button class="button secondary tiny-button" type="button" data-edit-production-order="${order.id}">Edit</button>
                  <button class="icon-button danger" type="button" data-delete-production-order="${order.id}" title="Delete order">x</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">နောက်နေ့ Order မရှိသေးပါ</div></td></tr>`;
}

function productionOrderCardHtml(order) {
  const items = (order.items || [])
    .map((item) => `<li>${escapeHtml(item.productCode || "Manual")} - ${escapeHtml(item.description || "-")} x ${escapeHtml(item.quantity || 1)}</li>`)
    .join("");
  const photos = (order.photos || [])
    .map((photo) => `<img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || "Order photo")}" />`)
    .join("");
  const column = productionOrderColumn(order.status);
  const statusAction =
    column === "order"
      ? `<button class="button secondary tiny-button" type="button" data-production-status="${order.id}|accepted">Accepted</button>`
      : column === "pending"
        ? `<button class="button primary tiny-button" type="button" data-production-status="${order.id}|done">Done</button>`
        : `<button class="button secondary tiny-button" type="button" data-production-status="${order.id}|accepted">Reopen</button>`;
  const actions = `
    ${statusAction}
    <button class="button secondary tiny-button" type="button" data-edit-production-order="${order.id}">Edit</button>
    <button class="icon-button danger" type="button" data-delete-production-order="${order.id}" title="Delete order">x</button>
  `;

  return `
    <article class="production-order-card ${order.urgency === "urgent" ? "urgent" : ""}">
      <div class="production-order-head">
        <div>
          <strong>${escapeHtml(order.voucherNumber)}</strong>
          <span>${escapeHtml(order.fulfillmentDate || "-")} • ${escapeHtml(fulfillmentMethodLabel(order.fulfillmentMethod))} • ${escapeHtml(order.salePerson || "-")}</span>
        </div>
        <div class="order-badges">
          <span class="fulfillment-badge ${order.status === "done" ? "delivered" : ""}">${escapeHtml(productionOrderStatusLabel(order.status))}</span>
          ${order.urgency === "urgent" ? `<span class="pending-code">Urgent</span>` : ""}
        </div>
      </div>
      <ul>${items || `<li>${escapeHtml(order.requirement || "Requirement only")}</li>`}</ul>
      ${order.requirement ? `<p>${escapeHtml(order.requirement)}</p>` : ""}
      ${photos ? `<div class="order-photo-grid">${photos}</div>` : ""}
      <div class="row-actions">${actions}</div>
    </article>
  `;
}

function updateProductionOrderStatus(id, status) {
  const order = state.productionOrders.find((item) => item.id === id);
  if (!order) return;
  order.status = status;
  order.updatedAt = new Date().toISOString();
  saveState();
  renderProductionOrders();
  renderHome();
}

function editProductionOrder(id) {
  const order = state.productionOrders.find((item) => item.id === id);
  if (!order) return;
  editingProductionOrderId = id;
  productionPhotoDraft = (order.photos || []).map((photo) => ({ ...photo }));
  els.productionOrderVoucher.value = order.voucherNumber || "";
  els.productionOrderUrgency.value = order.urgency || "normal";
  els.productionOrderDate.value = order.fulfillmentDate || order.orderDate || today;
  els.productionOrderRequirement.value = order.requirement || "";
  els.productionOrderPhotos.value = "";
  els.sendProductionOrderButton.textContent = "Order ပြင်မယ်";
  els.cancelProductionEditButton.hidden = false;
  els.productionComposeStatus.textContent = `${order.voucherNumber || "Order"} ပြင်နေသည်`;
  renderProductionPhotoPreview();
  document.querySelector("#production .production-compose")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteProductionOrder(id) {
  const order = state.productionOrders.find((item) => item.id === id);
  if (!order) return;
  const ok = confirm(`${order.voucherNumber || "Order"} ကိုဖျက်မည်။ သေချာပါသလား?`);
  if (!ok) return;
  state.productionOrders = state.productionOrders.filter((item) => item.id !== id);
  if (editingProductionOrderId === id) clearProductionCompose();
  saveState();
  els.productionComposeStatus.textContent = `${order.voucherNumber || "Order"} ဖျက်ပြီး`;
  renderProductionOrders();
  renderHome();
}

function soldByForStock(stockId) {
  const sale = saleForStock(stockId);
  return sale?.salePerson || "-";
}

function saleForStock(stockId) {
  const stockItem = state.stock.find((item) => item.id === stockId);
  if (stockItem?.saleId) {
    const sale = state.sales.find((entry) => entry.id === stockItem.saleId);
    if (sale) return sale;
  }
  return state.sales.find((entry) => entry.items?.some((item) => item.stockId === stockId));
}

function voucherForStock(stockId) {
  const sale = saleForStock(stockId);
  return sale
    ? {
        id: sale.id,
        voucherNumber: sale.voucherNumber || "-",
      }
    : null;
}

function salePaid(sale) {
  return (sale.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function salePaymentsForDate(sale, paymentDate = "") {
  const payments = sale.payments || [];
  return paymentDate ? payments.filter((payment) => payment.paymentDate === paymentDate) : payments;
}

function salePaidForDate(sale, paymentDate = "") {
  return salePaymentsForDate(sale, paymentDate).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function paymentBreakdownText(sale, paymentDate = "") {
  const grouped = salePaymentsForDate(sale, paymentDate).reduce((map, payment) => {
    const type = payment.paymentType || sale.paymentType || "Cash";
    map[type] = (map[type] || 0) + Number(payment.amount || 0);
    return map;
  }, {});
  const entries = Object.entries(grouped).filter(([, amount]) => Number(amount || 0) > 0);
  return entries.length ? entries.map(([type, amount]) => `${escapeHtml(type)} ${money(amount)}`).join(" • ") : "Payment မရှိသေးပါ";
}

function saleOutstanding(sale) {
  return Number(sale.totalPrice || 0) - salePaid(sale);
}

function saleBalance(sale) {
  return Math.max(0, saleOutstanding(sale));
}

function allPayments() {
  return state.sales.flatMap((sale) =>
    (sale.payments || []).map((payment) => ({
      ...payment,
      saleId: sale.id,
      voucherNumber: sale.voucherNumber,
      salePerson: sale.salePerson,
    }))
  );
}

function periodPayments() {
  return allPayments().filter((payment) => isInPeriod(payment.paymentDate));
}

function paidSaleIdsForPayments(payments) {
  return new Set(payments.map((payment) => payment.saleId));
}

function firstPaymentDate(sale) {
  return [...(sale.payments || [])]
    .filter((payment) => Number(payment.amount || 0) > 0)
    .sort((a, b) => String(a.paymentDate || "").localeCompare(String(b.paymentDate || "")))[0]?.paymentDate;
}

function saleProductionCost(sale) {
  const itemCost = (sale.items || []).reduce((sum, item) => sum + Number(item.cost || 0), 0);
  return itemCost || Number(sale.productionCost || 0);
}

function recalculateSaleProductionCost(sale) {
  sale.productionCost = (sale.items || []).reduce((sum, item) => sum + Number(item.cost || 0), 0);
}

function syncSaleCostsForStock(stockId) {
  const stockItem = state.stock.find((item) => item.id === stockId);
  if (!stockItem) return;

  state.sales.forEach((sale) => {
    let changed = false;
    (sale.items || []).forEach((item) => {
      if (item.stockId !== stockId) return;
      item.cost = Number(stockItem.unitCost ?? stockItem.productionCost ?? 0) * Math.max(1, Number(item.quantity || 1));
      changed = true;
    });
    if (changed) recalculateSaleProductionCost(sale);
  });
}

function soldItemCostForSales(sales) {
  return sales.reduce((sum, sale) => sum + saleProductionCost(sale), 0);
}

function soldItemCostInCurrentPeriod() {
  return soldItemCostForSales(state.sales.filter((sale) => isInPeriod(firstPaymentDate(sale))));
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function releaseSaleStock(sale) {
  (sale.items || []).forEach((item) => {
    const stockItem = state.stock.find((stock) => stock.id === item.stockId);
    if (!stockItem) return;
    if (item.type === "sku_stock") {
      stockItem.quantityAvailable = Number(stockItem.quantityAvailable || 0) + Math.max(1, Number(item.quantity || 1));
      stockItem.status = stockItem.quantityAvailable > 0 ? "available" : "sold";
      return;
    }
    if (item.type !== "stock") return;
    if (stockItem.saleId === sale.id) {
      stockItem.status = "available";
      delete stockItem.saleId;
      delete stockItem.soldAt;
    }
  });
}

function applySaleStock(sale) {
  (sale.items || []).forEach((item) => {
    const stockItem = state.stock.find((stock) => stock.id === item.stockId);
    if (!stockItem) return;
    if (item.type === "sku_stock") {
      stockItem.quantityAvailable = Math.max(0, Number(stockItem.quantityAvailable || 0) - Math.max(1, Number(item.quantity || 1)));
      stockItem.status = stockItem.quantityAvailable > 0 ? "available" : "sold";
      return;
    }
    if (item.type === "stock") {
      stockItem.status = "sold";
      stockItem.saleId = sale.id;
      stockItem.soldAt = sale.saleDate;
    }
  });
}

function renderInventory() {
  if (els.inventoryCategoryFilter.options.length === 0) {
    populateSelect(
      els.inventoryCategoryFilter,
      state.categories.map((category) => ({ value: category.name, label: category.name })),
      "All Categories"
    );
    renderInventorySubcategoryFilter();
  }
  const keyword = els.inventorySearch.value.trim().toLowerCase();
  const filter = els.inventoryFilter.value;
  const typeFilter = els.inventoryTypeFilter.value;
  const categoryFilter = els.inventoryCategoryFilter.value;
  const subCategoryFilter = els.inventorySubCategoryFilter.value;

  const rows = state.stock
    .filter((item) => filter === "all" || item.status === filter)
    .filter((item) => typeFilter === "all" || (typeFilter === "sku" ? item.itemType === "sku" : item.itemType !== "sku"))
    .filter((item) => !categoryFilter || item.category === categoryFilter)
    .filter((item) => !subCategoryFilter || item.subCategory === subCategoryFilter)
    .filter((item) => {
      const voucher = voucherForStock(item.id);
      const text = `${item.productCode} ${item.description} ${item.category} ${item.subCategory} ${item.paperColor} ${item.florist} ${item.itemType} ${soldByForStock(item.id)} ${voucher?.voucherNumber || ""}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => {
      const aKey = a.createdAt || a.productionDate || "";
      const bKey = b.createdAt || b.productionDate || "";
      const dateCompare = String(bKey).localeCompare(String(aKey));
      if (dateCompare) return dateCompare;
      return String(b.productCode || "").localeCompare(String(a.productCode || ""));
    });

  if (!rows.length) {
    els.inventoryTable.innerHTML = `<tr><td colspan="13"><div class="empty">Stock record မရှိသေးပါ</div></td></tr>`;
    return;
  }

  els.inventoryTable.innerHTML = rows
    .map(
      (item) => {
        const isSku = item.itemType === "sku";
        const qtyText = isSku ? `${Number(item.quantityAvailable || 0)} / ${Number(item.quantityTotal || 0)}` : "1";
        const costText = isSku
          ? `${money(item.unitCost ?? item.productionCost)}<br><span class="muted">Total ${money(Number(item.unitCost ?? item.productionCost ?? 0) * Number(item.quantityTotal || 0))}</span>`
          : money(item.productionCost);
        const statusText = isSku ? (Number(item.quantityAvailable || 0) > 0 ? "available" : "sold") : item.status;
        const voucher = !isSku && item.status === "sold" ? voucherForStock(item.id) : null;
        const voucherCell =
          voucher && hasPermission("vouchers")
            ? `<button class="text-button" type="button" data-inventory-voucher="${voucher.id}">${escapeHtml(voucher.voucherNumber)}</button>`
            : escapeHtml(voucher?.voucherNumber || "-");
        return `
        <tr>
          <td><strong>${escapeHtml(item.productCode)}</strong></td>
          <td><span class="stock-badge ${isSku ? "sku" : ""}">${isSku ? "SKU" : "Floral"}</span></td>
          <td>${escapeHtml(item.productionDate)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${escapeHtml(item.category)}<br><span class="muted">${escapeHtml(item.subCategory || item.paperColor)}</span></td>
          <td>${escapeHtml(qtyText)}</td>
          <td>${costText}</td>
          <td>${money(item.salePrice)}</td>
          <td>${escapeHtml(isSku ? "Purchase" : item.florist)}</td>
          <td>${escapeHtml(!isSku && item.status === "sold" ? soldByForStock(item.id) : "-")}</td>
          <td>${voucherCell}</td>
          <td><span class="stock-badge ${statusText === "sold" ? "sold" : ""}">${escapeHtml(statusText)}</span></td>
          <td>
            <div class="row-actions">
              ${
                hasPermission("stock")
                  ? `<button class="icon-button" type="button" data-action="edit" data-id="${item.id}" title="Edit stock">E</button>`
                  : ""
              }
              <button class="icon-button" type="button" data-action="print" data-id="${item.id}" title="Print sticker">P</button>
              ${
                item.status === "available" && hasPermission("stock")
                  ? `<button class="icon-button danger" type="button" data-action="delete" data-id="${item.id}" title="Delete stock">x</button>`
                  : ""
              }
            </div>
          </td>
        </tr>
      `;
      }
    )
    .join("");
}
function renderSummary() {
  const sales = state.sales.filter((sale) => isInPeriod(sale.saleDate));
  const expenses = state.expenses.filter((expense) => isInPeriod(expense.expenseDate));
  const payments = periodPayments();
  const cashReceived = paymentTotal(payments);
  const costTotal = soldItemCostInCurrentPeriod();
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  els.summarySale.textContent = money(cashReceived);
  els.summaryCost.textContent = money(costTotal);
  els.summaryExpense.textContent = money(expenseTotal);
  els.summaryProfit.textContent = money(cashReceived - costTotal - expenseTotal);

  renderPaymentSummary(payments);
  renderReportInsights();
}

function periodStockItems() {
  return state.stock.filter((item) => isInPeriod(item.productionDate));
}

function topEntry(grouped, fallback = "-") {
  const entries = Object.entries(grouped).sort((a, b) => Number(b[1].total || b[1].count || b[1]) - Number(a[1].total || a[1].count || a[1]));
  return entries[0] || [fallback, { total: 0, count: 0 }];
}

function renderReportInsights() {
  if (!els.reportInsightGrid) return;
  els.reportInsightGrid.innerHTML = "";
}

function renderPaymentSummary(payments) {
  const grouped = payments.reduce((map, payment) => {
    map[payment.paymentType] = (map[payment.paymentType] || 0) + Number(payment.amount || 0);
    return map;
  }, {});

  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  els.paymentSummary.innerHTML = entries.length
    ? entries
        .map(
          ([type, total]) =>
            `<button class="mini-row payment-type-row" type="button" data-payment-type="${escapeHtml(type)}"><span>${escapeHtml(type)}</span><strong>${money(total)}</strong></button>`
        )
        .join("")
    : `<div class="empty">ဒီ period အတွက် payment record မရှိသေးပါ</div>`;
  renderPaymentDetailList(payments, entries[0]?.[0] || "");
}

function renderPaymentDetailList(payments, paymentType = "") {
  if (!paymentType) {
    els.paymentDetailList.innerHTML = "";
    return;
  }

  const rows = payments
    .filter((payment) => payment.paymentType === paymentType)
    .sort((a, b) => byDateDesc(a, b, "paymentDate"));
  els.paymentDetailList.innerHTML = rows.length
    ? [
        `<h3>${escapeHtml(paymentType)} Voucher Breakdown</h3>`,
        ...rows.map(
          (payment) =>
            `<button class="mini-row payment-voucher-row" type="button" data-summary-voucher="${payment.saleId}"><span>${escapeHtml(payment.paymentDate)} • ${escapeHtml(payment.voucherNumber)}<br>${escapeHtml(payment.salePerson || "-")}</span><strong>${money(payment.amount)}</strong></button>`
        ),
      ].join("")
    : "";
}

function openPaymentHistoryModal(saleId) {
  const sale = state.sales.find((item) => item.id === saleId);
  if (!sale) return;

  const paymentRows = (sale.payments || [])
    .slice()
    .sort((a, b) => String(a.paymentDate || "").localeCompare(String(b.paymentDate || "")))
    .map(
      (payment) => `
        <div class="payment-history-row">
          <span>${escapeHtml(payment.paymentDate)}<br><small>${escapeHtml(payment.paymentType)}</small></span>
          <strong>${money(payment.amount)}</strong>
        </div>
      `
    )
    .join("");

  const itemRows = (sale.items || [])
    .map((item) => `${escapeHtml(item.productCode || "Code Pending")} - ${escapeHtml(item.description)} (${escapeHtml(item.quantity || 1)})`)
    .join("<br>");

  els.paymentHistoryBody.innerHTML = `
    <div class="payment-history-summary">
      <strong>${escapeHtml(sale.voucherNumber)}</strong>
      <span>${escapeHtml(sale.saleDate)} • ${escapeHtml(sale.salePerson || "-")}</span>
      <small>${itemRows || "-"}</small>
    </div>
    <div class="payment-history-totals">
      <div><span>Total</span><strong>${money(sale.totalPrice)}</strong></div>
      <div><span>Paid</span><strong>${money(salePaid(sale))}</strong></div>
      <div><span>Balance</span><strong>${money(saleBalance(sale))}</strong></div>
    </div>
    <div class="payment-history-list">
      ${paymentRows || `<div class="empty">Payment မရှိသေးပါ</div>`}
    </div>
  `;
  openModal(els.paymentHistoryModal);
}

function renderPerformanceSummary(sales) {
  const salesByStaff = sales.reduce((map, sale) => {
    if (!map[sale.salePerson]) map[sale.salePerson] = { count: 0, total: 0 };
    map[sale.salePerson].count += 1;
    map[sale.salePerson].total += Number(sale.totalPrice || 0);
    return map;
  }, {});

  const productionByStaff = state.stock.filter((item) => isInPeriod(item.productionDate)).reduce((map, item) => {
    if (!map[item.florist]) map[item.florist] = { count: 0, cost: 0 };
    map[item.florist].count += 1;
    map[item.florist].cost += Number(item.productionCost || 0);
    return map;
  }, {});

  const saleRows = Object.entries(salesByStaff).map(
    ([staff, data]) => `<div class="mini-row"><span>Sale - ${escapeHtml(staff)} (${data.count})</span><strong>${money(data.total)}</strong></div>`
  );
  const productionRows = Object.entries(productionByStaff).map(
    ([staff, data]) => `<div class="mini-row"><span>Florist - ${escapeHtml(staff)}</span><strong>${data.count} pcs</strong></div>`
  );

  els.performanceSummary.innerHTML =
    saleRows.length || productionRows.length
      ? [...saleRows, ...productionRows].join("")
      : `<div class="empty">ဒီ period အတွက် staff performance မရှိသေးပါ</div>`;
}

function renderSettings() {
  els.staffList.innerHTML = activeStaff()
    .map(
      (staff) => `
        <div class="mini-row">
          <span>${escapeHtml(staff.name)}<br>${escapeHtml(roleLabels[staff.role])}</span>
          <select data-staff-role="${staff.id}" ${staff.locked && staff.id === "staff-admin" ? "disabled" : ""}>
            ${Object.entries(roleLabels)
              .map(([role, label]) => `<option value="${role}" ${staff.role === role ? "selected" : ""}>${label}</option>`)
              .join("")}
          </select>
          <input type="password" data-staff-password="${staff.id}" placeholder="${staff.password ? "Password set" : "No password"}" />
          <button class="button secondary tiny-button" type="button" data-save-staff-password="${staff.id}">Save Password</button>
          ${
            staff.locked || staff.id === state.currentStaffId
              ? ""
              : `<button class="icon-button danger" type="button" data-remove-staff="${staff.id}">x</button>`
          }
        </div>
      `
    )
    .join("");

  els.salePersonList.innerHTML = activeSalePersons().length
    ? activeSalePersons()
        .map(
          (person) => `
            <div class="mini-row">
              <span>${escapeHtml(person.name)}</span>
              <button class="icon-button danger" type="button" data-remove-sale-person="${person.id}">x</button>
            </div>
          `
        )
        .join("")
    : `<div class="empty">Sale person မရှိသေးပါ</div>`;

  els.categoryList.innerHTML = state.categories
    .map((category) => {
      const subRows = category.subcategories
        .map(
          (subCategory) =>
            `<span class="tag-chip">${escapeHtml(subCategory)} <button type="button" data-remove-subcategory="${category.id}|${escapeHtml(subCategory)}">x</button></span>`
        )
        .join("");
      return `
        <div class="mini-row category-row">
          <span><strong>${escapeHtml(category.name)} (${escapeHtml(category.prefix || "-")})</strong><br>${subRows || "<span class='muted'>No sub category</span>"}</span>
          <button class="icon-button danger" type="button" data-remove-category="${category.id}">x</button>
        </div>
      `;
    })
    .join("");
}

function renderHistory() {
  const salesRows = [...state.sales]
    .sort((a, b) => byDateDesc(a, b, "saleDate"))
    .slice(0, 6)
    .map((sale) => {
      const itemCount = sale.items?.length || 0;
      return `<div class="mini-row"><span>${escapeHtml(sale.saleDate)} • ${escapeHtml(sale.voucherNumber)} (${itemCount} items)<br>${escapeHtml(sale.salePerson)} • Paid ${money(salePaid(sale))} • ${paymentBreakdownText(sale)} • Balance ${money(saleBalance(sale))}</span><strong>${money(sale.totalPrice)}</strong></div>`;
    });

  const expenseRows = [...state.expenses]
    .sort((a, b) => byDateDesc(a, b, "expenseDate"))
    .slice(0, 6)
    .map(
      (expense) =>
        `<div class="mini-row"><span>${escapeHtml(expense.expenseDate)}<br>${escapeHtml(expense.description || "-")}</span><strong>${money(expense.amount)}</strong></div>`
    );

  els.salesHistory.innerHTML = salesRows.length ? salesRows.join("") : `<div class="empty">Sale record မရှိသေးပါ</div>`;
  els.expenseHistory.innerHTML = expenseRows.length ? expenseRows.join("") : `<div class="empty">Expense record မရှိသေးပါ</div>`;
}

function inDateRange(date, startDate, endDate) {
  if (!date) return false;
  if (startDate && date < startDate) return false;
  if (endDate && date > endDate) return false;
  return true;
}

function rowsInDateRange(rows, dateKey, startDate, endDate) {
  return rows.filter((row) => inDateRange(row[dateKey], startDate, endDate));
}

function groupSum(rows, keyFn, amountFn) {
  return rows.reduce((map, row) => {
    const key = keyFn(row) || "-";
    map[key] = (map[key] || 0) + Number(amountFn(row) || 0);
    return map;
  }, {});
}

function rowsFromGroupedTotal(grouped, headers = ["Name", "Total"]) {
  return Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([name, total]) => [name, total]);
}

function soldCostInRange(startDate, endDate) {
  return soldItemCostForSales(state.sales.filter((sale) => inDateRange(firstPaymentDate(sale), startDate, endDate)));
}

function monthStart(dateValue) {
  return `${dateValue.slice(0, 7)}-01`;
}

function monthEnd(dateValue) {
  const [year, month] = dateValue.slice(0, 7).split("-").map(Number);
  return new Date(year, month, 0).toISOString().slice(0, 10);
}

function previousDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function stockValueAt(dateValue) {
  return state.stock
    .filter((item) => item.productionDate <= dateValue)
    .filter((item) => !item.soldAt || item.soldAt > dateValue)
    .reduce((sum, item) => sum + Number(item.productionCost || 0), 0);
}

function stockPurchaseValueInRange(startDate, endDate) {
  return state.stock
    .filter((item) => inDateRange(item.productionDate, startDate, endDate))
    .reduce((sum, item) => sum + Number(item.productionCost || 0), 0);
}

function financialStatementRange(startDate, endDate) {
  const start = startDate || monthStart(today);
  const end = endDate || monthEnd(start);
  return { startDate: start, endDate: end };
}

function csvValue(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function exportCellText(value) {
  const text = String(value ?? "");
  return text.startsWith("__SECTION__:") ? text.replace("__SECTION__:", "") : text;
}

function sectionRow(label, width = 3) {
  return [`__SECTION__:${label}`, ...Array(Math.max(0, width - 1)).fill("")];
}

const importFieldSets = {
  stock: [
    ["productCode", "Product Code"],
    ["productionDate", "Production Date"],
    ["description", "Description"],
    ["category", "Category"],
    ["subCategory", "Sub Category"],
    ["paperColor", "Paper Color"],
    ["productionCost", "Production Cost"],
    ["salePrice", "Sale Price"],
    ["florist", "Florist"],
  ],
  sales: [
    ["voucherNumber", "Voucher Number"],
    ["saleDate", "Sale Date"],
    ["salePerson", "Sale Person"],
    ["productCode", "Product Code"],
    ["description", "Description"],
    ["quantity", "Quantity"],
    ["totalPrice", "Total Price"],
    ["receivedAmount", "Received Amount"],
    ["paymentDate", "Payment Date"],
    ["paymentType", "Payment Type"],
    ["fulfillmentDate", "Pickup / Delivery Date"],
    ["fulfillmentMethod", "Pickup / Delivery Method"],
    ["fulfillmentStatus", "Fulfillment Status"],
    ["note", "Note"],
  ],
  expenses: [
    ["expenseDate", "Expense Date"],
    ["description", "Description"],
    ["amount", "Amount"],
  ],
};

const importAliases = {
  productCode: ["product code", "code", "productcode", "ကုဒ်", "ပစ္စည်းကုဒ်"],
  productionDate: ["production date", "date", "ရက်စွဲ", "ထုတ်လုပ်ရက်"],
  saleDate: ["sale date", "date", "voucher date", "ရောင်းရက်", "ရက်စွဲ"],
  expenseDate: ["expense date", "date", "ရက်စွဲ"],
  description: ["description", "item", "name", "အမျိုးအမည်", "ပစ္စည်း", "ဖော်ပြချက်"],
  category: ["category", "အမျိုးအစား"],
  subCategory: ["sub category", "subcategory", "sub", "အမျိုးအစားခွဲ"],
  paperColor: ["paper color", "color", "paper", "စက္ကူအရောင်", "အရောင်"],
  productionCost: ["production cost", "cost", "ကုန်ကျစရိတ်"],
  salePrice: ["sale price", "price", "amount", "စျေး", "ရောင်းစျေး"],
  florist: ["florist", "producer", "ထုတ်လုပ်သူ", "ပန်းစည်းသူ"],
  voucherNumber: ["voucher", "voucher number", "voucher no", "ဘောက်ချာ", "ဘောက်ချာနံပါတ်"],
  salePerson: ["sale person", "cashier", "staff", "အရောင်းဝန်ထမ်း"],
  quantity: ["quantity", "qty", "အရေအတွက်"],
  totalPrice: ["total", "total price", "amount", "ကျသင့်ငွေ"],
  receivedAmount: ["received", "received amount", "paid", "စရံ", "လက်ခံရငွေ"],
  paymentDate: ["payment date", "paid date", "ငွေရက်"],
  paymentType: ["payment type", "payment", "ငွေပေးချေမှု"],
  fulfillmentDate: ["delivery date", "pickup date", "due date", "ပေးရမည့်ရက်"],
  fulfillmentMethod: ["delivery", "pickup", "method", "ပေးပို့ပုံစံ"],
  fulfillmentStatus: ["status", "delivered", "အခြေအနေ"],
  note: ["note", "remark", "မှတ်ချက်"],
  amount: ["amount", "total", "ကျသင့်ငွေ", "ပမာဏ"],
};

function normalizeImportKey(value) {
  return String(value || "").toLowerCase().replace(/[\s_\-./()]+/g, " ").trim();
}

function detectImportField(header, type) {
  const normalized = normalizeImportKey(header);
  return (importFieldSets[type] || []).find(([field]) =>
    (importAliases[field] || [field]).some((alias) => normalized === normalizeImportKey(alias))
  )?.[0] || "";
}

function parseDelimitedText(text) {
  const clean = String(text || "").replace(/^\ufeff/, "").trim();
  if (!clean) return { headers: [], rows: [] };
  const firstLine = clean.split(/\r?\n/)[0] || "";
  const delimiter = firstLine.includes("\t") ? "\t" : ",";
  const parsedRows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < clean.length; index += 1) {
    const char = clean[index];
    const next = clean[index + 1];
    if (char === '"') {
      if (quoted && next === '"') {
        cell += '"';
        index += 1;
      } else quoted = !quoted;
      continue;
    }
    if (!quoted && char === delimiter) {
      row.push(cell.trim());
      cell = "";
      continue;
    }
    if (!quoted && (char === "\n" || char === "\r")) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(cell.trim());
      if (row.some((value) => value !== "")) parsedRows.push(row);
      row = [];
      cell = "";
      continue;
    }
    cell += char;
  }
  row.push(cell.trim());
  if (row.some((value) => value !== "")) parsedRows.push(row);
  const headers = parsedRows.shift() || [];
  return {
    headers,
    rows: parsedRows.map((values) =>
      headers.reduce((record, header, index) => {
        record[header] = values[index] || "";
        return record;
      }, {})
    ),
  };
}

function downloadCsv(filename, headers, rows) {
  const csv = [headers, ...rows].map((row) => row.map((cell) => csvValue(exportCellText(cell))).join(",")).join("\n");
  const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function printExport(title, headers, rows) {
  const tableRows = rows
    .map((row) => {
      if (String(row[0] || "").startsWith("__SECTION__:")) {
        return `<tr class="section-row"><td colspan="${headers.length}">${escapeHtml(exportCellText(row[0]))}</td></tr>`;
      }
      return `<tr>${row.map((cell) => `<td>${escapeHtml(exportCellText(cell))}</td>`).join("")}</tr>`;
    })
    .join("");
  const win = window.open("", "_blank");
  if (!win) {
    alert("PDF window ဖွင့်ရန် browser popup ကို allow လုပ်ပါ");
    return;
  }
  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1d2320; }
          h1 { font-size: 20px; margin: 0 0 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #b9c7ba; padding: 7px; text-align: left; vertical-align: top; }
          th { background: #edf4ec; }
          td:nth-child(n+2) { text-align: right; }
          .section-row td { background: #d9d9d9; font-weight: 700; text-align: left; }
        </style>
      </head>
      <body>
        <h1>${escapeHtml(title)}</h1>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${tableRows || `<tr><td colspan="${headers.length}">No records</td></tr>`}</tbody>
        </table>
      </body>
    </html>
  `);
  win.document.close();
  win.focus();
  win.print();
}

function exportRows({ exportType, startDate, endDate, stockStatus }) {
  if (exportType === "sales") {
    return {
      title: "Sale Voucher Export",
      headers: ["Date", "Voucher", "Sale Person", "Description", "Fulfillment Date", "Method", "Status", "Total", "Paid", "Balance"],
      rows: state.sales
        .filter((sale) => inDateRange(sale.saleDate, startDate, endDate))
        .map((sale) => [
          sale.saleDate,
          sale.voucherNumber,
          sale.salePerson,
          (sale.items || []).map((item) => `${item.productCode || "Manual"} ${item.description} x${item.quantity || 1}`).join(" | "),
          sale.fulfillmentDate || sale.saleDate || "",
          fulfillmentMethodLabel(sale.fulfillmentMethod),
          fulfillmentStatusLabel(sale.fulfillmentStatus),
          sale.totalPrice,
          salePaid(sale),
          saleBalance(sale),
        ]),
    };
  }

  if (exportType === "payments") {
    return {
      title: "Payment Received Export",
      headers: ["Payment Date", "Voucher", "Sale Person", "Payment Type", "Amount"],
      rows: allPayments()
        .filter((payment) => inDateRange(payment.paymentDate, startDate, endDate))
        .map((payment) => [payment.paymentDate, payment.voucherNumber, payment.salePerson, payment.paymentType, payment.amount]),
    };
  }

  if (exportType === "stock") {
    return {
      title: "Stock Export",
      headers: [
        "Code",
        "Date",
        "Description",
        "Category",
        "Sub Category",
        "Paper Color",
        "Cost",
        "Sale Price",
        "Florist",
        "Status",
        "Sold By",
        "Voucher",
      ],
      rows: state.stock
        .filter((item) => inDateRange(item.productionDate, startDate, endDate))
        .filter((item) => stockStatus === "all" || item.status === stockStatus)
        .map((item) => {
          const isSku = item.itemType === "sku";
          const voucher = !isSku && item.status === "sold" ? voucherForStock(item.id) : null;
          return [
            item.productCode,
            item.productionDate,
            item.description,
            item.category,
            item.subCategory || "",
            item.paperColor,
            item.productionCost,
            item.salePrice,
            item.florist,
            item.status,
            !isSku && item.status === "sold" ? soldByForStock(item.id) : "",
            voucher?.voucherNumber || "",
          ];
        }),
    };
  }

  if (exportType === "inventory_available") {
    return {
      title: "Available Inventory Export",
      headers: ["Code", "Type", "Date", "Description", "Category", "Sub Category", "Qty Available", "Qty Total", "Unit Cost", "Sale Price", "Status"],
      rows: state.stock
        .filter((item) => inDateRange(item.productionDate, startDate, endDate))
        .filter((item) => (item.itemType === "sku" ? Number(item.quantityAvailable || 0) > 0 : item.status === "available"))
        .map((item) => [
          item.productCode,
          item.itemType === "sku" ? "SKU" : "Floral",
          item.productionDate,
          item.description,
          item.category,
          item.subCategory || "",
          item.itemType === "sku" ? Number(item.quantityAvailable || 0) : 1,
          item.itemType === "sku" ? Number(item.quantityTotal || item.quantityAvailable || 0) : 1,
          Number(item.unitCost ?? item.productionCost ?? 0),
          Number(item.salePrice || 0),
          item.itemType === "sku" ? "available" : item.status,
        ]),
    };
  }

  if (exportType === "summary_payments") {
    const payments = allPayments().filter((payment) => inDateRange(payment.paymentDate, startDate, endDate));
    return {
      title: "Payment Type Summary",
      headers: ["Payment Type", "Total Amount"],
      rows: rowsFromGroupedTotal(groupSum(payments, (payment) => payment.paymentType, (payment) => payment.amount)),
    };
  }

  if (exportType === "summary_profit") {
    const statementRange = financialStatementRange(startDate, endDate);
    startDate = statementRange.startDate;
    endDate = statementRange.endDate;
    const payments = allPayments().filter((payment) => inDateRange(payment.paymentDate, startDate, endDate));
    const cashReceived = paymentTotal(payments);
    const openingStock = stockValueAt(previousDate(startDate));
    const purchaseAmount = stockPurchaseValueInRange(startDate, endDate);
    const closingStock = stockValueAt(endDate);
    const cogs = soldCostInRange(startDate, endDate);
    const expenses = state.expenses.filter((expense) => inDateRange(expense.expenseDate, startDate, endDate));
    const expenseGrouped = groupSum(expenses, (expense) => expense.description, (expense) => expense.amount);
    const expenseTotal = Object.values(expenseGrouped).reduce((sum, amount) => sum + Number(amount || 0), 0);
    const grossProfit = cashReceived - cogs;
    const netProfit = grossProfit - expenseTotal;
    return {
      title: `Profit and Loss Summary (${startDate} to ${endDate})`,
      headers: ["Account", "Debit", "Credit"],
      rows: [
        sectionRow("Sales"),
        ["Total Sales Amount", 0, cashReceived],
        ["Sales Return", 0, 0],
        ["Net Sales", 0, cashReceived],
        sectionRow("Cost of goods sold"),
        ["Opening Stock", openingStock, 0],
        ["Total Purchase Amount", purchaseAmount, 0],
        ["Purchase Return", 0, 0],
        ["Closing Stock", 0, closingStock],
        ["Cost of goods sold", cogs, 0],
        ["Gross Profit", grossProfit < 0 ? Math.abs(grossProfit) : 0, grossProfit > 0 ? grossProfit : 0],
        sectionRow("Income"),
        ["Other Income", 0, 0],
        ["Total Income", 0, 0],
        sectionRow("Expense"),
        ...Object.entries(expenseGrouped).map(([description, amount]) => [description, amount, 0]),
        ["Total Expense", expenseTotal, 0],
        ["Net Profit", netProfit < 0 ? Math.abs(netProfit) : 0, netProfit > 0 ? netProfit : 0],
      ],
    };
  }

  if (exportType === "summary_staff") {
    const statementRange = financialStatementRange(startDate, endDate);
    startDate = statementRange.startDate;
    endDate = statementRange.endDate;
    const sales = state.sales.filter((sale) => inDateRange(sale.saleDate, startDate, endDate));
    const grouped = sales.reduce((map, sale) => {
      if (!map[sale.salePerson]) map[sale.salePerson] = { count: 0, total: 0, paid: 0 };
      map[sale.salePerson].count += 1;
      map[sale.salePerson].total += Number(sale.totalPrice || 0);
      map[sale.salePerson].paid += salePaid(sale);
      return map;
    }, {});
    return {
      title: `Staff Performance Summary (${startDate} to ${endDate})`,
      headers: ["Sale Person", "Voucher Count", "Voucher Total", "Paid Amount"],
      rows: Object.entries(grouped).map(([staff, data]) => [staff, data.count, data.total, data.paid]),
    };
  }

  if (exportType === "summary_florist") {
    const statementRange = financialStatementRange(startDate, endDate);
    startDate = statementRange.startDate;
    endDate = statementRange.endDate;
    const stockRows = state.stock.filter((item) => inDateRange(item.productionDate, startDate, endDate));
    const grouped = stockRows.reduce((map, item) => {
      if (!map[item.florist]) map[item.florist] = { count: 0, cost: 0, sold: 0, available: 0 };
      map[item.florist].count += 1;
      map[item.florist].cost += Number(item.productionCost || 0);
      map[item.florist][item.status === "sold" ? "sold" : "available"] += 1;
      return map;
    }, {});
    return {
      title: `Florist Performance Summary (${startDate} to ${endDate})`,
      headers: ["Florist", "Produced Count", "Sold Count", "Available Count", "Production Cost"],
      rows: Object.entries(grouped).map(([florist, data]) => [florist, data.count, data.sold, data.available, data.cost]),
    };
  }

  if (exportType === "summary_receivable") {
    return {
      title: "Receivable Summary",
      headers: ["Voucher Date", "Voucher", "Sale Person", "Total", "Paid", "Balance"],
      rows: state.sales
        .filter((sale) => saleBalance(sale) > 0)
        .filter((sale) => inDateRange(sale.saleDate, startDate, endDate))
        .map((sale) => [sale.saleDate, sale.voucherNumber, sale.salePerson, sale.totalPrice, salePaid(sale), saleBalance(sale)]),
    };
  }

  if (exportType === "summary_expenses") {
    const expenses = state.expenses.filter((expense) => inDateRange(expense.expenseDate, startDate, endDate));
    return {
      title: "Expense Summary",
      headers: ["Description", "Total Amount"],
      rows: rowsFromGroupedTotal(groupSum(expenses, (expense) => expense.description, (expense) => expense.amount)),
    };
  }

  return {
    title: "Expense Export",
    headers: ["Date", "Description", "Amount"],
    rows: state.expenses
      .filter((expense) => inDateRange(expense.expenseDate, startDate, endDate))
      .map((expense) => [expense.expenseDate, expense.description, expense.amount]),
  };
}

function openExportModal() {
  els.exportForm.startDate.value = "";
  els.exportForm.endDate.value = "";
  els.exportType.value = "sales";
  renderExportOptions();
  openModal(els.exportModal);
}

function renderExportOptions() {
  els.stockExportStatusWrap.hidden = els.exportType.value !== "stock";
  if (
    ["summary_profit", "summary_staff", "summary_florist"].includes(els.exportType.value) &&
    !els.exportForm.startDate.value &&
    !els.exportForm.endDate.value
  ) {
    els.exportForm.startDate.value = monthStart(today);
    els.exportForm.endDate.value = monthEnd(today);
  }
}

function openImportModal() {
  els.importType.value = "stock";
  els.importPaste.value = "";
  els.importInput.value = "";
  importRows = [];
  importHeaders = [];
  els.importStatus.textContent = "CSV/TSV or paste table";
  els.applyImportButton.disabled = true;
  renderImportMapping();
  openModal(els.importModal);
}

async function parseImportSource() {
  const file = els.importInput.files?.[0];
  const text = file ? await file.text() : els.importPaste.value;
  if (!text.trim()) {
    els.importStatus.textContent = "Import data ထည့်ပါ";
    return;
  }
  if (els.importType.value === "json") {
    importRows = [{ __json: text }];
    importHeaders = ["Backup JSON"];
    els.importStatus.textContent = "Backup JSON ready";
    els.applyImportButton.disabled = false;
    renderImportMapping();
    return;
  }
  const parsed = parseDelimitedText(text);
  importHeaders = parsed.headers;
  importRows = parsed.rows;
  els.importStatus.textContent = `${importRows.length} rows found`;
  els.applyImportButton.disabled = importRows.length === 0;
  renderImportMapping();
}

function renderImportMapping() {
  const type = els.importType.value;
  if (!importHeaders.length || type === "json") {
    els.importMapping.innerHTML =
      type === "json" ? `<div class="empty">Backup JSON ကိုတိုက်ရိုက် import လုပ်ပါမယ်</div>` : `<div class="empty">File/Paste data ကို preview အရင်လုပ်ပါ</div>`;
    els.importPreviewHead.innerHTML = "";
    els.importPreviewBody.innerHTML = "";
    return;
  }
  const fields = importFieldSets[type] || [];
  els.importMapping.innerHTML = importHeaders
    .map((header) => {
      const detected = detectImportField(header, type);
      return `
        <label>
          <span class="label-title">${escapeHtml(header)}</span>
          <select data-import-header="${escapeHtml(header)}">
            <option value="">မသွင်းပါ</option>
            ${fields.map(([value, label]) => `<option value="${value}" ${detected === value ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
      `;
    })
    .join("");
  els.importPreviewHead.innerHTML = `<tr>${importHeaders.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr>`;
  els.importPreviewBody.innerHTML = importRows
    .slice(0, 5)
    .map((row) => `<tr>${importHeaders.map((header) => `<td>${escapeHtml(row[header] || "")}</td>`).join("")}</tr>`)
    .join("");
}

function currentImportMapping() {
  return [...els.importMapping.querySelectorAll("[data-import-header]")].reduce((map, select) => {
    if (select.value) map[select.dataset.importHeader] = select.value;
    return map;
  }, {});
}

function mappedImportRows() {
  const mapping = currentImportMapping();
  return importRows.map((row) =>
    Object.entries(mapping).reduce((record, [header, field]) => {
      record[field] = row[header] || "";
      return record;
    }, {})
  );
}

function ensureImportCategory(name) {
  const categoryName = name || "Imported";
  if (!state.categories.some((category) => category.name === categoryName)) {
    state.categories.push({ id: uid("cat"), name: categoryName, prefix: categoryName[0]?.toUpperCase() || "I", subcategories: [] });
  }
  return categoryName;
}

function importStockRows(rows) {
  let added = 0;
  rows.forEach((row) => {
    const productCode = normalizeCode(row.productCode || "");
    if (!productCode || state.stock.some((item) => item.productCode === productCode)) return;
    state.stock.unshift({
      id: uid("stock"),
      productCode,
      productionDate: row.productionDate || today,
      description: row.description || productCode,
      category: ensureImportCategory(row.category),
      subCategory: row.subCategory || "",
      paperColor: row.paperColor || "-",
      productionCost: Number(row.productionCost || 0),
      salePrice: Number(row.salePrice || 0),
      florist: row.florist || productionStaff()[0]?.name || "Imported",
      status: "available",
      createdAt: new Date().toISOString(),
    });
    added += 1;
  });
  return added;
}

function importSaleRows(rows) {
  let added = 0;
  rows.forEach((row) => {
    const voucherNumber = String(row.voucherNumber || "").trim();
    if (!voucherNumber || state.sales.some((sale) => sale.voucherNumber.toLowerCase() === voucherNumber.toLowerCase())) return;
    const amount = Number(row.totalPrice || row.receivedAmount || 0);
    const received = Number(row.receivedAmount || 0);
    const quantity = Math.max(1, Number(row.quantity || 1));
    const productCode = normalizeCode(row.productCode || "");
    const stockItem = productCode ? state.stock.find((item) => item.productCode === productCode) : null;
    const itemCost = stockItem ? Number(stockItem.productionCost || 0) * quantity : 0;
    const sale = {
      id: uid("sale"),
      saleDate: row.saleDate || today,
      voucherNumber,
      salePerson: row.salePerson || activeSalePersons()[0]?.name || "Imported",
      fulfillmentDate: row.fulfillmentDate || row.saleDate || today,
      fulfillmentMethod: row.fulfillmentMethod || defaultFulfillmentMethod,
      fulfillmentStatus: row.fulfillmentStatus || defaultFulfillmentStatus,
      paymentType: row.paymentType || "Cash",
      totalPrice: amount,
      productionCost: itemCost,
      note: row.note || "",
      items: [{ id: uid("item"), type: stockItem ? "stock" : "manual", stockId: stockItem?.id || "", productCode, description: row.description || productCode || "Imported item", quantity, price: amount, unitPrice: amount / quantity, cost: itemCost }],
      payments: received ? [{ id: uid("payment"), paymentDate: row.paymentDate || row.saleDate || today, paymentType: row.paymentType || "Cash", amount: received, note: "Imported payment" }] : [],
      createdAt: new Date().toISOString(),
    };
    state.sales.unshift(sale);
    applySaleStock(sale);
    added += 1;
  });
  return added;
}

function importExpenseRows(rows) {
  let added = 0;
  rows.forEach((row) => {
    const amount = Number(row.amount || 0);
    if (!amount && !row.description) return;
    state.expenses.unshift({ id: uid("expense"), expenseDate: row.expenseDate || today, description: row.description || "Imported expense", amount, createdAt: new Date().toISOString() });
    added += 1;
  });
  return added;
}

function applyImport() {
  if (els.importType.value === "json") {
    const importedState = normalizeState(JSON.parse(importRows[0]?.__json || "{}"));
    state.stock = importedState.stock;
    state.sales = importedState.sales;
    state.expenses = importedState.expenses;
    state.productionOrders = importedState.productionOrders;
    state.saleDrafts = importedState.saleDrafts;
    state.staff = importedState.staff;
    state.salePersons = importedState.salePersons;
    state.categories = importedState.categories;
    selectedStockId = "";
  } else {
    const rows = mappedImportRows();
    const added = els.importType.value === "stock" ? importStockRows(rows) : els.importType.value === "sales" ? importSaleRows(rows) : importExpenseRows(rows);
    els.importStatus.textContent = `${added} rows imported`;
  }
  saveState();
  closeModal(els.importModal);
  renderAll();
}

function runExport(form) {
  const options = {
    exportType: form.exportType.value,
    format: form.format.value,
    startDate: form.startDate.value,
    endDate: form.endDate.value,
    stockStatus: form.stockStatus.value,
  };
  const data = exportRows(options);
  const range = [options.startDate || "all", options.endDate || "all"].join("_to_");
  const filename = `b3-${options.exportType}-${range}.csv`;
  if (options.format === "pdf") printExport(data.title, data.headers, data.rows);
  else downloadCsv(filename, data.headers, data.rows);
  closeModal(els.exportModal);
}

function renderAll() {
  renderLogin();
  renderPermissions();
  showView();
  renderDropdowns();
  renderSticker();
  renderSaleItems();
  renderVoucherPaymentDetails();
  renderMetrics();
  renderHome();
  renderInventory();
  renderSummary();
  renderSettings();
  renderHistory();
  renderExpenseTable();
  renderVoucherHistory();
  renderFulfillmentTable();
  renderSaleDrafts();
  renderProductionOrders();
  renderNavBadges();
}

els.loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  els.loginStatus.textContent = "";
  const staff = state.staff.find((item) => item.id === els.loginStaff.value);
  if (staff?.password && staff.password !== els.loginPassword.value) {
    els.loginStatus.textContent = "Wrong password";
    els.loginPassword.value = "";
    els.loginPassword.focus();
    return;
  }
  state.currentStaffId = els.loginStaff.value;
  els.loginPassword.value = "";
  saveLocalState();
  renderAll();
});

els.logoutButton.addEventListener("click", () => {
  state.currentStaffId = "";
  saveLocalState();
  renderAll();
});

window.addEventListener("hashchange", () => {
  showView();
  document.body.classList.remove("is-menu-open");
  els.menuToggle?.setAttribute("aria-expanded", "false");
});

els.menuToggle?.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("is-menu-open");
  els.menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("is-menu-open");
    els.menuToggle?.setAttribute("aria-expanded", "false");
  });
});

els.quickActionGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-quick-view]");
  if (!button) return;
  goToView(button.dataset.quickView);
  if (button.dataset.quickAction === "newSale") startNewVoucher();
});

[els.todayWorkQueue, els.attentionQueue].forEach((queue) => {
  queue.addEventListener("click", (event) => {
    const button = event.target.closest("[data-queue-view]");
    if (!button) return;
    openQueueTarget(button.dataset.queueView, button.dataset.queueSale, button.dataset.queueDraft);
  });
});

els.saleStepper.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sale-step]");
  if (!button) return;
  setSaleStep(button.dataset.saleStep, { scroll: true });
});

document.addEventListener("input", (event) => {
  if (event.target.classList?.contains("field-error")) event.target.classList.remove("field-error");
});

document.addEventListener("change", (event) => {
  if (event.target.classList?.contains("field-error")) event.target.classList.remove("field-error");
});

els.stockCategory.addEventListener("change", () => {
  renderSubcategories();
  forceAutoProductCode();
});
els.stockCategory.addEventListener("input", () => {
  renderSubcategories();
  forceAutoProductCode();
});
els.stockModeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stock-entry-mode]");
  if (!button) return;
  els.stockMode.value = button.dataset.stockEntryMode;
  if (els.stockMode.value === "sku") {
    els.stockForm.productCode.value = "";
    els.stockForm.paperColor.value = "";
    els.stockForm.florist.value = "";
  }
  renderStockEntryMode();
  els.stockForm.productCode.focus();
});

els.stockForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addStock(event.currentTarget);
});

els.saleForm.saleDate.addEventListener("change", () => {
  if (els.fulfillmentMethod.value === "walkin") {
    els.fulfillmentDate.value = els.saleForm.saleDate.value || today;
  }
  if (!els.productionOrderDate.value || els.productionOrderDate.value === today) {
    els.productionOrderDate.value = els.fulfillmentDate.value || els.saleForm.saleDate.value || today;
  }
});
els.fulfillmentDate.addEventListener("change", () => {
  els.productionOrderDate.value = els.fulfillmentDate.value || today;
});
els.fulfillmentMethod.addEventListener("change", applyFulfillmentMethodPreset);
els.saleItemType.addEventListener("change", renderSaleItemMode);
els.saleItemModeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-sale-item-mode]");
  if (!button) return;
  els.saleItemType.value = button.dataset.saleItemMode;
  renderSaleItemMode();
  if (button.dataset.saleItemMode === "sku") els.saleProductCode.focus();
});
els.saleProductCode.addEventListener("input", renderStockLookup);
els.stockLookupDetails.addEventListener("click", (event) => {
  const button = event.target.closest("[data-select-stock-code]");
  if (!button) return;
  els.saleProductCode.value = button.dataset.selectStockCode;
  els.manualDescription.value = "";
  renderStockLookup();
  els.saleItemQty.focus();
});
els.receivedAmount.addEventListener("input", renderSaleItems);
els.salePaymentType.addEventListener("change", renderSalePaymentLines);
els.paymentDate.addEventListener("change", renderSalePaymentLines);
els.addSalePaymentLineButton.addEventListener("click", addSalePaymentLine);
els.addSaleItemButton.addEventListener("click", addSaleItem);
els.openProductionOrderButton.addEventListener("click", openProductionOrderFromSale);
els.saveSaleButton.addEventListener("click", saveSale);
els.productionOrderPhotos.addEventListener("change", handleProductionPhotos);
els.sendProductionOrderButton.addEventListener("click", sendProductionOrder);
els.cancelProductionEditButton.addEventListener("click", () => {
  clearProductionCompose();
  els.productionComposeStatus.textContent = "Edit cancel လုပ်ပြီး";
});
els.productionOrderPhotoPreview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-production-photo]");
  if (!button) return;
  productionPhotoDraft.splice(Number(button.dataset.removeProductionPhoto), 1);
  renderProductionPhotoPreview();
});
els.newVoucherButton.addEventListener("click", startNewVoucher);
els.holdVoucherButton.addEventListener("click", () => holdSaleDraft());
els.deleteDraftButton.addEventListener("click", deleteActiveDraft);
els.draftList.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-draft]");
  if (openButton) {
    openSaleDraft(openButton.dataset.openDraft);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-draft]");
  if (deleteButton) deleteSaleDraft(deleteButton.dataset.deleteDraft);
});
els.findVoucherButton.addEventListener("click", renderVoucherPaymentDetails);
els.voucherSearch.addEventListener("input", renderVoucherPaymentDetails);
els.loadVoucherButton.addEventListener("click", loadVoucherForEdit);
els.addVoucherPaymentButton.addEventListener("click", addVoucherPayment);
els.voucherHistorySearch.addEventListener("input", () => {
  renderVoucherHistory();
  renderFulfillmentTable();
});
els.voucherHistoryDate.addEventListener("change", renderVoucherHistory);
els.fulfillmentFilterDate.addEventListener("change", renderFulfillmentTable);
els.fulfillmentSearch.addEventListener("input", renderFulfillmentTable);
els.fulfillmentFilterStatus.addEventListener("change", renderFulfillmentTable);
els.fulfillmentFilterMethod.addEventListener("change", renderFulfillmentTable);
els.productionOrderSearch.addEventListener("input", renderProductionOrders);
els.productionOrderDateFilter.addEventListener("change", renderProductionOrders);

els.productionOrderList.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-production-order]");
  if (editButton) {
    editProductionOrder(editButton.dataset.editProductionOrder);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-production-order]");
  if (deleteButton) {
    deleteProductionOrder(deleteButton.dataset.deleteProductionOrder);
    return;
  }

  const button = event.target.closest("[data-production-status]");
  if (!button) return;
  const [id, status] = button.dataset.productionStatus.split("|");
  updateProductionOrderStatus(id, status);
});

els.productionOrderTable.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-production-order]");
  if (editButton) {
    editProductionOrder(editButton.dataset.editProductionOrder);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-production-order]");
  if (deleteButton) deleteProductionOrder(deleteButton.dataset.deleteProductionOrder);
});

els.voucherHistoryTable.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-voucher]");
  if (editButton) {
    loadVoucherById(editButton.dataset.editVoucher);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-voucher]");
  if (deleteButton) deleteVoucher(deleteButton.dataset.deleteVoucher);
});

els.fulfillmentTable.addEventListener("change", (event) => {
  const select = event.target.closest("[data-fulfillment-status]");
  if (!select) return;
  updateFulfillmentStatus(select.dataset.fulfillmentStatus, select.value);
});

els.fulfillmentTable.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-voucher]");
  if (!editButton) return;
  loadVoucherById(editButton.dataset.editVoucher);
});

els.voucherPaymentDetails.addEventListener("click", (event) => {
  const saveButton = event.target.closest("[data-save-payment]");
  if (saveButton) {
    saveVoucherPayment(saveButton.dataset.savePayment);
    return;
  }

  const deletePaymentButton = event.target.closest("[data-delete-payment]");
  if (deletePaymentButton) {
    deleteVoucherPayment(deletePaymentButton.dataset.deletePayment);
    return;
  }

  const deleteVoucherButton = event.target.closest("[data-delete-current-voucher]");
  if (deleteVoucherButton) deleteVoucher(deleteVoucherButton.dataset.deleteCurrentVoucher);
});

els.saleItemList.addEventListener("click", (event) => {
  const linkButton = event.target.closest("[data-link-sale-item]");
  if (linkButton) {
    linkSaleItemToStock(linkButton.dataset.linkSaleItem);
    return;
  }

  const button = event.target.closest("[data-remove-sale-item]");
  if (!button) return;
  removeSaleItem(button.dataset.removeSaleItem);
});

els.saleItemList.addEventListener("keydown", (event) => {
  const input = event.target.closest("[data-link-stock-code]");
  if (!input || event.key !== "Enter") return;
  event.preventDefault();
  linkSaleItemToStock(input.dataset.linkStockCode);
});

els.salePaymentLineList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-sale-payment-line]");
  if (!button) return;
  removeSalePaymentLine(button.dataset.removeSalePaymentLine);
});

els.expenseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addExpense(event.currentTarget);
});
els.expenseDate.addEventListener("change", (event) => {
  const selectedDate = event.target.value || today;
  editingExpenseId = "";
  els.expenseForm.reset();
  els.expenseDate.value = selectedDate;
  els.expenseForm.querySelector("button[type=\"submit\"]").textContent = "+ Expense ထည့်မယ်";
  renderExpenseTable();
});

els.expenseTable.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-expense]");
  if (editButton) {
    editExpense(editButton.dataset.editExpense);
    return;
  }

  const deleteButton = event.target.closest("[data-delete-expense]");
  if (deleteButton) deleteExpense(deleteButton.dataset.deleteExpense);
});

els.stockEditForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveStockEdit(event.currentTarget);
});

els.editStockCategory.addEventListener("change", () => {
  renderStockEditSubcategories();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(document.querySelector(`#${button.dataset.closeModal}`));
  });
});

document.querySelectorAll(".modal-backdrop").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(modal);
  });
});

els.inventoryTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "print") {
    setSelectedStock(button.dataset.id);
    window.print();
  }

  if (button.dataset.action === "edit") {
    editStock(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteStock(button.dataset.id);
  }
});

els.inventoryTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-inventory-voucher]");
  if (!button) return;
  loadVoucherById(button.dataset.inventoryVoucher);
});

els.staffForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addStaff(event.currentTarget);
});

els.salePersonForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addSalePerson(event.currentTarget);
});

els.staffList.addEventListener("change", (event) => {
  const select = event.target.closest("[data-staff-role]");
  if (!select) return;
  updateStaff(select.dataset.staffRole, select.value);
});

els.staffList.addEventListener("click", (event) => {
  const savePasswordButton = event.target.closest("[data-save-staff-password]");
  if (savePasswordButton) {
    const id = savePasswordButton.dataset.saveStaffPassword;
    const input = els.staffList.querySelector(`[data-staff-password="${id}"]`);
    updateStaffPassword(id, input?.value || "");
    return;
  }

  const button = event.target.closest("[data-remove-staff]");
  if (!button) return;
  removeStaff(button.dataset.removeStaff);
});

els.salePersonList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-sale-person]");
  if (!button) return;
  removeSalePerson(button.dataset.removeSalePerson);
});

els.categoryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addCategory(event.currentTarget);
});

els.categoryList.addEventListener("click", (event) => {
  const removeCategoryButton = event.target.closest("[data-remove-category]");
  if (removeCategoryButton) removeCategory(removeCategoryButton.dataset.removeCategory);

  const removeSubCategoryButton = event.target.closest("[data-remove-subcategory]");
  if (removeSubCategoryButton) {
    const [categoryId, subCategory] = removeSubCategoryButton.dataset.removeSubcategory.split("|");
    removeSubCategory(categoryId, subCategory);
  }
});

els.inventorySearch.addEventListener("input", renderInventory);
els.inventoryFilter.addEventListener("change", renderInventory);
els.inventoryTypeFilter.addEventListener("change", renderInventory);
els.inventoryCategoryFilter.addEventListener("change", () => {
  renderInventorySubcategoryFilter();
  renderInventory();
});
els.inventorySubCategoryFilter.addEventListener("change", renderInventory);

els.stickerStockSelect.addEventListener("change", () => {
  setSelectedStock(els.stickerStockSelect.value);
});
els.stickerCodeInput.addEventListener("change", () => {
  const item = stockByCode(els.stickerCodeInput.value);
  if (item) setSelectedStock(item.id);
});
els.stickerCodeInput.addEventListener("keydown", (event) => {
  if (event.key !== "Enter") return;
  event.preventDefault();
  addStickerCodeToQueue();
});
els.addStickerCodeButton.addEventListener("click", addStickerCodeToQueue);
els.clearStickerQueueButton.addEventListener("click", () => {
  stickerQueue = [];
  renderStickerQueue();
});
els.stickerQueue.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-sticker]");
  if (!button) return;
  stickerQueue = stickerQueue.filter((id) => id !== button.dataset.removeSticker);
  renderStickerQueue();
});
[
  els.stickerWidth,
  els.stickerHeight,
  els.stickerOrientation,
  els.stickerCodeSize,
  els.stickerPriceSize,
  els.stickerShowPrice,
  els.stickerBorder,
  els.settingStickerWidth,
  els.settingStickerHeight,
  els.settingStickerOrientation,
  els.settingStickerCodeSize,
  els.settingStickerPriceSize,
  els.settingStickerBorder,
].filter(Boolean).forEach((control) => {
  control.addEventListener("input", updateStickerSettings);
  control.addEventListener("change", updateStickerSettings);
});

if (els.printLatestButton) {
  els.printLatestButton.addEventListener("click", () => {
    if (getSelectedStock()) {
      applyStickerSettings();
      window.print();
    }
  });
}

els.printStickerButton.addEventListener("click", () => {
  if (stickerItemsToPrint().length) {
    applyStickerSettings();
    window.print();
  } else {
    els.stickerStatus.textContent = "Product Code ရွေးပြီးမှ Print နှိပ်ပါ";
  }
});

document.querySelectorAll("[data-report-mode]").forEach((button) => {
  button.addEventListener("click", () => {
    reportMode = button.dataset.reportMode;
    document.querySelectorAll("[data-report-mode]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    els.summaryDate.hidden = reportMode === "month";
    els.summaryMonth.hidden = reportMode === "day";
    renderSummary();
  });
});

els.summaryDate.addEventListener("change", renderSummary);
els.summaryMonth.addEventListener("change", renderSummary);
els.paymentSummary.addEventListener("click", (event) => {
  const button = event.target.closest("[data-payment-type]");
  if (!button) return;
  renderPaymentDetailList(periodPayments(), button.dataset.paymentType);
});

els.paymentDetailList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-summary-voucher]");
  if (!button) return;
  openPaymentHistoryModal(button.dataset.summaryVoucher);
});

els.exportButton.addEventListener("click", openExportModal);
els.exportType.addEventListener("change", renderExportOptions);
els.exportForm.addEventListener("submit", (event) => {
  event.preventDefault();
  runExport(event.currentTarget);
});

els.importButton.addEventListener("click", openImportModal);
els.importType.addEventListener("change", () => {
  importRows = [];
  importHeaders = [];
  els.applyImportButton.disabled = true;
  renderImportMapping();
});
els.importInput.addEventListener("change", parseImportSource);
els.parseImportButton.addEventListener("click", parseImportSource);
els.applyImportButton.addEventListener("click", applyImport);

els.resetButton.addEventListener("click", () => {
  const ok = confirm("Stock, sale, expense data အားလုံးဖျက်မည်။ Staff / Category setting မဖျက်ပါ။ သေချာပါသလား?");
  if (!ok) return;
  state.stock = [];
  state.sales = [];
  state.expenses = [];
  state.productionOrders = [];
  state.saleDrafts = [];
  selectedStockId = "";
  saleItems = [];
  activeSaleDraftId = "";
  saveState();
  renderAll();
});

renderStockEntryMode();
renderSaleItemMode();
renderAll();
startSharedSync();

