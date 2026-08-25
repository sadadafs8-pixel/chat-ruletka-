/* CLIENTA QA pass 8: stable iPhone keyboard viewport and focused-field positioning. */
(function stabilizeBuilderKeyboard(){
  const builder=document.getElementById('builder');
  const scroller=document.getElementById('body');
  if(!builder||!scroller)return;

  if(!document.getElementById('clienta-keyboard-stable-style')){
    const style=document.createElement('style');
    style.id='clienta-keyboard-stable-style';
    style.textContent=`
      body.keyboard .head{display:block!important}
      body.keyboard .body{padding-bottom:96px!important}
      body.keyboard .footer{display:none!important}
      body.clientaKeyboardOpen #builder.full.on{
        top:var(--clienta-vv-top,0px)!important;
        bottom:auto!important;
        height:var(--clienta-vv-height,100dvh)!important;
      }
      body.clientaKeyboardOpen #builder .editor{height:100%!important}
      body.clientaKeyboardOpen #builder .body{scroll-behavior:auto!important;overscroll-behavior:contain}
      body.clientaKeyboardOpen #builder .top{padding-top:10px!important}
      @media(max-width:430px){
        body.clientaKeyboardOpen #builder .head{margin-top:14px;margin-bottom:14px}
        body.clientaKeyboardOpen #builder .head h2{font-size:38px;line-height:.94;margin:6px 0 8px}
        body.clientaKeyboardOpen #builder .head p{font-size:13px;margin:0}
        body.clientaKeyboardOpen #builder .smartBrief{margin-top:8px}
        body.clientaKeyboardOpen #builder input,
        body.clientaKeyboardOpen #builder textarea{font-size:16px!important}
      }
    `;
    document.head.appendChild(style);
  }

  const vv=window.visualViewport;
  let active=null;
  let settleTimer=0;

  function syncViewport(){
    if(!vv||!document.body.classList.contains('clientaKeyboardOpen'))return;
    document.documentElement.style.setProperty('--clienta-vv-height',`${Math.round(vv.height)}px`);
    document.documentElement.style.setProperty('--clienta-vv-top',`${Math.round(vv.offsetTop)}px`);
  }

  function keepFieldVisible(){
    if(!active||!builder.classList.contains('on'))return;
    const field=active.getBoundingClientRect();
    const box=scroller.getBoundingClientRect();
    const top=box.top+14;
    const bottom=box.bottom-18;
    if(field.bottom>bottom){
      scroller.scrollTop+=field.bottom-bottom+18;
    }else if(field.top<top){
      scroller.scrollTop-=top-field.top+12;
    }
  }

  function settle(){
    clearTimeout(settleTimer);
    settleTimer=setTimeout(()=>{syncViewport();keepFieldVisible()},120);
    setTimeout(()=>{syncViewport();keepFieldVisible()},280);
  }

  builder.addEventListener('focusin',e=>{
    if(!e.target.matches('input,textarea,select'))return;
    active=e.target;
    document.body.classList.add('clientaKeyboardOpen');
    syncViewport();
    settle();
  });

  builder.addEventListener('focusout',()=>{
    setTimeout(()=>{
      if(builder.contains(document.activeElement)&&document.activeElement.matches('input,textarea,select')){
        active=document.activeElement;
        settle();
        return;
      }
      active=null;
      document.body.classList.remove('clientaKeyboardOpen');
      document.documentElement.style.removeProperty('--clienta-vv-height');
      document.documentElement.style.removeProperty('--clienta-vv-top');
    },180);
  });

  if(vv){
    vv.addEventListener('resize',()=>{syncViewport();settle()});
    vv.addEventListener('scroll',()=>{syncViewport();settle()});
  }
})();

const _qaQa8=qa;
qa=function(){
  const r=_qaQa8(),errors=[...r.errors];
  const style=document.getElementById('clienta-keyboard-stable-style');
  if(!style)errors.push('iphone-keyboard-style');
  if(style&&/body\.keyboard \.head\{display:none/i.test(style.textContent))errors.push('iphone-keyboard-head-hidden');
  if(!style?.textContent.includes('--clienta-vv-height'))errors.push('iphone-visual-viewport-height');
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25n',iphoneKeyboardStable:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa8=qa();
if(!qa8.ok)console.warn('CLIENTA QA8 failed',qa8.errors);
