import http from 'node:http';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const PORT = Number(process.env.PORT || 10000);
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://ash-styling22-demo.onrender.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://ash-styling22-demo.onrender.com/admin.html';
const BASE_URL = process.env.BOT_WEBHOOK_URL || 'https://ash-styling22-bot.onrender.com';
const ADMIN_ID = Number(process.env.ADMIN_ID || 8558599621);
const ADMIN_USERNAME = String(process.env.ADMIN_USERNAME || 'eockdbshxj').toLowerCase();
const API = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : '';

function isAdmin(user={}) {
  return Number(user.id) === ADMIN_ID || String(user.username || '').toLowerCase() === ADMIN_USERNAME;
}

async function tg(method, body={}) {
  if (!TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is missing');
  const r = await fetch(`${API}/${method}`, {
    method: 'POST',
    headers: {'content-type':'application/json'},
    body: JSON.stringify(body)
  });
  const d = await r.json();
  if (!d.ok) throw new Error(`${method}: ${JSON.stringify(d)}`);
  return d.result;
}

function keyboard(user={}) {
  const rows = [
    [{text:'✨ Открыть ASH STYLING 22', web_app:{url:WEBAPP_URL}}],
    [
      {text:'💬 Связаться с ASH', url:'https://t.me/detailing_ash22'},
      {text:'📍 Мы на карте', url:'https://yandex.ru/maps/?text=ASH%20STYLING%2022%20%D0%92%D0%B0%D1%81%D0%B8%D0%BB%D0%B8%D1%8F%20%D0%9F%D0%B5%D1%82%D1%83%D1%88%D0%BA%D0%BE%D0%B2%D0%B0%203%D0%BA3%D1%811'}
    ]
  ];
  if (isAdmin(user)) rows.push([{text:'⚙️ Админ-панель', web_app:{url:ADMIN_URL}}]);
  return {inline_keyboard:rows};
}

function welcome(firstName='') {
  return `Добро пожаловать в ASH STYLING 22${firstName ? `, ${firstName}` : ''} 👋\n\nПрофессиональный детейлинг и стайлинг в Москве.\n\nВ мини-приложении можно выбрать услуги, приложить фото автомобиля, получить предварительный расчёт и оставить заявку на удобное время.\n\nНажмите «✨ Открыть ASH STYLING 22» ниже.`;
}

async function configureBot() {
  if (!TOKEN) return;
  const actions = [
    ['setMyName', {name:'ASH STYLING 22 | Детейлинг'}],
    ['setMyDescription', {description:'ASH STYLING 22 — профессиональный детейлинг и стайлинг в Москве. Оклейка, защита кузова, полировка, керамика и уход за салоном. Откройте мини-приложение для расчёта и записи.'}],
    ['setMyShortDescription', {short_description:'Детейлинг • стайлинг • оклейка • полировка • керамика. Расчёт и запись в Telegram.'}],
    ['setMyCommands', {commands:[
      {command:'start',description:'Главное меню'},
      {command:'app',description:'Открыть ASH STYLING 22'},
      {command:'menu',description:'Услуги и запись'}
    ]}],
    ['setChatMenuButton', {menu_button:{type:'web_app',text:'Открыть ASH',web_app:{url:WEBAPP_URL}}}],
    ['setWebhook', {url:`${BASE_URL.replace(/\/$/,'')}/telegram-webhook`,allowed_updates:['message']}]
  ];

  for (const [method, body] of actions) {
    try {
      await tg(method, body);
      console.log(`${method} ok`);
    } catch (e) {
      console.error(`${method} failed:`, e.message);
    }
  }
}

async function handleUpdate(update) {
  const m = update.message;
  if (!m?.chat?.id) return;
  const user = m.from || {};
  const text = String(m.text || '').trim();
  if (['/start','/app','/menu'].includes(text)) {
    return tg('sendMessage', {chat_id:m.chat.id,text:welcome(user.first_name||''),reply_markup:keyboard(user)});
  }
  if (text === '/admin') {
    if (!isAdmin(user)) return tg('sendMessage',{chat_id:m.chat.id,text:'Админ-панель доступна только владельцу.'});
    return tg('sendMessage',{chat_id:m.chat.id,text:'Панель управления ASH STYLING 22 👇',reply_markup:{inline_keyboard:[[{text:'⚙️ Открыть админку',web_app:{url:ADMIN_URL}}]]}});
  }
  return tg('sendMessage',{chat_id:m.chat.id,text:'Откройте ASH STYLING 22 кнопкой ниже 👇',reply_markup:keyboard(user)});
}

function json(res,status,data){
  res.writeHead(status,{'content-type':'application/json; charset=utf-8'});
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req,res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/health')) {
      return json(res,200,{ok:true,service:'ash-styling22-bot'});
    }
    if (req.method === 'POST' && url.pathname === '/telegram-webhook') {
      let raw='';
      for await (const chunk of req) raw += chunk;
      const update = JSON.parse(raw || '{}');
      await handleUpdate(update);
      return json(res,200,{ok:true});
    }
    return json(res,404,{error:'not found'});
  } catch (e) {
    console.error(e);
    return json(res,500,{error:'server error'});
  }
});

server.listen(PORT,'0.0.0.0',() => {
  console.log(`ASH STYLING 22 bot on ${PORT}`);
  configureBot().catch(console.error);
});
