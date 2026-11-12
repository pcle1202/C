# QA checklist (run in the packaged app, Wi-Fi off)

Every item should match the design prototype exactly. If something differs, the cause is the Electron wrapper, not the game. Don't "fix" the game file.

## Window
- [ ] 480x480 content, can't be resized or maximized, black behind nothing, no scrollbars, no menu bar (Windows).
- [ ] Fonts are pixel DotGothic16 (UI) and handwritten Indie Flower (letter), not a default system font. If they're wrong, fonts didn't load offline.

## Intro
- [ ] A cream terminal window types "> initializing..." etc. Click skips ahead, then click continues.

## Outside
- [ ] Snow falls. Cyrus walks in from the left. Arrow keys walk.
- [ ] Hovering the cabin shows a yellow outline (under cyrus). The tip "click the cabin to go inside" types, fades, then comes back.
- [ ] Clicking the cabin: cyrus walks to the door, the screen fades, and he walks into the room from the left.

## Room
- [ ] The room is very dark with a flickering spotlight on the cake. The party lights blink. Only the cake is clickable. The tip "click the cake to start the party...." shows once.
- [ ] Cat, cactus and window: hover outline, and a caption types at the bottom.

## Cake
- [ ] Zoom-in, then the frame opens like a TV. The webcam is mirrored, the hat sits on top, and "make a wish, then blow!" types slowly.
- [ ] Blowing into the mic fills the bar, then smoke, confetti and a chime. "↺ relight" and "continue" appear.
- [ ] After closing: the room is lit normally from now on, and 1 of 3 hearts is filled bottom-right.

## Letter
- [ ] The envelope pops up, "click to open", it opens, and the paper rises out.
- [ ] Letters fall into a tall stack at the bottom with no overlaps, and the paper is scrollable (thin scrollbar).
- [ ] Click: letters hop into place while the view follows the line being written. The full letter ends with "love, Prim".
- [ ] "↺ scramble" works. After closing, 2 of 3 hearts are filled.

## Pinboard
- [ ] Board pops up with 4 polaroids. Clicking a photo zooms it with its caption; clicking again puts it back. ✕ closes. Heart bubble from cyrus.

## Ending
- [ ] At 3/3, the hearts pulse. Click: they merge into a big heart with a yellow outline. Click it: prim walks in from the right, both jump, hearts.
- [ ] Prim follows cyrus. Clicking prim inside: both show hearts. Outside: prim shows an annoyed squiggle.
- [ ] Going inside from outside: prim rushes to the door first.
- [ ] The right arrow (bottom-right) opens "end the party?". "end it ♥" goes to the outro terminal, then click goes "back to the room".

## Not bugs (intended)
- Progress isn't saved: closing the app restarts from the intro.
- The pinboard photos are pastel placeholders until real photos are added in the design project.
