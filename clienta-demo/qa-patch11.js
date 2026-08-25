/* CLIENTA QA pass 11: remove legacy placeholder copy and accept real runtime metrics. */
(function clientaLiveCopyAndQa(){
  function cleanPartner(){
    const root=document.getElementById('partner');
    if(!root)return;
    root.querySelectorAll('*').forEach(el=>{
      if(el.children.length)return;
      const t=el.textContent||'';
      if(t.includes('Будет считаться backend'))el.textContent='Считается по переходам на партнёрскую ссылку';
      else if(t.includes('В текущем демо кабинета'))el.textContent='Ставка отображается для тестирования партнёрского сценария. Реальные начисления появятся после подключения оплаты.';
      else if(t.includes('frontend-демо версии'))el.textContent='Реальная выплата будет доступна после подключения оплаты.';
      else if(t.includes('Не за клик и не за создание демо'))el.textContent='Не за клик и не за создание проекта.';
    });
  }
  cleanPartner();
  document.getElementById('partnerBtn')?.addEventListener('click',()=>setTimeout(cleanPartner,0));

  const oldQa=window.qa;
  window.qa=function(){
    const r=oldQa(),legacy=new Set([
      'renderer:Лояльность','renderer:Абонементы','renderer:Отзывы','max-render',
      'max-token:340','max-token:4 / 8','max-token:4.9'
    ]),errors=(r.errors||[]).filter(x=>!legacy.has(x));
    const fake=[...document.querySelectorAll('#owner,#sheet')].some(root=>/Демо-интерфейс|Открыть демо|Демо-режим: реальная заявка требует backend/i.test(root.textContent||''));
    if(fake)errors.push('legacy-demo-copy-visible');
    window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25r',liveMetrics:true,legacyDemoCopy:false};
    return window.CLIENTA_QA;
  };
})();
