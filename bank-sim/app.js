const fmt0=new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0});
const fmt2=new Intl.NumberFormat('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2});
const STORAGE='fintechUiV3State';
const initialState={
  name:'Александр',
  balance:13.84,
  cashback:842,
  spend:130607,
  tx:[
    {title:'Супермаркет',amount:-2140,sub:'Сегодня, 14:26'},
    {title:'Перевод',amount:-1500,sub:'Сегодня, 11:03'},
    {title:'Пополнение',amount:5000,sub:'Вчера, 19:42'},
    {title:'Кофейня',amount:-430,sub:'Вчера, 10:18'},
    {title:'Такси',amount:-790,sub:'19 августа, 23:11'}
  ]
};
let state=JSON.parse(localStorage.getItem(STORAGE)||'null')||structuredClone(initialState);
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
const rub=n=>fmt0.format(Math.abs(n))+' ₽';
const safe=s=>String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
function toast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(window.__toast);window.__toast=setTimeout(()=>t.classList.remove('show'),1700)}
function openSheet(html){$('#sheetContent').innerHTML=html;$('#sheet').classList.add('open');$('#sheetBackdrop').classList.add('open');$('#sheet').setAttribute('aria-hidden','false')}
function closeSheet(){$('#sheet').classList.remove('open');$('#sheetBackdrop').classList.remove('open');$('#sheet').setAttribute('aria-hidden','true')}
$('#sheetBackdrop').onclick=closeSheet;

let pin='';
function renderPin(){$$('#pinDots i').forEach((d,i)=>d.classList.toggle('on',i<pin.length))}
function unlock(){document.body.style.overflow='auto';$('#lockScreen').classList.add('hidden');setTimeout(()=>$('#lockScreen').style.display='none',350)}
$$('#keypad [data-key]').forEach(b=>b.onclick=()=>{if(pin.length>=4)return;pin+=b.dataset.key;renderPin();if(pin.length===4)setTimeout(unlock,170)});
$('#erasePin').onclick=()=>{pin=pin.slice(0,-1);renderPin()};
$('#skipPin').onclick=unlock;
document.body.style.overflow='hidden';

function render(){
  $('.profile-name').innerHTML=`${safe(state.name)} <span>›</span>`;
  $('.avatar').textContent=(state.name.trim()[0]||'А').toUpperCase();
  $('#balanceText').textContent=fmt2.format(state.balance)+' ₽';
  $('#spendTile').textContent=rub(state.spend);
  save();
}
function switchScreen(name){$$('.screen').forEach(s=>s.classList.remove('active'));$('#screen'+name).classList.add('active');$$('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===name));window.scrollTo({top:0,behavior:'smooth'})}
$$('.nav-item').forEach(b=>b.onclick=()=>switchScreen(b.dataset.screen));

function amountSheet(kind){
  const top=kind==='topup';
  openSheet(`<h3>${top?'Пополнить счёт':'Перевести'}</h3>${top?'':'<div class="field"><label>Получатель</label><input id="recipient" value="Алексей" /></div>'}<div class="field"><label>Сумма</label><input id="amount" inputmode="decimal" placeholder="1000" /></div><button class="primary" id="confirmAmount">${top?'Пополнить':'Продолжить'}</button><div class="note">Это локальная симуляция интерфейса. Реальная банковская операция не выполняется.</div>`);
  $('#confirmAmount').onclick=()=>{const a=parseFloat($('#amount').value.replace(',','.'));if(!a||a<=0){toast('Введите сумму');return}if(!top&&a>state.balance){toast('Недостаточно средств');return}if(top){state.balance+=a;state.tx.unshift({title:'Пополнение',amount:a,sub:'Только что'});toast('Баланс изменён')}else{state.balance-=a;state.tx.unshift({title:'Перевод',amount:-a,sub:'Только что'});state.spend+=a;toast('Операция добавлена')}render();closeSheet()}
}
$$('[data-action="topup"]').forEach(b=>b.onclick=()=>amountSheet('topup'));
$$('[data-action="transfer"]').forEach(b=>b.onclick=()=>amountSheet('transfer'));
$$('[data-action="between"]').forEach(b=>b.onclick=()=>toast('Раздел готовится'));
$$('[data-demo]').forEach(b=>b.onclick=e=>{e.stopPropagation();toast('Демо-раздел')});

$('#profileBtn').onclick=()=>{
  openSheet(`<h3>Профиль</h3><div class="field"><label>Имя</label><input id="nameField" value="${safe(state.name)}" /></div><div class="field"><label>Баланс</label><input id="balanceField" inputmode="decimal" value="${state.balance.toFixed(2)}" /></div><button class="primary" id="saveProfile">Сохранить</button><div class="note">Настройки хранятся только на этом устройстве.</div>`);
  $('#saveProfile').onclick=()=>{const n=$('#nameField').value.trim()||'Александр';const b=parseFloat($('#balanceField').value.replace(',','.'));if(Number.isNaN(b)){toast('Проверьте баланс');return}state.name=n;state.balance=b;render();closeSheet();toast('Сохранено')}
};
$('#editBalance').onclick=()=>$('#profileBtn').click();
$('#resetData').onclick=()=>{state=structuredClone(initialState);render();toast('Данные сброшены')};

function historyHtml(){return state.tx.map(t=>`<div style="display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid #303034"><div style="width:42px;height:42px;border-radius:14px;background:#2a2a2d;display:grid;place-items:center">${t.amount>0?'＋':'•'}</div><div style="flex:1"><b>${safe(t.title)}</b><div style="color:#8f8f94;font-size:12px;margin-top:3px">${safe(t.sub)}</div></div><strong style="white-space:nowrap;color:${t.amount>0?'#18bf50':'#fff'}">${t.amount>0?'+':'−'}${rub(t.amount)}</strong></div>`).join('')}
$('#historyTile').onclick=()=>openSheet(`<h3>Все операции</h3><div style="font-size:30px;font-weight:900;margin-bottom:12px">${rub(state.spend)}</div>${historyHtml()}<div class="note">Операции существуют только внутри симулятора.</div>`);
$('#cashbackTile').onclick=()=>openSheet(`<h3>Кэшбэк и бонусы</h3><div style="background:#242426;border-radius:22px;padding:18px"><div style="color:#9c9ca2;font-size:12px">Накоплено</div><div style="font-size:32px;font-weight:950;margin-top:5px">${rub(state.cashback)}</div><div style="margin-top:16px;display:flex;gap:9px"><span style="width:48px;height:48px;border-radius:15px;background:#315fe6;display:grid;place-items:center">↗</span><span style="width:48px;height:48px;border-radius:15px;background:#ffd83b;color:#111;display:grid;place-items:center">▣</span><span style="width:48px;height:48px;border-radius:15px;background:#ef3f36;display:grid;place-items:center">М</span></div></div><div class="note">Значение используется только в интерфейсе.</div>`);

render();
