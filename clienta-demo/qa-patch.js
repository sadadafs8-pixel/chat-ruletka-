/* CLIENTA QA hardening layer. Keep this file dependency-free and safe to load after app.js. */
const BUSINESS_PRESETS={
  'Автосервис':{cta:'Записаться в сервис',services:[['Диагностика','60 минут','2 500 ₽'],['Замена масла','45 минут','от 1 800 ₽'],['ТО','по записи','от 4 500 ₽']]},
  'Детейлинг':{cta:'Записаться на детейлинг',services:[['Комплексная мойка','90 минут','3 500 ₽'],['Полировка кузова','4 часа','от 15 000 ₽'],['Керамика','1 день','от 25 000 ₽']]},
  'Шиномонтаж':{cta:'Выбрать время',services:[['Сезонная замена колёс','45 минут','от 2 500 ₽'],['Балансировка','30 минут','от 1 500 ₽'],['Ремонт прокола','30 минут','от 800 ₽']]},
  'Барбершоп':{cta:'Выбрать мастера и время',services:[['Мужская стрижка','60 минут','2 500 ₽'],['Стрижка + борода','90 минут','3 800 ₽'],['Оформление бороды','45 минут','1 800 ₽']]},
  'Маникюр':{cta:'Выбрать мастера',services:[['Маникюр + покрытие','90 минут','2 800 ₽'],['Маникюр без покрытия','60 минут','1 600 ₽'],['Снятие + уход','45 минут','1 200 ₽']]},
  'Стоматология':{cta:'Записаться на приём',services:[['Первичная консультация','45 минут','1 500 ₽'],['Профессиональная гигиена','60 минут','5 500 ₽'],['Лечение кариеса','60 минут','от 6 000 ₽']]},
  'Фитнес-клуб':{cta:'Выбрать тренировку',services:[['Пробная тренировка','60 минут','0 ₽'],['Персональная тренировка','60 минут','2 500 ₽'],['Абонемент 8 занятий','30 дней','9 900 ₽']]},
  'Йога-студия':{cta:'Выбрать занятие',services:[['Пробное занятие','60 минут','500 ₽'],['Разовое занятие','60 минут','1 200 ₽'],['Абонемент 8 занятий','30 дней','7 500 ₽']]},
  'Ресторан':{cta:'Забронировать стол',services:[['Стол на двоих','вечер','0 ₽'],['Стол на компанию','вечер','0 ₽'],['Предзаказ меню','к визиту','по меню']]},
  'Клининг':{cta:'Рассчитать уборку',services:[['Поддерживающая уборка','2 часа','от 3 500 ₽'],['Генеральная уборка','4 часа','от 7 500 ₽'],['После ремонта','по площади','от 10 000 ₽']]},
  'Груминг':{cta:'Записать питомца',services:[['Комплекс для собаки','90 минут','от 3 500 ₽'],['Экспресс-линька','60 минут','от 2 500 ₽'],['Стрижка когтей','20 минут','700 ₽']]},
  'Фотограф':{cta:'Выбрать дату',services:[['Индивидуальная съёмка','60 минут','8 000 ₽'],['Контент-съёмка','90 минут','12 000 ₽'],['Свадебная съёмка','6 часов','от 45 000 ₽']]},
  'Репетитор':{cta:'Записаться на урок',services:[['Пробный урок','45 минут','1 000 ₽'],['Индивидуальный урок','60 минут','2 500 ₽'],['Пакет 8 уроков','8 занятий','18 000 ₽']]},
  'Психолог':{cta:'Выбрать время консультации',services:[['Первая консультация','60 минут','4 000 ₽'],['Консультация','60 минут','4 500 ₽'],['Парная консультация','90 минут','6 500 ₽']]},
  'Аренда апартаментов':{cta:'Проверить даты',services:[['Апартаменты','1 ночь','от 6 000 ₽'],['Поздний выезд','до 18:00','2 000 ₽'],['Трансфер','по запросу','от 2 500 ₽']]}
};
function businessPreset(biz,cat){return BUSINESS_PRESETS[biz]||{cta:preset(cat).cta,services:preset(cat).services}}

const _normalizeProject=normalizeProject;
normalizeProject=function(p={}){
  const q=_normalizeProject(p);
  const declaredPack=['start','growth','max'].includes(p.pack)?p.pack:null;
  if(declaredPack){
    q.mods=[...PACKS[declaredPack]];
    q.pack=declaredPack;
  }
  const bookingDeps=['Повторная запись','Лист ожидания','Предоплата'];
  if(bookingDeps.some(x=>q.mods.includes(x))&&!q.mods.includes('Онлайн-запись'))q.mods.unshift('Онлайн-запись');
  if(Object.prototype.hasOwnProperty.call(p,'contact')&&!String(p.contact||'').trim())q.contact='';
  if(Object.prototype.hasOwnProperty.call(p,'channels')&&Array.isArray(p.channels)&&p.channels.length===0)q.channels=[];
  if(!declaredPack){
    const mods=new Set(q.mods);
    q.pack=PACKS.max.every(x=>mods.has(x))?'max':PACKS.growth.every(x=>mods.has(x))?'growth':PACKS.start.every(x=>mods.has(x))?'start':'custom';
  }
  return q;
};
window.normalizeProject=normalizeProject;

const _snapshot=snapshot;
snapshot=function(){
  const q=_snapshot();
  const channelInputs=[...document.querySelectorAll('[data-channel]')];
  if(channelInputs.length)q.channels=channelInputs.filter(x=>x.checked).map(x=>x.value);
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

const _pickBiz=pickBiz;
pickBiz=function(cat,biz){
  _pickBiz(cat,biz);
  const bp=businessPreset(biz,cat);
  st.services=bp.services.map(x=>[...x]);
  if($('services'))$('services').value=st.services.map(x=>x.join(' | ')).join('\n');
  syncPreview();
};
window.pickBiz=pickBiz;

const _clientMarkup=clientMarkup;
clientMarkup=function(input,interactive=true){
  const p=normalizeProject(input);
  let html=_clientMarkup(p,interactive);
  if(!p.mods.includes('Онлайн-запись')){
    html=html.replace(/<button class="publicBtn" data-act="booking">[\s\S]*?<\/button>/,'<button class="publicBtn" data-act="feature" data-type="contact">Связаться</button>');
    html=html.replace(/<button class="" data-act="booking">Запись<\/button>/,'<button class="" data-act="feature" data-type="contact">Контакт</button>');
  }else if(!p.mods.includes('Предоплата')){
    const cta=businessPreset(p.biz,p.bizCat).cta;
    html=html.replace(/(<button class="publicBtn" data-act="booking">)[\s\S]*?(<\/button>)/,`$1${esc(cta)}$2`);
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

(function improveMobileAndTutorial(){
  const style=document.createElement('style');
  style.textContent=`
    .tutorialGrid{grid-template-columns:repeat(5,minmax(0,1fr))}
    @media(max-width:920px){.tutorialGrid{grid-template-columns:1fr 1fr}.mobilePreviewBtn{box-shadow:0 6px 24px #0003}}
    @media(max-width:520px){.tutorialGrid{grid-template-columns:1fr}.nav{gap:5px}.nav .btn{padding-left:11px;padding-right:11px;font-size:13px}.logo{font-size:20px}.publicNav{bottom:calc(8px + env(safe-area-inset-bottom))}.mobilePreviewBtn{bottom:calc(78px + env(safe-area-inset-bottom))}}
    @media(max-width:360px){#partnerBtn{font-size:0;width:46px;padding:0}#partnerBtn:after{content:'₽';font-size:18px}.nav .btn.light{padding-left:10px;padding-right:10px}}
  `;
  document.head.appendChild(style);
})();

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
  const staleMax=normalizeProject({...noBooking,pack:'max',mods:['Онлайн-запись']});
  if(!PACKS.max.every(x=>staleMax.mods.includes(x)))errors.push('stale-max-hydration');
  const maxHtml=clientMarkup(staleMax,false);
  for(const token of ['340','4 / 8','4.9','Повторить','Лист ожидания','Сертификат','AI-ассистент','с предоплатой']){
    if(!maxHtml.includes(token))errors.push('max-token:'+token);
  }
  const tyre=businessPreset('Шиномонтаж','Авто');
  if(!tyre.services.some(s=>s[0].includes('Сезонная')))errors.push('business-preset-tyres');
  const barber=normalizeProject({name:'B',biz:'Барбершоп',bizCat:'Красота',pack:'start',mods:[...PACKS.start],services:BUSINESS_PRESETS['Барбершоп'].services,contact:'@barber',channels:['Web']});
  const barberHtml=clientMarkup(barber,false);
  if(!barberHtml.includes('Выбрать мастера и время'))errors.push('business-cta-barber');
  if(!barberHtml.includes('Стрижка + борода'))errors.push('business-services-barber');
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25d'};
  return window.CLIENTA_QA;
};
window.qa=qa;
const patched=qa();
if(!patched.ok)console.warn('CLIENTA patched QA failed',patched.errors);