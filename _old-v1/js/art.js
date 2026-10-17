/* Pip and the Gray Fog — illustration kit.
   Every picture is hand-built SVG so the game works offline on a classroom board. */

const INK = '#2E1F47';
const S = `stroke="${INK}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"`;
const C = {
  leaf: '#6BCB5F', leafDk: '#3FA34D', vein: '#2F8A3E', soil: '#8A5A3B', soilDk: '#6E4630',
  root: '#E8C18E', sun: '#FFC93C', petal: '#FF5E8A', water: '#4FB4FF', seed: '#C0844A',
  bark: '#8A5A3B', lemon: '#FFE14D', red: '#E5383B',
};

const shuffle = arr => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ---------- drawing helpers ---------- */

// a thick line with an ink outline (stems, roots, twigs)
const tube = (d, color, w = 8, ow = 5) =>
  `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + ow * 2}" stroke-linecap="round" stroke-linejoin="round"/>` +
  `<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

// overlapping circles with one outer outline (tree tops, clouds, bushes)
const blob = (circles, color, ow = 5) =>
  circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r + ow}" fill="${INK}"/>`).join('') +
  circles.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`).join('');

const shadow = (cx = 100, cy = 184, rx = 48) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="${INK}" opacity=".13"/>`;

function flowerHead(cx, cy, r, petal, center, n = 6, wide = .55) {
  let out = '';
  for (let i = 0; i < n; i++) {
    const col = Array.isArray(petal) ? petal[i % petal.length] : petal;
    out += `<ellipse cx="${cx}" cy="${cy - r * .72}" rx="${r * wide}" ry="${r * .62}" transform="rotate(${(360 / n) * i} ${cx} ${cy})" fill="${col}" ${S}/>`;
  }
  return out + `<circle cx="${cx}" cy="${cy}" r="${r * .5}" fill="${center}" ${S}/>`;
}

function seedPath(cx, cy, h, rot = 0, fill = C.seed) {
  const k = h / 2;
  return `<path transform="translate(${cx} ${cy}) rotate(${rot})" d="M0 ${-k} C${k * .58} ${-k * .52} ${k * .72} ${k * .16} ${k * .58} ${k * .58} C${k * .44} ${k * 1.06} ${-k * .44} ${k * 1.06} ${-k * .58} ${k * .58} C${-k * .72} ${k * .16} ${-k * .58} ${-k * .52} 0 ${-k}Z" fill="${fill}" ${S}/>`;
}

const smileFace = (cx, cy, sp = 18) =>
  `<ellipse cx="${cx - sp}" cy="${cy}" rx="5" ry="7" fill="${INK}"/><ellipse cx="${cx + sp}" cy="${cy}" rx="5" ry="7" fill="${INK}"/>` +
  `<path d="M${cx - 12} ${cy + 14} Q${cx} ${cy + 26} ${cx + 12} ${cy + 14}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>` +
  `<circle cx="${cx - sp - 12}" cy="${cy + 14}" r="7" fill="#FF8FA3" opacity=".75"/><circle cx="${cx + sp + 12}" cy="${cy + 14}" r="7" fill="#FF8FA3" opacity=".75"/>`;

const LEMON_D = 'M-78 0 C-70 -8 -66 -18 -56 -28 C-30 -54 30 -54 56 -28 C66 -18 70 -8 78 0 C70 8 66 18 56 28 C30 54 -30 54 -56 28 C-66 18 -70 8 -78 0Z';

/* ---------- the pictures (body markup, 200×200 unless noted) ---------- */

const BODY = {
  seed: () => `${shadow(100, 182, 44)}
    ${seedPath(100, 104, 150, 0, C.seed)}
    <path d="M100 40 C112 80 112 130 100 168" fill="none" stroke="#9A6233" stroke-width="5" stroke-linecap="round"/>
    <path d="M76 82 C70 102 70 122 76 140" fill="none" stroke="#E7B985" stroke-width="9" stroke-linecap="round"/>`,

  seeds: () => `${shadow(100, 176, 62)}
    ${seedPath(66, 120, 74, -28)}${seedPath(134, 120, 74, 24)}${seedPath(100, 92, 80, 2)}
    <path d="M92 70 C88 82 88 96 92 108" fill="none" stroke="#E7B985" stroke-width="6" stroke-linecap="round"/>`,

  sunSeed: () => `${shadow(100, 182, 34)}
    <path d="M100 22 C132 60 140 120 128 150 C118 176 82 176 72 150 C60 120 68 60 100 22Z" fill="#3B3355" ${S}/>
    <path d="M100 36 L100 166 M86 62 C80 100 82 140 88 160 M114 62 C120 100 118 140 112 160" stroke="#E9E4F2" stroke-width="5" fill="none" stroke-linecap="round"/>`,

  pumpkinSeed: () => `${shadow(100, 180, 40)}
    <path d="M100 26 C140 40 150 110 136 146 C124 176 76 176 64 146 C50 110 60 40 100 26Z" fill="#F4E3B5" ${S}/>
    <path d="M100 42 C126 56 132 110 122 136 C113 158 87 158 78 136 C68 110 74 56 100 42Z" fill="none" stroke="#D9C089" stroke-width="5"/>`,

  sprout: () => `
    <path d="M22 178 Q100 124 178 178 Z" fill="${C.soil}" ${S}/>
    ${tube('M100 158 C100 134 98 114 100 96', '#4DB55A', 7)}
    <path d="M100 106 C84 80 52 82 40 98 C58 120 86 120 100 106Z" fill="${C.leaf}" ${S}/>
    <path d="M100 98 C112 68 146 64 160 78 C148 102 120 108 100 98Z" fill="${C.leaf}" ${S}/>
    <circle cx="70" cy="166" r="4" fill="${C.soilDk}"/><circle cx="132" cy="164" r="5" fill="${C.soilDk}"/>`,

  plantFlower: (petal = C.petal) => `
    <path d="M22 184 Q100 150 178 184 Z" fill="${C.soil}" ${S}/>
    ${tube('M100 174 C100 140 102 110 100 80', C.leafDk, 8)}
    <path d="M100 142 C84 118 52 120 40 136 C58 158 86 158 100 142Z" fill="${C.leaf}" ${S}/>
    <path d="M100 122 C114 96 146 94 160 108 C148 130 120 134 100 122Z" fill="${C.leaf}" ${S}/>
    ${flowerHead(100, 58, 28, petal, C.sun)}`,

  sunflower: () => {
    let dots = '';
    [[-8, -6], [6, -9], [9, 5], [-5, 9], [0, 0]].forEach(([x, y]) => { dots += `<circle cx="${100 + x}" cy="${62 + y}" r="3" fill="#4A2E1A"/>`; });
    return `${shadow(100, 188, 40)}
      ${tube('M100 186 C100 150 100 120 100 96', C.leafDk, 9)}
      <path d="M100 152 C84 130 52 132 42 148 C60 168 88 168 100 152Z" fill="${C.leaf}" ${S}/>
      <path d="M100 136 C116 114 148 114 158 130 C140 150 112 150 100 136Z" fill="${C.leaf}" ${S}/>
      ${flowerHead(100, 62, 34, C.sun, '#7A4E2D', 12, .3)}${dots}`;
  },

  tulip: () => `${shadow(100, 188, 36)}
    ${tube('M100 186 C100 150 98 120 100 96', C.leafDk, 6, 4)}
    <path d="M100 178 C78 154 68 124 72 102 C90 122 98 152 100 178Z" fill="${C.leaf}" ${S}/>
    <path d="M100 172 C118 150 132 130 134 112 C116 126 104 148 100 172Z" fill="${C.leaf}" ${S}/>
    <path d="M64 46 L80 68 L100 36 L120 68 L136 46 C142 90 126 106 100 106 C74 106 58 90 64 46Z" fill="#FF5E5E" ${S}/>
    <path d="M80 70 C82 84 88 94 96 100" fill="none" stroke="#FF9A9A" stroke-width="6" stroke-linecap="round"/>`,

  daisy: () => `${shadow(100, 190, 30)}
    ${tube('M100 188 C98 160 104 120 100 86', C.leafDk, 5, 3)}
    <path d="M101 152 C116 136 138 136 146 144 C134 160 112 162 101 152Z" fill="${C.leaf}" ${S}/>
    ${flowerHead(100, 60, 28, '#FFFFFF', C.sun, 10, .32)}`,

  flower: () => `${shadow(100, 188, 30)}
    ${tube('M100 186 L100 112', C.leafDk, 7, 4)}
    <path d="M101 160 C116 142 140 142 150 152 C136 170 112 172 101 160Z" fill="${C.leaf}" ${S}/>
    ${flowerHead(100, 76, 38, C.petal, C.sun, 6)}`,

  blossom: () => `
    <path d="M100 100 C70 140 60 170 70 186 C92 176 104 146 100 100Z" fill="${C.leaf}" ${S}/>
    <path d="M100 100 C130 140 150 156 168 156 C164 134 136 112 100 100Z" fill="${C.leaf}" ${S}/>
    ${flowerHead(100, 88, 44, '#FFFFFF', C.lemon, 5, .62)}
    <circle cx="92" cy="82" r="3" fill="#E0A800"/><circle cx="106" cy="80" r="3" fill="#E0A800"/><circle cx="100" cy="94" r="3" fill="#E0A800"/>`,

  bloom: () => `${flowerHead(100, 100, 52, ['#FF5E8A', '#FFC93C', '#4FB4FF', '#7B5CFF', '#6BCB5F', '#FF9F1C', '#FF5E5E'], '#FFF6C2', 7, .5)}
    ${smileFace(100, 96, 11)}`,

  tree: () => `${shadow(100, 190, 62)}
    <path d="M78 190 C86 160 86 130 80 106 L120 106 C114 130 114 160 122 190 Z" fill="${C.bark}" ${S}/>
    ${blob([[100, 72, 44], [60, 92, 32], [140, 92, 32], [74, 52, 30], [126, 52, 30], [100, 108, 26]], C.leafDk)}
    <circle cx="78" cy="60" r="10" fill="#5CC45E"/><circle cx="122" cy="84" r="8" fill="#5CC45E"/><circle cx="60" cy="96" r="6" fill="#5CC45E"/>`,

  pineTree: () => `${shadow(100, 190, 52)}
    <rect x="88" y="150" width="24" height="38" rx="4" fill="${C.bark}" ${S}/>
    <path d="M100 18 L140 70 L124 70 L158 112 L136 112 L170 156 L30 156 L64 112 L42 112 L76 70 L60 70 Z" fill="#2E8B57" ${S}/>`,

  trunk: () => `${shadow(100, 186, 70)}
    <path d="M56 62 L56 158 C56 170 40 178 30 184 L170 184 C160 178 144 170 144 158 L144 62 Z" fill="${C.bark}" ${S}/>
    <ellipse cx="100" cy="62" rx="44" ry="17" fill="${C.root}" ${S}/>
    <ellipse cx="100" cy="62" rx="28" ry="10" fill="none" stroke="#B98A55" stroke-width="3"/>
    <ellipse cx="100" cy="62" rx="12" ry="4" fill="none" stroke="#B98A55" stroke-width="3"/>
    <path d="M76 92 C74 112 78 132 74 152 M102 86 C104 112 100 132 104 162 M126 98 C124 118 128 138 124 152" stroke="#5E3A24" stroke-width="4" fill="none" stroke-linecap="round"/>`,

  stem: () => `${shadow(100, 188, 30)}
    ${tube('M96 186 C90 140 112 100 100 36', C.leafDk, 6, 4)}
    <path d="M101 116 C118 100 142 102 150 112 C138 128 114 128 101 116Z" fill="${C.leaf}" ${S}/>
    <ellipse cx="100" cy="32" rx="11" ry="15" fill="#FF8FB8" ${S}/>`,

  roots: () => `
    <rect x="14" y="74" width="172" height="110" rx="22" fill="${C.soil}" ${S}/>
    <circle cx="40" cy="160" r="5" fill="${C.soilDk}"/><circle cx="160" cy="104" r="4" fill="${C.soilDk}"/><circle cx="150" cy="168" r="5" fill="${C.soilDk}"/>
    ${tube('M100 76 C100 112 98 132 100 172', C.root, 6, 4)}
    ${tube('M100 94 C84 106 66 112 50 136', C.root, 5, 4)}
    ${tube('M100 94 C116 106 134 112 150 136', C.root, 5, 4)}
    ${tube('M99 126 C88 138 80 152 76 168', C.root, 4, 4)}
    ${tube('M101 126 C112 138 120 152 124 168', C.root, 4, 4)}
    <rect x="12" y="64" width="176" height="16" rx="8" fill="#4DB55A" ${S}/>
    ${tube('M100 66 C100 54 100 44 100 36', C.leafDk, 6, 4)}
    <path d="M100 46 C88 28 66 28 58 38 C70 54 90 54 100 46Z" fill="${C.leaf}" ${S}/>
    <path d="M100 42 C112 24 134 24 142 34 C130 50 110 50 100 42Z" fill="${C.leaf}" ${S}/>`,

  leaf: (c = C.leaf) => `${shadow(100, 186, 40)}
    ${tube('M100 182 L100 150', C.leafDk, 6, 4)}
    <path d="M100 156 C40 130 40 50 100 18 C160 50 160 130 100 156Z" fill="${c}" ${S}/>
    <path d="M100 150 L100 40 M100 122 L72 102 M100 122 L128 102 M100 92 L78 74 M100 92 L122 74" fill="none" stroke="${C.vein}" stroke-width="4" stroke-linecap="round"/>`,

  bananaLeaf: () => {
    let ribs = '';
    for (let y = 40; y <= 160; y += 20) ribs += `M100 ${y} L${64 + (y > 100 ? 4 : 0)} ${y - 14} M100 ${y} L${136 - (y > 100 ? 4 : 0)} ${y - 14} `;
    return `<g transform="rotate(-30 100 100) scale(.9) translate(11 10)">
      ${tube('M100 198 L100 176', C.leafDk, 8, 5)}
      <path d="M100 182 C56 162 52 44 100 6 C148 44 144 162 100 182Z" fill="#7DD36A" ${S}/>
      <path d="${ribs}" stroke="#3E9A45" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M100 178 L100 16" stroke="#3E9A45" stroke-width="5" fill="none" stroke-linecap="round"/>
    </g>`;
  },

  pineNeedles: () => {
    const x0 = 40, y0 = 172, x1 = 160, y1 = 34;
    const len = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / len, uy = (y1 - y0) / len;
    let needles = '';
    for (let t = .12; t <= .96; t += .085) {
      const px = x0 + (x1 - x0) * t, py = y0 + (y1 - y0) * t;
      [-38, 38].forEach(a => {
        const r = a * Math.PI / 180;
        const dx = ux * Math.cos(r) - uy * Math.sin(r), dy = ux * Math.sin(r) + uy * Math.cos(r);
        const L = 40 - t * 8;
        needles += `M${px.toFixed(1)} ${py.toFixed(1)} L${(px + dx * L).toFixed(1)} ${(py + dy * L).toFixed(1)} `;
      });
    }
    return `${shadow(100, 186, 46)}
      <path d="${needles}" fill="none" stroke="${INK}" stroke-width="9" stroke-linecap="round"/>
      <path d="${needles}" fill="none" stroke="#2E8B57" stroke-width="4" stroke-linecap="round"/>
      ${tube(`M${x0} ${y0} L${x1} ${y1}`, C.bark, 6, 4)}`;
  },

  clover: () => {
    const heart = a => `<path d="M100 96 C80 84 62 68 70 50 C76 38 92 38 100 50 C108 38 124 38 130 50 C138 68 120 84 100 96Z" transform="rotate(${a} 100 96)" fill="#5CC45E" ${S}/>`;
    return `${shadow(100, 188, 30)}
      ${tube('M100 186 C102 160 96 130 100 100', C.leafDk, 6, 4)}
      ${heart(0)}${heart(120)}${heart(240)}
      <path d="M90 60 L100 70 L110 60" transform="rotate(0 100 96)" fill="none" stroke="#B9EBA8" stroke-width="4" stroke-linecap="round"/>`;
  },

  maple: () => `${shadow(100, 192, 34)}
    ${tube('M100 190 L100 150', '#B7262A', 5, 4)}
    <path d="M100 18 L114 54 L140 44 L132 80 L170 70 L156 100 L182 114 L140 124 L148 150 L108 138 L104 158 L96 158 L92 138 L52 150 L60 124 L18 114 L44 100 L30 70 L68 80 L60 44 L86 54 Z" fill="${C.red}" ${S}/>
    <path d="M100 150 L100 50 M100 118 L60 92 M100 118 L140 92 M100 132 L64 136 M100 132 L136 136" stroke="#FF8A80" stroke-width="4" fill="none" stroke-linecap="round"/>`,

  ash: () => {
    const lf = (x, y, a) => `<ellipse cx="${x}" cy="${y}" rx="13" ry="27" transform="rotate(${a} ${x} ${y})" fill="${C.leaf}" ${S}/>`;
    return `${shadow(100, 192, 30)}
      ${tube('M100 190 L100 40', C.leafDk, 5, 4)}
      ${lf(72, 146, -62)}${lf(128, 146, 62)}${lf(72, 108, -62)}${lf(128, 108, 62)}${lf(74, 70, -58)}${lf(126, 70, 58)}${lf(100, 36, 0)}`;
  },

  sun: () => {
    let rays = '';
    for (let i = 0; i < 12; i++) rays += `<path d="M100 12 L111 40 L89 40Z" transform="rotate(${i * 30} 100 100)" fill="#FFB020" ${S}/>`;
    return `${rays}<circle cx="100" cy="100" r="52" fill="${C.sun}" ${S}/>${smileFace(100, 94, 16)}`;
  },

  air: () => `
    ${tube('M28 66 L120 66 C150 66 156 30 130 30 C112 30 108 52 122 56', '#BDE8FF', 9, 5)}
    ${tube('M18 104 L148 104 C180 104 186 146 158 148 C138 150 134 128 148 124', '#BDE8FF', 9, 5)}
    ${tube('M40 142 L98 142', '#BDE8FF', 9, 5)}`,

  water: () => `${shadow(100, 184, 40)}
    <path d="M100 20 C130 66 154 98 154 126 C154 158 130 176 100 176 C70 176 46 158 46 126 C46 98 70 66 100 20Z" fill="${C.water}" ${S}/>
    <path d="M74 118 C72 138 82 152 96 156" fill="none" stroke="#BFE6FF" stroke-width="9" stroke-linecap="round"/>`,

  cloud: () => `${blob([[64, 112, 34], [104, 92, 44], [144, 112, 32], [104, 124, 30]], '#FFFFFF')}
    <path d="M70 108 C76 100 86 96 96 98" stroke="#E1F1FB" stroke-width="7" fill="none" stroke-linecap="round"/>`,

  pizza: () => `${shadow(100, 184, 50)}
    <path d="M40 52 Q100 22 160 52 L100 178 Z" fill="#FFD166" ${S}/>
    <path d="M36 52 Q100 16 164 52 L157 68 Q100 38 43 68 Z" fill="#D98E3F" ${S}/>
    <circle cx="88" cy="86" r="11" fill="${C.red}" ${S}/><circle cx="118" cy="98" r="10" fill="${C.red}" ${S}/><circle cx="100" cy="128" r="9" fill="${C.red}" ${S}/>`,

  car: () => `${shadow(100, 164, 74)}
    <path d="M22 140 L22 114 C22 106 28 102 36 100 L58 98 L76 70 C80 64 86 62 94 62 L130 62 C138 62 144 66 148 72 L162 98 C172 100 178 106 178 116 L178 140 Z" fill="#FF5E5E" ${S}/>
    <path d="M84 96 L96 76 L114 76 L114 96Z M124 96 L124 76 L136 76 L148 96Z" fill="#BFE6FF" ${S}/>
    <circle cx="58" cy="142" r="18" fill="#3B3355" ${S}/><circle cx="58" cy="142" r="6" fill="#ddd"/>
    <circle cx="144" cy="142" r="18" fill="#3B3355" ${S}/><circle cx="144" cy="142" r="6" fill="#ddd"/>`,

  rock: () => `${shadow(100, 170, 66)}
    <path d="M34 156 C24 120 46 84 82 76 C108 60 150 72 164 104 C178 132 168 160 150 164 L50 166 C42 166 36 162 34 156Z" fill="#A9A3B8" ${S}/>
    <path d="M70 100 C80 92 96 90 106 94" stroke="#D5D0E0" stroke-width="8" fill="none" stroke-linecap="round"/>
    <circle cx="130" cy="128" r="5" fill="#8A849C"/><circle cx="84" cy="138" r="4" fill="#8A849C"/>`,

  candy: () => `${shadow(100, 156, 64)}
    <path d="M60 100 L22 70 L28 130 Z" fill="#FF8FB8" ${S}/>
    <path d="M140 100 L178 70 L172 130 Z" fill="#FF8FB8" ${S}/>
    <circle cx="100" cy="100" r="44" fill="${C.petal}" ${S}/>
    <path d="M70 84 C90 70 112 74 120 92 C126 108 112 122 96 116" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>`,

  apple: () => `${shadow(100, 186, 50)}
    <path d="M100 62 C80 48 40 50 34 92 C28 136 60 180 84 178 C92 178 96 172 100 172 C104 172 108 178 116 178 C140 180 172 136 166 92 C160 50 120 48 100 62Z" fill="${C.red}" ${S}/>
    ${tube('M100 64 C100 50 104 40 110 32', '#7A4E2D', 5, 4)}
    <path d="M106 46 C118 28 142 28 150 36 C140 54 118 56 106 46Z" fill="${C.leaf}" ${S}/>
    <path d="M58 92 C54 106 56 122 62 134" stroke="#FF9A9A" stroke-width="9" fill="none" stroke-linecap="round"/>`,

  lemon: () => `${shadow(100, 176, 58)}
    <g transform="translate(100 108)"><path d="${LEMON_D}" fill="${C.lemon}" ${S}/>
    <path d="M-34 -22 C-20 -32 0 -34 16 -30" stroke="#FFF4A8" stroke-width="9" fill="none" stroke-linecap="round"/></g>
    <path d="M100 62 C108 40 132 32 146 38 C140 58 118 66 100 62Z" fill="${C.leaf}" ${S}/>`,

  strawberry: () => {
    let pips = '';
    [[78, 96], [100, 100], [122, 96], [86, 122], [114, 122], [100, 146], [70, 118], [130, 118]].forEach(([x, y]) => { pips += `<ellipse cx="${x}" cy="${y}" rx="3" ry="5" fill="#FFE14D"/>`; });
    return `${shadow(100, 186, 40)}
      <path d="M100 180 C70 170 34 120 40 84 C44 64 70 58 100 64 C130 58 156 64 160 84 C166 120 130 170 100 180Z" fill="#F0384F" ${S}/>${pips}
      <path d="M62 70 L80 56 L84 38 L100 54 L116 38 L120 56 L138 70 L114 74 L100 84 L86 74Z" fill="#4DB55A" ${S}/>`;
  },

  butterfly: () => `
    <ellipse cx="66" cy="74" rx="36" ry="30" transform="rotate(-20 66 74)" fill="#FF9F1C" ${S}/>
    <ellipse cx="134" cy="74" rx="36" ry="30" transform="rotate(20 134 74)" fill="#FF9F1C" ${S}/>
    <ellipse cx="72" cy="126" rx="26" ry="23" fill="#7B5CFF" ${S}/>
    <ellipse cx="128" cy="126" rx="26" ry="23" fill="#7B5CFF" ${S}/>
    <circle cx="62" cy="72" r="9" fill="#FFF3D6"/><circle cx="138" cy="72" r="9" fill="#FFF3D6"/>
    <ellipse cx="100" cy="102" rx="9" ry="44" fill="${INK}"/>
    <path d="M96 62 C90 44 82 36 72 32 M104 62 C110 44 118 36 128 32" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"/>`,

  food: () => `${shadow(100, 178, 62)}
    <path d="M40 98 C42 70 70 58 88 70 C98 50 128 52 134 70 C152 62 168 80 162 98Z" fill="#FFD166" ${S}/>
    <circle cx="80" cy="84" r="8" fill="${C.red}" ${S}/><circle cx="122" cy="80" r="8" fill="${C.leaf}" ${S}/>
    <path d="M28 98 L172 98 C172 142 142 170 100 170 C58 170 28 142 28 98Z" fill="#7B5CFF" ${S}/>
    <path d="M52 116 C58 132 72 144 88 148" stroke="#B8A6FF" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M78 46 C72 36 84 30 78 20 M104 42 C98 32 110 26 104 16 M130 46 C124 36 136 30 130 20" stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".5"/>`,

  /* ---------- lemon cut in half (400×400) ---------- */
  lemonHalf: () => {
    const n = 10, R = 134, r0 = 20, gap = 4;
    const p = (a, rad) => `${(200 + Math.cos(a) * rad).toFixed(1)} ${(200 + Math.sin(a) * rad).toFixed(1)}`;
    let wedges = '';
    for (let i = 0; i < n; i++) {
      const a1 = (i * 36 + gap) * Math.PI / 180, a2 = ((i + 1) * 36 - gap) * Math.PI / 180;
      wedges += `<path d="M${p(a1, r0)} L${p(a1, R)} A${R} ${R} 0 0 1 ${p(a2, R)} L${p(a2, r0)} Z" fill="#FFE768" stroke="#F2C53D" stroke-width="3" stroke-linejoin="round"/>`;
    }
    const seeds = [[18, 90], [90, 84], [162, 92], [234, 86], [306, 92]].map(([deg, rad]) => {
      const a = deg * Math.PI / 180, x = 200 + Math.cos(a) * rad, y = 200 + Math.sin(a) * rad;
      return `<g class="tap" data-ok="1">${seedPath(x.toFixed(1), y.toFixed(1), 40, deg - 90, '#FFF3D6')}<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="34" fill="transparent"/></g>`;
    }).join('');
    return `<circle cx="200" cy="200" r="178" fill="#FFD43B" stroke="${INK}" stroke-width="7"/>
      <circle cx="200" cy="200" r="154" fill="#FFF6C2"/>${wedges}<circle cx="200" cy="200" r="16" fill="#FFF6C2"/>${seeds}`;
  },

  /* ---------- lemon tree branch (600×420) ---------- */
  lemonBranch: () => {
    const lemonAt = (x, y) => `<g class="tap" data-ok="0" data-no="That is a lemon. A lemon is a fruit! Look for the white flowers.">
      <g transform="translate(${x} ${y}) rotate(90) scale(.62)"><path d="${LEMON_D}" fill="${C.lemon}" stroke="${INK}" stroke-width="8" stroke-linejoin="round"/>
      <path d="M-34 -22 C-20 -32 0 -34 16 -30" stroke="#FFF4A8" stroke-width="12" fill="none" stroke-linecap="round"/></g>
      <circle cx="${x}" cy="${y}" r="46" fill="transparent"/></g>`;
    const blossomAt = (x, y) => `<g class="tap" data-ok="1">${flowerHead(x, y, 22, '#FFFFFF', C.lemon, 5, .62)}<circle cx="${x}" cy="${y}" r="44" fill="transparent"/></g>`;
    const leafAt = (x, y, rot) => `<g class="tap" data-ok="0" data-no="That is a leaf. Look for the white flowers!">
      <g transform="translate(${x} ${y}) rotate(${rot})"><path d="M0 0 C-22 -24 -22 -62 0 -86 C22 -62 22 -24 0 0Z" fill="${C.leaf}" ${S}/>
      <path d="M0 -8 L0 -74" stroke="${C.vein}" stroke-width="4" stroke-linecap="round"/></g></g>`;
    const twigs = [[160, 112, 160, 162], [310, 146, 310, 216], [450, 186, 450, 254], [240, 128, 240, 66], [420, 178, 420, 112], [70, 106, 70, 178]]
      .map(([a, b, c, d]) => tube(`M${a} ${b} L${c} ${d}`, C.bark, 6, 4)).join('');
    return `<rect width="600" height="420" fill="#DDF3FF"/>
      ${blob([[520, 70, 26], [556, 62, 32], [590, 74, 24]], '#FFFFFF', 0)}
      ${twigs}${tube('M-10 112 C150 88 320 150 610 236', C.bark, 16, 5)}
      ${leafAt(120, 110, -40)}${leafAt(300, 145, 35)}${leafAt(500, 203, -25)}${leafAt(230, 128, 160)}${leafAt(540, 214, 150)}
      ${lemonAt(160, 206)}${lemonAt(310, 262)}${lemonAt(450, 300)}
      ${blossomAt(240, 50)}${blossomAt(420, 94)}${blossomAt(70, 196)}`;
  },

  /* ---------- mangrove tree in water (600×420) ---------- */
  mangrove: () => {
    const roots = ['M300 236 C262 246 232 276 212 332', 'M300 236 C282 266 272 300 264 336', 'M300 236 C318 266 328 300 336 336',
      'M300 236 C340 246 370 276 390 332', 'M292 224 C240 228 190 268 168 334', 'M308 224 C360 228 410 268 432 334']
      .map(d => tube(d, '#A0703F', 10, 5)).join('');
    return `<rect width="600" height="420" fill="#DDF3FF"/>
      ${blob([[80, 70, 26], [116, 60, 34], [152, 72, 24]], '#FFFFFF', 0)}
      <rect x="-10" y="300" width="620" height="130" fill="${C.water}" stroke="${INK}" stroke-width="5"/>
      <path d="M40 350 q15 -10 30 0 t30 0 M440 372 q15 -10 30 0 t30 0 M200 396 q15 -10 30 0 t30 0 M520 340 q12 -8 24 0" stroke="#BFE6FF" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="tap" data-ok="1">${roots}<rect x="150" y="226" width="300" height="116" fill="transparent"/></g>
      <g class="tap" data-ok="0" data-no="That is the trunk. It is the tree's thick stem. Look down for the roots!">
        <path d="M280 240 C286 200 284 160 276 118 L324 118 C316 160 314 200 320 240Z" fill="${C.bark}" ${S}/>
        <rect x="272" y="140" width="56" height="90" fill="transparent"/></g>
      <g class="tap" data-ok="0" data-no="Those are the leaves. Look down, near the water!">
        ${blob([[300, 92, 62], [228, 112, 46], [372, 112, 46], [258, 60, 44], [342, 60, 44]], C.leafDk)}
        <circle cx="270" cy="70" r="12" fill="#5CC45E"/><circle cx="350" cy="104" r="10" fill="#5CC45E"/></g>`;
  },

  /* ---------- Pip the seed (220×270) ---------- */
  pip: () => `
    <ellipse cx="110" cy="258" rx="62" ry="9" fill="${INK}" opacity=".15"/>
    <g class="pip-sprout">
      ${tube('M110 70 C108 50 112 36 110 22', C.leafDk, 7, 4)}
      <path d="M110 34 C92 10 62 12 52 26 C70 46 96 46 110 34Z" fill="${C.leaf}" ${S}/>
      <path d="M110 28 C126 4 156 4 166 18 C150 40 124 40 110 28Z" fill="${C.leaf}" ${S}/>
    </g>
    <ellipse cx="84" cy="248" rx="18" ry="9" fill="#9A6233" ${S}/><ellipse cx="136" cy="248" rx="18" ry="9" fill="#9A6233" ${S}/>
    <path d="M110 62 C170 96 192 160 180 204 C168 250 52 250 40 204 C28 160 50 96 110 62Z" fill="${C.seed}" ${S}/>
    <path d="M62 128 C54 152 54 178 62 198" fill="none" stroke="#E7B985" stroke-width="10" stroke-linecap="round"/>
    <g class="pip-eyes">
      <ellipse cx="88" cy="150" rx="15" ry="18" fill="#fff" ${S}/><ellipse cx="134" cy="150" rx="15" ry="18" fill="#fff" ${S}/>
      <circle cx="91" cy="154" r="8" fill="${INK}"/><circle cx="137" cy="154" r="8" fill="${INK}"/>
      <circle cx="94" cy="150" r="3" fill="#fff"/><circle cx="140" cy="150" r="3" fill="#fff"/>
    </g>
    <circle cx="68" cy="182" r="10" fill="#FF8FA3" opacity=".75"/><circle cx="154" cy="182" r="10" fill="#FF8FA3" opacity=".75"/>
    <path class="pip-smile" d="M96 180 Q111 196 126 180" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
    <ellipse class="pip-mouth" cx="111" cy="186" rx="11" ry="9" fill="#8C2F4B" ${S}/>`,

  /* ---------- the garden world behind everything (1600×900) ---------- */
  garden: () => {
    const g = (x, y, s, body, cls = '') => `<g class="${cls}"><g transform="translate(${x} ${y}) scale(${s})">${body}</g></g>`;
    const tinyFlower = (petal, center = C.sun, n = 6) =>
      `${tube('M100 200 L100 120', C.leafDk, 8, 4)}<path d="M100 168 C112 150 132 150 140 158 C128 174 110 176 100 168Z" fill="${C.leaf}" ${S}/>${flowerHead(100, 104, 26, petal, center, n)}`;
    const petals = [C.petal, C.sun, '#7B5CFF', '#FFFFFF', '#FF9F1C', '#FF5E5E', '#4FB4FF'];
    let front = '';
    for (let i = 0, x = 40; x < 1600; i++, x += 74 + (i % 3) * 18) {
      const y = 770 + ((i * 37) % 60), s = .42 + ((i * 13) % 10) / 50;
      const body = i % 5 === 2 ? BODY.tulip() : i % 7 === 4 ? BODY.sunflower() : tinyFlower(petals[i % petals.length]);
      front += `<g class="sway" style="animation-delay:-${(i * .7) % 4}s">${g(x - 100 * s, y - 200 * s, s, body)}</g>`;
    }
    let rays = '';
    for (let i = 0; i < 14; i++) rays += `<path d="M0 -118 L14 -84 L-14 -84Z" transform="rotate(${i * (360 / 14)})" fill="#FFB020" ${S}/>`;
    const bfly = (x, y, d, sc) => `<g class="bfly reveal" style="animation-delay:${d}s"><g transform="translate(${x} ${y}) scale(${sc})">
      <g class="flap"><g transform="translate(-100 -102)">${BODY.butterfly()}</g></g></g></g>`;
    return `
      <defs><linearGradient id="gSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FCBF5"/><stop offset=".75" stop-color="#D4F2FF"/></linearGradient></defs>
      <rect width="1600" height="900" fill="url(#gSky)"/>
      <g class="rainbow" fill="none" stroke-width="28">
        ${['#FF5E5E', '#FF9F1C', '#FFE14D', '#6BCB5F', '#4FB4FF', '#7B5CFF'].map((c, i) => `<path d="M${250 + i * 28} 660 A ${550 - i * 28} ${500 - i * 28} 0 0 1 ${1350 - i * 28} 660" stroke="${c}"/>`).join('')}
      </g>
      <g transform="translate(1380 160)"><g class="sun-rays">${rays}</g><circle r="74" fill="${C.sun}" ${S}/>
        <g transform="translate(-100 -104)">${smileFace(100, 96, 22)}</g></g>
      <g class="cloud drift-a">${blob([[220, 150, 40], [270, 128, 54], [332, 148, 42], [276, 168, 36]], '#FFFFFF')}</g>
      <g class="cloud drift-b">${blob([[760, 96, 32], [800, 80, 42], [848, 98, 30]], '#FFFFFF')}</g>
      <g class="cloud drift-a" style="animation-duration:95s">${blob([[1060, 250, 28], [1096, 236, 36], [1136, 252, 26]], '#FFFFFF')}</g>
      <path d="M-20 560 C180 470 360 470 520 530 C700 450 900 440 1080 520 C1240 460 1420 470 1620 530 L1620 920 L-20 920Z" fill="#A6DD8B" ${S}/>
      ${g(470, 430, .55, BODY.tree())}${g(900, 405, .5, BODY.pineTree())}${g(1000, 420, .45, BODY.pineTree())}${g(1180, 440, .5, BODY.tree())}
      <path d="M-20 660 C260 580 520 600 760 650 C1000 600 1300 590 1620 650 L1620 920 L-20 920Z" fill="#74C86E" ${S}/>
      ${blob([[640, 640, 34], [680, 624, 40], [724, 640, 32]], '#4FB35A')}${blob([[1160, 620, 30], [1196, 606, 38], [1236, 622, 30]], '#4FB35A')}
      ${g(20, 300, 1.9, BODY.tree())}${g(1330, 360, 1.55, BODY.pineTree())}
      <path d="M-20 760 C300 720 600 740 860 770 C1120 730 1380 720 1620 750 L1620 920 L-20 920Z" fill="#4CAF50" ${S}/>
      ${front}
      ${bfly(560, 520, 0, .4)}${bfly(1040, 470, -4, .34)}${bfly(260, 600, -7, .3)}`;
  },
};

/* ---------- plant diagram used for labeling (600×640) ---------- */

const DIAGRAM = {
  // where each part "is" (line start) and where its label sits
  point: { roots: [236, 556], stem: [300, 395], leaves: [196, 284], flower: [300, 108], fruit: [420, 228] },
  anchor: { roots: [112, 584], stem: [474, 404], leaves: [96, 196], flower: [132, 70], fruit: [528, 150] },
  hits: [['roots', 300, 530, 95], ['stem', 300, 392, 42], ['leaves', 214, 286, 70], ['leaves', 386, 334, 62], ['flower', 300, 108, 64], ['fruit', 420, 228, 50]],
};

BODY.plantDiagram = (focus = '') => {
  const part = (name, inner) => `<g class="part${focus === name ? ' focus' : ''}" data-part="${name}">${inner}</g>`;
  const roots = ['M300 432 C300 480 296 530 300 604', 'M300 466 C270 486 230 498 200 540', 'M300 466 C330 486 370 498 400 540',
    'M298 516 C270 536 250 558 236 598', 'M302 516 C330 536 352 560 366 598', 'M212 526 C198 532 184 530 170 524', 'M388 526 C402 532 416 530 430 524']
    .map(d => tube(d, C.root, 9, 5)).join('');
  return `
    <rect x="20" y="430" width="560" height="196" rx="36" fill="${C.soil}" stroke="${INK}" stroke-width="6"/>
    <circle cx="70" cy="490" r="7" fill="${C.soilDk}"/><circle cx="520" cy="600" r="8" fill="${C.soilDk}"/><circle cx="540" cy="480" r="6" fill="${C.soilDk}"/><circle cx="160" cy="610" r="5" fill="${C.soilDk}"/>
    ${part('roots', roots)}
    <rect x="18" y="418" width="564" height="22" rx="11" fill="#4DB55A" stroke="${INK}" stroke-width="5"/>
    ${part('stem', tube('M301 264 C330 242 370 222 410 198', C.leafDk, 9, 5) + tube('M300 432 C298 380 304 300 300 150', C.leafDk, 18, 6))}
    ${part('leaves', `
      <path d="M300 300 C260 250 190 245 150 278 C190 320 260 322 300 300Z" fill="${C.leaf}" ${S}/>
      <path d="M296 298 C250 286 200 282 162 280" fill="none" stroke="${C.vein}" stroke-width="4" stroke-linecap="round"/>
      <path d="M300 345 C340 300 410 300 452 330 C410 370 340 372 300 345Z" fill="${C.leaf}" ${S}/>
      <path d="M304 343 C350 332 400 330 440 330" fill="none" stroke="${C.vein}" stroke-width="4" stroke-linecap="round"/>
      <path d="M300 204 C280 182 250 180 236 192 C252 210 280 212 300 204Z" fill="${C.leaf}" ${S}/>`)}
    ${part('fruit', `${tube('M410 198 C415 194 418 192 420 196', C.leafDk, 4, 3)}
      <circle cx="420" cy="228" r="34" fill="#F0384F" ${S}/>
      <path d="M400 222 C400 212 404 206 410 202" stroke="#FF9AA8" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M420 192 L428 202 L440 198 L432 208 L420 204 L408 208 L400 198 L412 202Z" fill="#4DB55A" ${S}/>`)}
    ${part('flower', flowerHead(300, 108, 38, C.petal, C.sun, 6))}
    <g class="lines"></g>
    <g class="hits">${DIAGRAM.hits.map(([p, x, y, r]) => `<circle class="hit" data-part="${p}" cx="${x}" cy="${y}" r="${r}"/>`).join('')}</g>`;
};

/* ---------- wrap bodies into <svg> ---------- */

const VB = { lemonHalf: '0 0 400 400', plantDiagram: '0 0 600 640', lemonBranch: '0 0 600 420', mangrove: '0 0 600 420', garden: '0 0 1600 900', pip: '0 0 220 270' };
const ART = {};
Object.keys(BODY).forEach(k => {
  ART[k] = (...a) => `<svg viewBox="${VB[k] || '0 0 200 200'}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="art art-${k}"${k === 'garden' ? ' preserveAspectRatio="xMidYMax slice"' : ''}>${BODY[k](...a)}</svg>`;
});

// a row of pictures with captions and + / → between them
ART.row = (items, seps = []) => `<div class="art-row" style="--n:${items.length}">` + items.map((it, i) =>
  `<figure>${ART[it.art]()}${it.cap ? `<figcaption>${it.cap}</figcaption>` : ''}</figure>` +
  (i < items.length - 1 ? `<span class="sep">${seps[i] === '→' ? ARROW : seps[i] || ''}</span>` : '')).join('') + '</div>';

const ARROW = `<svg viewBox="0 0 60 40" class="arrow"><path d="M4 20h44M36 6l16 14-16 14" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

// tiny celebration pieces
const BITS = [
  `<svg viewBox="0 0 40 40"><path d="M20 2 L25 15 L38 15 L27 23 L31 37 L20 29 L9 37 L13 23 L2 15 L15 15Z" fill="${C.sun}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/></svg>`,
  `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="${C.petal}" stroke="${INK}" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 40 40"><path d="M20 38 C4 30 4 10 20 2 C36 10 36 30 20 38Z" fill="${C.leaf}" stroke="${INK}" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 40 40"><circle cx="20" cy="20" r="12" fill="${C.water}" stroke="${INK}" stroke-width="3"/></svg>`,
  `<svg viewBox="0 0 40 40"><ellipse cx="20" cy="20" rx="10" ry="17" fill="#7B5CFF" stroke="${INK}" stroke-width="3"/></svg>`,
];
