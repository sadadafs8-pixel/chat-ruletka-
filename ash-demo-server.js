import http from 'node:http';

const PORT = Number(process.env.PORT || 10000);
const UPSTREAM = 'https://rush-detailing-demo.onrender.com';

const BRAND_SCRIPT = String.raw`
<script>
(() => {
  const ASH_TG='https://t.me/detailing_ash22';
  const ASH_PHONE='+79939222123';
  const frame=document.getElementById('rushFrame');
  const app=window.Telegram?.WebApp;
  try{app?.ready();app?.expand();app?.setHeaderColor?.('#020406');app?.setBackgroundColor?.('#020406')}catch{}

  const css=`
:root{--bg:#020406!important;--panel:#090d11!important;--text:#f7fbff!important;--muted:#8994a0!important;--lime:#39b8ff!important;--line:#17222d!important}
html,body{background:#020406!important;color:#f7fbff!important}
.app{background:radial-gradient(circle at 88% 0%,#35b7ff18,transparent 25%),radial-gradient(circle at 8% 8%,#57d99f12,transparent 25%),linear-gradient(180deg,#020406,#04080c 58%,#020406)!important}
.status,.tag{border-color:#213447!important;color:#a8dfff!important;background:#071019!important}
.hero{border-color:#1c2c39!important;box-shadow:0 18px 65px #000b!important}
.hero:before{background:linear-gradient(180deg,#0008 0%,#02070b55 38%,#020406f2 100%)!important}
.hero:after{content:'';position:absolute;inset:0;z-index:1;background:radial-gradient(circle at 85% 8%,#39d98a22,transparent 30%),radial-gradient(circle at 12% 12%,#299cff35,transparent 34%);pointer-events:none}
.hero h1{font-weight:950!important;text-shadow:0 8px 30px #000!important}.hero p{color:#bdc8d1!important}
.kicker,.cat,.promo small{color:#61d9ff!important}.btn,.action{border-color:#223746!important;background:#0b1218!important}.btn.primary{border-color:#47c7ff!important;background:linear-gradient(135deg,#28a8ff,#54dc9b)!important;color:#021017!important;box-shadow:0 10px 30px #2aa9ff28!important}.btn.outline{border-color:#28506a!important;background:#071017dd!important;color:#eaf8ff!important}
.promo{border-color:#1b6d91!important;background:linear-gradient(135deg,#081825,#08100f)!important;box-shadow:0 0 42px #25b7ff17!important}.gift{background:linear-gradient(145deg,#0f2736,#0a1816)!important}
.category-card,.benefit,.contact,.stat,.card,.action{border-color:#172a37!important;background:linear-gradient(145deg,#090e13,#06090c)!important;box-shadow:0 16px 38px #0006!important}.category-image{filter:saturate(.82) contrast(1.06) brightness(.82)!important}.service-line{border-color:#182530!important}.detail-btn{border-color:#36b9f7!important;color:#55d3ff!important;background:#07131b!important}.benefit i{color:#4edb9c!important}.contact{border-color:#1b526d!important;background:linear-gradient(135deg,#07131c,#08110f)!important}.contact a{border-color:#214055!important;background:#09141b!important}
.nav{border-color:#1b3444!important;background:#061018f2!important;box-shadow:0 12px 40px #000c!important}.nav button{color:#60717e!important}.nav button.active,.nav .active{color:#57d3ff!important}.sheet{border-color:#1a4259!important;background:#050a0e!important}.handle{background:#214254!important}.progress i{background:#14242e!important}.progress i.on{background:linear-gradient(90deg,#2aa8ff,#54dc9b)!important}.field,.choice,.calc-service,.booking-field{border-color:#1f3544!important;background:#081017!important;color:#f7fbff!important}.choice.active{border-color:#34bafa!important;background:#092032!important}.calc-service input{accent-color:#32b7f6!important}.upload{border-color:#28536a!important;background:#07131a!important;color:#afbdc7!important}.summary,.booking-box,.estimate-box{border-color:#1f475c!important;background:#071118!important}.summary-row{border-color:#162731!important}.estimate-value{color:#57d8a5!important}.check{background:#09241c!important;border-color:#2fc98a!important;color:#55e2a5!important}.toast{background:linear-gradient(135deg,#27a8ff,#50d99a)!important;color:#021017!important}.badge.new{background:#102638!important;color:#79cfff!important;border-color:#205476!important}.badge.work{background:#0b2b21!important;color:#72e4ad!important;border-color:#1f674b!important}
.ash-head{display:flex;align-items:center;gap:10px}.ash-mark{width:44px;height:44px;border-radius:50%;padding:2px;background:linear-gradient(135deg,#2ba8ff,#52dc9c);box-shadow:0 0 24px #2cbcff25;flex:0 0 auto}.ash-mark-in{width:100%;height:100%;border-radius:50%;display:grid;place-items:center;background:#05080b;font-size:10px;font-weight:950;letter-spacing:.08em;color:#f7fbff}.ash-copy{line-height:1}.ash-copy b{display:block;font-size:16px;letter-spacing:.04em}.ash-copy span{display:block;margin-top:5px;font-size:8px;letter-spacing:.18em;color:#71808d}
`;

  function swapText(doc){
    try{const w=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode()){if(!n.nodeValue)continue;n.nodeValue=n.nodeValue.replace(/RUSH DETAILING/gi,'ASH STYLING 22').replace(/Rush Detailing/gi,'ASH STYLING 22').replace(/Rush/g,'ASH')}}catch{}
  }
  function apply(doc,inAdmin){
    if(!doc?.body)return;
    if(!doc.getElementById('ash-style')){const s=doc.createElement('style');s.id='ash-style';s.textContent=css;doc.head.appendChild(s)}
    swapText(doc);doc.title=inAdmin?'ASH STYLING 22 / ADMIN':'ASH STYLING 22';
    if(inAdmin){const b=doc.querySelector('.brand');if(b)b.textContent='ASH STYLING 22 / ADMIN';return}
    const logo=doc.querySelector('.logo');if(logo)logo.innerHTML='<div class="ash-head"><div class="ash-mark"><div class="ash-mark-in">ASH22</div></div><div class="ash-copy"><b>ASH STYLING 22</b><span>MOSCOW • TUSHINO</span></div></div>';
    const status=doc.querySelector('.status');if(status)status.textContent='10:00–22:00';
    const kicker=doc.querySelector('.kicker');if(kicker)kicker.textContent='DETAILING • WRAP • PROTECTION';
    const h1=doc.querySelector('.hero h1');if(h1)h1.textContent='Стиль и защита, которые видно сразу';
    const hp=doc.querySelector('.hero p');if(hp)hp.textContent='Оклейка полиуретаном и винилом, полировка, керамика и профессиональный детейлинг — в одном месте.';
    const ps=doc.querySelector('.promo small');if(ps)ps.textContent='СПЕЦПРЕДЛОЖЕНИЕ ASH STYLING 22';
    const ph=doc.querySelector('.promo h3');if(ph)ph.textContent='Защита зон риска + выгодные условия на керамику';
    [...doc.querySelectorAll('.section-head h2')].forEach(x=>{if(/почему/i.test(x.textContent))x.textContent='Почему ASH'});
    const contact=doc.querySelector('.contact');if(contact){const h=contact.querySelector('h3'),p=contact.querySelector('p');if(h)h.textContent='ASH STYLING 22 • Москва';if(p)p.innerHTML='Москва, ул. Василия Петушкова, 3к3с1<br>Ежедневно с 10:00 до 22:00'}
    doc.querySelectorAll('a[href]').forEach(a=>{const h=a.getAttribute('href')||'';if(h.includes('rushdetailing'))a.setAttribute('href',ASH_TG);if(h.startsWith('tel:'))a.setAttribute('href','tel:'+ASH_PHONE)});
    doc.querySelectorAll('[onclick]').forEach(el=>{let v=el.getAttribute('onclick')||'';v=v.replace(/https:\/\/t\.me\/rushdetailing/g,ASH_TG).replace(/tel:\+79254706712/g,'tel:'+ASH_PHONE);el.setAttribute('onclick',v)});
  }
  function run(){try{const doc=frame?.contentDocument,win=frame?.contentWindow;if(!doc)return;apply(doc,String(win?.location?.pathname||'').includes('/admin.html'))}catch(e){console.error(e)}}
  frame?.addEventListener('load',()=>{setTimeout(run,0);setTimeout(run,300)});setTimeout(run,500);
})();
</script>`;

function cleanHeaders(headers){
  const out={};
  for(const [k,v] of headers){
    const key=k.toLowerCase();
    if(['content-length','content-encoding','transfer-encoding','connection'].includes(key))continue;
    out[k]=v;
  }
  out['cache-control']='no-store, max-age=0';
  return out;
}

const server=http.createServer(async(req,res)=>{
  try{
    const u=new URL(req.url||'/','http://localhost');
    const upstreamPath=u.pathname==='/'?'/app.html':u.pathname;
    const target=UPSTREAM+upstreamPath+u.search;
    const r=await fetch(target,{redirect:'follow',headers:{'user-agent':'ASH-STYLING-22-DEMO'}});
    const type=r.headers.get('content-type')||'';
    if(type.includes('text/html')){
      let text=await r.text();
      if(upstreamPath==='/app.html'){
        text=text.replace(/<title>[^<]*<\/title>/i,'<title>ASH STYLING 22</title>')
                 .replaceAll('Rush Detailing','ASH STYLING 22')
                 .replaceAll('#050505','#020406')
                 .replace('</body>',BRAND_SCRIPT+'</body>');
      }
      res.writeHead(r.status,{...cleanHeaders(r.headers),'content-type':'text/html; charset=utf-8'});
      if(req.method==='HEAD')return res.end();
      return res.end(text);
    }
    const buf=Buffer.from(await r.arrayBuffer());
    res.writeHead(r.status,cleanHeaders(r.headers));
    if(req.method==='HEAD')return res.end();
    res.end(buf);
  }catch(e){
    console.error(e);
    res.writeHead(502,{'content-type':'text/plain; charset=utf-8'});
    res.end('ASH demo temporarily unavailable');
  }
});

server.listen(PORT,'0.0.0.0',()=>console.log('ASH STYLING 22 demo on',PORT));
