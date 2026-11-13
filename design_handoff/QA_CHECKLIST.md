# QA checklist (run in the packaged v2 app, Wi-Fi off)

Every item should match the description. Game bugs are fixed in `tools/patch_v2.js` (or the design export), never in Electron code. Sound is only synthesized beeps; there are no audio files.

## Window
- [ ] 480x480 content, can't be resized or maximized, no scrollbars, no menu bar (Windows).
- [ ] Fonts are pixel DotGothic16 (UI) and handwritten Indie Flower (letter), not a system font.

## Intro
- [ ] A terminal types "> initializing..." etc. at a calm pace (0.75x of the original). On nov 12 it ends with "today is your birthday!!". Click skips ahead, then click continues with a soft blip.
- [ ] (Other dates) after nov 12: "it's not your birthday anymore... but you can still look around!!" and he can continue. Before nov 12: "come back on november 12 :)" and the game won't continue.

## Outside
- [ ] Snow falls. Cyrus walks in from the left. Arrow keys walk.
- [ ] Hovering the cabin shows a yellow outline. The tip "click the cabin to go inside" types with a quiet tick, fades, then comes back.
- [ ] Clicking the cabin: soft blip, cyrus walks to the door, fade, he walks into the room.

## Room and cake
- [ ] The room is dark with a flickering spotlight on the cake. Only the cake is clickable. The tip "click the cake to start the party...." shows once.
- [ ] Cake: zoom-in, the frame opens like a TV, webcam mirrored, small hat at the top. "shhh! be quiet..." then "make a wish, then blow into the mic!" type silently. The mic is ignored until the second line.
- [ ] Blowing fills the bar, then smoke, confetti and a chime. No echo of your own voice from the speakers. "manual blow" also works.
- [ ] After closing: the room is lit, 1 of 3 hearts, cyrus's heart bubble. The tip "use the left and right arrows to walk" shows first, then "view two more items to continue".
- [ ] Cat, succulent and window: hover outline, a caption types at the bottom with a quiet tick. The cat's heart bubble sits a little up and to the right.

## Letter
- [ ] The envelope pops up, "click the envelope to open", it opens (soft blip), the paper slides out silently.
- [ ] Letters fall into a stack (higher, quieter thuds), then unscramble silently. Clicking during the unscramble speeds it up. The letter ends with "love, Prim".
- [ ] After it finishes, "scramble" with a replay icon sits left of "love, Prim"; clicking the letter scrambles it again. The text below reads "click outside to continue".

## Pinboard
- [ ] Board pops up with 4 polaroids and the title "fun / things / with / cyrus". Every click (open, photo, put back, close) is the same soft blip. Captions: "going into the mountain", "being a food critic", "sarasota beach", "the perry fair".

## Ending
- [ ] At 3/3 the hearts pulse. Click: they merge into a big heart. Click it: prim walks in from the right, "a prim has appeared!" types, then both jump with hearts. After she steps to cyrus's left, "hang out with prim or end the party" shows once.
- [ ] Prim follows cyrus. Clicking prim inside: both show hearts. Outside: she shows a squiggle (top-right of her head). She also reacts on her own now and then, silently.
- [ ] Going inside from outside: prim rushes to the door first.
- [ ] The right arrow (bottom-right) opens "end the party?". "END!" makes both walk off to the right, then the outro terminal; click goes back to the room.

## Not bugs (intended)
- Progress isn't saved: closing the app restarts from the intro.
