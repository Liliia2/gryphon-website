# Claude Code Start Here

Read these files first:

1. `HANDOFF.md`
2. `memory.md`
3. `plan.md`

## Current Status

The Gryphon Group landing page is online:

```text
https://liliia2.github.io/gryphon-website/
```

The lead form is working:

- public landing form sends leads successfully;
- Telegram group receives leads;
- Google Sheet `Заявки лізинг` receives leads;
- phone numbers with `+48` write correctly, without `#ERROR!`;
- `LEAD_ENDPOINT` in `index.html` is already set to the working Google Apps Script Web App.

Latest pushed commit after lead receiver work:

```text
e025db2 Wire lead form receiver
```

## Next Task

User wants to run FB/IG ads and needs Meta Pixel installed.

Ask for the Meta Pixel ID if it has not been provided yet. Then:

1. Add Meta Pixel base code to `index.html`.
2. Track `PageView`.
3. Track successful form submit as `Lead`.
4. Consider cookie/marketing consent because the privacy policy says marketing/analytics cookies are enabled only after consent if added.
5. Deploy to GitHub Pages.
6. Verify public page and form still work.

## User Style

The user is not a programmer. Explain simply, step by step, and do terminal/deploy checks yourself where possible.
