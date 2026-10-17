/* Pip and the Gray Fog — game flow, activities, and feedback. */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

  const stage = $('#stage'), act = $('#act'), fx = $('#fx');
  const KEY = 'pip-garden-v1';
  const state = { scale: 1, done: load(), ch: 0, qi: -1, questions: [], wrong: 0, locked: false, ctx: {}, replay: null, intro: -1 };

  /* ---------- fit the 1600×900 stage to any screen ---------- */
  function fit() {
    state.scale = Math.min(innerWidth / 1600, innerHeight / 900);
    stage.style.setProperty('--s', state.scale);
  }
  addEventListener('resize', fit);
  fit();

  /* ---------- progress ---------- */
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state.done)); } catch { /* private mode: progress lasts this session only */ } }
  function setGloom() {
    const g = 1 - state.done.length / CHAPTERS.length;
    document.documentElement.style.setProperty('--gloom', g.toFixed(3));
    document.documentElement.classList.toggle('all-done', state.done.length === CHAPTERS.length);
  }

  /* ---------- world + Pip ---------- */
  $('#world').innerHTML = ART.garden();
  $$('.pip').forEach(p => { p.innerHTML = ART.pip(); });
  Voice.on('start', () => $$('.pip').forEach(p => p.classList.add('talking')));
  Voice.on('end', () => $$('.pip').forEach(p => p.classList.remove('talking')));
  setGloom();

  function mood(m) {
    $$('.pip').forEach(p => { p.classList.remove('yay', 'oops'); void p.offsetWidth; p.classList.add(m); });
    clearTimeout(mood.t);
    mood.t = setTimeout(() => $$('.pip').forEach(p => p.classList.remove(m)), 1000);
  }
  function bubble(text, sel = '#bubble') {
    const b = $(sel); if (!b) return;
    b.classList.remove('on');
    if (!text) return;
    b.textContent = text;
    void b.offsetWidth;
    b.classList.add('on');
  }
  function talk(text, { bubble: sel = '#bubble', done } = {}) {
    if (sel) bubble(text, sel);
    Voice.say(text, done);
  }

  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('on', s.id === id));
    state.screen = id;
  }

  /* ---------- global controls ---------- */
  let unlocked = false;
  addEventListener('pointerdown', () => { if (!unlocked) { unlocked = true; SFX.unlock(); Voice.unlock(); } }, true);
  document.addEventListener('contextmenu', e => e.preventDefault());

  $('#btn-sound').onclick = () => {
    const on = !Voice.enabled;
    Voice.enabled = on; SFX.enabled = on;
    $('#btn-sound').classList.toggle('muted', !on);
    $('#btn-sound').setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
  };
  $('#btn-full').onclick = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
  };
  addEventListener('keydown', e => {
    if (state.screen !== 'play') return;
    if ((e.key === 'ArrowRight' || e.key === 'Enter') && $('#btn-next').classList.contains('on')) { e.preventDefault(); next(); }
    if (e.key === 'r' || e.key === 'R') state.replay && state.replay();
  });

  /* ---------- title + story ---------- */
  function goTitle() {
    Voice.stop();
    state.intro = -1;
    $('#btn-play').textContent = state.done.length ? 'Continue' : 'Play';
    $('#btn-reset').style.visibility = state.done.length ? 'visible' : 'hidden';
    bubble('', '#bubble-title');
    show('title');
  }
  $('#btn-play').onclick = () => {
    SFX.pop();
    if (state.intro === -1 && state.done.length) return goMap();
    state.intro++;
    if (state.intro < INTRO.length) {
      if (state.intro === 1) SFX.whoosh();
      talk(INTRO[state.intro], { bubble: '#bubble-title' });
      $('#btn-play').textContent = state.intro === INTRO.length - 1 ? "Let's go!" : 'Next';
    } else {
      goMap();
    }
  };
  $('#btn-reset').onclick = () => { state.done = []; save(); setGloom(); goTitle(); };

  /* ---------- garden map ---------- */
  const MAP_POS = [[200, 760], [430, 600], [650, 760], [870, 590], [1090, 745], [1300, 585], [1440, 360]];

  function trailPath(pts) {
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
    }
    return d;
  }
  $('#trail').innerHTML = (() => {
    const d = trailPath(MAP_POS);
    return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="58" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#F3D9A4" stroke-width="44" stroke-linecap="round"/>
      <path d="${d}" fill="none" stroke="#FFF3D6" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 30"/>`;
  })();

  function nextIndex() {
    const i = CHAPTERS.findIndex(c => !state.done.includes(c.id));
    return i;
  }

  function goMap(fromChapter = false) {
    Voice.stop();
    const stops = $('#stops');
    stops.innerHTML = '';
    const ni = nextIndex();
    CHAPTERS.forEach((ch, i) => {
      const [x, y] = MAP_POS[i];
      const done = state.done.includes(ch.id);
      const b = h('button', `stop${done ? ' done' : ''}${i === ni ? ' next' : ''}${ch.id === 'bloom' ? ' final' : ''}`,
        `<span class="stop-disc" style="--c:${ch.color}">${ART[ch.icon]()}<span class="stop-num">${i + 1}</span></span><span class="stop-name">${ch.name}</span>`);
      b.style.left = `${x}px`; b.style.top = `${y}px`;
      b.setAttribute('aria-label', `${ch.name}${done ? ', finished' : ''}`);
      b.onclick = () => { SFX.pop(); startChapter(i); };
      stops.append(b);
    });
    const count = state.done.length;
    $('#sign-progress').innerHTML = CHAPTERS.map((c, i) => `<i class="${i < count ? 'got' : ''}">${ART.bloom()}</i>`).join('');
    show('map');
    // let the screen paint first so the color change is visible as a transition
    requestAnimationFrame(() => requestAnimationFrame(setGloom));
    const line = ni === -1 ? 'The whole garden is full of color! Tap any spot to play again.' : CHAPTERS[ni].mapSay;
    if (fromChapter) { SFX.whoosh(); talk(`${pick(FOG_LINES)} ${line}`, { bubble: '#bubble-map' }); }
    else talk(line, { bubble: '#bubble-map' });
  }

  /* ---------- chapter flow ---------- */
  function startChapter(i) {
    Voice.stop();
    state.ch = i;
    const ch = CHAPTERS[i];
    state.questions = ch.build ? ch.build() : ch.questions;
    state.qi = -1;
    $('#play').style.setProperty('--ch', ch.color);
    $('#chapter-tag').innerHTML = `<span class="tag-icon">${ART[ch.icon]()}</span><span>${ch.name}</span>`;
    $('#dots').innerHTML = state.questions.map(() => '<i class="dot"></i>').join('');
    show('play');
    learn();
  }

  function resetActivity() {
    state.locked = false;
    state.wrong = 0;
    state.ctx = {};
    act.onpointerup = null;
    act.innerHTML = '';
    $('#btn-next').classList.remove('on');
    $('#play').classList.remove('can-next');
    $('#meter').innerHTML = '';
    bubble('');
  }

  function setPrompt(text) {
    const p = $('#prompt-text');
    p.textContent = text;
    p.classList.toggle('long', text.length > 64);
    p.classList.remove('fresh'); void p.offsetWidth; p.classList.add('fresh');
  }

  function learn() {
    resetActivity();
    const L = CHAPTERS[state.ch].learn;
    setPrompt(L.title);
    updateDots(-1);
    act.className = 'act act-learn';
    act.innerHTML = `<div class="learn">
      <div class="learn-art">${L.art()}</div>
      <div class="learn-text">
        <p class="learn-word">${L.word}</p>
        ${L.lines.map((l, i) => `<p class="learn-line" data-i="${i}">${l}</p>`).join('')}
        <button class="btn btn-go" id="btn-ready">I'm ready!</button>
      </div></div>`;
    $$('.learn-line', act).forEach(p => { p.onclick = () => readLearn([+p.dataset.i]); });
    $('#btn-ready').onclick = () => { Voice.stop(); next(); };
    state.replay = () => readLearn();
    readLearn();
  }

  function readLearn(only) {
    const L = CHAPTERS[state.ch].learn;
    const lines = $$('.learn-line', act);
    const queue = only ? only.map(i => ({ i, t: L.lines[i] })) : [{ i: -1, t: L.title }, ...L.lines.map((t, i) => ({ i, t }))];
    const run = k => {
      lines.forEach(l => l.classList.remove('reading'));
      if (k >= queue.length) return;
      if (queue[k].i >= 0) lines[queue[k].i].classList.add('reading');
      Voice.say(queue[k].t, () => run(k + 1));
    };
    run(0);
  }

  function updateDots(current) {
    $$('#dots .dot').forEach((d, i) => {
      d.classList.toggle('done', i < current);
      d.classList.toggle('now', i === current);
    });
  }

  function next() {
    SFX.pop();
    state.qi++;
    if (state.qi >= state.questions.length) return chapterDone();
    const q = state.questions[state.qi];
    resetActivity();
    updateDots(state.qi);
    setPrompt(q.prompt);
    act.className = `act act-${q.type}`;
    RENDER[q.type](q);
    state.replay = () => Voice.say(q.prompt);
    Voice.say(q.prompt);
  }
  $('#btn-next').onclick = next;
  $('#btn-say').onclick = () => { SFX.pop(); state.replay && state.replay(); };
  $('#btn-home').onclick = () => { SFX.pop(); goMap(); };

  function chapterDone() {
    const ch = CHAPTERS[state.ch];
    if (!state.done.includes(ch.id)) state.done.push(ch.id);
    save();
    updateDots(state.questions.length);
    if (ch.id === 'bloom') return finale();
    const badge = $('#done-badge');
    badge.innerHTML = ART[ch.icon]();
    badge.style.setProperty('--c', ch.color);
    $('#done-title').textContent = ch.doneTitle;
    $('#done-text').textContent = ch.recap;
    show('done');
    SFX.win(); mood('yay'); confetti(70);
    talk(`Hooray! ${ch.doneTitle} ${ch.recap}`, { bubble: null });
  }
  $('#btn-map').onclick = () => { SFX.pop(); goMap(true); };

  function finale() {
    $('#award-badges').innerHTML = CHAPTERS.slice(0, 6).map(c =>
      `<figure style="--c:${c.color}"><span>${ART[c.icon]()}</span><figcaption>${c.name.toLowerCase()}</figcaption></figure>`).join('');
    show('final');
    requestAnimationFrame(() => requestAnimationFrame(setGloom));
    SFX.whoosh();
    setTimeout(() => { SFX.win(); confetti(140); mood('yay'); }, 600);
    const sentences = FINALE.match(/[^.!?]+[.!?]+/g).map(s => s.trim());
    const sayNext = i => { if (i < sentences.length) Voice.say(sentences[i], () => sayNext(i + 1)); };
    sayNext(0);
  }
  $('#btn-again').onclick = () => { SFX.pop(); state.done = []; save(); setGloom(); goTitle(); };
  $('#btn-final-map').onclick = () => { SFX.pop(); goMap(); };

  /* ---------- feedback ---------- */
  function wrong(q, msg, key) {
    state.wrong++;
    SFX.wrong();
    mood('oops');
    talk(`${pick(OOPS)} ${msg || q.hint}`);
    if (state.wrong >= 2 && state.ctx.hint) state.ctx.hint(key);
  }
  function stepRight(src, msg) {
    SFX.step();
    burst(src, 10);
    mood('yay');
    talk(msg || pick(STEP));
  }
  function complete(q, src) {
    state.locked = true;
    if (state.ctx.clearSel) state.ctx.clearSel();
    SFX.correct();
    burst(src, 28);
    mood('yay');
    updateDots(state.qi + 1);
    talk(`${pick(PRAISE)} ${q.yes}`);
    setTimeout(() => { $('#btn-next').classList.add('on'); $('#play').classList.add('can-next'); }, 650);
  }

  function burst(src, n = 16) {
    if (!src) return;
    const sr = stage.getBoundingClientRect(), r = src.getBoundingClientRect();
    const x = (r.left + r.width / 2 - sr.left) / state.scale, y = (r.top + r.height / 2 - sr.top) / state.scale;
    for (let i = 0; i < n; i++) {
      const p = h('i', 'bit', pick(BITS));
      const a = Math.random() * Math.PI * 2, d = 90 + Math.random() * 180;
      p.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 50}px;--r:${Math.random() * 540 - 270}deg;animation-duration:${700 + Math.random() * 500}ms`;
      fx.append(p);
      setTimeout(() => p.remove(), 1300);
    }
  }
  function confetti(n = 70) {
    for (let i = 0; i < n; i++) {
      const p = h('i', 'confetti', pick(BITS));
      p.style.cssText = `left:${Math.random() * 1600}px;--dx:${Math.random() * 300 - 150}px;--r:${Math.random() * 900 - 450}deg;animation-duration:${2200 + Math.random() * 1600}ms;animation-delay:${Math.random() * 900}ms`;
      fx.append(p);
      setTimeout(() => p.remove(), 5000);
    }
  }

  /* ---------- counter in the question banner ---------- */
  function meter(n) {
    const m = $('#meter');
    m.innerHTML = Array.from({ length: n }, () => `<i class="m-slot">${BITS[0]}</i>`).join('');
    m.setAttribute('aria-label', `0 of ${n}`);
  }
  function meterSet(k) {
    $$('#meter .m-slot').forEach((s, i) => s.classList.toggle('got', i < k));
  }

  /* ---------- drag (or tap-then-tap) engine ---------- */
  function findTarget(x, y, list) {
    const pad = 26 * state.scale;
    let best = null, bd = Infinity;
    for (const t of list) {
      const r = t.getBoundingClientRect();
      if (x < r.left - pad || x > r.right + pad || y < r.top - pad || y > r.bottom + pad) continue;
      const d = Math.hypot(x - (r.left + r.width / 2), y - (r.top + r.height / 2)) / Math.max(r.width, r.height);
      if (d < bd) { bd = d; best = t; }
    }
    return best;
  }

  function snapBack(c) {
    c.style.transition = 'transform .45s cubic-bezier(.34,1.56,.64,1)';
    c.style.transform = '';
    c._tx = c._ty = 0;
  }

  function dragSetup({ items, targets, accept, onAccept, onReject }) {
    let sel = null, hoverEl = null;
    const clearSel = () => { if (sel) sel.classList.remove('selected'); sel = null; };
    const select = c => { clearSel(); sel = c; c.classList.add('selected'); SFX.pop(); };
    state.ctx.clearSel = clearSel;

    const attempt = (c, x, y) => {
      const t = findTarget(x, y, targets());
      if (!t) return false;
      if (accept(c, t)) { onAccept(c, t); return true; }
      onReject(c, t);
      return 'no';
    };
    const hover = (x, y) => {
      const t = x == null ? null : findTarget(x, y, targets());
      if (t === hoverEl) return;
      if (hoverEl) hoverEl.classList.remove('hover');
      if (t) t.classList.add('hover');
      hoverEl = t;
    };

    items.forEach(c => {
      c.addEventListener('pointerdown', e => {
        if (state.locked || c.classList.contains('placed') || c._active) return;
        e.preventDefault();
        e.stopPropagation();
        try { c.setPointerCapture(e.pointerId); } catch { /* element may be detached */ }
        const sx = e.clientX, sy = e.clientY, s = state.scale;
        let moved = false;
        c._active = true;
        c.style.transition = 'none';

        const move = ev => {
          if (ev.pointerId !== e.pointerId) return;
          const dx = (ev.clientX - sx) / s, dy = (ev.clientY - sy) / s;
          if (!moved && Math.hypot(dx, dy) > 10) { moved = true; clearSel(); c.classList.add('dragging'); SFX.pop(); }
          if (moved) {
            c._tx = dx; c._ty = dy;
            c.style.transform = `translate(${dx}px, ${dy}px) rotate(-4deg) scale(1.08)`;
            hover(ev.clientX, ev.clientY);
          }
        };
        const end = ev => {
          if (ev.pointerId !== e.pointerId) return;
          c.removeEventListener('pointermove', move);
          c.removeEventListener('pointerup', end);
          c.removeEventListener('pointercancel', end);
          ev.stopPropagation();
          c._active = false;
          hover(null);
          c.classList.remove('dragging');
          if (!moved) { if (sel === c) clearSel(); else select(c); return; }
          const r = ev.type === 'pointerup' && !state.locked ? attempt(c, ev.clientX, ev.clientY) : false;
          if (r !== true) snapBack(c);
        };
        c.addEventListener('pointermove', move);
        c.addEventListener('pointerup', end);
        c.addEventListener('pointercancel', end);
      });
    });

    // tap an item, then tap where it goes
    act.onpointerup = e => {
      if (!sel || state.locked) return;
      const c = sel;
      if (attempt(c, e.clientX, e.clientY)) clearSel();
    };
  }

  // send a dropped card flying into a target
  function flyInto(c, target) {
    const a = c.getBoundingClientRect(), b = target.getBoundingClientRect(), s = state.scale;
    const dx = (b.left + b.width / 2 - (a.left + a.width / 2)) / s + (c._tx || 0);
    const dy = (b.top + b.height / 2 - (a.top + a.height / 2)) / s + (c._ty || 0);
    c.style.transition = 'transform .45s cubic-bezier(.5,0,.75,0), opacity .45s';
    c.style.transform = `translate(${dx}px, ${dy}px) scale(.15) rotate(20deg)`;
    c.style.opacity = '0';
    setTimeout(() => { c.style.visibility = 'hidden'; }, 460);
  }

  // drop a card into a container (bin or slot), keeping it visually in place first
  function settleInto(c, box) {
    // keep the empty spot so the other cards don't slide around under little fingers
    const spot = h('div', 'spot');
    spot.style.width = `${c.offsetWidth}px`;
    spot.style.height = `${c.offsetHeight}px`;
    c.replaceWith(spot);
    c.style.transition = 'none';
    c.style.transform = '';
    c._tx = c._ty = 0;
    box.append(c);
    c.classList.remove('landed'); void c.offsetWidth; c.classList.add('landed');
  }

  const cardHTML = (o, hideLabel) =>
    `<span class="card-art">${ART[o.art]()}</span>${hideLabel ? '' : `<span class="card-label">${o.label}</span>`}`;

  const colsFor = n => (n <= 4 ? n : n === 6 ? 3 : n === 8 ? 4 : Math.ceil(n / 2));

  /* ---------- the activities ---------- */
  const RENDER = {};

  // tap the one right picture
  RENDER.choice = q => {
    const wrap = h('div', 'choice-wrap');
    if (q.show) {
      wrap.append(h('div', 'show-art', ART[q.show]()));
      wrap.append(h('div', 'show-arrow', '<svg viewBox="0 0 60 40"><path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="#2E1F47" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'));
    }
    const grid = h('div', `cards${q.options.length > 4 ? ' many' : ''}`);
    grid.style.setProperty('--cols', colsFor(q.options.length));
    const right = [];
    shuffle(q.options).forEach((o, i) => {
      const c = h('button', 'card pop', cardHTML(o, q.hideLabels));
      c.style.animationDelay = `${i * 80}ms`;
      c.setAttribute('aria-label', o.label);
      if (o.ok) right.push(c);
      c.onclick = () => {
        if (state.locked || c.classList.contains('nope')) return;
        if (o.ok) { c.classList.add('right'); complete(q, c); }
        else { c.classList.add('nope'); wrong(q, o.no); }
      };
      grid.append(c);
    });
    wrap.append(grid);
    act.append(wrap);
    state.ctx.hint = () => right.forEach(c => c.classList.add('hint-glow'));
  };

  // tap every right picture
  RENDER.tapAll = q => {
    const grid = h('div', `cards${q.items.length > 4 ? ' many' : ''}`);
    grid.style.setProperty('--cols', colsFor(q.items.length));
    const need = q.items.filter(o => o.ok).length;
    const right = [];
    let found = 0;
    meter(need);
    shuffle(q.items).forEach((o, i) => {
      const c = h('button', 'card pop', cardHTML(o));
      c.style.animationDelay = `${i * 70}ms`;
      c.setAttribute('aria-label', o.label);
      if (o.ok) right.push(c);
      c.onclick = () => {
        if (state.locked || c.classList.contains('nope') || c.classList.contains('right')) return;
        if (o.ok) {
          c.classList.add('right'); c.classList.remove('hint-glow');
          meterSet(++found);
          if (found === need) complete(q, c); else stepRight(c, `${pick(STEP)} ${cap(o.label)}!`);
        } else { c.classList.add('nope'); wrong(q, o.no); }
      };
      grid.append(c);
    });
    act.append(grid);
    state.ctx.hint = () => right.filter(c => !c.classList.contains('right')).forEach(c => c.classList.add('hint-glow'));
  };

  // tap the right spots in a picture
  RENDER.scene = q => {
    const box = h('div', `scene-box scene-${q.scene}`, ART[q.scene]());
    act.append(box);
    const taps = $$('.tap', box);
    const goal = taps.filter(t => t.dataset.ok === '1');
    let found = 0;
    meter(goal.length);
    taps.forEach(t => t.addEventListener('click', () => {
      if (state.locked || t.classList.contains('found')) return;
      if (t.dataset.ok === '1') {
        t.classList.remove('hint'); t.classList.add('found');
        const b = t.getBBox();
        const ring = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ring.setAttribute('cx', b.x + b.width / 2); ring.setAttribute('cy', b.y + b.height / 2);
        ring.setAttribute('r', Math.min(Math.max(b.width, b.height) / 2 + 6, 70));
        ring.setAttribute('class', 'found-ring');
        t.append(ring);
        meterSet(++found);
        if (found === goal.length) complete(q, t); else stepRight(t);
      } else {
        t.classList.remove('flash'); void t.getBoundingClientRect(); t.classList.add('flash');
        wrong(q, t.dataset.no);
      }
    }));
    state.ctx.hint = () => goal.filter(t => !t.classList.contains('found')).forEach(t => t.classList.add('hint'));
  };

  function placeLabel(dia, part) {
    const [ax, ay] = DIAGRAM.anchor[part], [px, py] = DIAGRAM.point[part];
    const NS = 'http://www.w3.org/2000/svg';
    const lines = $('.lines', dia);
    const line = document.createElementNS(NS, 'line');
    Object.entries({ x1: px, y1: py, x2: ax, y2: ay, class: 'label-line' }).forEach(([k, v]) => line.setAttribute(k, v));
    const dot = document.createElementNS(NS, 'circle');
    Object.entries({ cx: px, cy: py, r: 9, class: 'label-dot' }).forEach(([k, v]) => dot.setAttribute(k, v));
    lines.append(line, dot);
    const tag = h('div', 'placed-label', part);
    tag.style.left = `${(ax / 600) * 100}%`;
    tag.style.top = `${(ay / 640) * 100}%`;
    $('.diagram-labels', dia).append(tag);
  }

  // drag words onto the plant
  RENDER.label = q => {
    const wrap = h('div', 'label-wrap');
    const dia = h('div', 'diagram', `${ART.plantDiagram()}<div class="diagram-labels"></div>`);
    const tray = h('div', 'tray tray-col');
    wrap.append(dia, tray);
    act.append(wrap);
    if (q.labels.length > 1) meter(q.labels.length);
    const chips = shuffle(q.labels).map((w, i) => {
      const c = h('div', 'chip pop', w);
      c.dataset.key = w;
      c.style.animationDelay = `${i * 80}ms`;
      tray.append(c);
      return c;
    });
    const hits = $$('.hit', dia);
    let placed = 0;
    state.ctx.hint = key => {
      const k = key || (chips.find(c => !c.classList.contains('placed')) || {}).dataset?.key;
      if (k) $(`.part[data-part="${k}"]`, dia).classList.add('hint');
    };
    dragSetup({
      items: chips,
      targets: () => hits,
      accept: (c, t) => c.dataset.key === t.dataset.part,
      onAccept: (c, t) => {
        const key = c.dataset.key;
        c.classList.add('placed');
        const spot = h('div', 'spot chip-spot');
        spot.style.height = `${c.offsetHeight}px`;
        c.replaceWith(spot);
        placeLabel(dia, key);
        const part = $(`.part[data-part="${key}"]`, dia);
        part.classList.remove('hint');
        part.classList.remove('pop'); void part.getBoundingClientRect(); part.classList.add('pop');
        placed++;
        if (q.labels.length > 1) meterSet(placed);
        if (placed === q.labels.length) complete(q, part); else stepRight(part, `${pick(STEP)} ${cap(key)}!`);
      },
      onReject: c => wrong(q, q.labels.length === 1 ? q.hint : LABEL_HINT[c.dataset.key], c.dataset.key),
    });
  };

  // drag the right things into one target
  RENDER.dragTo = q => {
    const wrap = h('div', 'dragto-wrap');
    const tray = h('div', 'tray tray-grid');
    const target = h('div', 'drop-target', `<div class="drop-art">${ART[q.target.art]()}</div><div class="drop-label">${q.target.label}</div><div class="drop-got"></div>`);
    wrap.append(tray, target);
    act.append(wrap);
    const need = q.items.filter(o => o.ok).length;
    let got = 0;
    meter(need);
    const items = shuffle(q.items).map((o, i) => {
      const c = h('div', 'card drag pop', cardHTML(o));
      c._o = o;
      c.style.animationDelay = `${i * 70}ms`;
      tray.append(c);
      return c;
    });
    state.ctx.hint = () => items.filter(c => c._o.ok && !c.classList.contains('placed')).forEach(c => c.classList.add('hint-glow'));
    dragSetup({
      items,
      targets: () => [target],
      accept: c => !!c._o.ok,
      onAccept: c => {
        c.classList.add('placed');
        c.classList.remove('hint-glow', 'selected');
        flyInto(c, target);
        $('.drop-got', target).insertAdjacentHTML('beforeend', `<span class="got">${ART[c._o.art]()}</span>`);
        target.classList.remove('gulp'); void target.offsetWidth; target.classList.add('gulp');
        meterSet(++got);
        if (got === need) complete(q, target); else stepRight(target, `${pick(STEP)} ${cap(c._o.label)}!`);
      },
      onReject: c => wrong(q, c._o.no),
    });
  };

  // sort cards into two groups
  RENDER.sort = q => {
    const wrap = h('div', 'sort-wrap');
    const tray = h('div', 'tray tray-row');
    const binsRow = h('div', 'bins');
    const bins = q.bins.map(b => {
      const el = h('div', 'bin', `<div class="bin-head"><span class="bin-art">${ART[b.art]()}</span><span class="bin-label">${b.label}</span></div><div class="bin-items"></div>`);
      el.dataset.bin = b.id;
      binsRow.append(el);
      return el;
    });
    wrap.append(tray, binsRow);
    act.append(wrap);
    meter(q.items.length);
    let placed = 0;
    const items = shuffle(q.items).map((o, i) => {
      const c = h('div', 'card drag small pop', cardHTML(o));
      c._o = o;
      c.style.animationDelay = `${i * 70}ms`;
      tray.append(c);
      return c;
    });
    state.ctx.hint = key => { const b = bins.find(x => x.dataset.bin === key); if (b) b.classList.add('hint-glow'); };
    dragSetup({
      items,
      targets: () => bins,
      accept: (c, b) => c._o.bin === b.dataset.bin,
      onAccept: (c, b) => {
        c.classList.add('placed');
        c.classList.remove('selected');
        bins.forEach(x => x.classList.remove('hint-glow'));
        settleInto(c, $('.bin-items', b));
        meterSet(++placed);
        if (placed === q.items.length) complete(q, b); else stepRight(c, `${pick(STEP)} ${cap(c._o.label)}!`);
      },
      onReject: c => wrong(q, c._o.no, c._o.bin),
    });
  };

  // put cards in order
  RENDER.order = q => {
    const wrap = h('div', 'order-wrap');
    const row = h('div', 'slots');
    const slots = q.items.map((o, i) => {
      const s = h('div', 'slot', `<span class="slot-num">${i + 1}</span>`);
      s.dataset.idx = i;
      row.append(s);
      if (i < q.items.length - 1) row.append(h('span', 'slot-arrow', '<svg viewBox="0 0 60 40"><path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="#2E1F47" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>'));
      return s;
    });
    const tray = h('div', 'tray tray-row');
    wrap.append(row, tray);
    act.append(wrap);
    let placed = 0;
    let items = q.items.map((o, i) => ({ o, i }));
    do { items = shuffle(items); } while (items.every((it, k) => it.i === k));
    const cards = items.map(({ o, i }, k) => {
      const c = h('div', 'card drag pop', cardHTML(o));
      c.dataset.idx = i;
      c.style.animationDelay = `${k * 80}ms`;
      tray.append(c);
      return c;
    });
    state.ctx.hint = () => {
      const s = slots.find(x => !x.classList.contains('filled'));
      if (!s) return;
      const c = cards.find(x => x.dataset.idx === s.dataset.idx);
      s.classList.add('hint-glow'); if (c) c.classList.add('hint-glow');
    };
    dragSetup({
      items: cards,
      targets: () => slots.filter(s => !s.classList.contains('filled')),
      accept: (c, s) => c.dataset.idx === s.dataset.idx,
      onAccept: (c, s) => {
        c.classList.add('placed');
        c.classList.remove('selected');
        $$('.hint-glow', act).forEach(x => x.classList.remove('hint-glow'));
        s.classList.add('filled');
        settleInto(c, s);
        placed++;
        if (placed === q.items.length) complete(q, row); else stepRight(c);
      },
      onReject: () => wrong(q, q.hint),
    });
  };

  // tap parts of the plant in order
  RENDER.tapOrder = q => {
    const dia = h('div', 'diagram diagram-big', `${ART.plantDiagram()}<div class="diagram-labels"></div>`);
    act.append(dia);
    meter(q.steps.length);
    const hits = $$('.hit', dia);
    let step = 0;
    dia.addEventListener('click', e => {
      if (state.locked) return;
      const t = findTarget(e.clientX, e.clientY, hits);
      if (!t) return;
      const want = q.steps[step];
      if (t.dataset.part === want.part) {
        const part = $(`.part[data-part="${want.part}"]`, dia);
        part.classList.remove('hint');
        part.classList.add('watered');
        part.classList.remove('pop'); void part.getBoundingClientRect(); part.classList.add('pop');
        const [ax, ay] = DIAGRAM.anchor[want.part];
        const badge = h('div', 'step-badge', String(step + 1));
        badge.style.left = `${(ax / 600) * 100}%`;
        badge.style.top = `${(ay / 640) * 100}%`;
        $('.diagram-labels', dia).append(badge);
        meterSet(++step);
        if (step === q.steps.length) complete(q, part);
        else { state.wrong = 0; stepRight(part, want.say); }
      } else {
        wrong(q, want.hint);
      }
    });
    state.ctx.hint = () => $(`.part[data-part="${q.steps[step].part}"]`, dia).classList.add('hint');
  };

  // for the teacher (and testing): __pip.jump(chapter, question) from the browser console
  window.__pip = { jump(ch, q) { startChapter(ch); if (q >= 0) { state.qi = q - 1; next(); } } };

  goTitle();
})();
