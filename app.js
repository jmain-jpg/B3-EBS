const STORAGE_KEY = "b3-floral-ebs-v2";
const LEGACY_STORAGE_KEY = "b3-floral-ebs-v1";
const AUTH_SESSION_KEY = "b3-floral-auth-device-v3";
const LEGACY_AUTH_SESSION_KEY = "b3-floral-auth-session-v2";
const STICKER_SETTINGS_KEY = "b3-floral-sticker-settings-v1";
const STICKER_BARCODE_DESIGN_DEPLOYED_AT = "2026-08-11T12:20:54.000Z";
const THEME_STORAGE_KEY = "b3-floral-theme-v1";
const SIDEBAR_STORAGE_KEY = "b3-floral-sidebar-collapsed-v1";
const SYNC_BASE_STORAGE_KEY = "b3-floral-sync-base-v1";
const SYNC_DIRTY_STORAGE_KEY = "b3-floral-sync-dirty-v1";
const SYNC_VERSION_STORAGE_KEY = "b3-floral-sync-version-v1";
const SYNC_DELETE_INTENTS_STORAGE_KEY = "b3-floral-sync-delete-intents-v1";
const SHARED_SYNC_ENDPOINT = "/api/sync";
const SHARED_SYNC_PAGE_SIZE = 2000;
const SHARED_SYNC_ACTIVE_POLL_MS = 120000;
const SHARED_SYNC_HIDDEN_POLL_MS = 600000;
const SHARED_SYNC_MAX_POLL_MS = 900000;
const STAFF_PASSWORD_ITERATIONS = 210000;
const productionOrdersEnabled = true;
const MAX_PRODUCTION_PHOTOS = 4;
const MAX_PRODUCTION_PHOTO_EDGE = 1600;
const PRODUCTION_PHOTO_QUALITY = 0.78;
const MAX_STOCK_PHOTO_EDGE = 1400;
const STOCK_PHOTO_QUALITY = 0.76;
const MAX_STOCK_PHOTO_BYTES = 700 * 1024;
const STOCK_PHOTO_ENDPOINT = "/api/stock-photo";
const NATIONAL_GIRLFRIEND_DAY_DATE = "2026-08-01";
const CASH_FLOAT_START_DATE = "2026-09-16";
const ADMIN_CASH_START_DATE = "2026-10-01";
const ADMIN_CASH_FIRST_MONTH = CASH_FLOAT_START_DATE.slice(0, 7);
const BUSINESS_CASH_CHANNELS = [
  { id: "cash", label: "Cash", openingInput: "businessOpeningCash" },
  { id: "kpay", label: "KPay", openingInput: "businessOpeningKpay" },
  { id: "aya_pay", label: "AYA Pay", openingInput: "businessOpeningAyaPay" },
  { id: "aya_banking", label: "AYA Banking", openingInput: "businessOpeningAyaBanking" },
  { id: "wave", label: "Wave", openingInput: "businessOpeningWave" },
  { id: "banking", label: "Banking", openingInput: "businessOpeningBanking" },
];

const today = new Date().toISOString().slice(0, 10);
const currentMonth = today.slice(0, 7);
const defaultCashFloatDate = today < CASH_FLOAT_START_DATE ? CASH_FLOAT_START_DATE : today;
const defaultAdminCashDate = today < ADMIN_CASH_START_DATE ? ADMIN_CASH_START_DATE : today;

const roleLabels = {
  admin: "Admin - all access",
  production: "Production - stock / sticker",
  cashier: "Sale Team - sale / stock",
  cashier_expense: "Sale Team + Expense",
  expense: "Expense - expense only",
  accountant: "Accountant - Finance + Sale",
  manager: "Manager - inventory / report",
};

const rolePermissions = {
  admin: ["dashboard", "stock", "sticker", "sale", "vouchers", "receivables", "codecheck", "production", "cashfloat", "expense", "finance", "finance-full", "profit", "girlfriend-day", "fulfillment", "inventory", "reports", "settings", "home"],
  production: ["stock", "sticker", "production", "cashfloat", "girlfriend-day", "inventory", "home", "dashboard"],
  cashier: ["sale", "stock", "sticker", "vouchers", "receivables", "codecheck", "production", "girlfriend-day", "fulfillment", "inventory", "reports", "home", "dashboard"],
  cashier_expense: ["sale", "stock", "sticker", "vouchers", "receivables", "codecheck", "production", "expense", "girlfriend-day", "fulfillment", "inventory", "reports", "home", "dashboard"],
  expense: ["expense", "home"],
  accountant: ["sale", "stock", "sticker", "vouchers", "receivables", "codecheck", "production", "expense", "girlfriend-day", "fulfillment", "inventory", "reports", "finance", "finance-details", "home", "dashboard"],
  manager: ["inventory", "codecheck", "finance", "finance-full", "profit", "receivables", "girlfriend-day", "reports", "home", "dashboard"],
};

const defaultFulfillmentMethod = "walkin";
const defaultFulfillmentStatus = "delivered";

const defaultStaff = [
  { id: "staff-admin", name: "Admin", role: "admin", locked: true },
  { id: "staff-sale-team", name: "Sale Team", role: "cashier_expense" },
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
const defaultFinanceAccounts = paymentTypes.map((name) => ({ name, openingDate: "", openingBalance: 0 }));
const defaultExpenseCategories = [
  "ပန်း / ကုန်ကြမ်း",
  "Cake / Gift",
  "Delivery / Transport",
  "ဝန်ထမ်းစားစရိတ်",
  "အိမ်ငှား / မီး / ရေ",
  "လစာ",
  "Marketing",
  "ပြုပြင်ထိန်းသိမ်း",
  "Refund / ပြန်အမ်းငွေ",
  "Other",
];

const codeFreeDescriptionKeywords = [
  "deli",
  "delivery",
  "cake",
  "service",
  "surprise",
  "paper",
  "print",
  "ribbon",
  "ဂျပ်ဖာ",
  "ဖဲကြိုး",
  "ပုလဲ",
  "ချောကလက်",
  "အလှဆင်",
  "လဲခ",
  "ဆွဲထုတ်ခ",
  "ကျန်ငွေ",
  "ပိုငွေ",
  "အပိုငွေ",
  "တိတ်ခွေ",
];

const codeRequiredDescriptionKeywords = [
  "bouquet",
  "blind box",
  "blindbox",
  "ပန်းစည်း",
  "ငွေသား",
  "အရုပ်",
  "ဝက်ဝံ",
  "ဝက်",
  "ယုန်",
  "နို့ဘူးကိုင်",
  "ဖော့",
  "ဖေ့ာ",
];

const retiredStaffIds = new Set(["staff-ah-tun", "staff-lone-lone"]);
const retiredStaffNames = new Set(["Ah Tun", "Lone Lone", "Production Team"]);
const stockFloristNames = ["Ah Tun", "Lone Lone", "Wati"];

const initialDeviceSession = loadDeviceSession();
const state = loadState();
state.currentStaffId = initialDeviceSession.staffId;
let selectedStockId = "";
let editingStockId = "";
let editingExpenseId = "";
let editingSaleId = "";
let activeSaleDraftId = "";
let reportMode = "day";
let saleItems = [];
let editingSaleItemId = "";
let stickerSettings = loadStickerSettings();
let importRows = [];
let importHeaders = [];
let stickerQueue = [];
let activeSaleStep = "info";
let activeHomeGroup = "";
let activeAdminCashStep = "accounts";
const saleStepOrder = ["info", "items", "payment"];
let productionPhotoDraft = [];
let stockPhotoDraft = null;
let editStockPhotoDraft = null;
let salePaymentDraft = [];
let editingProductionOrderId = "";
let activeReceivableSaleId = "";
let sharedSyncReady = false;
let sharedSyncSaving = false;
let sharedSyncPulling = false;
let sharedSyncTimer = null;
let sharedSyncPollTimer = null;
let sharedSyncFailureCount = 0;
let sharedSyncLastPullAt = 0;
let sharedSyncInitialSettled = !location.protocol.startsWith("http");
let sharedSyncUpdatedAt = Number(localStorage.getItem(SYNC_VERSION_STORAGE_KEY) || 0);
let sharedSyncBase = loadSyncBase();
let sharedSyncDeleteIntents = loadSyncDeleteIntents();
let sharedSyncDirty = localStorage.getItem(SYNC_DIRTY_STORAGE_KEY) === "true" ||
  Boolean(sharedSyncBase && !sameSharedState(sharedStatePayload(), sharedSyncBase)) ||
  hasDeleteIntents(sharedSyncDeleteIntents);
let sharedSyncLocalSnapshot = cloneSharedState(sharedStatePayload());
let activeRenderView = "";
let inventoryPage = 1;
let inventoryQueryKey = "";
let inventorySearchTimer = null;
const INVENTORY_PAGE_SIZE = 100;

const els = {
  loginScreen: document.querySelector("#loginScreen"),
  loginForm: document.querySelector("#loginForm"),
  loginStaff: document.querySelector("#loginStaff"),
  loginPassword: document.querySelector("#loginPassword"),
  loginStatus: document.querySelector("#loginStatus"),
  appShell: document.querySelector("#appShell"),
  sidebar: document.querySelector("#sidebar"),
  appBackButton: document.querySelector("#appBackButton"),
  appHomeButton: document.querySelector("#appHomeButton"),
  menuToggle: document.querySelector("#menuToggle"),
  logoutButton: document.querySelector("#logoutButton"),
  themeToggle: document.querySelector("#themeToggle"),
  loginThemeToggle: document.querySelector("#loginThemeToggle"),
  cloudThemeToggle: document.querySelector("#cloudThemeToggle"),
  themeToggleLabel: document.querySelector("#themeToggleLabel"),
  currentStaffName: document.querySelector("#currentStaffName"),
  currentStaffRole: document.querySelector("#currentStaffRole"),
  homeGroupBack: document.querySelector("#homeGroupBack"),
  homeGroupGrid: document.querySelector("#homeGroupGrid"),
  homeEyebrow: document.querySelector("#homeEyebrow"),
  homeTitle: document.querySelector("#homeTitle"),
  homeDescription: document.querySelector("#homeDescription"),
  homeWorkQueues: document.querySelector("#homeWorkQueues"),
  saleAccountHome: document.querySelector("#saleAccountHome"),
  saleAccountActions: document.querySelector("#saleAccountActions"),
  adminDirectHome: document.querySelector("#adminDirectHome"),
  adminDirectActions: document.querySelector("#adminDirectActions"),
  cloudSyncStatus: document.querySelector("#cloudSyncStatus"),
  cloudSyncButton: document.querySelector("#cloudSyncButton"),
  cloudForcePullButton: document.querySelector("#cloudForcePullButton"),
  cloudSyncGuard: document.querySelector("#cloudSyncGuard"),
  cloudSyncGuardMessage: document.querySelector("#cloudSyncGuardMessage"),
  cloudSyncRetryButton: document.querySelector("#cloudSyncRetryButton"),
  stockForm: document.querySelector("#stockForm"),
  saleForm: document.querySelector("#saleForm"),
  expenseForm: document.querySelector("#expenseForm"),
  expenseDate: document.querySelector("#expense input[name=\"expenseDate\"]"),
  expenseCategory: document.querySelector("#expenseForm select[name=\"category\"]"),
  expenseCategoryFilter: document.querySelector("#expenseCategoryFilter"),
  expensePaidBy: document.querySelector("#expenseForm select[name=\"paidBy\"]"),
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
  labelBarcode: document.querySelector("#labelBarcode"),
  labelDescription: document.querySelector("#labelDescription"),
  labelPrice: document.querySelector("#labelPrice"),
  printArea: document.querySelector("#printArea"),
  stockCategory: document.querySelector("#stockCategory"),
  stockSubCategory: document.querySelector("#stockSubCategory"),
  stockSkuOptions: document.querySelector("#stockSkuOptions"),
  stockSkuRestockHint: document.querySelector("#stockSkuRestockHint"),
  stockFlorist: document.querySelector("#stockFlorist"),
  stockMode: document.querySelector("#stockMode"),
  stockModeSwitch: document.querySelector("#stockModeSwitch"),
  stockDateLabel: document.querySelector("#stockDateLabel"),
  stockCashValueField: document.querySelector("#stockCashValueField"),
  stockCashFloatHint: document.querySelector("#stockCashFloatHint"),
  stockPhotoInput: document.querySelector("#stockPhotoInput"),
  stockPhotoPreview: document.querySelector("#stockPhotoPreview"),
  stockPhotoPickerLabel: document.querySelector("#stockPhotoPickerLabel"),
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
  saleItemCost: document.querySelector("#saleItemCost"),
  saleRequiresCode: document.querySelector("#saleRequiresCode"),
  addSaleItemButton: document.querySelector("#addSaleItemButton"),
  cancelSaleItemEditButton: document.querySelector("#cancelSaleItemEditButton"),
  openProductionOrderButton: document.querySelector("#openProductionOrderButton"),
  saleStepBackButton: document.querySelector("#saleStepBackButton"),
  saleStepNextButton: document.querySelector("#saleStepNextButton"),
  saveSaleButton: document.querySelector("#saveSaleButton"),
  productionOrderUrgency: document.querySelector("#productionOrderUrgency"),
  productionOrderVoucher: document.querySelector("#productionOrderVoucher"),
  productionOrderDate: document.querySelector("#productionOrderDate"),
  productionOrderPhotos: document.querySelector("#productionOrderPhotos"),
  productionOrderRequirement: document.querySelector("#productionOrderRequirement"),
  productionOrderPhotoPreview: document.querySelector("#productionOrderPhotoPreview"),
  productionPhotoModal: document.querySelector("#productionPhotoModal"),
  productionPhotoModalImage: document.querySelector("#productionPhotoModalImage"),
  productionPhotoModalName: document.querySelector("#productionPhotoModalName"),
  stockPhotoModal: document.querySelector("#stockPhotoModal"),
  stockPhotoModalImage: document.querySelector("#stockPhotoModalImage"),
  stockPhotoModalName: document.querySelector("#stockPhotoModalName"),
  sendProductionOrderButton: document.querySelector("#sendProductionOrderButton"),
  cancelProductionEditButton: document.querySelector("#cancelProductionEditButton"),
  newVoucherButton: document.querySelector("#newVoucherButton"),
  holdVoucherButton: document.querySelector("#holdVoucherButton"),
  deleteDraftButton: document.querySelector("#deleteDraftButton"),
  draftList: document.querySelector("#draftList"),
  saleItemList: document.querySelector("#saleItemList"),
  saleTotalPreview: document.querySelector("#saleTotalPreview"),
  saleTableTotal: document.querySelector("#saleTableTotal"),
  saleCostTotal: document.querySelector("#saleCostTotal"),
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
  voucherHistoryPaymentType: document.querySelector("#voucherHistoryPaymentType"),
  voucherHistorySort: document.querySelector("#voucherHistorySort"),
  voucherHistoryTable: document.querySelector("#voucherHistoryTable"),
  receivablesSearch: document.querySelector("#receivablesSearch"),
  receivablesDueDate: document.querySelector("#receivablesDueDate"),
  receivablesStatus: document.querySelector("#receivablesStatus"),
  receivablesSort: document.querySelector("#receivablesSort"),
  receivablesTotal: document.querySelector("#receivablesTotal"),
  receivablesCount: document.querySelector("#receivablesCount"),
  receivablesOverdueCount: document.querySelector("#receivablesOverdueCount"),
  receivablesTodayCount: document.querySelector("#receivablesTodayCount"),
  receivablesTable: document.querySelector("#receivablesTable"),
  receivablePaymentModal: document.querySelector("#receivablePaymentModal"),
  receivablePaymentTitle: document.querySelector("#receivablePaymentTitle"),
  receivablePaymentDetails: document.querySelector("#receivablePaymentDetails"),
  receivablePaymentForm: document.querySelector("#receivablePaymentForm"),
  receivablePaymentStatus: document.querySelector("#receivablePaymentStatus"),
  fulfillmentSearch: document.querySelector("#fulfillmentSearch"),
  fulfillmentFilterDate: document.querySelector("#fulfillmentFilterDate"),
  fulfillmentFilterStatus: document.querySelector("#fulfillmentFilterStatus"),
  fulfillmentFilterMethod: document.querySelector("#fulfillmentFilterMethod"),
  fulfillmentTable: document.querySelector("#fulfillmentTable"),
  girlfriendDaySearch: document.querySelector("#girlfriendDaySearch"),
  girlfriendDayTotalCount: document.querySelector("#girlfriendDayTotalCount"),
  girlfriendDayPendingCount: document.querySelector("#girlfriendDayPendingCount"),
  girlfriendDayCompletedCount: document.querySelector("#girlfriendDayCompletedCount"),
  girlfriendDayPendingPill: document.querySelector("#girlfriendDayPendingPill"),
  girlfriendDayCompletedPill: document.querySelector("#girlfriendDayCompletedPill"),
  girlfriendDayPendingTable: document.querySelector("#girlfriendDayPendingTable"),
  girlfriendDayCompletedTable: document.querySelector("#girlfriendDayCompletedTable"),
  codeCheckSearch: document.querySelector("#codeCheckSearch"),
  codeCheckTable: document.querySelector("#codeCheckTable"),
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
  inventoryLocationFilter: document.querySelector("#inventoryLocationFilter"),
  inventoryFilter: document.querySelector("#inventoryFilter"),
  inventoryTitle: document.querySelector("#inventoryTitle"),
  printLatestButton: document.querySelector("#printLatestButton"),
  openStickerButton: document.querySelector("#openStickerButton"),
  printStickerButton: document.querySelector("#printStickerButton"),
  shareStickerButton: document.querySelector("#shareStickerButton"),
  stickerStockSelect: document.querySelector("#stickerStockSelect"),
  stickerCodeInput: document.querySelector("#stickerCodeInput"),
  stickerCopies: document.querySelector("#stickerCopies"),
  stickerCodeOptions: document.querySelector("#stickerCodeOptions"),
  addStickerCodeButton: document.querySelector("#addStickerCodeButton"),
  addOldDesignAvailableStickersButton: document.querySelector("#addOldDesignAvailableStickersButton"),
  clearStickerQueueButton: document.querySelector("#clearStickerQueueButton"),
  stickerQueue: document.querySelector("#stickerQueue"),
  stickerWidth: document.querySelector("#stickerWidth"),
  stickerHeight: document.querySelector("#stickerHeight"),
  stickerOrientation: document.querySelector("#stickerOrientation"),
  stickerCodeSize: document.querySelector("#stickerCodeSize"),
  stickerPriceSize: document.querySelector("#stickerPriceSize"),
  stickerShowPrice: document.querySelector("#stickerShowPrice"),
  stickerBorder: document.querySelector("#stickerBorder"),
  stickerDpi: document.querySelector("#stickerDpi"),
  settingStickerWidth: document.querySelector("#settingStickerWidth"),
  settingStickerHeight: document.querySelector("#settingStickerHeight"),
  settingStickerOrientation: document.querySelector("#settingStickerOrientation"),
  settingStickerCodeSize: document.querySelector("#settingStickerCodeSize"),
  settingStickerPriceSize: document.querySelector("#settingStickerPriceSize"),
  settingStickerBorder: document.querySelector("#settingStickerBorder"),
  settingStickerDpi: document.querySelector("#settingStickerDpi"),
  exportButton: document.querySelector("#exportButton"),
  reportExportButton: document.querySelector("#reportExportButton"),
  exportModal: document.querySelector("#exportModal"),
  exportForm: document.querySelector("#exportForm"),
  exportType: document.querySelector("#exportType"),
  exportSalePersonWrap: document.querySelector("#exportSalePersonWrap"),
  exportSalePerson: document.querySelector("#exportSalePerson"),
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
  summaryCostCard: document.querySelector("#summaryCostCard"),
  summaryExpense: document.querySelector("#summaryExpense"),
  summaryProfit: document.querySelector("#summaryProfit"),
  dailyTransferPanel: document.querySelector("#dailyTransferPanel"),
  dailyTransferStatus: document.querySelector("#dailyTransferStatus"),
  dailyTransferPreview: document.querySelector("#dailyTransferPreview"),
  dailyTransferButton: document.querySelector("#dailyTransferButton"),
  reportInsightGrid: document.querySelector("#reportInsightGrid"),
  paymentSummary: document.querySelector("#paymentSummary"),
  paymentDetailList: document.querySelector("#paymentDetailList"),
  paymentHistoryModal: document.querySelector("#paymentHistoryModal"),
  paymentHistoryTitle: document.querySelector("#paymentHistoryTitle"),
  paymentHistoryBody: document.querySelector("#paymentHistoryBody"),
  soldCostModal: document.querySelector("#soldCostModal"),
  soldCostBody: document.querySelector("#soldCostBody"),
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
  expenseCategoryForm: document.querySelector("#expenseCategoryForm"),
  expenseCategoryList: document.querySelector("#expenseCategoryList"),
  salesHistory: document.querySelector("#salesHistory"),
  expenseHistory: document.querySelector("#expenseHistory"),
  expenseTable: document.querySelector("#expenseTable"),
  expenseTableTotal: document.querySelector("#expenseTableTotal"),
  expenseTableTotalLabel: document.querySelector("#expenseTableTotalLabel"),
  expensePaymentSummary: document.querySelector("#expensePaymentSummary"),
  reportExpensePaymentSummary: document.querySelector("#reportExpensePaymentSummary"),
  reportExpenseCategorySummary: document.querySelector("#reportExpenseCategorySummary"),
  financeMonth: document.querySelector("#financeMonth"),
  financeAccountsTotal: document.querySelector("#financeAccountsTotal"),
  financeRevenue: document.querySelector("#financeRevenue"),
  financeGrossProfit: document.querySelector("#financeGrossProfit"),
  financeNetProfit: document.querySelector("#financeNetProfit"),
  financeReceivable: document.querySelector("#financeReceivable"),
  financePayable: document.querySelector("#financePayable"),
  financeNetPosition: document.querySelector("#financeNetPosition"),
  financeInventoryValue: document.querySelector("#financeInventoryValue"),
  financePayableStatus: document.querySelector("#financePayableStatus"),
  financePayableForm: document.querySelector("#financePayableForm"),
  financePayablePaymentForm: document.querySelector("#financePayablePaymentForm"),
  financePayableSelect: document.querySelector("#financePayableSelect"),
  financePayableAccount: document.querySelector("#financePayableAccount"),
  financePayableRows: document.querySelector("#financePayableRows"),
  financeAccountantReceivableRows: document.querySelector("#financeAccountantReceivableRows"),
  financeAccountantPayableRows: document.querySelector("#financeAccountantPayableRows"),
  financeAccountRows: document.querySelector("#financeAccountRows"),
  financeOpeningForm: document.querySelector("#financeOpeningForm"),
  financeOpeningAccount: document.querySelector("#financeOpeningAccount"),
  financePnlPeriod: document.querySelector("#financePnlPeriod"),
  pnlRevenue: document.querySelector("#pnlRevenue"),
  pnlCogs: document.querySelector("#pnlCogs"),
  pnlGrossProfit: document.querySelector("#pnlGrossProfit"),
  pnlExpense: document.querySelector("#pnlExpense"),
  pnlNetProfit: document.querySelector("#pnlNetProfit"),
  financeCashReceived: document.querySelector("#financeCashReceived"),
  financeExpenseBreakdown: document.querySelector("#financeExpenseBreakdown"),
  stockEditModal: document.querySelector("#stockEditModal"),
  stockEditForm: document.querySelector("#stockEditForm"),
  editStockPhotoField: document.querySelector("#editStockPhotoField"),
  editStockPhotoInput: document.querySelector("#editStockPhotoInput"),
  editStockPhotoPreview: document.querySelector("#editStockPhotoPreview"),
  editStockCategory: document.querySelector("#editStockCategory"),
  editStockSubCategory: document.querySelector("#editStockSubCategory"),
  editStockCashValueField: document.querySelector("#editStockCashValueField"),
  editStockCashFloatHint: document.querySelector("#editStockCashFloatHint"),
  cashFloatForm: document.querySelector("#cashFloatForm"),
  cashFloatOpeningForm: document.querySelector("#cashFloatOpeningForm"),
  cashFloatAdminPanel: document.querySelector("#cashFloatAdminPanel"),
  cashFloatStatus: document.querySelector("#cashFloatStatus"),
  cashFloatAllocated: document.querySelector("#cashFloatAllocated"),
  cashFloatAvailable: document.querySelector("#cashFloatAvailable"),
  cashFloatUsed: document.querySelector("#cashFloatUsed"),
  cashFloatOpeningUnsold: document.querySelector("#cashFloatOpeningUnsold"),
  cashFloatUnsold: document.querySelector("#cashFloatUnsold"),
  cashFloatSold: document.querySelector("#cashFloatSold"),
  cashFloatEquation: document.querySelector("#cashFloatEquation"),
  cashFloatLedger: document.querySelector("#cashFloatLedger"),
  adminCashManager: document.querySelector("#adminCashManager"),
  adminCashMonth: document.querySelector("#adminCashMonth"),
  adminCashPreviousMonth: document.querySelector("#adminCashPreviousMonth"),
  adminCashNextMonth: document.querySelector("#adminCashNextMonth"),
  adminCashPeriodTitle: document.querySelector("#adminCashPeriodTitle"),
  adminCashAccountsSection: document.querySelector("#adminCashAccountsSection"),
  adminCashAccountsForm: document.querySelector("#adminCashAccountsForm"),
  adminCashTransferForm: document.querySelector("#adminCashTransferForm"),
  adminDailyCashSaleForm: document.querySelector("#adminDailyCashSaleForm"),
  adminBusinessCash: document.querySelector("#adminBusinessCash"),
  adminBusinessCashBreakdown: document.querySelector("#adminBusinessCashBreakdown"),
  adminPersonalCash: document.querySelector("#adminPersonalCash"),
  adminProductionCash: document.querySelector("#adminProductionCash"),
  adminProductionOpeningLabel: document.querySelector("#adminProductionOpeningLabel"),
  adminProductionOpeningHint: document.querySelector("#adminProductionOpeningHint"),
  adminCashUsed: document.querySelector("#adminCashUsed"),
  adminCashStatus: document.querySelector("#adminCashStatus"),
  adminCashLedger: document.querySelector("#adminCashLedger"),
  adminProductionCashUsage: document.querySelector("#adminProductionCashUsage"),
  adminProductionDailyTotals: document.querySelector("#adminProductionDailyTotals"),
  productionCashDailyModal: document.querySelector("#productionCashDailyModal"),
  productionCashDailyModalTitle: document.querySelector("#productionCashDailyModalTitle"),
  productionCashDailyModalBody: document.querySelector("#productionCashDailyModalBody"),
  dashboardLegacyHeader: document.querySelector("#dashboardLegacyHeader"),
  dashboardMetricGrid: document.querySelector("#dashboardMetricGrid"),
  dashboardHistoryPanel: document.querySelector("#dashboardHistoryPanel"),
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
els.financeMonth.value = currentMonth;
if (els.adminCashMonth) els.adminCashMonth.value = currentMonth < ADMIN_CASH_FIRST_MONTH ? ADMIN_CASH_FIRST_MONTH : currentMonth;
els.cashFloatForm.allocationDate.value = defaultCashFloatDate;
if (els.adminCashTransferForm) els.adminCashTransferForm.transferDate.value = defaultAdminCashDate;
if (els.adminDailyCashSaleForm) els.adminDailyCashSaleForm.saleDate.value = defaultAdminCashDate;

function loadState() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    return normalizeState(JSON.parse(stored));
  }

  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy) return normalizeState(JSON.parse(legacy));

  return normalizeState({});
}

function loadDeviceSession() {
  try {
    const stored = localStorage.getItem(AUTH_SESSION_KEY)
      || sessionStorage.getItem(LEGACY_AUTH_SESSION_KEY);
    if (!stored) return { staffId: "", staffName: "" };
    const parsed = JSON.parse(stored);
    const session = {
      staffId: String(parsed.staffId || ""),
      staffName: String(parsed.staffName || ""),
    };
    if (session.staffId) localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    sessionStorage.removeItem(LEGACY_AUTH_SESSION_KEY);
    return session;
  } catch {
    try { localStorage.removeItem(AUTH_SESSION_KEY); } catch {}
    try { sessionStorage.removeItem(LEGACY_AUTH_SESSION_KEY); } catch {}
    return { staffId: "", staffName: "" };
  }
}

function saveDeviceSession(staff) {
  try {
    if (staff?.id) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ staffId: staff.id, staffName: staff.name || "" }));
    }
    else localStorage.removeItem(AUTH_SESSION_KEY);
    sessionStorage.removeItem(LEGACY_AUTH_SESSION_KEY);
  } catch {
    // The active in-memory session still works if browser storage is unavailable.
  }
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
    dpi: 203,
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

function normalizeDateValue(value, fallback = today) {
  const text = String(value ?? "").trim();
  const fallbackDate = String(fallback || today).slice(0, 10);
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) return text.slice(0, 10);

  const slashDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  const missingSlashDate = text.match(/^(\d{1,2})\/(\d{2})(\d{4})$/);
  const match = slashDate || missingSlashDate;
  if (match) {
    const [, dayText, monthText, yearText] = match;
    const day = Number(dayText);
    const month = Number(monthText);
    const year = Number(yearText);
    if (year >= 2000 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return `${yearText}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
  }

  return fallbackDate;
}

function descriptionIncludesAny(description, keywords) {
  const text = String(description || "").toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

function inferSaleItemRequiresCode(item) {
  if (item.requiresCode !== undefined) return Boolean(item.requiresCode);
  if (item.stockId || item.type === "stock" || item.type === "sku_stock") return true;
  if (item.productCode) return true;
  const description = item.description || "";
  if (descriptionIncludesAny(description, codeFreeDescriptionKeywords)) return false;
  return descriptionIncludesAny(description, codeRequiredDescriptionKeywords);
}

function saleItemRequiresCode(item) {
  return inferSaleItemRequiresCode(item);
}

function saleItemCodeText(item) {
  if (item.productCode) return item.productCode;
  return saleItemRequiresCode(item) ? "Code Pending" : "Code မလို";
}

function renderVoucherItemSummary(items) {
  if (!items?.length) return `<span class="voucher-items-empty">Item မရှိပါ</span>`;

  const rows = items
    .map((item, index) => {
      const codeState = item.productCode ? "has-code" : saleItemRequiresCode(item) ? "pending-code" : "no-code";
      const quantity = Math.max(1, Number(item.quantity || 1));
      const unitPrice = Number(item.unitPrice ?? (Number(item.price || 0) / quantity));
      const linePrice = Number(item.price ?? (unitPrice * quantity));
      return `
        <div class="voucher-item-row" role="listitem">
          <span class="voucher-item-index" aria-hidden="true">${index + 1}</span>
          <div class="voucher-item-copy">
            <span class="voucher-item-code ${codeState}">${escapeHtml(saleItemCodeText(item))}</span>
            <strong class="voucher-item-name">${escapeHtml(item.description || "အမည်မရှိ")}</strong>
            <span class="voucher-item-price">
              <small>Price</small>
              <strong>${money(linePrice)}</strong>
              ${quantity > 1 ? `<em>${money(unitPrice)} × ${quantity}</em>` : ""}
            </span>
          </div>
          <span class="voucher-item-quantity"><small>Qty</small><strong>${escapeHtml(quantity)}</strong></span>
        </div>`;
    })
    .join("");

  return `
    <div class="voucher-items" role="list" aria-label="Voucher items">
      <div class="voucher-items-heading">
        <span>Items</span>
        <strong>${items.length}</strong>
      </div>
      ${rows}
    </div>`;
}

function suggestedCodeFromDescription(description) {
  const match = String(description || "").match(/\b[A-Z]{1,3}\d{3,5}\b/i);
  return match ? normalizeCode(match[0]) : "";
}

function normalizeStaffList(rawStaff) {
  const source = Array.isArray(rawStaff) && rawStaff.length ? rawStaff : defaultStaff;
  const staff = source
    .filter((item) => !retiredStaffIds.has(item.id) && !retiredStaffNames.has(item.name))
    .map((item) => ({
      ...item,
      role:
        item.name === "Sale Team"
          ? "cashier_expense"
          : String(item.name || "").trim().toLowerCase() === "accountant"
            ? "accountant"
            : item.role,
      password: item.password || "",
      passwordHash: item.passwordHash || "",
      passwordSalt: item.passwordSalt || "",
      passwordIterations: Number(item.passwordIterations || 0),
    }));

  if (!staff.some((item) => item.name === "Sale Team")) {
    staff.push({ id: "staff-sale-team", name: "Sale Team", role: "cashier_expense", password: "" });
  }

  return staff;
}

function bytesToBase64(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value) {
  const binary = atob(value);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function deriveStaffPassword(password, salt, iterations = STAFF_PASSWORD_ITERATIONS) {
  if (!globalThis.crypto?.subtle) throw new Error("Secure password storage is unavailable in this browser");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: "SHA-256", salt, iterations },
    key,
    256
  );
  return bytesToBase64(new Uint8Array(bits));
}

async function setStaffPassword(staff, password) {
  if (!password) {
    delete staff.password;
    delete staff.passwordHash;
    delete staff.passwordSalt;
    delete staff.passwordIterations;
    return;
  }
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await deriveStaffPassword(password, salt, STAFF_PASSWORD_ITERATIONS);
  delete staff.password;
  staff.passwordSalt = bytesToBase64(salt);
  staff.passwordIterations = STAFF_PASSWORD_ITERATIONS;
  staff.passwordHash = passwordHash;
}

async function verifyStaffPassword(staff, password) {
  if (!staff?.passwordHash) return !staff?.password || staff.password === password;
  try {
    const actual = await deriveStaffPassword(
      password,
      base64ToBytes(staff.passwordSalt),
      Number(staff.passwordIterations || STAFF_PASSWORD_ITERATIONS)
    );
    if (actual.length !== staff.passwordHash.length) return false;
    let difference = 0;
    for (let index = 0; index < actual.length; index += 1) {
      difference |= actual.charCodeAt(index) ^ staff.passwordHash.charCodeAt(index);
    }
    return difference === 0;
  } catch {
    return false;
  }
}

function normalizeFinancePayable(payable) {
  return {
    ...payable,
    id: payable.id || uid("payable"),
    orderDate: normalizeDateValue(payable.orderDate || payable.createdAt, today),
    dueDate: payable.dueDate ? normalizeDateValue(payable.dueDate, payable.orderDate || today) : "",
    supplier: payable.supplier || "",
    description: payable.description || "",
    totalAmount: Number(payable.totalAmount || 0),
    payments: Array.isArray(payable.payments)
      ? payable.payments.map((payment) => ({
          ...payment,
          id: payment.id || uid("payable-payment"),
          paymentDate: normalizeDateValue(payment.paymentDate, payable.orderDate || today),
          account: payment.account || "Cash",
          amount: Number(payment.amount || 0),
        }))
      : [],
  };
}

function reconcileSaleLinkedStock(data) {
  const stockById = new Map((data.stock || []).map((item) => [item.id, item]));
  const stockByCode = new Map(
    (data.stock || [])
      .filter((item) => item.itemType !== "sku" && normalizeCode(item.productCode))
      .map((item) => [normalizeCode(item.productCode), item])
  );
  let repaired = 0;

  (data.sales || []).forEach((sale) => {
    (sale.items || []).forEach((saleItem) => {
      let stockItem = saleItem.stockId ? stockById.get(saleItem.stockId) : null;
      if (!stockItem && ["manual", "stock"].includes(saleItem.type) && saleItem.requiresCode) {
        const codeMatchedStock = stockByCode.get(normalizeCode(saleItem.productCode));
        const soldToAnotherVoucher = codeMatchedStock?.saleId && codeMatchedStock.saleId !== sale.id;
        if (codeMatchedStock && !soldToAnotherVoucher) {
          stockItem = codeMatchedStock;
          saleItem.type = "stock";
          saleItem.stockId = stockItem.id;
          saleItem.productCode = stockItem.productCode;
          repaired += 1;
        }
      }
      if (!stockItem || stockItem.itemType === "sku") return;

      const saleDate = sale.saleDate || stockItem.soldAt || today;
      if (
        stockItem.status !== "sold" ||
        Number(stockItem.quantityAvailable || 0) !== 0 ||
        stockItem.saleId !== sale.id ||
        stockItem.soldAt !== saleDate
      ) {
        stockItem.status = "sold";
        stockItem.quantityAvailable = 0;
        stockItem.saleId = sale.id;
        stockItem.soldAt = saleDate;
        repaired += 1;
      }
    });
  });

  return repaired;
}

function normalizeState(raw) {
  const stock = Array.isArray(raw.stock) ? raw.stock : [];
  const sales = Array.isArray(raw.sales) ? raw.sales : [];
  const expenses = Array.isArray(raw.expenses) ? raw.expenses : [];
  const productionOrders = Array.isArray(raw.productionOrders) ? raw.productionOrders : [];
  const staff = normalizeStaffList(raw.staff);
  const expenseCategoryNames = [
    ...(Array.isArray(raw.expenseCategories) ? raw.expenseCategories : defaultExpenseCategories),
    ...expenses.map((expense) => expense.category).filter(Boolean),
  ];
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

  const normalized = {
    stockAudits: Array.isArray(raw.stockAudits) ? raw.stockAudits : [],
    stockAuditScans: Array.isArray(raw.stockAuditScans) ? raw.stockAuditScans : [],
    stock: stock.map((item) => ({
      ...item,
      itemType: item.itemType || "floral",
      productionDate: normalizeDateValue(item.productionDate, item.createdAt || today),
      productionStartedAt: item.productionStartedAt || "",
      florist: item.florist || item.producer || "",
      subCategory: item.subCategory || "",
      inventoryLocation: item.inventoryLocation === "pending" ? "pending" : "shop",
      productionCost: Number(item.productionCost || 0),
      cashValue: Number(item.cashValue || 0),
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
      photo: item.photo && typeof item.photo === "object" && item.photo.key
        ? {
            key: String(item.photo.key),
            contentType: String(item.photo.contentType || "image/jpeg"),
            width: Number(item.photo.width || 0),
            height: Number(item.photo.height || 0),
            size: Number(item.photo.size || 0),
            uploadedAt: item.photo.uploadedAt || "",
          }
        : null,
    })),
    sales: sales.map(normalizeSale),
    expenses: expenses.map((expense) => ({
      ...expense,
      category: expense.category || "Uncategorized",
      description: expense.description || expense.expenseCategory || expense.note || "",
      amount: Number(expense.amount || 0),
      paidBy: expense.paidBy || expense.paymentType || "Cash",
    })),
    expenseCategories: [...new Set(expenseCategoryNames.map((name) => String(name || "").trim()).filter(Boolean))],
    productionOrders: productionOrders.map((order) => ({
      ...order,
      status: order.status || "new",
      urgency: order.urgency || "",
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
          items: Array.isArray(draft.items)
            ? draft.items.map((item) => ({ ...item, requiresCode: inferSaleItemRequiresCode(item) }))
            : [],
          paymentLines: Array.isArray(draft.paymentLines)
            ? draft.paymentLines.map((payment) => ({ ...payment, amount: Number(payment.amount || 0) }))
            : [],
          receivedAmount: draft.receivedAmount || "",
          customerName: draft.customerName || "",
          customerPhone: draft.customerPhone || "",
          customerAddress: draft.customerAddress || "",
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
    financeAccounts: defaultFinanceAccounts.map((defaultAccount) => {
      const saved = Array.isArray(raw.financeAccounts)
        ? raw.financeAccounts.find((account) => account.name === defaultAccount.name)
        : null;
      return {
        name: defaultAccount.name,
        openingDate: saved?.openingDate || "",
        openingBalance: Number(saved?.openingBalance || 0),
      };
    }),
    financePayables: Array.isArray(raw.financePayables) ? raw.financePayables.map(normalizeFinancePayable) : [],
    cashFloatAllocations: Array.isArray(raw.cashFloatAllocations)
      ? raw.cashFloatAllocations.map((allocation) => ({
          ...allocation,
          id: allocation.id || uid("cash-float"),
          allocationDate: normalizeDateValue(allocation.allocationDate || allocation.createdAt, today),
          source: allocation.source === "personal" ? "personal" : "business",
          florist: allocation.florist || "",
          amount: Number(allocation.amount || 0),
          note: allocation.note || "",
        })).filter((allocation) => allocation.allocationDate >= CASH_FLOAT_START_DATE)
      : [],
    cashFloatOpeningUnsold: {
      effectiveDate: CASH_FLOAT_START_DATE,
      amount: raw.cashFloatOpeningUnsold?.effectiveDate === CASH_FLOAT_START_DATE
        ? Number(raw.cashFloatOpeningUnsold?.amount || 0)
        : 0,
      note: raw.cashFloatOpeningUnsold?.effectiveDate === CASH_FLOAT_START_DATE
        ? raw.cashFloatOpeningUnsold?.note || ""
        : "",
      updatedAt: raw.cashFloatOpeningUnsold?.effectiveDate === CASH_FLOAT_START_DATE
        ? raw.cashFloatOpeningUnsold?.updatedAt || ""
        : "",
      updatedBy: raw.cashFloatOpeningUnsold?.effectiveDate === CASH_FLOAT_START_DATE
        ? raw.cashFloatOpeningUnsold?.updatedBy || ""
        : "",
    },
    adminCashAccounts: {
      effectiveDate: ADMIN_CASH_START_DATE,
      businessOpening: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? businessCashBalancesTotal(normalizeBusinessCashBalances(
            raw.adminCashAccounts?.businessOpeningByChannel,
            raw.adminCashAccounts?.businessOpening
          ))
        : 0,
      businessOpeningByChannel: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? normalizeBusinessCashBalances(
            raw.adminCashAccounts?.businessOpeningByChannel,
            raw.adminCashAccounts?.businessOpening
          )
        : normalizeBusinessCashBalances(),
      personalOpening: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? Number(raw.adminCashAccounts?.personalOpening || 0)
        : 0,
      productionEffectiveDate: CASH_FLOAT_START_DATE,
      productionOpening: (
        raw.adminCashAccounts?.productionEffectiveDate === CASH_FLOAT_START_DATE ||
        raw.adminCashAccounts?.effectiveDate === CASH_FLOAT_START_DATE
      )
        ? Number(raw.adminCashAccounts?.productionOpening || 0)
        : 0,
      note: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? raw.adminCashAccounts?.note || ""
        : "",
      updatedAt: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? raw.adminCashAccounts?.updatedAt || ""
        : "",
      updatedBy: raw.adminCashAccounts?.effectiveDate === ADMIN_CASH_START_DATE
        ? raw.adminCashAccounts?.updatedBy || ""
        : "",
      productionNote: (
        raw.adminCashAccounts?.productionEffectiveDate === CASH_FLOAT_START_DATE ||
        raw.adminCashAccounts?.effectiveDate === CASH_FLOAT_START_DATE
      ) ? raw.adminCashAccounts?.productionNote || raw.adminCashAccounts?.note || "" : "",
      productionUpdatedAt: (
        raw.adminCashAccounts?.productionEffectiveDate === CASH_FLOAT_START_DATE ||
        raw.adminCashAccounts?.effectiveDate === CASH_FLOAT_START_DATE
      ) ? raw.adminCashAccounts?.productionUpdatedAt || raw.adminCashAccounts?.updatedAt || "" : "",
      productionUpdatedBy: (
        raw.adminCashAccounts?.productionEffectiveDate === CASH_FLOAT_START_DATE ||
        raw.adminCashAccounts?.effectiveDate === CASH_FLOAT_START_DATE
      ) ? raw.adminCashAccounts?.productionUpdatedBy || raw.adminCashAccounts?.updatedBy || "" : "",
    },
    adminCashPeriods: normalizeAdminCashPeriods(raw.adminCashPeriods, raw.adminCashAccounts),
    adminCashTransfers: Array.isArray(raw.adminCashTransfers)
      ? raw.adminCashTransfers.map((transfer) => ({
          ...transfer,
          id: transfer.id || uid("cash-transfer"),
          transferDate: normalizeDateValue(transfer.transferDate || transfer.createdAt, today),
          fromAccount: ["business", "personal", "production"].includes(transfer.fromAccount) ? transfer.fromAccount : "business",
          toAccount: ["business", "personal", "production", "outside"].includes(transfer.toAccount) ? transfer.toAccount : "production",
          businessChannel: normalizeBusinessCashChannel(transfer.businessChannel),
          toBusinessChannel: normalizeBusinessCashChannel(transfer.toBusinessChannel || transfer.businessChannel),
          amount: Number(transfer.amount || 0),
          note: transfer.note || "",
        })).filter((transfer) => transfer.transferDate >= CASH_FLOAT_START_DATE && transfer.amount > 0)
      : [],
    adminDailyCashSales: Array.isArray(raw.adminDailyCashSales)
      ? raw.adminDailyCashSales.map((sale) => ({
          ...sale,
          id: sale.id || uid("daily-cash-sale"),
          saleDate: normalizeDateValue(sale.saleDate || sale.createdAt, today),
          settlementType: sale.settlementType === "expense_shortfall" ? "expense_shortfall" : "deposit",
          businessChannel: normalizeBusinessCashChannel(sale.businessChannel),
          amount: Number(sale.amount || 0),
          note: sale.note || "",
        })).filter((sale) => sale.saleDate >= CASH_FLOAT_START_DATE && sale.amount >= 0)
      : [],
    adminDailyTransfers: Array.isArray(raw.adminDailyTransfers)
      ? raw.adminDailyTransfers.map((transfer) => ({
          ...transfer,
          id: transfer.id || `daily-transfer-${normalizeDateValue(transfer.transferDate || transfer.createdAt, today)}`,
          transferDate: normalizeDateValue(transfer.transferDate || transfer.createdAt, today),
          rows: Array.isArray(transfer.rows) ? transfer.rows.map((row) => ({
            businessChannel: normalizeBusinessCashChannel(row.businessChannel),
            label: row.label || businessCashChannelLabel(row.businessChannel),
            received: Number(row.received || 0),
            expense: Number(row.expense || 0),
            adjustment: Number(row.adjustment || 0),
            adjustmentNote: row.adjustmentNote || "",
            net: Number(row.net ?? Number(row.received || 0) - Number(row.expense || 0) + Number(row.adjustment || 0)),
          })) : [],
          createdAt: transfer.createdAt || new Date().toISOString(),
          createdBy: transfer.createdBy || "Admin",
        })).filter((transfer) => transfer.transferDate >= ADMIN_CASH_START_DATE)
      : [],
    currentStaffId: "",
  };
  normalized.stock.forEach((item) => {
    if (!isCashInventoryItem(item)) return;
    item.itemType = "sku";
    item.quantityTotal = 0;
    item.quantityAvailable = 0;
    item.status = "available";
    item.trackQuantity = false;
  });
  // Build these indexes once per normalized snapshot, not once per voucher.
  const stockCostLookup = buildStockCostLookup(normalized.stock);
  normalized.sales.forEach((sale) => {
    repairSaleItemCostsFromStock(sale.items, normalized.stock, stockCostLookup);
    sale.productionCost = (sale.items || []).reduce((sum, item) => sum + saleItemCost(item, normalized.stock, stockCostLookup), 0);
  });
  normalized.saleDrafts.forEach((draft) => repairSaleItemCostsFromStock(draft.items, normalized.stock, stockCostLookup));
  reconcileSaleLinkedStock(normalized);
  return normalized;
}

function normalizeSale(sale) {
  if (Array.isArray(sale.items)) {
    const items = sale.items.map((item) => ({
      ...item,
      id: item.id || uid("item"),
      quantity: Number(item.quantity || 1),
      price: Number(item.price || 0),
      unitPrice: Number(item.unitPrice || item.price || 0),
      unitCost: Number(item.unitCost ?? (Number(item.quantity || 1) ? Number(item.cost || 0) / Number(item.quantity || 1) : item.cost || 0)),
      cost: Number(item.cost || 0),
      costSource: item.costSource || (item.stockId ? "stock" : Number(item.cost || 0) ? "estimated" : "missing"),
      requiresCode: inferSaleItemRequiresCode(item),
    }));
    return {
      ...sale,
      items,
      customerName: sale.customerName || "",
      customerPhone: sale.customerPhone || "",
      customerAddress: sale.customerAddress || "",
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
    unitCost: Number(sale.productionCost || 0),
    cost: Number(sale.productionCost || 0),
    costSource: sale.stockId ? "stock" : Number(sale.productionCost || 0) ? "estimated" : "missing",
    requiresCode: Boolean(sale.productCode || sale.stockId),
  };

  return {
    ...sale,
    items: [item],
    customerName: sale.customerName || "",
    customerPhone: sale.customerPhone || "",
    customerAddress: sale.customerAddress || "",
    fulfillmentDate: sale.fulfillmentDate || sale.deliveryDate || sale.saleDate || today,
    fulfillmentMethod: sale.fulfillmentMethod || sale.deliveryMethod || "pickup",
    fulfillmentStatus: sale.fulfillmentStatus || (sale.delivered ? "delivered" : "pending"),
    totalPrice: Number(sale.totalPrice || 0),
    productionCost: Number(sale.productionCost || 0),
    payments: normalizePayments(sale),
  };
}

function paymentKind(payment, sale = {}) {
  if (payment?.kind === "initial" || payment?.kind === "balance") return payment.kind;
  const note = String(payment?.note || "").toLowerCase();
  if (note.includes("follow-up") || note.includes("follow up") || note.includes("edit payment")) return "balance";
  if (note.includes("initial") || note.includes("imported")) return "initial";
  return String(payment?.paymentDate || "") === String(sale.saleDate || "") ? "initial" : "balance";
}

function paymentKindLabel(payment, sale = {}) {
  return paymentKind(payment, sale) === "balance" ? "ကျန်ငွေပေး" : "အရောင်းသစ်ရငွေ";
}

function paymentKindBadge(payment, sale = {}) {
  const kind = paymentKind(payment, sale);
  return `<span class="payment-kind-badge ${kind}">${escapeHtml(paymentKindLabel(payment, sale))}</span>`;
}

function normalizePayments(sale) {
  if (Array.isArray(sale.payments)) {
    return sale.payments.map((payment) => ({
      id: payment.id || uid("payment"),
      paymentDate: payment.paymentDate || sale.saleDate || today,
      paymentType: payment.paymentType || sale.paymentType || "Cash",
      amount: Number(payment.amount || 0),
      note: payment.note || "",
      kind: paymentKind(payment, sale),
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
          kind: "initial",
        },
      ]
    : [];
}

function saveLocalState() {
  const { currentStaffId, ...businessState } = state;
  const serialized = JSON.stringify(businessState);
  try {
    localStorage.setItem(STORAGE_KEY, serialized);
    return true;
  } catch {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    localStorage.removeItem(SYNC_BASE_STORAGE_KEY);
    try {
      localStorage.setItem(STORAGE_KEY, serialized);
      return true;
    } catch {
      return false;
    }
  }
}

function loadSyncBase() {
  try {
    const stored = JSON.parse(localStorage.getItem(SYNC_BASE_STORAGE_KEY) || "null");
    localStorage.removeItem(SYNC_BASE_STORAGE_KEY);
    return stored;
  } catch {
    localStorage.removeItem(SYNC_BASE_STORAGE_KEY);
    return null;
  }
}

function normalizeDeleteIntents(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value)
      .map(([section, keys]) => [section, [...new Set((Array.isArray(keys) ? keys : []).map(String).filter(Boolean))]])
      .filter(([, keys]) => keys.length)
  );
}

function loadSyncDeleteIntents() {
  try {
    return normalizeDeleteIntents(JSON.parse(localStorage.getItem(SYNC_DELETE_INTENTS_STORAGE_KEY) || "{}"));
  } catch {
    localStorage.removeItem(SYNC_DELETE_INTENTS_STORAGE_KEY);
    return {};
  }
}

function persistSyncDeleteIntents() {
  sharedSyncDeleteIntents = normalizeDeleteIntents(sharedSyncDeleteIntents);
  try {
    if (hasDeleteIntents(sharedSyncDeleteIntents)) {
      localStorage.setItem(SYNC_DELETE_INTENTS_STORAGE_KEY, JSON.stringify(sharedSyncDeleteIntents));
    } else {
      localStorage.removeItem(SYNC_DELETE_INTENTS_STORAGE_KEY);
    }
  } catch {
    // Keep the in-memory delete intents if device storage is full.
  }
}

function hasDeleteIntents(intents = sharedSyncDeleteIntents) {
  return Object.values(intents || {}).some((keys) => Array.isArray(keys) && keys.length);
}

function deleteIntentSet(section, intents = sharedSyncDeleteIntents) {
  return new Set((intents?.[section] || []).map(String));
}

function captureExplicitDeleteIntents(previousState, nextState) {
  const before = previousState || {};
  const after = nextState || {};
  const sections = new Set([...Object.keys(before), ...Object.keys(after)]);
  sections.forEach((section) => {
    if (!Array.isArray(before[section]) && !Array.isArray(after[section])) return;
    const beforeKeys = new Set((before[section] || []).map((item) => syncEntityKey(section, item)).filter(Boolean));
    const afterKeys = new Set((after[section] || []).map((item) => syncEntityKey(section, item)).filter(Boolean));
    const intents = deleteIntentSet(section);
    beforeKeys.forEach((key) => {
      if (!afterKeys.has(key)) intents.add(key);
    });
    afterKeys.forEach((key) => intents.delete(key));
    if (intents.size) sharedSyncDeleteIntents[section] = [...intents];
    else delete sharedSyncDeleteIntents[section];
  });
  persistSyncDeleteIntents();
}

function clearAppliedDeleteIntents(appliedIntents) {
  Object.entries(normalizeDeleteIntents(appliedIntents)).forEach(([section, keys]) => {
    const remaining = deleteIntentSet(section);
    keys.forEach((key) => remaining.delete(key));
    if (remaining.size) sharedSyncDeleteIntents[section] = [...remaining];
    else delete sharedSyncDeleteIntents[section];
  });
  persistSyncDeleteIntents();
}

function cloneSharedState(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function sameSharedState(left, right) {
  return JSON.stringify(left || {}) === JSON.stringify(right || {});
}

function setSyncBase(nextState, updatedAt) {
  sharedSyncBase = cloneSharedState(nextState);
  sharedSyncUpdatedAt = Number(updatedAt || 0);
  try {
    localStorage.setItem(SYNC_VERSION_STORAGE_KEY, String(sharedSyncUpdatedAt));
  } catch {
    // The in-memory cursor remains authoritative for this session.
  }
}

function setSyncDirty(isDirty) {
  sharedSyncDirty = Boolean(isDirty);
  try {
    localStorage.setItem(SYNC_DIRTY_STORAGE_KEY, String(sharedSyncDirty));
  } catch {
    // A full device store must not prevent the cloud write from continuing.
  }
}

function setCloudSyncStatus(status, message) {
  if (!els.cloudSyncStatus) return;
  els.cloudSyncStatus.dataset.state = status;
  els.cloudSyncStatus.textContent = message;
}

function setCloudSyncGuard(blocked, message = "Cloud မှ နောက်ဆုံးစာရင်းယူနေသည်…", isError = false) {
  if (!els.cloudSyncGuard) return;
  els.cloudSyncGuard.hidden = !blocked;
  els.cloudSyncGuard.dataset.state = isError ? "error" : "connecting";
  if (els.cloudSyncGuardMessage) els.cloudSyncGuardMessage.textContent = message;
  if (els.cloudSyncRetryButton) els.cloudSyncRetryButton.hidden = !isError;
  if (els.appShell) els.appShell.setAttribute("aria-busy", String(blocked));
}

function syncedTimeLabel(updatedAt) {
  if (!updatedAt) return "Cloud Sync အဆင်ပြေသည်";
  return `Cloud Sync ✓ ${new Date(Number(updatedAt)).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
}

function entityKey(item) {
  if (!item || typeof item !== "object") return "";
  return String(item.id || item.name || item.productCode || "");
}

function syncEntityKey(section, item) {
  if (!item || typeof item !== "object") return "";
  if (section === "stock") return String(item.productCode || item.id || "");
  return entityKey(item);
}

function mergeEntityArray(section, baseItems, localItems, remoteItems, deleteIntents = sharedSyncDeleteIntents) {
  const arrays = [baseItems, localItems, remoteItems].map((items) => (Array.isArray(items) ? items : []));
  const canMergeByKey = arrays.every((items) => items.every((item) => syncEntityKey(section, item)));
  if (!canMergeByKey) return sameSharedState(localItems, baseItems) ? remoteItems : localItems;

  const [base, local, remote] = arrays;
  const baseMap = new Map(base.map((item) => [syncEntityKey(section, item), item]));
  const localMap = new Map(local.map((item) => [syncEntityKey(section, item), item]));
  const mergedMap = new Map(remote.map((item) => [syncEntityKey(section, item), item]));
  const explicitDeletes = deleteIntentSet(section, deleteIntents);

  baseMap.forEach((baseItem, key) => {
    if (!localMap.has(key)) {
      if (explicitDeletes.has(key)) mergedMap.delete(key);
      return;
    }
    if (!sameSharedState(localMap.get(key), baseItem)) mergedMap.set(key, localMap.get(key));
  });
  localMap.forEach((localItem, key) => {
    if (!baseMap.has(key)) mergedMap.set(key, localItem);
  });

  const localOrder = [...new Set(local.map((item) => syncEntityKey(section, item)))];
  return [
    ...localOrder.filter((key) => mergedMap.has(key)).map((key) => mergedMap.get(key)),
    ...[...mergedMap].filter(([key]) => !localOrder.includes(key)).map(([, item]) => item),
  ];
}

function mergeSharedChanges(baseState, localState, remoteState, deleteIntents = sharedSyncDeleteIntents) {
  const base = baseState || {};
  const local = localState || {};
  const remote = remoteState || {};
  const merged = {};
  const keys = new Set([...Object.keys(base), ...Object.keys(local), ...Object.keys(remote)]);

  keys.forEach((key) => {
    if (Array.isArray(local[key]) || Array.isArray(base[key]) || Array.isArray(remote[key])) {
      merged[key] = mergeEntityArray(key, base[key], local[key], remote[key], deleteIntents);
    } else {
      merged[key] = sameSharedState(local[key], base[key]) ? remote[key] : local[key];
    }
  });
  return merged;
}

function buildSharedPatch(baseState, localState, deleteIntents = sharedSyncDeleteIntents) {
  const base = baseState || {};
  const local = localState || {};
  const patch = { arrays: {}, values: {} };
  const keys = new Set([...Object.keys(base), ...Object.keys(local)]);

  keys.forEach((key) => {
    if (Array.isArray(base[key]) || Array.isArray(local[key])) {
      const baseItems = Array.isArray(base[key]) ? base[key] : [];
      const localItems = Array.isArray(local[key]) ? local[key] : [];
      const patchItemKey = (item) => syncEntityKey(key, item);
      const canPatchByKey = [...baseItems, ...localItems].every((item) => patchItemKey(item));
      if (!canPatchByKey) {
        if (!sameSharedState(baseItems, localItems)) patch.values[key] = localItems;
        return;
      }

      const baseMap = new Map(baseItems.map((item) => [patchItemKey(item), item]));
      const localMap = new Map(localItems.map((item) => [patchItemKey(item), item]));
      const upserts = [...localMap].filter(([itemKey, item]) => !baseMap.has(itemKey) || !sameSharedState(item, baseMap.get(itemKey))).map(([, item]) => item);
      const explicitDeletes = deleteIntentSet(key, deleteIntents);
      const deletes = [...baseMap.keys()].filter((itemKey) => !localMap.has(itemKey) && explicitDeletes.has(itemKey));
      if (upserts.length || deletes.length) patch.arrays[key] = { upserts, deletes };
      return;
    }

    if (!sameSharedState(base[key], local[key])) patch.values[key] = local[key];
  });
  return patch;
}

function sharedStatePayload() {
  const { currentStaffId, ...sharedState } = state;
  return sharedState;
}

function saveState() {
  const snapshot = cloneSharedState(sharedStatePayload());
  captureExplicitDeleteIntents(sharedSyncLocalSnapshot, snapshot);
  sharedSyncLocalSnapshot = snapshot;
  const savedLocally = saveLocalState();
  setSyncDirty(true);
  setCloudSyncStatus("saving", savedLocally ? "Cloud သို့ သိမ်းနေသည်…" : "Device storage ပြည့်နေသည် — Cloud သို့ သိမ်းနေသည်…");
  queueSharedStateSave();
}

function stateBusinessScore(data) {
  return (
    (data.stock || []).length * 4 +
    (data.sales || []).length * 5 +
    (data.expenses || []).length * 3 +
    (data.productionOrders || []).length * 3 +
    (data.saleDrafts || []).length +
    (data.financePayables || []).length * 2 +
    (data.financePayables || []).reduce((sum, payable) => sum + (payable.payments || []).length, 0) +
    (data.cashFloatAllocations || []).length * 2 +
    (data.adminCashPeriods || []).length * 2 +
    (data.adminCashTransfers || []).length * 2 +
    (data.adminDailyCashSales || []).length * 2 +
    (data.adminDailyTransfers || []).length * 2 +
    Math.max(0, (data.salePersons || []).length - defaultSalePersons.length) +
    Math.max(0, (data.staff || []).length - defaultStaff.length) +
    Math.max(0, (data.categories || []).length - defaultCategories.length)
  );
}

function captureActiveSaleWorkspace() {
  const hasActiveWorkspace = Boolean(
    editingSaleId ||
      activeSaleDraftId ||
      editingSaleItemId ||
      saleItems.length ||
      salePaymentDraft.length
  );
  if (!hasActiveWorkspace) return null;
  return {
    editingSaleId,
    activeSaleDraftId,
    editingSaleItemId,
    activeSaleStep,
    saleItems: saleItems.map((item) => ({ ...item })),
    salePaymentDraft: salePaymentDraft.map((payment) => ({ ...payment })),
  };
}

function restoreActiveSaleWorkspace(workspace) {
  if (!workspace) return;
  editingSaleId = workspace.editingSaleId;
  activeSaleDraftId = workspace.activeSaleDraftId;
  editingSaleItemId = workspace.editingSaleItemId;
  activeSaleStep = workspace.activeSaleStep;
  saleItems = workspace.saleItems;
  repairSaleItemCostsFromStock(saleItems);
  salePaymentDraft = workspace.salePaymentDraft;
}

function applySharedState(nextState) {
  const activeSaleWorkspace = captureActiveSaleWorkspace();
  const currentStaffId = state.currentStaffId;
  const normalized = normalizeState(nextState || {});
  normalized.currentStaffId = currentStaffId;
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, normalized);
  sharedSyncLocalSnapshot = cloneSharedState(sharedStatePayload());
  saveLocalState();
  selectedStockId = "";
  editingStockId = "";
  editingExpenseId = "";
  editingSaleId = "";
  activeSaleDraftId = "";
  saleItems = [];
  salePaymentDraft = [];
  editingSaleItemId = "";
  restoreActiveSaleWorkspace(activeSaleWorkspace);
}

function mergeSharedWithoutBase(localState, remoteState, deleteIntents = sharedSyncDeleteIntents) {
  const local = localState || {};
  const remote = remoteState || {};
  const merged = cloneSharedState(remote);
  const keys = new Set([...Object.keys(remote), ...Object.keys(local)]);
  keys.forEach((key) => {
    if (Array.isArray(local[key]) || Array.isArray(remote[key])) {
      const remoteItems = Array.isArray(remote[key]) ? remote[key] : [];
      const localItems = Array.isArray(local[key]) ? local[key] : [];
      const mergedMap = new Map(remoteItems.map((item) => [syncEntityKey(key, item), item]));
      deleteIntentSet(key, deleteIntents).forEach((itemKey) => mergedMap.delete(itemKey));
      localItems.forEach((item) => {
        const itemKey = syncEntityKey(key, item);
        if (itemKey) mergedMap.set(itemKey, item);
      });
      const localOrder = [...new Set(localItems.map((item) => syncEntityKey(key, item)).filter(Boolean))];
      merged[key] = [
        ...localOrder.map((itemKey) => mergedMap.get(itemKey)).filter(Boolean),
        ...[...mergedMap].filter(([itemKey]) => !localOrder.includes(itemKey)).map(([, item]) => item),
      ];
    } else if (Object.prototype.hasOwnProperty.call(local, key)) {
      merged[key] = local[key];
    }
  });
  return merged;
}

function applySyncEnvelope(baseState, envelope, { full = false } = {}) {
  const nextState = full ? {} : cloneSharedState(baseState || {});
  const grouped = new Map();
  (envelope.entities || []).forEach((change) => {
    if (!grouped.has(change.section)) grouped.set(change.section, []);
    grouped.get(change.section).push(change);
  });

  grouped.forEach((changes, section) => {
    if (full) {
      nextState[section] = changes
        .filter((change) => !change.deleted && change.data)
        .sort((left, right) => Number(left.sortOrder || 0) - Number(right.sortOrder || 0) || Number(right.updatedAt || 0) - Number(left.updatedAt || 0))
        .map((change) => change.data);
      return;
    }

    const items = Array.isArray(nextState[section]) ? [...nextState[section]] : [];
    changes.forEach((change) => {
      const itemIndex = items.findIndex((item) => syncEntityKey(section, item) === String(change.entityKey));
      if (change.deleted) {
        if (itemIndex >= 0) items.splice(itemIndex, 1);
        return;
      }
      if (!change.data) return;
      if (itemIndex >= 0) items[itemIndex] = change.data;
      else items.splice(Math.max(0, Math.min(items.length, Number(change.sortOrder || 0))), 0, change.data);
    });
    nextState[section] = items;
  });

  (envelope.values || []).forEach((change) => {
    if (change.deleted) delete nextState[change.key];
    else nextState[change.key] = change.data;
  });
  return nextState;
}

async function fetchSyncPage(since = 0, options = {}) {
  const params = new URLSearchParams({
    since: String(Number(since || 0)),
    entityOffset: String(Number(options.entityOffset || 0)),
    valueOffset: String(Number(options.valueOffset || 0)),
    pageSize: String(SHARED_SYNC_PAGE_SIZE),
    includeEntities: options.includeEntities === false ? "0" : "1",
    includeValues: options.includeValues === false ? "0" : "1",
    activeOnly: options.activeOnly ? "1" : "0",
    until: String(Number(options.snapshotVersion || 0)),
    t: String(Date.now()),
  });
  const response = await fetch(`${SHARED_SYNC_ENDPOINT}?${params}`, { cache: "no-store", credentials: "include" });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const error = new Error(detail?.error || `Cloud read failed (${response.status})`);
    error.status = response.status;
    error.code = detail?.code || "";
    throw error;
  }
  return response.json();
}

async function fetchSyncEnvelope(since = 0, { activeOnly = Number(since || 0) === 0 } = {}) {
  const combined = { cursor: Number(since || 0), entities: [], values: [], hasMore: false };
  let entityOffset = 0;
  let valueOffset = 0;
  let includeEntities = true;
  let includeValues = true;
  let snapshotVersion = 0;

  for (let pageIndex = 0; pageIndex < 100 && (includeEntities || includeValues); pageIndex += 1) {
    const page = await fetchSyncPage(since, { entityOffset, valueOffset, includeEntities, includeValues, activeOnly, snapshotVersion });
    snapshotVersion = Number(page.snapshotVersion || snapshotVersion || 0);
    combined.entities.push(...(page.entities || []));
    combined.values.push(...(page.values || []));
    combined.cursor = Math.max(combined.cursor, Number(page.cursor || 0));

    if (!("entitiesHasMore" in page) && page.hasMore) {
      throw new Error("Cloud sync pagination requires the latest server version");
    }

    includeEntities = Boolean(page.entitiesHasMore);
    includeValues = Boolean(page.valuesHasMore);
    entityOffset = Number(page.nextEntityOffset ?? entityOffset + (page.entities || []).length);
    valueOffset = Number(page.nextValueOffset ?? valueOffset + (page.values || []).length);

    if (!page.hasMore) break;
    if (pageIndex === 99) throw new Error("Cloud data has too many sync pages");
  }
  return combined;
}

async function fetchCompleteSharedState() {
  const record = await fetchFullSharedState();
  return {
    state: normalizeState(record.state || {}),
    updatedAt: Number(record.updatedAt || 0),
    bootstrap: "full-state",
  };
}

async function fetchFullSharedState() {
  const response = await fetch(`/api/state?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const error = new Error(detail?.error || `Cloud state read failed (${response.status})`);
    error.status = response.status;
    error.code = detail?.code || "";
    throw error;
  }
  return response.json();
}

async function fetchRecoverySharedState() {
  const response = await fetch(`/recovery-state.json?t=${Date.now()}`, {
    cache: "no-store",
    credentials: "include",
  });
  if (!response.ok) throw new Error(`Recovery data failed (${response.status})`);
  return response.json();
}

async function pushSharedState() {
  if (!sharedSyncReady || sharedSyncSaving || !sharedSyncDirty) return;
  sharedSyncSaving = true;
  // A write cursor also includes other devices' writes. Our local snapshot
  // has not read those changes yet, so keep the last read cursor for the pull.
  const lastReadCursor = sharedSyncUpdatedAt;
  const pendingDeleteIntents = cloneSharedState(sharedSyncDeleteIntents);
  let snapshot = cloneSharedState(sharedStatePayload());
  if (sharedSyncBase) {
    const protectedSnapshot = mergeSharedChanges(sharedSyncBase, snapshot, sharedSyncBase, pendingDeleteIntents);
    if (!sameSharedState(snapshot, protectedSnapshot)) {
      applySharedState(protectedSnapshot);
      renderAll();
      snapshot = cloneSharedState(sharedStatePayload());
    }
  }
  try {
    const patch = buildSharedPatch(sharedSyncBase || {}, snapshot, pendingDeleteIntents);
    const response = await fetch(SHARED_SYNC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        patch,
        actor: {
          actorId: state.currentStaffId || "",
          actorName: currentStaff()?.name || "Unknown",
        },
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      throw new Error(`Cloud save failed (${response.status})${detail ? `: ${detail.slice(0, 120)}` : ""}`);
    }

    const record = await response.json();
    const currentState = cloneSharedState(sharedStatePayload());
    const changedWhileSaving = !sameSharedState(currentState, snapshot);
    setSyncBase(snapshot, lastReadCursor);
    clearAppliedDeleteIntents(pendingDeleteIntents);
    setSyncDirty(changedWhileSaving || hasDeleteIntents());
    window.b3SharedSync = { ready: true, updatedAt: sharedSyncUpdatedAt, dirty: sharedSyncDirty };
    setCloudSyncStatus(sharedSyncDirty ? "saving" : "synced", sharedSyncDirty ? "Cloud သို့ သိမ်းနေသည်…" : syncedTimeLabel(Date.now()));
  } catch (error) {
    sharedSyncReady = false;
    window.b3SharedSync = { ready: false, error: true, dirty: sharedSyncDirty, message: error?.message || "Cloud save failed" };
    setCloudSyncStatus("error", `Cloud Save မရပါ${error?.message ? ` (${error.message})` : ""}`);
  } finally {
    sharedSyncSaving = false;
    if (sharedSyncDirty) queueSharedStateSave();
    else if (sharedSyncReady) scheduleSharedSyncPoll();
  }
}

function queueSharedStateSave() {
  clearTimeout(sharedSyncTimer);
  sharedSyncTimer = setTimeout(() => {
    if (sharedSyncReady) pushSharedState();
    else pullSharedState();
  }, sharedSyncReady ? 75 : 750);
}

async function pullSharedState({ initial = false } = {}) {
  if (sharedSyncSaving || sharedSyncPulling) return;
  sharedSyncPulling = true;
  sharedSyncLastPullAt = Date.now();
  if (!sharedSyncReady) setCloudSyncGuard(true);
  setCloudSyncStatus("connecting", "Cloud မှ စာရင်းယူနေသည်…");
  try {
    const completeRead = initial || !sharedSyncBase;
    const record = completeRead
      ? await fetchCompleteSharedState()
      : await fetchSyncEnvelope(sharedSyncUpdatedAt);
    // An empty delta is the common polling case. Do not clone/normalize the
    // entire history (or replace the merge baseline) when nothing changed.
    if (!initial && sharedSyncBase && !sharedSyncDirty && !hasDeleteIntents() &&
        !(record.entities || []).length && !(record.values || []).length) {
      sharedSyncUpdatedAt = Number(record.cursor ?? sharedSyncUpdatedAt);
      try { localStorage.setItem(SYNC_VERSION_STORAGE_KEY, String(sharedSyncUpdatedAt)); } catch {}
      sharedSyncReady = true;
      sharedSyncFailureCount = 0;
      setCloudSyncGuard(false);
      window.b3SharedSync = { ready: true, updatedAt: sharedSyncUpdatedAt, dirty: false };
      setCloudSyncStatus("synced", syncedTimeLabel(Date.now()));
      return;
    }
    const remoteState = completeRead
      ? normalizeState(record.state || {})
      : normalizeState(applySyncEnvelope(sharedSyncBase, record));
    const remoteUpdatedAt = Number(record.updatedAt ?? record.cursor ?? sharedSyncUpdatedAt ?? 0);
    const localScore = stateBusinessScore(state);
    const remoteScore = stateBusinessScore(remoteState);

    sharedSyncReady = true;
    sharedSyncFailureCount = 0;
    sharedSyncInitialSettled = true;
    setCloudSyncGuard(false);
    if (sharedSyncDirty) {
      const mergedState = sharedSyncBase
        ? mergeSharedChanges(sharedSyncBase, sharedStatePayload(), remoteState, sharedSyncDeleteIntents)
        : mergeSharedWithoutBase(sharedStatePayload(), remoteState, sharedSyncDeleteIntents);
      const changed = !sameSharedState(sharedStatePayload(), mergedState);
      applySharedState(mergedState);
      setSyncBase(remoteState, remoteUpdatedAt);
      setSyncDirty(true);
      if (changed) renderAll();
      await pushSharedState();
      return;
    }

    const hasRemoteChanges = completeRead || (record.entities || []).length > 0 || (record.values || []).length > 0;
    if (remoteUpdatedAt > 0 && hasRemoteChanges) {
      applySharedState(remoteState);
      setSyncBase(remoteState, remoteUpdatedAt);
      setSyncDirty(false);
      renderAll();
      setCloudSyncStatus("synced", syncedTimeLabel(Date.now()));
      return;
    }

    if (initial && remoteUpdatedAt === 0 && localScore > 0) {
      setSyncBase(remoteState, 0);
      setSyncDirty(true);
      await pushSharedState();
      return;
    }

    setSyncBase(remoteState, remoteUpdatedAt);
    window.b3SharedSync = { ready: true, updatedAt: sharedSyncUpdatedAt, localScore, remoteScore, dirty: false };
    setCloudSyncStatus("synced", syncedTimeLabel(Date.now()));
  } catch (error) {
    sharedSyncReady = false;
    sharedSyncFailureCount += 1;
    const cachedBusinessDataAvailable = stateBusinessScore(state) > 0;
    if (cachedBusinessDataAvailable) sharedSyncInitialSettled = true;
    if (error?.code === "D1_DAILY_READ_LIMIT") {
      // Never replace a device's newer cached work with an older recovery
      // snapshot. Keep it editable and dirty so it can merge after recovery.
      if (cachedBusinessDataAvailable) {
        window.b3SharedSync = {
          ready: false,
          error: true,
          quota: true,
          offline: true,
          dirty: sharedSyncDirty,
          message: error?.message || "Cloud database daily read limit reached",
        };
        setCloudSyncGuard(false);
        setCloudSyncStatus("error", "Cloud quota ပြည့်နေသည် — ဒီ Device ၏ နောက်ဆုံးစာရင်းကို မပြောင်းဘဲ သုံးနေသည်");
        return;
      }
      try {
        const recovery = await fetchRecoverySharedState();
        const recoveredState = normalizeState(recovery?.state || {});
        applySharedState(recoveredState);
        setSyncBase(recoveredState, Number(recovery?.updatedAt || 0));
        setSyncDirty(false);
        sharedSyncLocalSnapshot = cloneSharedState(sharedStatePayload());
        renderAll();
        setCloudSyncGuard(true, "Cloud quota ပြည့်နေသည်။ Recovery စာရင်းကို ဖတ်ရန်သာ ပြထားသည် — အသစ်မထည့်သေးပါနှင့်။", true);
        setCloudSyncStatus("error", "Cloud quota ပြည့်နေသည် — Recovery စာရင်း (read-only)");
        window.b3SharedSync = {
          ready: false,
          error: true,
          recovery: true,
          readOnly: true,
          dirty: false,
          updatedAt: sharedSyncUpdatedAt,
        };
        return;
      } catch (recoveryError) {
        console.error("Recovery snapshot failed", recoveryError);
      }
    }
    window.b3SharedSync = {
      ready: false,
      error: true,
      offline: cachedBusinessDataAvailable,
      dirty: sharedSyncDirty,
      message: error?.message || "Cloud read failed",
    };
    if (cachedBusinessDataAvailable) {
      setCloudSyncGuard(false);
      setCloudSyncStatus(
        "error",
        error?.code === "D1_DAILY_READ_LIMIT"
          ? "Cloud quota ပြည့်နေသည် — ဒီ Device မှာသိမ်းထားသောစာရင်းကို သုံးနေသည်"
          : "Cloud မရသေးပါ — ဒီ Device မှာသိမ်းထားသောစာရင်းကို သုံးနေသည်"
      );
    } else {
      setCloudSyncStatus("error", `Cloud Sync မရပါ${error?.message ? ` (${error.message})` : ""}`);
      setCloudSyncGuard(true, "Cloud စာရင်းမရသေးပါ။ Sale မထည့်ခင် internet စစ်ပြီး Retry နှိပ်ပါ။", true);
    }
  } finally {
    sharedSyncPulling = false;
  }
}

function sharedSyncPollDelay() {
  if (document.visibilityState !== "visible") return SHARED_SYNC_HIDDEN_POLL_MS;
  return Math.min(SHARED_SYNC_MAX_POLL_MS, SHARED_SYNC_ACTIVE_POLL_MS * (2 ** Math.min(sharedSyncFailureCount, 3)));
}

function scheduleSharedSyncPoll(delay = sharedSyncPollDelay()) {
  clearTimeout(sharedSyncPollTimer);
  sharedSyncPollTimer = setTimeout(async () => {
    if (document.visibilityState === "visible") await pullSharedState();
    scheduleSharedSyncPoll();
  }, delay);
}

function refreshSharedSyncIfStale() {
  const elapsed = Date.now() - sharedSyncLastPullAt;
  if (!sharedSyncLastPullAt || elapsed >= SHARED_SYNC_ACTIVE_POLL_MS) {
    return pullSharedStateAndReschedule();
  }
  scheduleSharedSyncPoll(Math.max(1000, SHARED_SYNC_ACTIVE_POLL_MS - elapsed));
  return Promise.resolve();
}

async function pullSharedStateAndReschedule(options = {}) {
  clearTimeout(sharedSyncPollTimer);
  await pullSharedState(options);
  scheduleSharedSyncPoll();
}

function startSharedSync() {
  if (!location.protocol.startsWith("http")) return;
  setCloudSyncGuard(true);
  pullSharedStateAndReschedule();
  window.addEventListener("online", () => pullSharedStateAndReschedule());
  window.addEventListener("focus", refreshSharedSyncIfStale);
  window.addEventListener("pageshow", refreshSharedSyncIfStale);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") refreshSharedSyncIfStale();
    else scheduleSharedSyncPoll();
  });
}

window.b3ForcePullSharedData = async () => {
  const record = await fetchCompleteSharedState();
  applySharedState(record.state || {});
  sharedSyncReady = true;
  setSyncBase(record.state || {}, record.updatedAt);
  setSyncDirty(false);
  renderAll();
  return window.b3SharedSync = { ready: true, updatedAt: sharedSyncUpdatedAt, forced: true, remoteScore: stateBusinessScore(state) };
};

function uid(prefix) {
  if (globalThis.crypto?.randomUUID) return `${prefix}-${globalThis.crypto.randomUUID()}`;
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function money(value) {
  return `${Number(value || 0).toLocaleString("en-US")} MMK`;
}

function productionTimestampText(item) {
  const value = item?.productionStartedAt || item?.createdAt || "";
  if (!value) return "Time မမှတ်ထားပါ";
  const timestamp = new Date(value);
  if (Number.isNaN(timestamp.getTime())) return String(value);
  return timestamp.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

function setTheme(theme) {
  const nextTheme = theme === "dark" ? "dark" : "light";
  const toggleLabel = nextTheme === "dark" ? "Switch to light mode" : "Switch to dark mode";
  document.documentElement.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  [els.themeToggle, els.loginThemeToggle, els.cloudThemeToggle].filter(Boolean).forEach((button) => {
    button.setAttribute("aria-pressed", String(nextTheme === "dark"));
    button.setAttribute("aria-label", toggleLabel);
    button.setAttribute("title", toggleLabel);
  });
  if (els.themeToggleLabel) els.themeToggleLabel.textContent = nextTheme === "dark" ? "Light Mode" : "Dark Mode";
}

function initializeTheme() {
  setTheme(localStorage.getItem(THEME_STORAGE_KEY) || "light");
}

function toggleThemeMode() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

window.toggleThemeMode = toggleThemeMode;

function initializeNavigationGroups() {
  const nav = document.querySelector("#sideNav");
  if (!nav || nav.querySelector(".nav-section-label")) return;
  [
    ['[data-nav="dashboard"]', "✨ ပင်မ"],
    ['[data-nav="stock"]', "🧰 နေ့စဉ်လုပ်ငန်း"],
    ['[data-nav="stock-inventory"]', "📚 စီမံခန့်ခွဲမှု"],
    [".sync-note", "👤 အကောင့်"],
  ].forEach(([selector, label]) => {
    const link = nav.querySelector(selector);
    if (!link) return;
    const heading = document.createElement("span");
    heading.className = "nav-section-label";
    heading.textContent = label;
    nav.insertBefore(heading, link);
  });
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

function isMoneyBouquetCategory(categoryName) {
  const value = String(categoryName || "").trim().toLowerCase();
  return value.includes("money") || value.includes("ငွေသား");
}

function isCashInventoryItem(item) {
  return String(item?.category || "").trim() === "ငွေသား";
}

function inventoryLocationLabel(location) {
  return location === "pending" ? "ဆိုင်ထဲမရောက်သေး" : "ဆိုင်အရောင်း";
}

function isShopInventoryItem(item) {
  return item?.inventoryLocation !== "pending";
}

function isQuantityTrackedSku(item) {
  return item?.itemType === "sku" && !isCashInventoryItem(item);
}

function isCashFloatVoucherItem(item, stockItems = state.stock) {
  const code = normalizeCode(item?.productCode);
  const stockItem =
    (item?.stockId && (stockItems || []).find((stock) => stock.id === item.stockId)) ||
    (stockItems || []).find((stock) => normalizeCode(stock.productCode) === code);
  return code.startsWith("MM") || isCashInventoryItem(stockItem);
}

function cashFloatVoucherItemValue(item, stockItems = state.stock) {
  if (!isCashFloatVoucherItem(item, stockItems)) return 0;
  const code = normalizeCode(item?.productCode);
  const stockItem =
    (item?.stockId && (stockItems || []).find((stock) => stock.id === item.stockId)) ||
    (stockItems || []).find((stock) => normalizeCode(stock.productCode) === code);
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const unitValue = Number(
    item?.unitCost ||
    stockItem?.unitCost ||
    stockItem?.productionCost ||
    stockItem?.salePrice ||
    item?.unitPrice ||
    Number(item?.price || 0) / quantity ||
    0
  );
  return Math.max(0, unitValue) * quantity;
}

function cashFloatVoucherUsageDate(sale) {
  return normalizeDateValue(sale?.fulfillmentDate || sale?.saleDate);
}

function cashFloatVoucherValue(sale, stockItems = state.stock, asOfDate = today) {
  const usageDate = cashFloatVoucherUsageDate(sale);
  if (usageDate < CASH_FLOAT_START_DATE || usageDate > normalizeDateValue(asOfDate)) return 0;
  return (sale?.items || []).reduce((sum, item) => sum + cashFloatVoucherItemValue(item, stockItems), 0);
}

function cashFloatTotals(excludeStockId = "", excludeSaleId = "") {
  const periodMonth = normalizeDateValue(today).slice(0, 7);
  const monthlyPeriod = (state.adminCashPeriods || []).find((period) => period.month === periodMonth);
  const inActivePeriod = (dateValue) => monthlyPeriod
    ? normalizeDateValue(dateValue).slice(0, 7) === periodMonth
    : normalizeDateValue(dateValue) >= CASH_FLOAT_START_DATE;
  const allocations = (state.cashFloatAllocations || []).filter(
    (item) => inActivePeriod(item.allocationDate)
  );
  const cashBouquets = state.stock.filter(
    (item) =>
      item.id !== excludeStockId &&
      Number(item.cashValue || 0) > 0 &&
      inActivePeriod(item.productionDate)
  );
  const voucherMmUsed = state.sales
    .filter((sale) => sale.id !== excludeSaleId && inActivePeriod(cashFloatVoucherUsageDate(sale)))
    .reduce((sum, sale) => sum + cashFloatVoucherValue(sale), 0);
  const productionTransfers = (state.adminCashTransfers || []).filter(
    (item) => inActivePeriod(item.transferDate)
  );
  const transfersIn = productionTransfers
    .filter((item) => item.toAccount === "production")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const transfersOut = productionTransfers
    .filter((item) => item.fromAccount === "production")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const productionOpening = monthlyPeriod
    ? Number(adminCashTotals(periodMonth).productionOpening || 0)
    : Number(state.adminCashAccounts?.productionOpening || 0);
  const allocated = productionOpening + allocations.reduce((sum, item) => sum + Number(item.amount || 0), 0) + transfersIn;
  const bouquetUsed = cashBouquets.reduce((sum, item) => sum + Number(item.cashValue || 0), 0);
  const bouquetCashUsed = bouquetUsed + voucherMmUsed;
  const used = bouquetCashUsed + transfersOut;
  const unsold = cashBouquets
    .filter((item) => item.status !== "sold")
    .reduce((sum, item) => sum + Number(item.cashValue || 0), 0);
  const sold = cashBouquets
    .filter((item) => item.status === "sold")
    .reduce((sum, item) => sum + Number(item.cashValue || 0), 0) + voucherMmUsed;
  return { allocated, used, bouquetCashUsed, available: allocated - used, unsold, sold, voucherMmUsed, transfersIn, transfersOut, productionOpening };
}

function cashFloatAvailableBalance(excludeStockId = "", excludeSaleId = "") {
  return cashFloatTotals(excludeStockId, excludeSaleId).available;
}

function renderStockCashValueField() {
  const form = els.stockForm;
  const isAfterStart = normalizeDateValue(form.productionDate.value) >= CASH_FLOAT_START_DATE;
  const isCashBouquet =
    (els.stockMode.value || "floral") === "floral" && isMoneyBouquetCategory(form.category.value);
  els.stockCashValueField.hidden = !isCashBouquet;
  form.cashValue.required = isCashBouquet;
  if (!isCashBouquet) form.cashValue.value = "";
  els.stockCashFloatHint.textContent = isAfterStart
    ? `Production Cash Float လက်ကျန် ${money(cashFloatAvailableBalance())}`
    : `${CASH_FLOAT_START_DATE} မတိုင်ခင် Stock ဖြစ်သောကြောင့် Cash Float လက်ကျန်မှ မနုတ်ပါ`;
}

function renderEditStockCashValueField() {
  const form = els.stockEditForm;
  const item = state.stock.find((stockItem) => stockItem.id === editingStockId);
  const isCashBouquet =
    item?.itemType !== "sku" &&
    isMoneyBouquetCategory(form.category.value);
  const isAfterStart = normalizeDateValue(form.productionDate.value) >= CASH_FLOAT_START_DATE;
  els.editStockCashValueField.hidden = !isCashBouquet;
  form.cashValue.required = isCashBouquet;
  if (!isCashBouquet) form.cashValue.value = "";
  els.editStockCashFloatHint.textContent = isAfterStart
    ? `ပြင်ဆင်ပြီးနောက် Production Cash Float လက်ကျန် ${money(cashFloatAvailableBalance(editingStockId))}`
    : `${CASH_FLOAT_START_DATE} မတိုင်ခင် Stock ဖြစ်သောကြောင့် Cash Float လက်ကျန်မှ မနုတ်ပါ`;
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
  els.stockDateLabel.innerHTML = `${mode === "sku" ? "ဝယ်ယူသည့်ရက်" : "ထုတ်လုပ်သည့်ရက်"} <span class="req">*</span>`;
  form.productCode.placeholder = mode === "sku" ? "BB-001 / DOLL-01" : "FS-0001";
  if (mode === "sku") form.productCode.setAttribute("list", "stockSkuOptions");
  else form.productCode.removeAttribute("list");
  form.description.placeholder =
    mode === "sku" ? "ဥပမာ - Blind Box / အရုပ် / အရေအတွက်လိုက်ပစ္စည်း" : "ဥပမာ - နှင်းဆီပန်းစည်း အနီရောင် အလတ်စား";
  if (mode === "sku" && !form.quantity.value) form.quantity.value = "1";
  if (mode === "floral") maybeAutoProductCode();
  if (mode !== "sku") showSkuRestockHint(null);
  renderStockCashValueField();
}

function existingSkuForCode(code = els.stockForm.productCode.value) {
  const normalizedCode = normalizeCode(code || "");
  if (!normalizedCode) return null;
  return state.stock.find((item) => item.itemType === "sku" && normalizeCode(item.productCode || "") === normalizedCode) || null;
}

function showSkuRestockHint(item) {
  if (!els.stockSkuRestockHint) return;
  els.stockSkuRestockHint.hidden = !item;
  els.stockSkuRestockHint.innerHTML = item
    ? isCashInventoryItem(item)
      ? `<strong>${escapeHtml(item.productCode)} ငွေသား denomination</strong><span>${escapeHtml(item.description || "-")} · Non-stock / အရေအတွက်မကန့်သတ်ပါ</span><b>Voucher ထဲမှာ သုံးမည့်အရေအတွက်ကိုသာ ထည့်ပါ။</b>`
      : `<strong>${escapeHtml(item.productCode)} ရှိပြီးသား SKU တွေ့ပါပြီ</strong><span>${escapeHtml(item.description || "-")} · လက်ရှိ Available ${escapeHtml(item.quantityAvailable || 0)} / Total ${escapeHtml(item.quantityTotal || 0)}</span><b>အောက်က Quantity ကိုပဲ အသစ်ဝင်လာတဲ့အရေအတွက် ထည့်ပြီး Stock ထည့်ပါ။</b>`
    : "";
}

function autofillExistingSku() {
  if ((els.stockMode.value || "floral") !== "sku") return;
  const item = existingSkuForCode();
  showSkuRestockHint(item);
  if (!item) return;

  const form = els.stockForm;
  form.productCode.value = item.productCode || "";
  form.category.value = item.category || "";
  renderSubcategories();
  form.subCategory.value = item.subCategory || "";
  form.description.value = item.description || "";
  form.salePrice.value = Number(item.salePrice || 0) || "";
  if (!form.quantity.value) form.quantity.value = "1";
  els.stockStatus.textContent = isCashInventoryItem(item)
    ? `${item.productCode} ငွေသား denomination — Stock quantity မတွက်ပါ`
    : `${item.productCode} ရှိပြီးသား SKU — Quantity ပဲထည့်ပါ`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function voucherPopupButton(sale, fallback = "-") {
  const voucherNumber = sale?.voucherNumber || fallback;
  if (!sale?.id) return `<strong>${escapeHtml(voucherNumber)}</strong>`;
  return `<button class="text-button voucher-popup-link" type="button" data-view-voucher="${escapeHtml(sale.id)}" aria-label="${escapeHtml(voucherNumber)} Voucher အကျဉ်းချုပ်ကြည့်ရန်" title="Voucher အကျဉ်းချုပ်ကြည့်ရန်">${escapeHtml(voucherNumber)}</button>`;
}

function voucherPopupButtonByNumber(voucherNumber, fallback = "-") {
  const normalizedNumber = String(voucherNumber || "").trim().toLowerCase();
  const sale = state.sales.find((item) => String(item.voucherNumber || "").trim().toLowerCase() === normalizedNumber);
  return sale ? voucherPopupButton(sale, fallback) : `<strong>${escapeHtml(voucherNumber || fallback)}</strong>`;
}

function lucideMarkup(name, className = "") {
  return `<i data-lucide="${escapeHtml(name)}"${className ? ` class="${escapeHtml(className)}"` : ""} aria-hidden="true"></i>`;
}

function setButtonIconLabel(button, icon, label) {
  if (!button) return;
  button.innerHTML = `${lucideMarkup(icon)} ${escapeHtml(label)}`;
}

let lucideRefreshQueued = false;

function refreshLucideIcons() {
  if (!window.lucide?.createIcons || lucideRefreshQueued) return;
  lucideRefreshQueued = true;
  window.requestAnimationFrame(() => {
    lucideRefreshQueued = false;
    window.lucide.createIcons();
  });
}

function initializeLucideIcons() {
  refreshLucideIcons();
  const observer = new MutationObserver((mutations) => {
    const hasPendingIcon = mutations.some((mutation) =>
      Array.from(mutation.addedNodes).some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node.matches?.("i[data-lucide]") || node.querySelector?.("i[data-lucide]"))
      )
    );
    if (hasPendingIcon) refreshLucideIcons();
  });
  observer.observe(document.body, { childList: true, subtree: true });
}

function byDateDesc(a, b, key) {
  return String(b[key] || "").localeCompare(String(a[key] || ""));
}

function currentStaff() {
  const staffById = state.staff.find((staff) => staff.id === state.currentStaffId);
  if (staffById) return staffById;
  const session = loadDeviceSession();
  const staffByName = session.staffName
    ? state.staff.find((staff) => String(staff.name || "").trim().toLowerCase() === session.staffName.trim().toLowerCase())
    : null;
  if (!staffByName) return undefined;
  state.currentStaffId = staffByName.id;
  saveDeviceSession(staffByName);
  return staffByName;
}

function roleHasPermission(role, permission) {
  return rolePermissions[role]?.includes(permission);
}

function hasPermission(permission) {
  const staff = currentStaff();
  if (!staff) return false;
  if (
    String(staff.name || "").trim().toLowerCase() === "accountant" &&
    ["finance", "finance-details"].includes(permission)
  ) return true;
  return roleHasPermission(staff.role, permission);
}

function isSaleAccess() {
  return ["cashier", "cashier_expense", "accountant"].includes(currentStaff()?.role);
}

function requestedView() {
  return (location.hash || "#home").replace("#", "") || "home";
}

function inventoryMenuView(view) {
  if (view === "inventory") return "shop-inventory";
  return view;
}

function permissionForView(view) {
  if (view === "stock-audit") return "inventory";
  return ["stock-inventory", "shop-inventory"].includes(view) ? "inventory" : view;
}

function canOpenView(view) {
  if (view === "production" && !productionOrdersEnabled) return false;
  return hasPermission(permissionForView(view));
}

function firstAllowedView() {
  const staff = currentStaff();
  return rolePermissions[staff?.role]?.includes("home") ? "home" : inventoryMenuView(rolePermissions[staff?.role]?.[0] || "dashboard");
}

function showView(nextView = requestedView(), { render = true } = {}) {
  const requestedMenuView = inventoryMenuView(nextView);
  const view = canOpenView(requestedMenuView) ? requestedMenuView : firstAllowedView();
  const sectionView = ["stock-inventory", "shop-inventory"].includes(view) ? "inventory" : view;
  if (sectionView === "inventory" && els.inventoryLocationFilter) {
    els.inventoryLocationFilter.value = view === "stock-inventory" ? "pending" : "shop";
    if (els.inventoryTitle) els.inventoryTitle.textContent = view === "stock-inventory" ? "Stock Inventory" : "Shop Inventory";
  }
  document.querySelectorAll("[data-view]").forEach((section) => {
    section.classList.toggle("is-active", section.dataset.view === sectionView);
  });
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.nav === view);
  });
  const currentViewTitle = document.querySelector("#currentViewTitle");
  if (currentViewTitle) {
    const activeLabel = document.querySelector(`[data-nav="${view}"] .nav-label strong`);
    const fallbackTitles = {
      home: "Home",
      sticker: "Sticker Print",
      production: "Production",
    };
    currentViewTitle.textContent = activeLabel?.textContent?.trim() || fallbackTitles[view] || "B3 Floral EBS";
  }
  if (els.appBackButton) {
    const atHomeRoot = view === "home" && (!activeHomeGroup || currentStaff()?.role === "production");
    els.appBackButton.disabled = atHomeRoot;
    els.appBackButton.setAttribute("aria-disabled", String(atHomeRoot));
  }
  els.appHomeButton?.classList.toggle("is-active", view === "home" && (!activeHomeGroup || currentStaff()?.role === "production"));
  if (location.hash !== `#${view}`) {
    history.replaceState(null, "", `#${view}`);
  }
  activeRenderView = view;
  if (render) {
    renderDropdowns();
    renderActiveView();
  }
}

function goToView(view) {
  location.hash = `#${view}`;
  showView(view);
}

function newProductionOrderCount() {
  if (!productionOrdersEnabled) return 0;
  return state.productionOrders.filter((order) => (order.status || "new") === "new").length;
}

function pendingProductionOrderCount() {
  if (!productionOrdersEnabled) return 0;
  return (state.productionOrders || []).filter((order) => order.status !== "done").length;
}

function todayFulfillmentDueCount() {
  return state.sales.filter(
    (sale) =>
      (sale.fulfillmentStatus || "pending") !== "delivered" &&
      fulfillmentDueDate(sale) === today
  ).length;
}

function fulfillmentAttentionCount() {
  return state.sales.filter(
    (sale) =>
      (sale.fulfillmentStatus || "pending") !== "delivered" &&
      fulfillmentDueDate(sale) <= today
  ).length;
}

function girlfriendDayPendingCount() {
  return state.sales.filter(
    (sale) =>
      fulfillmentDueDate(sale) === NATIONAL_GIRLFRIEND_DAY_DATE &&
      pendingCodeItemsForSale(sale).length > 0
  ).length;
}

function pendingCodeItemsForSale(sale) {
  return (sale.items || []).filter((item) => saleItemRequiresCode(item) && !item.productCode);
}

function codeCheckAttentionCount() {
  return state.sales.reduce((sum, sale) => sum + pendingCodeItemsForSale(sale).length, 0);
}

function receivablesAttentionCount() {
  return state.sales.filter((sale) => saleBalance(sale) > 0).length;
}

function saleStepIndex(step = activeSaleStep) {
  return Math.max(0, saleStepOrder.indexOf(step));
}

function updateSaleStepNav() {
  const index = saleStepIndex();
  if (els.saleStepBackButton) {
    els.saleStepBackButton.disabled = index === 0;
  }
  if (els.saleStepNextButton) {
    els.saleStepNextButton.disabled = index >= saleStepOrder.length - 1;
  }
}

function moveSaleStep(direction) {
  const nextIndex = saleStepIndex() + direction;
  if (nextIndex < 0 || nextIndex >= saleStepOrder.length) return;
  setSaleStep(saleStepOrder[nextIndex], { scroll: true });
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

  const girlfriendDayCount = girlfriendDayPendingCount();
  document.querySelectorAll('[data-nav-badge="girlfriend-day"]').forEach((badge) => {
    badge.textContent = girlfriendDayCount;
    badge.hidden = girlfriendDayCount <= 0;
  });

  const codeCheckCount = codeCheckAttentionCount();
  document.querySelectorAll('[data-nav-badge="codecheck"]').forEach((badge) => {
    badge.textContent = codeCheckCount;
    badge.hidden = codeCheckCount <= 0;
  });

  const receivablesCount = receivablesAttentionCount();
  document.querySelectorAll('[data-nav-badge="receivables"]').forEach((badge) => {
    badge.textContent = receivablesCount;
    badge.hidden = receivablesCount <= 0;
  });
}

function setSaleStep(step, options = {}) {
  if (!saleStepOrder.includes(step)) return;
  activeSaleStep = step;
  document.querySelectorAll("[data-sale-step]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.saleStep === step);
  });
  document.querySelectorAll("[data-step-panel]").forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.stepPanel === step);
  });
  updateSaleStepNav();
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
          <button class="icon-button danger" type="button" data-remove-sale-payment-line="${payment.id}" title="Remove payment line">${lucideMarkup("trash-2")}</button>
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

function stockFloristOptions() {
  return stockFloristNames.map((name) => ({ value: name, label: name }));
}

function salesStaff() {
  return activeStaff().filter((staff) => ["cashier", "cashier_expense", "accountant", "admin"].includes(staff.role));
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

  document.querySelectorAll("[data-content-permission]").forEach((node) => {
    node.hidden = !hasPermission(node.dataset.contentPermission);
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const nav = link.dataset.nav;
    link.classList.toggle("is-denied", !hasPermission(permissionForView(nav)));
  });

  const restrictFinancialSummary = isSaleAccess();
  document.body.classList.toggle("is-sale-access", restrictFinancialSummary);
  document.querySelectorAll("[data-report-sensitive]").forEach((node) => {
    node.hidden = restrictFinancialSummary;
  });
}

function renderDropdowns() {
  const previousCategory = els.stockCategory.value;
  const previousExpenseCategory = els.expenseCategory?.value;
  const previousExpenseCategoryFilter = els.expenseCategoryFilter?.value;
  const previousInventoryCategory = els.inventoryCategoryFilter.value;
  const previousInventorySubCategory = els.inventorySubCategoryFilter.value;
  const previousSalePerson = els.salePerson.value;

  populateSelect(
    els.stockCategory,
    state.categories.map((category) => ({ value: category.name, label: category.name })),
    "အမျိုးအစားရွေးပါ"
  );
  if (previousCategory) els.stockCategory.value = previousCategory;
  renderSubcategories();

  populateSelect(
    els.stockFlorist,
    stockFloristOptions(),
    "Florist ရွေးပါ"
  );
  populateSelect(
    els.editStockFlorist,
    stockFloristOptions(),
    "Choose florist"
  );

  populateSelect(
    els.salePerson,
    activeSalePersons().map((person) => ({ value: person.name, label: person.name })),
    "Choose sale person"
  );
  if (previousSalePerson) els.salePerson.value = previousSalePerson;

  if (els.expenseCategory) {
    populateSelect(
      els.expenseCategory,
      state.expenseCategories.map((name) => ({ value: name, label: name })),
      "Expense category ရွေးပါ"
    );
    if (previousExpenseCategory && state.expenseCategories.includes(previousExpenseCategory)) {
      els.expenseCategory.value = previousExpenseCategory;
    }
  }

  if (els.expenseCategoryFilter) {
    const expenseFilterCategories = [...new Set([
      ...state.expenseCategories,
      ...state.expenses.map((expense) => expense.category || "Uncategorized"),
    ])].sort((a, b) => a.localeCompare(b));
    populateSelect(
      els.expenseCategoryFilter,
      expenseFilterCategories.map((name) => ({ value: name, label: name })),
      "Category အားလုံး"
    );
    if (previousExpenseCategoryFilter && expenseFilterCategories.includes(previousExpenseCategoryFilter)) {
      els.expenseCategoryFilter.value = previousExpenseCategoryFilter;
    }
  }

  if (activeRenderView === "sticker") {
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
  } else {
    els.stickerStockSelect.replaceChildren();
    els.stickerCodeOptions.replaceChildren();
  }
  if (els.stockSkuOptions) {
    els.stockSkuOptions.innerHTML = state.stock
      .filter((item) => item.itemType === "sku")
      .sort((a, b) => String(a.productCode || "").localeCompare(String(b.productCode || ""), undefined, { numeric: true }))
      .map((item) => `<option value="${escapeHtml(item.productCode)}" label="${escapeHtml(isCashInventoryItem(item) ? `${item.description || ""} | Non-stock` : `${item.description || ""} | Available ${item.quantityAvailable || 0}`)}"></option>`)
      .join("");
  }
  if (activeRenderView === "sale") renderSaleCodeOptions();
  else els.saleProductCodeOptions?.replaceChildren();

  populateSelect(
    els.inventoryCategoryFilter,
    state.categories.map((category) => ({ value: category.name, label: category.name })),
    "All Categories"
  );
  if (previousInventoryCategory) els.inventoryCategoryFilter.value = previousInventoryCategory;
  renderInventorySubcategoryFilter(previousInventorySubCategory);
  renderStockEditCategoryOptions();
  renderStockCashValueField();
}

function renderSaleCodeOptions() {
  if (!els.saleProductCodeOptions) return;
  els.saleProductCodeOptions.innerHTML = state.stock
    .filter((item) => isShopInventoryItem(item))
    .map((item) => {
      const label =
        item.itemType === "sku"
          ? isCashInventoryItem(item)
            ? `${item.description || ""} | Non-stock | ${money(item.salePrice)}`
            : `${item.description || ""} | Qty ${item.quantityAvailable || 0} | ${money(item.salePrice)}`
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
  setControlValue(els.stickerDpi, stickerSettings.dpi);
  setControlValue(els.settingStickerWidth, stickerSettings.width);
  setControlValue(els.settingStickerHeight, stickerSettings.height);
  setControlValue(els.settingStickerOrientation, stickerSettings.orientation);
  setControlValue(els.settingStickerCodeSize, stickerSettings.codeSize);
  setControlValue(els.settingStickerPriceSize, stickerSettings.priceSize);
  setControlValue(els.settingStickerBorder, stickerSettings.border);
  setControlValue(els.settingStickerDpi, stickerSettings.dpi);
  const root = document.documentElement;
  root.style.setProperty("--sticker-width", `${stickerSettings.width}mm`);
  root.style.setProperty("--sticker-height", `${stickerSettings.height}mm`);
  root.style.setProperty("--sticker-code-size", `${stickerSettings.codeSize}px`);
  root.style.setProperty("--sticker-price-size", `${stickerSettings.priceSize}px`);
  root.style.setProperty("--sticker-price-display", stickerSettings.showPrice === "yes" ? "block" : "none");
  root.style.setProperty("--sticker-border", stickerSettings.border === "light" ? "1px solid #d7d7d7" : "0");
  root.style.setProperty("--sticker-transform", stickerSettings.orientation === "rotate" ? "rotate(90deg)" : "none");
}

function updateStickerSettings(event) {
  const target = event?.target;
  [
    [els.stickerWidth, els.settingStickerWidth],
    [els.stickerHeight, els.settingStickerHeight],
    [els.stickerOrientation, els.settingStickerOrientation],
    [els.stickerCodeSize, els.settingStickerCodeSize],
    [els.stickerPriceSize, els.settingStickerPriceSize],
    [els.stickerBorder, els.settingStickerBorder],
    [els.stickerDpi, els.settingStickerDpi],
  ].forEach(([stickerControl, settingControl]) => {
    if (target === stickerControl && settingControl) settingControl.value = stickerControl.value;
    if (target === settingControl && stickerControl) stickerControl.value = settingControl.value;
  });
  stickerSettings = {
    width: Number(stickerSettingValue(els.settingStickerWidth, els.stickerWidth, 60)),
    height: Number(stickerSettingValue(els.settingStickerHeight, els.stickerHeight, 38)),
    orientation: stickerSettingValue(els.settingStickerOrientation, els.stickerOrientation, "normal"),
    codeSize: Number(stickerSettingValue(els.settingStickerCodeSize, els.stickerCodeSize, 30)),
    priceSize: Number(stickerSettingValue(els.settingStickerPriceSize, els.stickerPriceSize, 17)),
    showPrice: els.stickerShowPrice.value,
    border: stickerSettingValue(els.settingStickerBorder, els.stickerBorder, "none"),
    dpi: Number(stickerSettingValue(els.settingStickerDpi, els.stickerDpi, 203)),
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
  const queueItems = stickerQueue.flatMap((entry) => {
    const item = state.stock.find((stockItem) => stockItem.id === entry.id);
    return item ? Array.from({ length: entry.quantity }, () => item) : [];
  });
  if (queueItems.length) return queueItems;
  const selected = getSelectedStock();
  return selected ? [selected] : [];
}

function stickerDescription(item) {
  const description = String(item?.description || "No description").trim();
  const paperColor = String(item?.paperColor || "").trim();
  const isFloral = (item?.itemType || "floral") !== "sku";
  return isFloral && paperColor && paperColor !== "-"
    ? `${description} (${paperColor})`
    : description;
}

// Code 128-B supports the printable ASCII product codes used by B3. Keeping the
// encoder local means barcode printing also works when the shop is offline.
const CODE128_PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232", "2331112",
];

function code128Values(value) {
  const text = String(value || "?").replace(/[^\x20-\x7e]/g, "?");
  const data = Array.from(text, (character) => character.charCodeAt(0) - 32);
  const checksum = (104 + data.reduce((sum, code, index) => sum + code * (index + 1), 0)) % 103;
  return [104, ...data, checksum, 106];
}

function code128Bars(value) {
  return code128Values(value).map((code) => CODE128_PATTERNS[code]);
}

function barcodeSvg(value) {
  const patterns = code128Bars(value);
  const quietZone = 10;
  const barcodeWidth = patterns.reduce(
    (total, pattern) => total + Array.from(pattern, Number).reduce((sum, width) => sum + width, 0),
    quietZone * 2
  );
  let x = quietZone;
  const bars = [];
  patterns.forEach((pattern) => {
    Array.from(pattern, Number).forEach((width, index) => {
      if (index % 2 === 0) bars.push(`<rect x="${x}" y="0" width="${width}" height="38"/>`);
      x += width;
    });
  });
  return `<svg class="barcode-svg" viewBox="0 0 ${barcodeWidth} 38" preserveAspectRatio="none" role="img" aria-label="Barcode ${escapeHtml(value)}">${bars.join("")}</svg>`;
}

function stickerLabelHtml(item) {
  return `
    <div class="print-label">
      <strong>${escapeHtml(item.productCode)}</strong>
      <div class="label-barcode">${barcodeSvg(item.productCode)}</div>
      <small>${escapeHtml(stickerDescription(item))}</small>
      <b>${escapeHtml(`Sale Price: ${money(item.salePrice)}`)}</b>
    </div>
  `;
}

function renderPrintArea() {
  els.printArea.innerHTML = stickerItemsToPrint().map(stickerLabelHtml).join("");
}

function canvasBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("PNG ဖိုင် ပြုလုပ်၍မရပါ"));
    }, "image/png");
  });
}

function wrapCanvasText(context, text, maxWidth, maxLines = 2) {
  const words = String(text || "No description").trim().split(/\s+/);
  const lines = [];
  let line = "";
  words.forEach((word) => {
    const candidate = line ? `${line} ${word}` : word;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  });
  if (line) lines.push(line);
  if (lines.length <= maxLines) return lines;
  const visible = lines.slice(0, maxLines);
  let last = visible[maxLines - 1];
  while (last && context.measureText(`${last}…`).width > maxWidth) last = last.slice(0, -1);
  visible[maxLines - 1] = `${last}…`;
  return visible;
}

async function stickerPngFile(item, index = 0) {
  // Most compact thermal label printers use 203 DPI; 300 DPI is selectable for
  // higher-resolution models. The vendor app should use Original / 100%.
  const dpi = Number(stickerSettings.dpi || 203);
  const pxPerMm = dpi / 25.4;
  const width = Math.max(1, Math.round(Number(stickerSettings.width || 60) * pxPerMm));
  const height = Math.max(1, Math.round(Number(stickerSettings.height || 38) * pxPerMm));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("ဒီ browser တွင် PNG ပြုလုပ်၍မရပါ");

  context.fillStyle = "#fff";
  context.fillRect(0, 0, width, height);
  context.fillStyle = "#000";
  context.textAlign = "center";
  context.textBaseline = "middle";

  const rotated = stickerSettings.orientation === "rotate";
  if (rotated) {
    context.translate(width / 2, height / 2);
    context.rotate(Math.PI / 2);
    context.translate(-height / 2, -width / 2);
  }
  const contentWidth = rotated ? height : width;
  const contentHeight = rotated ? width : height;
  const cssScale = dpi / 96;
  const codeSize = Number(stickerSettings.codeSize || 30) * cssScale;
  const descriptionSize = 12 * cssScale;
  const priceSize = Number(stickerSettings.priceSize || 17) * cssScale;
  const barcodeHeight = Math.min(9 * pxPerMm, contentHeight * 0.27);
  const gap = 1.3 * pxPerMm;

  context.font = `700 ${descriptionSize}px Arial, sans-serif`;
  const descriptionLines = wrapCanvasText(context, stickerDescription(item), contentWidth * 0.9, 2);
  const lineHeights = [codeSize * 1.05, barcodeHeight, ...descriptionLines.map(() => descriptionSize * 1.2)];
  if (stickerSettings.showPrice === "yes") lineHeights.push(priceSize * 1.1);
  const totalHeight = lineHeights.reduce((sum, value) => sum + value, 0) + gap * (lineHeights.length - 1);
  let y = Math.max(0, (contentHeight - totalHeight) / 2);
  const drawLine = (text, size, weight = 700) => {
    const lineHeight = size * (size === codeSize ? 1.05 : 1.15);
    context.font = `${weight} ${size}px Arial, "Segoe UI", sans-serif`;
    context.fillText(text, contentWidth / 2, y + lineHeight / 2, contentWidth * 0.94);
    y += lineHeight + gap;
  };

  drawLine(item.productCode, codeSize, 900);
  const barcodePatterns = code128Bars(item.productCode);
  const barcodeModules = barcodePatterns.reduce(
    (total, pattern) => total + Array.from(pattern, Number).reduce((sum, moduleWidth) => sum + moduleWidth, 0),
    20
  );
  const barcodeWidth = contentWidth * 0.9;
  const moduleWidth = barcodeWidth / barcodeModules;
  let barcodeX = (contentWidth - barcodeWidth) / 2 + 10 * moduleWidth;
  barcodePatterns.forEach((pattern) => {
    Array.from(pattern, Number).forEach((barWidth, patternIndex) => {
      const renderedWidth = barWidth * moduleWidth;
      if (patternIndex % 2 === 0) context.fillRect(barcodeX, y, renderedWidth, barcodeHeight);
      barcodeX += renderedWidth;
    });
  });
  y += barcodeHeight + gap;
  descriptionLines.forEach((line) => drawLine(line, descriptionSize, 400));
  if (stickerSettings.showPrice === "yes") drawLine(`Sale Price: ${money(item.salePrice)}`, priceSize, 900);

  if (stickerSettings.border === "light") {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.strokeStyle = "#aaa";
    context.lineWidth = Math.max(1, Math.round(pxPerMm * 0.2));
    context.strokeRect(context.lineWidth / 2, context.lineWidth / 2, width - context.lineWidth, height - context.lineWidth);
    context.restore();
  }

  const blob = await canvasBlob(canvas);
  const safeCode = String(item.productCode || `sticker-${index + 1}`).replace(/[^a-z0-9_-]+/gi, "-");
  return new File([blob], `${safeCode}-${stickerSettings.width}x${stickerSettings.height}mm-${dpi}dpi.png`, { type: "image/png" });
}

async function shareStickerPng() {
  const items = stickerItemsToPrint();
  if (!items.length) {
    els.stickerStatus.textContent = "Product Code ရွေးပြီးမှ PNG Share နှိပ်ပါ";
    return;
  }

  // Web Share is unavailable on an HTTP LAN address (for example 192.168.x.x).
  // Open a tab immediately while the tap still counts as a user gesture so iOS
  // users can use the browser's Share button instead of being sent to Downloads.
  const isMobileDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const previewWindow = !navigator.share && isMobileDevice ? window.open("", "_blank") : null;
  els.shareStickerButton.disabled = true;
  els.stickerStatus.textContent = "PNG ပြုလုပ်နေပါတယ်…";
  try {
    // One image per unique code; its requested copy count is retained in the file name.
    const grouped = new Map();
    items.forEach((item) => {
      const entry = grouped.get(item.id) || { item, quantity: 0 };
      entry.quantity += 1;
      grouped.set(item.id, entry);
    });
    const files = await Promise.all(Array.from(grouped.values()).map(async ({ item, quantity }, index) => {
      const file = await stickerPngFile(item, index);
      if (quantity === 1) return file;
      return new File([file], file.name.replace(".png", `-x${quantity}.png`), { type: file.type });
    }));

    if (navigator.share && (!navigator.canShare || navigator.canShare({ files }))) {
      await navigator.share({
        files,
        title: "B3 Floral Sticker — XPrinter",
        text: `${stickerSettings.width} × ${stickerSettings.height} mm · ${stickerSettings.dpi} DPI · PNG ကိုသိမ်းပြီး XPrinter app ရဲ့ Image/Picture Print မှဖွင့်ပါ`,
      });
      els.stickerStatus.textContent = "PNG သိမ်းပြီးပါပြီ — XPrinter app ရဲ့ Image/Picture Print မှဖွင့်ပါ";
      return;
    }

    if (previewWindow && files.length === 1) {
      const previewUrl = URL.createObjectURL(files[0]);
      previewWindow.location.replace(previewUrl);
      window.setTimeout(() => URL.revokeObjectURL(previewUrl), 5 * 60 * 1000);
      els.stickerStatus.textContent = "PNG ပွင့်လာပါပြီ — Browser ရဲ့ Share ခလုတ်ကိုနှိပ်ပါ";
      return;
    }

    if (previewWindow) previewWindow.close();

    files.forEach((file) => {
      const url = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    els.stickerStatus.textContent = "PNG ကို Download လုပ်ပြီးပါပြီ";
  } catch (error) {
    if (previewWindow && !previewWindow.closed) previewWindow.close();
    if (error?.name === "AbortError") els.stickerStatus.textContent = "Share မလုပ်တော့ပါ";
    else els.stickerStatus.textContent = error?.message || "PNG Share မလုပ်နိုင်ပါ";
  } finally {
    els.shareStickerButton.disabled = false;
  }
}

function renderStickerQueue() {
  const visibleQueue = stickerQueue.length > 40 ? stickerQueue.slice(0, 20) : stickerQueue;
  const queueSummary = stickerQueue.length > 40
    ? `<strong class="sticker-queue-summary">Design အဟောင်း Available ${escapeHtml(stickerQueue.length)} ခု ရွေးထားပါတယ်</strong>`
    : "";
  const queueRemainder = stickerQueue.length > 40
    ? `<span class="muted">နောက်ထပ် ${escapeHtml(stickerQueue.length - visibleQueue.length)} ခု · PC Print နှိပ်လျှင် အားလုံးထုတ်ပါမယ်</span>`
    : "";
  els.stickerQueue.innerHTML = stickerQueue.length
    ? queueSummary + visibleQueue
        .map((entry) => {
          const item = state.stock.find((stockItem) => stockItem.id === entry.id);
          if (!item) return "";
          return `<button class="sticker-chip" type="button" data-remove-sticker="${item.id}">${escapeHtml(item.productCode)} × ${entry.quantity} <span>${lucideMarkup("x")}</span></button>`;
        })
        .join("") + queueRemainder
    : `<span class="muted">Bulk ထုတ်မယ်ဆိုရင် code ရိုက်ပြီး Add နှိပ်ပါ။ မထည့်ရင် Product Code ရွေးပြီး တစ်ခုထဲထုတ်ပါမယ်။</span>`;
  renderPrintArea();
}

function oldDesignAvailableStickerItems() {
  const cutoff = Date.parse(STICKER_BARCODE_DESIGN_DEPLOYED_AT);
  return state.stock
    .filter((item) => {
      if ((item.itemType || "floral") !== "floral") return false;
      const createdAt = Date.parse(item.createdAt || "");
      if (!Number.isFinite(createdAt) || createdAt >= cutoff) return false;
      return item.status === "available" && Number(item.quantityAvailable || 0) > 0;
    })
    .sort((a, b) => String(a.productCode || "").localeCompare(String(b.productCode || ""), undefined, { numeric: true }));
}

function addOldDesignAvailableStickersToQueue() {
  const items = oldDesignAvailableStickerItems();
  if (!items.length) {
    els.stickerStatus.textContent = "Design အဟောင်း Available sticker မတွေ့ပါ";
    return;
  }
  stickerQueue = items.map((item) => ({ id: item.id, quantity: 1 }));
  selectedStockId = items[0].id;
  els.stickerStockSelect.value = selectedStockId;
  els.stickerCodeInput.value = items[0].productCode || "";
  els.stickerStatus.textContent = `${items.length} ခု ရွေးပြီးပါပြီ — PC Print နှိပ်ပါ`;
  renderSticker();
}

function addStickerCodeToQueue() {
  const item = stockByCode(els.stickerCodeInput.value) || state.stock.find((stockItem) => stockItem.id === els.stickerStockSelect.value);
  if (!item) {
    els.stickerStatus.textContent = "Product Code ရွေးပါ";
    return;
  }
  selectedStockId = item.id;
  const quantity = Math.max(1, Math.min(100, Number(els.stickerCopies.value || 1)));
  const queued = stickerQueue.find((entry) => entry.id === item.id);
  if (queued) queued.quantity += quantity;
  else stickerQueue.push({ id: item.id, quantity });
  els.stickerCodeInput.value = "";
  els.stickerCopies.value = "1";
  els.stickerStatus.textContent = `${item.productCode} × ${quantity} list ထဲထည့်ပြီး`;
  renderSticker();
}

function renderSticker() {
  applyStickerSettings();
  const item = getSelectedStock();
  if (!item) {
    els.labelCode.textContent = "No stock selected";
    els.labelBarcode.innerHTML = "";
    els.labelDescription.textContent = "Stock ထည့်ပြီး sticker ထုတ်ပါ";
    els.labelPrice.textContent = "Sale Price";
    els.labelPrice.hidden = stickerSettings.showPrice !== "yes";
    renderPrintArea();
    return;
  }

  els.labelCode.textContent = item.productCode;
  els.labelBarcode.innerHTML = barcodeSvg(item.productCode);
  els.labelDescription.textContent = stickerDescription(item);
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
    editStockPhotoDraft = null;
    els.editStockPhotoInput.value = "";
    els.stockEditForm.reset();
  }
}

function showActionNotice({ type = "success", eyebrow = "Cashier", title, message, details = [] }) {
  if (!els.actionNoticeModal) return;
  const icons = {
    success: "circle-check",
    warning: "triangle-alert",
    error: "circle-alert",
    info: "info",
  };
  els.actionNoticeModal.dataset.noticeType = type;
  els.actionNoticeIcon.innerHTML = lucideMarkup(icons[type] || icons.info);
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
    ["Customer Name", beforeSale.customerName, sale.customerName],
    ["Customer Phone", beforeSale.customerPhone, sale.customerPhone],
    ["Customer Address", beforeSale.customerAddress, sale.customerAddress],
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

async function addStock(form) {
  if (!hasPermission("stock")) return;
  const submitButton = form.querySelector('button[type="submit"]');
  const productionTimestamp = new Date().toISOString();
  const mode = form.stockMode.value || "floral";
  const productCode = normalizeCode(form.productCode.value);
  const existingItem = editingStockId ? state.stock.find((item) => item.id === editingStockId) : null;
  const duplicateItem = state.stock.find((item) => item.productCode === productCode && item.id !== editingStockId);

  if (duplicateItem && !(mode === "sku" && duplicateItem.itemType === "sku" && !editingStockId)) {
    els.stockStatus.textContent = "Code duplicate ဖြစ်နေသည်";
    return;
  }
  if (mode === "floral" && !existingItem && !stockPhotoDraft) {
    els.stockStatus.textContent = "ပန်းစည်းဓာတ်ပုံရိုက်ပြီးမှ Stock သိမ်းပါ";
    els.stockPhotoInput.focus();
    return;
  }

  const isCashDenomination = mode === "sku" && String(form.category.value || "").trim() === "ငွေသား";
  const quantity = mode === "sku" ? (isCashDenomination ? 0 : Math.max(1, Number(form.quantity.value || 1))) : 1;
  const isCashBouquet =
    mode === "floral" &&
    isMoneyBouquetCategory(form.category.value);
  const isCashFloatTracked =
    isCashBouquet && normalizeDateValue(form.productionDate.value) >= CASH_FLOAT_START_DATE;
  const cashValue = isCashBouquet ? Number(form.cashValue.value || 0) : 0;
  const unitCost = cashValue;
  const florist = mode === "sku" ? "" : form.florist.value;
  const availableCashFloat = cashFloatAvailableBalance(existingItem?.id || "");
  if (isCashBouquet && cashValue <= 0) {
    els.stockStatus.textContent = "ပန်းစည်းထဲထည့်သည့် ငွေသားပမာဏထည့်ပါ";
    form.cashValue.focus();
    return;
  }
  if (isCashFloatTracked && cashValue > availableCashFloat) {
    els.stockStatus.textContent = `Production Cash Float မလုံလောက်ပါ — လက်ကျန် ${money(availableCashFloat)}`;
    form.cashValue.focus();
    return;
  }
  if (mode === "sku" && duplicateItem) {
    duplicateItem.itemType = "sku";
    duplicateItem.productionDate = normalizeDateValue(form.productionDate.value);
    duplicateItem.description = form.description.value.trim();
    duplicateItem.category = form.category.value;
    duplicateItem.subCategory = form.subCategory.value;
    duplicateItem.paperColor = "-";
    duplicateItem.unitCost = unitCost;
    duplicateItem.productionCost = unitCost;
    duplicateItem.salePrice = Number(form.salePrice.value || duplicateItem.salePrice || 0);
    duplicateItem.florist = "";
    duplicateItem.inventoryLocation = form.inventoryLocation.value === "pending" ? "pending" : "shop";
    duplicateItem.quantityTotal = isCashDenomination ? 0 : Number(duplicateItem.quantityTotal || 0) + quantity;
    duplicateItem.quantityAvailable = isCashDenomination ? 0 : Number(duplicateItem.quantityAvailable || 0) + quantity;
    duplicateItem.status = isCashDenomination || duplicateItem.quantityAvailable > 0 ? "available" : "sold";
    duplicateItem.trackQuantity = !isCashDenomination;
    duplicateItem.lastStockEntryAt = productionTimestamp;
    duplicateItem.updatedAt = productionTimestamp;
    selectedStockId = duplicateItem.id;
    saveState();
    form.reset();
    form.stockMode.value = "sku";
    form.productionDate.value = today;
    form.quantity.value = "1";
    showSkuRestockHint(null);
    renderStockEntryMode();
    renderDropdowns();
    els.stockStatus.textContent = isCashDenomination
      ? `${duplicateItem.productCode} ကို Non-stock ငွေသား denomination အဖြစ်သိမ်းပြီး`
      : `${duplicateItem.productCode} restock +${quantity} သိမ်းပြီး`;
    renderAll();
    showActionNotice({
      type: "success",
      eyebrow: "Stock Record",
      title: "Stock ထည့်ပြီးပါပြီ",
      message: isCashDenomination
        ? `${duplicateItem.productCode} ကို အရေအတွက်မကန့်သတ်သော ငွေသား denomination အဖြစ်သိမ်းပြီးပါပြီ။`
        : `${duplicateItem.productCode} ကို ${quantity} ခု ထပ်ဖြည့်ပြီးပါပြီ။`,
      details: [
        duplicateItem.description || "Description မရှိပါ",
        isCashDenomination ? "Non-stock · Voucher quantity ကိုသာတွက်မည်" : `လက်ကျန်စုစုပေါင်း: ${duplicateItem.quantityAvailable || 0} ခု`,
        "Cloud ကို အလိုအလျောက် Sync လုပ်နေပါသည်",
      ],
    });
    return;
  }

  const item = existingItem || {
    id: uid("stock"),
    status: "available",
    createdAt: productionTimestamp,
    productionStartedAt: productionTimestamp,
  };

  let uploadedPhoto = existingItem?.photo || null;
  if (mode === "floral" && stockPhotoDraft) {
    submitButton.disabled = true;
    els.stockStatus.textContent = "Photo upload တင်နေပါတယ်…";
    try {
      uploadedPhoto = await uploadStockPhoto(stockPhotoDraft, item.id, productCode);
    } catch (error) {
      submitButton.disabled = false;
      els.stockStatus.textContent = error?.message || "Photo upload မရပါ။ Stock မသိမ်းရသေးပါ";
      return;
    }
  }

  Object.assign(item, {
    itemType: mode,
    productCode,
    productionDate: normalizeDateValue(form.productionDate.value),
    description: form.description.value.trim(),
    category: form.category.value,
    subCategory: form.subCategory.value,
    paperColor: mode === "sku" ? "-" : form.paperColor.value.trim(),
    productionCost: unitCost,
    unitCost,
    cashValue,
    salePrice: Number(form.salePrice.value || 0),
    florist,
    inventoryLocation: form.inventoryLocation.value === "pending" ? "pending" : "shop",
    createdBy: item.createdBy || currentStaff()?.name || "Production",
    quantityTotal: mode === "sku" ? quantity : 1,
    quantityAvailable: mode === "sku" ? quantity : 1,
    status: mode === "sku" ? (isCashDenomination || quantity > 0 ? "available" : "sold") : item.status || "available",
    trackQuantity: mode === "sku" ? !isCashDenomination : undefined,
    photo: mode === "floral" ? uploadedPhoto : null,
  });
  if (existingItem) syncSaleCostsForStock(item.id);

  if (!existingItem) state.stock.unshift(item);
  selectedStockId = item.id;
  editingStockId = "";
  saveState();
  stockPhotoDraft = null;
  els.stockPhotoInput.value = "";
  form.reset();
  form.stockMode.value = mode;
  form.productionDate.value = today;
  form.quantity.value = "1";
  showSkuRestockHint(null);
  renderStockEntryMode();
  renderDropdowns();
  els.stockStatus.textContent = `${item.productCode} ${existingItem ? "ပြင်ပြီး" : "သိမ်းပြီး"}`;
  submitButton.disabled = false;
  renderStockPhotoDraft();
  renderAll();
  showActionNotice({
    type: "success",
    eyebrow: "Stock Record",
    title: existingItem ? "Stock ပြင်ပြီးပါပြီ" : "Stock ထည့်ပြီးပါပြီ",
    message: `${item.productCode} ကို အောင်မြင်စွာ ${existingItem ? "ပြင်ပြီး" : "သိမ်းပြီး"}ပါပြီ။`,
    details: [
      item.description || "Description မရှိပါ",
      `Production စတင်ချိန်: ${productionTimestampText(item)}`,
      item.itemType === "sku"
        ? isCashInventoryItem(item)
          ? "Non-stock · အရေအတွက်မကန့်သတ်ပါ"
          : `အရေအတွက်: ${item.quantityAvailable || 0} ခု`
        : Number(item.cashValue || 0) > 0
          ? isCashFloatTracked
            ? `ပန်းစည်းထဲငွေသား: ${money(item.cashValue)} · Float လက်ကျန်: ${money(cashFloatAvailableBalance())}`
            : `ပန်းစည်းထဲငွေသား: ${money(item.cashValue)}`
          : `ရောင်းဈေး: ${money(item.salePrice)}`,
      "Cloud ကို အလိုအလျောက် Sync လုပ်နေပါသည်",
    ],
  });
}

function editStock(id) {
  if (!hasPermission("stock")) return;
  const item = state.stock.find((stockItem) => stockItem.id === id);
  if (!item) return;

  editingStockId = id;
  editStockPhotoDraft = null;
  renderStockEditCategoryOptions(item.category, item.subCategory || "");
  els.stockEditForm.productCode.value = item.productCode;
  els.stockEditForm.productionDate.value = item.productionDate;
  els.stockEditForm.inventoryLocation.value = item.inventoryLocation === "pending" ? "pending" : "shop";
  els.stockEditForm.description.value = item.description;
  els.stockEditForm.paperColor.value = item.paperColor;
  els.stockEditForm.cashValue.value = Number(item.cashValue || 0) || "";
  els.stockEditForm.salePrice.value = item.salePrice || "";
  els.stockEditForm.florist.value = item.florist;
  els.stockEditForm.paperColor.required = item.itemType !== "sku";
  els.stockEditForm.florist.required = item.itemType !== "sku";
  renderEditStockCashValueField();
  renderEditStockPhotoDraft();
  els.stockStatus.textContent = `${item.productCode} ပြင်နေသည်`;
  openModal(els.stockEditModal);
  els.stockEditForm.productCode.focus();
}

async function saveStockEdit(form) {
  if (!hasPermission("stock") || !editingStockId) return;
  const item = state.stock.find((stockItem) => stockItem.id === editingStockId);
  if (!item) return;

  const productCode = normalizeCode(form.productCode.value);
  if (state.stock.some((stockItem) => stockItem.productCode === productCode && stockItem.id !== editingStockId)) {
    els.stockStatus.textContent = "Code duplicate ဖြစ်နေသည်";
    return;
  }

  const isCashBouquet =
    item.itemType !== "sku" &&
    isMoneyBouquetCategory(form.category.value);
  const isCashFloatTracked =
    isCashBouquet && normalizeDateValue(form.productionDate.value) >= CASH_FLOAT_START_DATE;
  const cashValue = isCashBouquet ? Number(form.cashValue.value || 0) : 0;
  const florist = item.itemType === "sku" ? "" : form.florist.value;
  const availableCashFloat = cashFloatAvailableBalance(item.id);
  if (isCashBouquet && cashValue <= 0) {
    els.stockStatus.textContent = "ပန်းစည်းထဲထည့်သည့် ငွေသားပမာဏထည့်ပါ";
    form.cashValue.focus();
    return;
  }
  if (isCashFloatTracked && cashValue > availableCashFloat) {
    els.stockStatus.textContent = `Production Cash Float မလုံလောက်ပါ — လက်ကျန် ${money(availableCashFloat)}`;
    form.cashValue.focus();
    return;
  }

  const previousPhoto = item.photo || null;
  let nextPhoto = previousPhoto;
  const submitButton = form.querySelector('button[type="submit"]');
  if (item.itemType !== "sku" && editStockPhotoDraft?.blob) {
    submitButton.disabled = true;
    els.stockStatus.textContent = "Photo အသစ် upload တင်နေပါတယ်…";
    try {
      nextPhoto = await uploadStockPhoto(editStockPhotoDraft, item.id, productCode);
    } catch (error) {
      submitButton.disabled = false;
      els.stockStatus.textContent = error?.message || "Photo upload မရပါ။ ပြင်ဆင်ချက်မသိမ်းရသေးပါ";
      return;
    }
  } else if (editStockPhotoDraft?.remove) {
    nextPhoto = null;
  }

  Object.assign(item, {
    productCode,
    productionDate: normalizeDateValue(form.productionDate.value),
    description: form.description.value.trim(),
    category: form.category.value,
    subCategory: form.subCategory.value,
    paperColor: item.itemType === "sku" ? "-" : form.paperColor.value.trim(),
    productionCost: cashValue,
    unitCost: cashValue,
    cashValue,
    salePrice: Number(form.salePrice.value || 0),
    florist,
    inventoryLocation: form.inventoryLocation.value === "pending" ? "pending" : "shop",
    photo: item.itemType === "sku" ? null : nextPhoto,
  });
  if (isCashInventoryItem(item)) {
    item.quantityTotal = 0;
    item.quantityAvailable = 0;
    item.status = "available";
    item.trackQuantity = false;
  }
  syncSaleCostsForStock(item.id);

  selectedStockId = item.id;
  editingStockId = "";
  editStockPhotoDraft = null;
  saveState();
  closeModal(els.stockEditModal);
  submitButton.disabled = false;
  if (previousPhoto?.key && previousPhoto.key !== nextPhoto?.key) {
    deleteStockPhoto(previousPhoto).catch((error) => console.warn("Old stock photo cleanup failed", error));
  }
  els.stockStatus.textContent = `${item.productCode} ပြင်ပြီး`;
  renderAll();
  showActionNotice({
    type: "success",
    eyebrow: "Stock Record",
    title: "Stock ပြင်ပြီးပါပြီ",
    message: `${item.productCode} ရဲ့ အချက်အလက်များကို သိမ်းပြီးပါပြီ။`,
    details: [item.description || "Description မရှိပါ", "Cloud ကို အလိုအလျောက် Sync လုပ်နေပါသည်"],
  });
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

function stockUnitCost(stockItem) {
  const bouquetCash = Number(stockItem?.cashValue || 0);
  if (bouquetCash > 0) return bouquetCash;
  const isLegacyMoneyBouquet = stockItem?.itemType !== "sku" && isMoneyBouquetCategory(stockItem?.category);
  return isLegacyMoneyBouquet ? Number(stockItem?.productionCost || stockItem?.unitCost || 0) : 0;
}

function saleStockUnitCost(stockItem) {
  if (isCashInventoryItem(stockItem)) {
    return Math.max(0, Number(stockItem?.unitCost || stockItem?.productionCost || stockItem?.salePrice || 0));
  }
  return stockUnitCost(stockItem);
}

function savedSaleItemUnitCost(item) {
  const quantity = Math.max(1, Number(item?.quantity || 1));
  const pendingBouquetCash = Math.max(0, Number(item?.pendingBouquetCash || 0));
  if (pendingBouquetCash) return pendingBouquetCash;
  const savedUnitCost = Math.max(0, Number(item?.unitCost || 0));
  if (savedUnitCost) return savedUnitCost;
  return Math.max(0, Number(item?.cost || 0)) / quantity;
}

function resolvedSaleItemCostState(item, stockItem) {
  const stockCost = stockItem ? saleStockUnitCost(stockItem) : 0;
  const pendingCost = savedSaleItemUnitCost(item);
  const unitCost = stockCost > 0 ? stockCost : pendingCost;
  return {
    unitCost,
    pendingBouquetCash: pendingCost,
    costSource: stockCost > 0 ? "stock" : unitCost > 0 ? "pending-cash" : stockItem ? "stock" : "missing",
  };
}

function buildStockCostLookup(stockItems) {
  const byId = new Map();
  const byCode = new Map();
  const firstById = new Map();
  const firstByCode = new Map();
  (stockItems || []).forEach((item) => {
    const code = normalizeCode(item.productCode);
    byId.set(item.id, item);
    if (code) byCode.set(code, item);
    // Preserve find()'s first-match semantics for legacy duplicate identifiers.
    if (!firstById.has(item.id)) firstById.set(item.id, item);
    if (!firstByCode.has(code)) firstByCode.set(code, item);
  });
  return { byId, byCode, firstById, firstByCode };
}

function repairSaleItemCostsFromStock(items, stockItems = state.stock, lookup = buildStockCostLookup(stockItems)) {
  const stockById = lookup.byId;
  const stockByCode = lookup.byCode;
  let changed = false;
  (items || []).forEach((item) => {
    const stockItem = (item.stockId && stockById.get(item.stockId)) || stockByCode.get(normalizeCode(item.productCode));
    const resolved = resolvedSaleItemCostState(item, stockItem);
    const unitCost = resolved.unitCost;
    const quantity = Math.max(1, Number(item.quantity || 1));
    const totalCost = unitCost * quantity;
    const costSource = resolved.costSource;
    const pendingBouquetCash = costSource === "pending-cash" ? unitCost : Math.max(0, Number(item.pendingBouquetCash || 0));
    if (
      Number(item.unitCost || 0) === unitCost &&
      Number(item.cost || 0) === totalCost &&
      item.costSource === costSource &&
      Number(item.pendingBouquetCash || 0) === pendingBouquetCash
    ) return;
    item.unitCost = unitCost;
    item.cost = totalCost;
    item.costSource = costSource;
    item.pendingBouquetCash = pendingBouquetCash;
    changed = true;
  });
  return changed;
}

function saleItemCostLabel(item) {
  const source = item.costSource || (item.stockId ? "stock" : Number(item.cost || 0) ? "estimated" : "missing");
  if (source === "stock") return `<span class="cost-source actual">Actual</span>`;
  if (source === "pending-cash") return `<span class="cost-source estimated">Bouquet Cash</span>`;
  if (source === "estimated") return `<span class="cost-source estimated">Estimated</span>`;
  return `<span class="cost-source missing">No cost</span>`;
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
                  <small>${item.itemType === "sku" ? isCashInventoryItem(item) ? `Non-stock • ${money(item.salePrice)}` : `Qty ${escapeHtml(item.quantityAvailable || 0)} • ${money(item.salePrice)}` : escapeHtml(item.status || "available")}</small>
                </button>
              `
            )
            .join("")}
        </div>
      `
      : `<span class="danger-text">ဒီ Product Code / SKU ကို stock ထဲမတွေ့ပါ။ မရှိသေးတဲ့ item ဆို Description, Amount, Cost နဲ့ manual ထည့်ပါ။</span>`;
    return;
  }

  if (!isShopInventoryItem(stockItem)) {
    els.stockLookupDetails.innerHTML = `<span class="danger-text"><strong>${escapeHtml(stockItem.productCode)}</strong> က ဆိုင်ထဲမရောက်သေးသော Inventory မှာရှိနေပါတယ်။ Inventory စာမျက်နှာကနေ ဆိုင်အရောင်း Inventory သို့ အရင်ရွှေ့ပါ။</span>`;
    return;
  }

  if (!Number(els.saleItemPrice.value || 0) && stockItem.salePrice) {
    els.saleItemPrice.value = stockItem.salePrice;
  }
  const unitCost = saleStockUnitCost(stockItem);
  if (!Number(els.saleItemCost.value || 0) && unitCost) {
    els.saleItemCost.value = unitCost;
  }
  if (els.saleRequiresCode) els.saleRequiresCode.checked = true;
  if (!els.manualDescription.value) {
    els.manualDescription.value = stockItem.description || "";
  }
  els.stockLookupDetails.innerHTML = `
    ${stockItem.photo?.key ? `<button class="stock-lookup-photo" type="button" data-open-stock-photo="${escapeHtml(stockItem.id)}"><img src="${escapeHtml(stockPhotoUrl(stockItem.photo))}" alt="${escapeHtml(stockItem.productCode)} ပန်းစည်းပုံ" /></button>` : ""}
    <span class="stock-lookup-line">
      <strong>${escapeHtml(stockItem.productCode)}</strong>
      <span>${escapeHtml(stockItem.description || "-")}</span>
      ${
        stockItem.itemType === "sku"
          ? isCashInventoryItem(stockItem)
            ? `<span>Non-stock · အရေအတွက်မကန့်သတ်ပါ</span><span>Price: ${money(stockItem.salePrice)}</span><span>Cost: ${money(unitCost)}</span>`
            : `<span>Available: ${escapeHtml(stockItem.quantityAvailable || 0)}</span><span>Price: ${money(stockItem.salePrice)}</span><span>Cost: ${money(unitCost)}</span>`
          : `<span>Paper: ${escapeHtml(stockItem.paperColor || "-")}</span><span>Status: ${escapeHtml(stockItem.status || "available")}</span><span>Cost: ${money(unitCost)}</span>`
      }
    </span>
  `;
}

function clearSaleItemInputs() {
  editingSaleItemId = "";
  els.saleItemType.value = "stock";
  els.saleProductCode.value = "";
  els.manualDescription.value = "";
  els.saleItemQty.value = "1";
  els.saleItemPrice.value = "0";
  els.saleItemCost.value = "0";
  if (els.saleRequiresCode) els.saleRequiresCode.checked = false;
  setButtonIconLabel(els.addSaleItemButton, "plus", "Item ထည့်မယ်");
  if (els.cancelSaleItemEditButton) els.cancelSaleItemEditButton.hidden = true;
  renderSaleItemMode();
}

function upsertSaleItem(item) {
  const index = editingSaleItemId ? saleItems.findIndex((entry) => entry.id === editingSaleItemId) : -1;
  if (index >= 0) saleItems[index] = item;
  else saleItems.push(item);
}

function editSaleItem(id) {
  const item = saleItems.find((entry) => entry.id === id);
  if (!item) return;
  editingSaleItemId = id;
  els.saleItemType.value = item.type === "sku_stock" ? "sku" : item.type === "manual" ? "manual" : "stock";
  els.saleProductCode.value = item.productCode || "";
  els.manualDescription.value = item.description || "";
  els.saleItemQty.value = Math.max(1, Number(item.quantity || 1));
  els.saleItemPrice.value = Number(item.unitPrice ?? (Number(item.price || 0) / Math.max(1, Number(item.quantity || 1)))) || 0;
  els.saleItemCost.value = Number(item.unitCost ?? (Number(item.cost || 0) / Math.max(1, Number(item.quantity || 1)))) || 0;
  if (els.saleRequiresCode) els.saleRequiresCode.checked = saleItemRequiresCode(item);
  setButtonIconLabel(els.addSaleItemButton, "check", "Item ပြင်ပြီးသိမ်းမယ်");
  if (els.cancelSaleItemEditButton) els.cancelSaleItemEditButton.hidden = false;
  renderSaleItemMode();
  els.saleStatus.textContent = `${item.productCode || item.description || "Item"} ပြင်နေသည်`;
  els.manualDescription.focus();
}

function originalSavedSaleItem(itemId) {
  if (!editingSaleId) return null;
  return state.sales.find((sale) => sale.id === editingSaleId)?.items?.find((item) => item.id === itemId) || null;
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
  const wasEditing = Boolean(editingSaleItemId);
  const productCode = normalizeCode(els.saleProductCode.value);
  const stockItem = productCode ? state.stock.find((item) => item.productCode === productCode) : null;
  const description = els.manualDescription.value.trim();
  const price = Number(els.saleItemPrice.value || 0);
  const unitCostInput = Math.max(0, Number(els.saleItemCost.value || 0));
  const quantity = Math.max(1, Number(els.saleItemQty.value || 1));
  const stockCost = stockItem ? saleStockUnitCost(stockItem) : 0;
  const resolvedUnitCost = stockCost > 0 ? stockCost : unitCostInput;
  const editedItem = editingSaleItemId ? saleItems.find((item) => item.id === editingSaleItemId) : null;
  const pendingBouquetCash = stockCost > 0
    ? Math.max(0, Number(editedItem?.pendingBouquetCash || 0))
    : unitCostInput;
  const resolvedCostSource = stockCost > 0 ? "stock" : unitCostInput > 0 ? "pending-cash" : stockItem ? "stock" : "missing";
  // For manually entered cashier items, the explicit checkbox is authoritative.
  // Stock/product-code entries still require a code automatically.
  const requiresCode = Boolean(stockItem || productCode || els.saleRequiresCode?.checked);
  const itemId = editingSaleItemId || uid("item");

  if (stockItem && !isShopInventoryItem(stockItem)) {
    els.saleStatus.textContent = "ဒီ Product Code က ဆိုင်ထဲမရောက်သေးပါ။ Inventory မှာ ဆိုင်အရောင်းသို့ အရင်ရွှေ့ပါ";
    return;
  }

  if (!price) {
    els.saleStatus.textContent = "Item amount ထည့်ပါ";
    return;
  }

  if (stockItem?.itemType === "sku") {
    const originalItem = originalSavedSaleItem(itemId);
    const availableQuantity = Number(stockItem.quantityAvailable || 0) +
      (originalItem?.stockId === stockItem.id ? Number(originalItem.quantity || 0) : 0);
    if (isQuantityTrackedSku(stockItem) && availableQuantity < quantity) {
      els.saleStatus.textContent = `SKU ပြင်နိုင်တဲ့အရေအတွက် ${availableQuantity} ခုပဲရှိပါတယ်`;
      return;
    }

    upsertSaleItem({
      id: itemId,
      type: "sku_stock",
      stockId: stockItem.id,
      productCode,
      description: description || stockItem.description || productCode,
      quantity,
      price: price * quantity,
      unitPrice: price,
      unitCost: resolvedUnitCost,
      cost: resolvedUnitCost * quantity,
      pendingBouquetCash,
      costSource: resolvedCostSource,
      requiresCode: true,
    });
  } else if (stockItem) {
    const alreadyAdded = saleItems.some((item) => item.id !== editingSaleItemId && item.productCode === productCode);
    const soldToCurrentVoucher = editingSaleId && stockItem.saleId === editingSaleId;
    if ((stockItem.status === "sold" && !soldToCurrentVoucher) || alreadyAdded) {
      els.saleStatus.textContent = "ဒီ Product Code က ရောင်းပြီးသား / voucher ထဲပါပြီးသားဖြစ်သည်";
      return;
    }

    upsertSaleItem({
      id: itemId,
      type: "stock",
      stockId: stockItem.id,
      productCode,
      description: description || stockItem.description || productCode,
      quantity,
      price: price * quantity,
      unitPrice: price,
      unitCost: resolvedUnitCost,
      cost: resolvedUnitCost * quantity,
      pendingBouquetCash,
      costSource: resolvedCostSource,
      requiresCode: true,
    });
  } else {
    if (!description) {
      els.saleStatus.textContent = productCode ? "ဒီ Code ကိုမတွေ့ပါ။ Manual အဖြစ်ထည့်ရန် Description ထည့်ပါ" : "Description ထည့်ပါ";
      return;
    }

    upsertSaleItem({
      id: itemId,
      type: "manual",
      stockId: "",
      productCode,
      description,
      quantity,
      price: price * quantity,
      unitPrice: price,
      unitCost: unitCostInput,
      cost: unitCostInput * quantity,
      pendingBouquetCash: unitCostInput,
      costSource: unitCostInput ? "pending-cash" : "missing",
      requiresCode,
    });
  }

  clearSaleItemInputs();
  els.saleStatus.textContent = wasEditing ? "Item ပြင်ပြီး" : "Item ထည့်ပြီး";
  renderSaleItems();
  setSaleStep("items");
}

function removeSaleItem(id) {
  saleItems = saleItems.filter((item) => item.id !== id);
  if (editingSaleItemId === id) clearSaleItemInputs();
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
    els.saleStatus.textContent = "ဒီ Product Code ကို Stock ထဲမတွေ့ပါ။ Stock ထဲအရင်ထည့်ပါ";
    return;
  }
  if (!isShopInventoryItem(stockItem)) {
    els.saleStatus.textContent = "ဒီ Product Code က ဆိုင်ထဲမရောက်သေးပါ။ Inventory မှာ ဆိုင်အရောင်းသို့ အရင်ရွှေ့ပါ";
    return;
  }

  const isSku = stockItem.itemType === "sku";
  const quantity = Math.max(1, Number(item.quantity || 1));
  const soldToCurrentVoucher = editingSaleId && stockItem.saleId === editingSaleId;
  const usedByOtherItem = saleItems.some(
    (saleItem) => saleItem.id !== itemId && (saleItem.stockId === stockItem.id || saleItem.productCode === productCode)
  );
  if (!isSku && ((stockItem.status === "sold" && !soldToCurrentVoucher) || usedByOtherItem)) {
    els.saleStatus.textContent = "ဒီ Product Code က ရောင်းပြီးသား / voucher ထဲပါပြီးသားဖြစ်သည်";
    return;
  }
  if (isQuantityTrackedSku(stockItem) && Number(stockItem.quantityAvailable || 0) < quantity) {
    els.saleStatus.textContent = `SKU လက်ကျန် ${stockItem.quantityAvailable || 0} ခုပဲရှိပါတယ်`;
    return;
  }

  item.type = isSku ? "sku_stock" : "stock";
  item.stockId = stockItem.id;
  item.productCode = productCode;
  item.description = stockItem.description || item.description;
  const resolvedCost = resolvedSaleItemCostState(item, stockItem);
  item.unitCost = resolvedCost.unitCost;
  item.cost = resolvedCost.unitCost * quantity;
  item.pendingBouquetCash = resolvedCost.pendingBouquetCash;
  item.costSource = resolvedCost.costSource;
  item.requiresCode = true;
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
    customerName: els.saleForm.elements.customerName.value.trim(),
    customerPhone: els.saleForm.elements.customerPhone.value.trim(),
    customerAddress: els.saleForm.elements.customerAddress.value.trim(),
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
      els.saleForm.elements.customerName.value.trim() ||
      els.saleForm.elements.customerPhone.value.trim() ||
      els.saleForm.elements.customerAddress.value.trim() ||
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
  repairSaleItemCostsFromStock(saleItems);
  salePaymentDraft = (draft.paymentLines || []).map((payment) => ({ ...payment }));
  els.saleForm.saleDate.value = draft.saleDate || today;
  els.saleForm.voucherNumber.value = draft.voucherNumber || "";
  els.saleForm.salePerson.value = draft.salePerson || "";
  els.saleForm.elements.customerName.value = draft.customerName || "";
  els.saleForm.elements.customerPhone.value = draft.customerPhone || "";
  els.saleForm.elements.customerAddress.value = draft.customerAddress || "";
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
              <button class="icon-button danger" type="button" data-delete-draft="${draft.id}" title="Delete draft">${lucideMarkup("trash-2")}</button>
            </div>
          `;
        })
        .join("")
    : `<div class="empty compact-empty">Hold ထားတဲ့ voucher မရှိသေးပါ</div>`;
}

function renderSaleItems() {
  const total = saleItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const totalCost = saleItems.reduce((sum, item) => sum + Number(item.cost || 0), 0);
  const existingSale = editingSaleId ? state.sales.find((sale) => sale.id === editingSaleId) : null;
  const alreadyPaid = existingSale ? salePaid(existingSale) : 0;
  const received = pendingSalePaymentTotal({ includeCurrent: true });
  const balanceAfter = Math.max(0, total - alreadyPaid - received);
  els.saleTotalPreview.textContent = money(total);
  els.saleTableTotal.textContent = money(total);
  els.saleCostTotal.textContent = money(totalCost);
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
            const needsCode = saleItemRequiresCode(item);
            const codeLabel = item.productCode
              ? `<strong>${escapeHtml(item.productCode)}</strong>`
              : needsCode
                ? `<span class="pending-code">Code Pending</span>`
                : `<span class="no-code-needed">Code မလို</span>`;
            return `
            <tr>
              <td>${index + 1}</td>
              <td>
                <div class="code-link-cell">
                  ${codeLabel}
                  ${
                    needsCode
                      ? `<div class="code-link-row">
                          <input value="${escapeHtml(codeValue)}" placeholder="Code ရရင်ထည့်" data-link-stock-code="${item.id}" />
                          <button class="button secondary tiny-button" type="button" data-link-sale-item="${item.id}">Link</button>
                        </div>`
                      : ""
                  }
                </div>
              </td>
              <td>${escapeHtml(item.description)}</td>
              <td>${item.quantity || 1}</td>
              <td><strong>${money(item.price)}</strong></td>
              <td><strong>${money(item.cost)}</strong><br>${saleItemCostLabel(item)}</td>
              <td>
                <div class="row-actions">
                  <button class="button secondary tiny-button" type="button" data-edit-sale-item="${item.id}">Edit</button>
                  <button class="icon-button danger" type="button" data-remove-sale-item="${item.id}" title="Remove item">${lucideMarkup("trash-2")}</button>
                </div>
              </td>
            </tr>
          `;
          }
        )
        .join("")
    : `<tr><td colspan="7"><div class="empty">Voucher item မထည့်ရသေးပါ</div></td></tr>`;
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
  const productionCost = saleItems.reduce((sum, item) => sum + saleItemCost(item), 0);
  const existingSale = editingSaleId ? state.sales.find((sale) => sale.id === editingSaleId) : null;
  const voucherUsageDate = normalizeDateValue(form.fulfillmentDate.value || form.saleDate.value);
  const voucherMmValue = voucherUsageDate >= CASH_FLOAT_START_DATE && voucherUsageDate <= today
    ? saleItems.reduce((sum, item) => sum + cashFloatVoucherItemValue(item), 0)
    : 0;
  const availableCashFloat = cashFloatAvailableBalance("", existingSale?.id || "");
  if (voucherMmValue > availableCashFloat) {
    setSaleStep("items");
    els.saleStatus.textContent = `Cash Float မလုံလောက်ပါ — MM အသုံး ${money(voucherMmValue)} · လက်ကျန် ${money(availableCashFloat)}`;
    showSaleNotice("warning", "Cash Float မလုံလောက်ပါ", `Voucher ထဲက MM အသုံး ${money(voucherMmValue)} ဖြစ်ပြီး လက်ကျန် ${money(availableCashFloat)} ပဲရှိပါတယ်`, [
      "Cash Float အသစ်ထည့်ပြီးမှ voucher ကိုသိမ်းပါ",
    ]);
    return;
  }
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
    customerName: form.customerName.value.trim(),
    customerPhone: form.customerPhone.value.trim(),
    customerAddress: form.customerAddress.value.trim(),
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
      kind: existingSale ? "balance" : "initial",
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

  loadSaleForEdit(sale);
}

function loadSaleForEdit(sale) {
  if (!hasPermission("sale") || !sale) return;
  editingSaleId = sale.id;
  activeSaleDraftId = "";
  saleItems = (sale.items || []).map((item) => ({ ...item }));
  repairSaleItemCostsFromStock(saleItems);
  salePaymentDraft = [];
  location.hash = "#sale";
  showView("sale");
  els.saleForm.saleDate.value = sale.saleDate || today;
  els.saleForm.voucherNumber.value = sale.voucherNumber || "";
  els.saleForm.salePerson.value = sale.salePerson || "";
  els.saleForm.elements.customerName.value = sale.customerName || "";
  els.saleForm.elements.customerPhone.value = sale.customerPhone || "";
  els.saleForm.elements.customerAddress.value = sale.customerAddress || "";
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
  const keyword = els.voucherHistorySearch.value.trim().toLowerCase();
  const selectedDate = els.voucherHistoryDate.value;
  const paymentTypeFilter = els.voucherHistoryPaymentType.value;
  const sortOrder = els.voucherHistorySort.value;
  const rows = [...state.sales]
    .filter(
      (sale) =>
        !selectedDate ||
        sale.saleDate === selectedDate ||
        (sale.payments || []).some((payment) => payment.paymentDate === selectedDate)
    )
    .filter((sale) => voucherMatchesPaymentType(sale, paymentTypeFilter, selectedDate))
    .filter((sale) => {
      const descriptions = (sale.items || []).map((item) => item.description).join(" ");
      const paymentMethods = (sale.payments || []).map((payment) => payment.paymentType).join(" ");
      const text = `${sale.voucherNumber} ${sale.salePerson} ${sale.customerName || ""} ${sale.customerPhone || ""} ${sale.customerAddress || ""} ${sale.saleDate} ${sale.fulfillmentDate} ${paymentMethods} ${fulfillmentMethodLabel(sale.fulfillmentMethod)} ${fulfillmentStatusLabel(sale.fulfillmentStatus)} ${descriptions}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => {
      if (sortOrder === "date-asc") return String(a.saleDate || "").localeCompare(String(b.saleDate || ""));
      if (sortOrder === "voucher-asc") return String(a.voucherNumber || "").localeCompare(String(b.voucherNumber || ""), undefined, { numeric: true });
      if (sortOrder === "voucher-desc") return String(b.voucherNumber || "").localeCompare(String(a.voucherNumber || ""), undefined, { numeric: true });
      if (sortOrder === "total-desc") return Number(b.totalPrice || 0) - Number(a.totalPrice || 0);
      if (sortOrder === "total-asc") return Number(a.totalPrice || 0) - Number(b.totalPrice || 0);
      if (sortOrder === "balance-desc") return saleBalance(b) - saleBalance(a);
      if (sortOrder === "balance-asc") return saleBalance(a) - saleBalance(b);
      return byDateDesc(a, b, "saleDate");
    });

  els.voucherHistoryTable.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const descriptions = renderVoucherItemSummary(sale.items || []);
          const paidTotal = salePaid(sale);
          const balance = saleBalance(sale);
          const paymentLines = (sale.payments || [])
            .map((payment) => `
              <div class="voucher-payment-line ${selectedDate && payment.paymentDate === selectedDate ? "is-selected-date" : ""}">
                <div class="voucher-payment-meta">
                  ${paymentKindBadge(payment, sale)}
                  <span>${escapeHtml(payment.paymentDate || sale.saleDate || "-")} · ${escapeHtml(payment.paymentType || "Cash")}</span>
                </div>
                <strong>${money(payment.amount)}</strong>
              </div>`)
            .join("");
          return `
            <tr>
              <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.salePerson || "-")}</span>${sale.customerName ? `<br><span class="muted">Customer: ${escapeHtml(sale.customerName)}${sale.customerPhone ? ` · ${escapeHtml(sale.customerPhone)}` : ""}</span>` : ""}</td>
              <td>${escapeHtml(sale.saleDate)}<br><span class="muted">Due: ${escapeHtml(sale.fulfillmentDate || sale.saleDate || "-")}</span></td>
              <td>${descriptions || "-"}</td>
              <td class="voucher-money-cell">
                <div class="voucher-money-summary">
                  <div><span>Total</span><strong>${money(sale.totalPrice)}</strong></div>
                  <div class="paid"><span>Paid</span><strong>${money(paidTotal)}</strong></div>
                  <div class="${balance > 0 ? "balance-due" : "balance-clear"}"><span>Balance</span><strong>${money(balance)}</strong></div>
                </div>
                <div class="voucher-payment-list">
                  <span class="voucher-payment-list-title">Received Payments</span>
                  ${paymentLines || `<span class="voucher-no-payment">Payment မရှိသေးပါ</span>`}
                </div>
                <span class="fulfillment-badge ${sale.fulfillmentStatus === "delivered" ? "delivered" : ""}">${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</span>
              </td>
              <td>
                <div class="row-actions">
                  <button class="button secondary" type="button" data-edit-voucher="${sale.id}">Edit</button>
                  <button class="icon-button danger" type="button" data-delete-voucher="${sale.id}" title="Delete voucher">${lucideMarkup("trash-2")}</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">ဒီရက်အတွက် Voucher မရှိသေးပါ</div></td></tr>`;
}

function voucherMatchesPaymentType(sale, paymentType, selectedDate = "") {
  if (!paymentType || paymentType === "all") return true;
  const payments = sale.payments || [];
  const matchingPayments = selectedDate
    ? payments.filter((payment) => payment.paymentDate === selectedDate)
    : payments;
  if (matchingPayments.some((payment) => payment.paymentType === paymentType)) return true;
  return !payments.length && sale.paymentType === paymentType;
}

function loadVoucherById(id) {
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  els.voucherSearch.value = sale.voucherNumber;
  loadSaleForEdit(sale);
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

function receivableDueState(sale) {
  const dueDate = fulfillmentDueDate(sale);
  if (dueDate < today) return "overdue";
  if (dueDate === today) return "today";
  return "upcoming";
}

function receivableDueLabel(sale) {
  const state = receivableDueState(sale);
  if (state === "overdue") return "ရက်ကျော်";
  if (state === "today") return "ဒီနေ့ပေးရန်";
  return "နောက်ရက်ပေးရန်";
}

function renderReceivables() {
  if (!els.receivablesTable) return;
  const outstandingSales = state.sales.filter((sale) => saleBalance(sale) > 0);
  const keyword = els.receivablesSearch.value.trim().toLowerCase();
  const selectedDate = els.receivablesDueDate.value;
  const dueStatus = els.receivablesStatus.value;
  const sortOrder = els.receivablesSort.value;

  const totalBalance = outstandingSales.reduce((sum, sale) => sum + saleBalance(sale), 0);
  els.receivablesTotal.textContent = money(totalBalance);
  els.receivablesCount.textContent = outstandingSales.length;
  els.receivablesOverdueCount.textContent = outstandingSales.filter((sale) => receivableDueState(sale) === "overdue").length;
  els.receivablesTodayCount.textContent = outstandingSales.filter((sale) => receivableDueState(sale) === "today").length;

  const rows = outstandingSales
    .filter((sale) => !selectedDate || fulfillmentDueDate(sale) === selectedDate)
    .filter((sale) => dueStatus === "all" || receivableDueState(sale) === dueStatus)
    .filter((sale) => {
      const descriptions = (sale.items || []).map((item) => item.description).join(" ");
      const text = `${sale.voucherNumber || ""} ${sale.salePerson || ""} ${sale.customerName || ""} ${sale.customerPhone || ""} ${sale.customerAddress || ""} ${descriptions}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => {
      if (sortOrder === "balance-desc") return saleBalance(b) - saleBalance(a);
      if (sortOrder === "voucher-asc") {
        return String(a.voucherNumber || "").localeCompare(String(b.voucherNumber || ""), undefined, { numeric: true });
      }
      return String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b)));
    });

  els.receivablesTable.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const dueState = receivableDueState(sale);
          return `
            <tr class="${dueState === "overdue" ? "overdue-row" : ""}">
              <td>
                <strong>${escapeHtml(fulfillmentDueDate(sale) || "-")}</strong><br>
                <span class="fulfillment-badge ${dueState === "overdue" ? "overdue" : dueState === "today" ? "" : "delivered"}">${escapeHtml(receivableDueLabel(sale))}</span>
                <br><span class="muted">${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))}</span>
              </td>
              <td>
                ${voucherPopupButton(sale)}<br>
                <span class="muted">Sale: ${escapeHtml(sale.salePerson || "-")}</span>
                ${sale.customerName ? `<br><span class="muted">Customer: ${escapeHtml(sale.customerName)}${sale.customerPhone ? ` · ${escapeHtml(sale.customerPhone)}` : ""}</span>` : ""}
              </td>
              <td>
                <span class="receivable-money-line"><span>Total</span><strong>${money(sale.totalPrice)}</strong></span>
                <span class="receivable-money-line"><span>Paid</span><strong>${money(salePaid(sale))}</strong></span>
              </td>
              <td><strong class="receivable-balance">${money(saleBalance(sale))}</strong></td>
              <td>
                ${hasPermission("sale") ? `<button class="button primary" type="button" data-open-receivable="${sale.id}">ငွေထပ်သွင်းရန်</button>` : `<span class="muted">View only</span>`}
              </td>
            </tr>`;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">ဒီ filter အတွက် ကျန်ငွေစာရင်းမရှိပါ</div></td></tr>`;
}

function renderReceivablePaymentModal(sale) {
  if (!sale || !els.receivablePaymentDetails) return;
  const balance = saleBalance(sale);
  const paymentRows = (sale.payments || [])
    .slice()
    .reverse()
    .map(
      (payment) => `
        <div class="voucher-payment-line">
          <div class="voucher-payment-meta">
            ${paymentKindBadge(payment, sale)}
            <span>${escapeHtml(payment.paymentDate || sale.saleDate || "-")} · ${escapeHtml(payment.paymentType || "Cash")}</span>
          </div>
          <strong>${money(payment.amount)}</strong>
        </div>`
    )
    .join("");
  els.receivablePaymentTitle.textContent = `${sale.voucherNumber || "-"} Payment`;
  els.receivablePaymentDetails.innerHTML = `
    <div class="voucher-lookup-heading">
      <strong>${escapeHtml(sale.voucherNumber || "-")}</strong>
      <span>${escapeHtml(sale.salePerson || "-")} · Due ${escapeHtml(fulfillmentDueDate(sale) || "-")} · ${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))}</span>
    </div>
    <div class="voucher-money-summary lookup-money-summary">
      <div><span>Total</span><strong>${money(sale.totalPrice)}</strong></div>
      <div class="paid"><span>Paid</span><strong>${money(salePaid(sale))}</strong></div>
      <div class="balance-due"><span>Balance</span><strong>${money(balance)}</strong></div>
    </div>
    <div class="voucher-payment-list receivable-payment-history">
      <span class="voucher-payment-list-title">Received Payment Records</span>
      ${paymentRows || `<span class="voucher-no-payment">Payment မရှိသေးပါ</span>`}
    </div>`;
}

function openReceivablePaymentModal(saleId) {
  if (!hasPermission("sale")) return;
  const sale = state.sales.find((item) => item.id === saleId);
  if (!sale || saleBalance(sale) <= 0) return;
  activeReceivableSaleId = sale.id;
  els.receivablePaymentForm.reset();
  els.receivablePaymentForm.elements.paymentDate.value = today;
  els.receivablePaymentForm.elements.paymentType.value = sale.payments?.at(-1)?.paymentType || "Cash";
  els.receivablePaymentForm.elements.amount.value = saleBalance(sale);
  els.receivablePaymentStatus.textContent = "";
  renderReceivablePaymentModal(sale);
  openModal(els.receivablePaymentModal);
  els.receivablePaymentForm.elements.amount.focus();
  els.receivablePaymentForm.elements.amount.select();
}

function saveReceivablePayment(event) {
  event.preventDefault();
  if (!hasPermission("sale")) return;
  const sale = state.sales.find((item) => item.id === activeReceivableSaleId);
  if (!sale) {
    els.receivablePaymentStatus.textContent = "Voucher မတွေ့ပါ";
    return;
  }
  const form = els.receivablePaymentForm;
  const amount = Number(form.elements.amount.value || 0);
  const balance = saleBalance(sale);
  if (amount <= 0) {
    els.receivablePaymentStatus.textContent = "Payment Amount ထည့်ပါ";
    form.elements.amount.focus();
    return;
  }
  if (amount > balance) {
    els.receivablePaymentStatus.textContent = `Payment Amount က ကျန်ငွေ ${money(balance)} ထက် မကျော်ရပါ`;
    form.elements.amount.focus();
    return;
  }

  const paymentDate = form.elements.paymentDate.value || today;
  const paymentType = form.elements.paymentType.value || "Cash";
  const previousFulfillmentStatus = sale.fulfillmentStatus;
  sale.payments = sale.payments || [];
  sale.payments.push({
    id: uid("payment"),
    paymentDate,
    paymentType,
    amount,
    note: "Follow-up payment",
    kind: "balance",
  });
  if (form.elements.fulfillmentStatus.value) {
    sale.fulfillmentStatus = form.elements.fulfillmentStatus.value;
  }
  sale.updatedAt = new Date().toISOString();
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
  closeModal(els.receivablePaymentModal);
  activeReceivableSaleId = "";
  renderAll();
  showSaleNotice("success", "ငွေထပ်သွင်းပြီးပါပြီ", `${sale.voucherNumber} မှာ ကျန်ငွေထပ်သွင်းပြီးပါပြီ`, details);
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
      const text = `${sale.voucherNumber} ${sale.salePerson} ${sale.customerName || ""} ${sale.customerPhone || ""} ${sale.customerAddress || ""} ${fulfillmentDueDate(sale)} ${fulfillmentMethodLabel(sale.fulfillmentMethod)} ${fulfillmentStatusLabel(sale.fulfillmentStatus)} ${descriptions}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b))));

  els.fulfillmentTable.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const itemSummary = (sale.items || [])
            .map((item) => `${escapeHtml(saleItemCodeText(item))} - ${escapeHtml(item.description)}`)
            .join("<br>");
          const dueDate = fulfillmentDueDate(sale) || "-";
          const overdue = isFulfillmentOverdue(sale, selectedDate || today);
          return `
            <tr class="${overdue ? "overdue-row" : ""}">
              <td><strong>${escapeHtml(dueDate)}</strong><br><span class="muted">${escapeHtml(sale.saleDate || "-")} sale</span>${overdue ? `<br><span class="fulfillment-badge overdue">Overdue</span>` : ""}</td>
              <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.salePerson || "-")}</span>${sale.customerName ? `<br><span class="muted">Customer: ${escapeHtml(sale.customerName)}${sale.customerPhone ? ` · ${escapeHtml(sale.customerPhone)}` : ""}</span>` : ""}<br><span class="muted">${itemSummary || "-"}</span></td>
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

function girlfriendDayOrderRowHtml(sale) {
  const pendingCodeCount = pendingCodeItemsForSale(sale).length;
  const itemSummary = (sale.items || [])
    .map((item) => `${escapeHtml(saleItemCodeText(item))} - ${escapeHtml(item.description)} × ${escapeHtml(item.quantity || 1)}`)
    .join("<br>");
  return `
    <tr>
      <td>
        ${voucherPopupButton(sale)}<br>
        <span class="muted">${escapeHtml(sale.salePerson || "-")}</span>
      </td>
      <td>
        ${itemSummary || "-"}
        ${sale.note ? `<br><span class="muted">Note: ${escapeHtml(sale.note)}</span>` : ""}
      </td>
      <td>${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))}</td>
      <td>
        <div class="row-actions">
          ${
            pendingCodeCount
              ? `<button class="button primary" type="button" data-open-girlfriend-code-check="${sale.id}">Code Check (${pendingCodeCount})</button>`
              : `<span class="fulfillment-badge delivered">Code ပြည့်စုံ</span>`
          }
          <button class="button secondary" type="button" data-edit-voucher="${sale.id}">Edit</button>
        </div>
      </td>
    </tr>`;
}

function renderGirlfriendDayOrders() {
  if (!els.girlfriendDayPendingTable || !els.girlfriendDayCompletedTable) return;
  const keyword = (els.girlfriendDaySearch?.value || "").trim().toLowerCase();
  const orders = state.sales
    .filter((sale) => fulfillmentDueDate(sale) === NATIONAL_GIRLFRIEND_DAY_DATE)
    .filter((sale) => {
      const descriptions = (sale.items || []).map((item) => item.description).join(" ");
      const text = `${sale.voucherNumber || ""} ${sale.salePerson || ""} ${descriptions} ${sale.note || ""}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) =>
      String(a.voucherNumber || "").localeCompare(String(b.voucherNumber || ""), undefined, { numeric: true })
    );
  const pending = orders.filter((sale) => pendingCodeItemsForSale(sale).length > 0);
  const completed = orders.filter((sale) => pendingCodeItemsForSale(sale).length === 0);

  els.girlfriendDayTotalCount.textContent = orders.length;
  els.girlfriendDayPendingCount.textContent = pending.length;
  els.girlfriendDayCompletedCount.textContent = completed.length;
  els.girlfriendDayPendingPill.textContent = `${pending.length} Order`;
  els.girlfriendDayCompletedPill.textContent = `${completed.length} Order`;
  els.girlfriendDayPendingTable.innerHTML = pending.length
    ? pending.map(girlfriendDayOrderRowHtml).join("")
    : `<tr><td colspan="4"><div class="empty">Code Pending ရှိသော Aug 1 order မရှိပါ</div></td></tr>`;
  els.girlfriendDayCompletedTable.innerHTML = completed.length
    ? completed.map(girlfriendDayOrderRowHtml).join("")
    : `<tr><td colspan="4"><div class="empty">Code ပြည့်စုံသော Aug 1 order မရှိသေးပါ</div></td></tr>`;
}

function updateFulfillmentStatus(id, status) {
  const sale = state.sales.find((item) => item.id === id);
  if (!sale) return;
  sale.fulfillmentStatus = status;
  saveState();
  renderAll();
}

function codeCheckRows() {
  return state.sales.flatMap((sale) =>
    pendingCodeItemsForSale(sale).map((item) => ({
      sale,
      item,
    }))
  );
}

function renderCodeCheckTable() {
  if (!els.codeCheckTable) return;
  const keyword = (els.codeCheckSearch?.value || "").trim().toLowerCase();
  const rows = codeCheckRows()
    .filter(({ sale, item }) => {
      const text = `${sale.voucherNumber} ${sale.salePerson} ${sale.saleDate} ${sale.fulfillmentDate} ${item.description}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => {
      const dueCompare = String(a.sale.fulfillmentDate || a.sale.saleDate || "").localeCompare(String(b.sale.fulfillmentDate || b.sale.saleDate || ""));
      if (dueCompare) return dueCompare;
      return String(a.sale.voucherNumber || "").localeCompare(String(b.sale.voucherNumber || ""));
    });

  els.codeCheckTable.innerHTML = rows.length
    ? rows
        .map(({ sale, item }) => {
          const rowId = `${sale.id}|${item.id}`;
          const suggestedCode = suggestedCodeFromDescription(item.description);
          return `
            <tr>
              <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.salePerson || "-")} • ${escapeHtml(sale.saleDate || "-")}</span></td>
              <td><span class="pending-code">Code Pending</span><br>${escapeHtml(item.description || "-")}<br><span class="muted">Qty ${escapeHtml(item.quantity || 1)} • ${money(item.price)}</span></td>
              <td>${escapeHtml(sale.fulfillmentDate || sale.saleDate || "-")}<br><span class="muted">${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))}</span></td>
              <td>
                <div class="code-check-action-cell">
                  <div class="code-link-row">
                    <input value="${escapeHtml(suggestedCode)}" placeholder="Product Code" data-code-check-input="${escapeHtml(rowId)}" />
                    <button class="button secondary tiny-button" type="button" data-code-check-link="${escapeHtml(rowId)}">Link</button>
                  </div>
                  <button class="button ghost tiny-button" type="button" data-code-not-required="${escapeHtml(rowId)}">Code မလို</button>
                </div>
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="4"><div class="empty">Code ထည့်ရန်ကျန်နေတဲ့ voucher မရှိပါ</div></td></tr>`;
}

function linkSavedSaleItemToStock(saleId, itemId, productCode) {
  if (!hasPermission("codecheck")) return;
  const sale = state.sales.find((entry) => entry.id === saleId);
  const item = sale?.items?.find((entry) => entry.id === itemId);
  const code = normalizeCode(productCode || "");
  if (!sale || !item || !code) return;

  const stockItem = state.stock.find((stock) => stock.productCode === code);
  if (!stockItem) {
    alert("ဒီ Product Code ကို Stock ထဲမတွေ့ပါ");
    return;
  }
  if (!isShopInventoryItem(stockItem)) {
    alert("ဒီ Product Code က ဆိုင်ထဲမရောက်သေးပါ။ Inventory မှာ ဆိုင်အရောင်းသို့ အရင်ရွှေ့ပါ");
    return;
  }

  const isSku = stockItem.itemType === "sku";
  const soldToOtherVoucher = !isSku && stockItem.status === "sold" && stockItem.saleId !== sale.id;
  const usedByOtherSaleItem =
    !isSku &&
    state.sales.some((otherSale) =>
      otherSale.id !== sale.id && (otherSale.items || []).some((otherItem) => otherItem.stockId === stockItem.id)
    );
  const usedInSameSale =
    !isSku && (sale.items || []).some((otherItem) => otherItem.id !== item.id && (otherItem.stockId === stockItem.id || otherItem.productCode === code));
  if (soldToOtherVoucher || usedByOtherSaleItem || usedInSameSale) {
    alert("ဒီ Product Code က ရောင်းပြီးသား / အခြား voucher ထဲပါပြီးသားဖြစ်သည်");
    return;
  }

  const quantity = Math.max(1, Number(item.quantity || 1));
  if (isQuantityTrackedSku(stockItem) && Number(stockItem.quantityAvailable || 0) < quantity) {
    alert(`SKU လက်ကျန် ${stockItem.quantityAvailable || 0} ခုပဲရှိပါတယ်`);
    return;
  }

  item.type = isSku ? "sku_stock" : "stock";
  item.stockId = stockItem.id;
  item.productCode = code;
  item.description = stockItem.description || item.description;
  const resolvedCost = resolvedSaleItemCostState(item, stockItem);
  item.unitCost = resolvedCost.unitCost;
  item.cost = resolvedCost.unitCost * quantity;
  item.pendingBouquetCash = resolvedCost.pendingBouquetCash;
  item.costSource = resolvedCost.costSource;
  item.requiresCode = true;
  recalculateSaleProductionCost(sale);
  sale.updatedAt = new Date().toISOString();

  if (isSku && !isCashInventoryItem(stockItem)) {
    stockItem.quantityAvailable = Math.max(0, Number(stockItem.quantityAvailable || 0) - quantity);
    stockItem.status = stockItem.quantityAvailable > 0 ? "available" : "sold";
  } else if (isSku) {
    stockItem.quantityAvailable = 0;
    stockItem.quantityTotal = 0;
    stockItem.status = "available";
  } else {
    stockItem.status = "sold";
    stockItem.saleId = sale.id;
    stockItem.soldAt = sale.saleDate;
  }
  stockItem.updatedAt = new Date().toISOString();

  saveState();
  renderAll();
}

function markSavedSaleItemCodeNotRequired(saleId, itemId) {
  if (!hasPermission("codecheck")) return;
  const sale = state.sales.find((entry) => entry.id === saleId);
  const item = sale?.items?.find((entry) => entry.id === itemId);
  if (!sale || !item) return;

  item.requiresCode = false;
  item.type = item.type === "stock" || item.type === "sku_stock" ? "manual" : item.type || "manual";
  sale.updatedAt = new Date().toISOString();
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
          ${paymentKindBadge(payment, sale)}
          <input type="date" value="${escapeHtml(payment.paymentDate)}" data-payment-field="paymentDate" aria-label="Payment date" title="Payment Date" />
          <select data-payment-field="paymentType" aria-label="Payment type">
            ${paymentTypes
              .map((type) => `<option ${payment.paymentType === type ? "selected" : ""}>${type}</option>`)
              .join("")}
          </select>
          <input type="number" min="0" step="1" value="${Number(payment.amount || 0)}" data-payment-field="amount" aria-label="Payment amount" title="Payment Amount" placeholder="Payment Amount" />
          <div class="payment-edit-actions">
            <button class="button secondary" type="button" data-save-payment="${payment.id}">Save</button>
            <button class="icon-button danger" type="button" data-delete-payment="${payment.id}" title="Delete payment">${lucideMarkup("trash-2")}</button>
          </div>
        </div>
      `
    )
    .join("");
  els.voucherPaymentDetails.innerHTML = `
    <div class="voucher-lookup-heading">
      <strong>${escapeHtml(sale.voucherNumber)}</strong>
      <span>${escapeHtml(sale.salePerson)} · ${escapeHtml(sale.saleDate)} · ${sale.items?.length || 0} items</span>
    </div>
    ${sale.customerName ? `<div class="voucher-lookup-meta">Customer: ${escapeHtml(sale.customerName)}${sale.customerPhone ? ` · ${escapeHtml(sale.customerPhone)}` : ""}${sale.customerAddress ? ` · ${escapeHtml(sale.customerAddress)}` : ""}</div>` : ""}
    <div class="voucher-money-summary lookup-money-summary">
      <div><span>Total</span><strong>${money(sale.totalPrice)}</strong></div>
      <div class="paid"><span>Paid</span><strong>${money(salePaid(sale))}</strong></div>
      <div class="${balance > 0 ? "balance-due" : "balance-clear"}"><span>${outstanding < 0 ? "Overpaid" : "Balance"}</span><strong>${money(outstanding < 0 ? Math.abs(outstanding) : balance)}</strong></div>
    </div>
    <div class="voucher-payment-editor">
      <span class="voucher-payment-list-title">Received Payment Records</span>
      ${paymentRows || `<span class="voucher-no-payment">Payment မရှိသေးပါ</span>`}
    </div>
    <div class="voucher-lookup-meta">${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))} · ${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</div>
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
    kind: "balance",
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

function saveVoucherPayment(paymentId, saleId = "", container = els.voucherPaymentDetails) {
  if (!hasPermission("sale")) return;
  const sale = saleId ? state.sales.find((item) => item.id === saleId) : findVoucher();
  if (!sale) return;
  const payment = (sale.payments || []).find((item) => item.id === paymentId);
  const row = container.querySelector(`[data-payment-row="${paymentId}"]`);
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
  if (saleId) openPaymentHistoryModal(sale.id);
  else clearVoucherSearchPanel();
  showSaleNotice("success", "ငွေလက်ခံစာကြောင်း ပြင်ပြီးပါပြီ", `${sale.voucherNumber} မှာ အောက်ပါအချက်တွေ ပြင်ပြီးပါပြီ`, details);
}

function deleteVoucherPayment(paymentId, saleId = "") {
  if (!hasPermission("sale")) return;
  const sale = saleId ? state.sales.find((item) => item.id === saleId) : findVoucher();
  if (!sale) return;
  const deletedPayment = (sale.payments || []).find((payment) => payment.id === paymentId);
  sale.payments = (sale.payments || []).filter((payment) => payment.id !== paymentId);
  saveState();
  els.saleStatus.textContent = `${sale.voucherNumber} payment ဖျက်ပြီး`;
  renderAll();
  if (saleId) openPaymentHistoryModal(sale.id);
  else clearVoucherSearchPanel();
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
    category: form.category.value || "Uncategorized",
    description: form.description.value.trim(),
    amount: Number(form.amount.value),
    paidBy: form.paidBy.value || "Cash",
  });

  if (!existingExpense) state.expenses.unshift(expense);
  editingExpenseId = "";
  saveState();
  form.reset();
  els.expenseDate.value = expense.expenseDate;
  setButtonIconLabel(els.expenseForm.querySelector("button[type=\"submit\"]"), "plus", "Expense ထည့်မယ်");
  renderAll();
}

function editExpense(id) {
  if (!hasPermission("expense")) return;
  const expense = state.expenses.find((item) => item.id === id);
  if (!expense) return;
  editingExpenseId = id;
  els.expenseDate.value = expense.expenseDate;
  els.expenseForm.category.value = expense.category || "Uncategorized";
  els.expenseForm.description.value = expense.description || "";
  els.expenseForm.amount.value = expense.amount || "";
  els.expenseForm.paidBy.value = expensePaidBy(expense);
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
    setButtonIconLabel(els.expenseForm.querySelector("button[type=\"submit\"]"), "plus", "Expense ထည့်မယ်");
  }
  saveState();
  renderAll();
}

function renderExpenseTable() {
  const selectedDate = els.expenseDate.value || today;
  const selectedCategory = els.expenseCategoryFilter?.value || "";
  const rows = state.expenses
    .filter((expense) => expense.expenseDate === selectedDate)
    .filter((expense) => !selectedCategory || (expense.category || "Uncategorized") === selectedCategory)
    .sort((a, b) => byDateDesc(a, b, "createdAt"));
  const total = rows.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  els.expenseTableTotal.textContent = money(total);
  if (els.expenseTableTotalLabel) {
    els.expenseTableTotalLabel.textContent = selectedCategory ? `${selectedCategory} Total` : "Daily Total";
  }
  els.expenseTable.innerHTML = rows.length
    ? rows
        .map(
          (expense, index) => `
            <tr>
              <td>${index + 1}</td>
              <td><span class="stock-badge">${escapeHtml(expense.category || "Uncategorized")}</span></td>
              <td>${escapeHtml(expense.description || "-")}</td>
              <td>${escapeHtml(expensePaidBy(expense))}</td>
              <td><strong>${money(expense.amount)}</strong></td>
              <td>
                <div class="row-actions">
                  <button class="icon-button" type="button" data-edit-expense="${expense.id}" title="Edit expense">E</button>
                  <button class="icon-button danger" type="button" data-delete-expense="${expense.id}" title="Delete expense">${lucideMarkup("trash-2")}</button>
                </div>
              </td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="6"><div class="empty">${escapeHtml(selectedDate)}${selectedCategory ? ` • ${escapeHtml(selectedCategory)}` : ""} အတွက် Expense မရှိသေးပါ</div></td></tr>`;
  const grouped = Object.entries(expenseTotalsByPayment(rows)).sort((a, b) => Number(b[1]) - Number(a[1]));
  els.expensePaymentSummary.innerHTML = grouped.length
    ? grouped.map(([type, amount]) => `<tr><td>${escapeHtml(type)}</td><td><strong>${money(amount)}</strong></td></tr>`).join("")
    : `<tr><td colspan="2"><div class="empty">Payment method အလိုက် expense မရှိသေးပါ</div></td></tr>`;
}

function addCashFloatAllocation(form) {
  if (currentStaff()?.role !== "admin") return;
  const amount = Number(form.amount.value || 0);
  const allocationDate = normalizeDateValue(form.allocationDate.value);
  const source = form.source?.value === "personal" ? "personal" : "business";
  if (allocationDate < CASH_FLOAT_START_DATE) {
    if (els.cashFloatStatus) els.cashFloatStatus.textContent = `Cash Float ကို ${CASH_FLOAT_START_DATE} မှ စတင်သွင်းပါ`;
    return;
  }
  if (amount <= 0) {
    if (els.cashFloatStatus) els.cashFloatStatus.textContent = "ငွေပမာဏကိုစစ်ပါ";
    return;
  }
  state.cashFloatAllocations.unshift({
    id: uid("cash-float"),
    allocationDate,
    source,
    amount,
    note: form.note.value.trim(),
    createdBy: currentStaff()?.name || "Admin",
    createdAt: new Date().toISOString(),
  });
  saveState();
  form.reset();
  form.allocationDate.value = defaultCashFloatDate;
  renderAll();
  els.cashFloatStatus.textContent = `Production Cash Float ${money(amount)} ထည့်ပြီး`;
  if (els.adminCashStatus) {
    els.adminCashStatus.textContent = `${source === "personal" ? "Personal Cash" : "Business Cash"} မှ Production Float ${money(amount)} ထည့်ပြီး`;
  }
}

function normalizeBusinessCashChannel(value) {
  const normalized = String(value || "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  const aliases = {
    cash: "cash",
    kpay: "kpay",
    kbzpay: "kpay",
    kbz_pay: "kpay",
    aya: "aya_pay",
    aya_pay: "aya_pay",
    ayapay: "aya_pay",
    aya_banking: "aya_banking",
    ayabanking: "aya_banking",
    wave: "wave",
    wavepay: "wave",
    wave_pay: "wave",
    banking: "banking",
    bank: "banking",
    bank_transfer: "banking",
  };
  return aliases[normalized] || "cash";
}

function businessCashChannelLabel(channel) {
  const normalized = normalizeBusinessCashChannel(channel);
  return BUSINESS_CASH_CHANNELS.find((item) => item.id === normalized)?.label || "Cash";
}

function normalizeBusinessCashBalances(rawBalances, legacyCash = 0) {
  const balances = Object.fromEntries(BUSINESS_CASH_CHANNELS.map((item) => [item.id, 0]));
  const hasChannelBalances = rawBalances && typeof rawBalances === "object" && !Array.isArray(rawBalances);
  if (hasChannelBalances) {
    Object.entries(rawBalances).forEach(([channel, amount]) => {
      balances[normalizeBusinessCashChannel(channel)] += Number(amount || 0);
    });
  } else {
    balances.cash = Number(legacyCash || 0);
  }
  return balances;
}

function businessCashBalancesTotal(balances) {
  return BUSINESS_CASH_CHANNELS.reduce((sum, item) => sum + Number(balances?.[item.id] || 0), 0);
}

function cashMonthStart(monthValue) {
  const month = /^\d{4}-\d{2}$/.test(String(monthValue || "")) ? String(monthValue) : currentMonth;
  return `${month}-01`;
}

function adminCashPeriodStart(monthValue) {
  const calendarStart = cashMonthStart(monthValue);
  return calendarStart < CASH_FLOAT_START_DATE ? CASH_FLOAT_START_DATE : calendarStart;
}

function cashMonthEnd(monthValue) {
  const start = new Date(`${cashMonthStart(monthValue)}T00:00:00Z`);
  start.setUTCMonth(start.getUTCMonth() + 1);
  return new Date(start.getTime() - 86400000).toISOString().slice(0, 10);
}

function previousCashMonth(monthValue) {
  const date = new Date(`${cashMonthStart(monthValue)}T00:00:00Z`);
  date.setUTCMonth(date.getUTCMonth() - 1);
  return date.toISOString().slice(0, 7);
}

function dateInCashMonth(dateValue, monthValue) {
  return normalizeDateValue(dateValue).slice(0, 7) === String(monthValue || "");
}

function normalizeAdminCashPeriod(period, fallbackMonth = currentMonth) {
  const month = /^\d{4}-\d{2}$/.test(String(period?.month || ""))
    ? String(period.month)
    : normalizeDateValue(period?.effectiveDate || `${fallbackMonth}-01`).slice(0, 7);
  const businessOpeningByChannel = normalizeBusinessCashBalances(period?.businessOpeningByChannel, period?.businessOpening);
  return {
    id: period?.id || `cash-period-${month}`,
    month,
    effectiveDate: adminCashPeriodStart(month),
    businessOpening: businessCashBalancesTotal(businessOpeningByChannel),
    businessOpeningByChannel,
    personalOpening: Number(period?.personalOpening || 0),
    productionOpening: Number(period?.productionOpening || 0),
    note: period?.note || "",
    updatedAt: period?.updatedAt || "",
    updatedBy: period?.updatedBy || "",
  };
}

function normalizeAdminCashPeriods(periods, legacyAccounts) {
  const normalized = Array.isArray(periods)
    ? periods.map((period) => normalizeAdminCashPeriod(period))
    : [];
  if (legacyAccounts && (legacyAccounts.updatedAt || legacyAccounts.businessOpening || legacyAccounts.personalOpening || legacyAccounts.productionOpening)) {
    const legacyMonth = normalizeDateValue(legacyAccounts.effectiveDate || ADMIN_CASH_START_DATE).slice(0, 7);
    if (!normalized.some((period) => period.month === legacyMonth)) {
      normalized.push(normalizeAdminCashPeriod(legacyAccounts, legacyMonth));
    }
  }
  if (!normalized.some((period) => period.month === ADMIN_CASH_FIRST_MONTH)) {
    const hasSeptemberProductionOpening = legacyAccounts?.productionEffectiveDate === CASH_FLOAT_START_DATE || legacyAccounts?.effectiveDate === CASH_FLOAT_START_DATE;
    normalized.push(normalizeAdminCashPeriod({
      id: `cash-period-${ADMIN_CASH_FIRST_MONTH}`,
      month: ADMIN_CASH_FIRST_MONTH,
      effectiveDate: CASH_FLOAT_START_DATE,
      productionOpening: hasSeptemberProductionOpening ? Number(legacyAccounts?.productionOpening || 0) : 0,
      note: "2026-09-16 မှ စတင်သော မူလ Production Cash စာရင်း",
      updatedAt: hasSeptemberProductionOpening ? legacyAccounts?.productionUpdatedAt || legacyAccounts?.updatedAt || "" : "",
      updatedBy: hasSeptemberProductionOpening ? legacyAccounts?.productionUpdatedBy || legacyAccounts?.updatedBy || "" : "",
    }, ADMIN_CASH_FIRST_MONTH));
  }
  const unique = new Map(normalized.map((period) => [period.month, period]));
  return [...unique.values()].sort((a, b) => b.month.localeCompare(a.month));
}

function selectedAdminCashMonth() {
  return els.adminCashMonth?.value || (currentMonth < ADMIN_CASH_FIRST_MONTH ? ADMIN_CASH_FIRST_MONTH : currentMonth);
}

function adminCashPeriod(monthValue = selectedAdminCashMonth()) {
  const month = String(monthValue || currentMonth);
  return (state.adminCashPeriods || []).find((period) => period.month === month) || normalizeAdminCashPeriod({ month }, month);
}

function businessCashAccountLabel(channel) {
  return `Business Cash (${businessCashChannelLabel(channel)})`;
}

function cashAccountMovementLabel(account, businessChannel = "cash") {
  return account === "business" ? businessCashAccountLabel(businessChannel) : cashAccountLabel(account);
}

function adminCashTotals(monthValue = "") {
  const month = String(monthValue || (typeof selectedAdminCashMonth === "function" ? selectedAdminCashMonth() : ADMIN_CASH_START_DATE.slice(0, 7)));
  const isInMonth = (dateValue) => normalizeDateValue(dateValue).slice(0, 7) === month;
  const allocations = (state.cashFloatAllocations || []).filter(
    (item) => isInMonth(item.allocationDate)
  );
  const businessAllocated = allocations
    .filter((item) => item.source !== "personal")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const personalAllocated = allocations
    .filter((item) => item.source === "personal")
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const accounts = Array.isArray(state.adminCashPeriods) ? adminCashPeriod(month) : (state.adminCashAccounts || {});
  const cashClosings = (state.adminDailyCashSales || [])
    .filter((item) => isInMonth(item.saleDate));
  const dailySales = cashClosings.reduce((sum, item) => (
    sum + (item.settlementType === "expense_shortfall" ? -1 : 1) * Number(item.amount || 0)
  ), 0);
  const businessByChannel = normalizeBusinessCashBalances(accounts.businessOpeningByChannel, accounts.businessOpening);
  cashClosings.forEach((item) => {
    const channel = normalizeBusinessCashChannel(item.businessChannel);
    businessByChannel[channel] += (item.settlementType === "expense_shortfall" ? -1 : 1) * Number(item.amount || 0);
  });
  businessByChannel.cash -= businessAllocated;
  let personalAvailable = Number(accounts.personalOpening || 0) - personalAllocated;
  (state.adminCashTransfers || [])
    .filter((transfer) => isInMonth(transfer.transferDate))
    .forEach((transfer) => {
      const amount = Number(transfer.amount || 0);
      const fromBusinessChannel = normalizeBusinessCashChannel(transfer.businessChannel);
      const toBusinessChannel = normalizeBusinessCashChannel(transfer.toBusinessChannel || transfer.businessChannel);
      if (transfer.fromAccount === "business") businessByChannel[fromBusinessChannel] -= amount;
      if (transfer.fromAccount === "personal") personalAvailable -= amount;
      if (transfer.toAccount === "business") businessByChannel[toBusinessChannel] += amount;
      if (transfer.toAccount === "personal") personalAvailable += amount;
    });
  const businessAvailable = businessCashBalancesTotal(businessByChannel);
  const productionTransfers = (state.adminCashTransfers || []).filter((transfer) => isInMonth(transfer.transferDate));
  const productionTransfersIn = productionTransfers
    .filter((transfer) => transfer.toAccount === "production")
    .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0);
  const productionTransfersOut = productionTransfers
    .filter((transfer) => transfer.fromAccount === "production")
    .reduce((sum, transfer) => sum + Number(transfer.amount || 0), 0);
  const productionUsed = Array.isArray(state.adminCashPeriods)
    ? productionCashUsageRows(month).reduce((sum, row) => sum + Number(row.amount || 0), 0)
    : 0;
  const firstMonth = typeof ADMIN_CASH_FIRST_MONTH === "string" ? ADMIN_CASH_FIRST_MONTH : ADMIN_CASH_START_DATE.slice(0, 7);
  const previousMonth = previousCashMonth(month);
  const hasPreviousPeriod = Array.isArray(state.adminCashPeriods) && state.adminCashPeriods.some((period) => period.month === previousMonth);
  const productionOpening = month > firstMonth && hasPreviousPeriod
    ? adminCashTotals(previousMonth).productionAvailable
    : Number(accounts.productionOpening || 0);
  const productionAvailable = productionOpening + allocations.reduce((sum, item) => sum + Number(item.amount || 0), 0) + productionTransfersIn - productionTransfersOut - productionUsed;
  return {
    businessOpening: businessCashBalancesTotal(normalizeBusinessCashBalances(accounts.businessOpeningByChannel, accounts.businessOpening)),
    businessByChannel,
    personalOpening: Number(accounts.personalOpening || 0),
    productionOpening,
    businessAllocated,
    personalAllocated,
    dailySales,
    businessAvailable,
    personalAvailable,
    productionUsed,
    productionAvailable: Array.isArray(state.adminCashPeriods) ? productionAvailable : cashFloatTotals().available,
  };
}

function cashAccountLabel(account) {
  return {
    business: "Business Cash",
    personal: "Personal Cash",
    production: "Production Cash",
    outside: "Cash Use / အပြင်ထုတ်",
  }[account] || account;
}

function saveAdminCashAccounts(form) {
  if (currentStaff()?.role !== "admin") return;
  const month = selectedAdminCashMonth();
  const effectiveDate = adminCashPeriodStart(month);
  const businessOpeningByChannel = Object.fromEntries(BUSINESS_CASH_CHANNELS.map((item) => [
    item.id,
    Number(form.elements[item.openingInput]?.value || 0),
  ]));
  const businessOpening = businessCashBalancesTotal(businessOpeningByChannel);
  const personalOpening = Number(form.personalOpening.value || 0);
  const productionOpening = month > ADMIN_CASH_FIRST_MONTH
    ? adminCashTotals(previousCashMonth(month)).productionAvailable
    : Number(form.productionOpening.value || 0);
  if (Object.values(businessOpeningByChannel).some((amount) => amount < 0) || personalOpening < 0 || productionOpening < 0) {
    els.adminCashStatus.textContent = "Cash စတင်ပမာဏကိုစစ်ပါ";
    return;
  }
  const period = {
    id: `cash-period-${month}`,
    month,
    effectiveDate,
    businessOpening,
    businessOpeningByChannel,
    personalOpening,
    productionOpening,
    note: form.note.value.trim(),
    updatedAt: new Date().toISOString(),
    updatedBy: currentStaff()?.name || "Admin",
  };
  state.adminCashPeriods = (state.adminCashPeriods || []).filter((item) => item.month !== month);
  state.adminCashPeriods.unshift(period);
  // Keep the legacy object populated for older synced clients while monthly periods are rolled out.
  state.adminCashAccounts = {
    ...state.adminCashAccounts,
    ...period,
    productionEffectiveDate: effectiveDate,
    productionNote: period.note,
    productionUpdatedAt: period.updatedAt,
    productionUpdatedBy: period.updatedBy,
  };
  saveState();
  renderAll();
  els.adminCashStatus.textContent = `${effectiveDate} လစဉ် Opening Balance သတ်မှတ်ပြီး`;
}

function addAdminCashTransfer(form) {
  if (currentStaff()?.role !== "admin") return;
  const month = typeof selectedAdminCashMonth === "function" ? selectedAdminCashMonth() : ADMIN_CASH_START_DATE.slice(0, 7);
  const transferDate = normalizeDateValue(form.transferDate.value);
  const fromAccount = form.fromAccount.value;
  const toAccount = form.toAccount.value;
  const businessChannel = fromAccount === "business" && toAccount === "production"
    ? "cash"
    : normalizeBusinessCashChannel(form.businessChannel.value);
  const toBusinessChannel = normalizeBusinessCashChannel(form.toBusinessChannel?.value || businessChannel);
  const amount = Number(form.amount.value || 0);
  const periodStart = typeof adminCashPeriodStart === "function" ? adminCashPeriodStart(month) : `${month}-01`;
  const isBusinessChannelTransfer = fromAccount === "business" && toAccount === "business";
  const invalidSameAccount = fromAccount === toAccount && !isBusinessChannelTransfer;
  const invalidSameBusinessChannel = isBusinessChannelTransfer && businessChannel === toBusinessChannel;
  if (normalizeDateValue(transferDate).slice(0, 7) !== month || transferDate < periodStart || amount <= 0 || invalidSameAccount || invalidSameBusinessChannel) {
    els.adminCashStatus.textContent = invalidSameBusinessChannel
      ? "ပေးမည့် Business Cash Channel နှင့် လက်ခံမည့် Channel မတူရပါ"
      : invalidSameAccount
        ? "ပေးမည့် Account နှင့် လက်ခံမည့် Account မတူရပါ"
        : "ရွေးထားသောလအတွင်း Date နှင့် ငွေပမာဏကိုစစ်ပါ";
    return;
  }
  state.adminCashTransfers.unshift({
    id: uid("cash-transfer"),
    transferDate,
    fromAccount,
    toAccount,
    businessChannel,
    toBusinessChannel,
    amount,
    note: form.note.value.trim(),
    createdAt: new Date().toISOString(),
    createdBy: currentStaff()?.name || "Admin",
  });
  saveState();
  form.reset();
  form.transferDate.value = typeof currentMonth !== "undefined" && month === currentMonth ? today : `${month}-01`;
  form.fromAccount.value = "business";
  form.toAccount.value = "production";
  form.businessChannel.value = "cash";
  if (form.toBusinessChannel) form.toBusinessChannel.value = "aya_pay";
  renderAll();
  els.adminCashStatus.textContent = `${cashAccountMovementLabel(fromAccount, businessChannel)} → ${cashAccountMovementLabel(toAccount, toBusinessChannel)} ${money(amount)} လွှဲပြီး`;
}

function syncAdminCashTransferChannel() {
  const form = els.adminCashTransferForm;
  if (!form) return;
  const fromBusiness = form.fromAccount.value === "business";
  const toBusiness = form.toAccount.value === "business";
  const cashOnly = form.fromAccount.value === "business" && form.toAccount.value === "production";
  if (cashOnly) form.businessChannel.value = "cash";
  form.businessChannel.disabled = !fromBusiness || cashOnly;
  const fromLabel = form.businessChannel.closest("label");
  if (fromLabel) {
    fromLabel.hidden = !fromBusiness;
    fromLabel.dataset.cashOnly = cashOnly ? "true" : "false";
  }
  if (form.toBusinessChannel) {
    form.toBusinessChannel.disabled = !toBusiness;
    const toLabel = form.toBusinessChannel.closest("label");
    if (toLabel) toLabel.hidden = !toBusiness;
    if (fromBusiness && toBusiness && form.businessChannel.value === form.toBusinessChannel.value) {
      form.toBusinessChannel.value = form.businessChannel.value === "aya_pay" ? "kpay" : "aya_pay";
    }
  }
}

function saveAdminDailyCashSale(form) {
  if (currentStaff()?.role !== "admin") return;
  const month = selectedAdminCashMonth();
  const saleDate = normalizeDateValue(form.saleDate.value);
  const settlementType = form.settlementType.value === "expense_shortfall" ? "expense_shortfall" : "deposit";
  const businessChannel = normalizeBusinessCashChannel(form.businessChannel.value);
  const amount = Number(form.amount.value || 0);
  const periodStart = adminCashPeriodStart(month);
  if (!dateInCashMonth(saleDate, month) || saleDate < periodStart || amount < 0 || (settlementType === "expense_shortfall" && amount <= 0)) {
    els.adminCashStatus.textContent = "ရွေးထားသောလအတွင်း နေ့စွဲ၊ ပေါင်း/လျော့ ရွေးချယ်မှုနှင့် ငွေပမာဏကိုစစ်ပါ";
    return;
  }
  const createdAt = new Date().toISOString();
  const record = {
    id: uid("daily-cash-sale"),
    saleDate,
    settlementType,
    businessChannel,
    amount,
    note: form.note.value.trim(),
    createdAt,
    updatedAt: createdAt,
    createdBy: currentStaff()?.name || "Admin",
  };
  state.adminDailyCashSales.unshift(record);
  saveState();
  form.reset();
  form.saleDate.value = month === currentMonth ? today : `${month}-01`;
  form.settlementType.value = "deposit";
  form.businessChannel.value = "cash";
  renderAll();
  els.adminCashStatus.textContent = settlementType === "expense_shortfall"
    ? `${saleDate} Expense Shortfall ${money(amount)} ကို ${businessCashAccountLabel(businessChannel)} မှ လျှော့ပြီး`
    : `${saleDate} ${businessCashAccountLabel(businessChannel)} ထဲ ${money(amount)} ပေါင်းပြီး`;
}

function deleteAdminCashRecord(type, id) {
  if (currentStaff()?.role !== "admin") return;
  const isSale = type === "sale";
  const list = isSale ? state.adminDailyCashSales : state.adminCashTransfers;
  const record = list.find((item) => item.id === id);
  if (!record) return;
  const ok = confirm(`${isSale ? "နေ့စဉ်ရောင်းရငွေ" : "Cash transfer"} စာရင်းကိုဖျက်မည်။ သေချာပါသလား?`);
  if (!ok) return;
  if (isSale) state.adminDailyCashSales = list.filter((item) => item.id !== id);
  else state.adminCashTransfers = list.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function productionCashUsageRows(monthValue = "") {
  const matchesPeriod = (dateValue) => !monthValue || dateInCashMonth(dateValue, monthValue);
  const bouquetRows = (state.stock || [])
    .filter((item) => Number(item.cashValue || 0) > 0 && normalizeDateValue(item.productionDate) >= CASH_FLOAT_START_DATE && matchesPeriod(item.productionDate))
    .map((item) => ({
      date: item.productionDate,
      createdAt: item.createdAt || item.productionDate,
      source: "Cash Bouquet Stock",
      productCode: item.productCode || "Code မရှိ",
      voucherNumber: "-",
      description: item.description || "ငွေသားပန်းစည်း",
      amount: Number(item.cashValue || 0),
  }));
  const voucherRows = (state.sales || [])
    .filter((sale) => {
      const usageDate = cashFloatVoucherUsageDate(sale);
      return usageDate >= CASH_FLOAT_START_DATE && usageDate <= today && matchesPeriod(usageDate);
    })
    .flatMap((sale) => (sale.items || [])
      .filter((item) => isCashFloatVoucherItem(item))
      .map((item) => {
        const quantity = Math.max(1, Number(item.quantity || 1));
        const amount = cashFloatVoucherItemValue(item);
        const usageDate = cashFloatVoucherUsageDate(sale);
        return {
          date: usageDate,
          createdAt: sale.createdAt || sale.saleDate,
          source: "Voucher SKU MM",
          productCode: item.productCode || "MM Code မရှိ",
          voucherNumber: sale.voucherNumber || "-",
          description: `${item.description || "Cash SKU"} · Qty ${quantity} · ${money(amount / quantity)} × ${quantity}`,
          amount,
        };
      }));
  return [...bouquetRows, ...voucherRows]
    .filter((row) => row.amount > 0)
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
}

function productionCashUsageDailyTotals(rows = productionCashUsageRows()) {
  const totals = new Map();
  rows.forEach((row) => {
    const date = String(row.date || "-");
    if (!totals.has(date)) {
      totals.set(date, { date, amount: 0, itemCount: 0, bouquetAmount: 0, voucherAmount: 0 });
    }
    const total = totals.get(date);
    const amount = Number(row.amount || 0);
    total.amount += amount;
    total.itemCount += 1;
    if (row.source === "Voucher SKU MM") total.voucherAmount += amount;
    else total.bouquetAmount += amount;
  });
  return [...totals.values()].sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

function productionCashDailyDetailHtml(date, rows = productionCashUsageRows()) {
  const matchingRows = rows.filter((row) => String(row.date || "") === String(date || ""));
  const total = productionCashUsageDailyTotals(matchingRows)[0] || {
    amount: 0,
    itemCount: 0,
    bouquetAmount: 0,
    voucherAmount: 0,
  };
  const detailRows = matchingRows.map((row) => `
    <tr>
      <td><strong>${escapeHtml(row.productCode)}</strong></td>
      <td>${escapeHtml(row.voucherNumber)}</td>
      <td>${escapeHtml(row.source)}</td>
      <td>${escapeHtml(row.description)}</td>
      <td class="cash-float-used"><strong>${money(row.amount)}</strong></td>
    </tr>
  `).join("");
  return `
    <div class="production-cash-daily-modal-summary">
      <article><span>စုစုပေါင်း</span><strong>${money(total.amount)}</strong><small>${total.itemCount} စာရင်း</small></article>
      <article><span>Cash Bouquet</span><strong>${money(total.bouquetAmount)}</strong></article>
      <article><span>Voucher SKU MM</span><strong>${money(total.voucherAmount)}</strong></article>
    </div>
    <div class="table-wrap production-cash-daily-modal-table">
      <table class="compact-record-table">
        <thead><tr><th>Product Code</th><th>Voucher No.</th><th>အသုံးအမျိုးအစား</th><th>Item / Qty</th><th>သုံးငွေ</th></tr></thead>
        <tbody>${detailRows || `<tr><td colspan="5"><div class="empty">ဒီနေ့အတွက် Code စာရင်းမရှိပါ</div></td></tr>`}</tbody>
      </table>
    </div>
  `;
}

function openProductionCashDailyModal(date) {
  if (currentStaff()?.role !== "admin" || !date) return;
  els.productionCashDailyModalTitle.textContent = `${date} Production Cash အသုံးစာရင်း`;
  els.productionCashDailyModalBody.innerHTML = productionCashDailyDetailHtml(date);
  openModal(els.productionCashDailyModal);
}

function renderAdminCashManager() {
  if (!els.adminCashManager) return;
  const isAdmin = currentStaff()?.role === "admin";
  els.adminCashManager.hidden = !isAdmin;
  if (!isAdmin) return;

  const month = selectedAdminCashMonth();
  const monthStart = adminCashPeriodStart(month);
  const monthEnd = cashMonthEnd(month);
  const accounts = adminCashPeriod(month);
  const accountTotals = adminCashTotals(month);
  if (els.adminCashMonth) {
    els.adminCashMonth.min = ADMIN_CASH_FIRST_MONTH;
    els.adminCashMonth.max = currentMonth;
  }
  if (els.adminCashPeriodTitle) els.adminCashPeriodTitle.textContent = `${month} Cash Management`;
  if (els.adminCashPreviousMonth) els.adminCashPreviousMonth.disabled = month <= ADMIN_CASH_FIRST_MONTH;
  if (els.adminCashNextMonth) els.adminCashNextMonth.disabled = month >= currentMonth;
  els.adminBusinessCash.textContent = money(accountTotals.businessAvailable);
  els.adminBusinessCashBreakdown.innerHTML = BUSINESS_CASH_CHANNELS.map((item) => `
    <article>
      <span>${escapeHtml(item.label)}</span>
      <strong>${money(accountTotals.businessByChannel[item.id])}</strong>
    </article>
  `).join("");
  els.adminPersonalCash.textContent = money(accountTotals.personalAvailable);
  els.adminProductionCash.textContent = money(accountTotals.productionAvailable);
  els.adminCashUsed.textContent = money(accountTotals.productionUsed);
  els.adminCashAccountsForm.effectiveDate.value = monthStart;
  const businessOpeningByChannel = normalizeBusinessCashBalances(accounts.businessOpeningByChannel, accounts.businessOpening);
  BUSINESS_CASH_CHANNELS.forEach((item) => {
    els.adminCashAccountsForm.elements[item.openingInput].value = Number(businessOpeningByChannel[item.id] || 0) || "";
  });
  els.adminCashAccountsForm.personalOpening.value = Number(accounts.personalOpening || 0) || "";
  els.adminCashAccountsForm.productionOpening.value = Number(accountTotals.productionOpening || 0) || "";
  els.adminCashAccountsForm.productionOpening.readOnly = month > ADMIN_CASH_FIRST_MONTH;
  if (els.adminProductionOpeningLabel) {
    els.adminProductionOpeningLabel.textContent = month > ADMIN_CASH_FIRST_MONTH ? "Production Cash — အရင်လမှ Carry" : "Production Cash — စတင်ငွေ";
  }
  if (els.adminProductionOpeningHint) {
    els.adminProductionOpeningHint.textContent = month > ADMIN_CASH_FIRST_MONTH
      ? `${previousCashMonth(month)} Closing Balance ကို အလိုအလျောက်ယူထားသည်`
      : `${CASH_FLOAT_START_DATE} စတင်ငွေကို သတ်မှတ်ပါ`;
  }
  els.adminCashAccountsForm.note.value = accounts.note || "";
  if (els.adminCashAccountsSection) {
    els.adminCashAccountsSection.open = !accounts.updatedAt;
  }
  els.adminCashTransferForm.transferDate.min = monthStart;
  els.adminCashTransferForm.transferDate.max = month === currentMonth ? today : monthEnd;
  if (!els.adminCashTransferForm.transferDate.value || !dateInCashMonth(els.adminCashTransferForm.transferDate.value, month)) {
    els.adminCashTransferForm.transferDate.value = month === currentMonth ? today : monthStart;
  }
  syncAdminCashTransferChannel();
  els.adminDailyCashSaleForm.saleDate.min = monthStart;
  els.adminDailyCashSaleForm.saleDate.max = month === currentMonth ? today : monthEnd;
  if (!els.adminDailyCashSaleForm.saleDate.value || !dateInCashMonth(els.adminDailyCashSaleForm.saleDate.value, month)) {
    els.adminDailyCashSaleForm.saleDate.value = month === currentMonth ? today : monthStart;
  }
  const shortage = Object.values(accountTotals.businessByChannel).some((amount) => amount < 0) || accountTotals.personalAvailable < 0 || accountTotals.productionAvailable < 0;
  els.adminCashStatus.textContent = shortage ? `${month} Cash account တစ်ခုတွင် လက်ကျန်မလုံလောက်ပါ` : `${monthStart} မှစတင်သော လစဉ်စာရင်း`;
  els.adminCashStatus.dataset.state = shortage ? "error" : "ok";

  const legacyRows = (state.cashFloatAllocations || [])
    .filter((item) => dateInCashMonth(item.allocationDate, month))
    .map((item) => ({
      id: item.id,
      type: "legacy",
      date: item.allocationDate,
      createdAt: item.createdAt,
      movement: `${item.source === "personal" ? cashAccountLabel("personal") : businessCashAccountLabel("cash")} → Production Cash`,
      amount: Number(item.amount || 0),
      note: item.note || "Production Cash Float",
    }));
  const transferRows = (state.adminCashTransfers || []).filter((item) => dateInCashMonth(item.transferDate, month)).map((item) => ({
    id: item.id,
    type: "transfer",
    date: item.transferDate,
    createdAt: item.createdAt,
    movement: `${cashAccountMovementLabel(item.fromAccount, item.businessChannel)} → ${cashAccountMovementLabel(item.toAccount, item.toBusinessChannel || item.businessChannel)}`,
    amount: Number(item.amount || 0),
    note: item.note || "Transfer / Give",
  }));
  const saleRows = (state.adminDailyCashSales || []).filter((item) => dateInCashMonth(item.saleDate, month)).map((item) => ({
    id: item.id,
    type: "sale",
    date: item.saleDate,
    createdAt: item.updatedAt || item.createdAt,
    movement: item.settlementType === "expense_shortfall"
      ? `${businessCashAccountLabel(item.businessChannel)} → Expense Shortfall`
      : `Daily Sales → ${businessCashAccountLabel(item.businessChannel)}`,
    amount: Number(item.amount || 0),
    amountPrefix: item.settlementType === "expense_shortfall" ? "−" : "",
    note: item.note || (item.settlementType === "expense_shortfall" ? "Expense Shortfall" : "နေ့စဉ်ရောင်းရငွေ"),
    locked: Boolean(item.dailyTransferId),
  }));
  const rows = [...legacyRows, ...transferRows, ...saleRows]
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
  els.adminCashLedger.innerHTML = rows.length
    ? rows.map((item) => `
        <tr>
          <td>${escapeHtml(item.date)}</td>
          <td>${escapeHtml(item.movement)}</td>
          <td><strong>${item.amountPrefix || ""}${money(item.amount)}</strong></td>
          <td>${escapeHtml(item.note)}</td>
          <td>${item.locked
            ? `<span class="stock-badge">Auto Transfer</span>`
            : item.type === "legacy"
            ? `<button class="icon-button danger" type="button" data-delete-admin-cash-float="${item.id}" title="Delete cash float entry">${lucideMarkup("trash-2")}</button>`
            : `<button class="icon-button danger" type="button" data-delete-admin-cash-record="${item.id}" data-record-type="${item.type}" title="Delete cash record">${lucideMarkup("trash-2")}</button>`}</td>
        </tr>
      `).join("")
    : `<tr><td colspan="5"><div class="empty">${month} အတွက် Cash ledger မရှိသေးပါ</div></td></tr>`;

  const usageRows = productionCashUsageRows(month);
  els.adminProductionCashUsage.innerHTML = usageRows.length
    ? usageRows.map((row) => `
        <tr>
          <td>${escapeHtml(row.date)}</td>
          <td>${escapeHtml(row.source)}</td>
          <td><strong>${escapeHtml(row.productCode)}</strong></td>
          <td>${escapeHtml(row.voucherNumber)}</td>
          <td>${escapeHtml(row.description)}</td>
          <td class="cash-float-used"><strong>${money(row.amount)}</strong></td>
        </tr>
      `).join("")
    : `<tr><td colspan="6"><div class="empty">${month} အတွက် Production Cash အသုံးမရှိသေးပါ</div></td></tr>`;

  const dailyTotals = productionCashUsageDailyTotals(usageRows);
  els.adminProductionDailyTotals.innerHTML = dailyTotals.length
    ? dailyTotals.map((total) => `
        <button class="admin-production-daily-card ${total.date === today ? "is-today" : ""}" type="button" data-production-cash-date="${escapeHtml(total.date)}" aria-label="${escapeHtml(total.date)} Production Cash အသုံးစာရင်းကြည့်ရန်">
          <div class="admin-production-daily-card-heading">
            <span>${escapeHtml(total.date)}</span>
            <small>${total.itemCount} စာရင်း</small>
          </div>
          <strong>${money(total.amount)}</strong>
          <div class="admin-production-daily-breakdown">
            <span>Cash Bouquet <b>${money(total.bouquetAmount)}</b></span>
            <span>Voucher SKU MM <b>${money(total.voucherAmount)}</b></span>
          </div>
        </button>
      `).join("")
    : `<div class="empty">ရက်အလိုက်ချုပ်ရန် Production Cash အသုံးမရှိသေးပါ</div>`;
}

function setAdminCashStep(stepName, shouldFocus = false) {
  const allowedSteps = new Set(["accounts", "ledger", "usage", "daily"]);
  activeAdminCashStep = allowedSteps.has(stepName) ? stepName : "accounts";
  document.querySelectorAll("[data-admin-cash-step]").forEach((button) => {
    const isActive = button.dataset.adminCashStep === activeAdminCashStep;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
    if (isActive && shouldFocus) button.focus({ preventScroll: true });
  });
  document.querySelectorAll("[data-admin-cash-panel]").forEach((panel) => {
    const isActive = panel.dataset.adminCashPanel === activeAdminCashStep;
    panel.hidden = !isActive;
    panel.classList.toggle("is-active", isActive);
  });
}

function saveCashFloatOpeningUnsold(form) {
  if (currentStaff()?.role !== "admin") return;
  const amount = Number(form.amount.value || 0);
  if (amount < 0) return;
  state.cashFloatOpeningUnsold = {
    effectiveDate: CASH_FLOAT_START_DATE,
    amount,
    note: form.note.value.trim(),
    updatedAt: new Date().toISOString(),
    updatedBy: currentStaff()?.name || "Admin",
  };
  saveState();
  renderAll();
  els.cashFloatStatus.textContent = `အရင် Stock မရောင်းရသေးငွေ ${money(amount)} သတ်မှတ်ပြီး`;
}

function deleteCashFloatAllocation(id) {
  if (currentStaff()?.role !== "admin") return;
  const allocation = state.cashFloatAllocations.find((item) => item.id === id);
  if (!allocation) return;
  const totals = cashFloatTotals();
  if (totals.allocated - Number(allocation.amount || 0) < totals.used) {
    els.cashFloatStatus.textContent = "အသုံးပြုပြီးငွေရှိသောကြောင့် ဒီအဝင်စာရင်းကိုဖျက်မရပါ";
    return;
  }
  const ok = confirm(`${money(allocation.amount)} Cash Float အဝင်စာရင်းကိုဖျက်မည်။ သေချာပါသလား?`);
  if (!ok) return;
  state.cashFloatAllocations = state.cashFloatAllocations.filter((item) => item.id !== id);
  saveState();
  renderAll();
}

function renderCashFloat() {
  if (!els.cashFloatLedger) return;
  const totals = cashFloatTotals();
  const hasShortage = totals.available < 0;

  els.cashFloatAdminPanel.hidden = currentStaff()?.role !== "admin";
  els.cashFloatAllocated.textContent = money(totals.allocated);
  els.cashFloatAvailable.textContent = money(totals.available);
  els.cashFloatUsed.textContent = money(totals.used);
  els.cashFloatOpeningUnsold.textContent = money(state.cashFloatOpeningUnsold?.amount || 0);
  els.cashFloatUnsold.textContent = money(totals.unsold);
  els.cashFloatSold.textContent = money(totals.sold);
  els.cashFloatStatus.textContent = hasShortage ? "Cash Float လက်ကျန်မလုံလောက်ပါ" : "စာရင်းကိုက်ညီသည်";
  els.cashFloatStatus.dataset.state = hasShortage ? "error" : "ok";
  els.cashFloatEquation.textContent = `${money(totals.allocated)} = လက်ကျန် ${money(totals.available)} + ပန်းစည်း/လွှဲထုတ် ${money(totals.used)} · Production မှလွှဲထုတ် ${money(totals.transfersOut)}`;
  els.cashFloatOpeningForm.effectiveDate.value = CASH_FLOAT_START_DATE;
  els.cashFloatOpeningForm.amount.value = Number(state.cashFloatOpeningUnsold?.amount || 0) || "";
  els.cashFloatOpeningForm.note.value = state.cashFloatOpeningUnsold?.note || "";

  const allocationRows = (state.cashFloatAllocations || [])
    .filter((item) => normalizeDateValue(item.allocationDate) >= CASH_FLOAT_START_DATE)
    .map((item) => ({
      type: "allocation",
      id: item.id,
      date: item.allocationDate,
      createdAt: item.createdAt || item.allocationDate,
      recordedBy: item.createdBy || "Admin",
      reference: "Cash Float",
      description: `${item.source === "personal" ? "Personal Cash" : "Business Cash"} · ${item.note || `Admin မှထုတ်ပေး (${item.createdBy || "Admin"})`}`,
      incoming: Number(item.amount || 0),
      used: 0,
      status: "ငွေထုတ်ပေး",
    }));
  const transferRows = (state.adminCashTransfers || [])
    .filter((item) => item.fromAccount === "production" || item.toAccount === "production")
    .map((item) => ({
      type: "cash-transfer",
      id: item.id,
      date: item.transferDate,
      createdAt: item.createdAt || item.transferDate,
      recordedBy: item.createdBy || "Admin",
      reference: "Cash Transfer",
      description: `${cashAccountMovementLabel(item.fromAccount, item.businessChannel)} → ${cashAccountMovementLabel(item.toAccount, item.toBusinessChannel || item.businessChannel)} · ${item.note || "Transfer / Give"}`,
      incoming: item.toAccount === "production" ? Number(item.amount || 0) : 0,
      used: item.fromAccount === "production" ? Number(item.amount || 0) : 0,
      status: item.toAccount === "production" ? "Float အဝင်" : "Transfer Out",
    }));
  const productionOpening = Number(state.adminCashAccounts?.productionOpening || 0);
  const productionOpeningRows = productionOpening
    ? [{
        type: "production-opening",
        id: "production-opening",
        date: CASH_FLOAT_START_DATE,
        createdAt: state.adminCashAccounts?.productionUpdatedAt || CASH_FLOAT_START_DATE,
        recordedBy: state.adminCashAccounts?.productionUpdatedBy || "Admin",
        reference: "Opening Balance",
        description: state.adminCashAccounts?.productionNote || "Production Cash စတင်ငွေ",
        incoming: productionOpening,
        used: 0,
        status: "Opening",
      }]
    : [];
  const bouquetRows = state.stock
    .filter(
      (item) => Number(item.cashValue || 0) > 0 && normalizeDateValue(item.productionDate) >= CASH_FLOAT_START_DATE
    )
    .map((item) => ({
      type: "bouquet",
      id: item.id,
      date: item.productionDate,
      createdAt: item.createdAt || item.productionDate,
      recordedBy: item.createdBy || "Production",
      reference: item.productCode,
      description: item.description || "Money Bouquet",
      incoming: 0,
      used: Number(item.cashValue || 0),
      status: item.status === "sold" ? "ရောင်းပြီး" : "မရောင်းရသေး",
    }));
  const voucherRows = state.sales
    .filter((sale) => cashFloatVoucherValue(sale) > 0)
    .map((sale) => ({
      type: "voucher-mm",
      id: sale.id,
      date: sale.saleDate,
      createdAt: sale.createdAt || sale.saleDate,
      recordedBy: sale.salePerson || "Sale Team",
      reference: sale.voucherNumber,
      description: `Voucher MM (${(sale.items || []).filter((item) => isCashFloatVoucherItem(item)).map((item) => item.productCode).filter(Boolean).join(", ")})`,
      incoming: 0,
      used: cashFloatVoucherValue(sale),
      status: "Voucher MM",
    }));
  const openingAmount = Number(state.cashFloatOpeningUnsold?.amount || 0);
  const openingRows = openingAmount
    ? [{
        type: "opening",
        id: "opening-unsold",
        date: CASH_FLOAT_START_DATE,
        createdAt: state.cashFloatOpeningUnsold?.updatedAt || CASH_FLOAT_START_DATE,
        recordedBy: state.cashFloatOpeningUnsold?.updatedBy || "Admin",
        reference: "Opening Unsold Stock",
        description: state.cashFloatOpeningUnsold?.note || `${CASH_FLOAT_START_DATE} မတိုင်ခင် မရောင်းရသေးပန်းစည်းငွေ`,
        incoming: 0,
        used: openingAmount,
        status: "အရင် Stock",
      }]
    : [];
  const rows = [...productionOpeningRows, ...allocationRows, ...transferRows, ...bouquetRows, ...voucherRows, ...openingRows].sort(
    (a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(b.createdAt || "").localeCompare(String(a.createdAt || ""))
  );
  els.cashFloatLedger.innerHTML = rows.length
    ? rows
        .map(
          (row) => `
            <tr>
              <td>${escapeHtml(row.date)}</td>
              <td><strong>${escapeHtml(row.recordedBy)}</strong></td>
              <td>${escapeHtml(row.reference)}</td>
              <td>${escapeHtml(row.description)}</td>
              <td class="cash-float-incoming">${row.incoming ? money(row.incoming) : "-"}</td>
              <td class="cash-float-used">${row.used ? money(row.used) : "-"}</td>
              <td><span class="stock-badge ${row.status === "ရောင်းပြီး" ? "sold" : ""}">${escapeHtml(row.status)}</span></td>
              <td>${row.type === "allocation" && currentStaff()?.role === "admin" ? `<button class="icon-button danger" type="button" data-delete-cash-float="${row.id}" title="Delete cash float entry">${lucideMarkup("trash-2")}</button>` : "-"}</td>
            </tr>
          `
        )
        .join("")
    : `<tr><td colspan="8"><div class="empty">Cash Float စာရင်းမရှိသေးပါ</div></td></tr>`;
}

function deleteStock(id) {
  if (!hasPermission("stock")) return;
  const item = state.stock.find((stockItem) => stockItem.id === id);
  if (!item || item.status === "sold") return;
  const ok = confirm(
    `${item.productCode} stock ကို ဖျက်တော့မည်။\n\n${item.description || "Description မရှိပါ"}\n\nဖျက်ပြီးလျှင် device အားလုံးမှ ပျောက်သွားပါမည်။ သေချာပါသလား?`
  );
  if (!ok) return;
  state.stock = state.stock.filter((stockItem) => stockItem.id !== id);
  if (selectedStockId === id) selectedStockId = "";
  saveState();
  if (item.photo?.key) {
    deleteStockPhoto(item.photo).catch((error) => console.warn("Deleted stock photo cleanup failed", error));
  }
  renderAll();
  showActionNotice({
    type: "success",
    eyebrow: "Inventory",
    title: "Stock ဖျက်ပြီးပါပြီ",
    message: `${item.productCode} ကို Inventory မှ ဖျက်ပြီးပါပြီ။`,
    details: [item.description || "Description မရှိပါ", "Cloud ကို အလိုအလျောက် Sync လုပ်နေပါသည်"],
  });
}

async function addStaff(form) {
  if (!hasPermission("settings")) return;
  const staff = {
    id: uid("staff"),
    name: form.name.value.trim(),
    role: form.role.value,
  };
  await setStaffPassword(staff, form.password.value);
  state.staff.push(staff);
  saveState();
  form.reset();
  renderAll();
}

async function updateStaffPassword(id, password) {
  if (!hasPermission("settings")) return;
  const staff = state.staff.find((item) => item.id === id);
  if (!staff) return;
  await setStaffPassword(staff, password);
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

function addExpenseCategory(form) {
  if (!hasPermission("settings")) return;
  const name = form.name.value.trim();
  if (!name) return;
  const exists = state.expenseCategories.some((category) => category.toLowerCase() === name.toLowerCase());
  if (!exists) state.expenseCategories.push(name);
  saveState();
  form.reset();
  renderAll();
}

function editExpenseCategory(currentName) {
  if (!hasPermission("settings")) return;
  const existingCategory = state.expenseCategories.find((category) => category === currentName);
  if (!existingCategory) return;

  const enteredName = prompt("Expense category name အသစ်ထည့်ပါ", existingCategory);
  if (enteredName === null) return;
  const nextName = enteredName.trim();
  if (!nextName || nextName === existingCategory) return;

  const duplicate = state.expenseCategories.some(
    (category) => category !== existingCategory && category.toLowerCase() === nextName.toLowerCase()
  );
  if (duplicate) {
    showActionNotice({
      type: "warning",
      eyebrow: "Expense Category",
      title: "Category name ရှိပြီးသားပါ",
      message: `${nextName} ဆိုတဲ့ Expense Category ရှိပြီးသားဖြစ်ပါတယ်။`,
    });
    return;
  }

  const categoryIndex = state.expenseCategories.indexOf(existingCategory);
  state.expenseCategories[categoryIndex] = nextName;
  let updatedExpenseCount = 0;
  state.expenses.forEach((expense) => {
    if ((expense.category || "Uncategorized") !== existingCategory) return;
    expense.category = nextName;
    updatedExpenseCount += 1;
  });

  saveState();
  renderAll();
  showActionNotice({
    type: "success",
    eyebrow: "Expense Category",
    title: "Category ပြင်ပြီးပါပြီ",
    message: `${existingCategory} ကို ${nextName} အဖြစ် ပြောင်းပြီးပါပြီ။`,
    details: [`ရှိပြီးသား expense records ${updatedExpenseCount} ခုကိုပါ ပြောင်းပြီးပါပြီ`],
  });
}

function removeExpenseCategory(name) {
  if (!hasPermission("settings")) return;
  const isUsed = state.expenses.some((expense) => (expense.category || "Uncategorized") === name);
  if (isUsed) {
    showActionNotice({
      type: "warning",
      eyebrow: "Expense Category",
      title: "Category ကိုဖျက်မရသေးပါ",
      message: `${name} category သုံးထားသော expense records ရှိနေပါတယ်။`,
    });
    return;
  }
  state.expenseCategories = state.expenseCategories.filter((category) => category !== name);
  saveState();
  renderAll();
}

function renderMetrics() {
  const todayPayments = allPayments().filter((payment) => payment.paymentDate === today);
  const todayExpenses = state.expenses.filter((expense) => expense.expenseDate === today);
  const cashReceived = paymentTotal(todayPayments);
  const costTotal = soldItemCostForSales(state.sales.filter((sale) => saleCostDate(sale) === today));
  const expenseTotal = todayExpenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const pendingProduction = pendingProductionOrderCount();
  const fulfillmentDue = todayFulfillmentDueCount();

  els.metricStock.textContent = state.stock.filter(isShopInventoryItem).reduce(
    (sum, item) => sum + (item.itemType === "sku" ? Number(item.quantityAvailable || 0) : item.status === "available" ? 1 : 0),
    0
  );
  els.metricSales.textContent = money(cashReceived);
  els.metricExpense.textContent = money(expenseTotal);
  els.metricNet.textContent = money(cashReceived - costTotal - expenseTotal);
  els.metricProductionPending.textContent = pendingProduction;
  els.metricFulfillmentDue.textContent = fulfillmentDue;
  const isAdminDashboard = currentStaff()?.role === "admin";
  if (els.dashboardLegacyHeader) els.dashboardLegacyHeader.hidden = isAdminDashboard;
  if (els.dashboardMetricGrid) els.dashboardMetricGrid.hidden = isAdminDashboard;
  if (els.dashboardHistoryPanel) {
    els.dashboardHistoryPanel.hidden = isAdminDashboard || !hasPermission("sale");
  }
  renderAdminCashManager();
}

function quickActionsForCurrentRole() {
  const actions = [
    { group: "sale", icon: "shopping-bag", permission: "sale", view: "sale", action: "newSale", title: "Cashier", detail: "Voucher အသစ်ထည့်ရန်", tone: "primary" },
    { group: "sale", icon: "receipt-text", permission: "vouchers", view: "vouchers", title: "Voucher များ", detail: "အရင် Voucher ကြည့် / ပြင်ရန်", tone: "green" },
    { group: "sale", icon: "hand-coins", permission: "receivables", view: "receivables", title: "ကျန်ငွေရရန်", detail: "Receivables စစ်ရန်", tone: "coral" },
    { group: "sale", icon: "scan-search", permission: "codecheck", view: "codecheck", title: "Code Check", detail: "Code ထည့်ရန်ကျန်စာရင်း", tone: "amber" },
    { group: "sale", icon: "truck", permission: "fulfillment", view: "fulfillment", title: "Pickup / Delivery", detail: "ပစ္စည်းပေးရန်စာရင်း", tone: "blue" },
    { group: "production", icon: "package-plus", permission: "stock", view: "stock", title: "Stock ထည့်ရန်", detail: "ပစ္စည်းအသစ်ထည့်ရန်", tone: "green" },
    { group: "production", icon: "printer", permission: "sticker", view: "sticker", title: "Sticker Print", detail: "Product code label ထုတ်ရန်", tone: "amber" },
    { group: "production", icon: "warehouse", permission: "inventory", view: "stock-inventory", title: "Stock Inventory", detail: "ဆိုင်ထဲမရောက်သေးသောပစ္စည်း", tone: "blue" },
    { group: "production", icon: "store", permission: "inventory", view: "shop-inventory", title: "Shop Inventory", detail: "ဆိုင်အရောင်းလက်ကျန်", tone: "green" },
    { group: isSaleTeamAccount() ? "sale" : "production", icon: "scan-line", permission: "inventory", view: "stock-audit", title: "Stock စာရင်းစစ်", detail: "Barcode ဖြင့် စစ်ပြီး / မစစ်ရသေး ကြည့်ရန်", tone: "green" },
    { group: "production", icon: "hammer", permission: "production", view: "production", title: "Production Orders", detail: "Order inbox / status update", tone: "amber" },
    { group: "production", icon: "banknote", permission: "cashfloat", view: "cashfloat", title: "Cash Float", detail: "Production ငွေသားလက်ကျန်", tone: "coral" },
    { group: isSaleTeamAccount() ? "sale" : "finance", icon: "wallet-cards", permission: "expense", view: "expense", title: "Daily Expense", detail: "နေ့စဉ်အသုံးစရိတ်ထည့်ရန်", tone: "coral" },
    { group: "finance", icon: "landmark", permission: "finance", view: "finance", title: "Finance", detail: "ငွေဝင် / ငွေထွက်စာရင်း", tone: "blue" },
    { group: "finance", icon: "chart-no-axes-combined", permission: "reports", view: "reports", title: "စာရင်းချုပ်", detail: "Reports / performance", tone: "plum" },
    { group: "admin", icon: "wallet-cards", permission: "dashboard", view: "dashboard", action: "adminCash", title: "Cash Management", detail: "Business / Personal / Production Float", tone: "green" },
    { group: "admin", icon: "layout-dashboard", permission: "dashboard", view: "dashboard", title: "Dashboard", detail: "ဆိုင်စာရင်းအကျဉ်းချုပ်", tone: "neutral" },
    { group: "admin", icon: "settings", permission: "settings", view: "settings", title: "Settings", detail: "Staff / category / permission", tone: "neutral" },
  ];
  return actions.filter((action) => hasPermission(action.permission) && (productionOrdersEnabled || action.view !== "production"));
}

const homeGroups = [
  { id: "sale", icon: "badge-dollar-sign", title: "Sale", detail: "Cashier, Voucher, ကျန်ငွေ၊ Pickup", tone: "sale" },
  { id: "production", icon: "package-open", title: "Production & Stock", detail: "Stock ထည့်၊ Sticker၊ Inventory", tone: "production" },
  { id: "finance", icon: "chart-no-axes-combined", title: "Finance & Reports", detail: "Expense၊ ငွေစာရင်း၊ စာရင်းချုပ်", tone: "finance" },
  { id: "admin", icon: "settings", title: "Admin", detail: "Dashboard နှင့် Settings", tone: "admin" },
];

function isSaleTeamAccount() {
  return ["cashier", "cashier_expense"].includes(currentStaff()?.role);
}

function saleReminderBadgeForView(view) {
  if (view === "fulfillment") return fulfillmentAttentionCount();
  if (view === "codecheck") return codeCheckAttentionCount();
  if (view === "receivables") return receivablesAttentionCount();
  return 0;
}

function quickActionCardsHtml(actions) {
  return actions
    .map((action) => {
      const badgeCount = action.group === "sale" ? saleReminderBadgeForView(action.view) : 0;
      const badgeText = badgeCount > 99 ? "99+" : String(badgeCount);
      return `
        <button class="quick-action-card ${action.tone}" type="button" data-quick-view="${escapeHtml(action.view)}" data-quick-action="${escapeHtml(action.action || "")}">
          <span class="quick-action-icon" aria-hidden="true">${lucideMarkup(action.icon || "arrow-right")}</span>
          <span class="quick-action-copy"><strong>${escapeHtml(action.title)}</strong><small>${escapeHtml(action.detail)}</small></span>
          <span class="quick-action-end">
            ${badgeCount ? `<span class="quick-action-badge" aria-label="${badgeText} ခုရှိ">${badgeText}</span>` : ""}
            <span class="quick-action-arrow" aria-hidden="true">${lucideMarkup("chevron-right")}</span>
          </span>
        </button>
      `;
    })
    .join("");
}

function homeGroupForView(view) {
  return quickActionsForCurrentRole().find((action) => action.view === inventoryMenuView(view))?.group || "";
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
  const productionOnly = productionOrdersEnabled && hasPermission("production") && !hasPermission("sale");
  const productionAccount = staff?.role === "production";
  const adminAccount = staff?.role === "admin";
  const allowedActions = quickActionsForCurrentRole();
  const saleAccount = isSaleTeamAccount();
  const allowedGroups = homeGroups.filter((group) => {
    if (adminAccount && ["finance", "admin"].includes(group.id)) return false;
    if (group.id === "admin" && staff?.role !== "admin") return false;
    if (saleAccount && group.id === "sale") return false;
    return allowedActions.some((action) => action.group === group.id);
  });
  if (activeHomeGroup && !allowedGroups.some((group) => group.id === activeHomeGroup)) activeHomeGroup = "";
  if (productionAccount && allowedGroups.some((group) => group.id === "production")) activeHomeGroup = "production";
  const selectedGroup = allowedGroups.find((group) => group.id === activeHomeGroup);

  els.homeGroupGrid.hidden = Boolean(selectedGroup);
  els.quickActionGrid.hidden = !selectedGroup;
  els.homeWorkQueues.hidden = true;
  els.saleAccountHome.hidden = !saleAccount || Boolean(selectedGroup);
  els.adminDirectHome.hidden = !adminAccount || Boolean(selectedGroup);
  els.homeGroupBack.hidden = !selectedGroup || productionAccount;
  els.homeEyebrow.textContent = selectedGroup ? "Main Menu / " + selectedGroup.title : saleAccount ? "B3 Floral EBS / Sale Team" : "B3 Floral EBS";
  els.homeTitle.textContent = selectedGroup ? selectedGroup.title : saleAccount ? "Sale Team Home" : "ဘယ်အပိုင်းကို သုံးမလဲ?";
  els.homeDescription.textContent = selectedGroup ? "လုပ်ဆောင်လိုသည်ကို ရွေးပါ။" : saleAccount ? "Sale လုပ်ငန်းတွေကို တစ်နေရာတည်းကနေ ရွေးနိုင်ပါတယ်။" : "လုပ်ငန်းအပိုင်းကို အရင်ရွေးပါ။";
  els.homeGroupGrid.innerHTML = allowedGroups
    .map((group) => `
      <button class="home-group-card ${group.tone}" type="button" data-home-group="${escapeHtml(group.id)}">
        <span class="home-group-icon" aria-hidden="true">${lucideMarkup(group.icon)}</span>
        <span class="home-group-copy"><strong>${escapeHtml(group.title)}</strong><small>${escapeHtml(group.detail)}</small></span>
        <span class="home-group-arrow" aria-hidden="true">${lucideMarkup("chevron-right")}</span>
      </button>
    `)
    .join("");

  els.saleAccountActions.innerHTML = saleAccount ? quickActionCardsHtml(allowedActions.filter((action) => action.group === "sale")) : "";
  els.adminDirectActions.innerHTML = adminAccount
    ? quickActionCardsHtml(allowedActions.filter((action) => action.group === "finance" || action.view === "settings" || action.action === "adminCash"))
    : "";
  els.quickActionGrid.innerHTML = quickActionCardsHtml(allowedActions.filter((action) => action.group === activeHomeGroup));

  const orderDateValue = (order) => order.fulfillmentDate || order.orderDate || order.saleDate || today;
  if (productionOnly) {
    const openOrders = (state.productionOrders || [])
      .filter((order) => (order.status || "new") !== "done")
      .sort((a, b) => {
        const urgentCompare = Number(isProductionOrderUrgent(b)) - Number(isProductionOrderUrgent(a));
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
              title: isProductionOrderUrgent(order) ? "Urgent Order" : "လုပ်ရန် Order",
              detail: `${orderDateValue(order)} • ${order.voucherNumber || "-"}${productionOrderUrgencyLabel(order.urgency) ? ` • ${productionOrderUrgencyLabel(order.urgency)}` : ""} • ${order.requirement || order.items?.[0]?.description || "Order"}`,
              amount: productionOrderStatusLabel(order.status),
              view: "production",
              tone: isProductionOrderUrgent(order) || (order.status || "new") === "new" ? "danger" : "pickup",
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
  const newProductionOrders = productionOrdersEnabled
    ? (state.productionOrders || []).filter((order) => order.status !== "done").slice(0, 4)
    : [];
  const productionPendingCount = productionOrdersEnabled ? pendingProductionOrderCount() : 0;
  const fulfillmentDueCount = todayFulfillmentDueCount();
  const codeCheckCount = codeCheckAttentionCount();

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
    ...(codeCheckCount && hasPermission("codecheck")
      ? [
          queueButton({
            title: "Code Check",
            detail: "Code ထည့်ရန်ကျန်သော voucher",
            amount: `${codeCheckCount}`,
            view: "codecheck",
            tone: "danger",
          }),
        ]
      : []),
    ...newProductionOrders.map((order) =>
      queueButton({
        title: "Production Order",
        detail: `${order.voucherNumber} • ${order.requirement || order.items?.[0]?.description || "New order"}`,
        amount: productionOrderStatusLabel(order.status),
        view: "production",
        tone: isProductionOrderUrgent(order) ? "danger" : "pickup",
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
    ...(saleAccount
      ? []
      : draftRows.map((draft) =>
          queueButton({
            title: "Hold Voucher",
            detail: `${draft.voucherNumber || "No Voucher No."} • ${draft.items?.length || 0} items`,
            amount: money((draft.items || []).reduce((sum, item) => sum + Number(item.price || 0), 0)),
            view: "sale",
            draftId: draft.id,
          })
        )),
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
  if (view === "codecheck" && sale) {
    els.codeCheckSearch.value = sale.voucherNumber || "";
    renderCodeCheckTable();
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

function productionOrderUrgencyLabel(value) {
  const urgency = String(value || "").trim();
  if (urgency.toLowerCase() === "urgent") return "Urgent";
  if (urgency.toLowerCase() === "normal") return "Normal";
  return urgency;
}

function isProductionOrderUrgent(order) {
  return /urgent|အရေးကြီး|အမြန်|ချက်ချင်း/i.test(productionOrderUrgencyLabel(order?.urgency));
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
  const urgency = productionOrderUrgencyLabel(order.urgency);
  const body = `${urgency ? `${urgency} • ` : ""}${order.items.map((item) => item.description).join(", ") || "New order"}`;
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
              <button class="icon-button danger" type="button" data-remove-production-photo="${index}" title="Remove photo">${lucideMarkup("trash-2")}</button>
            </div>
          `
        )
        .join("")
    : `<span class="muted">Reference photo ရှိရင် ဒီမှာတွဲပို့နိုင်ပါတယ်</span>`;
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = dataUrl;
  });
}

function canvasToDataUrl(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Photo compression failed"));
        return;
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    }, type, quality);
  });
}

function canvasToBlob(canvas, type, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Photo compression failed"));
    }, type, quality);
  });
}

function stockPhotoUrl(photo) {
  return photo?.key ? `${STOCK_PHOTO_ENDPOINT}?key=${encodeURIComponent(photo.key)}` : "";
}

async function readStockPhotoFile(file) {
  if (!file?.type?.startsWith("image/")) throw new Error("JPG/PNG/WEBP ပုံကိုရွေးပါ");
  if (Number(file.size || 0) > 15 * 1024 * 1024) throw new Error("မူရင်းပုံ 15 MB ထက်မကြီးရပါ");
  const originalDataUrl = await fileToDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);
  let edge = MAX_STOCK_PHOTO_EDGE;
  let quality = STOCK_PHOTO_QUALITY;
  let blob;
  let width;
  let height;
  let canvas;

  for (let attempt = 0; attempt < 7; attempt += 1) {
    const scale = Math.min(1, edge / Math.max(image.naturalWidth, image.naturalHeight));
    width = Math.max(1, Math.round(image.naturalWidth * scale));
    height = Math.max(1, Math.round(image.naturalHeight * scale));
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("ဒီ browser မှာ ပုံချုံ့၍မရပါ");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, width, height);
    context.drawImage(image, 0, 0, width, height);
    blob = await canvasToBlob(canvas, "image/jpeg", quality);
    if (blob.size <= MAX_STOCK_PHOTO_BYTES) break;
    quality = Math.max(0.5, quality - 0.07);
    edge = Math.max(900, Math.round(edge * 0.88));
  }

  if (!blob || blob.size > MAX_STOCK_PHOTO_BYTES) throw new Error("ပုံဖိုင်ကို လုံလောက်အောင်ချုံ့၍မရပါ");
  return {
    blob,
    dataUrl: await fileToDataUrl(blob),
    width,
    height,
    size: blob.size,
    contentType: "image/jpeg",
  };
}

function stockPhotoPreviewMarkup(draft, savedPhoto, { editable = true } = {}) {
  if (draft?.remove) {
    return `<div class="stock-photo-empty warning"><i data-lucide="image-off" aria-hidden="true"></i><span>Save လုပ်လျှင် လက်ရှိပုံကိုဖျက်ပါမယ်</span></div>`;
  }
  const src = draft?.dataUrl || stockPhotoUrl(savedPhoto);
  if (!src) {
    return `<div class="stock-photo-empty"><i data-lucide="image-plus" aria-hidden="true"></i><span>ပန်းစည်းပုံ မထည့်ရသေးပါ</span></div>`;
  }
  const size = Number(draft?.size || savedPhoto?.size || 0);
  return `
    <div class="stock-photo-preview-card">
      <button class="stock-photo-image-button" type="button" data-preview-stock-photo title="ပုံအကြီးကြည့်ရန်">
        <img src="${escapeHtml(src)}" alt="ပန်းစည်းဓာတ်ပုံ preview" />
      </button>
      <div><strong>${draft ? "ပုံအသစ် အသင့်ဖြစ်ပြီ" : "လက်ရှိသိမ်းထားသောပုံ"}</strong><small>${size ? `${Math.max(1, Math.round(size / 1024))} KB` : "Stock photo"}</small></div>
      ${editable ? `<button class="icon-button danger" type="button" data-remove-stock-photo title="ပုံဖယ်ရန်">${lucideMarkup("trash-2")}</button>` : ""}
    </div>`;
}

function renderStockPhotoDraft() {
  els.stockPhotoPreview.innerHTML = stockPhotoPreviewMarkup(stockPhotoDraft, null);
  els.stockPhotoPickerLabel.textContent = stockPhotoDraft ? "ပြန်ရိုက် / အစားထိုး" : "ပုံရိုက် / ပုံရွေး";
  refreshLucideIcons();
}

function renderEditStockPhotoDraft() {
  const item = state.stock.find((stockItem) => stockItem.id === editingStockId);
  if (!item || item.itemType === "sku") {
    els.editStockPhotoField.hidden = true;
    return;
  }
  els.editStockPhotoField.hidden = false;
  els.editStockPhotoPreview.innerHTML = stockPhotoPreviewMarkup(editStockPhotoDraft, item.photo);
  refreshLucideIcons();
}

async function handleStockPhotoFile(file, isEdit = false) {
  const status = isEdit ? els.stockStatus : els.stockStatus;
  if (!file) return;
  status.textContent = "Photo ချုံ့နေပါတယ်…";
  try {
    const draft = await readStockPhotoFile(file);
    if (isEdit) {
      editStockPhotoDraft = draft;
      renderEditStockPhotoDraft();
    } else {
      stockPhotoDraft = draft;
      renderStockPhotoDraft();
    }
    status.textContent = `Photo အသင့်ဖြစ်ပြီ · ${Math.max(1, Math.round(draft.size / 1024))} KB`;
  } catch (error) {
    status.textContent = error?.message || "Photo ဖတ်မရပါ";
  }
}

async function uploadStockPhoto(draft, stockId, productCode) {
  const response = await fetch(STOCK_PHOTO_ENDPOINT, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": draft.contentType || "image/jpeg",
      "X-Stock-Id": stockId,
      "X-Product-Code": productCode,
      "X-Photo-Width": String(draft.width || 0),
      "X-Photo-Height": String(draft.height || 0),
    },
    body: draft.blob,
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result?.error || `Photo upload မရပါ (${response.status})`);
  return result.photo;
}

async function deleteStockPhoto(photo) {
  if (!photo?.key) return;
  const response = await fetch(STOCK_PHOTO_ENDPOINT, {
    method: "DELETE",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key: photo.key }),
  });
  if (!response.ok) throw new Error("Photo ဖျက်၍မရပါ");
}

function openStockPhoto(item, source = "") {
  const src = source || stockPhotoUrl(item?.photo);
  if (!src) return;
  els.stockPhotoModalImage.src = src;
  els.stockPhotoModalName.textContent = `${item?.productCode || "Stock"} · ${item?.description || "ပန်းစည်းဓာတ်ပုံ"}`;
  openModal(els.stockPhotoModal);
}

async function readImageFile(file) {
  const originalDataUrl = await fileToDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);
  const scale = Math.min(1, MAX_PRODUCTION_PHOTO_EDGE / Math.max(image.naturalWidth, image.naturalHeight));
  const width = Math.max(1, Math.round(image.naturalWidth * scale));
  const height = Math.max(1, Math.round(image.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);
  const dataUrl = await canvasToDataUrl(canvas, "image/jpeg", PRODUCTION_PHOTO_QUALITY);
  return {
    name: String(file.name || "Reference photo").replace(/\.[^.]+$/, "") + ".jpg",
    type: "image/jpeg",
    dataUrl,
    width,
    height,
    originalSize: Number(file.size || 0),
  };
}

async function handleProductionPhotos(event) {
  const allImageFiles = [...(event.target.files || [])].filter((file) => file.type.startsWith("image/"));
  const files = allImageFiles.slice(0, MAX_PRODUCTION_PHOTOS);
  els.productionComposeStatus.textContent = "Photo ချုံ့နေပါတယ်...";
  try {
    productionPhotoDraft = await Promise.all(files.map(readImageFile));
    const limitNote = allImageFiles.length > MAX_PRODUCTION_PHOTOS ? ` • ပထမ ${MAX_PRODUCTION_PHOTOS} ပုံပဲယူထားပါတယ်` : "";
    els.productionComposeStatus.textContent = `${productionPhotoDraft.length} photo တွဲပြီး${limitNote}`;
    renderProductionPhotoPreview();
  } catch {
    productionPhotoDraft = [];
    els.productionComposeStatus.textContent = "Photo ဖတ်မရပါ။ JPG/PNG ပုံကိုပြန်ရွေးပါ";
    renderProductionPhotoPreview();
  }
}

function openProductionPhoto(orderId, photoIndex) {
  const order = state.productionOrders.find((item) => item.id === orderId);
  const photo = order?.photos?.[Number(photoIndex)];
  if (!photo || !els.productionPhotoModalImage) return;
  els.productionPhotoModalImage.src = photo.dataUrl;
  els.productionPhotoModalImage.alt = photo.name || "Production reference photo";
  els.productionPhotoModalName.textContent = `${order.voucherNumber || "Order"} • ${photo.name || "Reference photo"}`;
  openModal(els.productionPhotoModal);
}

function clearProductionCompose() {
  editingProductionOrderId = "";
  productionPhotoDraft = [];
  els.productionOrderVoucher.value = "";
  els.productionOrderRequirement.value = "";
  els.productionOrderUrgency.value = "";
  els.productionOrderDate.value = els.fulfillmentDate.value || els.saleForm.saleDate.value || today;
  els.productionOrderPhotos.value = "";
  els.sendProductionOrderButton.textContent = "Order တင်မယ်";
  els.cancelProductionEditButton.hidden = true;
  renderProductionPhotoPreview();
}

function openProductionOrderFromSale() {
  if (!isSaleTeamAccount()) return;
  els.productionOrderVoucher.value = els.saleForm.voucherNumber.value.trim();
  els.productionOrderDate.value = els.fulfillmentDate.value || els.saleForm.saleDate.value || today;
  els.productionComposeStatus.textContent = saleItems.length
    ? `${saleItems.length} item နဲ့ Production Order တင်နိုင်ပါပြီ`
    : "Voucher item ထည့်ပြီး Production Order တင်ပါ";
  renderProductionPhotoPreview();
  activeHomeGroup = "";
  renderHome();
  goToView("home");
  document.querySelector("#saleHomeProductionOrder")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
    urgency: els.productionOrderUrgency.value.trim(),
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
    const text = `${order.voucherNumber} ${order.requirement} ${productionOrderUrgencyLabel(order.urgency)} ${order.salePerson} ${order.createdBy} ${itemText}`.toLowerCase();
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
  const canManageOrder = hasPermission("sale");
  els.productionOrderTable.innerHTML = rows.length
    ? rows
        .slice(0, 12)
        .map((order) => {
          const itemText = (order.items || [])
            .map((item) => `${item.productCode || "Manual"} ${item.description || ""} x${item.quantity || 1}`.trim())
            .join(" | ");
          const urgency = productionOrderUrgencyLabel(order.urgency);
          return `
            <tr>
              <td>${escapeHtml(order.fulfillmentDate || order.orderDate || "-")}</td>
              <td>${voucherPopupButtonByNumber(order.voucherNumber)}<br><span class="muted">${escapeHtml(order.salePerson || "-")}</span></td>
              <td>${escapeHtml(itemText || order.requirement || "-")}</td>
              <td>${urgency ? `<span class="production-urgency-badge">${escapeHtml(urgency)}</span>` : `<span class="muted">-</span>`}</td>
              <td><span class="fulfillment-badge ${order.status === "done" ? "delivered" : ""}">${escapeHtml(productionOrderStatusLabel(order.status))}</span></td>
              <td>
                ${
                  canManageOrder
                    ? `<div class="row-actions">
                        <button class="button secondary tiny-button" type="button" data-edit-production-order="${order.id}">Edit</button>
                        <button class="icon-button danger" type="button" data-delete-production-order="${order.id}" title="Delete order">${lucideMarkup("trash-2")}</button>
                      </div>`
                    : `<span class="muted">Status only</span>`
                }
              </td>
            </tr>
          `;
        })
        .join("")
    : `<tr><td colspan="6"><div class="empty">နောက်နေ့ Order မရှိသေးပါ</div></td></tr>`;
}

function productionOrderCardHtml(order) {
  const urgency = productionOrderUrgencyLabel(order.urgency);
  const itemDescriptions = (order.items || []).map((item) => String(item.description || "").trim()).filter(Boolean);
  const items = (order.items || [])
    .map((item) => `<li>${escapeHtml(item.productCode || "Manual")} - ${escapeHtml(item.description || "-")} x ${escapeHtml(item.quantity || 1)}</li>`)
    .join("");
  const requirement = String(order.requirement || "").trim();
  const normalizedDescription = (value) => String(value || "").toLowerCase().replace(/[\s•\-–—.,၊။]+/g, "").trim();
  const normalizedRequirement = normalizedDescription(requirement);
  const requirementDuplicatesItem = normalizedRequirement && itemDescriptions.some((description) => normalizedDescription(description) === normalizedRequirement);
  const requirementHtml = requirement && !requirementDuplicatesItem ? `<p>${escapeHtml(requirement)}</p>` : "";
  const photos = (order.photos || [])
    .map((photo, index) => `<button class="order-photo-button" type="button" data-view-production-photo="${escapeHtml(order.id)}|${index}" aria-label="${escapeHtml(photo.name || "Reference photo")} အကြီးချဲ့ကြည့်ရန်"><img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || "Order photo")}" loading="lazy" /></button>`)
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
    ${
      hasPermission("sale")
        ? `<button class="button secondary tiny-button" type="button" data-edit-production-order="${order.id}">Edit</button>
           <button class="icon-button danger" type="button" data-delete-production-order="${order.id}" title="Delete order">${lucideMarkup("trash-2")}</button>`
        : ""
    }
  `;

  return `
    <article class="production-order-card ${isProductionOrderUrgent(order) ? "urgent" : ""}">
      <div class="production-order-head">
        <div>
          ${voucherPopupButtonByNumber(order.voucherNumber)}
          <span>${escapeHtml(order.fulfillmentDate || order.orderDate || "-")}</span>
        </div>
        <div class="order-badges">
          <span class="fulfillment-badge ${order.status === "done" ? "delivered" : ""}">${escapeHtml(productionOrderStatusLabel(order.status))}</span>
          ${urgency ? `<span class="production-urgency-badge">${escapeHtml(urgency)}</span>` : ""}
        </div>
      </div>
      ${items ? `<ul>${items}</ul>` : requirementHtml || `<p>Requirement only</p>`}
      ${items ? requirementHtml : ""}
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
  if (!hasPermission("sale")) return;
  const order = state.productionOrders.find((item) => item.id === id);
  if (!order) return;
  editingProductionOrderId = id;
  productionPhotoDraft = (order.photos || []).map((photo) => ({ ...photo }));
  els.productionOrderVoucher.value = order.voucherNumber || "";
  els.productionOrderUrgency.value = productionOrderUrgencyLabel(order.urgency);
  els.productionOrderDate.value = order.fulfillmentDate || order.orderDate || today;
  els.productionOrderRequirement.value = order.requirement || "";
  els.productionOrderPhotos.value = "";
  els.sendProductionOrderButton.textContent = "Order ပြင်မယ်";
  els.cancelProductionEditButton.hidden = false;
  els.productionComposeStatus.textContent = `${order.voucherNumber || "Order"} ပြင်နေသည်`;
  renderProductionPhotoPreview();
  activeHomeGroup = "";
  renderHome();
  goToView("home");
  document.querySelector("#saleHomeProductionOrder")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteProductionOrder(id) {
  if (!hasPermission("sale")) return;
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

function expensePaidBy(expense) {
  return expense.paidBy || expense.paymentType || "Cash";
}

function expenseTotalsByPayment(expenses) {
  return expenses.reduce((map, expense) => {
    const type = expensePaidBy(expense);
    map[type] = (map[type] || 0) + Number(expense.amount || 0);
    return map;
  }, {});
}

function expenseTotalsByCategory(expenses) {
  return expenses.reduce((map, expense) => {
    const category = expense.category || "Uncategorized";
    map[category] = (map[category] || 0) + Number(expense.amount || 0);
    return map;
  }, {});
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

function saleCostDate(sale) {
  return firstPaymentDate(sale) || sale.saleDate;
}

function saleItemCost(item, stockItems = state.stock, lookup = null) {
  const stockItem = lookup
    ? (item?.stockId && lookup.firstById.get(item.stockId)) || lookup.firstByCode.get(normalizeCode(item?.productCode))
    :
    (item?.stockId && (stockItems || []).find((stock) => stock.id === item.stockId)) ||
    (stockItems || []).find((stock) => normalizeCode(stock.productCode) === normalizeCode(item?.productCode));
  const quantity = Math.max(1, Number(item?.quantity || 1));
  return resolvedSaleItemCostState(item, stockItem).unitCost * quantity;
}

function saleProductionCost(sale) {
  return (sale.items || []).reduce((sum, item) => sum + saleItemCost(item), 0);
}

function saleProductCodeBouquetCount(sale, stockLookup = buildStockCostLookup(state.stock)) {
  return (sale.items || []).reduce((count, item) => {
    if (!normalizeCode(item.productCode) || item.type === "sku_stock") return count;
    const stockItem =
      (item.stockId && stockLookup.firstById.get(item.stockId)) ||
      stockLookup.firstByCode.get(normalizeCode(item.productCode));
    if (stockItem?.itemType === "sku") return count;
    return count + Math.max(1, Number(item.quantity || 1));
  }, 0);
}

function voucherCostPayable(sale) {
  return (sale.fulfillmentStatus || "pending") === "delivered" ? 0 : saleProductionCost(sale);
}

function recalculateSaleProductionCost(sale) {
  sale.productionCost = (sale.items || []).reduce((sum, item) => sum + saleItemCost(item), 0);
}

function syncSaleCostsForStock(stockId) {
  const stockItem = state.stock.find((item) => item.id === stockId);
  if (!stockItem) return;

  state.sales.forEach((sale) => {
    let changed = false;
    (sale.items || []).forEach((item) => {
      if (item.stockId !== stockId) return;
      const resolvedCost = resolvedSaleItemCostState(item, stockItem);
      item.unitCost = resolvedCost.unitCost;
      item.cost = resolvedCost.unitCost * Math.max(1, Number(item.quantity || 1));
      item.pendingBouquetCash = resolvedCost.pendingBouquetCash;
      item.costSource = resolvedCost.costSource;
      changed = true;
    });
    if (changed) recalculateSaleProductionCost(sale);
  });
}

function soldItemCostForSales(sales) {
  return sales.reduce((sum, sale) => sum + saleProductionCost(sale), 0);
}

function soldItemCostInCurrentPeriod() {
  return soldItemCostForSales(state.sales.filter((sale) => isInPeriod(saleCostDate(sale))));
}

function cashBouquetValueForSales(sales) {
  const saleIds = new Set(sales.map((sale) => sale.id));
  const stockIds = new Set(sales.flatMap((sale) => (sale.items || []).map((item) => item.stockId).filter(Boolean)));
  return state.stock
    .filter(
      (item) =>
        Number(item.cashValue || 0) > 0 &&
        normalizeDateValue(item.productionDate) >= CASH_FLOAT_START_DATE &&
        (stockIds.has(item.id) || saleIds.has(item.saleId))
    )
    .reduce((sum, item) => sum + Number(item.cashValue || 0), 0);
}

function cashBouquetValueInCurrentPeriod() {
  return cashBouquetValueForSales(state.sales.filter((sale) => isInPeriod(saleCostDate(sale))));
}

function paymentTotal(payments) {
  return payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function releaseSaleStock(sale) {
  (sale.items || []).forEach((item) => {
    const stockItem = state.stock.find((stock) => stock.id === item.stockId);
    if (!stockItem) return;
    if (item.type === "sku_stock") {
      if (isCashInventoryItem(stockItem)) {
        stockItem.quantityAvailable = 0;
        stockItem.quantityTotal = 0;
        stockItem.status = "available";
        return;
      }
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
      if (isCashInventoryItem(stockItem)) {
        stockItem.quantityAvailable = 0;
        stockItem.quantityTotal = 0;
        stockItem.status = "available";
        return;
      }
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

function moveStockInventory(id) {
  if (!hasPermission("stock")) return;
  const item = state.stock.find((stockItem) => stockItem.id === id);
  if (!item || item.status === "sold") return;
  const previousLocation = item.inventoryLocation === "pending" ? "pending" : "shop";
  item.inventoryLocation = previousLocation === "pending" ? "shop" : "pending";
  item.updatedAt = new Date().toISOString();
  saveState();
  renderAll();
  showActionNotice({
    type: "success",
    eyebrow: "Inventory Move",
    title: `${item.productCode} နေရာရွှေ့ပြီးပါပြီ`,
    message: `${inventoryLocationLabel(previousLocation)} မှ ${inventoryLocationLabel(item.inventoryLocation)} သို့ ရွှေ့ပြီးပါပြီ။`,
    details: [item.description || "Description မရှိပါ", `လက်ရှိနေရာ: ${inventoryLocationLabel(item.inventoryLocation)}`],
  });
}

let selectedStockAuditId = "";
const pendingAuditSplitEnabled = false;

function stockAuditExpected(stock, location) {
  return stock.filter((item) => !isCashInventoryItem(item)
    && (item.inventoryLocation === "pending" ? "pending" : "shop") === location
    && (item.itemType === "sku" ? Number(item.quantityAvailable || 0) > 0 : item.status === "available"))
    .map((item) => ({ stockId: item.id, productCode: item.productCode, description: item.description || "", paperColor: item.paperColor || "", itemType: item.itemType || "floral", quantity: item.itemType === "sku" ? Number(item.quantityAvailable) : 1 }));
}

function addLiveStockToAudit(audit, stock, code) {
  const normalized = normalizeCode(code);
  if (!audit || audit.completedAt || !normalized || audit.expected.some((item) => normalizeCode(item.productCode) === normalized)) return null;
  const eligible = stockAuditExpected(stock, audit.location).filter((item) => normalizeCode(item.productCode) === normalized);
  if (eligible.length !== 1) return null;
  const item = { ...eligible[0], addedDuringAudit: true, addedAt: new Date().toISOString() };
  audit.expected.push(item);
  return item;
}

function addScannedLiveStockToAudit(audit, scans, stock) {
  if (!audit || audit.completedAt) return 0;
  let added = 0;
  scans.filter((scan) => scan.auditId === audit.id).forEach((scan) => {
    const code = scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "";
    if (addLiveStockToAudit(audit, stock, code)) added += 1;
  });
  return added;
}

function stockAuditScanResult(audit, scans, stock, code) {
  if (!audit || audit.completedAt) return { error: "ဖွင့်ထားသော စစ်ပွဲကို ရွေးပါ။" };
  const normalized = normalizeCode(code);
  if (!normalized) return { error: "Barcode / Code ထည့်ပါ။" };
  const matches = audit.expected.filter((item) => normalizeCode(item.productCode) === normalized);
  if (matches.length > 1) return { error: "Code တူ stock များနေပါသည်။ Inventory တွင် ပြန်စစ်ပါ။" };
  const item = matches[0];
  if (!item) {
    const live = stock.filter((row) => normalizeCode(row.productCode) === normalized);
    return { error: live.length ? "ဤ code သည် စစ်ပွဲစချိန်ရှိ စာရင်းတွင် မပါပါ။ နေရာ၊ ရောင်းပြီးမှု သို့မဟုတ် အသစ်ဝင် stock ကို စစ်ပါ။" : "ဤ code ကို app ထဲတွင် မတွေ့ပါ။" };
  }
  if (scans.some((scan) => scan.auditId === audit.id && scan.stockId === item.stockId)) return { error: `${item.productCode} — စစ်ပြီးသားပါ။` };
  return { item };
}

function auditSkuItem(audit, code, stock) {
  const key = normalizeCode(code);
  const snapshots = (audit?.expected || []).filter((item) => normalizeCode(item.productCode) === key);
  const live = stock.filter((item) => normalizeCode(item.productCode) === key);
  if (snapshots.length > 1 || live.length > 1) return null;
  const item = snapshots[0] || live[0];
  return item && (item.itemType === "sku" || (!item.itemType && (live[0]?.itemType === "sku" || Number(item.quantity) > 1))) ? item : null;
}

function auditQuantityStatus(item, scan) {
  if (!scan) return "မစစ်ရသေး";
  const sku = item.itemType === "sku" || (!item.itemType && Number(item.quantity) > 1) || scan.itemType === "sku";
  if (!sku) return "✓ စစ်ပြီး";
  if (!Number.isSafeInteger(scan.countedQuantity) || scan.countedQuantity < 0) return "Qty မစစ်ရသေး";
  const difference = scan.countedQuantity - Number(item.quantity);
  return "Qty " + scan.countedQuantity + " · " + (difference === 0 ? "✓ ကိုက်ညီ" : difference > 0 ? "ပို " + difference : "လို " + Math.abs(difference));
}

function canEditAuditScans(audit, role) {
  if (role === "admin") return Boolean(audit);
  // Older admin-reopened sessions predate the explicit sale-editing flag.
  const saleEditingAllowed = audit?.saleEditingEnabled === true
    || (audit?.saleEditingEnabled == null && Boolean(audit?.previousCompletedAt));
  return Boolean(audit && !audit.completedAt
    && saleEditingAllowed && ["cashier", "cashier_expense"].includes(role));
}

function resetAuditQuantity() {
  document.querySelector("#auditQtyField").hidden = true;
  document.querySelector("#auditQty").value = "";
  document.querySelector("#auditQty").dataset.code = "";
}

function currentStockAudit() {
  return state.stockAudits.find((audit) => audit.id === selectedStockAuditId);
}

function reconcileStockAudit(audit, scans) {
  const matched = [];
  const exceptions = [];
  const seen = new Set();
  for (const scan of scans.filter((row) => row.auditId === audit.id)) {
    const code = scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "";
    const key = normalizeCode(code);
    const matches = audit.expected.filter((item) => normalizeCode(item.productCode) === key);
    const reason = seen.has(key) ? "ထပ် scan ထားသော code" : matches.length > 1 ? "Stock code တူများနေသည်" : matches.length === 0 ? "မူလစစ်မည့်စာရင်းတွင် မပါသော code" : "";
    seen.add(key);
    if (reason) exceptions.push({ ...scan, productCode: code, reason });
    else matched.push({ ...scan, productCode: code, stockId: matches[0].stockId });
  }
  return { matched, exceptions };
}

function planPendingAuditSplit(audit, scans, stock) {
  const expected = stockAuditExpected(stock, "pending");
  const sourceCodes = new Set((audit?.expected || []).map((item) => normalizeCode(item.productCode)));
  const pendingCounts = new Map();
  expected.forEach((item) => {
    const code = normalizeCode(item.productCode);
    pendingCounts.set(code, (pendingCounts.get(code) || 0) + 1);
  });
  const selected = !audit?.completedAt || audit.location !== "shop" ? [] : scans.filter((scan) => {
    const code = normalizeCode(scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "");
    return scan.auditId === audit.id && !sourceCodes.has(code) && pendingCounts.get(code) === 1;
  });
  return { expected, selected };
}

function stockAuditScanDescription(scan, expected, stock) {
  const code = normalizeCode(scan.productCode || expected.find((item) => item.stockId === scan.stockId)?.productCode || "");
  if (!code) return "ပစ္စည်းအမည် မတွေ့ပါ";
  const snapshot = expected.filter((item) => normalizeCode(item.productCode) === code);
  const matches = snapshot.length ? snapshot : stock.filter((item) => normalizeCode(item.productCode) === code);
  if (matches.length > 1) return "Code တူများနေသည်";
  const item = matches[0];
  const liveMatches = stock.filter((row) => normalizeCode(row.productCode) === code);
  const color = String(item?.paperColor ?? (liveMatches.length === 1 ? liveMatches[0].paperColor : "") ?? "").trim();
  const description = item?.description || "ပစ္စည်းအမည် မတွေ့ပါ";
  return color && color !== "-" ? description + " · အရောင်: " + color : description;
}

function searchUnscannedAuditItems(audit, scans, stock, search) {
  const query = String(search || "").trim().toLowerCase();
  if (!audit || !query) return [];
  const captured = new Set(scans.filter((scan) => scan.auditId === audit.id).map((scan) =>
    normalizeCode(scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "")));
  const expectedCodes = new Set(audit.expected.map((item) => normalizeCode(item.productCode)));
  const candidates = [...audit.expected.map((item) => ({ ...item, inSnapshot: true })),
    ...stock.filter((item) => !expectedCodes.has(normalizeCode(item.productCode))).map((item) => ({ ...item, inSnapshot: false }))];
  return candidates.filter((item) => !captured.has(normalizeCode(item.productCode))
    && (item.productCode + " " + stockAuditScanDescription({ productCode: item.productCode }, audit.expected, stock)).toLowerCase().includes(query));
}

function sortAuditRows(rows, mode, describe) {
  const [field, direction] = mode.split("-");
  const sign = direction === "desc" ? -1 : 1;
  const collator = new Intl.Collator("my", { numeric: true, sensitivity: "base" });
  return rows.map((row) => ({ row, value: describe(row) })).sort((a, b) => {
    const left = a.value[field], right = b.value[field];
    const missingLeft = left === undefined || left === null || left === "";
    const missingRight = right === undefined || right === null || right === "";
    if (missingLeft !== missingRight) return missingLeft ? 1 : -1;
    const comparison = missingLeft ? 0 : field === "qty" ? Number(left) - Number(right) : collator.compare(String(left), String(right));
    return comparison * sign || collator.compare(a.value.code || "", b.value.code || "");
  }).map(({ row }) => row);
}

function renderStockAudit() {
  const sessions = [...state.stockAudits].sort((a, b) => String(b.startedAt).localeCompare(String(a.startedAt)));
  if (!sessions.some((audit) => audit.id === selectedStockAuditId)) selectedStockAuditId = sessions[0]?.id || "";
  document.querySelector("#auditSession").innerHTML = sessions.length ? sessions.map((audit) => `<option value="${escapeHtml(audit.id)}" ${audit.id === selectedStockAuditId ? "selected" : ""}>${escapeHtml(new Date(audit.startedAt).toLocaleString())} · ${escapeHtml(inventoryLocationLabel(audit.location))} · ${audit.completedAt ? "ပြီးဆုံး" : "စစ်ဆဲ"}</option>`).join("") : '<option value="">မှတ်တမ်းမရှိသေးပါ</option>';
  const audit = currentStockAudit();
  document.querySelector("#auditSplitPending").hidden = !pendingAuditSplitEnabled || currentStaff()?.role !== "admin";
  document.querySelector("#auditSplitPending").disabled = !pendingAuditSplitEnabled || currentStaff()?.role !== "admin" || !audit?.completedAt || audit.location !== "shop";
  const latest = sessions.find((row) => row.location === document.querySelector("#auditLocation").value);
  const next = latest ? new Date(latest.startedAt) : null;
  if (next) next.setDate(next.getDate() + 5);
  document.querySelector("#auditSchedule").textContent = next ? `နောက်တစ်ကြိမ် စစ်ရန်: ${next.toLocaleDateString()}${next <= new Date() ? " — စစ်ရန်ရက်ရောက်ပါပြီ" : ""}` : "၅ ရက်တစ်ကြိမ် stock စစ်ဆေးရန်";
  const closed = !audit || Boolean(audit.completedAt) || !hasPermission("inventory");
  document.querySelector("#auditEdit").hidden = currentStaff()?.role !== "admin";
  document.querySelector("#auditEdit").disabled = currentStaff()?.role !== "admin" || !audit;
  document.querySelector("#auditDelete").hidden = currentStaff()?.role !== "admin";
  document.querySelector("#auditDelete").disabled = currentStaff()?.role !== "admin" || !audit;
  document.querySelector("#auditPdf").hidden = currentStaff()?.role !== "admin";
  document.querySelector("#auditPdf").disabled = currentStaff()?.role !== "admin" || !audit?.completedAt;
  for (const id of ["auditBarcode", "auditScanButton", "auditFinish"]) document.getElementById(id).disabled = closed;
  document.querySelector("#auditQty").disabled = closed;
  const captured = state.stockAuditScans.filter((scan) => scan.auditId === audit?.id);
  if (addScannedLiveStockToAudit(audit, captured, state.stock)) saveState();
  const report = audit ? reconcileStockAudit(audit, captured) : { matched: [], exceptions: [] };
  const scans = new Map(report.matched.map((scan) => [scan.stockId, scan]));
  const expected = audit?.expected || [];
  const checked = expected.filter((item) => scans.has(item.stockId)).length;
  const pending = Math.max(0, expected.length - checked);
  const progress = expected.length ? Math.round((checked / expected.length) * 100) : 0;
  document.querySelector("#auditPendingCount").textContent = String(pending);
  document.querySelector("#auditCheckedCount").textContent = String(checked);
  document.querySelector("#auditExceptionCount").textContent = String(report.exceptions.length);
  document.querySelector("#auditTotalCount").textContent = String(expected.length);
  document.querySelector("#auditProgressBar").style.width = `${progress}%`;
  const filter = document.querySelector("#auditFilter").value;
  document.querySelectorAll("[data-audit-filter]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.auditFilter === filter);
    button.setAttribute("aria-pressed", button.dataset.auditFilter === filter ? "true" : "false");
  });
  const sortMode = document.querySelector("#auditSort").value;
  const search = document.querySelector("#auditSearch").value.trim().toLowerCase();
  const describeScan = (scan) => ({
    code: scan.productCode || expected.find((item) => item.stockId === scan.stockId)?.productCode || "",
    name: stockAuditScanDescription(scan, expected, state.stock),
    qty: scan.countedQuantity,
    time: scan.scannedAt,
  });
  document.querySelector("#auditFilter").disabled = !audit;
  const exceptionBox = document.querySelector("#auditExceptions");
  exceptionBox.classList.toggle("is-warning", report.exceptions.length > 0);
  exceptionBox.textContent = report.exceptions.length
    ? `⚠ ပြန်စစ်ရန် ${report.exceptions.length} ခုရှိသည် — အပေါ်က “ပြန်စစ်ရန်” ကတ်ကိုနှိပ်ပြီး ကြည့်ပါ။`
    : audit ? "✓ ပြန်စစ်ရန် Scan မရှိပါ။" : "";
  document.querySelector("#auditTotals").textContent = !audit
    ? "စစ်ဆေးမှု စမည် ကိုနှိပ်ပြီး စတင်ပါ။"
    : pending === 0 && report.exceptions.length === 0
      ? `✓ အားလုံး Scan ပြီးပါပြီ · ${checked}/${expected.length} (100%)${audit.completedAt ? " · စစ်ဆေးမှု အပြီးသတ်ပြီး" : " · အပြီးသတ်နိုင်ပါပြီ"}`
      : `စစ်ပြီး ${checked}/${expected.length} (${progress}%) · မစစ်ရသေး ${pending}${report.exceptions.length ? ` · ပြန်စစ်ရန် ${report.exceptions.length}` : ""}`;
  document.querySelector("#auditFinish").classList.toggle("secondary", pending > 0 || report.exceptions.length > 0);

  const stockById = new Map(state.stock.map((item) => [item.id, item]));
  const visibleExpected = filter === "exceptions" ? [] : expected.filter((item) => filter === "all" || (filter === "checked" ? scans.has(item.stockId) : !scans.has(item.stockId)));
  const rows = sortAuditRows(visibleExpected
    .filter((item) => `${item.productCode} ${stockAuditScanDescription({productCode:item.productCode}, expected, state.stock)}`.toLowerCase().includes(search))
    , sortMode, (item) => ({ code: item.productCode, name: item.description, qty: scans.get(item.stockId)?.countedQuantity, time: scans.get(item.stockId)?.scannedAt }));
  const expectedHtml = rows.map((item) => {
    const scan = scans.get(item.stockId);
    const live = stockById.get(item.stockId);
    const liveText = !live ? "လက်ရှိ stock တွင်မရှိတော့" : `${live.status} · ${inventoryLocationLabel(live.inventoryLocation)}${live.itemType === "sku" ? ` · Qty ${Number(live.quantityAvailable || 0)}` : ""}`;
    const editActions = scan && canEditAuditScans(audit, currentStaff()?.role)
      ? `<button type="button" class="button secondary" data-edit-audit-scan="${escapeHtml(scan.id)}">Edit</button>${currentStaff()?.role === "admin" ? ` <button type="button" class="button secondary audit-delete-button" data-remove-audit-scan="${escapeHtml(scan.id)}">Delete</button>` : ""}`
      : "";
    const action = !scan && !audit.completedAt
      ? `<button type="button" class="button secondary" data-use-audit-code="${escapeHtml(item.productCode)}">ဒီ Code ကို စစ်မည်</button>`
      : editActions || escapeHtml(liveText);
    return `<tr class="${scan ? "audit-row-checked" : "audit-row-pending"}"><td><strong>${escapeHtml(item.productCode)}</strong></td><td>${escapeHtml(stockAuditScanDescription({productCode:item.productCode}, expected, state.stock))}</td><td>${escapeHtml(item.quantity)}</td><td><span class="audit-status ${scan ? "audit-status-checked" : "audit-status-pending"}">${scan ? "✓ Scan ပြီး" : "○ မစစ်ရသေး"}</span>${scan && item.itemType === "sku" ? `<br><small>${escapeHtml(auditQuantityStatus({ ...item, itemType: item.itemType || live?.itemType }, scan))}</small>` : ""}</td><td>${scan ? `${escapeHtml(new Date(scan.scannedAt).toLocaleString())}<br>${escapeHtml(scan.staffName)}` : "—"}</td><td>${action}</td></tr>`;
  }).join("");
  const visibleExceptions = (filter === "exceptions" || filter === "all")
    ? sortAuditRows(report.exceptions, sortMode, describeScan).filter((scan) => {
      const item = describeScan(scan);
      return (item.code + " " + item.name).toLowerCase().includes(search);
    }) : [];
  const exceptionHtml = visibleExceptions.map((scan) => `<tr class="audit-row-exception"><td><strong>${escapeHtml(scan.productCode || "")}</strong></td><td>${escapeHtml(stockAuditScanDescription(scan, expected, state.stock))}</td><td>—</td><td><span class="audit-status audit-status-exception">! ပြန်စစ်ရန်</span><br><small>${escapeHtml(scan.reason)}</small></td><td>${escapeHtml(new Date(scan.scannedAt).toLocaleString())}<br>${escapeHtml(scan.staffName)}</td><td>${canEditAuditScans(audit, currentStaff()?.role) ? `<button type="button" class="button secondary" data-edit-audit-scan="${escapeHtml(scan.id)}">Edit</button>${currentStaff()?.role === "admin" ? ` <button type="button" class="button secondary audit-delete-button" data-remove-audit-scan="${escapeHtml(scan.id)}">Delete</button>` : ""}` : "စာရင်းနှင့် မကိုက်ပါ"}</td></tr>`).join("");
  const emptyMessage = !audit ? "စစ်ဆေးမှု မစတင်ရသေးပါ။" : search ? "ရှာထားသော Code / ပစ္စည်း မတွေ့ပါ။" : filter === "pending" ? "✓ မစစ်ရသေးသော ပစ္စည်းမရှိပါ။" : filter === "checked" ? "Scan ပြီးသော ပစ္စည်းမရှိသေးပါ။" : filter === "exceptions" ? "✓ ပြန်စစ်ရန် မရှိပါ။" : "ဤစာရင်းတွင် ပစ္စည်းမရှိပါ။";
  document.querySelector("#auditRows").innerHTML = expectedHtml + exceptionHtml || `<tr><td colspan="6">${emptyMessage}</td></tr>`;
}

function stockAuditReportHtml(audit, scans, stock = []) {
  const report = reconcileStockAudit(audit, scans);
  const matched = new Map(report.matched.map((scan) => [scan.stockId, scan]));
  const missing = audit.expected.filter((item) => !matched.has(item.stockId));
  const dateText = (value) => value ? new Date(value).toLocaleString("en-GB") : "-";
  const table = (headers, rows) => `<table><thead><tr>${headers.map((cell) => `<th>${escapeHtml(cell)}</th>`).join("")}</tr></thead><tbody>${rows.length ? rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell ?? "-")}</td>`).join("")}</tr>`).join("") : `<tr><td colspan="${headers.length}">မရှိပါ / None</td></tr>`}</tbody></table>`;
  return `<!doctype html><html lang="my"><head><meta charset="utf-8"><title>B3 Stock Audit ${escapeHtml(audit.startedAt.slice(0, 10))}</title><style>
    @page { size: A4; margin: 16mm 13mm; }
    * { box-sizing: border-box; }
    body { font-family: "Myanmar Text", "Noto Sans Myanmar", Arial, sans-serif; font-size: 10pt; line-height: 1.65; color: #222; margin: 0; }
    h1 { font-size: 21pt; margin: 0; color: #503747; } h2 { font-size: 13pt; margin: 20px 0 8px; break-after: avoid; }
    .brand { letter-spacing: 2px; color: #715363; font-size: 10pt; } .meta { margin: 12px 0; }
    .summary { border: 1px solid #c9bbc4; background: #f6f0f4; padding: 12px; font-weight: bold; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; table-layout: fixed; }
    th, td { border: 1px solid #ccc; padding: 7px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    th { background: #f1ebef; } thead { display: table-header-group; } tr { break-inside: avoid; }
    .note { color: #555; font-size: 9pt; } .controls { margin-bottom: 16px; } button { padding: 10px 18px; cursor: pointer; }
    @media print { .controls { display: none; } }
  </style></head><body>
    <div class="controls"><button onclick="window.print()">Print / Save as PDF</button><p>Destination တွင် Save as PDF ကိုရွေးပါ။</p></div>
    <div class="brand">B3 FLORAL EBS</div><h1>Stock စာရင်းစစ် Report</h1>
    <div class="meta">နေရာ: ${escapeHtml(inventoryLocationLabel(audit.location))}<br>
    စတင်ချိန်: ${escapeHtml(dateText(audit.startedAt))} · စတင်သူ: ${escapeHtml(audit.startedBy || "-")}<br>
    ပြီးဆုံးချိန်: ${escapeHtml(dateText(audit.completedAt))} · အတည်ပြုသူ: ${escapeHtml(audit.completedBy || "-")}<br>
    မှတ်တမ်း: ${escapeHtml(audit.id)}</div>
    <div class="summary">ရှိရမည့် Code: ${audit.expected.length} · Code တွေ့ရှိ: ${matched.size} · မတွေ့သေး: ${missing.length} · ပြန်စစ်ရန် Scan: ${report.exceptions.length}</div>
    <p class="note">စစ်ပွဲစချိန်ရှိ စာရင်းနှင့် သိမ်းထားသော scan များကို အခြေခံထားပါသည်။ SKU များအတွက် စစ်တွေ့ Qty နှင့် ကွာခြားချက်ကို ဖော်ပြထားပါသည်။ Qty မထည့်ထားသော မှတ်တမ်းဟောင်းများကို Qty မစစ်ရသေးဟု ပြပါသည်။ မတွေ့သေးခြင်းသည် stock ပျောက်ဆုံးကြောင်း အတည်ပြုခြင်း မဟုတ်ပါ။</p>
    <h2>၁။ မတွေ့သေးသောပစ္စည်း (${missing.length})</h2>
    ${table(["Code", "ပစ္စည်းအမည်", "စတင်ချိန် Qty"], missing.map((item) => [item.productCode, stockAuditScanDescription({productCode:item.productCode}, audit.expected, stock), item.quantity]))}
    <h2>၂။ ပြန်စစ်ရန် Scan (${report.exceptions.length})</h2>
    ${table(["Code", "အကြောင်းရင်း", "Scan ချိန် / ဝန်ထမ်း"], report.exceptions.map((scan) => [scan.productCode, scan.reason, `${dateText(scan.scannedAt)} / ${scan.staffName || "-"}`]))}
    <h2>၃။ Scan တွေ့ရှိသောပစ္စည်း (${matched.size})</h2>
    ${table(["Code", "ပစ္စည်းအမည်", "ရှိရမည့် Qty", "စစ်တွေ့ / ကွာခြားချက်", "Scan ချိန် / ဝန်ထမ်း"], audit.expected.filter((item) => matched.has(item.stockId)).map((item) => { const scan = matched.get(item.stockId); return [item.productCode, stockAuditScanDescription({productCode:item.productCode}, audit.expected, stock), item.quantity, auditQuantityStatus({ ...item, itemType: item.itemType || stock.find((row) => row.id === item.stockId)?.itemType }, scan), `${dateText(scan.scannedAt)} / ${scan.staffName || "-"}`]; }))}
    <p class="note">ပြီးဆုံးမှတ်တမ်း / Completed audit · B3 Floral EBS</p>
  </body></html>`;
}

function printStockAuditReport() {
  if (currentStaff()?.role !== "admin") return;
  const audit = currentStockAudit();
  if (!audit?.completedAt) return;
  const win = window.open("", "_blank");
  if (!win) {
    document.querySelector("#auditFeedback").textContent = "PDF report ဖွင့်ရန် browser popup ကို allow လုပ်ပါ။";
    return;
  }
  win.document.write(stockAuditReportHtml(audit, state.stockAuditScans, state.stock));
  win.document.close();
  win.document.fonts.ready.then(() => { win.focus(); win.print(); });
}

function renderInventory() {
  const inventoryTimestampText = (item) => {
    const value = item?.productionStartedAt || item?.createdAt || "";
    if (!value) return "Time မမှတ်ထားပါ";
    const timestamp = new Date(value);
    if (Number.isNaN(timestamp.getTime())) return String(value);
    return timestamp.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };
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
  const locationFilter = els.inventoryLocationFilter.value;
  const categoryFilter = els.inventoryCategoryFilter.value;
  const subCategoryFilter = els.inventorySubCategoryFilter.value;
  const queryKey = JSON.stringify([keyword, filter, typeFilter, locationFilter, categoryFilter, subCategoryFilter]);
  if (queryKey !== inventoryQueryKey) {
    inventoryQueryKey = queryKey;
    inventoryPage = 1;
  }
  const salesById = new Map(state.sales.map((sale) => [sale.id, sale]));
  const firstSaleByStock = new Map();
  state.sales.forEach((sale) => (sale.items || []).forEach((item) => {
    if (!firstSaleByStock.has(item.stockId)) firstSaleByStock.set(item.stockId, sale);
  }));
  const inventorySale = (item) => (item.saleId && salesById.get(item.saleId)) || firstSaleByStock.get(item.id);

  const rows = state.stock
    .filter((item) => filter === "all" || item.status === filter)
    .filter((item) => typeFilter === "all" || (typeFilter === "sku" ? item.itemType === "sku" : item.itemType !== "sku"))
    .filter((item) => locationFilter === "all" || (item.inventoryLocation === "pending" ? "pending" : "shop") === locationFilter)
    .filter((item) => !categoryFilter || item.category === categoryFilter)
    .filter((item) => !subCategoryFilter || item.subCategory === subCategoryFilter)
    .filter((item) => {
      if (!keyword) return true;
      const voucher = inventorySale(item);
      const text = `${item.productCode} ${item.description} ${item.category} ${item.subCategory} ${item.paperColor} ${item.florist} ${item.itemType} ${item.productionDate} ${item.productionStartedAt || ""} ${item.createdAt || ""} ${inventoryTimestampText(item)} ${inventoryLocationLabel(item.inventoryLocation)} ${voucher?.salePerson || "-"} ${voucher?.voucherNumber || ""}`.toLowerCase();
      return text.includes(keyword);
    })
    .sort((a, b) => {
      const aKey = a.createdAt || a.productionDate || "";
      const bKey = b.createdAt || b.productionDate || "";
      const dateCompare = String(bKey).localeCompare(String(aKey));
      if (dateCompare) return dateCompare;
      return String(b.productCode || "").localeCompare(String(a.productCode || ""));
    });

  const pageCount = Math.max(1, Math.ceil(rows.length / INVENTORY_PAGE_SIZE));
  inventoryPage = Math.max(1, Math.min(inventoryPage, pageCount));
  const pageStart = (inventoryPage - 1) * INVENTORY_PAGE_SIZE;
  document.querySelector("#inventoryPageInfo").textContent = rows.length
    ? `${pageStart + 1}–${Math.min(pageStart + INVENTORY_PAGE_SIZE, rows.length)} / ${rows.length} · Page ${inventoryPage} / ${pageCount}`
    : "0 records";
  document.querySelector("#inventoryPreviousPage").disabled = inventoryPage <= 1;
  document.querySelector("#inventoryNextPage").disabled = inventoryPage >= pageCount;
  if (!rows.length) {
    els.inventoryTable.innerHTML = `<tr><td colspan="15"><div class="empty">Stock record မရှိသေးပါ</div></td></tr>`;
    return;
  }

  els.inventoryTable.innerHTML = rows
    .slice(pageStart, pageStart + INVENTORY_PAGE_SIZE)
    .map(
      (item) => {
        const isSku = item.itemType === "sku";
        const isCashDenomination = isCashInventoryItem(item);
        const qtyText = isCashDenomination ? "Non-stock" : isSku ? `${Number(item.quantityAvailable || 0)} / ${Number(item.quantityTotal || 0)}` : "1";
        const cashCost = stockUnitCost(item);
        const costText = isSku
          ? isCashDenomination
            ? `${money(cashCost)}<br><span class="muted">Bouquet cash only</span>`
            : `${money(cashCost)}<br><span class="muted">Total ${money(cashCost * Number(item.quantityTotal || 0))}</span>`
          : money(cashCost);
        const statusText = isCashDenomination ? "non-stock" : isSku ? (Number(item.quantityAvailable || 0) > 0 ? "available" : "sold") : item.status;
        const voucher = !isSku && item.status === "sold" ? inventorySale(item) : null;
        const voucherCell =
          voucher && hasPermission("vouchers")
            ? `<button class="text-button" type="button" data-inventory-voucher="${voucher.id}">${escapeHtml(voucher.voucherNumber)}</button>`
            : escapeHtml(voucher?.voucherNumber || "-");
        return `
        <tr>
          <td class="inventory-photo-cell">
            ${item.photo?.key
              ? `<button class="inventory-photo-button" type="button" data-action="photo" data-id="${escapeHtml(item.id)}" title="${escapeHtml(item.productCode)} ပုံကြည့်ရန်"><img src="${escapeHtml(stockPhotoUrl(item.photo))}" alt="${escapeHtml(item.productCode)} ပန်းစည်းပုံ" loading="lazy" /></button>`
              : `<span class="inventory-photo-empty" title="Photo မရှိပါ" aria-label="Photo မရှိပါ">—</span>`}
          </td>
          <td><strong>${escapeHtml(item.productCode)}</strong></td>
          <td><span class="stock-badge ${isSku ? "sku" : ""}">${isSku ? "SKU" : "Floral"}</span></td>
          <td class="inventory-production-time">
            <strong>${escapeHtml(item.productionDate)}</strong>
            <span>${escapeHtml(inventoryTimestampText(item))}</span>
          </td>
          <td>${escapeHtml(item.description)}</td>
          <td>${escapeHtml(item.category)}<br><span class="muted">${escapeHtml(item.subCategory || item.paperColor)}</span></td>
          <td>${escapeHtml(qtyText)}</td>
          <td>${costText}</td>
          <td>${money(item.salePrice)}</td>
          <td>${escapeHtml(isSku ? "Purchase" : item.florist)}</td>
          <td>${escapeHtml(!isSku && item.status === "sold" ? voucher?.salePerson || "-" : "-")}</td>
          <td>${voucherCell}</td>
          <td><span class="stock-badge inventory-location ${item.inventoryLocation === "pending" ? "pending" : "shop"}">${escapeHtml(inventoryLocationLabel(item.inventoryLocation))}</span></td>
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
                  ? `<button class="text-button inventory-move-button" type="button" data-action="move-inventory" data-id="${item.id}">${item.inventoryLocation === "pending" ? "ဆိုင်သို့ပို့" : "မရောက်သေးသို့ရွှေ့"}</button>`
                  : ""
              }
              ${
                item.status === "available" && hasPermission("stock")
                  ? `<button class="icon-button danger" type="button" data-action="delete" data-id="${item.id}" title="Delete stock">${lucideMarkup("trash-2")}</button>`
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
function dailyTransferPaymentChannel(paymentType) {
  const normalized = String(paymentType || "").trim().toLowerCase().replace(/[\s_-]+/g, "");
  return {
    cash: "cash",
    kpay: "kpay",
    kbzpay: "kpay",
    ayapay: "aya_pay",
    aya: "aya_pay",
    wave: "wave",
    wavepay: "wave",
    banking: "banking",
    bank: "banking",
    banktransfer: "banking",
  }[normalized] || "";
}

function dailyTransferBreakdown(transferDate, includeEmpty = false) {
  const rowsByChannel = new Map([
    ["cash", { businessChannel: "cash", label: "Cash", received: 0, expense: 0 }],
    ["kpay", { businessChannel: "kpay", label: "KPay", received: 0, expense: 0 }],
    ["aya_pay", { businessChannel: "aya_pay", label: "AYA Pay", received: 0, expense: 0 }],
    ["wave", { businessChannel: "wave", label: "Wave", received: 0, expense: 0 }],
    ["banking", { businessChannel: "banking", label: "Banking", received: 0, expense: 0 }],
  ]);
  allPayments()
    .filter((payment) => payment.paymentDate === transferDate)
    .forEach((payment) => {
      const channel = dailyTransferPaymentChannel(payment.paymentType);
      if (rowsByChannel.has(channel)) rowsByChannel.get(channel).received += Number(payment.amount || 0);
    });
  (state.expenses || [])
    .filter((expense) => expense.expenseDate === transferDate)
    .forEach((expense) => {
      const channel = dailyTransferPaymentChannel(expensePaidBy(expense));
      if (rowsByChannel.has(channel)) rowsByChannel.get(channel).expense += Number(expense.amount || 0);
    });
  return [...rowsByChannel.values()]
    .map((row) => ({ ...row, adjustment: 0, adjustmentNote: "", net: row.received - row.expense }))
    .filter((row) => includeEmpty || row.received !== 0 || row.expense !== 0);
}

function dailyTransferForDate(transferDate) {
  return (state.adminDailyTransfers || []).find((transfer) => transfer.transferDate === transferDate);
}

function dailyTransferFingerprint(rows) {
  return JSON.stringify((rows || [])
    .filter((row) => Number(row.received || 0) !== 0 || Number(row.expense || 0) !== 0)
    .map((row) => [
      row.businessChannel,
      Number(row.received || 0),
      Number(row.expense || 0),
    ]));
}

function dailyTransferEditableRows(transferDate) {
  const completed = dailyTransferForDate(transferDate);
  const completedByChannel = new Map((completed?.rows || []).map((row) => [row.businessChannel, row]));
  return dailyTransferBreakdown(transferDate, true).map((row) => {
    const saved = completedByChannel.get(row.businessChannel) || {};
    const adjustment = Number(saved.adjustment || 0);
    return {
      ...row,
      adjustment,
      adjustmentNote: saved.adjustmentNote || "",
      net: row.received - row.expense + adjustment,
    };
  });
}

function dailyTransferRowsFromEditor(transferDate) {
  return dailyTransferBreakdown(transferDate, true).map((row) => {
    const adjustmentInput = els.dailyTransferPreview.querySelector(`[data-daily-transfer-adjustment="${row.businessChannel}"]`);
    const noteInput = els.dailyTransferPreview.querySelector(`[data-daily-transfer-note="${row.businessChannel}"]`);
    const adjustment = Number(adjustmentInput?.value || 0);
    return {
      ...row,
      adjustment,
      adjustmentNote: noteInput?.value.trim() || "",
      net: row.received - row.expense + adjustment,
    };
  });
}

function updateDailyTransferPreviewTotals() {
  if (!els.dailyTransferPreview) return;
  let totalAdjustment = 0;
  let totalNet = 0;
  els.dailyTransferPreview.querySelectorAll("[data-daily-transfer-row]").forEach((rowElement) => {
    const channel = rowElement.dataset.dailyTransferRow;
    const received = Number(rowElement.dataset.received || 0);
    const expense = Number(rowElement.dataset.expense || 0);
    const adjustment = Number(els.dailyTransferPreview.querySelector(`[data-daily-transfer-adjustment="${channel}"]`)?.value || 0);
    const net = received - expense + adjustment;
    totalAdjustment += adjustment;
    totalNet += net;
    const netCell = rowElement.querySelector("[data-daily-transfer-net]");
    if (netCell) {
      netCell.textContent = money(net);
      netCell.classList.toggle("is-negative", net < 0);
    }
  });
  const adjustmentTotal = els.dailyTransferPreview.querySelector("[data-daily-transfer-adjustment-total]");
  const netTotal = els.dailyTransferPreview.querySelector("[data-daily-transfer-net-total]");
  if (adjustmentTotal) adjustmentTotal.textContent = money(totalAdjustment);
  if (netTotal) netTotal.textContent = money(totalNet);
  const transferDate = els.summaryDate.value || today;
  const rows = dailyTransferRowsFromEditor(transferDate);
  const hasActivity = rows.some((row) => row.received !== 0 || row.expense !== 0 || row.adjustment !== 0);
  els.dailyTransferButton.disabled = !hasActivity || transferDate < ADMIN_CASH_START_DATE || transferDate > today;
}

function renderDailyTransferPanel() {
  if (!els.dailyTransferPanel) return;
  const transferDate = els.summaryDate.value || today;
  const isAdminDayView = currentStaff()?.role === "admin" && reportMode === "day";
  els.dailyTransferPanel.hidden = !isAdminDayView;
  if (!isAdminDayView) return;

  const rows = dailyTransferEditableRows(transferDate);
  const completed = dailyTransferForDate(transferDate);
  const sourceRows = dailyTransferBreakdown(transferDate);
  const sourceChanged = completed && dailyTransferFingerprint(completed.rows) !== dailyTransferFingerprint(sourceRows);
  const totalReceived = rows.reduce((sum, row) => sum + row.received, 0);
  const totalExpense = rows.reduce((sum, row) => sum + row.expense, 0);
  const totalAdjustment = rows.reduce((sum, row) => sum + row.adjustment, 0);
  const totalNet = totalReceived - totalExpense + totalAdjustment;
  els.dailyTransferPreview.innerHTML = `<div class="table-wrap"><table class="compact-record-table daily-transfer-table">
        <thead><tr><th>Account</th><th>Received</th><th>Expense အရင်နုတ်</th><th>Adjustment (+/−)</th><th>မှတ်ချက်</th><th>Net Transfer</th></tr></thead>
        <tbody>${rows.map((row) => `<tr data-daily-transfer-row="${row.businessChannel}" data-received="${row.received}" data-expense="${row.expense}">
          <td><strong>${escapeHtml(row.label)}</strong></td>
          <td>${money(row.received)}</td>
          <td>${money(row.expense)}</td>
          <td><input class="daily-transfer-adjustment-input" type="number" step="1" value="${row.adjustment || ""}" placeholder="+ / −" data-daily-transfer-adjustment="${row.businessChannel}" aria-label="${escapeHtml(row.label)} adjustment" /></td>
          <td><input class="daily-transfer-note-input" value="${escapeHtml(row.adjustmentNote)}" placeholder="လျော့ငွေ / အမည်မသိအဝင်" data-daily-transfer-note="${row.businessChannel}" aria-label="${escapeHtml(row.label)} adjustment note" /></td>
          <td><strong class="${row.net < 0 ? "is-negative" : ""}" data-daily-transfer-net>${money(row.net)}</strong></td>
        </tr>`).join("")}</tbody>
        <tfoot><tr><th>Total</th><th>${money(totalReceived)}</th><th>${money(totalExpense)}</th><th data-daily-transfer-adjustment-total>${money(totalAdjustment)}</th><th></th><th data-daily-transfer-net-total>${money(totalNet)}</th></tr></tfoot>
      </table></div>`;

  const beforeStart = transferDate < ADMIN_CASH_START_DATE;
  const futureDate = transferDate > today;
  const hasActivity = rows.some((row) => row.received !== 0 || row.expense !== 0 || row.adjustment !== 0);
  els.dailyTransferButton.disabled = !hasActivity || beforeStart || futureDate;
  els.dailyTransferButton.textContent = completed ? "Reconciliation ပြင်ပြီး Update လုပ်မယ်" : "Daily Transfer လုပ်မယ်";
  if (sourceChanged) {
    els.dailyTransferStatus.textContent = "Transfer ပြီးနောက် စာရင်းပြောင်းထားသည်";
    els.dailyTransferStatus.dataset.state = "error";
  } else if (completed) {
    els.dailyTransferStatus.textContent = `${completed.updatedBy || completed.createdBy || "Admin"} · Transfer ပြီး / Edit ရ`;
    els.dailyTransferStatus.dataset.state = "ok";
  } else if (beforeStart) {
    els.dailyTransferStatus.textContent = `${ADMIN_CASH_START_DATE} မှစတင်ပါ`;
    els.dailyTransferStatus.dataset.state = "error";
  } else if (futureDate) {
    els.dailyTransferStatus.textContent = "အနာဂတ်ရက်ကို Transfer မလုပ်နိုင်ပါ";
    els.dailyTransferStatus.dataset.state = "error";
  } else {
    els.dailyTransferStatus.textContent = "စာရင်းကိုက်လျှင် Transfer နှိပ်ပါ";
    els.dailyTransferStatus.dataset.state = "";
  }
  els.dailyTransferPreview.querySelectorAll("[data-daily-transfer-adjustment], [data-daily-transfer-note]").forEach((input) => {
    input.addEventListener("input", () => {
      updateDailyTransferPreviewTotals();
      els.dailyTransferStatus.textContent = completed ? "ပြင်ဆင်ထားသည် · Update နှိပ်ပါ" : "Adjustment ထည့်ထားသည်";
      els.dailyTransferStatus.dataset.state = "";
    });
  });
}

function transferDailySummary() {
  if (currentStaff()?.role !== "admin" || reportMode !== "day") return;
  const transferDate = els.summaryDate.value || today;
  if (transferDate < ADMIN_CASH_START_DATE || transferDate > today) return;
  const existing = dailyTransferForDate(transferDate);
  const rows = dailyTransferRowsFromEditor(transferDate)
    .filter((row) => row.received !== 0 || row.expense !== 0 || row.adjustment !== 0);
  if (!rows.length) return;
  const totalReceived = rows.reduce((sum, row) => sum + row.received, 0);
  const totalExpense = rows.reduce((sum, row) => sum + row.expense, 0);
  const totalAdjustment = rows.reduce((sum, row) => sum + row.adjustment, 0);
  const totalNet = totalReceived - totalExpense + totalAdjustment;
  const actionLabel = existing ? "Reconciliation ကိုပြင်ပြီး Cash Management စာရင်း Update လုပ်မည်" : "စာရင်းကို Cash Management သို့ Transfer လုပ်မည်";
  const ok = confirm(`${transferDate} ${actionLabel}။\nReceived ${money(totalReceived)} - Expense ${money(totalExpense)} + Adjustment ${money(totalAdjustment)} = Net ${money(totalNet)}\nသေချာပါသလား?`);
  if (!ok) return;

  const transferId = `daily-transfer-${transferDate}`;
  const now = new Date().toISOString();
  const createdAt = existing?.createdAt || now;
  const createdBy = currentStaff()?.name || "Admin";
  const ledgerRows = [];
  rows.forEach((row) => {
    if (row.expense > 0) {
      ledgerRows.push({
        id: `${transferId}-${row.businessChannel}-expense`,
        saleDate: transferDate,
        settlementType: "expense_shortfall",
        businessChannel: row.businessChannel,
        amount: row.expense,
        note: `Daily Transfer ${transferDate} · Expense အရင်နုတ်`,
        dailyTransferId: transferId,
        createdAt,
        updatedAt: now,
        createdBy,
      });
    }
    if (row.received > 0) {
      ledgerRows.push({
        id: `${transferId}-${row.businessChannel}-received`,
        saleDate: transferDate,
        settlementType: "deposit",
        businessChannel: row.businessChannel,
        amount: row.received,
        note: `Daily Transfer ${transferDate} · Received ပေါင်း`,
        dailyTransferId: transferId,
        createdAt,
        updatedAt: now,
        createdBy,
      });
    }
    if (row.adjustment !== 0) {
      ledgerRows.push({
        id: `${transferId}-${row.businessChannel}-adjustment`,
        saleDate: transferDate,
        settlementType: row.adjustment < 0 ? "expense_shortfall" : "deposit",
        businessChannel: row.businessChannel,
        amount: Math.abs(row.adjustment),
        note: `Daily Reconciliation Adjustment · ${row.adjustmentNote || (row.adjustment < 0 ? "လျော့ငွေ" : "အမည်မသိအဝင်")}`,
        dailyTransferId: transferId,
        createdAt,
        updatedAt: now,
        createdBy,
      });
    }
  });
  state.adminDailyCashSales = state.adminDailyCashSales.filter((item) => item.dailyTransferId !== transferId);
  state.adminDailyCashSales.unshift(...ledgerRows);
  state.adminDailyTransfers = state.adminDailyTransfers.filter((item) => item.id !== transferId);
  state.adminDailyTransfers.unshift({
    id: transferId,
    transferDate,
    rows,
    totalReceived,
    totalExpense,
    totalAdjustment,
    totalNet,
    createdAt,
    createdBy: existing?.createdBy || createdBy,
    updatedAt: now,
    updatedBy: createdBy,
  });
  saveState();
  renderAll();
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
  renderExpenseCategorySummary(expenses);
  renderExpensePaymentSummary(expenses);
  renderReportInsights();
  renderDailyTransferPanel();
}

function financeRowsAfterOpening(rows, account, dateKey) {
  if (!account.openingDate) return rows;
  return rows.filter((row) => String(row[dateKey] || "") >= account.openingDate);
}

function payablePaid(payable) {
  return (payable.payments || []).reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function payableBalance(payable) {
  return Math.max(0, Number(payable.totalAmount || 0) - payablePaid(payable));
}

function allPayablePayments() {
  return state.financePayables.flatMap((payable) =>
    (payable.payments || []).map((payment) => ({
      ...payment,
      payableId: payable.id,
      supplier: payable.supplier,
      description: payable.description,
    }))
  );
}

function financeAccountSnapshot(account) {
  const payments = financeRowsAfterOpening(
    allPayments().filter((payment) => payment.paymentType === account.name),
    account,
    "paymentDate"
  );
  const expenses = financeRowsAfterOpening(
    state.expenses.filter((expense) => expensePaidBy(expense) === account.name),
    account,
    "expenseDate"
  );
  const received = paymentTotal(payments);
  const outgoing = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const opening = Number(account.openingBalance || 0);
  return { opening, received, outgoing, balance: opening + received - outgoing };
}

function currentInventoryValue() {
  return state.stock.reduce((sum, item) => {
    if (isCashInventoryItem(item)) return sum;
    if (item.itemType === "sku") {
      return sum + Number(item.quantityAvailable || 0) * stockUnitCost(item);
    }
    return item.status === "available" ? sum + stockUnitCost(item) : sum;
  }, 0);
}

function financePeriodLabel(monthValue) {
  if (!/^\d{4}-\d{2}$/.test(monthValue || "")) return "All records";
  const [year, month] = monthValue.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1));
}

function renderFinanceOpeningForm(accountName = els.financeOpeningAccount?.value) {
  if (!els.financeOpeningForm) return;
  const account = state.financeAccounts.find((item) => item.name === accountName) || state.financeAccounts[0];
  if (!account) return;
  els.financeOpeningAccount.value = account.name;
  els.financeOpeningForm.openingDate.value = account.openingDate || "";
  els.financeOpeningForm.openingBalance.value = Number(account.openingBalance || 0);
}

function renderFinancePayables() {
  if (!els.financePayableRows) return;
  const rows = state.sales
    .filter((sale) => voucherCostPayable(sale) > 0)
    .slice()
    .sort((a, b) => String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b))));
  els.financePayableStatus.textContent = `${rows.length} open`;

  els.financePayableRows.innerHTML = rows.length
    ? rows
        .map((sale) => {
          const dueDate = fulfillmentDueDate(sale);
          const isOverdue = isFulfillmentOverdue(sale);
          return `
            <tr class="${isOverdue ? "payable-overdue" : ""}">
              <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.salePerson || "-")} · ${escapeHtml(sale.saleDate || "-")}</span></td>
              <td>${escapeHtml(dueDate || "-")}</td>
              <td>${money(sale.totalPrice)}</td>
              <td><strong>${money(voucherCostPayable(sale))}</strong></td>
              <td><span class="stock-badge sold">${isOverdue ? "Overdue" : "Open"}</span></td>
            </tr>`;
        })
        .join("")
    : `<tr><td colspan="5"><div class="empty">ပစ္စည်းမပေးရသေးတဲ့ Voucher Cost မရှိပါ</div></td></tr>`;
}

function renderAccountantFinanceDetails() {
  if (!els.financeAccountantReceivableRows || !els.financeAccountantPayableRows) return;

  const receivableRows = state.sales
    .filter((sale) => saleBalance(sale) > 0)
    .slice()
    .sort((a, b) => String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b))));
  els.financeAccountantReceivableRows.innerHTML = receivableRows.length
    ? receivableRows
        .map(
          (sale) => `
            <tr>
               <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.saleDate || "-")} · ${escapeHtml(sale.salePerson || "-")}</span></td>
              <td>${escapeHtml(sale.customerName || "-")}${sale.customerPhone ? `<br><span class="muted">${escapeHtml(sale.customerPhone)}</span>` : ""}</td>
              <td>${escapeHtml(fulfillmentDueDate(sale) || "-")}</td>
              <td>${money(sale.totalPrice)}</td>
              <td>${money(salePaid(sale))}</td>
              <td><strong class="receivable-balance">${money(saleBalance(sale))}</strong></td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="6"><div class="empty">Receivable Voucher မရှိပါ</div></td></tr>`;

  const payableRows = state.sales
    .filter((sale) => voucherCostPayable(sale) > 0)
    .slice()
    .sort((a, b) => String(fulfillmentDueDate(a)).localeCompare(String(fulfillmentDueDate(b))));
  els.financeAccountantPayableRows.innerHTML = payableRows.length
    ? payableRows
        .map(
          (sale) => `
            <tr>
               <td>${voucherPopupButton(sale)}<br><span class="muted">${escapeHtml(sale.saleDate || "-")} · ${escapeHtml(sale.salePerson || "-")}</span></td>
              <td>${escapeHtml(sale.customerName || "-")}</td>
              <td>${escapeHtml(fulfillmentDueDate(sale) || "-")}</td>
              <td>${money(sale.totalPrice)}</td>
              <td><strong>${money(voucherCostPayable(sale))}</strong></td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="5"><div class="empty">Payable Voucher မရှိပါ</div></td></tr>`;
}

function addFinancePayable(form) {
  const totalAmount = Number(form.totalAmount.value || 0);
  if (totalAmount <= 0) return;
  state.financePayables.unshift({
    id: uid("payable"),
    orderDate: form.orderDate.value || today,
    dueDate: form.dueDate.value || "",
    supplier: form.supplier.value.trim(),
    description: form.description.value.trim(),
    totalAmount,
    payments: [],
    createdAt: new Date().toISOString(),
  });
  saveState();
  form.reset();
  form.orderDate.value = today;
  renderFinance();
}

function addFinancePayablePayment(form) {
  const payable = state.financePayables.find((item) => item.id === form.payableId.value);
  const amount = Number(form.amount.value || 0);
  if (!payable || amount <= 0) return;
  const balance = payableBalance(payable);
  if (amount > balance) {
    alert(`ပေးရန်ကျန် ${money(balance)} ထက် မကျော်ရပါ`);
    return;
  }
  payable.payments.push({
    id: uid("payable-payment"),
    paymentDate: form.paymentDate.value || today,
    account: form.account.value || "Cash",
    amount,
  });
  saveState();
  form.amount.value = "";
  form.paymentDate.value = today;
  renderFinance();
}

function deleteFinancePayable(id) {
  const payable = state.financePayables.find((item) => item.id === id);
  if (!payable) return;
  const ok = confirm(`${payable.supplier} · ${payable.description} payable record ကိုဖျက်မည်။ သေချာပါသလား?`);
  if (!ok) return;
  state.financePayables = state.financePayables.filter((item) => item.id !== id);
  saveState();
  renderFinance();
}

function renderFinance() {
  if (!els.financeMonth || !els.financeAccountRows) return;
  const month = els.financeMonth.value || currentMonth;
  const sales = state.sales.filter((sale) => String(sale.saleDate || "").slice(0, 7) === month);
  const expenses = state.expenses.filter((expense) => String(expense.expenseDate || "").slice(0, 7) === month);
  const payments = allPayments().filter((payment) => String(payment.paymentDate || "").slice(0, 7) === month);
  const revenue = sales.reduce((sum, sale) => sum + Number(sale.totalPrice || 0), 0);
  const cogs = soldItemCostForSales(sales);
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const grossProfit = revenue - cogs;
  const netProfit = grossProfit - expenseTotal;
  const receivable = state.sales.reduce((sum, sale) => sum + saleBalance(sale), 0);
  const payable = state.sales.reduce((sum, sale) => sum + voucherCostPayable(sale), 0);
  const netPosition = receivable - payable;
  const accountRows = state.financeAccounts.map((account) => ({ account, ...financeAccountSnapshot(account) }));
  const accountTotal = accountRows.reduce((sum, row) => sum + row.balance, 0);

  els.financeAccountsTotal.textContent = money(accountTotal);
  els.financeRevenue.textContent = money(revenue);
  els.financeGrossProfit.textContent = money(grossProfit);
  els.financeNetProfit.textContent = money(netProfit);
  els.financeReceivable.textContent = money(receivable);
  els.financePayable.textContent = money(payable);
  els.financeNetPosition.textContent = money(netPosition);
  els.financeInventoryValue.textContent = money(currentInventoryValue());
  els.pnlRevenue.textContent = money(revenue);
  els.pnlCogs.textContent = money(cogs);
  els.pnlGrossProfit.textContent = money(grossProfit);
  els.pnlExpense.textContent = money(expenseTotal);
  els.pnlNetProfit.textContent = money(netProfit);
  els.financeCashReceived.textContent = money(paymentTotal(payments));
  els.financePnlPeriod.textContent = financePeriodLabel(month);

  document.querySelector(".finance-metric--balance")?.classList.toggle("is-negative", accountTotal < 0);
  document.querySelector(".finance-metric--profit")?.classList.toggle("is-negative", netProfit < 0);
  document.querySelector(".finance-metric--position")?.classList.toggle("is-negative", netPosition < 0);
  els.pnlNetProfit.closest(".pnl-total")?.classList.toggle("is-negative", netProfit < 0);

  els.financeAccountRows.innerHTML = accountRows
    .map(
      ({ account, opening, received, outgoing, balance }) => `
        <tr class="${balance < 0 ? "is-negative" : ""}">
          <td><span class="finance-account-name"><strong>${escapeHtml(account.name)}</strong><small>${account.openingDate ? `From ${escapeHtml(account.openingDate)}` : "All records"}</small></span></td>
          <td>${money(opening)}</td>
          <td>${money(received)}</td>
          <td>${money(outgoing)}</td>
          <td>${money(balance)}</td>
        </tr>`
    )
    .join("");

  const expenseGrouped = groupSum(expenses, (expense) => expense.category || "Uncategorized", (expense) => expense.amount);
  const expenseEntries = Object.entries(expenseGrouped).sort((a, b) => Number(b[1]) - Number(a[1]));
  els.financeExpenseBreakdown.innerHTML = expenseEntries.length
    ? expenseEntries
        .map(([category, amount]) => `<div class="mini-row"><span>${escapeHtml(category)}</span><strong>${money(amount)}</strong></div>`)
        .join("")
    : `<div class="empty">ဒီလအတွက် expense record မရှိသေးပါ</div>`;

  if (!els.financeOpeningAccount.options.length) {
    populateSelect(
      els.financeOpeningAccount,
      state.financeAccounts.map((account) => ({ value: account.name, label: account.name }))
    );
    renderFinanceOpeningForm(state.financeAccounts[0]?.name);
  }
  renderAccountantFinanceDetails();
  renderFinancePayables();
}

function saveFinanceOpeningBalance(form) {
  const account = state.financeAccounts.find((item) => item.name === form.account.value);
  if (!account) return;
  account.openingDate = form.openingDate.value || "";
  account.openingBalance = Number(form.openingBalance.value || 0);
  saveState();
  renderFinance();
}

function openSoldCostDetails() {
  const sales = state.sales
    .filter((sale) => isInPeriod(saleCostDate(sale)))
    .sort((a, b) => byDateDesc(a, b, "saleDate"));
  const rows = sales.flatMap((sale) => {
    const itemRows = (sale.items || [])
      .map((item) => ({ sale, item, cost: saleItemCost(item) }))
      .filter((row) => row.cost > 0);
    if (itemRows.length) return itemRows;
    const legacyCost = saleProductionCost(sale);
    return legacyCost > 0 ? [{ sale, item: null, cost: legacyCost }] : [];
  });
  const total = rows.reduce((sum, row) => sum + Number(row.cost || 0), 0);
  els.soldCostBody.innerHTML = rows.length
    ? `<div class="table-wrap">
        <table class="compact-record-table">
          <thead><tr><th>Voucher</th><th>Date</th><th>Product Code</th><th>Item</th><th>COGS</th></tr></thead>
          <tbody>${rows.map(({ sale, item, cost }) => `
            <tr>
              <td>${voucherPopupButton(sale)}</td>
              <td>${escapeHtml(saleCostDate(sale) || sale.saleDate || "-")}</td>
              <td><strong>${escapeHtml(item?.productCode || "-")}</strong></td>
              <td>${escapeHtml(item?.description || "Legacy voucher cost")}</td>
              <td><strong>${money(cost)}</strong></td>
            </tr>`).join("")}</tbody>
          <tfoot><tr><th colspan="4">Total Cost of Goods Sold</th><th>${money(total)}</th></tr></tfoot>
        </table>
      </div>`
    : `<div class="empty">ရွေးထားသောကာလအတွက် Cost of Goods Sold မရှိသေးပါ</div>`;
  openModal(els.soldCostModal);
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

function renderExpensePaymentSummary(expenses) {
  if (!els.reportExpensePaymentSummary) return;
  const entries = Object.entries(expenseTotalsByPayment(expenses)).sort((a, b) => Number(b[1]) - Number(a[1]));
  els.reportExpensePaymentSummary.innerHTML = entries.length
    ? entries
        .map(([type, total]) => `<div class="mini-row"><span>${escapeHtml(type)}</span><strong>${money(total)}</strong></div>`)
        .join("")
    : `<div class="empty">ဒီ period အတွက် expense outgoing မရှိသေးပါ</div>`;
}

function renderExpenseCategorySummary(expenses) {
  if (!els.reportExpenseCategorySummary) return;
  const entries = Object.entries(expenseTotalsByCategory(expenses)).sort((a, b) => Number(b[1]) - Number(a[1]));
  els.reportExpenseCategorySummary.innerHTML = entries.length
    ? entries
        .map(([category, total]) => `<div class="mini-row"><span>${escapeHtml(category)}</span><strong>${money(total)}</strong></div>`)
        .join("")
    : `<div class="empty">ဒီ period အတွက် expense category မရှိသေးပါ</div>`;
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
            `<button class="mini-row payment-voucher-row" type="button" data-summary-voucher="${payment.saleId}">
              <span>${escapeHtml(payment.paymentDate)} • ${escapeHtml(payment.voucherNumber)}<br>${escapeHtml(payment.salePerson || "-")}</span>
              <strong>${money(payment.amount)}</strong>
            </button>`
        ),
      ].join("")
    : "";
}

function openPaymentHistoryModal(saleId, editPayments = false) {
  const sale = state.sales.find((item) => item.id === saleId);
  if (!sale) return;
  els.paymentHistoryTitle.textContent = `${sale.voucherNumber || "Voucher"} အကျဉ်းချုပ်`;

  const paymentRows = (sale.payments || [])
    .slice()
    .sort((a, b) => String(a.paymentDate || "").localeCompare(String(b.paymentDate || "")))
    .map(
      (payment) =>
        editPayments
          ? `
            <div class="payment-edit-row" data-payment-row="${payment.id}">
              ${paymentKindBadge(payment, sale)}
              <input type="date" value="${escapeHtml(payment.paymentDate)}" data-payment-field="paymentDate" aria-label="Payment date" />
              <select data-payment-field="paymentType" aria-label="Payment type">
                ${paymentTypes
                  .map((type) => `<option ${payment.paymentType === type ? "selected" : ""}>${type}</option>`)
                  .join("")}
              </select>
              <input type="number" min="1" step="1" value="${Number(payment.amount || 0)}" data-payment-field="amount" aria-label="Payment amount" />
              <div class="payment-edit-actions">
                <button class="button secondary" type="button" data-modal-save-payment="${payment.id}" data-sale-id="${sale.id}">Payment သိမ်းမယ်</button>
                <button class="icon-button danger" type="button" data-modal-delete-payment="${payment.id}" data-sale-id="${sale.id}" title="Delete payment">${lucideMarkup("trash-2")}</button>
              </div>
            </div>
          `
          : `
            <div class="payment-history-row">
              <span>${paymentKindBadge(payment, sale)}<br>${escapeHtml(payment.paymentDate)}<br><small>${escapeHtml(payment.paymentType)}</small></span>
              <strong>${money(payment.amount)}</strong>
            </div>
          `
    )
    .join("");

  const itemRows = (sale.items || [])
    .map((item) => `${escapeHtml(saleItemCodeText(item))} - ${escapeHtml(item.description)} (${escapeHtml(item.quantity || 1)})`)
    .join("<br>");

  els.paymentHistoryBody.innerHTML = `
    <div class="payment-history-summary">
      <strong>${escapeHtml(sale.voucherNumber)}</strong>
      <span>${escapeHtml(sale.saleDate)} • ${escapeHtml(sale.salePerson || "-")}</span>
      ${sale.customerName ? `<span>Customer: ${escapeHtml(sale.customerName)}${sale.customerPhone ? ` • ${escapeHtml(sale.customerPhone)}` : ""}</span>` : ""}
      ${sale.customerAddress ? `<span>Contact / Address: ${escapeHtml(sale.customerAddress)}</span>` : ""}
      <span>Pickup / Delivery: ${escapeHtml(fulfillmentDueDate(sale) || "-")} • ${escapeHtml(fulfillmentMethodLabel(sale.fulfillmentMethod))} • ${escapeHtml(fulfillmentStatusLabel(sale.fulfillmentStatus))}</span>
      <small>${itemRows || "-"}</small>
      ${sale.note ? `<small>Note: ${escapeHtml(sale.note)}</small>` : ""}
      ${
        hasPermission("sale")
          ? `<div class="payment-popup-actions">
              <button class="button secondary" type="button" data-modal-edit-voucher="${sale.id}">Voucher ပြင်မယ်</button>
              <button class="button ghost" type="button" data-modal-edit-payments="${sale.id}">
                ${editPayments ? "Payment စာရင်းသာ ကြည့်မယ်" : "Payment ပြင်မယ်"}
              </button>
            </div>`
          : ""
      }
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
    map[item.florist].cost += stockUnitCost(item);
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
          <input type="password" data-staff-password="${staff.id}" placeholder="${staff.password || staff.passwordHash ? "Password set" : "No password"}" />
          <button class="button secondary tiny-button" type="button" data-save-staff-password="${staff.id}">Save Password</button>
          ${
            staff.locked || staff.id === state.currentStaffId
              ? ""
              : `<button class="icon-button danger" type="button" data-remove-staff="${staff.id}">${lucideMarkup("trash-2")}</button>`
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
              <button class="icon-button danger" type="button" data-remove-sale-person="${person.id}">${lucideMarkup("trash-2")}</button>
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
            `<span class="tag-chip">${escapeHtml(subCategory)} <button type="button" data-remove-subcategory="${category.id}|${escapeHtml(subCategory)}">${lucideMarkup("x")}</button></span>`
        )
        .join("");
      return `
        <div class="mini-row category-row">
          <span><strong>${escapeHtml(category.name)} (${escapeHtml(category.prefix || "-")})</strong><br>${subRows || "<span class='muted'>No sub category</span>"}</span>
          <button class="icon-button danger" type="button" data-remove-category="${category.id}">${lucideMarkup("trash-2")}</button>
        </div>
      `;
    })
    .join("");

  if (els.expenseCategoryList) {
    els.expenseCategoryList.innerHTML = state.expenseCategories.length
      ? state.expenseCategories
          .map(
            (category) => `
              <div class="mini-row">
                <span>${escapeHtml(category)}</span>
                <div class="row-actions">
                  <button class="icon-button" type="button" data-edit-expense-category="${escapeHtml(category)}" title="Edit expense category" aria-label="Edit ${escapeHtml(category)}">${lucideMarkup("pencil")}</button>
                  <button class="icon-button danger" type="button" data-remove-expense-category="${escapeHtml(category)}" title="Delete expense category" aria-label="Delete ${escapeHtml(category)}">${lucideMarkup("trash-2")}</button>
                </div>
              </div>`
          )
          .join("")
      : `<div class="empty">Expense category မရှိသေးပါ</div>`;
  }
}

function renderHistory() {
  const salesRows = [...state.sales]
    .sort((a, b) => byDateDesc(a, b, "saleDate"))
    .slice(0, 6)
    .map((sale) => {
      const itemCount = sale.items?.length || 0;
      return `<div class="mini-row"><span>${escapeHtml(sale.saleDate)} • ${voucherPopupButton(sale)} (${itemCount} items)<br>${escapeHtml(sale.salePerson)} • Paid ${money(salePaid(sale))} • ${paymentBreakdownText(sale)} • Balance ${money(saleBalance(sale))}</span><strong>${money(sale.totalPrice)}</strong></div>`;
    });

  const expenseRows = [...state.expenses]
    .sort((a, b) => byDateDesc(a, b, "expenseDate"))
    .slice(0, 6)
    .map(
      (expense) =>
        `<div class="mini-row"><span>${escapeHtml(expense.expenseDate)} • ${escapeHtml(expense.category || "Uncategorized")} • ${escapeHtml(expensePaidBy(expense))}<br>${escapeHtml(expense.description || "-")}</span><strong>${money(expense.amount)}</strong></div>`
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
  return soldItemCostForSales(state.sales.filter((sale) => inDateRange(saleCostDate(sale), startDate, endDate)));
}

function monthStart(dateValue) {
  return `${dateValue.slice(0, 7)}-01`;
}

function monthEnd(dateValue) {
  const [year, month] = dateValue.slice(0, 7).split("-").map(Number);
  return new Date(Date.UTC(year, month, 0)).toISOString().slice(0, 10);
}

function previousDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function stockValueAt(dateValue) {
  return state.stock
    .filter((item) => !isCashInventoryItem(item))
    .filter((item) => item.productionDate <= dateValue)
    .filter((item) => !item.soldAt || item.soldAt > dateValue)
    .reduce((sum, item) => sum + stockUnitCost(item), 0);
}

function stockPurchaseValueInRange(startDate, endDate) {
  return state.stock
    .filter((item) => !isCashInventoryItem(item))
    .filter((item) => inDateRange(item.productionDate, startDate, endDate))
    .reduce((sum, item) => sum + stockUnitCost(item), 0);
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
    ["itemType", "Item Type"],
    ["productionDate", "Production Date"],
    ["description", "Description"],
    ["category", "Category"],
    ["subCategory", "Sub Category"],
    ["paperColor", "Paper Color"],
    ["quantity", "Quantity"],
    ["cashValue", "Bouquet Cash Amount"],
    ["salePrice", "Sale Price"],
    ["florist", "Florist"],
  ],
  sku: [
    ["productCode", "SKU / Product Code"],
    ["productionDate", "Purchase Date"],
    ["description", "Description"],
    ["category", "Category"],
    ["subCategory", "Sub Category"],
    ["quantity", "Quantity"],
    ["salePrice", "Sale Price"],
  ],
  sales: [
    ["voucherNumber", "Voucher Number"],
    ["saleDate", "Sale Date"],
    ["salePerson", "Sale Person"],
    ["customerName", "Customer Name"],
    ["customerPhone", "Customer Phone"],
    ["customerAddress", "Customer Address"],
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
    ["category", "Category"],
    ["description", "Description"],
    ["paidBy", "Payment Method"],
    ["amount", "Amount"],
  ],
};

const importAliases = {
  productCode: ["product code", "code", "productcode", "ကုဒ်", "ပစ္စည်းကုဒ်"],
  itemType: ["type", "item type", "stock type", "အမျိုးအစား"],
  productionDate: ["production date", "purchase date", "date", "ရက်စွဲ", "ထုတ်လုပ်ရက်", "ဝယ်ယူရက်"],
  saleDate: ["sale date", "date", "voucher date", "ရောင်းရက်", "ရက်စွဲ"],
  expenseDate: ["expense date", "date", "ရက်စွဲ"],
  description: ["description", "item", "name", "အမျိုးအမည်", "ပစ္စည်း", "ဖော်ပြချက်"],
  category: ["category", "အမျိုးအစား"],
  subCategory: ["sub category", "subcategory", "sub", "အမျိုးအစားခွဲ"],
  paperColor: ["paper color", "color", "paper", "စက္ကူအရောင်", "အရောင်"],
  cashValue: ["bouquet cash amount", "cash value", "bouquet cash", "ပန်းစည်းထဲထည့်သည့် ငွေသား", "ပန်းစည်းငွေသား"],
  salePrice: ["sale price", "price", "amount", "စျေး", "ရောင်းစျေး"],
  florist: ["florist", "producer", "ထုတ်လုပ်သူ", "ပန်းစည်းသူ"],
  voucherNumber: ["voucher", "voucher number", "voucher no", "ဘောက်ချာ", "ဘောက်ချာနံပါတ်"],
  salePerson: ["sale person", "cashier", "staff", "အရောင်းဝန်ထမ်း"],
  customerName: ["customer name", "customer", "client name", "ဝယ်သူအမည်", "customer အမည်"],
  customerPhone: ["customer phone", "phone", "mobile", "viber", "ဖုန်း"],
  customerAddress: ["customer address", "address", "contact note", "လိပ်စာ"],
  quantity: ["quantity", "qty", "အရေအတွက်"],
  totalPrice: ["total", "total price", "amount", "ကျသင့်ငွေ"],
  receivedAmount: ["received", "received amount", "paid", "စရံ", "လက်ခံရငွေ"],
  paymentDate: ["payment date", "paid date", "ငွေရက်"],
  paymentType: ["payment type", "payment", "ငွေပေးချေမှု"],
  paidBy: ["payment method", "payment type", "paid by", "paidby", "from", "account", "ငွေပေးချေမှု", "ပေးချေမှု"],
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

function xmlValue(value) {
  return String(value ?? "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function excelWorksheetName(value, index) {
  const clean = String(value || `Sheet ${index + 1}`).replace(/[\\/?*\[\]:]/g, " ").trim();
  return (clean || `Sheet ${index + 1}`).slice(0, 31);
}

function excelCell(value, style = "") {
  const cellValue = String(value ?? "").startsWith("__SECTION__:") ? exportCellText(value) : value;
  const isNumber = typeof cellValue === "number" && Number.isFinite(cellValue);
  const styleAttribute = style ? ` ss:StyleID="${style}"` : "";
  return `<Cell${styleAttribute}><Data ss:Type="${isNumber ? "Number" : "String"}">${xmlValue(cellValue)}</Data></Cell>`;
}

function downloadExcelWorkbook(filename, sheets) {
  const worksheets = sheets.map((sheet, sheetIndex) => {
    const headers = sheet.headers || [];
    const rows = sheet.rows || [];
    const columnWidths = headers.map((header, columnIndex) => {
      const widest = rows.reduce((width, row) => Math.max(width, String(exportCellText(row[columnIndex]) ?? "").length), String(header).length);
      return Math.min(220, Math.max(70, widest * 7 + 16));
    });
    const body = rows.map((row) => {
      if (String(row[0] || "").startsWith("__SECTION__:")) {
        return `<Row><Cell ss:StyleID="Section" ss:MergeAcross="${Math.max(0, headers.length - 1)}"><Data ss:Type="String">${xmlValue(exportCellText(row[0]))}</Data></Cell></Row>`;
      }
      return `<Row>${headers.map((_, index) => excelCell(row[index] ?? "")).join("")}</Row>`;
    }).join("");
    return `
      <Worksheet ss:Name="${xmlValue(excelWorksheetName(sheet.name || sheet.title, sheetIndex))}">
        <Table>
          ${columnWidths.map((width) => `<Column ss:AutoFitWidth="0" ss:Width="${width}"/>`).join("")}
          <Row>${headers.map((header) => excelCell(header, "Header")).join("")}</Row>
          ${body}
        </Table>
        <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
          <FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane>
        </WorksheetOptions>
      </Worksheet>`;
  }).join("");
  const workbook = `<?xml version="1.0"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
      <Styles>
        <Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Top"/><Font ss:FontName="Arial" ss:Size="10"/></Style>
        <Style ss:ID="Header"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#28543B" ss:Pattern="Solid"/><Alignment ss:Vertical="Center" ss:WrapText="1"/></Style>
        <Style ss:ID="Section"><Font ss:Bold="1"/><Interior ss:Color="#DDEBDD" ss:Pattern="Solid"/></Style>
      </Styles>
      ${worksheets}
    </Workbook>`;
  const blob = new Blob([workbook], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function printExport(title, headers, rows, options = {}) {
  const tableRows = rows
    .map((row) => {
      if (String(row[0] || "").startsWith("__SECTION__:")) {
        return `<tr class="section-row"><td colspan="${headers.length}">${escapeHtml(exportCellText(row[0]))}</td></tr>`;
      }
      return `<tr>${row.map((cell) => `<td class="${typeof cell === 'number' ? 'number' : ''}">${escapeHtml(typeof cell === 'number' ? cell.toLocaleString('en-US', {maximumFractionDigits: 2}) : exportCellText(cell))}</td>`).join("")}</tr>`;
    })
    .join("");
  const win = window.open("", "_blank");
  if (!win) {
    alert("PDF window ဖွင့်ရန် browser popup ကို allow လုပ်ပါ");
    return false;
  }
  win.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: A4 ${headers.length > 7 ? 'landscape' : 'portrait'}; margin: 14mm 12mm; }
          body { font-family: 'Segoe UI', 'Myanmar Text', Arial, sans-serif; padding: 0; color: #243247; line-height: 1.6; }
          h1 { font-size: 20px; margin: 0 0 14px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #b9c7ba; padding: 7px; text-align: left; vertical-align: top; }
          th { background: #edf4ec; }
          td.number { text-align: right; font-variant-numeric: tabular-nums; }
          thead { display: table-header-group; }
          tr { break-inside: avoid; }
          td { overflow-wrap: anywhere; }
          tbody tr:nth-child(even) { background: #f8fafc; }
          .report-brand { color: #ac236c; font-size: 12px; font-weight: 700; letter-spacing: 2px; border-bottom: 3px solid #ac236c; padding-bottom: 12px; margin-bottom: 16px; }
          .report-meta { color: #526174; font-size: 11px; margin-bottom: 18px; }
          footer { margin-top: 20px; border-top: 1px solid #dce2e9; padding-top: 8px; font-size: 9px; color: #64748b; }
          @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
          .section-row td { background: #d9d9d9; font-weight: 700; text-align: left; }
        </style>
      </head>
      <body>
        <div class="report-brand">B3 FLORAL / BUSINESS REPORT</div>
        <h1>${escapeHtml(title)}</h1>
        <div class="report-meta">Period: ${escapeHtml(options.startDate || 'All dates')} — ${escapeHtml(options.endDate || 'Present')}<br>
        Prepared by: ${escapeHtml(currentStaff()?.name || 'B3 Floral')} · Generated: ${escapeHtml(new Date().toLocaleString('en-GB'))}<br>
        ${options.salePerson && options.salePerson !== 'all' && ['sales', 'payments', 'accounting_sales'].includes(options.exportType) ? `Sale person: ${escapeHtml(options.salePerson)} · ` : ''}
        ${options.exportType === 'stock' ? `Stock status: ${escapeHtml(options.stockStatus)} · ` : ''}
        ${rows.filter(row => !String(row[0] || '').startsWith('__SECTION__:')).length} report rows · Currency: MMK</div>
        <table>
          <thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
          <tbody>${tableRows || `<tr><td colspan="${headers.length}">No records</td></tr>`}</tbody>
        </table>
        <footer>B3 Floral EBS · Internal business report · Report rows may include totals; review totals separately from detail rows.</footer>
      </body>
    </html>
  `);
  win.document.close();
  win.document.fonts.ready.then(() => { win.focus(); win.print(); });
  return true;
}

const accountingPaymentSheets = [
  { paymentType: "Cash", name: "Cash" },
  { paymentType: "KBZPay", name: "KBZ Pay" },
  { paymentType: "AYA Pay", name: "AYA Pay" },
  { paymentType: "WavePay", name: "Wave Pay" },
  { paymentType: "Bank Transfer", name: "Banking" },
];

function accountingSaleDescription(sale) {
  return (sale.items || [])
    .map((item) => {
      const code = normalizeCode(item.productCode || "");
      const description = String(item.description || "").trim();
      const label = [code, description].filter(Boolean).join(" - ") || "Item";
      return `${label} x${Math.max(1, Number(item.quantity || 1))}`;
    })
    .join(" | ");
}

function accountingSalesExport(startDate, endDate, salePerson = "all") {
  const paymentDetailHeaders = ["Vr No.", "Date", "Description / Items", "Total Sale", "Received", "Balance"];
  const voucherSummaryHeaders = ["Vr No.", "Total Sale", "Total Received", "Payment Type(s)", "Balance", "Has Balance"];
  const paymentSummaryHeaders = ["Payment Type", "Voucher Count", "Payment Count", "Total Received"];
  const rowsByPaymentType = new Map(accountingPaymentSheets.map(({ paymentType }) => [paymentType, []]));
  const paymentTypeNames = new Map(accountingPaymentSheets.map(({ paymentType, name }) => [paymentType, name]));
  const matchesSalePerson = (sale) => salePerson === "all" || sale.salePerson === salePerson;
  const voucherSummaryRows = [];

  state.sales
    .filter(matchesSalePerson)
    .forEach((sale) => {
      let balance = Number(sale.totalPrice || 0);
      const payments = (sale.payments || [])
        .map((payment, index) => ({ payment, index }))
        .sort((a, b) =>
          `${a.payment.paymentDate || sale.saleDate || ""}|${String(a.index).padStart(6, "0")}`
            .localeCompare(`${b.payment.paymentDate || sale.saleDate || ""}|${String(b.index).padStart(6, "0")}`)
        );

      payments.forEach(({ payment }) => {
        const received = Number(payment.amount || 0);
        const paymentDate = payment.paymentDate || sale.saleDate || "";
        balance = Math.max(0, balance - received);
        const sheetRows = rowsByPaymentType.get(payment.paymentType);
        if (!sheetRows || !inDateRange(paymentDate, startDate, endDate)) return;
        sheetRows.push([
          sale.voucherNumber || "",
          paymentDate,
          accountingSaleDescription(sale),
          Number(sale.totalPrice || 0),
          received,
          balance,
        ]);
      });

      const periodPayments = payments
        .map(({ payment }) => payment)
        .filter((payment) => rowsByPaymentType.has(payment.paymentType))
        .filter((payment) => inDateRange(payment.paymentDate || sale.saleDate || "", startDate, endDate));
      if (!periodPayments.length) return;
      const receivedByType = periodPayments.reduce((totals, payment) => {
        totals[payment.paymentType] = (totals[payment.paymentType] || 0) + Number(payment.amount || 0);
        return totals;
      }, {});
      const paidThroughEnd = payments
        .map(({ payment }) => payment)
        .filter((payment) => !endDate || (payment.paymentDate || sale.saleDate || "") <= endDate)
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const summaryBalance = Math.max(0, Number(sale.totalPrice || 0) - paidThroughEnd);
      voucherSummaryRows.push([
        sale.voucherNumber || "",
        Number(sale.totalPrice || 0),
        periodPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
        Object.entries(receivedByType)
          .map(([paymentType, amount]) => `${paymentTypeNames.get(paymentType) || paymentType}: ${amount.toLocaleString("en-US")}`)
          .join(" | "),
        summaryBalance,
        summaryBalance > 0 ? "Yes" : "No",
      ]);
    });

  voucherSummaryRows.sort((a, b) => String(a[0]).localeCompare(String(b[0]), undefined, { numeric: true }));
  const paymentSummaryRows = accountingPaymentSheets.map(({ paymentType, name }) => {
    const rows = rowsByPaymentType.get(paymentType);
    return [name, new Set(rows.map((row) => row[0])).size, rows.length, rows.reduce((sum, row) => sum + Number(row[4] || 0), 0)];
  });
  const paymentDetailSheets = accountingPaymentSheets.map(({ paymentType, name }) => ({
    name,
    headers: paymentDetailHeaders,
    rows: rowsByPaymentType.get(paymentType)
      .sort((a, b) => `${a[1]}|${a[0]}`.localeCompare(`${b[1]}|${b[0]}`)),
  }));
  const sheets = [
    { name: "Voucher Summary", headers: voucherSummaryHeaders, rows: voucherSummaryRows },
    { name: "Payment Summary", headers: paymentSummaryHeaders, rows: paymentSummaryRows },
    ...paymentDetailSheets,
  ];

  return {
    title: "Payment Ledgers by Payment Type",
    headers: voucherSummaryHeaders,
    rows: voucherSummaryRows,
    sheets,
  };
}

function normalizedSalesProductText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[“”′″]/g, '"')
    .replace(/[၀-၉]/g, (digit) => String("၀၁၂၃၄၅၆၇၈၉".indexOf(digit)))
    .replace(/\s+/g, " ")
    .trim();
}

function cakeSizeFromProductText(text) {
  const sizeFirst = text.match(/(\d{1,2})[\s-]*(?:["']+|လက်မ|inch(?:es)?|in)?[\s-]*(?:cake|ကိတ်)/i)?.[1];
  if (sizeFirst) return sizeFirst;
  return text.match(/(?:cake|ကိတ်)[\s-]*(\d{1,2})[\s-]*(?:["']+|လက်မ|inch(?:es)?|in)?/i)?.[1] || "";
}

function bestSellingProductGroup(item, stockLookup) {
  const code = normalizeCode(item.productCode);
  const stockItem =
    (item.stockId && stockLookup.firstById.get(item.stockId)) ||
    stockLookup.firstByCode.get(code);
  const text = normalizedSalesProductText(item.description || stockItem?.description || code);
  const category = stockItem?.category || "";

  if (!text || code.startsWith("MM") || isCashInventoryItem(stockItem)) return "";
  if (
    ["deli", "delivery", "ကျန်ငွေ", "ပိုငွေ", "ပိုလွှဲ", "ဆွဲထုတ်", "လဲခ", "ဂိတ်တင်ခ", "ထည့်ခ"].some(
      (keyword) => text.includes(keyword)
    )
  ) return "";

  const cakeSize = cakeSizeFromProductText(text);
  if (cakeSize) return `${cakeSize}\" Cake`;
  if (text.includes("ချောကလက်") || text.includes("ချောကလပ်") || text.includes("ချောကလတ်") || text.includes("kitkat") || text.includes("kit kat")) return "ချောကလက်";
  if (text.includes("ဘောလုံး") || text.includes("ေဘာလံုး") || text.includes("ပူဖောင်း")) return "ဘောလုံး / ပူဖောင်း";
  if (text.includes("paper") || text.includes("စက္ကူ")) return "Wrapping Paper";
  if (text.includes("ဖဲကြိုး")) return "ဖဲကြိုး";
  if (text.includes("ပုလဲ")) return "ပုလဲ / ပုလဲကြိုး";

  if (stockItem?.itemType === "sku" || item.type === "sku_stock") {
    return `SKU — ${String(item.description || stockItem?.description || code).trim() || code}`;
  }

  if (category === "ငွေသားပန်းစည်း" || /^M\d+/i.test(code)) {
    const moneyPattern = text.match(/(1000|5000|10000)\s*[x×/]\s*(\d+)/i);
    return moneyPattern ? `ငွေသားပန်းစည်း ${moneyPattern[1]} × ${moneyPattern[2]}` : "ငွေသားပန်းစည်း (Other)";
  }

  const floralFamilies = [
    ["ရေမွှေး", "ရေမွှေးနှင်းဆီ"],
    ["ရေမွေး", "ရေမွှေးနှင်းဆီ"],
    ["နှင်းဆီစစ်", "နှင်းဆီစစ်"],
    ["နယ်သာလန်", "နယ်သာလန်ပန်း"],
    ["ကျူးလစ်", "ကျူးလစ်"],
    ["ဒေစီ", "ဒေစီ"],
    ["နေကြာ", "နေကြာ"],
    ["နှင်းဆီ", "နှင်းဆီ"],
    ["ပန်းတု", "ပန်းတု"],
  ];
  const floralFamily = floralFamilies.find(([keyword]) => text.includes(keyword));
  if (floralFamily) return floralFamily[1];

  const dollFamilies = [
    ["ဖော့ရုပ်", "ဖော့ရုပ်ပန်းစည်း"],
    ["ဝက်ဝံ", "ဝက်ဝံပန်းစည်း"],
    ["ယုန်", "ယုန်အရုပ်"],
    ["ဝက်", "ဝက်အရုပ်"],
    ["နို့ဘူးကိုင်", "နို့ဘူးကိုင်အရုပ်"],
    ["miniရုပ်", "Mini အရုပ်"],
    ["mini ရုပ်", "Mini အရုပ်"],
    ["ကားကပ်", "ကားကပ်အရုပ်"],
  ];
  const dollFamily = dollFamilies.find(([keyword]) => text.includes(keyword));
  if (dollFamily) return dollFamily[1];

  if (category === "ပန်းပန်းစည်း") return "ပန်းပန်းစည်း (Other)";
  if (category === "အရုပ်ပန်းစည်း") return "အရုပ်ပန်းစည်း (Other)";
  return String(item.description || stockItem?.description || code).trim() || "အခြားပစ္စည်း";
}

function bestSellingProductsExport(startDate, endDate) {
  const stockLookup = buildStockCostLookup(state.stock);
  const grouped = new Map();
  state.sales
    .filter((sale) => inDateRange(sale.saleDate, startDate, endDate))
    .forEach((sale) => {
      (sale.items || []).forEach((item) => {
        const group = bestSellingProductGroup(item, stockLookup);
        if (!group) return;
        const quantity = Math.max(1, Number(item.quantity || 1));
        const amount = Number(item.price ?? Number(item.unitPrice || 0) * quantity);
        if (!grouped.has(group)) {
          grouped.set(group, { quantity: 0, amount: 0, vouchers: new Set(), descriptions: new Set(), codes: new Set() });
        }
        const data = grouped.get(group);
        data.quantity += quantity;
        data.amount += amount;
        data.vouchers.add(sale.id || sale.voucherNumber);
        if (item.description) data.descriptions.add(String(item.description).trim());
        if (item.productCode) data.codes.add(normalizeCode(item.productCode));
      });
    });

  const entries = [...grouped.entries()].sort((a, b) => b[1].quantity - a[1].quantity || b[1].amount - a[1].amount);
  return {
    title: `Best Selling Products (${startDate || "all"} to ${endDate || "all"})`,
    headers: ["Rank", "Product Group", "Quantity Sold", "Voucher Count", "Sales Amount", "Average / Unit", "Sample Descriptions", "Sample Codes"],
    rows: entries.map(([group, data], index) => [
      index + 1,
      group,
      data.quantity,
      data.vouchers.size,
      data.amount,
      data.quantity ? data.amount / data.quantity : 0,
      [...data.descriptions].slice(0, 5).join(" | "),
      [...data.codes].slice(0, 8).join(", "),
    ]),
  };
}

function exportRows({ exportType, startDate, endDate, stockStatus, salePerson = "all" }) {
  if (exportType === "accounting_sales") return accountingSalesExport(startDate, endDate, salePerson);
  if (exportType === "best_selling_products") return bestSellingProductsExport(startDate, endDate);

  if (exportType === "sales") {
    return {
      title: "Sale Voucher Export",
      headers: ["Date", "Voucher", "Sale Person", "Customer Name", "Customer Phone", "Customer Address", "Description", "Fulfillment Date", "Method", "Status", "Total", "Paid", "Balance"],
      rows: state.sales
        .filter((sale) => (salePerson === "all" || sale.salePerson === salePerson) && inDateRange(sale.saleDate, startDate, endDate))
        .map((sale) => [
          sale.saleDate,
          sale.voucherNumber,
          sale.salePerson,
          sale.customerName || "",
          sale.customerPhone || "",
          sale.customerAddress || "",
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
        .filter((payment) => (salePerson === "all" || payment.salePerson === salePerson) && inDateRange(payment.paymentDate, startDate, endDate))
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
        "Bouquet Cash Cost",
        "Sale Price",
        "Florist",
        "Status",
        "Sold By",
        "Voucher",
        "Inventory Location",
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
            stockUnitCost(item),
            item.salePrice,
            item.florist,
            item.status,
            !isSku && item.status === "sold" ? soldByForStock(item.id) : "",
            voucher?.voucherNumber || "",
            inventoryLocationLabel(item.inventoryLocation),
          ];
        }),
    };
  }

  if (exportType === "inventory_available") {
    return {
      title: "Available Inventory Export",
      headers: [
        "Code",
        "Type",
        "Production Date",
        "Production Time",
        "Description",
        "Category",
        "Sub Category",
        "Paper Color",
        "Qty Available",
        "Qty Total",
        "Bouquet Cash Cost",
        "Sale Price",
        "Florist",
        "Created By",
        "Inventory Location",
        "Status",
      ],
      rows: state.stock
        .filter((item) => inDateRange(item.productionDate, startDate, endDate))
        .filter((item) => (item.itemType === "sku" ? Number(item.quantityAvailable || 0) > 0 : item.status === "available"))
        .map((item) => [
          item.productCode,
          item.itemType === "sku" ? "SKU" : "Floral",
          item.productionDate,
          item.productionStartedAt || item.createdAt || "",
          item.description,
          item.category,
          item.subCategory || "",
          item.paperColor || "",
          item.itemType === "sku" ? Number(item.quantityAvailable || 0) : 1,
          item.itemType === "sku" ? Number(item.quantityTotal || item.quantityAvailable || 0) : 1,
          stockUnitCost(item),
          Number(item.salePrice || 0),
          item.florist || "",
          item.createdBy || "",
          inventoryLocationLabel(item.inventoryLocation),
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
    const stockLookup = buildStockCostLookup(state.stock);
    const grouped = sales.reduce((map, sale) => {
      if (!map[sale.salePerson]) map[sale.salePerson] = { count: 0, bouquetCount: 0, total: 0, paid: 0 };
      map[sale.salePerson].count += 1;
      map[sale.salePerson].bouquetCount += saleProductCodeBouquetCount(sale, stockLookup);
      map[sale.salePerson].total += Number(sale.totalPrice || 0);
      map[sale.salePerson].paid += salePaid(sale);
      return map;
    }, {});
    return {
      title: `Staff Performance Summary (${startDate} to ${endDate})`,
      headers: ["Sale Person", "Voucher Count", "Product Code Bouquet Count", "Voucher Total", "Paid Amount"],
      rows: Object.entries(grouped).map(([staff, data]) => [staff, data.count, data.bouquetCount, data.total, data.paid]),
    };
  }

  if (exportType === "summary_florist") {
    const statementRange = financialStatementRange(startDate, endDate);
    startDate = statementRange.startDate;
    endDate = statementRange.endDate;
    const stockRows = state.stock.filter(
      (item) => item.itemType !== "sku" && inDateRange(item.productionDate, startDate, endDate)
    );
    const configuredFlorists = Object.fromEntries(
      stockFloristNames.map((florist) => [florist, { count: 0, cost: 0, sold: 0, available: 0 }])
    );
    const grouped = stockRows.reduce((map, item) => {
      const florist = item.florist || "Unassigned";
      if (!map[florist]) map[florist] = { count: 0, cost: 0, sold: 0, available: 0 };
      map[florist].count += 1;
      map[florist].cost += stockUnitCost(item);
      map[florist][item.status === "sold" ? "sold" : "available"] += 1;
      return map;
    }, configuredFlorists);
    return {
      title: `Florist Performance Summary (${startDate} to ${endDate})`,
      headers: ["Florist", "Produced Count", "Sold Count", "Available Count", "Bouquet Cash Cost"],
      rows: Object.entries(grouped).map(([florist, data]) => [florist, data.count, data.sold, data.available, data.cost]),
    };
  }

  if (exportType === "summary_receivable") {
    return {
      title: "Receivable Summary",
      headers: ["Voucher Date", "Due Date", "Voucher", "Sale Person", "Total", "Paid", "Balance"],
      rows: state.sales
        .filter((sale) => saleBalance(sale) > 0)
        .filter((sale) => inDateRange(sale.saleDate, startDate, endDate))
        .map((sale) => [sale.saleDate, fulfillmentDueDate(sale), sale.voucherNumber, sale.salePerson, sale.totalPrice, salePaid(sale), saleBalance(sale)]),
    };
  }

  if (exportType === "summary_expenses") {
    const expenses = state.expenses.filter((expense) => inDateRange(expense.expenseDate, startDate, endDate));
    const grouped = expenses.reduce((map, expense) => {
      const key = `${expense.category || "Uncategorized"}||${expense.description || "-"}||${expensePaidBy(expense)}`;
      if (!map[key]) map[key] = { category: expense.category || "Uncategorized", description: expense.description || "-", paidBy: expensePaidBy(expense), amount: 0 };
      map[key].amount += Number(expense.amount || 0);
      return map;
    }, {});
    return {
      title: "Expense Summary",
      headers: ["Category", "Description", "Payment Method", "Total Amount"],
      rows: Object.values(grouped).map((row) => [row.category, row.description, row.paidBy, row.amount]),
    };
  }

  return {
    title: "Expense Export",
    headers: ["Date", "Category", "Description", "Payment Method", "Amount"],
    rows: state.expenses
      .filter((expense) => inDateRange(expense.expenseDate, startDate, endDate))
      .map((expense) => [expense.expenseDate, expense.category || "Uncategorized", expense.description, expensePaidBy(expense), expense.amount]),
  };
}

function openExportModal() {
  document.querySelector('#exportPreview').hidden = true;
  els.exportForm.startDate.value = today;
  els.exportForm.endDate.value = today;
  els.exportType.value = "accounting_sales";
  els.exportForm.format.value = "excel";
  const salePersons = [...new Set([
    ...(state.salePersons || []).map((person) => typeof person === "string" ? person : person.name),
    ...state.sales.map((sale) => sale.salePerson),
  ].filter(Boolean))].sort((a, b) => a.localeCompare(b));
  els.exportSalePerson.innerHTML = `<option value="all">All Sale Persons</option>${salePersons
    .map((person) => `<option value="${escapeHtml(person)}">${escapeHtml(person)}</option>`)
    .join("")}`;
  renderExportOptions();
  openModal(els.exportModal);
}

function openReportExportModal() {
  openExportModal();
  if (reportMode === "month") {
    const reportMonthDate = `${els.summaryMonth.value || currentMonth}-01`;
    els.exportForm.startDate.value = monthStart(reportMonthDate);
    els.exportForm.endDate.value = monthEnd(reportMonthDate);
  } else {
    const reportDate = els.summaryDate.value || today;
    els.exportForm.startDate.value = reportDate;
    els.exportForm.endDate.value = reportDate;
  }
}

function renderExportOptions() {
  els.stockExportStatusWrap.hidden = els.exportType.value !== "stock";
  els.exportSalePersonWrap.hidden = !["accounting_sales", "sales", "payments"].includes(els.exportType.value);
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

function normalizeImportItemType(value) {
  const text = normalizeImportKey(value);
  if (text.includes("sku")) return "sku";
  if (["sku", "sku item", "sku purchase", "purchase", "quantity item", "qty item"].includes(text)) return "sku";
  if (["floral", "flower", "production", "stock", "production item"].includes(text)) return "floral";
  return "";
}

function importStockRows(rows, forcedItemType = "") {
  let added = 0;
  rows.forEach((row) => {
    const productCode = normalizeCode(row.productCode || "");
    if (!productCode) return;
    const itemType = forcedItemType || normalizeImportItemType(row.itemType) || "floral";
    const isSku = itemType === "sku";
    const quantity = isSku ? Math.max(1, Number(row.quantity || 1)) : 1;
    const importedCashValue = Number(row.cashValue || 0);
    const existingItem = state.stock.find((item) => item.productCode === productCode);
    if (existingItem) {
      if (!isSku || existingItem.itemType !== "sku") return;
      existingItem.itemType = "sku";
      existingItem.productionDate = normalizeDateValue(row.productionDate, today);
      existingItem.description = row.description || existingItem.description || productCode;
      existingItem.category = ensureImportCategory(row.category || existingItem.category);
      existingItem.subCategory = row.subCategory || existingItem.subCategory || "";
      existingItem.paperColor = "-";
      existingItem.cashValue = 0;
      existingItem.unitCost = 0;
      existingItem.productionCost = 0;
      existingItem.salePrice = Number(row.salePrice || existingItem.salePrice || 0);
      existingItem.florist = "";
      const isCashDenomination = isCashInventoryItem(existingItem);
      existingItem.quantityTotal = isCashDenomination ? 0 : Number(existingItem.quantityTotal || 0) + quantity;
      existingItem.quantityAvailable = isCashDenomination ? 0 : Number(existingItem.quantityAvailable || 0) + quantity;
      existingItem.status = isCashDenomination || existingItem.quantityAvailable > 0 ? "available" : "sold";
      existingItem.trackQuantity = !isCashDenomination;
      existingItem.updatedAt = new Date().toISOString();
      added += 1;
      return;
    }
    const category = ensureImportCategory(row.category);
    const isCashDenomination = String(category || "").trim() === "ငွေသား";
    const cashValue = !isSku && isMoneyBouquetCategory(category) ? importedCashValue : 0;
    state.stock.unshift({
      id: uid("stock"),
      productCode,
      itemType,
      productionDate: normalizeDateValue(row.productionDate, today),
      description: row.description || productCode,
      category,
      subCategory: row.subCategory || "",
      paperColor: isSku ? "-" : row.paperColor || "-",
      productionCost: cashValue,
      unitCost: cashValue,
      cashValue,
      salePrice: Number(row.salePrice || 0),
      florist: isSku ? "" : row.florist || stockFloristNames[0] || "Imported",
      quantityTotal: isCashDenomination ? 0 : quantity,
      quantityAvailable: isCashDenomination ? 0 : quantity,
      status: isSku ? (isCashDenomination || quantity > 0 ? "available" : "sold") : "available",
      trackQuantity: isSku ? !isCashDenomination : undefined,
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
    const unitCost = stockItem ? saleStockUnitCost(stockItem) : 0;
    const itemCost = unitCost * quantity;
    const sale = {
      id: uid("sale"),
      saleDate: row.saleDate || today,
      voucherNumber,
      salePerson: row.salePerson || activeSalePersons()[0]?.name || "Imported",
      customerName: row.customerName || "",
      customerPhone: row.customerPhone || "",
      customerAddress: row.customerAddress || "",
      fulfillmentDate: row.fulfillmentDate || row.saleDate || today,
      fulfillmentMethod: row.fulfillmentMethod || defaultFulfillmentMethod,
      fulfillmentStatus: row.fulfillmentStatus || defaultFulfillmentStatus,
      paymentType: row.paymentType || "Cash",
      totalPrice: amount,
      productionCost: itemCost,
      note: row.note || "",
      items: [{ id: uid("item"), type: stockItem ? "stock" : "manual", stockId: stockItem?.id || "", productCode, description: row.description || productCode || "Imported item", quantity, price: amount, unitPrice: amount / quantity, unitCost, cost: itemCost, costSource: stockItem ? "stock" : itemCost ? "estimated" : "missing", requiresCode: Boolean(stockItem || productCode || inferSaleItemRequiresCode({ description: row.description })) }],
      payments: received ? [{ id: uid("payment"), paymentDate: row.paymentDate || row.saleDate || today, paymentType: row.paymentType || "Cash", amount: received, note: "Imported payment", kind: "initial" }] : [],
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
    const category = row.category || "Uncategorized";
    if (!state.expenseCategories.includes(category)) state.expenseCategories.push(category);
    state.expenses.unshift({
      id: uid("expense"),
      expenseDate: row.expenseDate || today,
      category,
      description: row.description || "Imported expense",
      paidBy: row.paidBy || "Cash",
      amount,
      createdAt: new Date().toISOString(),
    });
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
    const importType = els.importType.value;
    const added =
      importType === "stock" || importType === "sku"
        ? importStockRows(rows, importType === "sku" ? "sku" : "")
        : importType === "sales"
          ? importSaleRows(rows)
          : importExpenseRows(rows);
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
    salePerson: form.salePerson.value,
  };
  if (options.startDate && options.endDate && options.startDate > options.endDate) {
    alert("Start Date က End Date ထက်နောက်ကျနေပါတယ်။ Date range ကိုပြန်စစ်ပါ။");
    return;
  }
  const data = exportRows(options);
  const range = [options.startDate || "all", options.endDate || "all"].join("_to_");
  const filenameBase = `b3-${options.exportType}-${range}`;
  if (options.format === "pdf") { if (!printExport(data.title, data.headers, data.rows, options)) return; }
  else if (options.format === "excel") downloadExcelWorkbook(`${filenameBase}.xls`, data.sheets || [{ name: data.title, headers: data.headers, rows: data.rows }]);
  else downloadCsv(`${filenameBase}.csv`, data.headers, data.rows);
  closeModal(els.exportModal);
}

function renderActiveView() {
  const view = currentStaff() ? activeRenderView : "";
  const sectionView = ["stock-inventory", "shop-inventory"].includes(view) ? "inventory" : view;
  // Release read-only generated rows when leaving a view. Never clear entry
  // forms, the current sale workspace, modal editors, or their input values.
  const viewContent = {
    inventory: ["inventoryTable"],
    vouchers: ["voucherHistoryTable"],
    receivables: ["receivablesTable"],
    "girlfriend-day": ["girlfriendDayPendingTable", "girlfriendDayCompletedTable"],
    fulfillment: ["fulfillmentTable"],
    codecheck: ["codeCheckTable"],
    expense: ["expenseTable", "expensePaymentSummary"],
    finance: ["financeAccountRows", "financePayableRows", "financeAccountantReceivableRows", "financeAccountantPayableRows", "financeExpenseBreakdown"],
    cashfloat: ["cashFloatLedger"],
    production: ["productionOrderList", "productionOrderTable"],
    reports: ["paymentSummary", "paymentDetailList", "reportExpensePaymentSummary", "reportExpenseCategorySummary"],
    dashboard: ["salesHistory", "expenseHistory", "adminProductionCashUsage", "adminProductionDailyTotals"],
  };
  Object.entries(viewContent).forEach(([owner, ids]) => {
    if (owner === sectionView) return;
    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node?.childNodes.length) node.replaceChildren();
    });
  });
  switch (sectionView) {
    case "home": renderHome(); break;
    case "dashboard": renderMetrics(); renderHistory(); break;
    case "stock": renderStockCashValueField(); break;
    case "sticker": renderSticker(); break;
    case "sale": updateSaleStepNav(); renderSaleItems(); renderVoucherPaymentDetails(); renderSaleDrafts(); break;
    case "inventory": renderInventory(); break;
    case "stock-audit": renderStockAudit(); break;
    case "reports": renderSummary(); break;
    case "finance": renderFinance(); break;
    case "cashfloat": renderCashFloat(); break;
    case "settings": renderSettings(); break;
    case "expense": renderExpenseTable(); break;
    case "vouchers": renderVoucherHistory(); break;
    case "receivables": renderReceivables(); break;
    case "girlfriend-day": renderGirlfriendDayOrders(); break;
    case "fulfillment": renderFulfillmentTable(); break;
    case "codecheck": renderCodeCheckTable(); break;
    case "production": renderProductionOrders(); break;
  }
}

function renderAll() {
  renderLogin();
  renderPermissions();
  showView(requestedView(), { render: false });
  renderDropdowns();
  renderActiveView();
  renderNavBadges();
}

els.loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  els.loginStatus.textContent = "";
  if (location.protocol.startsWith("http") && !sharedSyncInitialSettled) {
    els.loginStatus.textContent = "Cloud စာရင်းရယူနေပါသည် — ခဏစောင့်ပြီး ထပ်ဝင်ပါ";
    return;
  }
  const selectedStaffId = els.loginStaff.value;
  const staff = state.staff.find((item) => item.id === selectedStaffId);
  const enteredPassword = els.loginPassword.value;
  if (!(await verifyStaffPassword(staff, enteredPassword))) {
    els.loginStatus.textContent = "Wrong password";
    els.loginPassword.value = "";
    els.loginPassword.focus();
    return;
  }
  state.currentStaffId = selectedStaffId;
  saveDeviceSession(staff);
  const migrateLegacyPassword = Boolean(staff?.password);
  if (migrateLegacyPassword) await setStaffPassword(staff, enteredPassword);
  els.loginPassword.value = "";
  activeHomeGroup = "";
  history.replaceState(null, "", "#home");
  if (migrateLegacyPassword) saveState();
  else saveLocalState();
  renderAll();
});

els.logoutButton.addEventListener("click", () => {
  state.currentStaffId = "";
  saveDeviceSession(null);
  saveLocalState();
  renderAll();
});

if (els.cloudSyncButton) {
  els.cloudSyncButton.addEventListener("click", async () => {
    els.cloudSyncButton.disabled = true;
    setCloudSyncStatus("connecting", "Cloud မှ စာရင်းယူနေသည်…");
    await pullSharedState();
    els.cloudSyncButton.disabled = false;
  });
}

if (els.cloudSyncRetryButton) {
  els.cloudSyncRetryButton.addEventListener("click", async () => {
    els.cloudSyncRetryButton.disabled = true;
    await pullSharedState();
    els.cloudSyncRetryButton.disabled = false;
  });
}

if (els.cloudForcePullButton) {
  els.cloudForcePullButton.addEventListener("click", async () => {
    const ok = confirm("Cloud ထဲက နောက်ဆုံးစာရင်းကို ဒီ device ပေါ် ပြန်တင်မည်။ Cloud မတက်သေးသော local data ရှိလျှင် ပျောက်နိုင်သည်။ ဆက်လုပ်မလား?");
    if (!ok) return;
    els.cloudForcePullButton.disabled = true;
    setCloudSyncStatus("connecting", "Cloud Data ပြန်ယူနေသည်…");
    try {
      await window.b3ForcePullSharedData();
      setCloudSyncStatus("synced", syncedTimeLabel(sharedSyncUpdatedAt));
    } catch (error) {
      setCloudSyncStatus("error", `Cloud Data ပြန်ယူမရပါ${error?.message ? ` (${error.message})` : ""}`);
    } finally {
      els.cloudForcePullButton.disabled = false;
    }
  });
}

window.addEventListener("hashchange", () => {
  if (requestedView() !== activeRenderView) showView();
  document.body.classList.remove("is-menu-open");
  updateMenuToggle();
});

const desktopSidebarQuery = window.matchMedia("(min-width: 1161px)");

function updateMenuToggle() {
  if (!els.menuToggle) return;
  const icon = els.menuToggle.querySelector(".menu-toggle-icon");
  const label = els.menuToggle.querySelector(".menu-toggle-label");

  if (desktopSidebarQuery.matches) {
    const isCollapsed = document.body.classList.contains("is-sidebar-collapsed");
    const text = isCollapsed ? "Show menu" : "Hide menu";
    els.menuToggle.setAttribute("aria-expanded", String(!isCollapsed));
    els.menuToggle.setAttribute("aria-label", text);
    els.menuToggle.title = text;
    if (icon) icon.outerHTML = lucideMarkup(isCollapsed ? "panel-left-open" : "panel-left-close", "menu-toggle-icon");
    refreshLucideIcons();
    if (label) label.textContent = text;
    return;
  }

  const isOpen = document.body.classList.contains("is-menu-open");
  const text = isOpen ? "Close" : "Menu";
  els.menuToggle.setAttribute("aria-expanded", String(isOpen));
  els.menuToggle.setAttribute("aria-label", `${text} navigation`);
  els.menuToggle.title = "";
  if (icon) icon.outerHTML = lucideMarkup(isOpen ? "x" : "menu", "menu-toggle-icon");
  refreshLucideIcons();
  if (label) label.textContent = text;
}

function initializeSidebar() {
  const isCollapsed = localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  document.body.classList.toggle("is-sidebar-collapsed", isCollapsed);
  document.querySelectorAll(".side-nav a").forEach((link) => {
    const label = link.querySelector(".nav-label")?.textContent.trim();
    if (label) link.title = label;
  });
  updateMenuToggle();
}

els.menuToggle?.addEventListener("click", () => {
  if (desktopSidebarQuery.matches) {
    const isCollapsed = document.body.classList.toggle("is-sidebar-collapsed");
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    updateMenuToggle();
    return;
  }
  const isOpen = document.body.classList.toggle("is-menu-open");
  updateMenuToggle();
});

desktopSidebarQuery.addEventListener("change", () => {
  document.body.classList.remove("is-menu-open");
  updateMenuToggle();
});

document.querySelectorAll(".side-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("is-menu-open");
    updateMenuToggle();
  });
});

function openHomeRoot() {
  activeHomeGroup = "";
  goToView("home");
  renderHome();
  showView("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function returnToHomeGroup() {
  const currentView = requestedView();
  if (currentView === "home") {
    if (activeHomeGroup) openHomeRoot();
    return;
  }
  activeHomeGroup = homeGroupForView(currentView);
  goToView("home");
  renderHome();
  showView("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

els.appBackButton?.addEventListener("click", returnToHomeGroup);
els.appHomeButton?.addEventListener("click", openHomeRoot);
els.sidebar?.querySelector(".brand")?.addEventListener("click", (event) => {
  event.preventDefault();
  openHomeRoot();
});
els.homeGroupBack?.addEventListener("click", openHomeRoot);
els.homeGroupGrid?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-home-group]");
  if (!button) return;
  activeHomeGroup = button.dataset.homeGroup;
  renderHome();
  showView("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

function handleQuickActionClick(event) {
  const button = event.target.closest("[data-quick-view]");
  if (!button) return;
  goToView(button.dataset.quickView);
  if (button.dataset.quickAction === "newSale") startNewVoucher();
  if (button.dataset.quickAction === "adminCash") {
    els.adminCashManager?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

els.quickActionGrid.addEventListener("click", handleQuickActionClick);
els.saleAccountActions?.addEventListener("click", handleQuickActionClick);
els.adminDirectActions?.addEventListener("click", handleQuickActionClick);

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
els.saleStepBackButton?.addEventListener("click", () => moveSaleStep(-1));
els.saleStepNextButton?.addEventListener("click", () => moveSaleStep(1));

document.addEventListener("input", (event) => {
  if (event.target.classList?.contains("field-error")) event.target.classList.remove("field-error");
});

document.addEventListener("change", (event) => {
  if (event.target.classList?.contains("field-error")) event.target.classList.remove("field-error");
});

els.stockCategory.addEventListener("change", () => {
  renderSubcategories();
  if ((els.stockMode.value || "floral") === "floral") forceAutoProductCode();
  renderStockCashValueField();
});
els.stockCategory.addEventListener("input", () => {
  renderSubcategories();
  if ((els.stockMode.value || "floral") === "floral") forceAutoProductCode();
  renderStockCashValueField();
});
els.stockForm.productionDate.addEventListener("change", renderStockCashValueField);
els.stockModeSwitch.addEventListener("click", (event) => {
  const button = event.target.closest("[data-stock-entry-mode]");
  if (!button) return;
  els.stockMode.value = button.dataset.stockEntryMode;
  if (els.stockMode.value === "sku") {
    els.stockForm.productCode.value = "";
    els.stockForm.paperColor.value = "";
    els.stockForm.florist.value = "";
    stockPhotoDraft = null;
    els.stockPhotoInput.value = "";
    renderStockPhotoDraft();
  }
  renderStockEntryMode();
  showSkuRestockHint(null);
  els.stockForm.productCode.focus();
});

els.stockForm.productCode.addEventListener("input", autofillExistingSku);
els.stockForm.productCode.addEventListener("change", autofillExistingSku);

els.stockPhotoInput.addEventListener("change", (event) => handleStockPhotoFile(event.target.files?.[0]));
els.stockPhotoPreview.addEventListener("click", (event) => {
  if (event.target.closest("[data-remove-stock-photo]")) {
    stockPhotoDraft = null;
    els.stockPhotoInput.value = "";
    renderStockPhotoDraft();
    els.stockStatus.textContent = "Photo ဖယ်ပြီးပါပြီ";
    return;
  }
  if (event.target.closest("[data-preview-stock-photo]") && stockPhotoDraft?.dataUrl) {
    openStockPhoto({ productCode: els.stockForm.productCode.value, description: els.stockForm.description.value }, stockPhotoDraft.dataUrl);
  }
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
els.cancelSaleItemEditButton?.addEventListener("click", () => {
  clearSaleItemInputs();
  els.saleStatus.textContent = "Item ပြင်တာ ပယ်ဖျက်ပြီး";
});
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
els.voucherHistoryPaymentType.addEventListener("change", renderVoucherHistory);
els.voucherHistorySort.addEventListener("change", renderVoucherHistory);
els.receivablesSearch?.addEventListener("input", renderReceivables);
els.receivablesDueDate?.addEventListener("change", renderReceivables);
els.receivablesStatus?.addEventListener("change", renderReceivables);
els.receivablesSort?.addEventListener("change", renderReceivables);
els.receivablesTable?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open-receivable]");
  if (!button) return;
  openReceivablePaymentModal(button.dataset.openReceivable);
});
els.receivablePaymentForm?.addEventListener("submit", saveReceivablePayment);
els.fulfillmentFilterDate.addEventListener("change", renderFulfillmentTable);
els.fulfillmentSearch.addEventListener("input", renderFulfillmentTable);
els.fulfillmentFilterStatus.addEventListener("change", renderFulfillmentTable);
els.fulfillmentFilterMethod.addEventListener("change", renderFulfillmentTable);
els.girlfriendDaySearch?.addEventListener("input", renderGirlfriendDayOrders);
els.codeCheckSearch?.addEventListener("input", renderCodeCheckTable);
els.productionOrderSearch.addEventListener("input", renderProductionOrders);
els.productionOrderDateFilter.addEventListener("change", renderProductionOrders);

els.productionOrderList.addEventListener("click", (event) => {
  const photoButton = event.target.closest("[data-view-production-photo]");
  if (photoButton) {
    const [orderId, photoIndex] = photoButton.dataset.viewProductionPhoto.split("|");
    openProductionPhoto(orderId, photoIndex);
    return;
  }

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

[els.girlfriendDayPendingTable, els.girlfriendDayCompletedTable].forEach((table) => {
  table?.addEventListener("click", (event) => {
    const codeCheckButton = event.target.closest("[data-open-girlfriend-code-check]");
    if (codeCheckButton) {
      const sale = state.sales.find((item) => item.id === codeCheckButton.dataset.openGirlfriendCodeCheck);
      if (!sale) return;
      els.codeCheckSearch.value = sale.voucherNumber || "";
      renderCodeCheckTable();
      goToView("codecheck");
      return;
    }
    const editButton = event.target.closest("[data-edit-voucher]");
    if (!editButton) return;
    loadVoucherById(editButton.dataset.editVoucher);
  });
});

els.codeCheckTable?.addEventListener("click", (event) => {
  const notRequiredButton = event.target.closest("[data-code-not-required]");
  if (notRequiredButton) {
    const [saleId, itemId] = notRequiredButton.dataset.codeNotRequired.split("|");
    markSavedSaleItemCodeNotRequired(saleId, itemId);
    return;
  }

  const button = event.target.closest("[data-code-check-link]");
  if (!button) return;
  const rowId = button.dataset.codeCheckLink;
  const input = [...els.codeCheckTable.querySelectorAll("[data-code-check-input]")].find((node) => node.dataset.codeCheckInput === rowId);
  const [saleId, itemId] = rowId.split("|");
  linkSavedSaleItemToStock(saleId, itemId, input?.value || "");
});

els.codeCheckTable?.addEventListener("keydown", (event) => {
  const input = event.target.closest("[data-code-check-input]");
  if (!input || event.key !== "Enter") return;
  event.preventDefault();
  const [saleId, itemId] = input.dataset.codeCheckInput.split("|");
  linkSavedSaleItemToStock(saleId, itemId, input.value);
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
  const editButton = event.target.closest("[data-edit-sale-item]");
  if (editButton) {
    editSaleItem(editButton.dataset.editSaleItem);
    return;
  }

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
  setButtonIconLabel(els.expenseForm.querySelector("button[type=\"submit\"]"), "plus", "Expense ထည့်မယ်");
  renderExpenseTable();
});

els.expenseCategoryFilter?.addEventListener("change", renderExpenseTable);

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

els.editStockPhotoInput.addEventListener("change", (event) => handleStockPhotoFile(event.target.files?.[0], true));
els.editStockPhotoPreview.addEventListener("click", (event) => {
  const item = state.stock.find((stockItem) => stockItem.id === editingStockId);
  if (!item) return;
  if (event.target.closest("[data-remove-stock-photo]")) {
    editStockPhotoDraft = item.photo?.key ? { remove: true } : null;
    els.editStockPhotoInput.value = "";
    renderEditStockPhotoDraft();
    return;
  }
  if (event.target.closest("[data-preview-stock-photo]")) {
    openStockPhoto(item, editStockPhotoDraft?.dataUrl || stockPhotoUrl(item.photo));
  }
});

els.editStockCategory.addEventListener("change", () => {
  renderStockEditSubcategories();
  renderEditStockCashValueField();
});
els.stockEditForm.productionDate.addEventListener("change", renderEditStockCashValueField);

els.cashFloatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  addCashFloatAllocation(event.currentTarget);
});
els.cashFloatOpeningForm.addEventListener("submit", (event) => {
  event.preventDefault();
  saveCashFloatOpeningUnsold(event.currentTarget);
});
els.cashFloatLedger.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-cash-float]");
  if (button) deleteCashFloatAllocation(button.dataset.deleteCashFloat);
});
els.adminCashAccountsForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminCashAccounts(event.currentTarget);
});
els.adminCashMonth?.addEventListener("change", () => {
  if (!els.adminCashMonth.value) els.adminCashMonth.value = currentMonth;
  renderAdminCashManager();
});
function moveAdminCashMonth(offset) {
  const current = new Date(`${cashMonthStart(selectedAdminCashMonth())}T00:00:00Z`);
  current.setUTCMonth(current.getUTCMonth() + offset);
  const nextMonth = current.toISOString().slice(0, 7);
  const minimum = ADMIN_CASH_FIRST_MONTH;
  els.adminCashMonth.value = nextMonth < minimum ? minimum : nextMonth > currentMonth ? currentMonth : nextMonth;
  renderAdminCashManager();
}
els.adminCashPreviousMonth?.addEventListener("click", () => moveAdminCashMonth(-1));
els.adminCashNextMonth?.addEventListener("click", () => moveAdminCashMonth(1));
document.querySelector("#adminCashStepper")?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-admin-cash-step]");
  if (button) setAdminCashStep(button.dataset.adminCashStep);
});
document.querySelector("#adminCashStepper")?.addEventListener("keydown", (event) => {
  if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const steps = ["accounts", "ledger", "usage", "daily"];
  const direction = event.key === 'ArrowRight' ? 1 : -1;
  const currentIndex = steps.indexOf(activeAdminCashStep);
  setAdminCashStep(steps[(currentIndex + direction + steps.length) % steps.length], true);
});
els.adminCashTransferForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addAdminCashTransfer(event.currentTarget);
});
els.adminCashTransferForm?.fromAccount.addEventListener("change", syncAdminCashTransferChannel);
els.adminCashTransferForm?.toAccount.addEventListener("change", syncAdminCashTransferChannel);
els.adminDailyCashSaleForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveAdminDailyCashSale(event.currentTarget);
});
els.adminCashLedger?.addEventListener("click", (event) => {
  const legacyButton = event.target.closest("[data-delete-admin-cash-float]");
  if (legacyButton) {
    deleteCashFloatAllocation(legacyButton.dataset.deleteAdminCashFloat);
    return;
  }
  const recordButton = event.target.closest("[data-delete-admin-cash-record]");
  if (recordButton) deleteAdminCashRecord(recordButton.dataset.recordType, recordButton.dataset.deleteAdminCashRecord);
});
els.adminProductionDailyTotals?.addEventListener("click", (event) => {
  const card = event.target.closest("[data-production-cash-date]");
  if (card) openProductionCashDailyModal(card.dataset.productionCashDate);
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

document.addEventListener("click", (event) => {
  const photoButton = event.target.closest("[data-open-stock-photo]");
  if (photoButton) {
    const item = state.stock.find((stockItem) => stockItem.id === photoButton.dataset.openStockPhoto);
    if (item) openStockPhoto(item);
    return;
  }
  const button = event.target.closest("[data-view-voucher]");
  if (!button) return;
  openPaymentHistoryModal(button.dataset.viewVoucher);
});

els.inventoryTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  if (button.dataset.action === "print") {
    setSelectedStock(button.dataset.id);
    window.print();
  }

  if (button.dataset.action === "photo") {
    const item = state.stock.find((stockItem) => stockItem.id === button.dataset.id);
    if (item) openStockPhoto(item);
  }

  if (button.dataset.action === "edit") {
    editStock(button.dataset.id);
  }

  if (button.dataset.action === "delete") {
    deleteStock(button.dataset.id);
  }

  if (button.dataset.action === "move-inventory") {
    moveStockInventory(button.dataset.id);
  }
});

els.inventoryTable.addEventListener("click", (event) => {
  const button = event.target.closest("[data-inventory-voucher]");
  if (!button) return;
  openPaymentHistoryModal(button.dataset.inventoryVoucher);
});

els.staffForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  await addStaff(event.currentTarget);
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

els.staffList.addEventListener("click", async (event) => {
  const savePasswordButton = event.target.closest("[data-save-staff-password]");
  if (savePasswordButton) {
    const id = savePasswordButton.dataset.saveStaffPassword;
    const input = els.staffList.querySelector(`[data-staff-password="${id}"]`);
    await updateStaffPassword(id, input?.value || "");
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

els.expenseCategoryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addExpenseCategory(event.currentTarget);
});

els.expenseCategoryList?.addEventListener("click", (event) => {
  const editButton = event.target.closest("[data-edit-expense-category]");
  if (editButton) {
    editExpenseCategory(editButton.dataset.editExpenseCategory);
    return;
  }

  const removeButton = event.target.closest("[data-remove-expense-category]");
  if (removeButton) removeExpenseCategory(removeButton.dataset.removeExpenseCategory);
});

document.querySelector("#auditStart").addEventListener("click", () => {
  resetAuditQuantity();
  document.querySelector("#auditFilter").value = "pending";
  if (!hasPermission("inventory")) return;
  const location = document.querySelector("#auditLocation").value;
  const existing = state.stockAudits.find((audit) => audit.location === location && !audit.completedAt);
  if (existing) {
    selectedStockAuditId = existing.id;
    document.querySelector("#auditFeedback").textContent = "စစ်ဆဲမှတ်တမ်းကို ဆက်ဖွင့်ထားပါသည်။";
  } else {
    const expected = stockAuditExpected(state.stock, location);
    if (!expected.length) {
      document.querySelector("#auditFeedback").textContent = "ဤနေရာတွင် စစ်ရန် stock မရှိပါ။";
      return;
    }
    const audit = { id: uid("audit"), location, startedAt: new Date().toISOString(), startedBy: currentStaff()?.name || "", expected };
    state.stockAudits.push(audit);
    selectedStockAuditId = audit.id;
    saveState();
    document.querySelector("#auditFeedback").textContent = "Stock အသစ် စစ်ဆေးမှု စပါပြီ။";
  }
  renderStockAudit();
  document.querySelector("#auditBarcode").focus();
});
document.querySelector("#auditScanForm").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!hasPermission("inventory")) return;
  const input = document.querySelector("#auditBarcode");
  const audit = currentStockAudit();
  const code = input.value.trim();
  if (!audit || audit.completedAt || !code) return;
  const duplicate = state.stockAuditScans.some((scan) => scan.auditId === audit.id
    && normalizeCode(scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "") === normalizeCode(code));
  if (duplicate) {
    document.querySelector("#auditFeedback").textContent = `⚠ ${code} — Already scanned / Scan လုပ်ပြီးသားပါ။ ထပ်မသိမ်းပါ။`;
    input.value = "";
    input.focus();
    return;
  }
  const addedDuringAudit = addLiveStockToAudit(audit, state.stock, code);
  const sku = auditSkuItem(audit, code, state.stock);
  const qtyInput = document.querySelector("#auditQty");
  if (sku && qtyInput.dataset.code !== normalizeCode(code)) {
    qtyInput.value = "";
    qtyInput.dataset.code = normalizeCode(code);
    document.querySelector("#auditQtyField").hidden = false;
    document.querySelector("#auditFeedback").textContent = (sku.description || code) + " — စစ်တွေ့ Qty ထည့်ပါ။";
    qtyInput.focus();
    return;
  }
  const countedQuantity = Number(qtyInput.value);
  if (sku && (!qtyInput.value.trim() || !Number.isSafeInteger(countedQuantity) || countedQuantity < 0)) {
    document.querySelector("#auditFeedback").textContent = "Qty ကို 0 သို့မဟုတ် အပေါင်းကိန်းပြည့် ထည့်ပါ။";
    qtyInput.focus();
    return;
  }
  {
    state.stockAuditScans.push({ id: uid("audit-scan"), auditId: audit.id, productCode: code, ...(sku ? {itemType:"sku", countedQuantity} : {}), scannedAt: new Date().toISOString(), staffName: currentStaff()?.name || "" });
    resetAuditQuantity();
    saveState();
    const needsReview = audit.expected.filter((item) => normalizeCode(item.productCode) === normalizeCode(code)).length !== 1;
    document.querySelector("#auditFeedback").textContent = !needsReview
      ? addedDuringAudit
        ? `✓ ${code} — စာရင်းစစ်နေစဉ် စစ်သည့်နေရာသို့ ရောက်လာသောပစ္စည်းအဖြစ် မှန်ကန်စွာ Scan ပြီးပါပြီ။`
        : `✓ ${code} — Scan ပြီးပါပြီ။ မစစ်ရသေးစာရင်းမှ အလိုအလျောက် ဖယ်ထားသည်။`
      : `⚠ ${code} — မူလစာရင်းနှင့် မကိုက်ပါ။ “ပြန်စစ်ရန်” တွင် ထည့်ထားသည်။`;
    if (needsReview) document.querySelector("#auditFilter").value = "exceptions";
    document.querySelector("#auditSearch").value = "";
    renderStockAudit();
  }
  input.value = "";
  input.focus();
});
document.querySelector("#auditEdit").addEventListener("click", () => {
  if (currentStaff()?.role !== "admin") return;
  const audit = currentStockAudit();
  if (!audit) return;
  if (audit.completedAt) {
    audit.previousCompletedAt = audit.completedAt;
    audit.previousCompletedBy = audit.completedBy || "";
  }
  delete audit.completedAt;
  delete audit.completedBy;
  audit.saleEditingEnabled = true;
  audit.updatedAt = new Date().toISOString();
  audit.updatedBy = currentStaff()?.name || "";
  saveState();
  document.querySelector("#auditFeedback").textContent = "မှတ်တမ်း ပြန်ပြင်နိုင်ပါပြီ။ Sale account များလည်း Code / Qty ပြင်နိုင်ပါပြီ။";
  renderStockAudit();
  document.querySelector("#auditBarcode").focus();
});

document.querySelector("#auditSplitPending").addEventListener("click", () => {
  if (!pendingAuditSplitEnabled || currentStaff()?.role !== "admin") return;
  const source = currentStockAudit();
  const plan = planPendingAuditSplit(source, state.stockAuditScans, state.stock);
  if (!plan.selected.length) {
    document.querySelector("#auditFeedback").textContent = "ဆိုင်ထဲမရောက်သေးစာရင်းနှင့် ကိုက်သော Scan မရှိပါ။";
    return;
  }
  if (!confirm(plan.selected.length + " Scan ကို ဆိုင်ထဲမရောက်သေး မှတ်တမ်းအဖြစ် ခွဲပြီး တိုက်စစ်မည်လား?")) return;
  const now = new Date().toISOString();
  const staff = currentStaff()?.name || "";
  const audit = { id: uid("audit"), location: "pending", startedAt: now, startedBy: staff, completedAt: now, completedBy: staff,
    expected: plan.expected, sourceAuditId: source.id, sourceStartedAt: source.startedAt, snapshotAt: now };
  source.splitHistory = [...(source.splitHistory || []), { targetAuditId: audit.id, at: now, by: staff, scans: plan.selected.map((scan) => ({ ...scan })) }];
  for (const scan of plan.selected) {
    scan.originalAuditId = scan.originalAuditId || source.id;
    scan.auditId = audit.id;
    scan.updatedAt = now;
    scan.updatedBy = staff;
  }
  source.updatedAt = now;
  source.updatedBy = staff;
  state.stockAudits.push(audit);
  selectedStockAuditId = audit.id;
  saveState();
  document.querySelector("#auditFilter").value = "all";
  document.querySelector("#auditFeedback").textContent = plan.selected.length + " Scan ကို သီးခြားခွဲပြီး တိုက်စစ်ပြီးပါပြီ။";
  renderStockAudit();
});

document.querySelector("#auditDelete").addEventListener("click", () => {
  if (currentStaff()?.role !== "admin") return;
  const audit = currentStockAudit();
  if (!audit) return;
  const label = new Date(audit.startedAt).toLocaleString() + " · " + inventoryLocationLabel(audit.location);
  if (!confirm(label + "\nဤစစ်ဆေးမှုမှတ်တမ်းနှင့် ၎င်း၏ Scan မှတ်တမ်းအားလုံးကို ဖျက်မည်လား?")) return;
  state.stockAudits = state.stockAudits.filter((row) => row.id !== audit.id);
  state.stockAuditScans = state.stockAuditScans.filter((row) => row.auditId !== audit.id);
  selectedStockAuditId = "";
  saveState();
  document.querySelector("#auditFeedback").textContent = "စစ်ဆေးမှုမှတ်တမ်း ဖျက်ပြီးပါပြီ။";
  renderStockAudit();
});

document.querySelector("#auditRows").addEventListener("click", (event) => {
  const useCode = event.target.closest("[data-use-audit-code]");
  if (useCode) {
    if (!hasPermission("inventory") || !currentStockAudit() || currentStockAudit().completedAt) return;
    resetAuditQuantity();
    document.querySelector("#auditBarcode").value = useCode.dataset.useAuditCode;
    document.querySelector("#auditBarcode").focus();
    return;
  }
  const button = event.target.closest("[data-edit-audit-scan], [data-remove-audit-scan]");
  if (!button) return;
  const audit = currentStockAudit();
  if (!canEditAuditScans(audit, currentStaff()?.role)) return;
  if (button.hasAttribute("data-remove-audit-scan") && currentStaff()?.role !== "admin") return;
  const id = button.dataset.editAuditScan || button.dataset.removeAuditScan;
  const scan = state.stockAuditScans.find((row) => row.id === id && row.auditId === audit.id);
  if (!scan) return;
  if (button.hasAttribute("data-edit-audit-scan")) {
    const code = prompt("Barcode / Product Code ပြင်ရန်", scan.productCode || audit.expected.find((item) => item.stockId === scan.stockId)?.productCode || "");
    if (code === null) return;
    const value = code.trim();
    if (!value || state.stockAuditScans.some((row) => row !== scan && row.auditId === audit.id
      && normalizeCode(row.productCode || audit.expected.find((item) => item.stockId === row.stockId)?.productCode || "") === normalizeCode(value))) {
      document.querySelector("#auditFeedback").textContent = value ? "ဤ Code ကို scan လုပ်ပြီးသားပါ။" : "Barcode / Code ထည့်ပါ။";
      return;
    }
    const sku = auditSkuItem(audit, value, state.stock);
    let countedQuantity;
    if (sku) {
      const entry = prompt("စစ်တွေ့ Qty", scan.countedQuantity == null ? "" : String(scan.countedQuantity));
      if (entry === null) return;
      countedQuantity = Number(entry);
      if (!entry.trim() || !Number.isSafeInteger(countedQuantity) || countedQuantity < 0) {
        document.querySelector("#auditFeedback").textContent = "Qty ကို 0 သို့မဟုတ် အပေါင်းကိန်းပြည့် ထည့်ပါ။";
        return;
      }
    }
    delete scan.countedQuantity;
    delete scan.itemType;
    if (sku) { scan.itemType = "sku"; scan.countedQuantity = countedQuantity; }
    scan.productCode = value;
    delete scan.stockId;
    scan.updatedAt = new Date().toISOString();
    scan.updatedBy = currentStaff()?.name || "";
  } else {
    if (!confirm("ဤ Scan မှတ်တမ်းကို ဖယ်မည်လား?")) return;
    state.stockAuditScans = state.stockAuditScans.filter((row) => row !== scan);
  }
  saveState();
  document.querySelector("#auditFeedback").textContent = "မှတ်တမ်း ပြင်ဆင်ပြီးပါပြီ။";
  renderStockAudit();
});

document.querySelector("#auditPdf").addEventListener("click", printStockAuditReport);
document.querySelector("#auditFinish").addEventListener("click", () => {
  if (!hasPermission("inventory")) return;
  const audit = currentStockAudit();
  if (!audit || audit.completedAt) return;
  const report = reconcileStockAudit(audit, state.stockAuditScans);
  const checked = new Set(report.matched.map((scan) => scan.stockId)).size;
  const pending = Math.max(0, audit.expected.length - checked);
  const warning = pending || report.exceptions.length
    ? `မစစ်ရသေး ${pending} ခု၊ ပြန်စစ်ရန် ${report.exceptions.length} ခု ရှိနေသေးသည်။\n\nမပြီးသေးဘဲ အပြီးသတ်မည်လား?`
    : `Stock ${checked} ခုလုံး Scan ပြီးပါပြီ။\n\nစစ်ဆေးမှုကို အပြီးသတ်မည်လား?`;
  if (!confirm(warning)) return;
  audit.completedAt = new Date().toISOString();
  audit.completedBy = currentStaff()?.name || "";
  audit.saleEditingEnabled = false;
  saveState();
  document.querySelector("#auditFeedback").textContent = "Code အားလုံး တိုက်စစ်ပြီး ရလဒ်သိမ်းထားပါပြီ။";
  document.querySelector("#auditFilter").value = "all";
  renderStockAudit();
});
document.querySelector("#auditBarcode").addEventListener("input", resetAuditQuantity);

document.querySelector("#auditRefresh").addEventListener("click", async () => {
  const button = document.querySelector("#auditRefresh");
  button.disabled = true;
  try {
    await pullSharedStateAndReschedule({ initial: true });
    renderStockAudit();
    document.querySelector("#auditFeedback").textContent = !sharedSyncReady
      ? "Cloud မှ ပြင်ခွင့်မရသေးပါ။ Internet စစ်ပြီး ပြန်နှိပ်ပါ။"
      : document.querySelector("#auditBarcode").disabled
        ? "ဤမှတ်တမ်းကို Admin က ပြန်ဖွင့်ပေးရန် လိုပါသည်။"
        : "နောက်ဆုံးစာရင်း ရပါပြီ။ Scan အသစ်ထည့်နိုင်ပါပြီ။";
  } finally { button.disabled = false; }
});

document.querySelector("#auditSession").addEventListener("change", (event) => {
  resetAuditQuantity();
  selectedStockAuditId = event.target.value;
  document.querySelector("#auditFeedback").textContent = "";
  renderStockAudit();
});
for (const id of ["auditLocation", "auditFilter", "auditSort"]) document.getElementById(id).addEventListener("change", renderStockAudit);
document.querySelector("#auditSearch").addEventListener("input", renderStockAudit);
document.querySelector("#stock-audit").addEventListener("click", (event) => {
  const button = event.target.closest("[data-audit-filter]");
  if (!button) return;
  document.querySelector("#auditFilter").value = button.dataset.auditFilter;
  renderStockAudit();
});

els.inventorySearch.addEventListener("input", () => {
  clearTimeout(inventorySearchTimer);
  inventorySearchTimer = setTimeout(() => {
    if (["shop-inventory", "stock-inventory"].includes(activeRenderView)) renderInventory();
  }, 120);
});
document.querySelector("#inventoryPreviousPage").addEventListener("click", () => {
  inventoryPage -= 1;
  renderInventory();
});
document.querySelector("#inventoryNextPage").addEventListener("click", () => {
  inventoryPage += 1;
  renderInventory();
});
els.inventoryFilter.addEventListener("change", renderInventory);
els.inventoryTypeFilter.addEventListener("change", renderInventory);
els.inventoryLocationFilter.addEventListener("change", renderInventory);
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
if (els.addOldDesignAvailableStickersButton) {
  els.addOldDesignAvailableStickersButton.addEventListener("click", addOldDesignAvailableStickersToQueue);
}
els.clearStickerQueueButton.addEventListener("click", () => {
  stickerQueue = [];
  renderStickerQueue();
});
els.stickerQueue.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-sticker]");
  if (!button) return;
  stickerQueue = stickerQueue.filter((entry) => entry.id !== button.dataset.removeSticker);
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
  els.stickerDpi,
  els.settingStickerWidth,
  els.settingStickerHeight,
  els.settingStickerOrientation,
  els.settingStickerCodeSize,
  els.settingStickerPriceSize,
  els.settingStickerBorder,
  els.settingStickerDpi,
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

if (els.openStickerButton) {
  els.openStickerButton.addEventListener("click", () => {
    location.hash = "#sticker";
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

if (els.shareStickerButton) {
  els.shareStickerButton.addEventListener("click", shareStickerPng);
}

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
els.dailyTransferButton?.addEventListener("click", transferDailySummary);
els.financeMonth?.addEventListener("change", renderFinance);
els.financeOpeningAccount?.addEventListener("change", () => renderFinanceOpeningForm());
els.financeOpeningForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  saveFinanceOpeningBalance(event.currentTarget);
});
els.financePayableForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addFinancePayable(event.currentTarget);
});
els.financePayablePaymentForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  addFinancePayablePayment(event.currentTarget);
});
els.financePayableRows?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-delete-payable]");
  if (!button) return;
  deleteFinancePayable(button.dataset.deletePayable);
});
els.summaryCostCard.addEventListener("click", openSoldCostDetails);
els.summaryCostCard.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    openSoldCostDetails();
  }
});
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

els.paymentHistoryBody.addEventListener("click", (event) => {
  const editVoucherButton = event.target.closest("[data-modal-edit-voucher]");
  if (editVoucherButton) {
    closeModal(els.paymentHistoryModal);
    loadVoucherById(editVoucherButton.dataset.modalEditVoucher);
    return;
  }

  const editPaymentsButton = event.target.closest("[data-modal-edit-payments]");
  if (editPaymentsButton) {
    const hasEditors = els.paymentHistoryBody.querySelector("[data-payment-row]");
    openPaymentHistoryModal(editPaymentsButton.dataset.modalEditPayments, !hasEditors);
    return;
  }

  const savePaymentButton = event.target.closest("[data-modal-save-payment]");
  if (savePaymentButton) {
    saveVoucherPayment(
      savePaymentButton.dataset.modalSavePayment,
      savePaymentButton.dataset.saleId,
      els.paymentHistoryBody
    );
    return;
  }

  const deletePaymentButton = event.target.closest("[data-modal-delete-payment]");
  if (deletePaymentButton) {
    deleteVoucherPayment(deletePaymentButton.dataset.modalDeletePayment, deletePaymentButton.dataset.saleId);
  }
});

els.exportButton.addEventListener("click", openExportModal);
els.reportExportButton.addEventListener("click", openReportExportModal);
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
  state.cashFloatAllocations = [];
  state.cashFloatOpeningUnsold = {
    effectiveDate: CASH_FLOAT_START_DATE,
    amount: 0,
    note: "",
    updatedAt: "",
    updatedBy: "",
  };
  state.adminCashAccounts = {
    effectiveDate: ADMIN_CASH_START_DATE,
    businessOpening: 0,
    businessOpeningByChannel: normalizeBusinessCashBalances(),
    personalOpening: 0,
    productionEffectiveDate: CASH_FLOAT_START_DATE,
    productionOpening: 0,
    note: "",
    updatedAt: "",
    updatedBy: "",
    productionNote: "",
    productionUpdatedAt: "",
    productionUpdatedBy: "",
  };
  state.adminCashPeriods = [];
  state.adminCashTransfers = [];
  state.adminDailyCashSales = [];
  state.adminDailyTransfers = [];
  selectedStockId = "";
  saleItems = [];
  activeSaleDraftId = "";
  saveState();
  renderAll();
});

initializeTheme();
initializeSidebar();
initializeNavigationGroups();
initializeLucideIcons();
renderStockEntryMode();
renderStockPhotoDraft();
renderSaleItemMode();
renderAll();
startSharedSync();


// Explicit preview avoids regenerating large reports on every filter change.
document.querySelector('#previewExport').addEventListener('click', () => {
  const form = els.exportForm;
  const preview = document.querySelector('#exportPreview');
  preview.hidden = false;
  if (form.startDate.value && form.endDate.value && form.startDate.value > form.endDate.value) {
    preview.textContent = 'Start Date must be on or before End Date.';
    return;
  }
  const options = Object.fromEntries(new FormData(form));
  const data = exportRows(options);
  preview.innerHTML = `<strong>${escapeHtml(data.title)}</strong><p>${escapeHtml(options.startDate || 'All dates')} — ${escapeHtml(options.endDate || 'Present')} · ${data.rows.length} rows · First 8 rows</p><div class="report-preview-scroll"><table><thead><tr>${data.headers.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr></thead><tbody>${data.rows.slice(0, 8).map(row => `<tr>${data.headers.map((_, i) => `<td>${escapeHtml(exportCellText(row[i]))}</td>`).join('')}</tr>`).join('') || `<tr><td colspan="${data.headers.length}">No records for the selected filters.</td></tr>`}</tbody></table></div>`;
});
els.exportForm.addEventListener('change', () => { document.querySelector('#exportPreview').hidden = true; });
document.querySelectorAll('[data-export-period]').forEach(button => button.addEventListener('click', () => {
  const period = button.dataset.exportPeriod;
  els.exportForm.startDate.value = period === 'all' ? '' : period === 'month' ? monthStart(today) : today;
  els.exportForm.endDate.value = period === 'all' ? '' : today;
  document.querySelector('#exportPreview').hidden = true;
}));
