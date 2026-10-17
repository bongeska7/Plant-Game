/* Pip's voice (browser speech) and little sound effects (Web Audio, no files needed). */

const Voice = (() => {
  const synth = window.speechSynthesis;
  let voice = null, on = true, token = 0;
  const handlers = { start: [], end: [] };
  const emit = ev => handlers[ev].forEach(fn => fn());

  // friendliest voices first: Edge's natural child voice, then natural adult voices, then common system voices
  const PREFER = [/Ana Online/i, /Jenny Online/i, /Aria Online/i, /Natural/i, /Google US English/i, /Samantha/i, /Zira/i, /Google UK English Female/i];

  function choose() {
    if (!synth) return;
    const all = synth.getVoices().filter(v => /^en/i.test(v.lang));
    if (!all.length) return;
    for (const re of PREFER) {
      const v = all.find(x => re.test(x.name));
      if (v) { voice = v; return; }
    }
    voice = all.find(v => /en-US/i.test(v.lang)) || all[0];
  }
  if (synth) {
    choose();
    if (synth.addEventListener) synth.addEventListener('voiceschanged', choose);
    else synth.onvoiceschanged = choose;
  }

  function say(text, done) {
    const my = ++token;
    let finished = false;
    const finish = () => {
      if (finished || my !== token) return;
      finished = true;
      clearTimeout(guard);
      emit('end');
      if (done) done();
    };
    // fallback timing, also used when muted, so reading highlights still move along
    const guard = setTimeout(finish, (on && synth ? 2500 : 600) + text.length * (on && synth ? 95 : 55));
    if (!text || !on || !synth) return;

    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = 'en-US';
    const isChildVoice = voice && /Ana/i.test(voice.name);
    u.rate = .9;
    u.pitch = isChildVoice ? 1.05 : 1.25;
    u.onstart = () => { if (my === token) emit('start'); };
    u.onend = finish;
    u.onerror = finish;
    // Chrome can drop a speak() that comes right after cancel()
    setTimeout(() => { if (my === token) { synth.resume(); synth.speak(u); } }, 70);
  }

  function stop() {
    token++;
    if (synth) synth.cancel();
    emit('end');
  }

  return {
    say, stop,
    on: (ev, fn) => handlers[ev].push(fn),
    get enabled() { return on; },
    set enabled(v) { on = v; if (!v) stop(); },
    unlock() { if (synth && !voice) choose(); },
  };
})();

const SFX = (() => {
  let ctx = null, on = true;
  const get = () => {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  function tone(freq, at, dur, type = 'sine', vol = .18, slideTo) {
    const c = get(); if (!c || !on) return;
    const t = c.currentTime + at;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .015);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + .05);
  }

  function whoosh() {
    const c = get(); if (!c || !on) return;
    const len = c.sampleRate * 1.4, buf = c.createBuffer(1, len, c.sampleRate), data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain(), t = c.currentTime;
    src.buffer = buf; f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(2400, t + 1.2);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.25, t + .3); g.gain.exponentialRampToValueAtTime(.0001, t + 1.4);
    src.connect(f).connect(g).connect(c.destination); src.start(t);
  }

  return {
    unlock: get,
    get enabled() { return on; },
    set enabled(v) { on = v; },
    pop: () => tone(620, 0, .09, 'sine', .14, 980),
    step: () => { tone(784, 0, .14, 'triangle', .16); tone(1175, .08, .2, 'triangle', .14); },
    correct: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, i * .085, .32, 'triangle', .17)),
    wrong: () => { tone(392, 0, .16, 'sine', .14, 370); tone(311, .15, .3, 'sine', .14, 294); },
    win: () => {
      [523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i * .13, .28, 'triangle', .16));
      tone(1047, .8, .7, 'triangle', .15); tone(1319, .8, .7, 'sine', .08);
    },
    whoosh,
  };
})();
