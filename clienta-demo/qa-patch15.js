/* CLIENTA QA pass 15: final mobile design audit fixes. */
(function clientaFinalDesignAudit(){
  const layoutReco={
    'Барбершоп':'editorial','Салон красоты':'editorial','Маникюр':'bento','Брови и ресницы':'editorial','Массаж':'minimal','Косметология':'minimal',
    'Стоматология':'minimal','Клиника':'minimal','Психолог':'minimal','Остеопат':'minimal','Детейлинг':'immersive','Автосервис':'catalog','Шиномонтаж':'catalog','Автомойка':'compact','Тюнинг-ателье':'immersive',
    'Ресторан':'magazine','Кафе':'editorial','Кондитерская':'bento','Доставка еды':'compact','Фитнес-клуб':'immersive','Йога-студия':'editorial','Персональный тренер':'immersive','Танцевальная студия':'bento',
    'Клининг':'catalog','Ремонт квартир':'split','Дизайн интерьера':'editorial','Мебель на заказ':'editorial','Онлайн-школа':'bento','Репетитор':'minimal','Языковая школа':'bento','Автошкола':'catalog',
    'Груминг':'bento','Ветклиника':'minimal','Передержка':'bento','Фотограф':'magazine','Видеограф':'immersive','Юрист':'editorial','Бухгалтер':'minimal','Маркетинговое агентство':'brutal','IT-студия':'bento','Риелтор':'editorial','Аренда апартаментов':'immersive'
  };
  const fontReco={
    Авто:['Space Grotesk','Manrope','IBM Plex','Unbounded'],Красота:['Playfair','Cormorant','Manrope','DM Sans'],Здоровье:['Manrope','DM Sans','IBM Plex','Onest'],Спорт:['Space Grotesk','Manrope','Unbounded','DM Sans'],
    Еда:['Playfair','Cormorant','DM Sans','Manrope'],Дом:['Manrope','DM Sans','IBM Plex','Playfair'],Обучение:['Manrope','DM Sans','Onest','IBM Plex'],Питомцы:['DM Sans','Manrope','Onest','Playfair'],
    Услуги:['Manrope','DM Sans','Space Grotesk','Playfair'],Недвижимость:['Playfair','Manrope','DM Sans','Cormorant'],Другое:['Manrope','DM Sans','Space Grotesk','Playfair']
  };

  // Onest was present in the picker but was not actually loaded on every device.
  if(!document.querySelector('link[data-clienta-onest]')){
    const l=document.createElement('link');l.rel='stylesheet';l.dataset.clientaOnest='1';l.href='https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&display=swap';document.head.appendChild(l);
  }

  const css=document.createElement('style');
  css.id='clientaAudit15Css';
  css.textContent=`
  .public .publicHero h1,.public h2,.public b{overflow-wrap:anywhere}.public .service{min-width:0}.public .service>div{min-width:0}.public .service>b{flex:none;text-align:right;max-width:42%;white-space:normal}
  .serviceCollection{display:block}.layout-bento .serviceCollection{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.layout-bento .serviceCollection .service{margin-top:0;min-height:104px;align-items:flex-start}.layout-bento .serviceCollection .service:first-child{grid-column:1/-1;min-height:118px}.layout-bento .serviceCollection .service:nth-child(4n){grid-column:1/-1}
  .layout-immersive .serviceCollection{display:flex;gap:10px;overflow:auto;scroll-snap-type:x mandatory;padding:2px 2px 10px;scrollbar-width:none}.layout-immersive .serviceCollection .service{flex:0 0 78%;min-height:118px;scroll-snap-align:start;border:1px solid var(--pline)!important;border-radius:22px!important;padding:17px!important;background:var(--pcard)!important}.layout-immersive .serviceCollection::-webkit-scrollbar{display:none}
  .layout-compact .serviceCollection{display:grid;grid-template-columns:1fr 1fr;gap:6px}.layout-compact .serviceCollection .service{margin-top:0!important;display:block!important;min-height:90px}.layout-compact .serviceCollection .service>b{display:block;max-width:none;text-align:left;margin-top:8px}
  .layout-brutal .serviceCollection{display:grid;grid-template-columns:1fr 1fr;gap:10px}.layout-brutal .serviceCollection .service{margin:0!important;display:block!important;min-height:112px}.layout-brutal .serviceCollection .service>b{display:block;max-width:none;text-align:left;margin-top:8px}
  .layout-catalog .serviceCollection{border-top:1px solid var(--pline)}.layout-catalog .serviceCollection .service{margin-top:0!important;border-width:0 0 1px!important;border-radius:0!important;background:transparent!important}.layout-catalog .serviceCollection .service>b{font-variant-numeric:tabular-nums}
  .layout-magazine .serviceCollection .service:nth-child(odd){padding-left:8%!important}.layout-editorial .serviceCollection .service:nth-child(even){padding-left:7%!important}
  .layoutChoice{overflow:hidden}.layoutRecoTag,.fontRecoTag{position:absolute;right:8px;top:8px;border-radius:999px;background:#111;color:#fff;font:800 7px/1 Arial,sans-serif;letter-spacing:.07em;padding:5px 6px}.fontChoice{position:relative;overflow:hidden}.fontChoice.fontRecommended{box-shadow:inset 0 0 0 2px #111}.fontChoice .fontRecoTag{font-family:Arial,sans-serif}.layoutChoice.layoutRecommended{box-shadow:inset 0 0 0 2px #111}
  .layoutChoice[data-layout="editorial"] .miniLayout{grid-template-columns:.35fr 1.65fr}.layoutChoice[data-layout="bento"] .miniLayout{grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr}.layoutChoice[data-layout="bento"] .miniLayout i:first-child{grid-row:1/-1}.layoutChoice[data-layout="immersive"] .miniLayout{display:block}.layoutChoice[data-layout="immersive"] .miniLayout i:first-child{height:100%;border-radius:8px}.layoutChoice[data-layout="immersive"] .miniLayout i:last-child{display:none}.layoutChoice[data-layout="catalog"] .miniLayout{display:grid;grid-template-columns:1fr;grid-template-rows:repeat(2,1fr)}.layoutChoice[data-layout="magazine"] .miniLayout{grid-template-columns:1.6fr .4fr}.layoutChoice[data-layout="glass"] .miniLayout i{opacity:.65;box-shadow:0 3px 8px #0003}.layoutChoice[data-layout="brutal"] .miniLayout i{border-radius:0;box-shadow:3px 3px 0 #777}.layoutChoice[data-layout="compact"] .miniLayout{grid-template-columns:repeat(2,1fr)}
  @media(max-width:520px){
    #s2 .head{margin-bottom:12px}#s2 .head h2{font-size:38px}.styleFilter{position:sticky;top:0;z-index:3;background:linear-gradient(#f4f1ea 75%,transparent);padding-top:8px}.theme{min-height:112px!important}.theme strong{font-size:13px}.layoutChoice{min-height:88px;padding:11px}.layoutChoice small{font-size:10px}.fontGrid{grid-template-columns:repeat(2,minmax(0,1fr))!important}.fontChoice{min-height:62px!important;padding:10px!important}
    .public{font-size:13px}.publicHero h1{font-size:clamp(29px,9.5vw,40px)!important;line-height:.95!important}.public h2{font-size:clamp(20px,7vw,30px)!important}.layout-magazine .publicHero h1,.layout-immersive .publicHero h1,.layout-editorial .publicHero h1{font-size:clamp(34px,10vw,42px)!important}.layout-immersive .publicHero{min-height:245px!important}.layout-bento .serviceCollection .service{min-height:96px}.layout-compact .serviceCollection .service{min-height:84px}.publicNav button{min-width:0;padding-inline:3px;overflow:hidden;text-overflow:ellipsis}
  }
  @media(max-width:430px){.layoutPicker{grid-template-columns:1fr}.layoutChoice{min-height:80px}.layoutChoice .miniLayout{height:24px}.themes{grid-template-columns:repeat(2,minmax(0,1fr))!important}.mobilePreviewBtn{right:12px;bottom:82px;padding:10px 12px;font-size:12px}.reviewPreview{border-radius:14px}}
  @media(max-width:360px){.layout-bento .serviceCollection,.layout-compact .serviceCollection,.layout-brutal .serviceCollection{grid-template-columns:1fr}.layout-bento .serviceCollection .service{grid-column:auto!important}.themes{grid-template-columns:1fr!important}}
  `;
  document.head.appendChild(css);

  // Wrap services as a real collection so compositions can change structure, not only card radii/colors.
  const previousClient=typeof clientMarkup==='function'?clientMarkup:null;
  if(previousClient){
    clientMarkup=function(input,interactive=true){
      let html=previousClient(input,interactive);
      if(!html.includes('class="serviceCollection"')) html=html.replace(/(<h2>Услуги<\/h2>)([\s\S]*?)(<h2>Возможности<\/h2>)/,'$1<div class="serviceCollection">$2</div>$3');
      return html;
    };
  }

  function decorateChoices(){
    try{
      if(typeof st==='undefined')return;
      const recommendedLayout=layoutReco[st.biz]||'minimal';
      document.querySelectorAll('.layoutChoice').forEach(el=>{
        const yes=el.dataset.layout===recommendedLayout;el.classList.toggle('layoutRecommended',yes);
        let tag=el.querySelector('.layoutRecoTag');if(yes&&!tag){tag=document.createElement('span');tag.className='layoutRecoTag';tag.textContent='ТОП ДЛЯ НИШИ';el.appendChild(tag)}else if(!yes&&tag)tag.remove();
      });
      const names=fontReco[st.bizCat]||fontReco.Другое;
      document.querySelectorAll('#fonts .fontChoice').forEach((el,i)=>{
        const font=typeof FONTS!=='undefined'?FONTS[i]:null;if(font)el.style.fontFamily=font[1];const yes=!!font&&names.includes(font[0]);el.classList.toggle('fontRecommended',yes);
        let tag=el.querySelector('.fontRecoTag');if(yes&&!tag){tag=document.createElement('span');tag.className='fontRecoTag';tag.textContent='ТОП';el.appendChild(tag)}else if(!yes&&tag)tag.remove();
      });
    }catch(e){console.warn('CLIENTA choice decoration',e)}
  }

  function refreshAll(){
    try{if(typeof st==='undefined'||typeof clientMarkup!=='function')return;const html=clientMarkup(st,false);['livePreview','mobileLive','reviewPreview'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=html})}catch(e){console.warn('CLIENTA audit refresh',e)}
  }

  function persistChosenLayout(){
    try{
      if(typeof st==='undefined'||!st.layout)return;
      if(typeof current!=='undefined'&&current)current.layout=st.layout;
      for(let i=0;i<localStorage.length;i++){
        const key=localStorage.key(i),raw=localStorage.getItem(key);if(!raw||raw[0]!=='['&&raw[0]!=='{')continue;
        let data;try{data=JSON.parse(raw)}catch(_){continue}let changed=false;
        const walk=v=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach(walk);return}if((typeof current!=='undefined'&&current&&v.id===current.id)||(v.name===st.name&&v.biz===st.biz&&Number.isInteger(v.theme))){if(v.layout!==st.layout){v.layout=st.layout;changed=true}}Object.values(v).forEach(walk)};
        walk(data);if(changed)localStorage.setItem(key,JSON.stringify(data));
      }
    }catch(e){console.warn('CLIENTA layout persist',e)}
  }

  const observer=new MutationObserver(()=>{if(document.getElementById('s2')?.classList.contains('on'))setTimeout(decorateChoices,0);if(document.getElementById('s6')?.classList.contains('on'))setTimeout(refreshAll,0);if(document.getElementById('success')?.classList.contains('on'))setTimeout(persistChosenLayout,40)});
  observer.observe(document.getElementById('builder')||document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
  document.getElementById('bizGrid')?.addEventListener('click',()=>setTimeout(decorateChoices,100));
  document.getElementById('fonts')?.addEventListener('click',()=>setTimeout(()=>{decorateChoices();refreshAll()},0));
  document.getElementById('layoutPicker')?.addEventListener('click',()=>setTimeout(()=>{decorateChoices();refreshAll()},0));
  document.getElementById('next')?.addEventListener('click',()=>{if(typeof st!=='undefined'&&st.step===6)setTimeout(persistChosenLayout,80)});
  setTimeout(()=>{decorateChoices();refreshAll()},120);
  window.CLIENTA_FINAL_DESIGN_AUDIT={serviceCollections:true,mobileFixes:true,fontRecommendations:true,layoutPersistence:true};
})();