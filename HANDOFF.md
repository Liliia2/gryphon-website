# HANDOFF — Gryphon Group лендинг (передача для Codex)

Дата: 13.06.2026. Користувач — **не програміст**, веди простою мовою, по кроках.

## Що це за проєкт
Лендинг лізингу авто (Польща) — один самодостатній файл `index.html` (CSS+JS усередині), фото в `assets/`.
Деталі й стабільні факти: див. `memory.md` і `plan.md` у цій же папці.

Готово й перевірено: дизайн, калькулятор (відкалібрований), політика приватності RODO, контакти.
**Залишився ОДИН блокер запуску — приймач заявок з форми.**

## Поточна задача (де застрягли)

Форма на сайті має слати заявки **в Telegram-групу + Google-таблицю**. Архітектура:
`форма (index.html) → Google Apps Script (Web App) → Google Sheet + Telegram Bot API`.

Код приймача готовий: `integrations/google-apps-script.gs` (інструкція `integrations/README-setup.md`).
У `index.html` змінна `LEAD_ENDPOINT` чекає URL задеплоєного Web App.

### 🔴 Проблема
Деплой Apps Script Web App **не проходить**: Google показує
**«This app is blocked — This app tried to access sensitive info in your Google Account.»**
(червоний трикутник, кнопки «Advanced/Додатково» НЕМАЄ).

Факти:
- Повторюється **і в інкогніто** з єдиним акаунтом → це блок **рівня акаунта**, не плутанина логінів.
- Акаунт — особистий Gmail `konoplyovaliliia@gmail.com`. Користувач є **власником** скрипта.
- Скоупи скрипта: `https://www.googleapis.com/auth/spreadsheets` (openById) +
  `https://www.googleapis.com/auth/script.external_request` (UrlFetch до api.telegram.org) — обидва «sensitive».
- Останній крок діагностики: перевіряли, чи ввімкнена **Advanced Protection Program** на `myaccount.google.com/security` (результат від користувача ще треба отримати).

### Гіпотези причини
1. **Advanced Protection Program** увімкнена на акаунті → жорстко блокує неперевірені скрипти. Тоді consent-фікс не допоможе.
2. Потрібно налаштувати **OAuth consent screen** у окремому GCP-проєкті + додати себе як **test user**, потім у Apps Script: ⚙ Project Settings → Google Cloud Platform (GCP) Project → Change project → номер цього GCP-проєкту → редеплой.

### Що зробити Codex
Обрати/реалізувати робочий шлях, щоб заявки гарантовано доходили в Telegram-групу + таблицю:
- Якщо Advanced Protection ВИМКНЕНА → провести користувача через налаштування OAuth consent screen (test user) і деплой Web App.
- Якщо УВІМКНЕНА (або шлях задовгий) → запропонувати простіший приймач без самописного Apps Script:
  Make.com / Zapier (webhook → Google Sheets + Telegram) або інший no-code варіант, який не впирається в цей блок.
- Після того як приймач працює: вставити робочий URL у `LEAD_ENDPOINT` в `index.html`, протестувати,
  **перевипустити токен бота** (засвічений у скриншоті) і замінити запасне TG-посилання `https://t.me/CHANGE_ME`.

## Конфіг, який уже є (НЕ секрети, окрім токена)
- Google Sheet ID: `1uLfIVEBWJ1balWa6Z7bY8nKa-Le8lGxUITw3Kq5rDVI`, лист `Заявки лізинг`.
- Telegram група chat_id: `-1003988229437` (працівники додані, бот — адмін групи).
- Bot token: вписаний у `google-apps-script.gs` рядок 8 на боці користувача. **Засвічений у скриншоті — перевипустити (`/revoke` у @BotFather).** У файли проєкту НЕ записувати.

## Ключові файли
- `index.html` — лендинг. Форма: `#leadForm`; змінна `LEAD_ENDPOINT` у `<script>`; honeypot `company_extra`; екрани `.form-success` / `.form-error`.
- `integrations/google-apps-script.gs` — код приймача (Sheet + Telegram).
- `integrations/README-setup.md` — покрокова інструкція налаштування.
- `memory.md`, `plan.md` — контекст і наступні дії.

## Як перевірити, що приймач працює
1. Відкрити `LEAD_ENDPOINT` (`...exec`) у браузері → має бути `{"ok":true,"status":"alive"}`.
2. Відправити тестову заявку з лендингу → рядок з'являється в листі «Заявки лізинг» І повідомлення приходить у Telegram-групу.
3. Вимкнути інтернет і відправити → форма показує екран «Не вдалося відправити» (а не фейкове «дякуємо»).
