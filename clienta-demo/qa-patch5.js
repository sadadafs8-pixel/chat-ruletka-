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

/* Header hierarchy: primary Create action first, smaller Earn action on the far right. */
(function applyHeaderActionHierarchy(){
  const create=document.getElementById('newBtn');
  const earn=document.getElementById('partnerBtn');
  const nav=create?.closest('.nav');
  if(nav&&create&&earn)nav.insertBefore(create,earn);
  if(!document.getElementById('clienta-header-action-style')){
    const style=document.createElement('style');
    style.id='clienta-header-action-style';
    style.textContent=`
      .nav #newBtn{min-height:48px;padding:0 19px;font-size:16px;white-space:nowrap}
      .nav #partnerBtn{min-height:40px;padding:0 13px;font-size:14px;white-space:nowrap}
      @media(max-width:430px){
        .nav{gap:6px}
        .nav #newBtn{min-height:46px;padding:0 15px;font-size:14px}
        .nav #partnerBtn{min-height:38px;padding:0 10px;font-size:12px}
      }
      @media(max-width:370px){
        .nav #newBtn{padding:0 12px;font-size:13px}
        .nav #partnerBtn{padding:0 9px;font-size:11px}
      }
    `;
    document.head.appendChild(style);
  }
})();

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
  const nav=document.querySelector('.nav');
  const create=document.getElementById('newBtn');
  const earn=document.getElementById('partnerBtn');
  if(nav&&create&&earn){
    const children=[...nav.children];
    if(children.indexOf(create)>children.indexOf(earn))errors.push('header-action-order');
    const createMin=parseFloat(getComputedStyle(create).minHeight)||0;
    const earnMin=parseFloat(getComputedStyle(earn).minHeight)||0;
    if(!(createMin>earnMin))errors.push('header-action-size-hierarchy');
  }
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25k',serviceBookingGuard:true,headerActionHierarchy:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa5=qa();
if(!qa5.ok)console.warn('CLIENTA QA5 failed',qa5.errors);

/* Load partner cabinet layer last so it can safely replace the old demo cabinet. */
if(!document.querySelector('script[data-clienta-partner-v2]')){
  const s=document.createElement('script');
  s.src='./qa-patch6.js';
  s.async=false;
  s.dataset.clientaPartnerV2='1';
  document.head.appendChild(s);
}
