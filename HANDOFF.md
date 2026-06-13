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
- Live URL (current): `https://liliia2.github.io/gryphon-website/` (working, HTTP 200, logo + images OK).
- Latest pushed commit: `7181782 Temporarily remove custom domain until TheHost DNS is applied`.
- Earlier commits: `a8eee7b Meta Pixel + cookie consent`, `be66c53 Add CNAME`.

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

## Meta Pixel (DONE)

- Pixel ID `713530188067823` (dataset "AutoLeasing", portfolio AutoBiznes_Leasing).
- Implemented in `index.html` and pushed (commit `a8eee7b`).
- Loads ONLY after cookie consent (see Cookie Consent below).
- Events: `PageView` (on consent/page view) and `Lead` (fired on successful form submit via `ggTrackLead()` inside the form-success path).
- Verified locally with real network beacons to Meta: `facebook.com/tr/?id=713530188067823&ev=PageView` and `...&ev=Lead` both returned 200. No pixel/beacons fire before consent or after "decline".
- Still TODO once domain is live: confirm with Meta Pixel Helper on the live page, and do Meta domain verification (needed for stable ad delivery; can't verify github.io, must verify own domain leasing.gryphongroup.pl).

## Cookie Consent

- Small banner `#cookieBanner` (UA/RU), buttons `#cookieAccept` / `#cookieDecline`.
- Consent stored in `localStorage` key `gg_consent` = `granted` | `denied`.
- `granted` -> `loadPixel()` runs (init + PageView). `denied`/none -> no pixel.
- Required because the RODO privacy policy states marketing/analytics cookies load only after consent.

## Custom Domain (PAUSED - CNAME removed until TheHost DNS works)

- Target public URL for ads: `https://leasing.gryphongroup.pl/` (subdomain; main domain `gryphongroup.pl` already hosts the company site - do NOT touch it).
- Method: keep files on GitHub Pages, point subdomain via DNS CNAME -> `liliia2.github.io`.
- Domain + hosting at TheHost (panels: my.thehost.com.ua billing + s22.thehost.com.ua ISPmanager). Nameservers: ns1-4.thehost.com.ua.
- User added DNS record in ISPmanager -> "Доменные имена" -> gryphongroup.pl -> Записи: `leasing  CNAME  liliia2.github.io.` (visible in panel) BUT authoritative `ns1.thehost.com.ua` does NOT serve it yet -> `leasing.gryphongroup.pl` = NXDOMAIN. TheHost-side sync issue; user told to contact TheHost support.
- IMPORTANT: the `CNAME` repo file was REMOVED (commit `7181782`) because while it was present, github.io 301-redirected to the dead domain and the live site was down. So right now the site lives on github.io with NO custom domain.
- TO RE-ATTACH the domain once it resolves: first verify `nslookup leasing.gryphongroup.pl ns1.thehost.com.ua` returns `liliia2.github.io`; THEN re-create the `CNAME` file (one line: `leasing.gryphongroup.pl`) in repo root, commit + push. Do NOT re-add the CNAME file before DNS resolves, or the live site goes down again.

## Note: logo "disappeared" was NOT a bug

- On 13.06 the user saw a white box instead of the header logo. Root cause: (1) the Claude preview panel was glitching (not rendering images, screenshots timing out) and (2) the browser had cached the old 301 redirect. The logo (`.brand-mark` background-crop of `assets/logo.webp`) and all images are fine (verified: files load 200, canvas crop shows the gold wing). Resolved by removing CNAME + viewing in a normal/incognito browser. Do not "fix" the logo crop.

## Next Work (in order)

1. Get `leasing.gryphongroup.pl` resolving (TheHost support / wait for DNS).
2. Verify live page loads, lead form still submits (Telegram + Sheet), and Meta Pixel fires (Pixel Helper).
3. Meta domain verification for `gryphongroup.pl` (Business settings -> Brand safety -> Domains) so the pixel/ads work reliably.
4. Optional cleanup: revoke/regenerate the bot token in @BotFather (it was exposed in a screenshot) and update Apps Script.

## Important User Style

- User is not a programmer.
- Give one practical step at a time.
- Do not send the user to run terminal commands; run checks yourself when possible.
- Ask confirmation before publishing, changing billing, installing programs, or deleting files.
- Keep explanations simple and tied to the business result: running ads to a working landing page that records leads.
