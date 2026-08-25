/* CLIENTA QA pass 7: mobile header/hero spacing and hard action order. */
(function hardenMobileHeader(){
  const nav=document.querySelector('.nav');
  const create=document.getElementById('newBtn');
  const earn=document.getElementById('partnerBtn');
  if(nav&&create&&earn&&create.nextElementSibling!==earn){nav.insertBefore(create,earn)}
  if(!document.getElementById('clienta-mobile-header-fix')){
    const style=document.createElement('style');
    style.id='clienta-mobile-header-fix';
    style.textContent=`
      @media(max-width:430px){
        .shell{padding-left:12px;padding-right:12px}
        .nav{height:auto;min-height:76px;padding:10px 0;gap:6px;align-items:center}
        .nav .logo{font-size:20px;flex:0 0 auto}
        .nav #newBtn{order:1;min-height:44px;padding:0 14px;font-size:14px}
        .nav #partnerBtn{order:2;min-height:36px;padding:0 10px;font-size:12px}
        .hero{padding-top:30px}
        .hero .eyebrow{display:block;margin-bottom:10px}
        .hero h1{font-size:clamp(56px,16vw,74px);line-height:.9;margin-top:0;overflow:visible}
      }
      @media(max-width:370px){
        .nav .logo{font-size:18px}
        .nav #newBtn{padding:0 11px;font-size:13px}
        .nav #partnerBtn{padding:0 8px;font-size:11px}
        .hero{padding-top:26px}
      }
    `;
    document.head.appendChild(style);
  }
})();

const _qaQa7=qa;
qa=function(){
  const r=_qaQa7(),errors=[...r.errors];
  const nav=document.querySelector('.nav'),create=document.getElementById('newBtn'),earn=document.getElementById('partnerBtn');
  if(nav&&create&&earn){const c=[...nav.children];if(c.indexOf(create)>c.indexOf(earn))errors.push('mobile-header-order')}
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25m',mobileHeaderFix:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa7=qa();
if(!qa7.ok)console.warn('CLIENTA QA7 failed',qa7.errors);
