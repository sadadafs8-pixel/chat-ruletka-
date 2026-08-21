const fmt0=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
const fmt2=new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtSmart=new Intl.NumberFormat('ru-RU',{minimumFractionDigits:0,maximumFractionDigits:2});
const STORAGE='fintechUiV4State';
const initialState={
  name:'Александр',
  account:{name:'Black',balance:13.84,last4:'8310'},
  cashback:0,
  spend:130607,
  promoHidden:false,
  goals:[
    {id:'suron',name:'SURON ULTRA BEE',balance:.96,target:200000,badge:'+58,97 ₽',kind:'save'},
    {id:'chill',name:'чиста кайф',balance:.33,target:500000,badge:'',kind:'save'},
    {id:'gift',name:'Сбор на подарок',balance:0,target:null,badge:'',kind:'gift'},
    {id:'gift2',name:'Сбор на подарок',balance:0,target:1000000,badge:'',kind:'gift'}
  ],
  tx:[
    {id:'seed1',title:'Супермаркет',amount:-2140,sub:'Сегодня, 14:26'},
    {id:'seed2',title:'Перевод',amount:-1500,sub:'Сегодня, 11:03'},
    {id:'seed3',title:'Пополнение',amount:5000,sub:'Вчера, 19:42'},
    {id:'seed4',title:'Кофейня',amount:-430,sub:'Вчера, 10:18'},
    {id:'seed5',title:'Такси',amount:-790,sub:'19 августа, 23:11'}
  ]
};
let state=JSON.parse(localStorage.getItem(STORAGE)||'null')||structuredClone(initialState);
if(!state.account)state.account=structuredClone(initialState.account);
if(!Array.isArray(state.goals))state.goals=structuredClone(initialState.goals);
if(!Array.isArray(state.tx))state.tx=[];
if(!Number.isFinite(Number(state.spend)))state.spend=0;
state.tx=state.tx.map((t,i)=>({...t,id:t.id||`legacy-${i}-${Date.now()}`}));
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
const rub=n=>fmt0.format(Math.abs(Number(n)||0))+' ₽';
const money=n=>fmtSmart.format(Number(n)||0)+' ₽';
const safe=s=>String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function num(v){const n=parseFloat(String(v).replace(/\s/g,'').replace(',','.'));return Number.isFinite(n)?n:NaN}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1700)}
function openSheet(html){$('#sheetContent').innerHTML=html;$('#sheet').classList.add('open');$('#sheetBackdrop').classList.add('open');$('#sheet').setAttribute('aria-hidden','false')}
function closeSheet(){$('#sheet').classList.remove('open');$('#sheetBackdrop').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true')}
$('#sheetBackdrop').onclick=closeSheet;

let pin='';
function renderPin(){$$('#pinDots i').forEach((d,i)=>d.classList.toggle('on',i<pin.length))}
function unlock(){document.body.style.overflow='auto';$('#lockScreen').classList.add('hidden');setTimeout(()=>$('#lockScreen').style.display='none',330)}
$$('#keypad [data-key]').forEach(b=>b.onclick=()=>{if(pin.length>=4)return;pin+=b.dataset.key;renderPin();if(pin.length===4)setTimeout(unlock,150)});
$('#erasePin').onclick=()=>{pin=pin.slice(0,-1);renderPin()};$('#skipPin').onclick=unlock;document.body.style.overflow='hidden';

function goalValue(g){return g.target?`${money(g.balance).replace(' ₽','')} из ${fmt0.format(g.target)} ₽`:money(g.balance)}
function goalProgress(g){if(!g.target||g.target<=0)return 0;return Math.max(0,Math.min(100,g.balance/g.target*100))}
function goalHtml(g,i){const gift=g.kind==='gift';return `<button class="goal-card" data-goal-index="${i}"><div class="goal-icon ${gift?'gift':''}">${gift?'🎁':'◢'}</div><div><strong>${safe(goalValue(g))}</strong><p>${safe(g.name)}</p>${g.target?`<div class="goal-progress"><i style="width:${goalProgress(g)}%"></i></div>`:''}</div>${g.badge?`<span class="goal-plus">${safe(g.badge)}</span>`:'<span class="goal-chevron">›</span>'}</button>`}
function render(){
  const a=state.account;
  $('.profile-name').innerHTML=`${safe(state.name)} <span>›</span>`;$('.avatar').textContent=(state.name.trim()[0]||'А').toUpperCase();
  $('#lockGreeting').textContent=`Здравствуйте, ${state.name}!`;
  $('#balanceText').textContent=fmt2.format(a.balance)+' ₽';$('#accountName').textContent=a.name;$('#quickAccountName').textContent=a.name;$('#cardLast4').textContent=a.last4;
  $('#spendTile').textContent=rub(state.spend);$('#goalList').innerHTML=state.goals.map(goalHtml).join('');
  $('.promo-card').style.display=state.promoHidden?'none':'block';save();
}
function switchScreen(name){$$('.screen').forEach(s=>s.classList.remove('active'));$('#screen'+name).classList.add('active');$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));window.scrollTo({top:0,behavior:'smooth'})}
$$('.nav-item').forEach(b=>b.onclick=()=>switchScreen(b.dataset.screen));

function editAccountSheet(){
  const a=state.account;
  openSheet(`<h3>Основной счёт</h3><div class="field"><label>Название счёта</label><input id="accName" value="${safe(a.name)}" maxlength="28"></div><div class="field"><label>Баланс</label><input id="accBalance" inputmode="decimal" value="${a.balance.toFixed(2)}"></div><div class="field"><label>Последние 4 цифры карты</label><input id="accLast4" inputmode="numeric" maxlength="4" value="${safe(a.last4)}"></div><button class="primary" id="saveAccount">Сохранить</button><div class="note">Изменения сохраняются только в этом симуляторе на устройстве.</div>`);
  $('#saveAccount').onclick=()=>{const b=num($('#accBalance').value);const last=$('#accLast4').value.replace(/\D/g,'').slice(0,4);if(!Number.isFinite(b)){toast('Проверьте баланс');return}state.account.name=$('#accName').value.trim()||'Black';state.account.balance=b;state.account.last4=last.padStart(4,'0');render();closeSheet();toast('Счёт обновлён')}
}
function goalSheet(index){
  const g=state.goals[index];if(!g)return;
  openSheet(`<h3>${safe(g.name)}</h3><div class="field"><label>Название</label><input id="goalName" value="${safe(g.name)}" maxlength="34"></div><div class="field"><label>Сейчас накоплено</label><input id="goalBalance" inputmode="decimal" value="${g.balance}"></div><div class="field"><label>Цель, ₽ (можно оставить пустой)</label><input id="goalTarget" inputmode="decimal" value="${g.target??''}" placeholder="Без цели"></div><button class="primary" id="saveGoal">Сохранить изменения</button><h4>Перевод между своими счетами</h4><div class="field"><label>Сумма</label><input id="goalMoveAmount" inputmode="decimal" placeholder="1000"></div><div class="action-row-inline"><button class="secondary-btn" id="toGoal">В копилку</button><button class="secondary-btn" id="fromGoal">На ${safe(state.account.name)}</button></div><button class="danger-btn" id="deleteGoal">Удалить счёт</button><div class="note">Все суммы локальные. Реальные банковские операции не выполняются.</div>`);
  $('#saveGoal').onclick=()=>{const b=num($('#goalBalance').value),tRaw=$('#goalTarget').value.trim(),t=tRaw===''?null:num(tRaw);if(!Number.isFinite(b)||b<0||t!==null&&(!Number.isFinite(t)||t<=0)){toast('Проверьте суммы');return}g.name=$('#goalName').value.trim()||'Накопительный счёт';g.balance=b;g.target=t;render();closeSheet();toast('Счёт обновлён')};
  $('#toGoal').onclick=()=>{const a=num($('#goalMoveAmount').value);if(!a||a<=0){toast('Введите сумму');return}if(a>state.account.balance){toast('Недостаточно на основном счёте');return}state.account.balance-=a;g.balance+=a;state.tx.unshift({id:'tx'+Date.now(),title:`В ${g.name}`,amount:-a,sub:'Только что',countSpend:false});render();goalSheet(index);toast('Переведено в накопительный')};
  $('#fromGoal').onclick=()=>{const a=num($('#goalMoveAmount').value);if(!a||a<=0){toast('Введите сумму');return}if(a>g.balance){toast('Недостаточно в накопительном');return}g.balance-=a;state.account.balance+=a;state.tx.unshift({id:'tx'+Date.now(),title:`Из ${g.name}`,amount:a,sub:'Только что',countSpend:false});render();goalSheet(index);toast('Переведено на основной')};
  $('#deleteGoal').onclick=()=>{if(state.goals.length<=1){toast('Нужен хотя бы один счёт');return}state.goals.splice(index,1);render();closeSheet();toast('Счёт удалён')};
}
function manageGoalsSheet(){
  openSheet(`<h3>Накопительные счета</h3><div class="mini-list">${state.goals.map((g,i)=>`<button data-manage-goal="${i}"><span class="mini-ico">${g.kind==='gift'?'🎁':'◢'}</span><span class="mini-main"><b>${safe(g.name)}</b><small>${safe(goalValue(g))}</small></span><span class="mini-arrow">›</span></button>`).join('')}</div><button class="primary" id="addGoal">Добавить счёт</button>`);
  $$('[data-manage-goal]').forEach(b=>b.onclick=()=>goalSheet(Number(b.dataset.manageGoal)));
  $('#addGoal').onclick=()=>{state.goals.push({id:'g'+Date.now(),name:'Новый накопительный счёт',balance:0,target:100000,kind:'save',badge:''});render();goalSheet(state.goals.length-1)};
}
function amountSheet(kind){
  const top=kind==='topup';
  openSheet(`<h3>${top?'Пополнить '+safe(state.account.name):'Перевод'}</h3>${top?'':'<div class="field"><label>Получатель</label><input id="recipient" value="Алексей" maxlength="40"></div>'}<div class="field"><label>Сумма</label><input id="amount" inputmode="decimal" placeholder="1000"></div><button class="primary" id="confirmAmount">${top?'Пополнить':'Добавить перевод'}</button><div class="note">Операция существует только внутри симулятора: реального перевода и банковского чека не создаётся.</div>`);
  $('#confirmAmount').onclick=()=>{const a=num($('#amount').value);if(!a||a<=0){toast('Введите сумму');return}if(!top&&a>state.account.balance){toast('Недостаточно средств');return}if(top){state.account.balance+=a;state.tx.unshift({id:'tx'+Date.now(),title:'Пополнение',amount:a,sub:'Только что',impactBalance:true,countSpend:false});toast('Баланс изменён')}else{const recipient=$('#recipient').value.trim()||'Получатель';state.account.balance-=a;state.spend+=a;state.tx.unshift({id:'tx'+Date.now(),title:`Перевод • ${recipient}`,amount:-a,sub:'Только что',impactBalance:true,countSpend:true});toast('Локальный перевод добавлен')}render();closeSheet()}
}
function betweenSheet(){openSheet(`<h3>Между счетами</h3><div class="mini-list">${state.goals.map((g,i)=>`<button data-between-goal="${i}"><span class="mini-ico">⇄</span><span class="mini-main"><b>${safe(state.account.name)} ↔ ${safe(g.name)}</b><small>${safe(goalValue(g))}</small></span><span class="mini-arrow">›</span></button>`).join('')}</div><div class="note">Выберите накопительный счёт и укажите сумму.</div>`);$$('[data-between-goal]').forEach(b=>b.onclick=()=>goalSheet(Number(b.dataset.betweenGoal)))}

function txExpense(t,amount=t.amount){return t.countSpend===false?0:(Number(amount)<0?Math.abs(Number(amount)):0)}
function txRowsHtml(){return state.tx.map((t,i)=>`<button class="tx-edit-row" data-tx-index="${i}"><span class="tx-dot">${t.amount>0?'＋':'•'}</span><span class="tx-main"><b>${safe(t.title)}</b><small>${safe(t.sub||'')}</small></span><span class="tx-amount ${t.amount>0?'plus':''}">${t.amount>0?'+':'−'}${rub(t.amount)}</span></button>`).join('')||'<div class="note">Операций пока нет.</div>'}
function historySheet(){
  openSheet(`<h3>Все операции</h3><div class="history-total-card"><small>Трат в августе</small><strong>${rub(state.spend)}</strong><button id="editSpendTotal">Изменить</button></div><div class="history-actions"><button id="addOperation">＋ Операция</button><button id="addLocalTransfer">↗ Перевод</button></div><div class="tx-edit-list">${txRowsHtml()}</div><div class="note">Нажмите на операцию, чтобы изменить название, сумму или удалить её. Всё хранится только в симуляторе.</div>`);
  $('#editSpendTotal').onclick=spendEditorSheet;
  $('#addOperation').onclick=()=>operationEditorSheet(null);
  $('#addLocalTransfer').onclick=()=>amountSheet('transfer');
  $$('[data-tx-index]').forEach(b=>b.onclick=()=>operationEditorSheet(Number(b.dataset.txIndex)));
}
function spendEditorSheet(){
  openSheet(`<h3>Траты за август</h3><div class="field"><label>Сумма трат</label><input id="spendAmount" inputmode="decimal" value="${state.spend}"></div><button class="primary" id="saveSpendAmount">Сохранить</button><button class="secondary-btn" id="backToHistory">Назад к операциям</button><div class="note">Меняется только цифра внутри симулятора.</div>`);
  $('#saveSpendAmount').onclick=()=>{const v=num($('#spendAmount').value);if(!Number.isFinite(v)||v<0){toast('Проверьте сумму');return}state.spend=v;render();historySheet();toast('Траты обновлены')};
  $('#backToHistory').onclick=historySheet;
}
function operationEditorSheet(index){
  const editing=Number.isInteger(index)&&state.tx[index];
  const t=editing?state.tx[index]:{title:'Покупка',amount:-1000,sub:'Только что'};
  openSheet(`<h3>${editing?'Операция':'Добавить операцию'}</h3><div class="field"><label>Название</label><input id="txTitle" value="${safe(t.title)}" maxlength="50"></div><div class="field"><label>Описание / время</label><input id="txSub" value="${safe(t.sub||'Только что')}" maxlength="60"></div><div class="field"><label>Сумма: минус = расход, плюс = поступление</label><input id="txAmountEdit" inputmode="decimal" value="${t.amount}"></div><button class="primary" id="saveTxEdit">${editing?'Сохранить':'Добавить'}</button>${editing?'<button class="danger-btn" id="deleteTxEdit">Удалить операцию</button>':''}<button class="secondary-btn" id="cancelTxEdit">Назад</button><div class="note">Это запись в локальной истории симулятора, а не подтверждение реального платежа.</div>`);
  $('#saveTxEdit').onclick=()=>{const newAmount=num($('#txAmountEdit').value);if(!Number.isFinite(newAmount)||newAmount===0){toast('Проверьте сумму');return}const title=$('#txTitle').value.trim()||(newAmount>0?'Поступление':'Покупка');const sub=$('#txSub').value.trim()||'Только что';if(editing){const oldAmount=Number(t.amount)||0;const oldExpense=txExpense(t,oldAmount);const newExpense=txExpense(t,newAmount);if(t.impactBalance)state.account.balance+=newAmount-oldAmount;state.spend=Math.max(0,state.spend-oldExpense+newExpense);t.title=title;t.sub=sub;t.amount=newAmount}else{state.account.balance+=newAmount;const item={id:'tx'+Date.now(),title,sub,amount:newAmount,impactBalance:true,countSpend:newAmount<0};state.tx.unshift(item);state.spend+=txExpense(item)}render();historySheet();toast(editing?'Операция обновлена':'Операция добавлена')};
  if(editing)$('#deleteTxEdit').onclick=()=>{const oldExpense=txExpense(t);if(t.impactBalance)state.account.balance-=Number(t.amount)||0;state.spend=Math.max(0,state.spend-oldExpense);state.tx.splice(index,1);render();historySheet();toast('Операция удалена')};
  $('#cancelTxEdit').onclick=historySheet;
}
function searchSheet(){
  const items=[{title:'Все операции',sub:'История трат',go:historySheet},{title:'Кэшбэк и бонусы',sub:'Начисления',go:()=>$('#cashbackTile').click()},{title:state.account.name,sub:'Основной счёт',go:editAccountSheet},...state.goals.map((g,i)=>({title:g.name,sub:'Накопительный счёт',go:()=>goalSheet(i)}))];
  openSheet(`<h3>Поиск</h3><div class="field"><input id="searchInput" placeholder="Что найти?" autocomplete="off"></div><div class="search-results" id="searchResults"></div>`);
  const draw=q=>{const m=items.filter(x=>(x.title+' '+x.sub).toLowerCase().includes(q.toLowerCase()));$('#searchResults').innerHTML=m.map(x=>`<button data-search-i="${items.indexOf(x)}"><b>${safe(x.title)}</b><small>${safe(x.sub)}</small></button>`).join('')||'<div class="note">Ничего не найдено</div>';$$('[data-search-i]').forEach(b=>b.onclick=()=>{closeSheet();items[Number(b.dataset.searchI)].go()})};
  $('#searchInput').oninput=e=>draw(e.target.value);draw('');setTimeout(()=>$('#searchInput').focus(),80)
}
function qrSheet(){openSheet(`<h3>QR-код</h3><div style="height:190px;border-radius:22px;background:#080808;box-shadow:inset 0 0 0 1px #343438;display:grid;place-items:center;text-align:center;padding:20px"><div><div style="font-size:46px">⌗</div><b>Сканер симулятора</b><p style="color:#8f8f94;font-size:11px">Камера и настоящая оплата не подключены</p></div></div><button class="secondary-btn" id="qrClose">Закрыть</button>`);$('#qrClose').onclick=closeSheet}
function panelSheet(name){const titles={gifts:'Подарки',save:'Копить',invest:'Инвестиции',sim:'Сим-карта',entertainment:'Развлечения',products:'Все продукты',home:'Дом',car:'Авто',services:'Услуги',cafe:'Кафе',cinema:'Кино',taxi:'Такси',shopping:'Покупки'};openSheet(`<h3>${safe(titles[name]||'Раздел')}</h3><div style="background:#262628;border-radius:19px;padding:16px"><b>Интерактивный раздел</b><p style="color:#8f8f94;font-size:12px;line-height:1.4;margin-bottom:0">Экран открывается и работает внутри симулятора. Реальные внешние сервисы не подключены.</p></div>`)}
function supportSheet(){openSheet(`<h3>Поддержка</h3><div style="background:#262628;border-radius:18px;padding:13px;margin-bottom:11px"><b>Поддержка</b><p style="font-size:12px;color:#aaa;margin:5px 0 0">Здравствуйте! Чем можем помочь?</p></div><div class="field"><input id="chatInput" placeholder="Сообщение"></div><button class="primary" id="sendChat">Отправить</button>`);$('#sendChat').onclick=()=>{const v=$('#chatInput').value.trim();if(!v){toast('Введите сообщение');return}toast('Сообщение добавлено локально');$('#chatInput').value=''}}

$$('[data-action="topup"]').forEach(b=>b.onclick=e=>{e.stopPropagation();amountSheet('topup')});
$$('[data-action="transfer"]').forEach(b=>b.onclick=e=>{e.stopPropagation();amountSheet('transfer')});
$$('[data-action="between"]').forEach(b=>b.onclick=e=>{e.stopPropagation();betweenSheet()});
$$('[data-action="qr"]').forEach(b=>b.onclick=e=>{e.stopPropagation();qrSheet()});
$$('[data-panel]').forEach(b=>b.onclick=()=>panelSheet(b.dataset.panel));
$('#accountCard').onclick=editAccountSheet;$('#editAccount').onclick=editAccountSheet;$('#manageGoals').onclick=manageGoalsSheet;
$('#goalList').onclick=e=>{const card=e.target.closest('[data-goal-index]');if(card)goalSheet(Number(card.dataset.goalIndex))};
$('#profileBtn').onclick=()=>{openSheet(`<h3>Профиль</h3><div class="field"><label>Имя</label><input id="nameField" value="${safe(state.name)}"></div><button class="primary" id="saveProfile">Сохранить</button>`);$('#saveProfile').onclick=()=>{state.name=$('#nameField').value.trim()||'Александр';render();closeSheet();toast('Профиль обновлён')}};
$('#searchBtn').onclick=searchSheet;
$('#historyTile').onclick=historySheet;
$('#cashbackTile').onclick=()=>openSheet(`<h3>Кэшбэк и бонусы</h3><div style="background:#242426;border-radius:20px;padding:16px"><div style="color:#9c9ca2;font-size:11px">Накоплено</div><div style="font-size:29px;font-weight:950;margin-top:4px">${rub(state.cashback)}</div><div style="margin-top:13px;display:flex;gap:8px"><span style="width:44px;height:44px;border-radius:14px;background:#315fe6;display:grid;place-items:center">↗</span><span style="width:44px;height:44px;border-radius:14px;background:#ffd83b;color:#111;display:grid;place-items:center">▣</span><span style="width:44px;height:44px;border-radius:14px;background:#ef3f36;display:grid;place-items:center">М</span></div></div>`);
$('#supportChat').onclick=supportSheet;
$('#closePromo').onclick=()=>{state.promoHidden=true;render()};
$('#resetData').onclick=()=>{state=structuredClone(initialState);render();toast('Данные сброшены')};
render();
