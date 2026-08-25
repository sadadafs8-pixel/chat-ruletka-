/* CLIENTA morning QA patch: module truthfulness, channel persistence and novice review. */
const _clientMarkupMorning=clientMarkup;
clientMarkup=function(input,interactive=true){
  const p=normalizeProject(input);
  let html=_clientMarkupMorning(p,interactive);
  if(!p.mods.includes('Онлайн-запись')){
    const contact=String(p.contact||'').trim();
    const kicker=contact?'Связаться с бизнесом':'Контакт ещё не указан';
    const title=contact?'Напишите нам':'Добавьте контакт';
    html=html.replace(/(<section class="publicHero"><small>)[\s\S]*?(<\/small><h1>)[\s\S]*?(<\/h1>)/,`$1${esc(kicker)}$2${esc(title)}$3`);
  }else if(p.mods.includes('Предоплата')){
    const cta=`${businessPreset(p.biz,p.bizCat).cta} · предоплата`;
    html=html.replace(/(<button class="publicBtn" data-act="booking">)[\s\S]*?(<\/button>)/,`$1${esc(cta)}$2`);
  }
  return html;
};
window.clientMarkup=clientMarkup;

/* Keep the channel step stateful when a user goes forward and then back. */
document.addEventListener('change',e=>{
  const input=e.target.closest?.('[data-channel]');
  if(!input)return;
  st.channels=[...document.querySelectorAll('[data-channel]:checked')].map(x=>x.value);
},true);

/* Show missing launch data before project creation without blocking experimentation. */
const _renderReviewMorning=renderReview;
renderReview=function(){
  _renderReviewMorning();
  const p=snapshot();
  const contact=String(p.contact||'').trim();
  const contactReady=/(@[\w.]{3,}|\+?\d[\d\s()\-]{6,}|https?:\/\/|t\.me\/|wa\.me\/|\S+@\S+\.\S+)/i.test(contact);
  const servicesReady=Array.isArray(p.services)&&p.services.some(s=>String(s?.[0]||'').trim()&&String(s?.[2]||'').trim());
  const missing=[];
  if(!servicesReady)missing.push('услуги и цены');
  if(String(p.schedule||'').trim().length<4)missing.push('график');
  if(!contactReady)missing.push('реальный контакт');
  if(!p.channels.length)missing.push('канал запуска');
  const card=document.createElement('article');
  card.className='reviewCard';
  card.style.gridColumn='1 / -1';
  card.innerHTML=missing.length
    ?`<h3>Перед запуском</h3><p style="color:#777;line-height:1.5;margin:0">Можно сохранить демо, но для реального запуска ещё нужно заполнить: <b>${esc(missing.join(', '))}</b>.</p>`
    :'<h3>Готовность к запуску ✓</h3><p style="color:#777;line-height:1.5;margin:0">Услуги, график, контакт и канал заполнены. На следующем экране их можно ещё раз проверить.</p>';
  $('review')?.prepend(card);
};
window.renderReview=renderReview;

const _qaMorning=qa;
qa=function(){
  const r=_qaMorning(),errors=[...r.errors];
  const noBooking=normalizeProject({name:'QA contact only',biz:'QA',bizCat:'Другое',pack:'custom',mods:['Лояльность'],services:[['A','1','1']],schedule:'10:00–20:00',contact:'@qa',channels:['Web']});
  const html=clientMarkup(noBooking,false);
  if(html.includes('Ближайшее свободное окно')||html.includes('Сегодня 16:30'))errors.push('no-booking-hero-copy');
  if(!html.includes('Связаться с бизнесом')||!html.includes('Напишите нам'))errors.push('no-booking-contact-hero');
  const restaurant=normalizeProject({name:'QA restaurant',biz:'Ресторан',bizCat:'Еда',pack:'max',mods:[...PACKS.max],services:BUSINESS_PRESETS['Ресторан'].services,schedule:'12:00–23:00',contact:'@rest',channels:['Web']});
  const restaurantHtml=clientMarkup(restaurant,false);
  if(!restaurantHtml.includes('Забронировать стол · предоплата'))errors.push('prepay-niche-cta');
  const channelInputs=[...document.querySelectorAll('[data-channel]')];
  if(channelInputs.length){
    const old=[...st.channels];
    channelInputs.forEach(x=>x.checked=false);
    channelInputs[0].checked=true;
    channelInputs[0].dispatchEvent(new Event('change',{bubbles:true}));
    if(st.channels.length!==1||st.channels[0]!==channelInputs[0].value)errors.push('channel-state-persistence');
    st.channels=old;
    channelInputs.forEach(x=>x.checked=old.includes(x.value));
    syncPreview();
  }
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25f'};
  return window.CLIENTA_QA;
};
window.qa=qa;
const morningQA=qa();
if(!morningQA.ok)console.warn('CLIENTA morning QA failed',morningQA.errors);
