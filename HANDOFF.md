# HANDOFF - Gryphon Group landing

Date: 13.06.2026. User is not a programmer; explain simply, step by step.

## Project

Landing page for auto leasing in Poland for foreigners and businesses.

- Main file: `index.html` (self-contained CSS + JS).
- Assets: `assets/`.
- Context and stable facts: `memory.md`.
- Next actions and checks: `plan.md`.
- Public site: `https://liliia2.github.io/gryphon-website/`.
- GitHub repo: `https://github.com/Liliia2/gryphon-website`.
- GitHub Pages source: `main` branch, root `/`.
- Latest pushed commit after lead receiver work: `e025db2 Wire lead form receiver`.

## Current State

The landing page is online and the lead form works.

Completed and verified:

- Design, calculator, UA/RU language switcher, RODO privacy modal, contacts.
- Google Apps Script Web App receives form submissions.
- Leads go to Telegram group and Google Sheet.
- Public GitHub Pages version contains the working `LEAD_ENDPOINT`.
- Real test from the public landing page worked.
- Fallback Telegram link on form error is `https://t.me/Gryphon_Group`.

## Lead Receiver

Architecture:

`index.html form -> Google Apps Script Web App -> Google Sheet + Telegram Bot API`

Important files:

- `index.html`
  - form id: `#leadForm`
  - endpoint variable: `LEAD_ENDPOINT`
  - honeypot field: `company_extra`
  - success state: `.form-success`
  - error state: `.form-error`
- `integrations/google-apps-script.gs`
  - reference copy of Apps Script code
  - token is intentionally a placeholder and must never be committed
- `integrations/README-setup.md`
  - setup instructions

Working Web App URL currently in `index.html`:

```text
https://script.google.com/macros/s/AKfycbzmLWw0U4tobb1F6c9rRwpP_7krOtHleNyJMS-nJ7NcY0WgtqYyUZGe3NMjlDOliU-cZg/exec
```

Google Sheet:

```text
1uLfIVEBWJ1balWa6Z7bY8nKa-Le8lGxUITw3Kq5rDVI
```

Sheet tab:

```text
Заявки лізинг
```

Telegram group chat id:

```text
-1003988229437
```

Bot token:

- Exists only inside the user's Apps Script project.
- Do not write it into repo files.
- It was exposed in a screenshot earlier; optional recommended cleanup after launch: revoke/regenerate in @BotFather and update Apps Script.

## Google Apps Script Block Was Fixed

Original blocker:

Google showed "This app is blocked - This app tried to access sensitive info in your Google Account" with no Advanced button.

Fix used:

1. Created/configured OAuth consent screen in Google Cloud project `My First Project`.
2. Project number: `968177333470`.
3. Added test user: `konoplyovaliliia@gmail.com`.
4. Connected Apps Script to this standard GCP project in Apps Script settings.
5. Redeployed Web App.

After that Google showed the normal "Google hasn't verified this app" test warning. User continued, selected all permissions, and allowed access.

## Verification Already Done

- GET to Web App returned:

```json
{"ok":true,"status":"alive"}
```

- POST test returned:

```json
{"ok":true}
```

- User confirmed Telegram group received a test lead.
- User confirmed Google Sheet received test leads.
- Phone number `+48 516 929 619` was tested and now writes to Sheet without `#ERROR!`.
- User confirmed the public landing form worked.

## Deployment

Published to GitHub Pages:

```text
https://liliia2.github.io/gryphon-website/
```

The online HTML was checked after deploy and contains:

- current Web App endpoint
- fallback Telegram link `https://t.me/Gryphon_Group`

## Next Work

User wants to run FB/IG ads and needs Meta Pixel.

Next task:

1. Get Meta Pixel ID from the user.
2. Add Meta Pixel base code to `index.html`.
3. Prefer privacy-aware behavior:
   - Pixel should load only after cookie/marketing consent if implementing full compliance.
   - Current privacy text says marketing/analytics cookies are enabled only after consent if added.
   - If user wants simplest launch first, clearly explain the tradeoff and consider adding a small cookie consent banner.
4. Track at least:
   - `PageView`
   - lead form success as `Lead`
5. Deploy to GitHub Pages.
6. Verify public page opens and form still works.
7. User can verify Pixel in Meta Events Manager / Meta Pixel Helper.

## Important User Style

- User is not a programmer.
- Give one practical step at a time.
- Do not send the user to run terminal commands; run checks yourself when possible.
- Ask confirmation before publishing, changing billing, installing programs, or deleting files.
- Keep explanations simple and tied to the business result: running ads to a working landing page that records leads.
