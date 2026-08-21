const fmt2 = new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});
const fmt0 = new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
const STORAGE='tbFinanceSimStateV2';
const initialState={
  balance:742033.37,
  cashback:1280,
  unread:true,
  tx:[
    {title:'Перевод от Александра',sub:'Сегодня, 12:41',amount:12500,icon:'↙',category:'Переводы'},
    {title:'Кофейня',sub:'Сегодня, 10:18',amount:-420,icon:'☕',category:'Кафе'},
    {title:'Такси',sub:'Вчера, 22:54',amount:-890,icon:'🚕',category:'Транспорт'},
    {title:'Маркет',sub:'Вчера, 18:32',amount:-3650,icon:'🛍',category:'Покупки'},
    {title:'Музыка',sub:'18 августа, 09:10',amount:-299,icon:'♫',category:'Подписки'},
    {title:'Ресторан',sub:'17 августа, 21:32',amount:-2480,icon:'🍽',category:'Кафе'}
  ]
};
let state=JSON.parse(localStorage.getItem(STORAGE)||'null')||structuredClone(initialState);
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function rub(n){return fmt0.format(Math.abs(n))+' ₽'}
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__tt);window.__tt=setTimeout(()=>t.classList.remove('show'),1700)}
function openSheet(html){$('#sheetContent').innerHTML=html;$('#sheet').classList.add('open');$('#sheetBackdrop').classList.add('open');$('#sheet').setAttribute('aria-hidden','false')}
function closeSheet(){$('#sheet').classList.remove('open');$('#sheetBackdrop').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true')}
$('#sheetBackdrop').onclick=closeSheet;

function txHtml(t){return `<div class="tx"><div class="tx-icon">${t.icon||'•'}</div><div class="tx-main"><div class="tx-title">${escapeHtml(t.title)}</div><div class="tx-sub">${escapeHtml(t.sub||'Только что')}</div></div><div class="tx-amount ${t.amount>0?'plus':''}">${t.amount>0?'+':'−'}${fmt0.format(Math.abs(t.amount))} ₽</div></div>`}
function categories(){
  const map={};
  state.tx.filter(t=>t.amount<0).forEach(t=>map[t.category||'Другое']=(map[t.category||'Другое']||0)+Math.abs(t.amount));
  return Object.entries(map).sort((a,b)=>b[1]-a[1]);
}
function renderCategories(){
  const cats=categories(), total=cats.reduce((s,x)=>s+x[1],0)||1;
  const icon={Кафе:'☕',Транспорт:'🚕',Покупки:'🛍',Подписки:'♫',Переводы:'↗',Другое:'•'};
  $('#categoryList').innerHTML=cats.map(([name,val])=>`<div class="cat-row"><div class="cat-icon">${icon[name]||'•'}</div><div class="cat-main"><div class="cat-title"><span>${escapeHtml(name)}</span><span>${Math.round(val/total*100)}%</span></div><div class="cat-track"><div class="cat-fill" style="width:${Math.max(5,val/total*100)}%"></div></div></div><div class="cat-amount">${rub(val)}</div></div>`).join('')||'<div class="note">Пока нет расходов.</div>';
  const bars=(cats.length?cats:[['—',1]]).slice(0,7);
  const max=Math.max(...bars.map(x=>x[1]));
  $('#miniBars').innerHTML=bars.map(([,v],i)=>`<div class="bar" style="height:${22+Math.round(v/max*42)}px" title="${i+1}"></div>`).join('');
}
function render(){
  $('#balanceText').textContent=fmt2.format(state.balance)+' ₽';
  $('#availableText').textContent=fmt0.format(state.balance)+' ₽';
  $('#cardBalance').textContent=fmt0.format(state.balance)+' ₽';
  $('#cashbackValue').textContent=fmt0.format(state.cashback)+' ₽';
  $('#notifyDot').style.display=state.unread?'block':'none';
  $('#txList').innerHTML=state.tx.slice(0,6).map(txHtml).join('');
  $('#historyList').innerHTML=state.tx.map(txHtml).join('');
  const inc=state.tx.filter(t=>t.amount>0).reduce((s,t)=>s+t.amount,0);
  const exp=state.tx.filter(t=>t.amount<0).reduce((s,t)=>s+Math.abs(t.amount),0);
  $('#incomeText').textContent='+'+rub(inc);
  $('#expenseText').textContent='−'+rub(exp);
  $('#monthSpend').textContent=rub(exp);
  renderCategories();
  save();
}
function amountSheet(kind){
  const top=kind==='topup';
  openSheet(`<h3>${top?'Пополнение':'Перевод'}</h3>${!top?'<div class="field"><label>Получатель</label><input id="nameInput" value="Алексей" /></div>':''}<div class="field"><label>Сумма</label><input id="amountInput" inputmode="decimal" placeholder="1000" /></div><button class="primary full" id="confirmAction">${top?'Пополнить':'Перевести'}</button><div class="note">Действие меняет только данные симулятора на этом устройстве. Реальная банковская операция не выполняется.</div>`);
  $('#confirmAction').onclick=()=>{
    const amount=parseFloat($('#amountInput').value.replace(',','.'));
    if(!amount||amount<=0){toast('Введите сумму');return}
    if(!top&&amount>state.balance){toast('Недостаточно средств');return}
    if(top){state.balance+=amount;state.tx.unshift({title:'Пополнение счёта',sub:'Только что',amount,icon:'＋',category:'Переводы'});toast('Баланс обновлён')}
    else{const name=$('#nameInput').value.trim()||'Получатель';state.balance-=amount;state.tx.unshift({title:'Перевод: '+name,sub:'Только что',amount:-amount,icon:'↗',category:'Переводы'});toast('Внутренняя операция добавлена')}
    render();closeSheet();
  }
}
function settingsSheet(){
  openSheet(`<h3>Настройки</h3><div class="field"><label>Баланс</label><input id="balanceInput" inputmode="decimal" value="${state.balance.toFixed(2)}" /></div><div class="field"><label>Кэшбэк</label><input id="cashbackInput" inputmode="decimal" value="${state.cashback}" /></div><button class="primary full" id="saveSettings">Сохранить</button><div class="note">Эти значения существуют только внутри симулятора.</div>`);
  $('#saveSettings').onclick=()=>{const b=parseFloat($('#balanceInput').value.replace(',','.'));const c=parseFloat($('#cashbackInput').value.replace(',','.'));if(Number.isNaN(b)||Number.isNaN(c)){toast('Проверьте значения');return}state.balance=b;state.cashback=c;render();closeSheet();toast('Сохранено')};
}
function notificationSheet(){
  state.unread=false;render();
  openSheet(`<h3>Уведомления</h3><div class="notify-item"><b>Кэшбэк рассчитан</b><span>За август уже накоплено ${fmt0.format(state.cashback)} ₽.</span></div><div class="notify-item"><b>Новая операция</b><span>История на этом устройстве обновлена.</span></div><div class="notify-item"><b>ТБ Финанс</b><span>Интерфейс работает автономно и не подключён к реальным счетам.</span></div>`);
}
function switchScreen(name){
  $$('.screen').forEach(x=>x.classList.remove('active'));$('#screen'+name).classList.add('active');
  $$('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.screen===name));
  window.scrollTo({top:0,behavior:'smooth'});
}

$('#topupBtn').onclick=()=>amountSheet('topup');$('#transferBtn').onclick=()=>amountSheet('transfer');
$('#payTopup').onclick=()=>amountSheet('topup');$('#payTransfer').onclick=()=>amountSheet('transfer');
$('#profileBtn').onclick=settingsSheet;$('#settingsBalance').onclick=settingsSheet;
$('#notifyBtn').onclick=notificationSheet;$('#settingsNotif').onclick=notificationSheet;
$('#analyticsBtn').onclick=()=>switchScreen('History');
$('#settingsReset').onclick=()=>{localStorage.removeItem(STORAGE);state=structuredClone(initialState);render();switchScreen('Home');toast('Данные сброшены')};
$('#addTxBtn').onclick=()=>{
  openSheet(`<h3>Добавить операцию</h3><div class="field"><label>Название</label><input id="txName" value="Покупка" /></div><div class="field"><label>Категория</label><input id="txCategory" value="Покупки" /></div><div class="field"><label>Сумма (минус = расход)</label><input id="txAmount" inputmode="decimal" placeholder="-1200" /></div><button class="primary full" id="addTxConfirm">Добавить</button>`);
  $('#addTxConfirm').onclick=()=>{const title=$('#txName').value.trim()||'Операция';const category=$('#txCategory').value.trim()||'Другое';const amount=parseFloat($('#txAmount').value.replace(',','.'));if(Number.isNaN(amount)){toast('Введите сумму');return}state.balance+=amount;state.tx.unshift({title,sub:'Только что',amount,icon:amount>=0?'↙':'•',category});render();closeSheet();toast('Операция добавлена')};
};
$$('.quick').forEach(b=>b.onclick=()=>{if(b.dataset.action==='cashback')openSheet(`<h3>Кэшбэк</h3><div class="cashback-card"><div><div class="eyebrow">Накоплено</div><div class="cashback-value">${fmt0.format(state.cashback)} ₽</div><div class="cashback-sub">Демо-значение</div></div><div class="cashback-badge">%</div></div><div class="note">Кэшбэк рассчитывается только для интерфейса симулятора.</div>`);else toast('Демо-раздел')});
$$('[data-demo]').forEach(b=>b.onclick=()=>toast('Демо-раздел'));
$$('.nav-item').forEach(b=>b.onclick=()=>switchScreen(b.dataset.screen));
render();
