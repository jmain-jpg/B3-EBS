import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
function source(name) {
  const match = new RegExp(`(?:async )?function ${name}\\(`).exec(app);
  assert.ok(match, name);
  return app.slice(match.index, app.indexOf('\n}', match.index) + 2);
}
function context(names, extra = {}) {
  const sandbox = vm.createContext(extra);
  vm.runInContext(names.map(source).join('\n'), sandbox);
  return sandbox;
}

test('indexed item costs preserve live, manual, cash, zero and legacy duplicate semantics', () => {
  const ctx = context(['normalizeCode','isMoneyBouquetCategory','isCashInventoryItem','stockUnitCost','saleStockUnitCost','savedSaleItemUnitCost','resolvedSaleItemCostState','buildStockCostLookup','saleItemCost','repairSaleItemCostsFromStock']);
  const stock = [
    {id:'s1',productCode:'M001',category:'ငွေသားပန်းစည်း',cashValue:50000},
    {id:'s2',productCode:'F001',cashValue:0},
    {id:'s3',productCode:'MM001',category:'ငွေသား',unitCost:1000,itemType:'sku'},
    {id:'s1',productCode:'M001',cashValue:99000},
    {id:'legacy',productCode:'',cashValue:123},
  ];
  const items = [
    {stockId:'s1',quantity:2}, {productCode:' m001 ',quantity:3},
    {stockId:'s2',unitCost:800,quantity:2}, {stockId:'s3',quantity:20},
    {productCode:'unknown',pendingBouquetCash:12000}, {productCode:'unknown'},
    {productCode:'unknown',cost:6000,quantity:3}, {},
  ].map(item=>({productCode:'',...item}));
  const lookup = ctx.buildStockCostLookup(stock);
  for (const item of items) assert.equal(ctx.saleItemCost(item,stock,lookup),ctx.saleItemCost(item,stock));
  const a=structuredClone(items), b=structuredClone(items);
  ctx.repairSaleItemCostsFromStock(a,stock);
  ctx.repairSaleItemCostsFromStock(b,stock,lookup);
  assert.deepEqual(a,b);
});

test('voucher MM SKU usage is itemized and deducted by denomination times quantity',()=>{
  const state={
    stock:[{id:'mm-1',productCode:'MM001',category:'ငွေသား',itemType:'sku',unitCost:1000,description:'1000 denomination'}],
    sales:[{id:'sale-1',saleDate:'2026-09-16',createdAt:'2026-09-16T10:00:00Z',voucherNumber:'V100',items:[{stockId:'mm-1',productCode:'MM001',description:'1000 denomination',quantity:20,unitCost:1000}]}],
  };
  const ctx=context(['normalizeCode','normalizeDateValue','isCashInventoryItem','isCashFloatVoucherItem','cashFloatVoucherItemValue','cashFloatVoucherUsageDate','cashFloatVoucherValue','productionCashUsageRows'],{
    state,CASH_FLOAT_START_DATE:'2026-09-16',today:'2026-09-16',money:value=>`${Number(value||0)} MMK`,
  });
  assert.equal(ctx.cashFloatVoucherValue(state.sales[0]),20000);
  const rows=ctx.productionCashUsageRows();
  assert.equal(rows.length,1);
  assert.equal(rows[0].source,'Voucher SKU MM');
  assert.equal(rows[0].productCode,'MM001');
  assert.equal(rows[0].voucherNumber,'V100');
  assert.equal(rows[0].amount,20000);
  assert.match(rows[0].description,/Qty 20/);
});

test('voucher MM cash is deducted on fulfillment date even when its order date predates tracking',()=>{
  const sale={
    id:'sale-2585',voucherNumber:'2585',saleDate:'2026-08-30',fulfillmentDate:'2026-09-25',
    items:[{productCode:'MM0002',description:'10000 denomination',quantity:100,unitCost:10000}],
  };
  const state={
    stock:[],sales:[sale],cashFloatAllocations:[{allocationDate:'2026-09-20',amount:2000000}],
    adminCashTransfers:[],adminCashAccounts:{productionOpening:0},
  };
  const ctx=context([
    'normalizeCode','normalizeDateValue','isCashInventoryItem','isCashFloatVoucherItem','cashFloatVoucherItemValue',
    'cashFloatVoucherUsageDate','cashFloatVoucherValue','cashFloatTotals','productionCashUsageRows',
  ],{state,CASH_FLOAT_START_DATE:'2026-09-16',today:'2026-09-25',money:value=>`${Number(value||0)} MMK`});
  assert.equal(ctx.cashFloatVoucherUsageDate(sale),'2026-09-25');
  assert.equal(ctx.cashFloatVoucherValue(sale),1000000);
  assert.equal(ctx.cashFloatTotals().voucherMmUsed,1000000);
  assert.equal(ctx.cashFloatTotals().available,1000000);
  const rows=ctx.productionCashUsageRows();
  assert.equal(rows.length,1);
  assert.equal(rows[0].date,'2026-09-25');
  assert.equal(rows[0].voucherNumber,'2585');
  assert.equal(rows[0].amount,1000000);

  sale.fulfillmentDate='2026-09-26';
  assert.equal(ctx.cashFloatVoucherValue(sale),0);
  assert.equal(ctx.productionCashUsageRows().length,0);
});

test('production cash usage is grouped into one reconciliation total per day',()=>{
  const ctx=context(['productionCashUsageDailyTotals']);
  const totals=ctx.productionCashUsageDailyTotals([
    {date:'2026-09-24',source:'Cash Bouquet Stock',amount:100000},
    {date:'2026-09-25',source:'Voucher SKU MM',amount:30000},
    {date:'2026-09-24',source:'Voucher SKU MM',amount:20000},
  ]);
  assert.deepEqual(JSON.parse(JSON.stringify(totals)),[
    {date:'2026-09-25',amount:30000,itemCount:1,bouquetAmount:0,voucherAmount:30000},
    {date:'2026-09-24',amount:120000,itemCount:2,bouquetAmount:100000,voucherAmount:20000},
  ]);
});

test('production cash daily popup shows only the selected day codes and totals',()=>{
  const ctx=context(['productionCashUsageDailyTotals','productionCashDailyDetailHtml'],{
    escapeHtml:value=>String(value??''),money:value=>`${Number(value||0)} MMK`,
  });
  const html=ctx.productionCashDailyDetailHtml('2026-09-25',[
    {date:'2026-09-25',source:'Cash Bouquet Stock',productCode:'M1501',voucherNumber:'-',description:'Bouquet',amount:100000},
    {date:'2026-09-25',source:'Voucher SKU MM',productCode:'MM001',voucherNumber:'3100',description:'Qty 20',amount:20000},
    {date:'2026-09-24',source:'Cash Bouquet Stock',productCode:'M1499',voucherNumber:'-',description:'Older',amount:50000},
  ]);
  assert.match(html,/M1501/);
  assert.match(html,/MM001/);
  assert.match(html,/3100/);
  assert.match(html,/120000 MMK/);
  assert.doesNotMatch(html,/M1499|Older/);
});

test('October admin cash reset excludes September business movements while production stays independent',()=>{
  const BUSINESS_CASH_CHANNELS=[
    {id:'cash',label:'Cash'},{id:'kpay',label:'KPay'},{id:'aya_pay',label:'AYA Pay'},
    {id:'aya_banking',label:'AYA Banking'},{id:'wave',label:'Wave'},{id:'banking',label:'Banking'},
  ];
  const state={
    cashFloatAllocations:[
      {allocationDate:'2026-09-30',source:'business',amount:100},
      {allocationDate:'2026-10-01',source:'business',amount:200},
      {allocationDate:'2026-10-01',source:'personal',amount:50},
    ],
    adminCashAccounts:{businessOpeningByChannel:{cash:1000},personalOpening:500,productionOpening:999},
    adminDailyCashSales:[
      {saleDate:'2026-09-30',settlementType:'deposit',businessChannel:'cash',amount:100},
      {saleDate:'2026-10-01',settlementType:'deposit',businessChannel:'cash',amount:300},
    ],
    adminCashTransfers:[
      {transferDate:'2026-09-30',fromAccount:'business',toAccount:'production',businessChannel:'cash',amount:100},
      {transferDate:'2026-10-01',fromAccount:'business',toAccount:'production',businessChannel:'cash',amount:150},
      {transferDate:'2026-10-01',fromAccount:'personal',toAccount:'production',businessChannel:'cash',amount:25},
    ],
  };
  const ctx=context([
    'normalizeDateValue','normalizeBusinessCashChannel','normalizeBusinessCashBalances','cashMonthStart','previousCashMonth',
    'businessCashBalancesTotal','adminCashTotals',
  ],{
    state,ADMIN_CASH_START_DATE:'2026-10-01',BUSINESS_CASH_CHANNELS,today:'2026-10-01',
    cashFloatTotals:()=>({available:77}),
  });
  const totals=ctx.adminCashTotals();
  assert.equal(totals.businessAllocated,200);
  assert.equal(totals.personalAllocated,50);
  assert.equal(totals.dailySales,300);
  assert.equal(totals.businessAvailable,950);
  assert.equal(totals.personalAvailable,425);
  assert.equal(totals.productionAvailable,77);
});

test('admin cash periods isolate opening balances and movements by month',()=>{
  const BUSINESS_CASH_CHANNELS=[
    {id:'cash',label:'Cash'},{id:'kpay',label:'KPay'},{id:'aya_pay',label:'AYA Pay'},
    {id:'aya_banking',label:'AYA Banking'},{id:'wave',label:'Wave'},{id:'banking',label:'Banking'},
  ];
  const state={
    adminCashPeriods:[
      {month:'2026-09',businessOpeningByChannel:{cash:0},personalOpening:0,productionOpening:200},
      {month:'2026-10',businessOpeningByChannel:{cash:1000},personalOpening:500,productionOpening:300},
      {month:'2026-11',businessOpeningByChannel:{cash:2000},personalOpening:900,productionOpening:700},
    ],
    cashFloatAllocations:[],
    adminDailyCashSales:[
      {saleDate:'2026-10-31',settlementType:'deposit',businessChannel:'cash',amount:100},
      {saleDate:'2026-11-01',settlementType:'deposit',businessChannel:'cash',amount:250},
    ],
    adminCashTransfers:[
      {transferDate:'2026-10-15',fromAccount:'business',toAccount:'production',businessChannel:'cash',amount:50},
      {transferDate:'2026-10-20',fromAccount:'business',toAccount:'business',businessChannel:'cash',toBusinessChannel:'aya_pay',amount:200},
      {transferDate:'2026-11-02',fromAccount:'business',toAccount:'production',businessChannel:'cash',amount:80},
    ],
  };
  const ctx=context([
    'normalizeDateValue','normalizeBusinessCashChannel','normalizeBusinessCashBalances','cashMonthStart','previousCashMonth',
    'businessCashBalancesTotal','adminCashTotals',
  ],{
    state,ADMIN_CASH_START_DATE:'2026-10-01',ADMIN_CASH_FIRST_MONTH:'2026-09',BUSINESS_CASH_CHANNELS,today:'2026-11-02',
    adminCashPeriod:month=>state.adminCashPeriods.find(item=>item.month===month),
    productionCashUsageRows:month=>month==='2026-10'?[{amount:25}]:[{amount:40}],
  });
  const october=ctx.adminCashTotals('2026-10');
  const november=ctx.adminCashTotals('2026-11');
  assert.equal(october.businessAvailable,1050);
  assert.equal(october.businessByChannel.cash,850);
  assert.equal(october.businessByChannel.aya_pay,200);
  assert.equal(october.productionOpening,160);
  assert.equal(october.productionAvailable,185);
  assert.equal(november.businessAvailable,2170);
  assert.equal(november.personalAvailable,900);
  assert.equal(november.productionOpening,185);
  assert.equal(november.productionAvailable,225);
});

test('business to production transfer is always recorded against Cash',()=>{
  const state={adminCashTransfers:[]};
  const els={adminCashStatus:{textContent:''}};
  const form={
    transferDate:{value:'2026-10-01'},fromAccount:{value:'business'},toAccount:{value:'production'},
    businessChannel:{value:'kpay'},toBusinessChannel:{value:'aya_pay'},amount:{value:'250'},note:{value:''},
    reset(){},
  };
  const ctx=context(['normalizeBusinessCashChannel','addAdminCashTransfer'],{
    state,els,ADMIN_CASH_START_DATE:'2026-10-01',defaultAdminCashDate:'2026-10-01',
    currentStaff:()=>({role:'admin',name:'Admin'}),normalizeDateValue:value=>value,
    uid:()=> 'transfer-1',saveState:()=>{},renderAll:()=>{},
    cashAccountMovementLabel:account=>account,money:value=>String(value),
  });
  ctx.addAdminCashTransfer(form);
  assert.equal(state.adminCashTransfers.length,1);
  assert.equal(state.adminCashTransfers[0].businessChannel,'cash');
});

test('business cash can transfer between different channels without changing the business total',()=>{
  const state={adminCashTransfers:[]};
  const els={adminCashStatus:{textContent:''}};
  const form={
    transferDate:{value:'2026-10-06'},fromAccount:{value:'business'},toAccount:{value:'business'},
    businessChannel:{value:'kpay'},toBusinessChannel:{value:'aya_pay'},amount:{value:'10000000'},note:{value:'KPay limit'},
    reset(){},
  };
  const ctx=context(['normalizeBusinessCashChannel','addAdminCashTransfer'],{
    state,els,ADMIN_CASH_START_DATE:'2026-10-01',defaultAdminCashDate:'2026-10-01',
    currentStaff:()=>({role:'admin',name:'Admin'}),normalizeDateValue:value=>value,
    uid:()=> 'transfer-2',saveState:()=>{},renderAll:()=>{},
    cashAccountMovementLabel:(account,channel)=>account==='business'?`Business Cash (${channel})`:account,
    money:value=>String(value),
  });
  ctx.addAdminCashTransfer(form);
  assert.equal(state.adminCashTransfers.length,1);
  assert.equal(state.adminCashTransfers[0].businessChannel,'kpay');
  assert.equal(state.adminCashTransfers[0].toBusinessChannel,'aya_pay');
  assert.match(els.adminCashStatus.textContent,/kpay.*aya_pay/);
});

test('daily transfer groups receipts and subtracts expenses from the matching cash account',()=>{
  const state={
    sales:[{id:'sale-1',voucherNumber:'V1',salePerson:'Admin',payments:[
      {paymentDate:'2026-10-01',paymentType:'Cash',amount:1000},
      {paymentDate:'2026-10-01',paymentType:'KBZPay',amount:500},
      {paymentDate:'2026-10-01',paymentType:'AYA Pay',amount:200},
      {paymentDate:'2026-10-01',paymentType:'WavePay',amount:400},
      {paymentDate:'2026-10-01',paymentType:'Bank Transfer',amount:300},
      {paymentDate:'2026-10-01',paymentType:'AYA Banking',amount:900},
    ]}],
    expenses:[
      {expenseDate:'2026-10-01',paidBy:'Cash',amount:100},
      {expenseDate:'2026-10-01',paidBy:'KBZPay',amount:50},
      {expenseDate:'2026-10-01',paidBy:'AYA Pay',amount:40},
      {expenseDate:'2026-10-01',paidBy:'WavePay',amount:20},
      {expenseDate:'2026-10-01',paidBy:'Bank Transfer',amount:30},
      {expenseDate:'2026-10-01',paidBy:'AYA Banking',amount:500},
    ],
  };
  const ctx=context(['expensePaidBy','allPayments','dailyTransferPaymentChannel','dailyTransferBreakdown'],{state});
  const rows=ctx.dailyTransferBreakdown('2026-10-01');
  assert.deepEqual(JSON.parse(JSON.stringify(rows)),[
    {businessChannel:'cash',label:'Cash',received:1000,expense:100,adjustment:0,adjustmentNote:'',net:900},
    {businessChannel:'kpay',label:'KPay',received:500,expense:50,adjustment:0,adjustmentNote:'',net:450},
    {businessChannel:'aya_pay',label:'AYA Pay',received:200,expense:40,adjustment:0,adjustmentNote:'',net:160},
    {businessChannel:'wave',label:'Wave',received:400,expense:20,adjustment:0,adjustmentNote:'',net:380},
    {businessChannel:'banking',label:'Banking',received:300,expense:30,adjustment:0,adjustmentNote:'',net:270},
  ]);
});

test('admin daily transfer can update a completed date with an audited adjustment',()=>{
  const state={adminDailyCashSales:[],adminDailyTransfers:[]};
  let editorRows=[{businessChannel:'cash',label:'Cash',received:1000,expense:100,adjustment:0,adjustmentNote:'',net:900}];
  const els={summaryDate:{value:'2026-10-01'}};
  let saves=0;
  const ctx=context(['transferDailySummary'],{
    state,els,reportMode:'day',ADMIN_CASH_START_DATE:'2026-10-01',today:'2026-10-01',
    currentStaff:()=>({role:'admin',name:'Owner'}),dailyTransferRowsFromEditor:()=>editorRows,
    dailyTransferForDate:date=>state.adminDailyTransfers.find(item=>item.transferDate===date),
    confirm:()=>true,money:value=>String(value),saveState:()=>{saves+=1;},renderAll:()=>{},
  });
  ctx.transferDailySummary();
  editorRows=[{businessChannel:'cash',label:'Cash',received:1000,expense:100,adjustment:-25,adjustmentNote:'Cash short',net:875}];
  ctx.transferDailySummary();
  assert.equal(saves,2);
  assert.equal(state.adminDailyTransfers.length,1);
  assert.equal(state.adminDailyTransfers[0].id,'daily-transfer-2026-10-01');
  assert.equal(state.adminDailyCashSales.length,3);
  assert.equal(state.adminDailyCashSales[0].settlementType,'expense_shortfall');
  assert.equal(state.adminDailyCashSales[0].amount,100);
  assert.equal(state.adminDailyCashSales[1].settlementType,'deposit');
  assert.equal(state.adminDailyCashSales[1].amount,1000);
  assert.equal(state.adminDailyCashSales[2].settlementType,'expense_shortfall');
  assert.equal(state.adminDailyCashSales[2].amount,25);
  assert.match(state.adminDailyCashSales[2].note,/Cash short/);
  assert.equal(state.adminDailyTransfers[0].totalAdjustment,-25);
  assert.equal(state.adminDailyTransfers[0].totalNet,875);
});

function syncContext({dirty=false,deletes=false,entities=[],initial=false,noBase=false}={}) {
  const calls=[];
  const base={stock:[{id:'keep'}]};
  const ctx=context(['pullSharedState'],{
    sharedSyncSaving:false,sharedSyncPulling:false,sharedSyncReady:true,
    sharedSyncBase:noBase?null:base,sharedSyncDirty:dirty,sharedSyncFailureCount:2,sharedSyncUpdatedAt:1,
    sharedSyncLastPullAt:0,
    sharedSyncDeleteIntents:{},state:{},window:{},
    fetchSyncEnvelope:async()=>({cursor:2,entities,values:[]}),
    fetchCompleteSharedState:async()=>({updatedAt:2,state:{}}),
    hasDeleteIntents:()=>deletes,
    normalizeState:x=>(calls.push('normalize'),x),
    applySyncEnvelope:()=>({}),stateBusinessScore:()=>1,
    sharedStatePayload:()=>({}),mergeSharedChanges:()=>({}),sameSharedState:()=>true,
    applySharedState:()=>calls.push('apply'),setSyncBase:()=>calls.push('base'),
    setSyncDirty:()=>{},renderAll:()=>calls.push('render'),
    pushSharedState:async()=>calls.push('push'),
    setCloudSyncGuard:()=>{},setCloudSyncStatus:()=>{},syncedTimeLabel:()=>'',
    localStorage:{setItem:()=>{}},
  });
  return {ctx,calls,base,initial};
}
test('empty clean sync skips normalization, cloning, rendering and baseline replacement', async()=>{
  const {ctx,calls,base}=syncContext();await ctx.pullSharedState();
  assert.deepEqual(calls,[]);assert.equal(ctx.sharedSyncBase,base);
  assert.equal(ctx.sharedSyncUpdatedAt,2);assert.equal(ctx.sharedSyncPulling,false);
  assert.equal(ctx.sharedSyncFailureCount,0);
});
test('empty sync still pushes dirty edits; initial and changed snapshots still apply', async()=>{
  const dirty=syncContext({dirty:true});await dirty.ctx.pullSharedState();assert.ok(dirty.calls.includes('push'));
  for(const options of [{initial:true},{entities:[{entityKey:'new'}]}]){
    const c=syncContext(options);await c.ctx.pullSharedState({initial:!!options.initial});
    assert.ok(c.calls.includes('normalize'));assert.ok(c.calls.includes('apply'));assert.ok(c.calls.includes('render'));
  }
});
test('complete bootstrap without a merge baseline applies the fetched cloud state', async()=>{
  const c=syncContext({noBase:true});
  await c.ctx.pullSharedState();
  assert.ok(c.calls.includes('normalize'));
  assert.ok(c.calls.includes('apply'));
  assert.ok(c.calls.includes('render'));
});
test('pending delete intents cannot take the empty-clean fast path',async()=>{
  const c=syncContext({deletes:true});await c.ctx.pullSharedState();assert.ok(c.calls.includes('normalize'));
});
test('failed poll releases the lock and preserves the merge baseline', async()=>{
  const c=syncContext();c.ctx.fetchSyncEnvelope=async()=>{throw new Error('offline')};
  await c.ctx.pullSharedState();assert.equal(c.ctx.sharedSyncPulling,false);assert.equal(c.ctx.sharedSyncBase,c.base);assert.equal(c.ctx.sharedSyncReady,false);
});

test('complete bootstrap uses the authenticated full-state endpoint', async()=>{
  const ctx=context(['fetchCompleteSharedState'],{
    fetchFullSharedState:async()=>({updatedAt:130,state:{stock:[{id:'current'}]}}),
    normalizeState:value=>value,
  });
  const result=await ctx.fetchCompleteSharedState();
  assert.equal(result.updatedAt,130);assert.equal(result.bootstrap,'full-state');
  assert.deepEqual(result.state.stock,[{id:'current'}]);
});

test('D1 quota fallback keeps a device cache instead of applying an older recovery', async()=>{
  const c=syncContext();let recoveryReads=0;
  c.ctx.fetchSyncEnvelope=async()=>{const error=new Error('quota');error.code='D1_DAILY_READ_LIMIT';throw error;};
  c.ctx.fetchRecoverySharedState=async()=>{recoveryReads+=1;return {updatedAt:1,state:{}};};
  await c.ctx.pullSharedState();
  assert.equal(recoveryReads,0);assert.ok(!c.calls.includes('apply'));assert.equal(c.ctx.window.b3SharedSync.offline,true);
});

const renderers=['renderHome','renderMetrics','renderHistory','renderStockCashValueField','renderSticker','updateSaleStepNav','renderSaleItems','renderVoucherPaymentDetails','renderSaleDrafts','renderInventory','renderSummary','renderFinance','renderCashFloat','renderSettings','renderExpenseTable','renderVoucherHistory','renderReceivables','renderGirlfriendDayOrders','renderFulfillmentTable','renderCodeCheckTable','renderProductionOrders'];
test('render routing runs only the active view and clears read-only hidden rows',()=>{
  const called=[],cleared=[];
  const ctx=context(['renderActiveView'],{
    currentStaff:()=>({id:'test'}),activeRenderView:'stock',
    document:{getElementById:id=>({childNodes:[{}],replaceChildren:()=>cleared.push(id)})},
    ...Object.fromEntries(renderers.map(n=>[n,()=>called.push(n)])),
  });
  ctx.renderActiveView();assert.deepEqual(called,['renderStockCashValueField']);
  assert.ok(cleared.includes('inventoryTable'));assert.ok(!cleared.includes('saleItemList'));
  called.length=0;cleared.length=0;ctx.activeRenderView='shop-inventory';ctx.renderActiveView();
  assert.deepEqual(called,['renderInventory']);assert.ok(!cleared.includes('inventoryTable'));
  for(const view of ['home','dashboard','sticker','sale','reports','finance','cashfloat','settings','expense','vouchers','receivables','fulfillment','codecheck','production','stock-inventory']){
    called.length=0;ctx.activeRenderView=view;ctx.renderActiveView();assert.ok(called.length>0,view);
  }
  ctx.currentStaff=()=>null;called.length=0;ctx.renderActiveView();assert.deepEqual(called,[]);
});

test('inventory pagination searches the full list and keeps page bounds valid',()=>{
  const nodes=new Map();const node=id=>{if(!nodes.has(id))nodes.set(id,{});return nodes.get(id)};
  const els={inventoryCategoryFilter:{options:[{}],value:''},inventorySearch:{value:''},inventoryFilter:{value:'all'},inventoryTypeFilter:{value:'all'},inventoryLocationFilter:{value:'shop'},inventorySubCategoryFilter:{value:''},inventoryTable:{innerHTML:''}};
  const stock=Array.from({length:235},(_,i)=>({id:`s${i}`,productCode:`F${String(i).padStart(4,'0')}`,createdAt:'2026-08-31',status:'available',inventoryLocation:'shop',itemType:'floral',description:'test'}));
  const ctx=context(['renderInventory'],{els,state:{stock,sales:[]},inventoryPage:1,inventoryQueryKey:'',INVENTORY_PAGE_SIZE:100,document:{querySelector:node},isCashInventoryItem:()=>false,stockUnitCost:()=>0,money:()=>'',escapeHtml:x=>String(x??''),hasPermission:()=>false,inventoryLocationLabel:x=>x});
  ctx.renderInventory();assert.equal((els.inventoryTable.innerHTML.match(/<tr>/g)||[]).length,100);
  assert.match(node('#inventoryPageInfo').textContent,/1–100 \/ 235/);
  ctx.inventoryPage=3;ctx.renderInventory();assert.equal((els.inventoryTable.innerHTML.match(/<tr>/g)||[]).length,35);assert.equal(node('#inventoryNextPage').disabled,true);
  els.inventorySearch.value='F0000';ctx.renderInventory();assert.equal(ctx.inventoryPage,1);assert.match(els.inventoryTable.innerHTML,/F0000/);
  els.inventorySearch.value='missing';ctx.renderInventory();assert.equal(node('#inventoryPageInfo').textContent,'0 records');
  els.inventorySearch.value='';ctx.inventoryPage=99;ctx.renderInventory();assert.equal(ctx.inventoryPage,1);
  ctx.inventoryPage=99;ctx.renderInventory();assert.equal(ctx.inventoryPage,3);
});

test('voucher history keeps the complete payment record when filtering by voucher date',()=>{
  const sale={
    id:'sale-2688',voucherNumber:'2688',saleDate:'2026-09-03',salePerson:'Ei San',
    totalPrice:345000,fulfillmentDate:'2026-09-03',fulfillmentStatus:'delivered',items:[],
    payments:[{id:'payment-2688',paymentDate:'2026-09-04',paymentType:'KBZPay',amount:345000,kind:'initial'}],
  };
  const els={
    voucherHistorySearch:{value:''},voucherHistoryDate:{value:'2026-09-03'},
    voucherHistoryPaymentType:{value:'all'},voucherHistorySort:{value:'date-desc'},
    voucherHistoryTable:{innerHTML:''},
  };
  const ctx=context(['renderVoucherHistory','voucherMatchesPaymentType'],{
    els,state:{sales:[sale]},renderVoucherItemSummary:()=>'',salePaid:s=>s.payments.reduce((sum,p)=>sum+p.amount,0),
    saleBalance:s=>s.totalPrice-s.payments.reduce((sum,p)=>sum+p.amount,0),byDateDesc:()=>0,
    voucherPopupButton:s=>s.voucherNumber,money:value=>`${value} MMK`,paymentKindBadge:()=>'',
    escapeHtml:value=>String(value??''),fulfillmentMethodLabel:()=>'',fulfillmentStatusLabel:()=>'',lucideMarkup:()=>'',
  });
  ctx.renderVoucherHistory();
  assert.match(els.voucherHistoryTable.innerHTML,/2026-09-04 · KBZPay/);
  assert.doesNotMatch(els.voucherHistoryTable.innerHTML,/Payment မရှိသေးပါ/);
});

test('available inventory export includes complete item details and paper color',()=>{
  const item={
    id:'stock-1',productCode:'F1001',itemType:'floral',productionDate:'2026-09-20',
    productionStartedAt:'2026-09-20T08:15:30.000Z',description:'Rose bouquet',category:'Floral',
    subCategory:'Rose',paperColor:'Pink / White',cashValue:50000,salePrice:75000,
    florist:'Wati',createdBy:'Production',inventoryLocation:'shop',status:'available',
  };
  const ctx=context(['exportRows'],{
    state:{stock:[item],sales:[],expenses:[]},inDateRange:()=>true,
    stockUnitCost:stock=>stock.cashValue,inventoryLocationLabel:()=> 'Shop',
  });
  const result=ctx.exportRows({exportType:'inventory_available',startDate:'',endDate:'',stockStatus:'all'});
  assert.equal(result.rows.length,1);
  assert.equal(result.headers.length,result.rows[0].length);
  for(const [header,value] of [
    ['Production Time',item.productionStartedAt],['Description',item.description],['Paper Color',item.paperColor],
    ['Florist',item.florist],['Created By',item.createdBy],
  ]) assert.equal(result.rows[0][result.headers.indexOf(header)],value);
});

test('normalization builds one shared lookup for all vouchers and drafts',()=>{
  const body=source('normalizeState');
  assert.equal((body.match(/buildStockCostLookup\(normalized.stock\)/g)||[]).length,1);
  assert.match(body,/repairSaleItemCostsFromStock\(sale.items, normalized.stock, stockCostLookup\)/);
  assert.match(body,/saleItemCost\(item, normalized.stock, stockCostLookup\)/);
  assert.match(body,/repairSaleItemCostsFromStock\(draft.items, normalized.stock, stockCostLookup\)/);
});

test('saving must not skip an unread admin unlock on another device', async () => {
  const cursors=[]; const polls=[];
  const snapshot={stockAudits:[{id:'audit',completedAt:'old'}],stockAuditScans:[{id:'scan'}]};
  const ctx=context(['pushSharedState'],{
    sharedSyncReady:true,sharedSyncSaving:false,sharedSyncDirty:true,sharedSyncUpdatedAt:10,
    sharedSyncDeleteIntents:{},sharedSyncBase:null,state:{currentStaffId:'sale'},SHARED_SYNC_ENDPOINT:'/api/sync',
    cloneSharedState:structuredClone,sharedStatePayload:()=>snapshot,buildSharedPatch:()=>({arrays:{stockAuditScans:{upserts:[{id:'scan'}]}}}),
    currentStaff:()=>({name:'Sale'}),fetch:async()=>({ok:true,json:async()=>({cursor:12})}),
    sameSharedState:(a,b)=>JSON.stringify(a)===JSON.stringify(b),
    setSyncBase:(_,cursor)=>cursors.push(cursor),clearAppliedDeleteIntents(){},hasDeleteIntents:()=>false,
    setSyncDirty:value=>{ctx.sharedSyncDirty=value;},window:{},setCloudSyncStatus(){},syncedTimeLabel:()=>'',
    queueSharedStateSave(){},scheduleSharedSyncPoll:delay=>polls.push(delay)
  });
  await ctx.pushSharedState();
  // Admin unlock is at version 11; our scan write returns 12. Pull must still read 11.
  assert.deepEqual(cursors,[10]);
  assert.deepEqual(polls,[undefined]);
  assert.equal(ctx.sharedSyncSaving,false);
});
