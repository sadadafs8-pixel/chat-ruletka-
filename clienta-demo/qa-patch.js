/* CLIENTA QA hardening layer. Keep this file dependency-free and safe to load after app.js. */
const _normalizeProject=normalizeProject;
normalizeProject=function(p={}){
  const q=_normalizeProject(p);
  const bookingDeps=['Повторная запись','Лист ожидания','Предоплата'];
  if(bookingDeps.some(x=>q.mods.includes(x))&&!q.mods.includes('Онлайн-запись'))q.mods.unshift('Онлайн-запись');
  if(Object.prototype.hasOwnProperty.call(p,'contact')&&!String(p.contact||'').trim())q.contact='';
  if(Object.prototype.hasOwnProperty.call(p,'channels')&&Array.isArray(p.channels)&&p.channels.length===0)q.channels=[];
  q.pack=planOf(q);
  return q;
};
window.normalizeProject=normalizeProject;

const _snapshot=snapshot;
snapshot=function(){
  const q=_snapshot();
  const channelInputs=[...document.querySelectorAll('[data-channel]')];
  if(channelInputs.length){
    q.channels=channelInputs.filter(x=>x.checked).map(x=>x.value);
  }
  return normalizeProject(q);
};

const _startBuilder=startBuilder;
startBuilder=function(p=null){
  _startBuilder(p);
  if(!p){
    st.contact='';
    $('contact').value='';
    syncPreview();
  }
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
  p=normalizeProject(p);
  const s=p.services?.[i];
  if(!s)return;
  if(p.mods.includes('Онлайн-запись'))return _openService(p,i);
  openSheet(p,s[0],`${esc(s[1])} · ${esc(s[2])}`,'<button class="publicBtn" data-contact="1" style="margin-top:12px;background:var(--pac);color:var(--pact)">Связаться</button>');
  $('sheetPanel').querySelector('[data-contact]')?.addEventListener('click',()=>openFeature(p,'contact'));
};

/* Make booking dependencies explicit instead of silently producing contradictory projects. */
document.addEventListener('change',e=>{
  const input=e.target.closest?.('[data-mi]');
  if(!input)return;
  const mod=MODULES[Number(input.dataset.mi)]?.[0];
  if(!mod)return;
  const deps=['Повторная запись','Лист ожидания','Предоплата'];
  let changed=false;
  if(mod==='Онлайн-запись'&&!input.checked){
    const before=st.mods.length;
    st.mods=st.mods.filter(x=>!deps.includes(x)&&x!=='Онлайн-запись');
    changed=before!==st.mods.length;
    if(changed)toast('Зависимые функции записи тоже отключены');
  }else if(deps.includes(mod)&&input.checked&&!st.mods.includes('Онлайн-запись')){
    st.mods.unshift('Онлайн-запись');
    changed=true;
    toast('Онлайн-запись включена автоматически');
  }
  if(changed){
    st.pack='custom';
    renderPacks();
    renderMods();
    syncPreview();
  }
});

const _renderLaunch=renderLaunch;
renderLaunch=function(){
  if(!current)return;
  current=normalizeProject(current);
  const contact=String(current.contact||'').trim();
  const contactReady=/(@[\w.]{3,}|\+?\d[\d\s()\-]{6,}|https?:\/\/|t\.me\/|wa\.me\/|\S+@\S+\.\S+)/i.test(contact);
  const servicesReady=Array.isArray(current.services)&&current.services.some(s=>String(s?.[0]||'').trim()&&String(s?.[2]||'').trim());
  const scheduleReady=String(current.schedule||'').trim().length>=4;
  const checks=[
    ['Услуги',servicesReady,4,servicesReady?`${current.services.length} услуг`:'Добавьте хотя бы одну услугу и цену'],
    ['График',scheduleReady,4,scheduleReady?current.schedule:'Укажите рабочее время'],
    ['Контакт',contactReady,4,contactReady?'Реальный контакт указан':'Добавьте @username, телефон, ссылку или email'],
    ['Функции',clientCount(current)>0,3,`${clientCount(current)} клиентских модулей`],
    ['Каналы',current.channels.length>0,5,current.channels.length?`Выбрано: ${current.channels.join(', ')} · интеграции подключаются отдельно`:'Выберите хотя бы один канал']
  ];
  $('launchGrid').innerHTML=checks.map(x=>`<div class="launchCard ${x[1]?'done':''}"><b>${x[0]}</b><small>${esc(x[3])}</small><button data-step="${x[2]}">${x[1]?'Изменить':'Заполнить'} →</button></div>`).join('');
  $('launchGrid').querySelectorAll('[data-step]').forEach(b=>b.addEventListener('click',()=>{closeSuccess();startBuilder(current);go(Number(b.dataset.step))}));
};

/* The base app boots before this patch. Re-render public links once so they use the hardened renderer too. */
(function rerenderPublicAfterPatch(){
  const raw=new URLSearchParams(location.search).get('client');
  if(!raw)return;
  const p=dec(raw);
  if(p)renderPublic(p);
})();

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
  const emptyChannels=normalizeProject({...noBooking,channels:[]});
  if(emptyChannels.channels.length!==0)errors.push('empty-channels-fallback');
  const max=normalizeProject({...noBooking,pack:'max',mods:[...PACKS.max]});
  const maxHtml=clientMarkup(max,false);
  for(const token of ['340','4 / 8','4.9','Повторить','Лист ожидания','Сертификат','AI-ассистент','с предоплатой']){
    if(!maxHtml.includes(token))errors.push('max-token:'+token);
  }
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25b'};
  return window.CLIENTA_QA;
};
window.qa=qa;
const patched=qa();
if(!patched.ok)console.warn('CLIENTA patched QA failed',patched.errors);