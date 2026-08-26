/* CLIENTA QA pass 14: independent composition system, font library and visual style explorer. */
(function clientaDesignSystemV2(){
const LAYOUTS=[
{id:'minimal',name:'Product Minimal',desc:'Чисто, спокойно, максимум понятности'},
{id:'editorial',name:'Luxury Editorial',desc:'Премиальная типографика и много воздуха'},
{id:'bento',name:'Bento',desc:'Современная модульная сетка карточек'},
{id:'immersive',name:'Immersive',desc:'Большой hero и сильная визуальная подача'},
{id:'split',name:'Split',desc:'Контрастная двухколоночная композиция'},
{id:'catalog',name:'Catalog',desc:'Компактный каталог услуг и цен'},
{id:'magazine',name:'Magazine',desc:'Смелая журнальная типографика'},
{id:'glass',name:'Glass',desc:'Полупрозрачные слои и мягкая глубина'},
{id:'brutal',name:'Brutal Grid',desc:'Графичный, дерзкий, контрастный стиль'},
{id:'compact',name:'App Compact',desc:'Плотный интерфейс в стиле нативного приложения'}
];
const OPEN_FONTS=[
['Manrope','Manrope, Inter, Arial, sans-serif'],['DM Sans','DM Sans, Inter, Arial, sans-serif'],['Space Grotesk','Space Grotesk, Inter, Arial, sans-serif'],['Onest','Onest, Inter, Arial, sans-serif'],['Unbounded','Unbounded, Arial, sans-serif'],['Syne','Syne, Arial, sans-serif'],['Playfair','Playfair Display, Georgia, serif'],['Cormorant','Cormorant Garamond, Georgia, serif'],['Bodoni','Bodoni Moda, Didot, Georgia, serif'],['Libre Baskerville','Libre Baskerville, Georgia, serif'],['IBM Plex','IBM Plex Sans, Arial, sans-serif'],['IBM Plex Mono','IBM Plex Mono, Courier New, monospace']
];
if(typeof FONTS!=='undefined')OPEN_FONTS.forEach(f=>{if(!FONTS.some(x=>x[0]===f[0]))FONTS.push(f)});
const FAMILY_BY_THEME=i=>i>=40?'bold':i>=35?'food':i>=30?'medical':i>=25?'auto':i>=20?'beauty':i>=15?'product':i>=10?'luxury':i===0||i===6?'dark':i===3||i===8?'calm':'minimal';
const FAMILY_NAMES={all:'Все',top:'ТОП для ниши',luxury:'Luxury',minimal:'Minimal',product:'Product',beauty:'Beauty',auto:'Auto',medical:'Medical',food:'Food',bold:'Bold',dark:'Dark',calm:'Calm'};
const DEFAULT_LAYOUT={
'Барбершоп':'editorial','Салон красоты':'editorial','Маникюр':'bento','Брови и ресницы':'editorial','Массаж':'minimal','Косметология':'minimal',
'Стоматология':'minimal','Клиника':'minimal','Психолог':'minimal','Остеопат':'minimal',
'Детейлинг':'immersive','Автосервис':'catalog','Шиномонтаж':'catalog','Автомойка':'compact','Тюнинг-ателье':'immersive',
'Ресторан':'magazine','Кафе':'editorial','Кондитерская':'bento','Доставка еды':'compact',
'Фитнес-клуб':'immersive','Йога-студия':'editorial','Персональный тренер':'immersive','Танцевальная студия':'bento',
'Клининг':'catalog','Ремонт квартир':'split','Дизайн интерьера':'editorial','Мебель на заказ':'editorial',
'Онлайн-школа':'bento','Репетитор':'minimal','Языковая школа':'bento','Автошкола':'catalog',
'Груминг':'bento','Ветклиника':'minimal','Передержка':'bento','Фотограф':'magazine','Видеограф':'immersive',
'Юрист':'editorial','Бухгалтер':'minimal','Маркетинговое агентство':'brutal','IT-студия':'bento','Риелтор':'editorial','Аренда апартаментов':'immersive'
};
if(typeof st!=='undefined'&&!st.layout)st.layout=DEFAULT_LAYOUT[st.biz]||'minimal';
const oldNormalize=typeof normalizeProject==='function'?normalizeProject:null;
if(oldNormalize)normalizeProject=function(p={}){const n=oldNormalize(p);n.layout=p.layout||n.layout||DEFAULT_LAYOUT[n.biz]||'minimal';return n};
const oldClient=typeof clientMarkup==='function'?clientMarkup:null;
if(oldClient)clientMarkup=function(input,interactive=true){const raw=input||{},p=normalizeProject(raw),layout=raw.layout||p.layout||DEFAULT_LAYOUT[p.biz]||'minimal';let html=oldClient({...p,layout},interactive);html=html.replace(/class="public([^\"]*)"/,`class="public$1 layout-${layout}"`);return html};
function refreshPreview(){
 try{if(typeof st==='undefined'||typeof clientMarkup!=='function')return;const html=clientMarkup(st,false);const live=document.getElementById('livePreview');if(live)live.innerHTML=html;const mobile=document.getElementById('mobileLive');if(mobile)mobile.innerHTML=html;const review=document.getElementById('reviewPreview');if(review&&document.getElementById('s6')?.classList.contains('on'))review.innerHTML=html}catch(e){console.warn('CLIENTA design preview refresh',e)}
}
function setLayout(id,user=true){if(typeof st==='undefined'||!LAYOUTS.some(x=>x.id===id))return;st.layout=id;if(user)st.layoutManual=true;document.querySelectorAll('.layoutChoice').forEach(x=>x.classList.toggle('on',x.dataset.layout===id));refreshPreview()}
function themeIsTop(el){return el.classList.contains('industryTop')}
function decorateThemes(){const themes=document.getElementById('themes');if(!themes)return;[...themes.querySelectorAll('.theme')].forEach((el,i)=>{el.dataset.family=FAMILY_BY_THEME(i);if(!el.querySelector('.themeFamily')){const b=document.createElement('span');b.className='themeFamily';b.textContent=FAMILY_NAMES[el.dataset.family]||el.dataset.family;el.appendChild(b)}})}
function applyFilter(kind){document.querySelectorAll('.styleFilter button').forEach(b=>b.classList.toggle('on',b.dataset.filter===kind));document.querySelectorAll('#themes .theme').forEach(el=>{const show=kind==='all'||(kind==='top'&&themeIsTop(el))||el.dataset.family===kind;el.classList.toggle('isFiltered',!show)})}
function buildControls(){
 const themes=document.getElementById('themes');if(!themes||document.getElementById('layoutPicker'))return;
 const filters=document.createElement('div');filters.className='styleFilter';filters.id='styleFilter';['all','top','luxury','minimal','product','beauty','auto','medical','food','bold','dark'].forEach(k=>{const b=document.createElement('button');b.type='button';b.dataset.filter=k;b.textContent=FAMILY_NAMES[k];if(k==='all')b.classList.add('on');b.onclick=()=>applyFilter(k);filters.appendChild(b)});themes.parentNode.insertBefore(filters,themes);
 const label=document.createElement('div');label.className='label';label.textContent='Композиция';const picker=document.createElement('div');picker.className='layoutPicker';picker.id='layoutPicker';LAYOUTS.forEach(x=>{const b=document.createElement('button');b.type='button';b.className='layoutChoice';b.dataset.layout=x.id;b.innerHTML=`<b>${x.name}</b><small>${x.desc}</small><span class="miniLayout"><i></i><i></i></span>`;b.onclick=()=>setLayout(x.id,true);picker.appendChild(b)});themes.insertAdjacentElement('afterend',label);label.insertAdjacentElement('afterend',picker);
 decorateThemes();setLayout(st.layout||DEFAULT_LAYOUT[st.biz]||'minimal',false)
}
function industryChanged(){if(typeof st==='undefined')return;if(!st.layoutManual)st.layout=DEFAULT_LAYOUT[st.biz]||'minimal';setTimeout(()=>{buildControls();decorateThemes();setLayout(st.layout,false);applyFilter('top')},40)}
['heroCreate','newBtn','smartStart'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(()=>{buildControls();decorateThemes()},60)));
document.getElementById('bizGrid')?.addEventListener('click',e=>{if(e.target.closest('[data-biz],.biz'))setTimeout(industryChanged,30)});
document.getElementById('themes')?.addEventListener('click',()=>setTimeout(()=>{decorateThemes();refreshPreview()},0));
const observer=new MutationObserver(()=>{if(document.getElementById('s2')?.classList.contains('on')){buildControls();decorateThemes()}});observer.observe(document.getElementById('builder')||document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});
window.CLIENTA_LAYOUTS=LAYOUTS;window.CLIENTA_DESIGN_V2={layouts:LAYOUTS.length,themeFamilies:Object.keys(FAMILY_NAMES).length,fonts:OPEN_FONTS.length};
})();