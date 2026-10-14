import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import test from 'node:test';

const app = await readFile(new URL('../app.js', import.meta.url), 'utf8');
function source(name) {
  const start = app.indexOf(`function ${name}(`);
  assert.ok(start >= 0);
  return app.slice(start, app.indexOf('\n}', start) + 2);
}
const ctx = vm.createContext({isCashInventoryItem: item => item.cash === true});
vm.runInContext(['normalizeCode', 'stockAuditExpected', 'addLiveStockToAudit', 'addScannedLiveStockToAudit', 'stockAuditScanResult', 'reconcileStockAudit'].map(source).join('\n'), ctx);
const stock = [
  {id:'a', productCode:'F001', status:'available', description:'Flower'},
  {id:'b', productCode:'F002', status:'sold'},
  {id:'c', productCode:'F003', status:'available', inventoryLocation:'pending'},
  {id:'d', productCode:'S001', itemType:'sku', quantityAvailable:4},
  {id:'e', productCode:'S002', itemType:'sku', quantityAvailable:0},
  {id:'f', productCode:'C001', status:'available', cash:true},
];
test('batch reconciliation preserves all captured codes and reports duplicates and unexpected codes after scanning', () => {
  const audit = {id:'batch',expected:ctx.stockAuditExpected(stock,'shop')};
  const scans = [
    {id:'1',auditId:'batch',productCode:' f001 '},
    {id:'2',auditId:'batch',productCode:'UNKNOWN'},
    {id:'3',auditId:'batch',productCode:'F001'},
    {id:'4',auditId:'other',productCode:'S001'},
  ];
  const before = JSON.stringify(scans);
  const result = ctx.reconcileStockAudit(audit,scans);
  assert.equal(result.matched.length,1);
  assert.equal(result.matched[0].stockId,'a');
  assert.equal(result.exceptions.length,2);
  assert.equal(JSON.stringify(scans),before);
  assert.equal(audit.expected.length-result.matched.length,1);
  assert.equal(ctx.reconcileStockAudit(audit,[{auditId:'batch',stockId:'a'}]).matched.length,1);
});
test('audit snapshots only available stock at selected location and preserves quantity without mutation', () => {
  const before = JSON.stringify(stock);
  const expected = ctx.stockAuditExpected(stock, 'shop');
  assert.equal(JSON.stringify(expected.map(row => row.productCode)), JSON.stringify(['F001','S001']));
  assert.equal(expected[1].quantity, 4);
  assert.equal(ctx.stockAuditExpected(stock, 'pending').length, 1);
  expected[0].description = 'snapshot edit';
  assert.equal(JSON.stringify(stock), before);
});
test('scans match exact code, reject duplicates and closed sessions, retain snapshot after sale', () => {
  const audit = {id:'session',expected:ctx.stockAuditExpected(stock,'shop')};
  assert.equal(ctx.stockAuditScanResult(audit, [], stock, ' f001 ').item.stockId, 'a');
  for (const code of ['', 'F00', 'UNKNOWN', 'F002', 'F003']) assert.ok(ctx.stockAuditScanResult(audit, [], stock, code).error);
  assert.ok(ctx.stockAuditScanResult(audit, [{auditId:'session',stockId:'a'}], stock, 'F001').error);
  assert.ok(ctx.stockAuditScanResult({...audit,completedAt:'done'}, [], stock, 'F001').error);
  assert.ok(ctx.stockAuditScanResult(null, [], stock, 'F001').error);
  assert.ok(ctx.stockAuditScanResult(audit, [{auditId:'older',stockId:'a'}], stock, 'F001').item);
  assert.ok(ctx.stockAuditScanResult(audit, [], [], 'F001').item);
  assert.ok(ctx.stockAuditScanResult({...audit,expected:[...audit.expected,audit.expected[0]]}, [], stock, 'F001').error);
});

test('available stock moved into the audited location after start is added once and reconciles as valid', () => {
  const audit = {id:'session', location:'shop', expected:ctx.stockAuditExpected(stock,'shop')};
  const movedIn = {id:'new', productCode:'F1284', description:'Moved flower', status:'available', inventoryLocation:'shop'};
  const added = ctx.addLiveStockToAudit(audit, [...stock, movedIn], ' f1284 ');
  assert.equal(added.stockId, 'new');
  assert.equal(added.addedDuringAudit, true);
  assert.equal(audit.expected.filter(row => row.productCode === 'F1284').length, 1);
  assert.equal(ctx.addLiveStockToAudit(audit, [...stock, movedIn], 'F1284'), null);
  assert.equal(ctx.reconcileStockAudit(audit, [{auditId:'session',productCode:'F1284'}]).matched[0].stockId, 'new');
  for (const item of [
    {...movedIn,id:'sold',productCode:'SOLD',status:'sold'},
    {...movedIn,id:'pending',productCode:'PEND',inventoryLocation:'pending'},
  ]) assert.equal(ctx.addLiveStockToAudit(audit, [...stock, item], item.productCode), null);
  assert.equal(ctx.addLiveStockToAudit(audit, [...stock, movedIn, {...movedIn,id:'duplicate'}], 'F1284'), null);
});

test('an existing exception becomes valid when its unique available stock is now at the audited location', () => {
  const audit = {id:'session', location:'shop', expected:ctx.stockAuditExpected(stock,'shop')};
  const movedIn = {id:'new', productCode:'F1284', description:'Moved flower', status:'available', inventoryLocation:'shop'};
  const scans = [{id:'scan', auditId:'session', productCode:'F1284'}];
  assert.equal(ctx.reconcileStockAudit(audit, scans).exceptions.length, 1);
  assert.equal(ctx.addScannedLiveStockToAudit(audit, scans, [...stock, movedIn]), 1);
  assert.equal(ctx.reconcileStockAudit(audit, scans).matched[0].stockId, 'new');
  assert.equal(ctx.addScannedLiveStockToAudit(audit, scans, [...stock, movedIn]), 0);
  assert.equal(ctx.addScannedLiveStockToAudit({...audit,completedAt:'done'}, scans, [...stock, movedIn]), 0);
});

test('only admin can open an audit PDF window', () => {
  for (const role of ['cashier', 'cashier_expense', 'production', 'manager', 'accountant', undefined]) {
    const context = vm.createContext({ currentStaff: () => role ? {role} : undefined, window: {open() {throw new Error('PDF must not open');}} });
    vm.runInContext(source('printStockAuditReport'), context);
    context.printStockAuditReport();
  }
});

test('completed audit reopens without changing snapshot or scans', () => {
  const audit = {id:'a', completedAt:'done', completedBy:'Admin', expected:[{stockId:'s', productCode:'F1'}]};
  const scans = [{id:'scan',auditId:'a',productCode:'F1'}];
  const before = JSON.stringify({expected:audit.expected, scans});
  let handler;
  let saved = 0;
  const node = {addEventListener: (_, fn) => {handler = fn;}, focus() {}};
  const context = vm.createContext({document:{querySelector:()=>node}, hasPermission:()=>true, currentStockAudit:()=>audit, currentStaff:()=>({name:'Admin',role:'admin'}), saveState:()=>saved++, renderStockAudit() {}});
  const start = app.indexOf('document.querySelector("#auditEdit").addEventListener');
  vm.runInContext(app.slice(start, app.indexOf('\n});', start) + 4), context);
  handler();
  assert.equal(audit.completedAt, undefined);
  assert.equal(audit.previousCompletedAt, 'done');
  assert.equal(saved, 1);
  assert.equal(JSON.stringify({expected:audit.expected, scans}), before);
});

test('non-admin roles cannot reopen, edit or remove audit scans', () => {
  for (const role of ['cashier', 'cashier_expense', 'production', 'manager', 'accountant', undefined]) {
    for (const selector of ['auditEdit', 'auditRows', 'auditDelete']) {
      let handler;
      const context = vm.createContext({
        currentStaff: () => role ? {role} : undefined,
        document: {querySelector: () => ({addEventListener: (_, fn) => {handler = fn;}})},
        currentStockAudit: () => ({id:'locked',expected:[]}),
      });
      vm.runInContext(source('canEditAuditScans'), context);
      const start = app.indexOf(`document.querySelector("#${selector}").addEventListener`);
      vm.runInContext(app.slice(start, app.indexOf('\n});', start) + 4), context);
      handler({target:{closest:selector=>selector === "[data-use-audit-code]" ? null : ({dataset:{editAuditScan:'scan'}})}});
      handler({target:{closest:selector=>selector === "[data-use-audit-code]" ? null : ({dataset:{removeAuditScan:'scan'}})}});
    }
  }
});

test('scanned rows show snapshot names immediately, including legacy scans and current-stock fallback', () => {
  const context = vm.createContext({});
  vm.runInContext(['normalizeCode', 'stockAuditScanDescription'].map(source).join('\n'), context);
  const expected = [{stockId:'a',productCode:'F001',description:'Original flower'}];
  const live = [{id:'a',productCode:'F001',description:'Renamed flower'}, {id:'b',productCode:'F002',description:'New flower'}];
  assert.equal(context.stockAuditScanDescription({productCode:' f001 '}, expected, live), 'Original flower');
  assert.equal(context.stockAuditScanDescription({stockId:'a'}, expected, live), 'Original flower');
  assert.equal(context.stockAuditScanDescription({productCode:'F002'}, expected, live), 'New flower');
  assert.equal(context.stockAuditScanDescription({productCode:'F001'}, expected, []), 'Original flower');
  assert.equal(context.stockAuditScanDescription({productCode:'UNKNOWN'}, expected, live), 'ပစ္စည်းအမည် မတွေ့ပါ');
  assert.equal(context.stockAuditScanDescription({productCode:'F001'}, [...expected, ...expected], live), 'Code တူများနေသည်');
  assert.ok(app.includes('escapeHtml(stockAuditScanDescription(scan, expected, state.stock))'));
});

test('admin deletes only the selected audit and its scans, and cancellation preserves them', () => {
  for (const approved of [false, true]) {
    const audit = {id:'a',startedAt:'2026-09-10',location:'shop'};
    const other = {id:'b'};
    const state = {stockAudits:[audit, other],stockAuditScans:[{id:'1',auditId:'a'},{id:'2',auditId:'b'}], stock:[{id:'original'}]};
    let handler;
    let saved = 0;
    const context = vm.createContext({state, selectedStockAuditId:'a', currentStaff:()=>({role:'admin'}), currentStockAudit:()=>audit,
      inventoryLocationLabel:()=> 'Shop', confirm:()=>approved, saveState:()=>saved++, renderStockAudit(){},
      document:{querySelector:()=>({addEventListener:(_,fn)=>{handler=fn;}})}});
    const start = app.indexOf('document.querySelector("#auditDelete").addEventListener');
    vm.runInContext(app.slice(start, app.indexOf('\n});',start)+4),context);
    handler();
    assert.equal(saved, approved ? 1 : 0);
    assert.equal(state.stockAudits.length, approved ? 1 : 2);
    assert.equal(state.stockAuditScans.length, approved ? 1 : 2);
    assert.equal(state.stockAudits.at(-1).id,'b');
    assert.equal(state.stockAuditScans.at(-1).auditId,'b');
    assert.deepEqual(state.stock,[{id:'original'}]);
  }
});

test('pending split only selects uniquely matched pending scans outside the original shop snapshot', () => {
  const context=vm.createContext({isCashInventoryItem:()=>false});
  vm.runInContext(['normalizeCode','stockAuditExpected','planPendingAuditSplit'].map(source).join('\n'),context);
  const audit={id:'shop',location:'shop',completedAt:'done',expected:[{productCode:'SHOP'}]};
  const scans=['SHOP','PEND','UNKNOWN','DUP'].map((productCode,i)=>({id:String(i),auditId:'shop',productCode}));
  const stock=['SHOP','PEND','DUP','DUP'].map((productCode,i)=>({id:String(i),productCode,inventoryLocation:'pending',status:'available'}));
  const before=JSON.stringify({audit,scans,stock});
  const result=context.planPendingAuditSplit(audit,scans,stock);
  assert.equal(result.selected.length,1);
  assert.equal(result.selected[0].productCode,'PEND');
  assert.equal(JSON.stringify({audit,scans,stock}),before);
  assert.equal(context.planPendingAuditSplit({...audit,completedAt:null},scans,stock).selected.length,0);
});

test('SKU quantities distinguish matching, short, excess, zero and uncounted legacy scans', () => {
  const context=vm.createContext({});
  vm.runInContext(['normalizeCode','auditSkuItem','auditQuantityStatus'].map(source).join('\n'),context);
  const item={stockId:'s',productCode:'B001',itemType:'sku',quantity:5};
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:5}),'Qty 5 · ✓ ကိုက်ညီ');
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:3}),'Qty 3 · လို 2');
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:8}),'Qty 8 · ပို 3');
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:0}),'Qty 0 · လို 5');
  assert.equal(context.auditQuantityStatus(item,{}),'Qty မစစ်ရသေး');
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:-1}),'Qty မစစ်ရသေး');
  assert.equal(context.auditQuantityStatus(item,{countedQuantity:1.5}),'Qty မစစ်ရသေး');
  assert.equal(context.auditSkuItem({expected:[item]},' b001 ',[]).stockId,'s');
  assert.equal(context.auditSkuItem({expected:[{...item,itemType:undefined,quantity:1}]},'B001',[{productCode:'B001',itemType:'sku'}]).stockId,'s');
  assert.equal(context.auditSkuItem({expected:[item,item]},'B001',[]),null);
});

test('SKU scan waits for quantity, rejects invalid input, then saves a zero count without changing stock', () => {
  const nodes=new Map();
  const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',dataset:{},hidden:true,focus(){},addEventListener(_,fn){this.handler=fn;}});return nodes.get(id);};
  const audit={id:'a',expected:[{productCode:'B1',itemType:'sku',quantity:5}]};
  const stock=[{productCode:'B1',itemType:'sku',quantityAvailable:5}];
  const state={stock,stockAuditScans:[]};
  const context=vm.createContext({state, document:{querySelector:node},hasPermission:()=>true,currentStockAudit:()=>audit,currentStaff:()=>({role:'cashier',name:'Sale'}),uid:()=> 'scan',saveState(){},renderStockAudit(){}});
  vm.runInContext(['normalizeCode','stockAuditExpected','addLiveStockToAudit','auditSkuItem','resetAuditQuantity'].map(source).join('\n'),context);
  const start=app.indexOf('document.querySelector("#auditScanForm").addEventListener');
  vm.runInContext(app.slice(start,app.indexOf('\n});',start)+4),context);
  node('#auditBarcode').value='B1';
  const submit=()=>node('#auditScanForm').handler({preventDefault(){}});
  submit();
  assert.equal(node('#auditQtyField').hidden,false);
  assert.equal(state.stockAuditScans.length,0);
  node('#auditQty').value='1.5';submit();assert.equal(state.stockAuditScans.length,0);
  node('#auditQty').value='0';submit();
  assert.equal(state.stockAuditScans[0].countedQuantity,0);
  assert.equal(state.stockAuditScans[0].itemType,'sku');
  assert.equal(stock[0].quantityAvailable,5);
  assert.equal(node('#auditQtyField').hidden,true);
});

test('audit sorting uses natural codes and numeric quantities, puts missing counts last, and preserves records', () => {
  const context=vm.createContext({});
  vm.runInContext(source('sortAuditRows'),context);
  const rows=[{code:'B10',qty:10,time:'2026-09-10T02:00:00Z'},{code:'B2',qty:2,time:'2026-09-10T01:00:00Z'},{code:'B1',qty:null,time:null},{code:'B3',qty:0,time:'2026-09-10T03:00:00Z'}];
  const before=JSON.stringify(rows);
  const sorted=mode=>Array.from(context.sortAuditRows(rows,mode,row=>row),row=>row.code);
  assert.deepEqual(sorted('code-asc'),['B1','B2','B3','B10']);
  assert.deepEqual(sorted('code-desc'),['B10','B3','B2','B1']);
  assert.deepEqual(sorted('qty-asc'),['B3','B2','B10','B1']);
  assert.deepEqual(sorted('qty-desc'),['B10','B2','B3','B1']);
  assert.deepEqual(sorted('time-desc'),['B3','B10','B2','B1']);
  assert.equal(JSON.stringify(rows),before);
});

test('temporarily disabled pending split cannot modify any records', () => {
  let handler;
  const context=vm.createContext({pendingAuditSplitEnabled:false,document:{querySelector:()=>({addEventListener:(_,fn)=>{handler=fn;}})},currentStaff:()=>({role:'admin'}),currentStockAudit:()=>{throw Error('Disabled action accessed audit');}});
  const start=app.indexOf('document.querySelector("#auditSplitPending").addEventListener');
  vm.runInContext(app.slice(start,app.indexOf('\n});',start)+4),context);
  handler();
});

test('only admin can unlock sale editing and finishing locks it again', () => {
  const context=vm.createContext({});
  vm.runInContext(source('canEditAuditScans'),context);
  for (const role of ['cashier','cashier_expense']) {
    assert.equal(context.canEditAuditScans({id:'a'},role),false);
    assert.equal(context.canEditAuditScans({id:'a',saleEditingEnabled:true},role),true);
    assert.equal(context.canEditAuditScans({id:'a',saleEditingEnabled:true,completedAt:'done'},role),false);
    assert.equal(context.canEditAuditScans({id:'a',saleEditingEnabled:false},role),false);
  }
  for (const role of ['production','manager','accountant',undefined]) assert.equal(context.canEditAuditScans({saleEditingEnabled:true},role),false);
  assert.equal(context.canEditAuditScans({},'admin'),true);
  assert.equal(context.canEditAuditScans({id:'done',completedAt:'done'},'admin'),true);
  assert.equal(context.canEditAuditScans(null,'admin'),false);
});

test('sale can add scans to legacy admin-reopened audits without granting access to closed or explicitly locked audits', () => {
  const context=vm.createContext({});
  vm.runInContext(source('canEditAuditScans'),context);
  for (const role of ['cashier','cashier_expense']) {
    const legacy={id:'old',previousCompletedAt:'2026-09-10T08:00:00Z'};
    assert.equal(context.canEditAuditScans(legacy,role),true);
    assert.equal(context.canEditAuditScans({...legacy,saleEditingEnabled:false},role),false);
    assert.equal(context.canEditAuditScans({...legacy,completedAt:'done'},role),false);
    assert.equal(context.canEditAuditScans({id:'new'},role),false);
  }
  assert.equal(context.canEditAuditScans({previousCompletedAt:'done'},'production'),false);
});

test('Sale can submit a new scan to an open reopened audit even when an old edit flag is false', () => {
  for (const completedAt of [undefined,'done']) {
    const nodes=new Map();
    const node=id=>{if(!nodes.has(id))nodes.set(id,{value:'',dataset:{},hidden:true,focus(){},addEventListener(_,fn){this.handler=fn;}});return nodes.get(id);};
    const audit={id:'a',previousCompletedAt:'old',saleEditingEnabled:false,completedAt,expected:[]};
    const state={stock:[],stockAuditScans:[]};
    const context=vm.createContext({state,document:{querySelector:node},hasPermission:()=>true,currentStockAudit:()=>audit,currentStaff:()=>({role:'cashier_expense',name:'Sale'}),uid:()=> 'scan',saveState(){},renderStockAudit(){}});
    vm.runInContext(['normalizeCode','stockAuditExpected','addLiveStockToAudit','auditSkuItem','resetAuditQuantity'].map(source).join('\n'),context);
    const start=app.indexOf('document.querySelector("#auditScanForm").addEventListener');
    vm.runInContext(app.slice(start,app.indexOf('\n});',start)+4),context);
    node('#auditBarcode').value='F001';
    node('#auditScanForm').handler({preventDefault(){}});
    assert.equal(state.stockAuditScans.length,completedAt ? 0 : 1);
    if(!completedAt)assert.equal(state.stockAuditScans[0].productCode,'F001');
  }
});

test('audit descriptions show saved color and fall back to current color only for legacy snapshots', () => {
  const context=vm.createContext({});
  vm.runInContext(['normalizeCode','stockAuditScanDescription'].map(source).join('\n'),context);
  const scan={productCode:'F1'};
  const live=[{productCode:'F1',paperColor:'နီ'}];
  assert.equal(context.stockAuditScanDescription(scan,[{productCode:'F1',description:'Flower',paperColor:'ဖြူ'}],live),'Flower · အရောင်: ဖြူ');
  assert.equal(context.stockAuditScanDescription(scan,[{productCode:'F1',description:'Flower'}],live),'Flower · အရောင်: နီ');
  assert.equal(context.stockAuditScanDescription(scan,[{productCode:'F1',description:'Flower',paperColor:'-'}],live),'Flower');
  assert.equal(context.stockAuditScanDescription(scan,[{productCode:'F1',description:'Flower',paperColor:''}],live),'Flower');
});

test('reopened audit search finds unscanned expected and live codes without changing the audit', () => {
  const context=vm.createContext({});
  vm.runInContext(['normalizeCode','stockAuditScanDescription','searchUnscannedAuditItems'].map(source).join('\n'),context);
  const audit={id:'a',expected:[{stockId:'1',productCode:'F001',description:'Rose',quantity:1},{stockId:'2',productCode:'F002',description:'Tulip',quantity:1}]};
  const scans=[{auditId:'a',productCode:'F001'}];
  const stock=[{productCode:'F003',description:'Rose',paperColor:'Red'}];
  const before=JSON.stringify({audit,scans,stock});
  assert.equal(context.searchUnscannedAuditItems(audit,scans,stock,' f002 ')[0].inSnapshot,true);
  assert.equal(context.searchUnscannedAuditItems(audit,scans,stock,'red')[0].inSnapshot,false);
  assert.equal(context.searchUnscannedAuditItems(audit,scans,stock,'F001').length,0);
  assert.equal(context.searchUnscannedAuditItems(audit,scans,stock,'').length,0);
  assert.equal(JSON.stringify({audit,scans,stock}),before);
});
