/* CLIENTA QA pass 5: booking truthfulness for service cards and direct booking calls. */
const _openServiceQa5=openService;
openService=function(p,i){
  p=normalizeProject(p);
  const s=p.services?.[i];
  if(!s)return;
  if(p.mods.includes('Онлайн-запись'))return _openServiceQa5(p,i);
  const contact=String(p.contact||'').trim();
  const href=typeof clientaContactHref==='function'?clientaContactHref(contact):'';
  const action=href
    ?`<a class="publicBtn" href="${esc(href)}" ${/^https?:/i.test(href)?'target="_blank" rel="noopener"':''} style="margin-top:12px;background:var(--pac);color:var(--pact);display:grid;place-items:center;text-decoration:none">Связаться</a>`
    :'<div class="statusLine">Онлайн-запись выключена. Добавьте рабочий контакт, чтобы клиент мог связаться с бизнесом.</div>';
  openSheet(p,s[0],`${esc(s[1])} · ${esc(s[2])}`,action);
};
window.openService=openService;

const _openBookingQa5=openBooking;
openBooking=function(p){
  p=normalizeProject(p);
  if(!p.mods.includes('Онлайн-запись'))return openFeature(p,'contact');
  return _openBookingQa5(p);
};
window.openBooking=openBooking;

const _qaQa5=qa;
qa=function(){
  const r=_qaQa5(),errors=[...r.errors];
  const noBooking=normalizeProject({name:'Service truth QA',biz:'Кафе',bizCat:'Еда',pack:'custom',mods:['Лояльность'],services:[['Стол на двоих','вечер','0 ₽']],schedule:'12:00–23:00',contact:'@clienta_demo',channels:['Web']});
  let captured='';
  const originalOpenSheet=openSheet;
  openSheet=function(_p,_title,_body,action=''){captured=String(action||'')};
  try{
    openService(noBooking,0);
    if(/Записаться|booking/i.test(captured))errors.push('service-booking-leak');
    if(!/Связаться/.test(captured))errors.push('service-contact-fallback');
  }finally{
    openSheet=originalOpenSheet;
  }
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25j',serviceBookingGuard:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa5=qa();
if(!qa5.ok)console.warn('CLIENTA QA5 failed',qa5.errors);
