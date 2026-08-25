/* CLIENTA QA pass 6: partner cabinet clarity + mobile-first layout. */
(function enhancePartnerCabinet(){
  const modal=document.getElementById('partner');
  if(!modal)return;
  const root=modal.querySelector('.modalIn');
  if(!root)return;

  root.classList.add('partnerCabinet');
  root.innerHTML=`
    <div class="partnerTopbar">
      <div><div class="eyebrow">CLIENTA Partners</div><b class="partnerTitle">Партнёрский кабинет</b></div>
      <button id="closePartner" class="close" aria-label="Закрыть">×</button>
    </div>

    <section class="partnerHeroCard">
      <div>
        <span class="partnerKicker">Зарабатывайте на рекомендациях</span>
        <h1>Привели бизнес → получили комиссию.</h1>
        <p>Отправьте личную ссылку владельцу бизнеса. Комиссия появляется только после подтверждённой оплаты.</p>
      </div>
      <div class="partnerRate"><small>Ставка</small><strong>20%</strong><span>с подтверждённой первой оплаты</span></div>
    </section>

    <section class="partnerStats" aria-label="Статистика партнёра">
      <div class="partnerStat primary"><small>Доступно к выводу</small><strong id="partnerBalance">0 ₽</strong><span>После подтверждённых оплат</span></div>
      <div class="partnerStat"><small>Оплачено клиентов</small><strong id="partnerClients">0</strong><span>Подтверждённые покупки</span></div>
      <div class="partnerStat"><small>Переходов</small><strong id="partnerClicks">0</strong><span>Будет считаться backend</span></div>
    </section>

    <section class="partnerSection partnerLinkCard">
      <div class="partnerSectionHead"><div><small>ШАГ 1</small><h2>Поделитесь своей ссылкой</h2></div><span class="partnerStatus ready">Готово</span></div>
      <p>Мы привяжем клиента к вам по параметру <b>ref</b>. Не меняйте ссылку вручную.</p>
      <div class="partnerRefBox"><input id="refLink" readonly aria-label="Личная партнёрская ссылка"><button id="copyRef" class="btn lime">Копировать</button></div>
      <button id="shareRef" class="partnerSecondary">Поделиться ссылкой</button>
    </section>

    <section class="partnerSection">
      <div class="partnerSectionHead"><div><small>ШАГ 2</small><h2>Что происходит дальше</h2></div></div>
      <div class="partnerFlow">
        <div><span>1</span><div><b>Клиент переходит</b><small>CLIENTA сохраняет ваш ref.</small></div></div>
        <div><span>2</span><div><b>Создаёт проект</b><small>Можно собрать Mini App прямо по вашей ссылке.</small></div></div>
        <div><span>3</span><div><b>Оплачивает</b><small>Оплата должна быть подтверждена системой.</small></div></div>
        <div><span>4</span><div><b>Комиссия доступна</b><small>После подтверждения сумма попадёт в баланс.</small></div></div>
      </div>
    </section>

    <section class="partnerGrid2">
      <div class="partnerSection payoutCard">
        <div class="partnerSectionHead"><div><small>ШАГ 3</small><h2>Вывод денег</h2></div><span class="partnerStatus">СБП</span></div>
        <div class="payoutMethod"><span>Быстрые платежи</span><b>На телефон + выбранный банк</b></div>
        <button id="withdrawPartner" class="partnerPrimary" disabled>Вывести 0 ₽</button>
        <p class="partnerNote">Сейчас баланс нулевой. Кнопка станет доступна после подтверждённой комиссии.</p>
      </div>
      <div class="partnerSection">
        <div class="partnerSectionHead"><div><small>ВАЖНО</small><h2>Когда начисляем</h2></div></div>
        <div class="partnerRules">
          <div><b>✓ После оплаты</b><small>Не за клик и не за создание демо.</small></div>
          <div><b>✓ После проверки</b><small>Чтобы исключить отмены и накрутку.</small></div>
          <div><b>✓ Прозрачный статус</b><small>Переход → заявка → оплачено → выплачено.</small></div>
        </div>
      </div>
    </section>

    <section class="partnerSection">
      <div class="partnerSectionHead"><div><small>КЛИЕНТЫ</small><h2>Мои рекомендации</h2></div><span class="partnerStatus">0</span></div>
      <div class="partnerEmpty"><b>Пока нет оплаченных клиентов</b><p>Скопируйте ссылку выше и отправьте первому бизнесу. Здесь появятся статусы рекомендаций.</p></div>
    </section>

    <section class="partnerSection partnerFaq">
      <details><summary>Сколько я получаю?</summary><p>В текущем демо кабинета показана ставка 20% с подтверждённой первой оплаты. Финальные условия должны задаваться в backend и правилах партнёрской программы.</p></details>
      <details><summary>Почему деньги не начисляются сразу?</summary><p>Сначала нужно подтвердить реальную оплату и исключить отмену или дублирование клиента.</p></details>
      <details><summary>Как получить деньги?</summary><p>Планируем вывод через СБП по номеру телефона и выбранному банку. В этой frontend-демо версии реальная выплата ещё не выполняется.</p></details>
    </section>
  `;

  if(!document.getElementById('clienta-partner-v2-style')){
    const style=document.createElement('style');
    style.id='clienta-partner-v2-style';
    style.textContent=`
      .partner{background:#090909;color:#f7f4ee}
      .partner .partnerCabinet{max-width:980px;padding:calc(18px + env(safe-area-inset-top)) 18px calc(70px + env(safe-area-inset-bottom))}
      .partnerTopbar{display:flex;align-items:center;justify-content:space-between;gap:12px;position:sticky;top:0;z-index:5;background:#090909ed;backdrop-filter:blur(18px);padding:4px 0 12px}
      .partnerTopbar .close{margin-left:0;border-color:#333;color:#fff;flex:none}
      .partnerTitle{display:block;font-size:20px;margin-top:4px}
      .partnerHeroCard{display:grid;grid-template-columns:minmax(0,1fr) 220px;gap:18px;border:1px solid #2a2a2a;border-radius:28px;padding:24px;background:linear-gradient(145deg,#141414,#0d0d0d);margin-top:8px}
      .partnerHeroCard h1{font:400 clamp(42px,7vw,72px)/.9 Georgia,serif;letter-spacing:-.05em;margin:8px 0 14px;max-width:720px}
      .partnerHeroCard p{color:#949494;line-height:1.5;margin:0;max-width:650px}
      .partnerKicker{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#9b9b9b;font-weight:900}
      .partnerRate{border-radius:22px;background:#f4f1ea;color:#111;padding:18px;display:flex;flex-direction:column;justify-content:flex-end;min-height:180px}
      .partnerRate small,.partnerStat small,.partnerSectionHead small{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#7b7b7b;font-weight:900}
      .partnerRate strong{font:400 64px/.95 Georgia,serif;margin:8px 0}
      .partnerRate span{font-size:12px;color:#555;line-height:1.35}
      .partnerStats{display:grid;grid-template-columns:2fr 1fr 1fr;gap:10px;margin-top:10px}
      .partnerStat{border:1px solid #2a2a2a;border-radius:22px;padding:18px;background:#121212;min-height:132px;display:flex;flex-direction:column;justify-content:space-between}
      .partnerStat.primary{background:#d9ff58;color:#111;border-color:#d9ff58}
      .partnerStat.primary small,.partnerStat.primary span{color:#445000}
      .partnerStat strong{font-size:34px;letter-spacing:-.04em}.partnerStat span{font-size:11px;color:#737373}
      .partnerSection{border:1px solid #292929;border-radius:24px;padding:20px;background:#111;margin-top:10px}
      .partnerSection p{color:#8d8d8d;line-height:1.5}
      .partnerSectionHead{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}
      .partnerSection h2{font:400 30px/1 Georgia,serif;letter-spacing:-.03em;margin:5px 0 0}
      .partnerStatus{border:1px solid #343434;border-radius:99px;padding:7px 10px;font-size:10px;color:#aaa;white-space:nowrap}.partnerStatus.ready{background:#18391f;color:#a8efb7;border-color:#285532}
      .partnerRefBox{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px;margin-top:14px}.partnerRefBox input{min-width:0;height:52px;border:1px solid #303030;background:#090909;color:#fff;border-radius:15px;padding:0 13px;font-size:13px}.partnerRefBox .btn{min-height:52px}
      .partnerSecondary,.partnerPrimary{width:100%;min-height:50px;border-radius:15px;font-weight:900;margin-top:8px}.partnerSecondary{border:1px solid #333;background:#171717;color:#fff}.partnerPrimary{border:0;background:#f4f1ea;color:#111}.partnerPrimary:disabled{opacity:.38;cursor:not-allowed}
      .partnerFlow{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:15px}.partnerFlow>div{border:1px solid #292929;border-radius:18px;padding:14px;min-height:126px}.partnerFlow span{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#f4f1ea;color:#111;font-weight:900;margin-bottom:15px}.partnerFlow b,.partnerFlow small,.partnerRules small{display:block}.partnerFlow small,.partnerRules small{color:#777;margin-top:5px;line-height:1.35}
      .partnerGrid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}.partnerGrid2 .partnerSection{margin-top:10px}.payoutMethod{border:1px solid #292929;border-radius:16px;padding:14px;margin-top:14px}.payoutMethod span,.payoutMethod b{display:block}.payoutMethod span{font-size:11px;color:#7c7c7c;margin-bottom:5px}.partnerNote{font-size:11px;margin-bottom:0}.partnerRules{display:grid;gap:8px;margin-top:14px}.partnerRules>div{border:1px solid #292929;border-radius:15px;padding:13px}
      .partnerEmpty{border:1px dashed #333;border-radius:18px;padding:22px;margin-top:14px;text-align:center}.partnerEmpty p{margin-bottom:0;font-size:12px}.partnerFaq details{border-top:1px solid #292929;padding:14px 0}.partnerFaq details:first-child{border-top:0}.partnerFaq summary{cursor:pointer;font-weight:850}.partnerFaq details p{font-size:12px;margin-bottom:0}
      @media(max-width:700px){
        .partner .partnerCabinet{padding-left:12px;padding-right:12px}
        .partnerHeroCard{grid-template-columns:1fr;padding:18px;border-radius:22px}.partnerHeroCard h1{font-size:48px}.partnerRate{min-height:auto;display:grid;grid-template-columns:1fr auto;align-items:end}.partnerRate small,.partnerRate span{grid-column:1}.partnerRate strong{grid-column:2;grid-row:1/3;font-size:50px;margin:0}
        .partnerStats{grid-template-columns:1fr 1fr}.partnerStat.primary{grid-column:1/-1;min-height:118px}.partnerStat{min-height:104px;padding:15px}.partnerStat strong{font-size:30px}
        .partnerFlow{grid-template-columns:1fr 1fr}.partnerGrid2{grid-template-columns:1fr}
      }
      @media(max-width:430px){
        .partnerTopbar{padding-top:2px}.partnerTitle{font-size:17px}.partnerTopbar .close{width:42px;height:42px}
        .partnerHeroCard h1{font-size:42px}.partnerHeroCard p{font-size:13px}.partnerRate strong{font-size:44px}
        .partnerSection{padding:16px;border-radius:20px}.partnerSection h2{font-size:26px}
        .partnerRefBox{grid-template-columns:1fr}.partnerRefBox input,.partnerRefBox .btn,.partnerSecondary,.partnerPrimary{min-height:50px}
        .partnerFlow{grid-template-columns:1fr}.partnerFlow>div{min-height:0;display:grid;grid-template-columns:32px 1fr;gap:10px;align-items:start}.partnerFlow span{margin:0}
        .partnerStats{gap:8px}.partnerStat{padding:14px}.partnerStat span{font-size:10px}
      }
    `;
    document.head.appendChild(style);
  }

  const close=document.getElementById('closePartner');
  close?.addEventListener('click',()=>{modal.classList.remove('on');document.body.style.overflow=''});
  document.getElementById('copyRef')?.addEventListener('click',()=>copyText(document.getElementById('refLink').value,'Ссылка скопирована'));
  document.getElementById('shareRef')?.addEventListener('click',async()=>{
    const url=document.getElementById('refLink').value;
    if(navigator.share){try{await navigator.share({title:'CLIENTA',text:'Соберите Mini App для бизнеса',url});return}catch{}}
    copyText(url,'Ссылка скопирована');
  });

  document.getElementById('partnerBtn')?.addEventListener('click',()=>{
    requestAnimationFrame(()=>{
      const id=localStorage.getItem('clienta_partner_id')||'';
      const input=document.getElementById('refLink');
      if(input&&!input.value&&id)input.value=location.origin+location.pathname+'?ref='+id;
    });
  });
})();

const _qaQa6=qa;
qa=function(){
  const r=_qaQa6(),errors=[...r.errors];
  const partner=document.getElementById('partner');
  ['partnerBalance','partnerClients','partnerClicks','refLink','copyRef','shareRef','withdrawPartner'].forEach(id=>{if(!document.getElementById(id))errors.push('partner-ui:'+id)});
  if(partner&&!partner.querySelector('.partnerFlow'))errors.push('partner-flow');
  if(partner&&!partner.querySelector('.payoutCard'))errors.push('partner-payout');
  const withdraw=document.getElementById('withdrawPartner');
  if(withdraw&&!withdraw.disabled)errors.push('partner-zero-balance-withdraw');
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25l',partnerCabinetV2:true,partnerMobileV2:true};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa6=qa();
if(!qa6.ok)console.warn('CLIENTA QA6 failed',qa6.errors);
