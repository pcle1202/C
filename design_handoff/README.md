# Handoff: bdap — birthday cabin game

## Overview
A tiny cozy pixel-art game, made as a birthday gift for cyrus (nov 12). It runs in a fixed **480x480, non-resizable Electron window**. Flow: terminal intro → snowy cabin → candle-lit room → three quest items (webcam/mic cake, falling-letter letter, photo pinboard) → hearts merge → prim walks in → free roam → "end the party?" → outro.

## The goal: identical to the prototype
**The design export is the finished game** (`app/bdap.html` here is the older 2026-11-11 copy; the current raw export is `../handoff/bdap.raw.html`). It's one self-contained file (1.4MB) with every sprite, both fonts (DotGothic16, Indie Flower), React and all game logic inlined, so it works offline. The testing scaffolding (purple page and jump bar) is already removed: it's just the 480x480 game.

**Do not rebuild, port, refactor or restyle it by hand.** In v2, all changes are applied by `../tools/patch_v2.js`, which turns the raw export into `../src/bdap.html`. See `../CLAUDE.md` for the rules and the list of v2 changes, then run through `QA_CHECKLIST.md`.

## Fidelity
High-fidelity and final. Everything visible is intended, except the items under "Still placeholder".

## Files
- `../src/bdap.html`: **the game that ships** (generated; never edit).
- `../handoff/bdap.raw.html`: the raw design export (input to the patch script).
- `app/bdap.html`: older 2026-11-11 export, reference only.
- `PROMPTS.md`: historical prompts that built the first Electron wrapper.
- `QA_CHECKLIST.md`: what to test in the packaged app.
- `../CLAUDE.md`: the rules and the v2 change list.
- `NOTES.md`: the full spec and changelog (every screen, asset, timing, state). Reference only; nothing to implement.
- `../reference/`: the editable source (`bdap Game.dc.html` + `support.js` + `assets/`), including the test bar. Only for a full rewrite, which isn't planned.

## Electron requirements
- `BrowserWindow({ width: 480, height: 480, useContentSize: true, resizable: false, maximizable: false, fullscreenable: false, autoHideMenuBar: true, backgroundColor: '#000000' })`.
- Media permission handler (camera + mic). On macOS: `systemPreferences.askForMediaAccess` plus the usage strings.
- The game needs keyboard focus for the arrow keys. A normal focused window is enough.

## Settings
- **Date mode:** v2 runs in real-date mode (`?realdate=1`, set in `src/main.js`): nov 12 = birthday, after = "not your birthday anymore", before = "come back on november 12". Removing the query gives demo mode (always the birthday).
- **Name:** "cyrus" is built in.
- **Progress** is not saved between launches, on purpose. Every launch replays from the intro.

## Still placeholder (decide before the final export)
- **Art drawn by Claude** (works, but the user may redraw): `cyrus_jump` (5 frames), `prim` (11 frames), `cat`, `squiggle_bubble`, `arrow`, `heart_full` / `heart_empty`. To swap one: draw it at the same size and frame order (see NOTES.md → Assets), drop it into the design project, re-export.
- **App icon:** none yet. Add `icon.png` (512x512 or 1024x1024) if wanted.

## How updates work
The design project is the source of truth. Any change (art, photos, text, timing) happens there, then the new export replaces `../handoff/bdap.raw.html`, `node tools/patch_v2.js` regenerates `../src/bdap.html`, and the app is re-packaged. Nobody hand-edits `bdap.html`.
