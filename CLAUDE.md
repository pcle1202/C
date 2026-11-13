# bdap v2: game notes

Birthday gift game for cyrus (nov 12). Electron app, 480x480 locked window. `design_handoff/NOTES.md` has the design spec (every screen, asset, timing and state) and the design changelog. This file is the source of truth for everything that differs in v2.

## Rules
- **Never run git.** The user does all git work (init, commit, push, remotes). Only print the commands for them.
- **v2 only:** this folder (`bdap-v2/`) is the only place game changes happen. The old version lives in the sibling folder `../bdap-v1/` and is FROZEN: never edit it or copy v2 changes into it. (`../bdap/` is the old nested backup; ignore it.)
- **`src/bdap.html` is GENERATED. Never hand-edit it.** Change `tools/patch_v2.js`, then run `node tools/patch_v2.js [input.html]` from this folder. It reads the raw export `handoff/bdap.raw.html`, applies every patch, and writes `src/bdap.html`. Each patch must match exactly once or the script aborts without writing, so if a new export moves something, fix that patch's anchor.
- **`handoff/bdap.raw.html` is the pristine design export** (2026-11-12 newest). Never edit it. For a new handoff: replace it (or pass the new file's path to the script), re-run the script, test, and check that every change below survived. Everything else in a new handoff (art, copy, timings, layout, new features) is adopted as-is.
- Electron code (`src/main.js`) only handles the window (480x480, locked), camera/mic permissions, date mode and packaging. Never "fix" game behavior there.
- After every user change: update the patch script, regenerate, and keep this file in sync (and add a line to the changelog in `design_handoff/NOTES.md`).
- Copy style: all lowercase, short, warm, no emoji. The recipient's name is a prop (`name`, default "cyrus").
- Fonts: DotGothic16 for everything (terminal, tips, captions, buttons), Indie Flower for the letter.
- Walking: one speed for all characters (`SPD`); the only exception is prim rushing to the cabin door (`PRIM_RUSH`).
- Testing: camera and mic are real. In automated runs deny media permissions (`session.setPermissionRequestHandler((wc, p, cb) => cb(false))`) so the webcam never turns on, and never save screenshots that could contain a face. Console warnings about `{{ zSrc }}` / `{{ p.src }}` come from the export's own pinboard markup and are harmless. Run with `npm start`.

## Layout
- `src/main.js`: window, permissions, loads `bdap.html?realdate=1`.
- `src/bdap.html`: generated game (do not edit).
- `tools/patch_v2.js`: all v2 changes (patch ids below).
- `handoff/bdap.raw.html`: raw design export (patch input).
- `design_handoff/`: the original handoff docs (`README.md`, `NOTES.md` spec + changelog, `PROMPTS.md`, `QA_CHECKLIST.md`).
- `reference/`: editable design source (`bdap Game.dc.html`, with the test bar), read-only.
- Test bar / purple page exist only in `reference/`; the app is just the 480x480 game square.

## v2 permanent changes (the user approved these; they must ALWAYS stay)
1. **Smaller party hat** in the cake popup: 60x66 at left 210, top 40, so the middle of the camera frame stays empty for the user's face.
2. **Prim outside**: hovering her shows the yellow outline (3px drop-shadow), and the annoyed squiggle bubble appears at the top-right of her head (`annoyHX` = prim x + 68, `annoyHY` = walkY - 18).
3. **Letter replay**: once unscrambled, a small replay icon + "scramble" (Indie Flower, muted brown, no box) sits inside the paper left of "love, Prim"; clicking the finished letter scrambles it again. The old button is gone; the text under the letter is "click outside to continue" with a play triangle.
4. **Prim's first appearance** (patch `F1`): when she reaches cyrus she stops (`phase: 'greet'`), waits 2s, then the caption "a prim has appeared!" types in (typewriter, slow fade). Only after it fades (~4.5s) do the jump + heart bubbles run, then she waits 5.2s before stepping to cyrus's left (`phase: 'follow'`).
5. **End the party** (patch `F2`): clicking "END!" makes cyrus and prim walk off to the RIGHT edge (`endWalk`, same speed, prim follows), then the screen fades to the outro. Arrows/clicks are blocked meanwhile.
6. **Prim reacts on her own** (patch `F3`): in prim mode at random intervals (first 12-32s, then every 15-40s) she pops the same bubbles as when clicked (inside = hearts, cyrus pops one too; outside = the squiggle). SILENT (clicking her still blips). Skipped during popups, cutscenes, fades, walks and the end dialog.
7. **Copy/timing edits** (patches `E1`-`E7`):
   - cake tip "shhh! be quiet..." runs ~1/3 as long (`WISH_AT` adjusted so the mic gate matches).
   - envelope hint = "click the envelope to open".
   - clicking the letter DURING the unscramble speeds it up ~6x.
   - quest tips end in "to continue"; the "click the big heart!" tip is removed.
   - pinboard captions: "going into the mountain", "being a food critic", "sarasota beach", "the perry fair" (auto-shrink to one line); cactus caption "the succulent he got with prim...". The letter's own text is NOT changed.
   - pinboard title "fun / things / with / cyrus" in the empty top-middle of the board: DotGothic16, faux-bold (1px plum text-shadow), ONE color (plum #4A2230), lines gently tilted. "System font" means the tip-text font.
8. **Arrow-key tip** (`E8`): after the FIRST candle blow, "use the left and right arrows to walk" shows first; it ends when an arrow is pressed or after one type/hold/fade cycle, never returns (`arrowTipDone`); then "view two more items to continue" starts. Wording is my guess; unconfirmed.
9. **Sound** (`E9`, `E11`, `E13`, `E14`): NO audio files are used anywhere; everything is the game's own synthesized beeps. Every click (`pop`: cake, envelope, pinboard open/photo/put-back/close, arrows, X, relight, rescramble, END etc.) is the soft high blip `sfx(660,.06,'triangle',.035,1.2)`, the same one used for the succulent/house click; the terminal click and house click call it directly. Terminal typing = the handoff beep at 850-990Hz, text at 0.75x speed (56/213/560ms per char). Typewriter tick under the cat/window/succulent captions: 430-510Hz, volume .006 (half the handoff's); the same tick plays on the typewriter tips (outside cabin tip, quest tips) via `tickType`, but NOT on the cake tips. Falling-letter thud: 260-350Hz, volume .03. Removed on purpose: all letter-unscramble sounds, the candle-blow whoosh, the zoom-in blip, the sound when the letter slides out of the envelope, the heart blip when closing the pinboard. There are no walking sounds. Rejected by ear (do not retry without asking): Kenney click, OpenGameArt keyboard/typewriter, Mixkit keys, a synthesized thock, wood-clack shuffle, paper sounds.
10. **Camera preview silent** (`E10`): the cake `<video>` is muted, volume 0, and gets a video-only `MediaStream`, so the mic can never play through the speakers (echo). Blow detection still reads the full stream separately.
11. **Heart bubbles nudged** (`E12`): every heart/squiggle bubble is +8px right and +6px lower than the export; the cat bubble is +8px right and 2px higher (top 100px).
12. **Real-date mode** (`src/main.js`): loads `bdap.html?realdate=1`. nov 12 = birthday; after = "it's not your birthday anymore... but you can still look around!!"; before = "come back on november 12 :)" and the game won't continue. To test the birthday flow on another day, temporarily remove the `query` option (demo mode always shows the birthday).
13. **"hang out with prim or end the party" tip** (`E15`): typewriter quest tip shown ONCE (`endTipDone`) when prim reaches cyrus's left side.
14. **Round-N tweaks** (`E16`): the cake tip is "click the cake to start the party" (no dots); the pinboard NEVER auto-closes after the 4th photo (the user leaves manually; the hint "click outside to continue" shows; `done.board` is set by the manual close); petting the cat is silent (the caption tick and heart bubble stay); the "click the hearts!" tip types with its tick only ONCE (`heartsTyped`), afterwards it just appears and fades.

15. **END! hearts** (`E17`): clicking "END!" in the end dialog lets out heart bubbles from cyrus and prim (silent) as they start walking off.

16. **Silent prim + silent exit** (`E18`): clicking prim makes NO sound at all (inside or outside); leaving the house through the left arrow has no click sound.

Not v2 changes (part of the design handoff, they stay): the cake tip "shhh! be quiet." then "make a wish, then blow into the mic!", and the mic being ignored until the second line. The user asked to drop MY earlier extra "shh... be quiet!" caption; do not re-add it.

## Copy convention (observed)
All lowercase; no periods; plain instructions have no end punctuation ("click the cabin to go inside", "view two more items to continue", "hang out with prim or end the party"); excitement = "!" ("click the hearts!", "a prim has appeared!"); trailing or narrative thoughts = "..." ("the succulent he got with prim...", "shhh! be quiet..."); the terminal uses "> " prefixes and "!!" / "...".
