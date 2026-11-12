// v2 PERMANENT PATCHES. Re-applies the 3 kept customizations to a bundle export and writes src/bdap.html.
//   usage (from the bdap-v2 root):  node tools/patch_v2.js [input.html]
//   default input: handoff/bdap.raw.html (the pristine raw export). For a new handoff, copy it over that file (or pass its path).
// Each edit must match EXACTLY once or the script aborts without writing, so a changed export fails loudly.
// Never writes to handoff/ or design_handoff/.
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.resolve(ROOT, process.argv[2] || 'handoff/bdap.raw.html');
const OUT = path.join(ROOT, 'src', 'bdap.html');
if (path.resolve(SRC) === path.resolve(OUT)) throw new Error('input and output are the same file');
const html = fs.readFileSync(SRC, 'utf8');
const re = /(<script type="__bundler\/template"[^>]*>)([\s\S]*?)(<\/script>)/;
const m = html.match(re);
const lead = m[2].match(/^\s*/)[0], trail = m[2].match(/\s*$/)[0];
let t = JSON.parse(m[2].trim());

function rep(name, find, to) {
  const isRe = find instanceof RegExp;
  const n = isRe ? (t.match(new RegExp(find.source, find.flags.includes('g') ? find.flags : find.flags + 'g')) || []).length : t.split(find).length - 1;
  if (n !== 1) throw new Error(`[${name}] expected exactly 1 match, got ${n}`);
  t = isRe ? t.replace(find, to) : t.replace(find, () => to);
  console.log('ok  ', name);
}

// KEEP 1: smaller hat, kept at the top of the camera frame (art is 20x22 -> 3x = 60x66, integer scale)
rep('hat smaller/top',
  'animation:hatDrop 2150ms cubic-bezier(.3,.7,.4,1) both;position:absolute;left:184px;top:48px;width:112px;height:123px;',
  'animation:hatDrop 2150ms cubic-bezier(.3,.7,.4,1) both;position:absolute;left:210px;top:40px;width:60px;height:66px;');

// KEEP 3: letter replay (3a-3d). 3a: remember the y of the "love, prim" line
rep('layout signY',
  'wrap(p).forEach(ln => { const W = m.measureText(ln).width; let x = sign ? 286 - W : X0;',
  'wrap(p).forEach(ln => { const W = m.measureText(ln).width; let x = sign ? 286 - W : X0; if (sign) this.signY_ = y + LH / 2;');

// 3b. draw the replay icon + "scramble" inside the letter once it is fully unscrambled (no box)
rep('draw replay',
  "ctx.fillStyle = '#4A3426'; ctx.fillText(t.ch, 0, 0); ctx.restore(); }\n",
  "ctx.fillStyle = '#4A3426'; ctx.fillText(t.ch, 0, 0); ctx.restore(); }\n" +
  `      if (ph === 'done' && this.signY_ != null) { const cx = X0r + 6, cy = this.signY_, rr = 5, th = -.36, col = '#9A7550';
        ctx.save(); ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 - 5, true); ctx.stroke();
        const ex = cx + rr * Math.cos(th), ey = cy + rr * Math.sin(th), tx = Math.sin(th), ty = -Math.cos(th), nx = Math.cos(th), ny = Math.sin(th);
        ctx.beginPath(); ctx.moveTo(ex + tx * 4.2, ey + ty * 4.2); ctx.lineTo(ex + nx * 3, ey + ny * 3); ctx.lineTo(ex - nx * 3, ey - ny * 3); ctx.closePath(); ctx.fill();
        ctx.font = "400 15px 'Indie Flower', cursive"; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText('scramble', cx + 11, cy + 1); ctx.restore(); }
`);
// X0r = left margin of the letter text (34), declared next to the other loop constants
rep('X0r const', 'const R = 5, FLOOR = H - 14, L = 22, Rt = 298;', 'const R = 5, FLOOR = H - 14, L = 22, Rt = 298, X0r = 34;');

// 3c. clicking the finished letter scrambles it again (same as the old button)
rep('letterClick replay + speed-up',
  "      this.setState({ letterPhase: 'assemble' });\n    }\n  };",
  "      this.setState({ letterPhase: 'assemble' });\n    } else if (ph === 'assemble') {\n      if ((this.asmSpeed || 1) < 6) { this.asmSpeed = 6; this.sfx(520, .08, 'triangle', .04, 1.6); }\n    } else if (ph === 'done') {\n      this.sfx(300, .1, 'triangle', .04, .6); this.setState({ letterPhase: 'drop' }, () => this.startLetter());\n    }\n  };");

// 3d. old "↺ scramble" button -> "click outside to continue ▶" (same style as the pinboard hint)
rep('letter bottom hint',
  /(<sc-if value="\{\{ letterDone \}\}" hint-placeholder-val="\{\{ false \}\}">)[\s\S]*?(<\/sc-if>)/,
  `$1\n              <div class="px pxbob" style="font-size:16px;color:#FFF2C8;pointer-events:none;margin-top:14px;white-space:nowrap">click outside to continue ▶</div>\n            $2`);

// KEEP 2: prim hover (4a) + scribble bubble (4b). 4a: prim hover outline outside (3px = 1 art pixel at the outside 3x scale)
rep('prim hover outside',
  'transform:{{ outPrimFlip }};cursor:pointer;z-index:2">',
  'transform:{{ outPrimFlip }};cursor:pointer;z-index:2" style-hover="filter:drop-shadow(3px 0 0 #FFE38A) drop-shadow(-3px 0 0 #FFE38A) drop-shadow(0 3px 0 #FFE38A) drop-shadow(0 -3px 0 #FFE38A)">');

// 4b. squiggle bubble at the top-right of prim's head (same anchor proportions as the indoor heart: 80/112 of the sprite width)
rep('annoy markup',
  /(<sc-if value="\{\{ annoyOn \}\}"[^>]*><img class="heart" src="[^"]*" style="position:absolute;left:)\{\{ outPrimHX \}\}(;top:)\{\{ outHY \}\}/,
  '$1{{ annoyHX }}$2{{ annoyHY }}');
rep('annoy vals',
  "outPrimHX: Math.round((st.pox ?? 164) + 22) + 'px', outCyHX:",
  "annoyHX: Math.round((st.pox ?? 164) + 60) + 'px', annoyHY: Math.round(walkY - 24) + 'px', outPrimHX: Math.round((st.pox ?? 164) + 22) + 'px', outCyHX:");

// ===================== v2 FEATURES (added 2026-11-12) =====================
// replace everything from `startStr` up to (not including) `endStr`
function repBetween(name, startStr, endStr, to) {
  const a = t.split(startStr).length - 1;
  if (a !== 1) throw new Error(`[${name}] start anchor expected 1 match, got ${a}`);
  const i = t.indexOf(startStr), j = t.indexOf(endStr, i);
  if (j < 0) throw new Error(`[${name}] end anchor not found`);
  t = t.slice(0, i) + to + t.slice(j);
  console.log('ok  ', name);
}

// F1. prim cutscene: when prim reaches cyrus she STOPS (phase 'greet') and the tip-text caption
//     "a prim has appeared!" types in + slowly fades (say() = same style as the tip text). THEN the usual jump + hearts.
const PRIM_MSG = 'a prim has appeared!';
repBetween('F1 greet instead of jump',
  "if (nx <= tgt) { upd.prim = { ...st.prim, x: tgt, phase: 'jump' };",
  '} else upd.prim = { ...st.prim, x: nx };',
  `if (nx <= tgt) { upd.prim = { ...st.prim, x: tgt, phase: 'greet' }; clearTimeout(this.greetS); this.greetS = setTimeout(() => { if (this.state.cutscene) this.say('${PRIM_MSG}'); }, 2000); clearTimeout(this.greetT); this.greetT = setTimeout(this.primJump, 2000 + ${PRIM_MSG.length} * 45 + 3600);
      `);
// the original jump/heart sequence, now run after the caption (guarded so a reset/skip can't trigger it twice)
rep('F1 primJump method',
  '  startPrim = () => {',
  `  primJump = () => {
    const s0 = this.state; if (!s0.cutscene || !s0.prim || s0.prim.phase !== 'greet') return;
    this.setState(s => ({ prim: { ...s.prim, phase: 'jump' }, jumpAt: performance.now() }));
    this.sfx(523, .1, 'triangle', .05); setTimeout(() => this.sfx(659, .1, 'triangle', .05), 110);
    setTimeout(() => this.setState({ coupleHeartAt: performance.now() }), 1100);
    clearTimeout(this.endT); this.endT = setTimeout(() => { this.setState(s => ({ cutscene: false, moving: false, prim: { ...s.prim, phase: 'follow', mv: false } })); }, 5200);
  };
  startPrim = () => {`);
rep('F1 reset clears timers',
  'clearTimeout(this.endT); this.setState({ confirmEnd: false, cakeTipDone: false,',
  'clearTimeout(this.endT); clearTimeout(this.greetT); clearTimeout(this.greetS); this.primBubbleAt = 0; this.setState({ endWalk: false, confirmEnd: false, cakeTipDone: false,');

// F2. "END!" -> cyrus and prim walk off to the RIGHT of the screen, then the outro
rep('F2 END! starts the walk',
  "this.pop(); this.setState({ confirmEnd: false }); this.fadeTo('end'); setTimeout(() => this.startBoot(true), 900); },",
  "this.pop(); this.goalFn = null; this.setState({ confirmEnd: false, goal: null, enterWalk: false, exitWalk: false, endWalk: true }); },");
const EXIT_ANCHOR = "if (st.exitWalk && st.screen === 'inside') { this.followPrim(st, upd); this.setState(upd); return; }";
rep('F2 endWalk step', EXIT_ANCHOR, EXIT_ANCHOR + `
    if (st.endWalk && st.screen === 'inside') {
      upd.cx = st.cx + this.SPD_IN; upd.face = 1; upd.moving = true;
      if (upd.cx >= 500 && (!st.prim || st.prim.x >= 500) && !st.fade) { upd.endWalk = false; upd.moving = false; this.fadeTo('end'); setTimeout(() => this.startBoot(true), 900); }
      this.followPrim(st, upd); this.setState(upd); return;
    }`);
rep('F2 block clicks while walking off',
  'this.state.cutscene || this.state.enterWalk || this.state.exitWalk || this.state.fade) return;',
  'this.state.cutscene || this.state.enterWalk || this.state.exitWalk || this.state.endWalk || this.state.fade) return;');
rep('F2 hide arrows while walking off',
  '!st.cutscene && !st.zoomItem && !st.exitWalk && !(st.prim && st.prim.phase !== \'follow\')',
  '!st.cutscene && !st.zoomItem && !st.exitWalk && !st.endWalk && !(st.prim && st.prim.phase !== \'follow\')');
rep('F2 hide end arrow while walking off',
  "endArrowOn: !!st.prim && st.prim.phase === 'follow' && !st.popup && st.screen === 'inside' }",
  "endArrowOn: !!st.prim && st.prim.phase === 'follow' && !st.popup && !st.endWalk && st.screen === 'inside' }");

// F3. prim mode: now and then prim reacts on her own, exactly like a click on her:
//     inside = heart bubbles, outside = annoyed squiggle bubble. Random gap 15-40s (first one 12-32s after prim mode starts).
rep('F3 random prim bubble',
  "if (st.prim && st.prim.phase === 'enter' && st.screen === 'inside') {",
  `if (st.prim && st.prim.phase === 'follow' && !st.cutscene && !st.popup && !st.fade && !st.confirmEnd && !st.zoomItem && !st.primIn && !st.walkAt && !st.enterWalk && !st.exitWalk && !st.endWalk && (st.screen === 'inside' || st.screen === 'outside')) {
      const pn = performance.now();
      if (!this.primBubbleAt) this.primBubbleAt = pn + 12000 + Math.random() * 20000;
      else if (pn >= this.primBubbleAt) {
        this.primBubbleAt = pn + 15000 + Math.random() * 25000;
        if (st.screen === 'inside') { this.sfx(880, .08, 'triangle', .04, 1.3); setTimeout(() => this.sfx(1175, .1, 'triangle', .035), 90); this.setState({ coupleHeartAt: 0 }); setTimeout(() => this.setState({ coupleHeartAt: performance.now() }), 40); }
        else { this.sfx(330, .09, 'square', .03, .7); setTimeout(() => this.sfx(277, .12, 'square', .03, .8), 110); this.setState({ annoyAt: 0 }); setTimeout(() => this.setState({ annoyAt: performance.now() }), 40); }
      }
    }
    if (st.prim && st.prim.phase === 'enter' && st.screen === 'inside') {`);


// ===================== v2 EDITS round 3 (2026-11-12) =====================
// E1. cake tip: "shhh! be quiet..." shown for ~1/3 of the old time (was 6.2s: type 110ms/char + hold 3.2s + fade .7s + gap .4s; now type 40ms/char + hold .8s + fade .4s + gap .2s)
rep('E1 shhh timing (mic gate)',
  "WISH_AT = 1800 + 'shhh! be quiet...'.length * 110 + 3200 + 700 + 400;",
  "WISH_AT = 1800 + 'shhh! be quiet...'.length * 40 + 800 + 400 + 200;");
rep('E1 shhh timing (tip)',
  "aEnd = A.length * 110, hold = aEnd + 3200, fade = hold + 700, bStart = fade + 400;\n        if (t < fade) return { cakeTip: A.slice(0, Math.max(0, Math.floor(t / 110))), cakeTipOp: t < hold ? 1 : (1 - (t - hold) / 700).toFixed(2) };",
  "aEnd = A.length * 40, hold = aEnd + 800, fade = hold + 400, bStart = fade + 200;\n        if (t < fade) return { cakeTip: A.slice(0, Math.max(0, Math.floor(t / 40))), cakeTipOp: t < hold ? 1 : (1 - (t - hold) / 400).toFixed(2) };");

// E2. envelope hint
rep('E2 envelope hint', '>click to open</div>', '>click the envelope to open</div>');

// E3. clicking the letter while it unscrambles speeds it up ~6x (virtual clock so letters in flight don't jump)
rep('E3 reset virtual clock on start',
  'this.asmT0 = performance.now(); this.scrollY = null;',
  'this.asmT0 = performance.now(); this.asmV = 0; this.asmLast = 0; this.asmSpeed = 1; this.scrollY = null;');
rep('E3 virtual clock',
  "} else if (ph === 'assemble') {\n        if (sc && now > this.asmT0) {",
  "} else if (ph === 'assemble') {\n        const V = this.asmV = (this.asmV || 0) + (now - (this.asmLast || now)) * (this.asmSpeed || 1); this.asmLast = now;\n        if (sc && now > this.asmT0) {");
rep('E3 camera uses virtual clock',
  'Math.floor((now - this.asmT0 - 1700) / this.asmStag)', 'Math.floor((V - 1700) / this.asmStag)');
rep('E3 letters use virtual clock',
  '(now - this.asmT0 - i * this.asmStag) / 3400', '(V - i * this.asmStag) / 3400');

// E4. quest tips: "proceed" -> "continue"; drop the "click the big heart!" tip
rep('E4 view two more', "'view two more items to proceed'", "'view two more items to continue'");
rep('E4 view one more', "'view one more item to proceed'", "'view one more item to continue'");
rep('E4 no big-heart tip', "st.mergeAt ? (st.bigGone ? '' : 'click the big heart!') : 'click the hearts!'", "st.mergeAt ? '' : 'click the hearts!'");

// E5. pinboard copy + plant caption
rep('E5 pinboard captions',
  "const caps = ['nature things', 'reviewing food', 'the beach', 'the fair'];",
  "const caps = ['going into the mountain', 'being a food critic', 'sarasota beach', 'the perry fair'];");
rep('E5 succulent caption', "this.say('the plant he got with prim...')", "this.say('the succulent he got with prim...')");

// E6. pinboard: playful title in the empty middle of the board. Tip-text font (DotGothic16), ONE theme color (plum #4A2230, the frame/terminal color),
//     faux-bold via 1px plum text-shadow (the font has no bold weight), gently tilted lines for whimsy. Under the photos + zoom overlay, ignores clicks.
const BT = "font-family:'DotGothic16',sans-serif;font-size:25px;color:#4A2230;text-shadow:1px 0 0 #4A2230,0 1px 0 #4A2230,1px 1px 0 #4A2230;line-height:1;white-space:nowrap;";
rep('E6 pinboard title',
  '<sc-for list="{{ photos }}" as="p" hint-placeholder-count="4">',
  `<div style="position:absolute;left:166px;top:42px;width:100px;pointer-events:none;text-align:center">` +
  `<div style="${BT}transform:rotate(-6deg)">fun</div>` +
  `<div style="${BT}transform:rotate(4deg);margin-top:6px">things</div>` +
  `<div style="${BT}transform:rotate(-4deg);margin-top:6px">with</div>` +
  `<div style="${BT}transform:rotate(6deg);margin-top:6px">cyrus</div></div>\n            <sc-for list="{{ photos }}" as="p" hint-placeholder-count="4">`);

// E7. zoomed pinboard caption: keep it on one line by shrinking long captions to fit the polaroid (e.g. "going into the mountain")
rep('E7 caption markup',
  "font-weight:400;font-size:24px;line-height:1;color:#4A3426;transform:rotate(-2deg)\">{{ zCaption }}",
  "font-weight:400;font-size:{{ zCapFs }};white-space:nowrap;line-height:1;color:#4A3426;transform:rotate(-2deg)\">{{ zCaption }}");
rep('E7 caption size val',
  "zCaption: st.zoom != null ? caps[st.zoom] : '',",
  "zCaption: st.zoom != null ? caps[st.zoom] : '', zCapFs: Math.round(Math.min(24, (zfw - 18) / (Math.max(1, (caps[zi] || '').length) * .5))) + 'px',");

// E8. arrow-key tip: after the FIRST candle blow (room lit, n===1), before "view two more items to continue".
//     Types in once, then goes away when the player presses an arrow or the tip has run its course; never returns.
rep('E8 tip text',
  "return n === 1 ? 'view two more items to continue'",
  "if (n === 1 && !st.arrowTipDone) return 'use the left and right arrows to walk';\n    return n === 1 ? 'view two more items to continue'");
rep('E8 tip done',
  "    if (st.questT && st.questT.startsWith('click the cake')",
  "    if (st.questT && st.questT.startsWith('use the left') && (this.keys.ArrowLeft || this.keys.ArrowRight || (st.questAt && upd.now - st.questAt > st.questT.length * 45 + this.QHOLD + this.QFADE))) upd.arrowTipDone = true;\n    if (st.questT && st.questT.startsWith('click the cake')");
rep('E8 reset', 'cakeTipDone: false, mergeAt: 0,', 'cakeTipDone: false, arrowTipDone: false, mergeAt: 0,');

const ser = JSON.stringify(t).replace(/<\//g, '<\\u002F');
const out = html.replace(re, (_, a, _b, c) => a + lead + ser + trail + c);
fs.writeFileSync(OUT, out);
console.log('written', OUT, out.length);
