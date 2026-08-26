/* CLIENTA QA pass 13: premium design library + industry-aware recommendations. */
(function clientaPremiumTemplates(){
const NEW_THEMES=[
{name:'Obsidian Luxe',bg:'#090909',card:'#151515',txt:'#f7f4ee',mut:'#99958f',ac:'#c9a76a',act:'#090909',btn:'#f7f4ee',bt:'#090909',line:'#2a2722'},
{name:'Editorial Ivory',bg:'#f5f0e7',card:'#fbf8f2',txt:'#17120f',mut:'#7c7269',ac:'#17120f',act:'#fff',btn:'#17120f',bt:'#fff',line:'#cfc5b8'},
{name:'Pearl',bg:'#f9f7f5',card:'#fff',txt:'#2a2322',mut:'#8b7e7a',ac:'#c69ea5',act:'#fff',btn:'#2a2322',bt:'#fff',line:'#eadfdd'},
{name:'Noir Editorial',bg:'#0d0d0e',card:'#161618',txt:'#f4f1ea',mut:'#8d8d92',ac:'#f4f1ea',act:'#111',btn:'#f4f1ea',bt:'#111',line:'#2a2a2e'},
{name:'Champagne',bg:'#f6f0e5',card:'#fffaf0',txt:'#2a2119',mut:'#8a7868',ac:'#a77846',act:'#fff',btn:'#2a2119',bt:'#fff',line:'#e2d4c2'},
{name:'Neo Blue',bg:'#f5f8ff',card:'#fff',txt:'#15213a',mut:'#74809b',ac:'#4f6cff',act:'#fff',btn:'#15213a',bt:'#fff',line:'#dfe5f4'},
{name:'Neo Lime',bg:'#f7f9ef',card:'#fff',txt:'#191c12',mut:'#798065',ac:'#b7e84a',act:'#10130b',btn:'#191c12',bt:'#fff',line:'#e2e7d2'},
{name:'Cloud',bg:'#f4f6f8',card:'#fff',txt:'#1f2937',mut:'#7c8795',ac:'#111827',act:'#fff',btn:'#111827',bt:'#fff',line:'#e4e8ed'},
{name:'Pill UI',bg:'#f6f7fb',card:'#fff',txt:'#1e2430',mut:'#7f8795',ac:'#5367ff',act:'#fff',btn:'#1e2430',bt:'#fff',line:'#e2e6ef'},
{name:'Midnight Gradient',bg:'#0b0d12',card:'#151922',txt:'#f5f7fa',mut:'#8992a3',ac:'#4965ff',act:'#fff',btn:'#f5f7fa',bt:'#111',line:'#252b38'},
{name:'Blush Studio',bg:'#fbf4f5',card:'#fff',txt:'#3f2f34',mut:'#9a7f87',ac:'#d692a3',act:'#fff',btn:'#3f2f34',bt:'#fff',line:'#eedee2'},
{name:'Milk Rose',bg:'#fffaf9',card:'#fff',txt:'#37272b',mut:'#9f868c',ac:'#efb3bd',act:'#3b2025',btn:'#3b2025',bt:'#fff',line:'#f0e3e5'},
{name:'Lavender Air',bg:'#f7f4fd',card:'#fff',txt:'#342d46',mut:'#8a829b',ac:'#8b6ed6',act:'#fff',btn:'#342d46',bt:'#fff',line:'#e8e1f2'},
{name:'Beauty Editorial',bg:'#f4eee9',card:'#fbf8f5',txt:'#3b2d27',mut:'#8d7c74',ac:'#6e4e3d',act:'#fff',btn:'#3b2d27',bt:'#fff',line:'#dfd1c9'},
{name:'Soft Mono',bg:'#f7f7f5',card:'#fff',txt:'#20201e',mut:'#84847f',ac:'#242421',act:'#fff',btn:'#242421',bt:'#fff',line:'#e3e3de'},
{name:'Track Black',bg:'#08090b',card:'#13161a',txt:'#f5f7f9',mut:'#8a929c',ac:'#e9ff3f',act:'#08090b',btn:'#f5f7f9',bt:'#0b0d0f',line:'#2a3037'},
{name:'Carbon',bg:'#101215',card:'#1b1e22',txt:'#eef1f4',mut:'#959ca5',ac:'#d6d9dc',act:'#111',btn:'#eef1f4',bt:'#111',line:'#30343a'},
{name:'Electric',bg:'#071018',card:'#101c26',txt:'#edf7ff',mut:'#86a0b3',ac:'#22c7ff',act:'#021018',btn:'#edf7ff',bt:'#071018',line:'#203544'},
{name:'Titanium',bg:'#e9edf0',card:'#f7f9fa',txt:'#182028',mut:'#717b84',ac:'#273746',act:'#fff',btn:'#182028',bt:'#fff',line:'#d4dadd'},
{name:'Racing Red',bg:'#0c0c0d',card:'#171719',txt:'#f7f7f7',mut:'#929296',ac:'#ef3340',act:'#fff',btn:'#f7f7f7',bt:'#111',line:'#303034'},
{name:'Clinic White',bg:'#f7fbfc',card:'#fff',txt:'#17323b',mut:'#71858c',ac:'#1d8ea8',act:'#fff',btn:'#17323b',bt:'#fff',line:'#dcecee'},
{name:'Calm Blue',bg:'#f4f8ff',card:'#fff',txt:'#1c2c46',mut:'#75859d',ac:'#4776e6',act:'#fff',btn:'#1c2c46',bt:'#fff',line:'#dfe7f5'},
{name:'Mint Care',bg:'#f3faf7',card:'#fff',txt:'#17372c',mut:'#718a80',ac:'#3aa982',act:'#fff',btn:'#17372c',bt:'#fff',line:'#d9ebe4'},
{name:'Dental Pearl',bg:'#f9fbff',card:'#fff',txt:'#1c2b43',mut:'#7d8ca3',ac:'#6d8cff',act:'#fff',btn:'#1c2b43',bt:'#fff',line:'#e2e8f4'},
{name:'Clinical Mono',bg:'#fff',card:'#fbfbfb',txt:'#151719',mut:'#74787c',ac:'#151719',act:'#fff',btn:'#151719',bt:'#fff',line:'#e5e5e5'},
{name:'Bistro',bg:'#f6efe5',card:'#fffaf4',txt:'#30251d',mut:'#8c7868',ac:'#8b4f32',act:'#fff',btn:'#30251d',bt:'#fff',line:'#e5d6c7'},
{name:'Olive Table',bg:'#f4f3e8',card:'#fbfaf3',txt:'#2d3020',mut:'#7f8068',ac:'#626b3d',act:'#fff',btn:'#2d3020',bt:'#fff',line:'#dedfcb'},
{name:'Wine Room',bg:'#170d11',card:'#24161b',txt:'#f5ece8',mut:'#a68e92',ac:'#a8475f',act:'#fff',btn:'#f5ece8',bt:'#170d11',line:'#3a262d'},
{name:'Café Cream',bg:'#f8f3ec',card:'#fffdf9',txt:'#33261d',mut:'#8c7c70',ac:'#bf8557',act:'#fff',btn:'#33261d',bt:'#fff',line:'#e8dbcf'},
{name:'Sushi Dark',bg:'#0d0d0d',card:'#181818',txt:'#f6f2eb',mut:'#969088',ac:'#d24a3a',act:'#fff',btn:'#f6f2eb',bt:'#111',line:'#2b2927'},
{name:'Brutalist',bg:'#f2ff45',card:'#fff',txt:'#111',mut:'#444',ac:'#111',act:'#f2ff45',btn:'#111',bt:'#fff',line:'#111'},
{name:'Creative Violet',bg:'#171020',card:'#24182f',txt:'#fbf7ff',mut:'#a28dad',ac:'#9f67ff',act:'#fff',btn:'#fbf7ff',bt:'#171020',line:'#3d2b4d'},
{name:'Sunset',bg:'#fff5f0',card:'#fff',txt:'#3b2625',mut:'#9a7d77',ac:'#ff6f61',act:'#fff',btn:'#3b2625',bt:'#fff',line:'#f1ddd8'},
{name:'Orbital',bg:'#0c1020',card:'#151a2e',txt:'#f4f6ff',mut:'#8890af',ac:'#6b7cff',act:'#fff',btn:'#f4f6ff',bt:'#0c1020',line:'#29304d'},
{name:'Swiss',bg:'#fff',card:'#f7f7f7',txt:'#111',mut:'#777',ac:'#ff3b30',act:'#fff',btn:'#111',bt:'#fff',line:'#d9d9d9'}
];
const FONT_ADD=[['Neo','Inter, Arial, sans-serif'],['Luxury','Didot, Bodoni MT, Georgia, serif'],['Editorial Pro','Iowan Old Style, Baskerville, Georgia, serif'],['Modern','Avenir Next, Avenir, Helvetica, Arial, sans-serif'],['Grotesk','Arial Narrow, Helvetica Neue, Arial, sans-serif'],['Soft','Trebuchet MS, Avenir, sans-serif'],['Swiss','Helvetica Neue, Helvetica, Arial, sans-serif']];
if(typeof THEMES!=='undefined')NEW_THEMES.forEach(t=>THEMES.push({n:t.name,...t}));
if(typeof FONTS!=='undefined')FONT_ADD.forEach(f=>FONTS.push(f));
const RECO={
'Барбершоп':[10,13,15,16,19,25,26,29,40,44],'Салон красоты':[12,20,21,22,23,24,14,10,33,41],'Маникюр':[20,21,22,23,12,14,7,24,41,43],'Брови и ресницы':[20,21,22,23,24,12,14,41,43,11],'Массаж':[12,20,21,23,24,3,5,33,36,43],'Косметология':[20,21,23,24,30,31,33,12,14,43],
'Стоматология':[30,31,32,33,34,8,15,17,24,9],'Клиника':[30,31,32,33,34,8,15,17,24,9],'Психолог':[12,17,20,21,24,30,33,36,43,14],'Остеопат':[30,33,24,12,17,21,34,15,3,43],
'Детейлинг':[25,26,27,28,29,15,16,19,6,10],'Автосервис':[25,26,27,28,29,16,19,6,15,40],'Шиномонтаж':[25,26,27,28,29,16,19,40,44,6],'Автомойка':[25,26,28,29,15,17,18,8,5,3],'Тюнинг-ателье':[25,26,27,28,29,19,40,42,44,10],
'Ресторан':[35,36,37,38,39,10,11,13,27,29],'Кафе':[35,36,38,39,5,12,17,20,28,43],'Кондитерская':[20,21,22,23,35,36,38,41,43,12],'Доставка еды':[15,17,18,19,35,36,40,42,43,44],
'Фитнес-клуб':[15,16,17,19,25,26,27,40,42,44],'Йога-студия':[12,17,20,21,23,24,33,36,43,3],'Персональный тренер':[15,16,19,25,26,27,40,42,44,6],'Танцевальная студия':[17,20,21,22,41,42,43,12,15,19],
'Клининг':[15,17,18,24,30,31,34,8,9,43],'Ремонт квартир':[15,16,17,25,27,32,34,40,44,9],'Дизайн интерьера':[10,11,12,13,14,17,24,37,41,44],'Мебель на заказ':[10,11,13,14,17,24,35,37,38,44],
'Онлайн-школа':[15,17,18,19,31,33,40,42,43,44],'Репетитор':[15,17,18,20,21,31,33,43,12,9],'Языковая школа':[15,17,18,19,31,33,40,42,43,8],'Автошкола':[15,16,17,19,25,31,40,44,8,9],
'Груминг':[20,21,22,23,17,18,33,36,41,43],'Ветклиника':[30,31,33,20,21,17,8,3,43,24],'Передержка':[17,20,21,22,33,36,38,43,3,5],
'Фотограф':[10,11,12,13,14,17,27,37,41,44],'Видеограф':[10,13,15,19,25,26,27,28,40,44],'Юрист':[10,11,13,24,30,34,37,44,9,6],'Бухгалтер':[15,17,24,30,31,32,34,9,8,6],'Маркетинговое агентство':[15,17,19,40,41,42,43,44,10,13],'IT-студия':[15,16,17,19,26,28,40,42,44,6],
'Риелтор':[10,12,13,15,17,24,30,35,37,44],'Аренда апартаментов':[10,12,13,17,20,35,36,38,39,43]
};
const oldClient=typeof clientMarkup==='function'?clientMarkup:null;
if(oldClient)clientMarkup=function(input,interactive=true){const p=normalizeProject(input);let html=oldClient(p,interactive);html=html.replace('class="public"',`class="public design-${p.theme}"`);return html};
function renderRecommended(){
 const box=document.getElementById('themes');if(!box||typeof st==='undefined')return;
 const list=RECO[st.biz]||[];if(!list.length)return;
 box.querySelectorAll('.theme').forEach((el,i)=>{el.classList.toggle('industryTop',list.includes(i));if(list.includes(i)&&!el.querySelector('.industryTag')){const s=document.createElement('span');s.className='industryTag';s.textContent='ТОП ДЛЯ НИШИ';el.appendChild(s)}});
}
const style=document.createElement('style');style.textContent='.theme{min-height:142px;transition:.18s transform,.18s box-shadow}.theme:hover{transform:translateY(-2px)}.theme.industryTop{box-shadow:inset 0 0 0 2px #111}.industryTag{position:absolute;right:8px;top:8px;font:800 8px/1 Arial,sans-serif;letter-spacing:.08em;background:#111;color:#fff;border-radius:999px;padding:6px 7px}.themes{grid-template-columns:repeat(3,minmax(0,1fr))}@media(max-width:680px){.themes{grid-template-columns:repeat(2,minmax(0,1fr))}.theme{min-height:128px}}';document.head.appendChild(style);
['heroCreate','newBtn','smartStart'].forEach(id=>document.getElementById(id)?.addEventListener('click',()=>setTimeout(renderRecommended,30)));
document.getElementById('bizGrid')?.addEventListener('click',e=>{const b=e.target.closest('[data-biz]');if(!b)return;setTimeout(()=>{const list=RECO[st.biz]||[];if(list.length&&st.step===1){st.theme=list[0];if(typeof renderPreview==='function')renderPreview()}renderRecommended()},20)});
const mo=new MutationObserver(()=>{if(document.getElementById('s2')?.classList.contains('on'))renderRecommended()});mo.observe(document.getElementById('builder')||document.body,{subtree:true,attributes:true,attributeFilter:['class']});
window.CLIENTA_DESIGN_LIBRARY={themes:typeof THEMES!=='undefined'?THEMES.length:0,recommendations:RECO,added:NEW_THEMES.length};
})();