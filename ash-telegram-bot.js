import http from 'node:http';

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const PORT = Number(process.env.PORT || 10000);
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://ash-styling22-demo.onrender.com';
const ADMIN_URL = process.env.ADMIN_URL || 'https://ash-styling22-demo.onrender.com/admin.html';
const BASE_URL = process.env.BOT_WEBHOOK_URL || 'https://ash-styling22-bot.onrender.com';
const ADMIN_ID = Number(process.env.ADMIN_ID || 8558599621);
const ADMIN_USERNAME = String(process.env.ADMIN_USERNAME || 'eockdbshxj').toLowerCase();
const SET_PROFILE_PHOTO = process.env.SET_PROFILE_PHOTO !== '0';
const API = TOKEN ? `https://api.telegram.org/bot${TOKEN}` : '';

const AVATAR_B64 = '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';

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

async function setProfilePhoto() {
  if (!TOKEN || !SET_PROFILE_PHOTO) return;
  const bytes = Buffer.from(AVATAR_B64, 'base64');
  const form = new FormData();
  form.append('photo', JSON.stringify({type:'static',photo:'attach://avatar'}));
  form.append('avatar', new Blob([bytes], {type:'image/jpeg'}), 'ash-styling22.jpg');
  const r = await fetch(`${API}/setMyProfilePhoto`, {method:'POST',body:form});
  const d = await r.json();
  if (!d.ok) throw new Error(`setMyProfilePhoto: ${JSON.stringify(d)}`);
  console.log('setMyProfilePhoto ok');
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
  try {
    const me = await tg('getMe');
    console.log(`Telegram bot connected: @${me.username || 'unknown'} (${me.id})`);
  } catch (e) {
    console.error('getMe failed:', e.message);
  }

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

  try { await setProfilePhoto(); } catch (e) { console.error(e.message); }
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
