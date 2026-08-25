/* CLIENTA QA pass 3: complete business presets, real contact actions and iPhone hardening. */
const EXTRA_BUSINESS_PRESETS={
  'Автомойка':{cta:'Выбрать мойку',services:[['Экспресс-мойка','30 минут','от 1 200 ₽'],['Комплексная мойка','60 минут','от 2 500 ₽'],['Химчистка салона','4 часа','от 9 000 ₽']]},
  'Тюнинг-ателье':{cta:'Оставить заявку на тюнинг',services:[['Консультация по проекту','45 минут','0 ₽'],['Дооснащение','по проекту','от 15 000 ₽'],['Шумоизоляция','1 день','от 35 000 ₽']]},
  'Салон красоты':{cta:'Выбрать мастера и время',services:[['Стрижка и укладка','90 минут','от 3 500 ₽'],['Окрашивание','3 часа','от 8 000 ₽'],['Уход для волос','60 минут','от 3 000 ₽']]},
  'Брови и ресницы':{cta:'Выбрать мастера',services:[['Коррекция + окрашивание бровей','60 минут','2 200 ₽'],['Ламинирование бровей','60 минут','2 800 ₽'],['Ламинирование ресниц','75 минут','3 200 ₽']]},
  'Массаж':{cta:'Выбрать сеанс',services:[['Классический массаж','60 минут','3 500 ₽'],['Спортивный массаж','60 минут','4 000 ₽'],['Абонемент 5 сеансов','5 посещений','16 000 ₽']]},
  'Косметология':{cta:'Записаться на консультацию',services:[['Консультация косметолога','45 минут','2 000 ₽'],['Чистка лица','90 минут','от 4 500 ₽'],['Уходовая процедура','60 минут','от 5 000 ₽']]},
  'Клиника':{cta:'Выбрать врача и время',services:[['Первичная консультация','45 минут','от 2 500 ₽'],['Повторный приём','30 минут','от 1 800 ₽'],['Диагностика','60 минут','от 3 500 ₽']]},
  'Остеопат':{cta:'Выбрать время приёма',services:[['Первичный приём','60 минут','5 000 ₽'],['Повторный приём','60 минут','4 500 ₽'],['Курс 5 приёмов','5 посещений','21 000 ₽']]},
  'Персональный тренер':{cta:'Записаться на тренировку',services:[['Пробная тренировка','60 минут','1 000 ₽'],['Персональная тренировка','60 минут','3 000 ₽'],['Пакет 8 тренировок','8 занятий','21 000 ₽']]},
  'Танцевальная студия':{cta:'Выбрать занятие',services:[['Пробное занятие','60 минут','500 ₽'],['Разовое занятие','60 минут','1 200 ₽'],['Абонемент 8 занятий','30 дней','7 900 ₽']]},
  'Кафе':{cta:'Забронировать стол',services:[['Стол на двоих','вечер','0 ₽'],['Стол на компанию','вечер','0 ₽'],['Предзаказ десерта','к визиту','от 900 ₽']]},
  'Кондитерская':{cta:'Оформить заказ',services:[['Торт на заказ','от 2 кг','от 4 500 ₽'],['Набор капкейков','6 штук','2 200 ₽'],['Десертный бокс','набор','2 900 ₽']]},
  'Доставка еды':{cta:'Перейти к заказу',services:[['Комбо на одного','30–60 минут','от 790 ₽'],['Семейный сет','30–60 минут','от 2 490 ₽'],['Корпоративный заказ','по времени','по запросу']]},
  'Ремонт квартир':{cta:'Получить расчёт',services:[['Замер и консультация','60 минут','0 ₽'],['Косметический ремонт','по площади','от 8 000 ₽/м²'],['Ремонт под ключ','по площади','от 18 000 ₽/м²']]},
  'Дизайн интерьера':{cta:'Обсудить проект',services:[['Консультация','60 минут','5 000 ₽'],['Планировочное решение','до 80 м²','от 35 000 ₽'],['Дизайн-проект','по площади','от 3 500 ₽/м²']]},
  'Мебель на заказ':{cta:'Рассчитать стоимость',services:[['Замер','60 минут','0 ₽'],['Кухня на заказ','по проекту','от 180 000 ₽'],['Шкаф на заказ','по проекту','от 90 000 ₽']]},
  'Онлайн-школа':{cta:'Выбрать программу',services:[['Пробный урок','45 минут','0 ₽'],['Месячная программа','4 недели','от 9 900 ₽'],['Индивидуальный разбор','60 минут','3 500 ₽']]},
  'Языковая школа':{cta:'Записаться на тестирование',services:[['Определение уровня','30 минут','0 ₽'],['Индивидуальный урок','60 минут','2 500 ₽'],['Группа','90 минут','1 300 ₽']]},
  'Автошкола':{cta:'Записаться на обучение',services:[['Консультация','30 минут','0 ₽'],['Теория','полный курс','от 19 900 ₽'],['Практика','1 занятие','от 1 800 ₽']]},
  'Ветклиника':{cta:'Записать питомца',services:[['Первичный приём','45 минут','2 000 ₽'],['Вакцинация','30 минут','от 2 500 ₽'],['Диагностика','60 минут','от 3 000 ₽']]},
  'Передержка':{cta:'Проверить места',services:[['Передержка собаки','1 сутки','от 1 500 ₽'],['Передержка кошки','1 сутки','от 1 200 ₽'],['Дополнительный уход','1 сутки','от 500 ₽']]},
  'Видеограф':{cta:'Проверить дату',services:[['Контент-съёмка','2 часа','15 000 ₽'],['Событие','5 часов','от 35 000 ₽'],['Монтаж ролика','до 60 сек','от 8 000 ₽']]},
  'Юрист':{cta:'Записаться на консультацию',services:[['Первичная консультация','45 минут','3 500 ₽'],['Анализ документов','до 20 страниц','от 5 000 ₽'],['Сопровождение дела','по проекту','от 30 000 ₽']]},
  'Бухгалтер':{cta:'Обсудить задачу',services:[['Консультация','45 минут','3 000 ₽'],['Ведение ИП','1 месяц','от 8 000 ₽'],['Ведение ООО','1 месяц','от 15 000 ₽']]},
  'Маркетинговое агентство':{cta:'Заполнить бриф',services:[['Стратегическая сессия','60 минут','7 500 ₽'],['Аудит маркетинга','5 дней','от 25 000 ₽'],['Ведение проекта','1 месяц','от 70 000 ₽']]},
  'IT-студия':{cta:'Обсудить проект',services:[['Discovery-созвон','45 минут','0 ₽'],['Mini App','под ключ','от 50 000 ₽'],['Web-сервис','под ключ','от 90 000 ₽']]},
  'Риелтор':{cta:'Записаться на просмотр',services:[['Консультация','30 минут','0 ₽'],['Подбор объекта','по запросу','по договору'],['Просмотр объекта','по записи','0 ₽']]},
  'Свой вариант':{cta:'Связаться',services:[['Основная услуга','60 минут','по запросу'],['Консультация','30 минут','по запросу']]}
};
Object.assign(BUSINESS_PRESETS,EXTRA_BUSINESS_PRESETS);

function clientaContactHref(value){
  const v=String(value||'').trim();
  if(!v)return'';
  if(/^@[A-Za-z0-9_.]{3,}$/.test(v))return `https://t.me/${v.slice(1)}`;
  if(/^https?:\/\//i.test(v))return v;
  if(/^t\.me\//i.test(v)||/^wa\.me\//i.test(v))return `https://${v}`;
  if(/^\S+@\S+\.\S+$/.test(v))return `mailto:${v}`;
  const digits=v.replace(/[^\d+]/g,'');
  if(/^\+?\d{7,}$/.test(digits))return `tel:${digits}`;
  return'';
}
window.clientaContactHref=clientaContactHref;

const _openFeatureQa3=openFeature;
openFeature=function(p,type){
  p=normalizeProject(p);
  if(type!=='contact')return _openFeatureQa3(p,type);
  const contact=String(p.contact||'').trim();
  const href=clientaContactHref(contact);
  const action=href
    ?`<a class="publicBtn" href="${esc(href)}" ${/^https?:/i.test(href)?'target="_blank" rel="noopener"':''} style="margin-top:12px;background:var(--pac);color:var(--pact);display:grid;place-items:center;text-decoration:none">Открыть контакт</a>`
    :'<div class="statusLine">Владелец ещё не добавил рабочий контакт.</div>';
  openSheet(p,'Связаться',contact?`Контакт: ${esc(contact)}`:'Контакт не указан',action);
};
window.openFeature=openFeature;

(function qa3MobilePolish(){
  const style=document.createElement('style');
  style.textContent=`
    @media(max-width:430px){
      .quickGrid,.featureGrid{grid-template-columns:1fr}
      .quick,.featureButton,.service{min-height:58px}
      .publicHero{padding:18px;border-radius:20px}
      .publicHero h1{font-size:34px}
      .maxDash{gap:6px}
      .dash{padding:10px}
      .dash b{font-size:14px}
      .channelChoice,.mod,.biz,.fontChoice{min-height:82px}
      .reviewGrid{grid-template-columns:1fr}
    }
  `;
  document.head.appendChild(style);
})();

const _qaQa3=qa;
qa=function(){
  const r=_qaQa3(),errors=[...r.errors];
  const missingPresets=BUSINESSES.map(x=>x[1]).filter(x=>!BUSINESS_PRESETS[x]);
  if(missingPresets.length)errors.push('business-preset-coverage:'+missingPresets.join(','));
  if(!businessPreset('IT-студия','Услуги').services.some(s=>s[0]==='Mini App'))errors.push('business-preset-it');
  if(!businessPreset('Ветклиника','Питомцы').services.some(s=>s[0].includes('Вакцинация')))errors.push('business-preset-vet');
  if(businessPreset('Кафе','Еда').cta!=='Забронировать стол')errors.push('business-cta-cafe');
  const contacts=[['@clienta_demo','https://t.me/clienta_demo'],['+7 999 123-45-67','tel:+79991234567'],['hello@example.com','mailto:hello@example.com'],['https://example.com','https://example.com']];
  contacts.forEach(([input,expected])=>{if(clientaContactHref(input)!==expected)errors.push('contact-link:'+input)});
  const max=normalizeProject({name:'MAX QA',biz:'IT-студия',bizCat:'Услуги',pack:'max',mods:[...PACKS.max],services:businessPreset('IT-студия','Услуги').services,schedule:'10:00–20:00',contact:'@clienta_demo',channels:['Web']});
  const html=clientMarkup(max,false);
  for(const ownerName of MODULES.filter(m=>m[1]==='owner').map(m=>m[0]))if(html.includes(ownerName))errors.push('owner-leak:'+ownerName);
  window.CLIENTA_QA={...r,ok:errors.length===0,errors,patch:'2026-08-25h',presetCoverage:BUSINESSES.length};
  return window.CLIENTA_QA;
};
window.qa=qa;
const qa3=qa();
if(!qa3.ok)console.warn('CLIENTA QA3 failed',qa3.errors);
