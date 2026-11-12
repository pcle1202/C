# Handoff: bdap — birthday cabin game

## Overview
A tiny cozy pixel-art game, made as a birthday gift for cyrus (nov 12). It runs in a fixed **480x480, non-resizable Electron window**. Flow: terminal intro → snowy cabin → candle-lit room → three quest items (webcam/mic cake, falling-letter letter, photo pinboard) → hearts merge → prim walks in → free roam → "end the party?" → outro.

## The goal: identical to the prototype
**`app/bdap.html` is the finished game.** It's one self-contained file (1.4MB) with every sprite, both fonts (DotGothic16, Indie Flower), React and all game logic inlined, so it works offline. The testing scaffolding (purple page and jump bar) is already removed: it's just the 480x480 game.

Load it in Electron unchanged. **Do not rebuild, port, refactor or restyle it.** That is the only way to keep every timing, animation and pixel exactly as designed. Follow `PROMPTS.md` (4 small steps), then `QA_CHECKLIST.md`.

## Fidelity
High-fidelity and final. Everything visible is intended, except the items under "Still placeholder".

## Files
- `app/bdap.html`: **the game**. Load it with `BrowserWindow.loadFile`.
- `PROMPTS.md`: step-by-step prompts for Claude Code.
- `QA_CHECKLIST.md`: what to test in the packaged app.
- `RULES_for_CLAUDE.md`: rename to `CLAUDE.md` at the root of `bdap/`.
- `NOTES.md`: the full spec and changelog (every screen, asset, timing, state). Reference only; nothing to implement.
- `reference/`: the editable source (`bdap Game.dc.html` + `support.js` + `assets/`), including the test bar. Only for a full rewrite, which isn't planned.

## Electron requirements
- `BrowserWindow({ width: 480, height: 480, useContentSize: true, resizable: false, maximizable: false, fullscreenable: false, autoHideMenuBar: true, backgroundColor: '#000000' })`.
- Media permission handler (camera + mic). On macOS: `systemPreferences.askForMediaAccess` plus the usage strings.
- The game needs keyboard focus for the arrow keys. A normal focused window is enough.

## Settings
- **Date mode:** birthday mode by default (birthday intro any day, date shown as "november 12"). Real-date mode: `loadFile(..., { query: { realdate: '1' } })`.
- **Name:** "cyrus" is built in.
- **Progress** is not saved between launches, on purpose. Every launch replays from the intro.

## Still placeholder (decide before the final export)
- **Pinboard photos:** 4 pastel squares with captions "the pier", "that winter", "june", "last year". Real photos and captions need to be added in the design project, then re-exported.
- **Art drawn by Claude** (works, but the user may redraw): `cyrus_jump` (5 frames), `prim` (11 frames), `cat`, `squiggle_bubble`, `arrow`, `heart_full` / `heart_empty`. To swap one: draw it at the same size and frame order (see NOTES.md → Assets), drop it into the design project, re-export.
- **App icon:** none yet. Add `app/icon.png` (512x512 or 1024x1024) if wanted.

## How updates work
The design project is the source of truth. Any change (art, photos, text, timing) happens there, then `app/bdap.html` is re-exported and copied over `src/bdap.html`, and the app is re-packaged. Claude Code should never hand-edit `bdap.html`.
