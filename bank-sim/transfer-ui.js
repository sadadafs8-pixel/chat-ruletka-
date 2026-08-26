(() => {
  const style=document.createElement('style');
  style.textContent=`
    .demo-ribbon{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border-radius:10px;background:#353538;color:#ffd84a;font-size:11px;font-weight:900;letter-spacing:.4px;margin-bottom:12px}
    .transfer-head{text-align:center;padding:6px 0 14px}.transfer-head .round-ok{width:58px;height:58px;border-radius:50%;margin:0 auto 10px;display:grid;place-items:center;background:#2e8b57;font-size:30px;font-weight:900}.transfer-head h3{margin:0 0 6px;font-size:24px}.transfer-head p{margin:0;color:#999;font-size:12px}
    .transfer-card{background:#262628;border-radius:20px;padding:14px;margin:10px 0}.transfer-line{display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid #38383b}.transfer-line:last-child{border-bottom:0}.transfer-line span{color:#9b9ba1;font-size:12px}.transfer-line b{font-size:13px;text-align:right;max-width:62%;overflow-wrap:anywhere}.transfer-amount{font-size:32px;font-weight:950;text-align:center;margin:4px 0 12px}.demo-warning{background:#302d20;border:1px solid #5e5528;color:#f0db76;border-radius:16px;padding:11px 12px;font-size:11px;line-height:1.45;margin:12px 0}
    .bank-choice{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:8px 0 12px}.bank-choice button{border:0;border-radius:15px;background:#29292c;color:#fff;padding:12px 10px;text-align:left;font-weight:800}.bank-choice button.active{outline:2px solid #fff}.bank-choice small{display:block;color:#9d9da3;font-weight:600;margin-top:3px}
  `;
  document.head.appendChild(style);

  const nowLabel=()=>new Intl.DateTimeFormat('ru-RU',{day:'numeric',month:'long',hour:'2-digit',minute:'2-digit'}).format(new Date()).replace(',', ' ·');
  const banks=['Т-Банк','Сбер','Альфа-Банк','ВТБ'];

  function transferFlow(){
    let selectedBank='Т-Банк';
    openSheet(`<div class="demo-ribbon">ДЕМО · СИМУЛЯТОР</div><h3>Перевод по телефону</h3><div class="field"><label>Номер телефона</label><input id="trPhone" inputmode="tel" value="+7 " maxlength="18" placeholder="+7 999 123-45-67"></div><div class="field"><label>Имя получателя</label><input id="trRecipient" value="Алексей" maxlength="50"></div><label style="font-size:11px;color:#9b9ba1">Банк получателя</label><div class="bank-choice" id="bankChoice">${banks.map((b,i)=>`<button data-bank="${safe(b)}" class="${i===0?'active':''}">${safe(b)}<small>${i===0?'СБП · без комиссии':'СБП'}</small></button>`).join('')}</div><div class="field"><label>Сумма</label><input id="trAmount" inputmode="decimal" placeholder="1 000"></div><div class="field"><label>Сообщение получателю</label><input id="trMessage" maxlength="70" placeholder="Необязательно"></div><button class="primary" id="trContinue">Продолжить</button><div class="demo-warning">Учебный экран. Он не отправляет деньги и не создаёт настоящий банковский чек или подтверждение платежа.</div>`);
    document.querySelectorAll('[data-bank]').forEach(btn=>btn.onclick=()=>{selectedBank=btn.dataset.bank;document.querySelectorAll('[data-bank]').forEach(x=>x.classList.toggle('active',x===btn))});
    $('#trContinue').onclick=()=>{
      const a=num($('#trAmount').value);const recipient=$('#trRecipient').value.trim()||'Получатель';const phone=$('#trPhone').value.trim();const msg=$('#trMessage').value.trim();
      if(!a||a<=0){toast('Введите сумму');return}if(a>state.account.balance){toast('Недостаточно средств');return}
      confirmTransfer({a,recipient,phone,bank:selectedBank,msg});
    };
  }

  function confirmTransfer(d){
    openSheet(`<div class="demo-ribbon">ДЕМО · СИМУЛЯТОР</div><h3>Проверьте перевод</h3><div class="transfer-amount">${money(d.a)}</div><div class="transfer-card"><div class="transfer-line"><span>Получатель</span><b>${safe(d.recipient)}</b></div><div class="transfer-line"><span>Телефон</span><b>${safe(d.phone||'Не указан')}</b></div><div class="transfer-line"><span>Банк</span><b>${safe(d.bank)}</b></div><div class="transfer-line"><span>Счёт списания</span><b>${safe(state.account.name)} •• ${safe(state.account.last4)}</b></div><div class="transfer-line"><span>Комиссия</span><b>0 ₽</b></div>${d.msg?`<div class="transfer-line"><span>Сообщение</span><b>${safe(d.msg)}</b></div>`:''}</div><button class="primary" id="trSendDemo">Подтвердить демо-перевод</button><button class="secondary-btn" id="trBack">Назад</button><div class="demo-warning">Это симуляция интерфейса: реального списания и перевода через банк не происходит.</div>`);
    $('#trBack').onclick=transferFlow;
    $('#trSendDemo').onclick=()=>completeTransfer(d);
  }

  function completeTransfer(d){
    state.account.balance-=d.a;state.spend+=d.a;
    const item={id:'tx'+Date.now(),title:`Перевод · ${d.recipient}`,amount:-d.a,sub:nowLabel(),impactBalance:true,countSpend:true,type:'demo-transfer',recipient:d.recipient,phone:d.phone,bank:d.bank,message:d.msg,status:'Демо выполнено',commission:0};
    state.tx.unshift(item);render();
    openTransferDetail(item,true);
  }

  function openTransferDetail(t,justDone=false){
    openSheet(`<div class="demo-ribbon">ДЕМО · НЕ ЯВЛЯЕТСЯ ПЛАТЕЖОМ</div><div class="transfer-head"><div class="round-ok">✓</div><h3>${justDone?'Демо-перевод выполнен':'Детали перевода'}</h3><p>Запись сохранена только в локальном симуляторе</p></div><div class="transfer-amount">−${rub(t.amount)}</div><div class="transfer-card"><div class="transfer-line"><span>Статус</span><b>${safe(t.status||'Демо выполнено')}</b></div><div class="transfer-line"><span>Получатель</span><b>${safe(t.recipient||t.title.replace(/^Перевод\s*[·•-]?\s*/,''))}</b></div><div class="transfer-line"><span>Банк получателя</span><b>${safe(t.bank||'Демо-банк')}</b></div><div class="transfer-line"><span>Телефон</span><b>${safe(t.phone||'Не указан')}</b></div><div class="transfer-line"><span>Дата и время</span><b>${safe(t.sub||'')}</b></div><div class="transfer-line"><span>Счёт списания</span><b>${safe(state.account.name)} •• ${safe(state.account.last4)}</b></div><div class="transfer-line"><span>Комиссия</span><b>${money(t.commission||0)}</b></div>${t.message?`<div class="transfer-line"><span>Сообщение</span><b>${safe(t.message)}</b></div>`:''}</div><div class="demo-warning"><b>ДЕМО:</b> этот экран нельзя использовать как подтверждение оплаты. Банковская операция не совершалась.</div><button class="secondary-btn" id="toHistory">К операциям</button>`);
    $('#toHistory').onclick=historyDemo;
  }

  function rowHtml(t,i){
    const isTransfer=t.type==='demo-transfer'||/^Перевод/.test(t.title||'');
    return `<button class="tx-edit-row" data-demo-tx="${i}"><span class="tx-dot">${isTransfer?'↗':(t.amount>0?'＋':'•')}</span><span class="tx-main"><b>${safe(t.title)}</b><small>${safe(t.sub||'')}${isTransfer?' · ДЕМО':''}</small></span><span class="tx-amount ${t.amount>0?'plus':''}">${t.amount>0?'+':'−'}${rub(t.amount)}</span></button>`;
  }

  function historyDemo(){
    openSheet(`<div class="demo-ribbon">ДЕМО · СИМУЛЯТОР</div><h3>Все операции</h3><div class="history-total-card"><small>Трат в августе</small><strong>${rub(state.spend)}</strong></div><div class="history-actions"><button id="demoNewTransfer">↗ Перевод</button></div><div class="tx-edit-list">${state.tx.map(rowHtml).join('')}</div><div class="note">Переводы отображаются как банковский интерфейс, но остаются учебными локальными записями.</div>`);
    $('#demoNewTransfer').onclick=transferFlow;
    document.querySelectorAll('[data-demo-tx]').forEach(b=>b.onclick=()=>{const t=state.tx[Number(b.dataset.demoTx)];if(t.type==='demo-transfer'||/^Перевод/.test(t.title||''))openTransferDetail(t);else operationEditorSheet(Number(b.dataset.demoTx));});
  }

  document.querySelectorAll('[data-action="transfer"]').forEach(b=>b.onclick=e=>{e.stopPropagation();transferFlow()});
  const hist=$('#historyTile');if(hist)hist.onclick=historyDemo;
  window.demoTransferFlow=transferFlow;
})();