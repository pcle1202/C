# bdap — design notes & changelog

Birthday gift game for **cyrus** (nov 12). Main file: `bdap Game.dc.html`. Other files are drafts/references: `Sprite Drafts.dc.html` (what to draw + sizes), `Sprite Strip Example.dc.html`, `bdap Screen Mockups.dc.html` / `bdap Cabin.dc.html` (old explorations).

---

## Current spec (keep in sync — last full audit 2026-11-11)

### Files
- `bdap Game.dc.html` — THE game. Only the 480x480 square is the product. The purple page background and the test/jump bar are scaffolding: keep for now, strip for the final build.
- `NOTES.md` (this file) + `CLAUDE.md` — standing rules and spec. Update both after every change.
- Drafts / references only: `Sprite Drafts.dc.html` (what to draw + sizes), `Sprite Strip Example.dc.html`, `bdap Screen Mockups.dc.html`, `bdap Cabin.dc.html`.

### Technical
- Game window 480x480. Scenes are 120x120 art shown at 4x. `image-rendering: pixelated` on all art.
- Main loop: `step()` every 60ms (`setInterval`). Movement is in px per tick at 4x scale.
- Fonts: DotGothic16 everywhere (terminal, tip text, captions, dialogs, buttons; user picked it from Font Options.dc.html 1b). Sizes: old VT323 sizes × ~0.78 (tip text 24 → 19px), old Press Start 2P 9px → 13px, 12px → 15px. Indie Flower for the letter handwriting. VT323 / Press Start 2P / Pixelify Sans no longer used.
- Walking: ONE speed for everyone everywhere — `SPD = 4` px/tick outside, `SPD_IN = 5.3` inside (same speed in art px since inside is drawn 4x and outside 3x) (inside, outside, arrows, walk-in, walk to items/door, exit, prim follow, prim cutscene entry). Only exception: `PRIM_RUSH = 7` when prim hurries to the cabin door.
- Sound: all sfx are synthesized WebAudio blips (`sfx()`, `chime()`, `pop()`). No audio files yet.
- Props: `name` (default "cyrus"), `forceBirthday` (default true: always show the birthday intro), `demoDate` (default true: date label pinned to "nov 12"; set false in the real app).

### Assets (`assets/`, art size, shown 4x unless noted)
User-drawn:
- `house.png` 120x120 outside scene. `house_trees_front.png` 120x120 front tree layer (z 4, over characters). `house_outline.png` 120x120 yellow hover outline of the cabin.
- `room.png` 120x120 inside scene. `lights.png` 120x8 party lights. `window_outline.png` 120x120 window hover outline.
- `cyrus.png` 168x48 = 6 frames of 28x48: blink-open, blink-closed, idle, idle, walk, walk.
- `cake.png` 200x40 = 5 frames of 40x40: 0 out, 1–2 smoke, 3–4 lit flicker.
- `envelope_small.png` 14x10 (on the table). `envelope_open.png` 350x65 = 5 frames of 70x65 opening. `paper.png` 80x105.
- `board_small.png` 43x40 (on the wall). `board_big.png` 108x85 (popup). `polaroid.png` 35x34 frame (pastel tint behind = photo placeholder).
- `hat.png` 20x22 party hat (cake popup). `heart_bubble.png` 12x12. `squiggle_bubble.png` 12x12 (Claude placeholder: same bubble, heart swapped for an annoyed scribble). `plant.png` 12x18 cactus.
Placeholders by Claude (user may redraw):
- `cyrus_jump.png` 140x48 = 5 frames of 28x48: crouch, rise, top, fall, land. Made by Claude by editing the user's standing frame (squash/stretch, arms up); the user should redraw it.
- `prim.png` 308x48 = 11 frames of 28x48: blink-open, blink-closed, idle, idle, walk, walk, jump crouch, rise, top, fall, land. Faces left unflipped (assumed).
- `cat.png` 44x13 = 2 frames of 22x13 (sleeping, breathing).
- `arrow.png` 8x13 pixel arrow, shown 3x (24x39); flipped for the left arrow.
- `heart_full.png` / `heart_empty.png` 7x7 progress hearts (empty = hollow outline).
- `girl_placeholder.png` 56x48: old draft, unused.

### Modes
- **Solo mode** (start until prim arrives): cyrus alone.
  - First outside arrival: walks in from off-screen left (x -84 → 28).
  - Leaving the cabin: appears at the door.
- **Prim mode** (after the prim cutscene): prim is in every scene and follows cyrus.
  - Leaving the cabin: prim at the door, cyrus to her right (75px gap).
  - Going inside: on clicking the cabin, prim hurries to the door first (PRIM_RUSH, she doesn't like the cold) and disappears inside; cyrus follows at normal speed. Inside, both walk in together.
  - Clicking prim outside: annoyed squiggle bubble over prim (2.4s, grumpy two-note sfx). Inside: both cyrus and prim pop hearts. Both trigger on EVERY click (bubble is unmounted then remounted so the animation always replays).

### Flow
1. **Boot (intro).** Light, cozy terminal:
   - Peach wall with faint checkerboard and pink scalloped trim.
   - A retro window in the middle: plum notched frame, pink pinstriped title bar "bdap.exe" with _ □ x, cream screen, plum VT323 text, pink caret.
   - Typewriter lines: "> initializing..." / "> checking today's date..." / "> today is november 12." / "> today is your birthday." / "> i built something for you."
   - Click anywhere to continue; clicking while it types skips ahead.
   - Non-birthday version: "> it's not your birthday yet." / "> come back on november 12 :)".
2. **Outside.**
   - Snowy cabin with falling snow (canvas) and the tree layer in front.
   - Arrow keys walk.
   - Hovering the cabin shows the yellow outline. Tip text: "click the cabin to go inside".
   - Clicking the cabin: cyrus (and prim) walk to the door at 3px/tick, then fade inside.
3. **Inside (room).**
   - **Room and lighting:**
     - Party lights always blink. Snow falls in the window glass.
     - First visit, until the candle is first blown: room at ~16% brightness, warm flickering spotlight on the candle. Only the cake, the candle, the party lights and cyrus are bright.
     - Before the cake is clicked, ONLY the cake is clickable.
     - After the first blow, the room is never dimmed again.
   - **Entering:** each time the room opens, cyrus (and prim) walk in from off-screen left at 3px/tick and stop on the left (cyrus x 40 solo / 140 with prim).
   - **Walking:**
     - Arrow keys walk at 8px/tick.
     - Walk-cycle frames change every 240ms.
   - **Clicking an object:**
     - Cyrus walks to it first and faces it, then the action fires.
     - Target spots: cake x 78 (left of the cake), envelope x 232 (left of the envelope), board x 70, cat x 300.
     - Clicks are ignored during fades, the walk in/out and cutscenes.
   - **Quest items:** cake, envelope/letter and board.
     - On click, a copy of the item zooms to the center (800ms, squash + brighten, room dims), then its popup opens.
     - Closing any quest-item popup pops a heart bubble from cyrus's head (top-right, 2.4s), every time, in both modes.
   - **Other interactables** (yellow hover outline):
     - **Cat** (on the window sill, right of the cactus; left 378, top 146; z 5): breathing at 1600ms/frame, floating "z". Click: cyrus walks over, the cat pops a heart, caption "cyrus will have a cat someday...".
     - **Cactus:** caption "the plant he got with prim...".
     - **Window:** caption "cyrus's favorite season...".
     - **Prim** (prim mode): click → cyrus and prim both pop heart bubbles, every click. No text.
   - **Captions:** same style and spot as the tip text, typewriter 45ms/char, hold, slow fade.
   - **Progress:**
     - 3 pixel hearts at the bottom-right. `state.done` = {cake, letter, board}; `state.progress` = count.
     - Cake counts the moment the candle is first blown, and relighting never removes it.
     - Letter counts once it has been unscrambled and closed.
     - Board counts on open and close (photos don't need to be viewed).
   - **3/3:**
     - The hearts pulse and glow; tip text "click the hearts!".
     - Clicking them: the hearts arc to the center, spiral in and merge (2.6s), then a big heart pops in (800ms) with a burst of 8 mini hearts (1.5s) and a chime; tip text "click the big heart!". The big heart has a permanent yellow 4px pixel outline.
     - Clicking the big heart starts the prim cutscene.
   - **Arrows** (bare pixel arrows, no button, nudge loop):
     - Left arrow, bottom-left: go outside. Always visible when nothing else is happening. Cyrus (and prim) walk off left, fade, and appear at the cabin door.
     - Right arrow, bottom-right: prim mode only. Opens the "end the party?" confirm.
4. **Cake popup.**
   - **Open animation:**
     - Frame expands from a line near the cake (1550ms).
     - Webcam powers on like an old TV (1850ms).
     - Cake rises (1650ms), hat drops (2150ms), controls slide up (2050ms).
   - **Layout:**
     - Pink pixel frame (top 36, height 288) with mirrored webcam, "rec" and "nov 12" labels, viewfinder corners, scanlines and vignette.
     - Hat on the frame's top edge. Cake at top 228, candle glow behind it.
     - ✕ above the frame at the top-right.
   - **Bottom:**
     - Mic progress bar (150px, centered, top 416).
     - "make a wish, then blow!" in tip-text style at top 444. It types at 110ms/char starting 1.8s after open, stays (no fade), and hides once blown.
   - **"blow it out":** a fallback button that appears 8s after open, right of the bar.
   - **When blown:**
     - The cake plays smoke frames, then goes out.
     - Confetti bursts at 450ms: from the cake, side cannons and a rain from the top.
     - Chime.
     - "↺ relight" and "continue ▶" appear.
5. **Letter.**
   - **Envelope:**
     - The popup plays every time: pop-in 650ms, then "click to open" (VT323 text, no button).
     - Click: 5 opening frames at 300ms each.
     - 450ms later the envelope sinks and fades (1000ms) while the paper rises out of it, overshoots and settles (1500ms) with a warm flash and a two-note chime.
   - **Paper:**
     - Opens in the saved `state.letterPhase` ('drop' | 'assemble' | 'done').
     - Drop: letters fall with physics to the bottom (gravity .2, terminal speed 7). Tip text "click to unscramble" types in at the bottom.
     - Click: each letter (40ms stagger, 1500ms each) hops up with a fast spin (random apex 45–90px above, ±35px sideways), then drops into its spot with a bouncy landing. Blip on launch and on landing.
     - Once done: "↺ scramble" button. ✕ closes.
   - **Letter text (final, from the user):** "hi Cyrus!! / Today is the second Cyrus birthday I’m celebrating. / It’s been such an awesome year with you… GOING TO JAPAN!… / And most importantly… / I hope to celebrate more birthdays with you in the future! / love, Prim" — kept verbatim in `letter` in the logic class. Paginated (~3 pages), Indie Flower 15px.
6. **Pinboard.**
   - Big board popup (pop 1400ms) with 4 polaroids (pastel placeholders). Captions: "the pier" / "that winter" / "june" / "last year".
   - Click a photo to zoom (1500ms, dim fades in 1100ms); click again to put it back.
   - ✕ closes.
7. **Prim cutscene.**
   - Prim walks in from the right toward cyrus and stops close (not touching).
   - Both jump, then heart bubbles.
   - After that: prim mode. No automatic ending; cyrus is free to do anything, inside and outside.
8. **End confirm.** In prim mode, the right arrow opens a centered cream dialog "end the party?" with a wood "not yet" button and a red "end it ♥" button.
   - "end it ♥": fade to the outro.
   - "not yet" or clicking outside: closes the dialog.
9. **Outro.**
   - Same terminal style: "> ...and that's it!" / "> happy birthday again, cyrus ♥" / "> i hope you liked it :)".
   - Click → "back to the room" (prim mode continues).

### Prim follow logic
- Breadcrumb trail (EarthBound-style): cyrus's x is recorded every tick, and prim replays it DELAY=5 ticks (~300ms) late.
- Gap: PGAP 100px inside, OGAP 75px outside. Hard clamp, so they never overlap.

### Tip text (quest line)
- **Style:** DotGothic16 19px cream, dark pixel outline and pink glow, bottom-center (bottom 10px, below the characters).
- **Timing:**
  - Typewriter (45ms/char) only on a line's first appearance; later reminders appear instantly.
  - Hold 2s, fade 1.8s, hidden 9s, repeat until done.
  - Hidden during popups, cutscenes, fades, the walk-in (inside and outside), the walk to the door and captions.
- **Stages:**
  - Outside, before 3/3: "click the cabin to go inside".
  - Inside, first time: "click the cake to start the party....". This shows EXACTLY ONCE in the whole app (`cakeTipDone` / `cakeSeen`).
  - After the cake: "view two more items to proceed", then "view one more item to proceed".
  - At 3/3: "click the hearts!", then "click the big heart!".
  - Prim mode: none.

### Transitions
- Screen fade (outside ⇄ inside ⇄ outro): 800ms fade to dark in 8 steps, swap at 850ms, 250ms hold, fade back.

### Candle blow logic (prototype — rebuild in Claude Code)
- Where: `startCam()` / `doBlow()` / `relight()`.
- Mic: getUserMedia({video, audio}), with a video-only fallback (then only the button works).
- Analysis: AnalyserNode fftSize 1024, smoothing .5.
  - `e` = mean byte magnitude at 80–600 Hz.
  - `flat` = spectral flatness at 80–4000 Hz.
  - Baseline = average of the first 30 frames.
  - `air` = clamp((e − base − 10)/60).
  - Blowing = air > .35 && flat > .2.
  - `blowP` += .012 + air·.02 per frame while blowing, −.004 decay otherwise. At 1 → doBlow().
- doBlow: sets blownAt, everBlown and done.cake; sfx, chime and confetti.
- relight: resets blownAt, blowP and air only. Progress stays.
- **Ideas for the rebuild:**
  - Rolling baseline.
  - Require ≥400ms of sustained blowing.
  - Turn off echoCancellation / noiseSuppression / autoGainControl.
  - Use dt-based increments.
  - Electron: session.setPermissionRequestHandler for camera + mic.
  - The flame leans with `air`.

### Buttons
- Rounded pixel-plank buttons (stepped clip-path corners, dark outline). Pink/red = primary, wood = secondary. Inner padding 4px 10px 6px (dialog buttons 5px 12px 7px).
- Navigation uses bare pixel arrows, not buttons. Popups close with a small wood ✕ at the top-right.

### Test/jump bar (scaffolding — strip for the final build)
- boot, outside, inside, cake, letter, board, all done, dim (unblown), lit (blown), prim mode, ending, reset.

### Open guesses / to confirm
- Prim and cat art are placeholders; prim's facing direction is assumed.
- Real photos for the pinboard are not supplied yet. 
- The spotlight's candle position and the door/cabin hit areas were estimated by eye.
- Port target: the Electron app in `bdap/src/` (`main.js` still says 480x640; it should be 480x480).

---

## Changelog (newest first)

### 2026-11-11
- Mic is ignored until "make a wish, then blow into the mic!" starts typing (WISH_AT = ~8s after the cake popup opens). Before that, sound can't fill the progress bar or blow the candle. Manual blow button unchanged.
- Cake tip: "shhh! be quiet..." now holds 3.2s (was 1.4s) before fading.
- Letter tip text: "click to unscramble" -> "click the letter to unscramble".
- Cake popup tip is now two steps: types "shhh! be quiet..." (110ms/char), holds 1.4s, fades out over 0.7s, then types "make a wish, then blow into the mic!" (110ms/char) and stays. Manual blow button timing unchanged.
- Intro copy: "> initializing..." / blank / "> hello {name}!" / "> welcome to my super duper secret project" / blank / "> checking today's date..." / "> today is {date}..." / "> today is your birthday!!". After nov 12 2026 (real date mode only): last line becomes "> it's not your birthday anymore..." + "> but you can still look around!!" and click-to-continue still works. Before nov 12 (real date) keeps the old locked "not yet" message. Title bar bdap.exe -> cyrus.exe.
- Outro copy: "> ...and that's the end!" / blank / "> happy birthday, {name}" / blank / "> i hope you liked it :)" / blank / "> replay? y/n", then a "> " prompt with the caret. User can type one letter (more are ignored, backspace clears); only y + enter replays (same as the old replay button, which is removed). Fixed user typos: "initailiziing" -> "initializing", "today your birthday" -> "today is your birthday".
- Pinboard popup: board stays original size (432x340, board_big.png). Only the polaroids got bigger: fit(170x114) (was 120x104), packed 2x2 by centre points (118,96) (314,94) (120,246) (312,244), tilts within +-1.5deg, no overlap. (A briefly enlarged board, board_big_l.png, was reverted at user's request.)
- Export fix: bdap Final was missing the real photos (photo1-4 + captions + per-photo frames) that were in Game; ported them over (photos embedded as data URIs in Component.PHOTOS). The earlier polaroid_tall.png popup is superseded by Game's per-photo CSS frame.
- Handoff: PROMPTS.md now ends with a content-only update prompt (copy app/bdap.html over src/bdap.html, touch nothing else, launch once, report). Use this pattern for every future update.
- Pinboard: real photos added (assets/photo1-4.png, resized to 320px long side from uploads: trail 3:4, dinner 3:4, beach street 4:3, fair ~0.84). Polaroid frames are now CSS (cream #FFF8EC, 2px plum outline, thicker bottom) sized per photo aspect, replacing polaroid.png / polaroid_tall.png and the pastel tints. Thumbs fit 120x104, centered on the old slot centers; zoom fits 230x236, centered. Captions (guessed from the letter): "nature things", "reviewing food", "the beach", "the fair". Export (bdap Final + app/bdap.html) NOT yet re-made with photos.
- Polaroid popup (zoomed photo) is now 3:4 portrait to match iPhone photos. New asset assets/polaroid_tall.png (35x47) built from the user's polaroid.png by stretching only the plain side edges (corners + thick bottom kept). Shown 6x = 210x282, photo window 162x216 (3:4), caption top 248. Board thumbnails unchanged (still polaroid.png, 6:5 window). Photos for the game: crop to 3:4 portrait, ~648x864 is plenty.
- Prim art: user's own sprite (uploads/prim_frames.png, 7 frames 28x48: blink x2, idle x2, walk x3; drawn smaller than cyrus on purpose). Remapped into the existing 11-frame prim.png layout so no code changed: blink = user 0,1; idle = 2,3; walk = 5,6 (user frame 4 is the neutral pass and is dropped); jump x5 made by claude from her standing frame (same squash amounts as cyrus_jump: 4,2,4,1,2 rows). Swapped into Game, Final and app/bdap.html.
- Sprite Drafts page: replaced the old "girl placeholder" card with the current prim.png (all 11 frames, labeled, with what the user draws vs what claude makes) and added a "cat in game now" card showing the new cat.png (2 frames + breathing preview + palette).
- Prim plan agreed: user draws prim.png like cyrus.png (28x48 frames: stand, blink, idle x2, walk x2); Claude derives the 5 jump frames from her standing frame and remaps into the current 11-frame layout (blink x2, idle x2, walk x2, jump x5).
- Bug found in export: 8 sprites referenced from JS strings (cyrus_jump, cyrus, room [window snow mask], board_small, cake, envelope_small, heart_full, heart_empty) were NOT inlined by the bundler, so the Electron app would show them missing (e.g. no cyrus jump). Fix: Final now has every assets/*.png replaced by a PERCENT-ENCODED data URI (data:image/png,%89PNG...) before bundling. NOT base64: the ";base64" semicolon gets split by the inline-style compiler and breaks every CSS-background sprite (cyrus, cake, prim...). When re-making Final from Game, repeat this step.
- Handoff review: added a real-date switch without editing the bundle (`?realdate=1` in the URL turns forceBirthday/demoDate off unless the props say otherwise; same change in Game and Final). Added QA_CHECKLIST.md, the macOS askForMediaAccess note, an app icon slot, "still placeholder" (photos, Claude art, icon), "progress not saved" (intended), an update workflow, and a Shipping section in CLAUDE.md. Re-bundled app/bdap.html.
- Handoff switched to an EXACT copy (user: "everything exactly like what i see here"). `bdap Final.dc.html` = the game with the scaffolding stripped (no jump bar, no purple page, no frame shadow, black body), plus asset meta tags. Bundled offline into `design_handoff_bdap_game/app/bdap.html` (1.4MB). Claude Code just loads it in Electron (PROMPTS.md, 4 steps). After ANY future game change: re-make Final from Game (strip the same 3 things) and re-bundle.
- Fixed: the progress-heart pips used <img src="{{ p.src }}"> which fired a bad request on load. Now a div with a background image.
- Claude Code handoff made: `design_handoff_bdap_game/` (README.md, PROMPTS.md with 13 small build steps, NOTES.md, CLAUDE.md, reference/ = game file + support.js + assets). Re-copy NOTES.md into it if anything changes after this.
- Fix: pile overlapped the assembled text (the last letters of the letter sat on TOP of the pile, right under the text, and stayed there until the end). Pile order is now reversed: the first letters of the letter sit on top of the pile (and drop last), the last letters at the bottom. Unscrambling now eats the pile from the top down, away from the text.
- Letter slowed again. Drop: gravity .5 → .32, max 14 → 10, one letter every 5 → 9ms (~8s pile). Unscramble: each letter 2600 → 3400ms, stagger min(40, 7000/n) → min(60, 16000/n) (~19s total). Camera follow offset 1300 → 1700ms to match.
- Unscramble camera: the letter view now FOLLOWS the line being written. Each frame it targets the letter that is landing right now (index = (t − 1300ms) / stagger) and keeps its line ~42% down the view, eased 5% per frame. Replaces the old fixed scroll-to-top.
- Letter scramble/unscramble slowed (user: "way too fast"). Drop: gravity .9 → .5, max speed 22 → 14, one letter every 2.4 → 5ms (~4.5s for the whole pile). Unscramble: each letter 1500 → 2600ms, stagger min(40, 3600/n) → min(40, 7000/n) (~10s total), auto-scroll to top 2.6 → 6s.
- REAL LETTER TEXT from the user (verbatim, capitals and punctuation kept — overrides the lowercase rule for the letter only).
- Letter is ONE tall scrollable sheet (pagination tried and removed — user found it buggy). Paper = flat #F4D29C with 4px black border (matches paper.png), inside a scroll box 320x420 (shown at .86) with a thin scrollbar (scrollbar-width: thin, #B8875A thumb).
  - Text: Indie Flower 17px, auto word-wrap at 244px, line 23px, 12px paragraph gap; "love, Prim" right-aligned. Sheet height = text height + room for the pile.
  - Drop: opens scrolled to the BOTTOM. No collision physics anymore (it overlapped). Each letter gets its own slot in a tall stack: 24 columns, 11px cells, rows build upward from the bottom, every other row offset half a cell, columns shuffled per row, ±1.25px jitter and a random tilt, so letters never overlap. Letters drop fast (gravity .9/frame, max 22) one after another every 2.4ms, with a small bounce and a throttled thud. User can scroll up through the empty sheet.
  - Unscramble: letters hop up and fly to their spots while the sheet auto-scrolls to the top over 2.6s. Stagger = min(40ms, 3600ms / letters).
  - Done → sheet trims to the text height (no empty paper below). letterAllDone (heart progress on close). "↺ scramble" re-drops. Reopening keeps the assembled letter, scrolled to the top.
- Letter font FINAL: Indie Flower 21px (user pick). Zoomed polaroid captions also switched from Gaegu to Indie Flower 24px so the handwriting matches. Removed unused font loads (Press Start 2P, Pixelify Sans, Gaegu, VT323). Removed Shadows Into Light, the `letterFont` prop and the "letter: shadows/indie" test buttons.
- Inside walking a bit faster: `SPD_IN = 5.3` px/tick inside (outside stays `SPD = 4`). Inside sprites are drawn 4x vs 3x outside, so this is the SAME speed in art pixels (~1.33 art px/tick) — characters still all walk at one speed. Prim follows at the same speed.
- Unscramble: letters no longer fly so high — apex 45–90px above (was 150–260), sideways drift ±35px (was ±60). Spin + bouncy landing kept.
- Outside: the cabin's yellow hover outline now draws UNDER cyrus (outline z 1, prim z 2, cyrus z 3, front trees z 4).
- Made Letter Fonts.dc.html with handwriting font options for the letter.
- Buttons tighter: inner padding 7/15/9 and 7/17/9 → 4px 10px 6px; dialog buttons 8/18/10 → 5px 12px 7px (less empty space around the text). Popup ✕ unchanged (fixed 28px square).
- Font: user picked DotGothic16 (Font Options 1b). Replaced VT323 and Press Start 2P everywhere in the game (terminal intro/outro, tip text, captions, cake/letter tips, dialog, buttons, ✕). Letter stays Gaegu.
- Pinboard slower again: board pop 900 → 1400ms, photo zoom 900 → 1500ms, dim 700 → 1100ms.
- Envelope → letter slower: frames 200 → 300ms, envelope sink 600 → 1000ms, paper rise + flash 900 → 1500ms, pause before paper 260 → 450ms.
- Unscramble redone, more aggressive: each letter shoots up high with a spin, then falls into place with a bounce (was a gentle arc).
- Big heart: permanent yellow pixel outline.
- Font: Pixelify Sans replaced by Press Start 2P everywhere it was used (buttons, ✕, small UI). 14px → 9px, 16px → 12px.
- Bug: clicking prim a second time sometimes showed no heart (the bubble stayed mounted so its animation didn't replay). Now the bubble is cleared and re-added on every click.
- New: clicking prim OUTSIDE → annoyed squiggle bubble (`assets/squiggle_bubble.png`, placeholder) instead of hearts.
- New: going inside from outside in prim mode, prim rushes to the door first (7px/tick) and disappears in; cyrus follows.
- Walk speed unified: everyone walks at 4px/tick everywhere (was 3/6/8/9/7 depending on the case). Only prim's rush to the door is faster.
- Open: user wrote "when prim appears." on its own — unclear what it refers to; asked.
- Outside tip text "click the cabin to go inside" now waits until cyrus finishes walking into the frame (also held while he walks to the door), then types on ~0.7s later.
- Corrected the notes: `cyrus_jump.png` is a Claude-made placeholder (edited from the user's standing frame), not user-drawn.
- Full audit: rewrote "Current spec" to match the game exactly (assets + frame layouts, modes, flow, timings, tip-text stages, end confirm, test bar). Updated CLAUDE.md.

### 2026-11-10
- Slowed: quest-item zoom on click (cake/envelope/board) 460 → 800ms; small → big envelope pop 320 → 650ms; cat breathing 900 → 1600ms per frame; letter unscramble 1000ms/28ms stagger → 1600ms/45ms; walk-cycle frames (cyrus + prim) 150 → 240ms; pinboard popup + photo zoom pop 320 → 900ms (photo dim fades in 700ms); heart merge 1.5 → 2.6s, burst 0.9 → 1.5s, big heart pop 520 → 800ms.
- Bug fix: "click the cake to start the party...." now shows exactly once in the whole app (first time in the dim room). Never again after it plays once or after the cake is opened (`cakeTipDone`, `cakeSeen`).
- Cake progress counts as soon as the candle is blown (`done.cake` set in doBlow). Relighting/re-blowing never removes it.
- Prim mode: after prim's arrival + jump, the game no longer auto-goes to the ending. Cyrus is free (inside/outside, all items, cat, plant, prim). The bottom-right arrow opens an "end the party?" popup (cream dialog, wood "not yet" / red "end it ♥"). "end it" fades to the ending terminal; "not yet" or clicking outside closes it.
- Walk to the cabin door (outside, after clicking the house) also half speed: 3px per tick (duration = distance/3 × 60ms, min 600ms), matching the walk-in.
- Walk-in from the left edge slowed to half speed (6 → 3px per tick) for both the inside entry and the first outside arrival. Normal walking (arrows, walking to items/door) unchanged.
- Screen transition (outside ⇄ inside fade) slowed: fade 360ms/4 steps → 800ms/8 steps, black hold 60 → 250ms, screen swap at 850ms. Also removed a stray offset (left -34px, top 73px) on the fade overlay that kept it from covering the whole square.
- Walk targets: cake → cyrus x 78 (left of cake), envelope → x 232 (left of envelope) so he no longer stands on top of them.
- Envelope: opening frames faster (290→200ms). New transition: after the last frame the envelope sinks + fades (600ms) while the paper rises out of it, grows past full size and settles (900ms, overshoot) with a warm flash + two-note chime, then the letter popup takes over seamlessly. The envelope animation now plays EVERY time; the scrambled/unscrambled state is kept in `state.letterPhase` ('drop' | 'assemble' | 'done') and the letter opens in that state after the envelope.
- Letter: "unscramble" button replaced by tip-style text "click to unscramble" (types on 90ms/char, bottom). "close" button removed — ✕ in the top-right instead. "↺ scramble" stays once assembled.
- ✕ close buttons added to the envelope, letter and pinboard popups (same as cake).
- "one more thing" text removed. At 3/3 the progress hearts pulse + glow (staggered) and the tip says "click the hearts!". Clicking them: hearts arc up to the center, spiral in and merge (1.5s, custom JS easing — no library needed, keeps the Electron app offline), then a big heart pops in with a burst of 8 mini hearts + chime; tip "click the big heart!". Clicking the big heart starts the prim cutscene. State: `mergeAt`, `bigGone`. In prim mode the bare right arrow (bottom-right) still goes to the ending.
- Cake popup "make a wish, then blow!" typing slowed 45 → 110ms per character (~2.5s for the whole line).
- Cake popup layout change: "make a wish, then blow!" moved out of the camera frame to the bottom (top 444) in tip-text style (VT323 24px, cream + plum outline); types on (45ms/char) starting 1.8s after open (after the open animation), stays — no fade for now; hides once blown. Progress bar shorter (220→150px, centered at 416). "blow it out" fallback now appears (still 8s) to the RIGHT of the bar (left 50%+88px), bar doesn't move.
- Cake popup spacing: cake 244→228 (plate ends ~404), glow 212→196, bar 414→416 (~12px gap under plate), "blow it out" 430→440 (~12px gap under bar, ends ~470).
- Cake popup: everything shifted up for breathing room at the bottom — frame top 50→36, hat 62→48, cake 262→244, candle glow 230→212, progress bar 434→414, "blow it out" 450→430 (ends ~460, ~20px margin), ✕ top 8→4.
- "blow it out" fallback now appears 8s after the cake popup opens in all cases (was 7s with a camera, 2.2s without — so in previews with no camera it was showing almost right away).
- "blow it out" fallback moved to bottom-center, directly under the progress bar: top 450, scaled .82 (~30px tall, ends ~480 minus margin). Progress bar stays at 434 (no nudge) so it doesn't overlap the cake plate.
- Cake popup: "blow it out" fallback button hidden at first so the user tries blowing. Appears (fade in) after 7s of the popup being open while the candle is still lit, or after 2.2s if there's no camera/mic. Lives at the top-left strip above the frame (mirrors the ✕ at top-right). Progress bar is now alone and centered under the frame, wider (150→220px). Relight/continue still show after blowing.
- Cake popup open animation slowed again ~25%: frame 1550ms, TV-on 1850ms, cake 1650ms, hat 2150ms, controls 2050ms.
- Cake popup open animation slowed ~35%: frame expand 900→1250ms, TV-on 1100→1500ms, cake rise 1000→1350ms, hat drop 1300→1750ms, controls 1200→1650ms.
- Dim room (before first blow): cyrus is no longer dimmed — full brightness like the cake and party lights (removed roomDim filter from his sprite).
- Outside, first arrival (from the intro): cyrus starts off-screen left (x -84) and walks in to his spot (x 28) using the outGoal walk, like the inside entry. Coming out of the cabin still starts at the door.
- Heart bubble from cyrus now appears EVERY time a quest-item popup closes (cake / letter / board), in both solo and prim mode — before it only fired the first time an item was completed, so replays/prim mode showed none. Cat keeps its own heart on every click in both modes.
- Pinboard counts as done (1 heart of progress + bubble) as soon as it's opened and closed, no matter how many photos were viewed (was: all 4 photos).
- Enter/exit clarified by user: outside → click house → walk to door at normal walk speed (6px/tick; duration now computed from distance instead of fixed 1300ms) → fade → inside, cyrus (and prim behind him) walk in from off-screen left and stop on the left (cyrus x 40 solo / 140 with prim). Same as the first entry. Bug guards: items/cat/plant can't be clicked during the enter/exit walk or fade (was interrupting the entry walk); clicking the house clears any pending walk goals.
- Heart bubbles slower: 2400ms (was 1300), 12 steps, for cyrus/prim/cat.
- Outside: front trees layer (house_trees_front.png) now z-index 4, above both cyrus and prim (prim had z-index 2 and was drawing over the tree). Prim still clickable where not covered.
- Outside hover outline: removed stray yellow bits around the house windows from house_outline.png (kept only the silhouette).
- Heart bubbles for cyrus + prim inside now pop from the top-right of their heads (x + 80, top 218).
- Inside: the left "go outside" pixel arrow (bottom-left) is now always visible whenever no popup/zoom/cutscene/exit walk is running (was only shown after 3/3).
- Cat moved onto the window sill (right of the cactus): left 378, top 146, z-index 5 — above the floor band so cyrus/prim can never cover it. Heart + z moved with it. Clicking cat walks cyrus to x 300 (under the window), facing right.
- Captions (cat / cactus / window / prim etc.) moved to the same spot as the tip text (bottom 60px → 10px). Font, size, color, outline and fade already matched the tip text.
- Intro/ending terminal redesigned light + cozy (user: old one too dark, didn't fit the assets): warm peach wall (#F6DCCB) with faint white 8px checkerboard + pink scalloped trim at top; a retro desktop window (4px plum #4A2230 notched frame, hard 8px offset shadow) with pink pinstriped title bar "bdap.exe" + three decorative buttons (_ □ x); cream screen (#FFF7EE) with plum VT323 text, pink block caret, very faint scanlines. "click anywhere…" hint in dusty rose under the window. Matches Birthday Pixel Kit (WindowFrame, cream→pink, no dark backgrounds).
- "Quest items" = cake, board, letter (user's term). Clicking one: cyrus walks over, then the item zooms (clone of its room sprite flies to screen center and scales up 2–5x over 460ms with a little squash + brighten, room dims), then its popup opens with its own open animation. Rising whoosh sfx. Logic: `zoomThen(key, fn)`, state `zoomItem`.
- Confetti: when the candle is blown out (mic or button), 450ms later (after the smoke puff) pixel confetti bursts up from the cake + side cannons from both bottom corners + a short rain from the top, on a canvas over the whole cake popup. 2px-snapped squares/strips that flip as they fall, 8 pastel colors (pinks, gold, mint, blue, peach, cream, lilac). Tiny sparkle sfx. Re-triggers after relight + blow again.
- Cat nudged 24px left (left 80 → 56); heart, z and cyrus walk-to target moved with it.
- Arrows: new pixel-art arrow sprite assets/arrow.png (8x13, dark plum outline, cream fill, light top edge, tan shade), shown 3x (24x39) to match the 4x-ish asset scale. Right arrow ("one more thing") moved to bottom-right corner (hearts are hidden by then); left arrow (outside) uses same sprite flipped, bottom-left. Both keep the nudge loop.
- Moved cat to left of the table, behind/under the characters (user drawing): left 80, top 262; heart + z moved with it. Cyrus/prim draw on top of the cat (overlap allowed now), CX_MAX back to 368. Clicking cat walks cyrus to x 60.
- Cake popup open animation: frame expands from a thin line near the cake (squash → stretch overshoot → settle, 900ms); webcam "powers on" like an old TV (bright line opens vertically, then image flashes from overexposed to normal in 8 steps); cake rises in with bounce; party hat drops onto the frame and wobbles; controls slide up last.
- Progress hearts: added explicit `state.progress` (0–3, kept in sync with `state.done` = {cake, letter, board} each tick); pips render from `progress`. Redrew heart_empty.png as a hollow outline (light mauve edge, dark see-through center) so 0/3 clearly reads as empty — the old empty heart was a solid muted pink that looked filled in the dim room.
- Moved cat up to the right of the table (user drawing): left 386, top 282 (was 384/392); heart + z moved with it. Cyrus still stops at x 290 when walking to it.
- Added test buttons "dim (unblown)" (inside, candle never blown, room dimmed, only cake clickable) and "lit (blown)" (inside, cake done, room at normal brightness, other items unlocked, 1/3 progress).
- Tip text (user's name for the quest/hint line): moved lower (bottom 60px → 10px) so it never covers cyrus. Typewriter only on its first appearance; later reminders appear instantly at full text, hold, then fade.
- Added "prim mode" test button: skips to after the prim cutscene (all items done, prim following cyrus in the room).
- Slowed letter physics (gentler gravity/terminal speed, slower assemble + stagger) and envelope opening a little (220→290ms/frame).
- Date label ("nov 12") now computed from today's date; `demoDate` prop pins it to nov 12 for the demo. Wrote candle-blow logic notes for the Claude Code rebuild.
- Cake popup: removed "happy birthday cyrus!" caption after the candle is blown (caption empty once blown; "make a wish, then blow!" still shows while lit).
- Removed the "no camera, use the button!" message in the cake popup (no-camera state now shows nothing; "turning on your camera…" still shows while asking).
- Cake popup: moved ✕ out of the camera frame to the top-right strip above it; frame shortened (top 16→50, h 322→288), hat moved down 28px to stay on the frame's top edge.
- Unified "quest" text: cabin / cake / view N more items share identical font, size, typewriter + slow fade, and reappear every ~13s until done. Tracks 1/3 vs 2/3 ("two more" vs "one more").
- Prim follow: gap +1 art px (inside 96→100, outside 72→75) and ~300ms start/stop delay via breadcrumb position history (researched: EarthBound/classic RPG party trails).
- "one more thing" arrow moved to bottom-center so it no longer overlaps/steals clicks from the cat.
- Replaced "◀ outside" and "one more thing ▶" plank buttons with bare clickable pixel arrows (no button chrome); "one more thing" kept as small terminal-font label beside the right arrow.
- Defined solo vs prim mode for outside spawn: start of game = cyrus at left; solo exit = cyrus at door; prim exit = prim at door, cyrus to her right. Removed the auto walk-out to the right after exiting.
- "click to open" under envelope: switched from system font to VT323 terminal style (28px, cream with dark pixel outline + pink glow), matching captions/tooltip.
- Prim now always follows cyrus (left of him), never overlaps; walks with him in/out of the cabin.
- Moved cyrus & prim up 24px; moved cat to floor under window (bottom-right); CX_MAX back to 290.
- Exiting the cabin: characters appear at the house door and walk out right.
- Clicking prim → both heart bubbles, no caption.
- Guide captions smaller (24px), no blink, slow fade.
- Room never re-dims after the initial dark intro.
- Test button bar moved above the window, smaller/faint.
- "◀ outside" makes cyrus walk off-screen left before fading.
- "click to open" → default system font, removed ✦ symbols.
- Window hover outline traced from the actual window art (curtain rod bulge, rounded corners).
- Cake popup redesigned: large pink pixel-frame rectangle; cake-first gating; "click the cake to start the party...." and "view two more items to proceed" captions.
- Prim cutscene + outro replay; prim click caption (later removed).
- Cat/plant/window captions; cyrus walks to objects before interacting.
- Notes file created (earlier history reconstructed from memory, less detailed).

### Earlier (summary)
- Explored many styles; user picked "farm sim" pixel style (Stardew/Omori inspired), snowy cabin story.
- Built sprite drafts page with sizes; user switched to 120x120 scene scale; photo book idea reverted to pinboard.
- User supplied art: house, room, envelope (small + open strip), party hat, cake frames, lights, boards, polaroid, heart bubble, paper, cyrus frames.
