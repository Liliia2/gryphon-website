# Налаштування приймача заявок (Telegram + Google Sheet)

Форма лендингу шле заявку в **один** Google Apps Script, який пише рядок у таблицю
і одночасно надсилає повідомлення в Telegram. Токен бота лишається в скрипті (на сервері Google),
у код сторінки не потрапляє.

Скрипт: `google-apps-script.gs` (поряд із цим файлом).

## Кроки (потрібен твій логін — роблю не я)

### 1. Google-таблиця
1. Відкрий таблицю з заявками: `1uLfIVEBWJ1balWa6Z7bY8nKa-Le8lGxUITw3Kq5rDVI`.
2. У верхньому меню таблиці відкрий **Extensions / Розширення → Apps Script**.
3. Видали порожній код, встав весь вміст `google-apps-script.gs`.
4. Встав новий токен бота в рядок `var TELEGRAM_BOT_TOKEN = 'PASTE_BOT_TOKEN';` (лиши лапки).
5. Перевір, що `TELEGRAM_CHAT_ID = '-1003988229437'`, а `SHEET_NAME = 'Заявки лізинг'`.
6. Збережи (Ctrl+S).

> Ця версія навмисно прив'язана до самої таблиці. Так Google просить доступ тільки до поточного документа, а не до всіх таблиць акаунта.

### 2. Telegram-бот
1. У Telegram відкрий **@BotFather** → знайди свого бота → зроби `/revoke`, бо старий токен був засвічений.
2. BotFather дасть **новий токен** (рядок виду `1234567:AAExxxx`). Скопіюй його у `TELEGRAM_BOT_TOKEN`.
3. **chat_id:** напиши своєму боту будь-що (натисни Start). Потім відкрий у браузері:
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates`
   знайди `"chat":{"id":...}` — це число встав у `TELEGRAM_CHAT_ID`.
   *(Якщо заявки мають падати в групу — додай бота в групу і візьми id групи звідти ж, він зі знаком мінус.)*
4. Збережи скрипт (Ctrl+S).

### 3. Деплой як Web App
1. У редакторі Apps Script: **Deploy → New deployment**.
2. Тип: **Web app**. Execute as: **Me**. Who has access: **Anyone**.
3. **Deploy** → пройди авторизацію Google (підтверди доступ).
4. Скопіюй **Web app URL** (виду `https://script.google.com/macros/s/AAA.../exec`).

### Якщо знову буде "This app is blocked"
1. Перевір Advanced Protection: https://myaccount.google.com/security → знайди блок **Advanced Protection Program**.
2. Якщо там написано, що захист увімкнений, не витрачай час на OAuth: йдемо в Make.com або Zapier.
3. Якщо захист вимкнений, тоді налаштовуємо окремий Google Cloud project → OAuth consent screen → додаємо `konoplyovaliliia@gmail.com` як test user → прив'язуємо цей project до Apps Script.

### 4. Передай мені
- **Web app URL** — я вставлю його в лендинг (`LEAD_ENDPOINT` у `index.html`).
- **username бота або твій Telegram** — щоб замінити запасне посилання `https://t.me/CHANGE_ME`
  на екрані помилки форми.

## Перевірка
- Відкрий `https://.../exec` у браузері → має показати `{"ok":true,"status":"alive"}`.
- Відправ тестову заявку з лендингу → рядок з'явиться в листі «Заявки лізинг» і прийде повідомлення в Telegram.
- Вимкни інтернет і відправ → форма має показати екран «Не вдалося відправити» із запасними контактами
  (а не фейкове «дякуємо»).

## Безпека / нотатки
- Honeypot-поле `company_extra` відсіює простих ботів (і на сторінці, і в скрипті).
- При зміні коду скрипта — роби **Deploy → Manage deployments → Edit → New version**, інакше URL віддаватиме стару версію.
- Це рішення без бекенду, безкоштовне (ліміти Google Apps Script для лендингу з запасом достатні).
