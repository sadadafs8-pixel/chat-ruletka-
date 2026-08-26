/* CLIENTA design library loader: 7,500 responsive original presets. */
(function(){
  if (window.CLIENTA_7500 || document.querySelector('script[data-clienta-7500]')) return;
  const s=document.createElement('script');
  s.src='./qa-patch18.js';
  s.defer=true;
  s.dataset.clienta7500='1';
  document.head.appendChild(s);
})();