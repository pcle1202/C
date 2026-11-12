# Build prompts for Claude Code

You want the app to be **exactly** like the prototype, so don't rebuild it. `app/bdap.html` IS the game: one self-contained offline file with all art, fonts and code inside, and the test bar and purple background already removed. Claude Code only has to wrap it in Electron.

Paste the prompts **one at a time**. Test after each one.

Before you start:
1. Copy this whole folder into your `bdap/` project as `bdap/design_handoff/`.
2. Rename `RULES_for_CLAUDE.md` to `CLAUDE.md` and put it at the root of `bdap/`. If `bdap/CLAUDE.md` already exists, replace it; its old cake notes are outdated.

---

## 1. Load the game as-is
Read CLAUDE.md and design_handoff/README.md. Do NOT rewrite, refactor, reformat or restyle the game. `design_handoff/app/bdap.html` is the finished game and must stay byte-for-byte identical.
- Copy it to `src/bdap.html`.
- In `src/main.js`, create the BrowserWindow with `{ width: 480, height: 480, useContentSize: true, resizable: false, maximizable: false, fullscreenable: false, autoHideMenuBar: true, backgroundColor: '#000000', title: 'bdap' }` and `loadFile('src/bdap.html')`.
- `src/index.html` and `src/renderer.js` (the old 5-screen version) are no longer loaded. Leave them in place but unused. Don't delete anything.

Stop and tell me when the window opens and the terminal intro types out.

## 2. Camera and microphone
- In `main.js`, add `session.defaultSession.setPermissionRequestHandler` and `setPermissionCheckHandler` that allow `media` (camera + mic) and deny everything else.
- On macOS, call `systemPreferences.askForMediaAccess('camera')` and `askForMediaAccess('microphone')` before creating the window, and add `NSCameraUsageDescription` / `NSMicrophoneUsageDescription` to the build config (e.g. "for blowing out the birthday candle").

Test: open the cake. The webcam should show (mirrored), and blowing into the mic should fill the bar until the candle goes out. If no camera is available, the "blow it out" button appears after about 8 seconds as a fallback. That's intended.

## 3. Date mode (choose one)
By default the game is in **birthday mode**: the birthday intro on any day, with the date printed as "november 12". Keep this if cyrus might open it on a day other than nov 12.
To use the **real date** instead (birthday intro only on nov 12, otherwise "it's not your birthday yet"), load with a query: `loadFile('src/bdap.html', { query: { realdate: '1' } })`. Don't edit bdap.html for this.

## 4. Package
- Package with electron-builder (or electron-forge) for the OS cyrus uses. App name "bdap". Use `design_handoff/app/icon.png` as the icon if it exists; otherwise use the default.
- Make sure `src/bdap.html` is included in the package (check the files/asar config).
- Test the packaged build with Wi-Fi OFF: run through `design_handoff/QA_CHECKLIST.md`.

---

## Later: changing art, photos or text
Don't edit `bdap.html` by hand; it's a compiled bundle. Make changes in the design project, re-export `app/bdap.html`, replace `src/bdap.html`, and re-package.


---

## Update 2026-11-11: prim, photos, intro/outro, cake text

Paste this into Claude Code as one message:

> This is a content-only update. The Electron app already works and is final. Do exactly these steps and nothing else:
>
> 1. Copy `design_handoff_bdap_game/app/bdap.html` over `src/bdap.html`. Copy it byte-for-byte. Do not open, read, format, or edit it.
> 2. Do NOT touch `src/main.js`, `src/index.html`, `src/renderer.js`, `package.json`, or any other file. No refactors, no dependency updates, no "improvements".
> 3. Run the app once (`npm start`) and confirm it launches with no errors in the terminal. Then stop.
> 4. Reply with only: the file you replaced, and whether the app launched cleanly.
>
> If anything fails, report the error and stop. Do not try to fix game behavior in Electron code; game changes come from a new bdap.html.

What changed inside bdap.html (for your own checking, Claude Code does not need this):
- prim uses the user's real sprite (walk, blink, idle, plus generated jump).
- real photos and captions on the pinboard, with frames that match each photo's shape; polaroids on the board are bigger and don't overlap (board size unchanged).
- intro text is new ("hello cyrus! welcome to my super duper secret project..."); title bar says cyrus.exe. After nov 12 2026 (real-date mode) it says "it's not your birthday anymore... but you can still look around!!" and still lets him in.
- outro text is new and ends with "replay? y/n" and a typing prompt: one letter max, backspace clears, y + enter replays. The old replay button is gone.
- cake popup: types "shhh! be quiet..." (holds ~3s, fades), then "make a wish, then blow into the mic!". The mic is ignored until the second line starts, so early noise can't blow the candle.
- button labels: "manual blow" (was "blow it out"), "END!" on the end-party confirm (was "end it ♥").
- letter tip: "click the letter to unscramble".

Manual check after it runs: read the intro; open the cake and make noise during "shhh" (bar must not move), then blow after "make a wish"; reach prim mode (view all 3 items, click the big heart) and watch prim walk in and jump; open the pinboard and zoom a photo; end the party, type y + enter to replay.
