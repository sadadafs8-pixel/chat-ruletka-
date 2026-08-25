/* CLIENTA QA pass 4: iPhone preview scroll lock + accessible accent contrast. */
(function hardenThemeContrast(){
  const fixes={Sand:{ac:'#8b6237'},Ice:{ac:'#1f7188'}};
  THEMES.forEach(t=>{const f=fixes[t.n];if(f)Object.assign(t,f)});
})();

let _mobilePreviewPreviousOverflow='';
const _openMobilePreviewQa4=openMobilePreview;
openMobilePreview=function(){
  _mobilePreviewPreviousOverflow=document.body.style.overflow;
  _openMobilePreviewQa4();
  document.body.style.overflow='hidden';
};
const _closeMobilePreviewQa4=closeMobilePreview;
closeMobilePreview=function(){
  _closeMobilePreviewQa4();
  document.body.style.overflow=_mobilePreviewPreviousOverflow;
};
window.openMobilePreview=openMobilePreview;
window.closeMobilePreview=closeMobilePreview;

function clientaHexLum(hex){
  const h=String(hex).replace('#','');
  const full=h.length===3?h.split('').map(x=>x+x).join(''):h;
  const rgb=[0,2,4].map(i=>parseInt(full.slice(i,i+2),16)/255).map(c=>c<=.04045?c/12.92:Math.pow((c+.055)/1.055,2.4));
  return .2126*rgb[0]+.7152*rgb[1]+.0722*rgb[2];
}
function clientaContrast(a,b){
  const x=clientaHexLum(a),y=clientaHexLum(b),hi=Math.max(x,y),lo=Math.min(x,y);
  return (hi+.05)/(lo+.05);
}
window.clientaContrast=clientaContrast;

const _qaQa4=qa;
qa=function(){
  const r=_qaQa4(),errors=[...r.errors];
  for(const t of THEMES){
    const ratio=clientaContrast(t.ac,t.act);
    if(ratio<4.5)errors.push(`theme-contrast:${t.n}:${ratio.toFixed(2)}`);
  }
  const old=document.body.style.overflow;
  openMobilePreview();
  if(document.body.style.overflow!=='hidden')errors.push('mobile-preview-scroll-lock');
  closeMobilePreview();
  if(document.body.style.overflow!==old)errors.push('mobile-preview-scroll-restore');
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25i',themeContrast:true,mobilePreviewScrollLock:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa4=qa();
if(!qa4.ok)console.warn('CLIENTA QA4 failed',qa4.errors);
