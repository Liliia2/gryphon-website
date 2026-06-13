/**
 * Gryphon Group — приймач заявок з лендингу.
 * Один скрипт: пише заявку в Google Sheet + шле повідомлення в Telegram.
 *
 * Важливо: вставляй цей код у таблиці через Extensions → Apps Script.
 * Так скрипт бачить тільки поточну таблицю, а не всі файли акаунта.
 *
 * Розгортання: Deploy → New deployment → тип "Web app" →
 *   Execute as: Me, Who has access: Anyone. Скопіювати Web app URL.
 */

/**
 * @OnlyCurrentDoc
 */

// =================== НАЛАШТУВАННЯ ===================
var TELEGRAM_BOT_TOKEN = 'PASTE_BOT_TOKEN';   // токен від @BotFather
var TELEGRAM_CHAT_ID   = '-1003988229437';    // Telegram-група Gryphon Group
var SHEET_NAME         = 'Заявки лізинг';      // назва листа в таблиці
// ===================================================

function doPost(e){
  try{
    var p = (e && e.parameter) ? e.parameter : {};

    // honeypot: бот заповнив приховане поле → ігноруємо, але відповідаємо ok
    if(p.company_extra){ return json({ok:true}); }

    var row = {
      time:     new Date(),
      name:     p.name || '',
      phone:    p.phone || '',
      email:    p.email || '',
      car_type: p.car_type || '',
      status:   p.status || '',
      marketing:p.consent_marketing ? 'так' : '',
      source:   p.source || ''
    };

    saveToSheet(row);
    sendTelegram(row);

    return json({ok:true});
  }catch(err){
    return json({ok:false, error:String(err)});
  }
}

function doGet(){ return json({ok:true, status:'alive'}); }

function saveToSheet(r){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME);
  if(!sh){
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(["Час","Ім'я","Телефон","Email","Тип авто","Статус","Маркетинг","Джерело"]);
  }
  sh.appendRow([
    r.time,
    sheetText(r.name),
    sheetText(r.phone),
    sheetText(r.email),
    sheetText(r.car_type),
    sheetText(r.status),
    sheetText(r.marketing),
    sheetText(r.source)
  ]);
}

function sendTelegram(r){
  if(!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN.indexOf('PASTE_') === 0) return;
  var text =
    "🚗 Нова заявка — Gryphon Group\n\n" +
    "👤 Ім'я: " + r.name + "\n" +
    "📞 Телефон: " + r.phone + "\n" +
    "✉️ Email: " + r.email + "\n" +
    "🚙 Тип авто: " + r.car_type + "\n" +
    "🏷 Статус: " + r.status + "\n" +
    "📣 Маркетинг: " + (r.marketing || "ні") + "\n" +
    "🌐 Джерело: " + r.source;
  var url = 'https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage';
  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: { chat_id: TELEGRAM_CHAT_ID, text: text },
    muteHttpExceptions: true
  });
}

function json(obj){
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function sheetText(value){
  if(value === null || value === undefined || value === '') return '';
  return "'" + String(value);
}
