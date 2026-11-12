# bdap Game notes

Birthday gift game for cyrus (nov 12). Read `NOTES.md` first: its "Current spec" section is the source of truth for every screen, asset, timing and state.

## Standing rules
- The final app is ONLY the 480x480 game square in `bdap Game.dc.html`. The purple page background and the test/jump bar (boot, outside, inside, cake, letter, board, all done, dim (unblown), lit (blown), prim mode, ending, reset) are testing scaffolding: keep them for now, never treat them as part of the design, and strip them for the final build.
- After EVERY user update or change, append an entry to the `NOTES.md` changelog (date, what the user asked, what changed, any open guesses) and keep "Current spec" in sync with the game. Update this file if rules, assets or the file layout change. Read NOTES.md at the start of each new chat.
- Copy style: all lowercase, short, warm, no emoji. The recipient's name is a prop (`name`, default "cyrus").
- Fonts: DotGothic16 for everything (terminal, tip text, captions, buttons, dialogs), Indie Flower for the letter.
- Walking: one speed for all characters everywhere (`SPD`); the only exception is prim rushing to the cabin door (`PRIM_RUSH`).

## Art pipeline
- The user draws pixel art in Aseprite. Scene canvas 120x120, shown at 4x (480x480). Character frames 28x48 (cyrus and prim), exported as one horizontal strip per sheet (optionally with the Aseprite JSON).
- Uploads land in `uploads/`; game-ready art lives in `assets/` (see NOTES.md for each file's size and frame order).
- Replacing a placeholder: if the new strip keeps the same name, size and frame order as listed in NOTES.md, it drops in with no code changes. If it differs, read the Aseprite JSON (frame names/tags/durations) and remap the frame indexes in the code.
- Current placeholders by Claude: `cyrus_jump.png` (5 frames, edited from the user's standing cyrus), `prim.png` (11 frames: blink x2, idle x2, walk x2, jump x5), `cat.png`, `squiggle_bubble.png`, `arrow.png`, `heart_full.png` / `heart_empty.png`.

## Port target
- Electron app in the user's local `bdap/` folder (`src/main.js`, `src/index.html`, `src/renderer.js`). Set BrowserWindow to 480x480, not resizable. Add a media permission handler for camera + mic.

## Shipping
- The Electron app loads `src/bdap.html`, a compiled, self-contained export of the game. Never hand-edit, reformat or rebuild it; never "fix" game behavior in Electron code. All game changes happen in the design project and get re-exported.
- Electron code only handles the window (480x480, locked), media permissions, date mode (`?realdate=1`) and packaging.

## This is v2 (the working version)
- **This folder (`bdap-v2/`) is the only place game changes happen.** The old v1 lives in the separate sibling folder `../bdap-v1/` and is FROZEN: never edit it, never copy v2 changes into it. Run v2 with `npm start`.
- **`src/bdap.html` is GENERATED. Never hand-edit it.** Run `node tools/patch_v2.js [input.html]` from this folder. It reads the raw bundle export `handoff/bdap.raw.html`, applies the permanent patches below, and writes `src/bdap.html`. Each edit must match exactly once or the script aborts without writing, so if a new export moves something, fix the script's anchors. To change v2, edit `tools/patch_v2.js` and re-run it.
- **`handoff/bdap.raw.html` is the pristine raw handoff export (2026-11-12 newest: new prim sprite, real pinboard photos, new intro/outro, two-step cake tip).** Do not edit it. When a new handoff arrives, replace it (or pass the new file's path to the script). `design_handoff/app/bdap.html` is the OLDER 2026-11-11 export, kept for reference only. `reference/` holds the editable design source (`bdap Game.dc.html`, with the test bar), for reading only.
- **New handoff procedure:** run the patch script on the newest export, then test v2 (camera/mic denied) and make sure the kept changes below survive. Never overwrite `src/bdap.html` with a raw handoff copy. Everything else in a new handoff (art, copy, timings, layout, new features) is adopted as-is.
- Split history: on 2026-11-12 v2 was moved out of the nested `bdap/v2/` into this standalone repo. The original `bdap/` folder (with the nested v2) is an untouched backup and can be deleted.
- Git: this folder is its own git repo (`node_modules/` and `sfx_raw/` are ignored).

### v2 permanent changes (the user approved these; they must ALWAYS stay)
1. **Smaller party hat** in the cake popup: 60x66 (3x the 20x22 art) at left 210, top 40, so it sits at the top of the camera frame and the middle stays empty for the user's face.
2. **Prim outside**: hovering her shows the same yellow outline as indoors (3px drop-shadow, 1 art pixel at the outside 3x scale), and the annoyed squiggle bubble appears at the top-right of her head (`annoyHX` = prim x + 60, `annoyHY` = walkY - 24), like the indoor heart bubble.
3. **Letter replay**: once the letter is fully unscrambled, a small replay icon + "scramble" (no box, Indie Flower, muted brown) is drawn inside the paper to the left of the "love, Prim" line, and clicking the finished letter scrambles it again. The old "scramble" button below the paper is removed; the text under the letter reads "click outside to continue" with a play triangle (same style as the pinboard hint).
4. **Prim's first appearance** (the cutscene after the big heart): when she reaches cyrus she stops (`phase: 'greet'`), waits 2s, then the caption "a prim has appeared!" types in (tip-text style via `say()`, typewriter, slow fade). Only after the caption fades (~4.5s later) does the jump + heart bubbles run (`primJump`), and she then waits 5.2s (2x the original 2.6s) before stepping to cyrus's left side (`phase: 'follow'`). Patches `F1`.
5. **End the party**: clicking "END!" no longer cuts straight to the outro. Cyrus and prim walk off to the RIGHT edge of the screen (`endWalk`, same walking speed, prim follows), then the screen fades to the outro. Arrows/clicks are blocked while they walk. Patches `F2`.
6. **Prim reacts on her own** in prim mode: at random intervals (first 12-32s after prim mode starts, then every 15-40s) she pops the same bubbles as when clicked: inside = heart bubbles (cyrus pops one too, exactly like a click), outside = the annoyed squiggle bubble only. Skipped during popups, cutscenes, fades, walks and the end dialog. Patch `F3`.
7. **Round-3 copy/timing edits (2026-11-12, patches `E1`-`E7`)**:
   - cake tip "shhh! be quiet..." runs ~1/3 as long (type 40ms/char, hold .8s, fade .4s, gap .2s; `WISH_AT` = 1800 + 17*40 + 800 + 400 + 200 so the mic gate matches).
   - envelope hint = "click the envelope to open".
   - clicking the letter DURING the unscramble speeds it up ~6x (virtual clock `asmV`/`asmSpeed`; ~4.5s vs ~20s).
   - quest tips end in "to continue" ("view two/one more item(s) to continue"); the "click the big heart!" tip is removed (the "click the hearts!" tip stays).
   - pinboard captions: "going into the mountain", "being a food critic", "sarasota beach", "the perry fair" (zoomed caption auto-shrinks to fit one line); cactus caption = "the succulent he got with prim...". The letter's own text is NOT changed.
   - pinboard: title "fun / things / with / cyrus" in the empty top-middle of the board, in the TIP-TEXT font (DotGothic16, faux-bold via 1px plum text-shadow) and ONE theme color (plum #4A2230), lines gently tilted. By "system font" the user means the tip-text font, not the OS font.
8. **Arrow-key tip (2026-11-12, patch `E8`)**: after the FIRST candle blow (room lit, 1 of 3 hearts), the quest tip "use the left and right arrows to walk" shows first (same tip-text style). It ends when an arrow is pressed or after one full type/hold/fade cycle, never returns (`arrowTipDone`, reset with the game), and only then "view two more items to continue" starts. Wording is my guess; the user hasn't confirmed it.
- Not a v2 change: the cake popup tip "shhh! be quiet." (then "make a wish, then blow into the mic!") and the mic being ignored until the second line are part of the design handoff (2026-11-11 content update), so they stay. The user earlier asked to drop MY extra "shh... be quiet!" caption; do not re-add that one.
- Testing: camera and mic are real. In automated runs deny media permissions (`session.setPermissionRequestHandler((wc, p, cb) => cb(false))`) so the webcam never turns on, and never save screenshots that could contain a face. Console warnings about `{{ zSrc }}` / `{{ p.src }}` come from the export's own pinboard markup and are harmless.
