/* QA hotfix layer: keeps the modular core small while hardening behavior. */
const _normalizeProject=normalizeProject;
normalizeProject=function(p={}){
  const q=_normalizeProject(p);
  const bookingDeps=['Повторная запись','Лист ожидания','Предоплата'];
  if(bookingDeps.some(x=>q.mods.includes(x))&&!q.mods.includes('Онлайн-запись'))q.mods.unshift('Онлайн-запись');
  if(Object.prototype.hasOwnProperty.call(p,'contact')&&!String(p.contact||'').trim())q.contact='';
  return q;
};
window.normalizeProject=normalizeProject;

const _startBuilder=startBuilder;
startBuilder=function(p=null){
  _startBuilder(p);
  if(!p){st.contact='';$('contact').value='';syncPreview()}
};

const _clientMarkup=clientMarkup;
clientMarkup=function(input,interactive=true){
  const p=normalizeProject(input);
  let html=_clientMarkup(p,interactive);
  if(!p.mods.includes('Онлайн-запись')){
    html=html.replace(/<button class="publicBtn" data-act="booking">[\s\S]*?<\/button>/,'<button class="publicBtn" data-act="feature" data-type="contact">Связаться</button>');
    html=html.replace(/<button class="" data-act="booking">Запись<\/button>/,'<button class="" data-act="feature" data-type="contact">Контакт</button>');
  }
  return html;
};
window.clientMarkup=clientMarkup;

const _openService=openService;
openService=function(p,i){
  p=normalizeProject(p);const s=p.services?.[i];if(!s)return;
  if(p.mods.includes('Онлайн-запись'))return _openService(p,i);
  openSheet(p,s[0],`${esc(s[1])} · ${esc(s[2])}`,'<button class="publicBtn" data-contact="1" style="margin-top:12px;background:var(--pac);color:var(--pact)">Связаться</button>');
  $('sheetPanel').querySelector('[data-contact]')?.addEventListener('click',()=>openFeature(p,'contact'));
};

const _renderLaunch=renderLaunch;
renderLaunch=function(){
  if(!current)return;
  current=normalizeProject(current);
  const contact=String(current.contact||'').trim();
  const contactReady=/(@[\w.]{3,}|\+?\d[\d\s()\-]{6,}|https?:\/\/|t\.me\/|wa\.me\/|\S+@\S+\.\S+)/i.test(contact);
  const checks=[
    ['Услуги',current.services.length>0,4,current.services.length>0?'Добавлены':'Нужно заполнить'],
    ['График',!!current.schedule,4,current.schedule?'Указан':'Нужно заполнить'],
    ['Контакт',contactReady,4,contactReady?'Реальный контакт указан':'Добавьте @username, телефон или ссылку'],
    ['Функции',clientCount(current)>0,3,`${clientCount(current)} клиентских модулей`],
    ['Каналы',current.channels.length>0,5,current.channels.length?`Выбрано: ${current.channels.join(', ')} · интеграции подключаются отдельно`:'Выберите канал']
  ];
  $('launchGrid').innerHTML=checks.map(x=>`<div class="launchCard ${x[1]?'done':''}"><b>${x[0]}</b><small>${x[3]}</small><button data-step="${x[2]}">${x[1]?'Изменить':'Заполнить'} →</button></div>`).join('');
  $('launchGrid').querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{closeSuccess();startBuilder(current);go(Number(b.dataset.step))}));
};

const _qa=qa;
qa=function(){
  const r=_qa(),errors=[...r.errors];
  const noBooking=normalizeProject({name:'QA no booking',biz:'QA',bizCat:'Другое',pack:'custom',mods:['Лояльность'],services:[['A','1','1']],schedule:'x',contact:'@qa',channels:['Web']});
  const noBookingHtml=clientMarkup(noBooking,false);
  if(/data-act="booking"/.test(noBookingHtml))errors.push('booking-leak');
  const dep=normalizeProject({...noBooking,mods:['Предоплата']});
  if(!dep.mods.includes('Онлайн-запись'))errors.push('booking-dependency');
  const emptyContact=normalizeProject({...noBooking,contact:''});
  if(emptyContact.contact!=='')errors.push('empty-contact-fallback');
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25'};
  return window.CLIENTA_QA;
};
window.qa=qa;
const patched=qa();
if(!patched.ok)console.warn('CLIENTA patched QA failed',patched.errors);