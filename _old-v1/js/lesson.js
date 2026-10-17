/* Lesson 3 — What Are Some Parts of Plants?
   All facts come from plant_parts_textbook.md (pages 143–147). */

const PRAISE = ['Great job!', 'Wow!', 'Amazing!', 'You did it!', 'Super!', 'Fantastic!', 'Hooray!', 'Way to go!', 'You are a plant expert!', 'Brilliant!'];
const STEP = ['Yes!', 'Good!', 'Nice!', "That's right!", 'Great!', 'Yes, keep going!'];
const OOPS = ['Good try!', 'Oops, try again!', 'Almost!', "Don't give up!", 'Hmm, not quite.', 'Keep trying, you can do it!'];
const FOG_LINES = ['Look! The garden is getting brighter!', 'The Gray Fog is going away!', 'More colors are coming back!'];

const INTRO = [
  "Hi! I'm Pip, a little seed.",
  'Oh no! The Gray Fog took all the colors from our garden!',
  'Learn the parts of a plant to chase the fog away. Will you help me?',
];

const FINALE = 'You did it! The Gray Fog is gone, and our garden is full of color! You know all the parts of a plant: seeds, roots, stems, leaves, flowers, and fruits. You are a Garden Hero!';

// hints when a label is dropped on the wrong part
const LABEL_HINT = {
  roots: 'Roots grow down into the soil. Look under the ground!',
  stem: 'The stem is the tall part that holds up the plant.',
  leaves: 'Leaves are green. They make food for the plant.',
  flower: 'The flower is the pink part at the top. It makes seeds.',
  fruit: 'A fruit holds seeds. Look for the round red one!',
};

const PART_CARDS = [
  { key: 'seed', art: 'seed', label: 'seed' },
  { key: 'roots', art: 'roots', label: 'roots' },
  { key: 'stem', art: 'stem', label: 'stem' },
  { key: 'leaf', art: 'leaf', label: 'leaf' },
  { key: 'flower', art: 'flower', label: 'flower' },
  { key: 'fruit', art: 'apple', label: 'fruit' },
];

const RIDDLES = [
  { key: 'roots', prompt: 'I hold the plant in place. I take in water from the soil. Who am I?', hint: 'I grow under the ground, in the soil.', yes: 'Roots hold the plant in place and take in water.' },
  { key: 'stem', prompt: 'I hold up the plant. I carry water from the roots. Who am I?', hint: 'I am tall. A tree has a thick, woody one called a trunk.', yes: 'The stem holds up the plant.' },
  { key: 'leaf', prompt: 'I make food for the plant. I use light, air, and water. Who am I?', hint: 'I am green, and I come in many shapes and sizes.', yes: 'A leaf makes food for the plant.' },
  { key: 'flower', prompt: 'I am a plant part that makes seeds. Who am I?', hint: 'Many plants have me. I can be very colorful!', yes: 'A flower makes seeds.' },
  { key: 'fruit', prompt: 'I hold seeds inside me. A lemon is one of me! Who am I?', hint: 'Many flowers grow into me. An apple is one too!', yes: 'A fruit holds seeds.' },
  { key: 'seed', prompt: 'A new plant may grow from me. Who am I?', hint: 'I am small. I am inside a fruit.', yes: 'A new plant may grow from a seed.' },
];

const CHAPTERS = [
  {
    id: 'seed', name: 'Seeds', icon: 'seed', color: '#E0A867',
    mapSay: "Let's learn about seeds! Tap the seed to start.",
    doneTitle: 'You learned about seeds!',
    recap: 'A new plant may grow from a seed.',
    learn: {
      title: "Let's learn about seeds!", word: 'seed',
      art: () => ART.row([{ art: 'seed', cap: 'seed' }, { art: 'sprout', cap: 'sprout' }, { art: 'plantFlower', cap: 'plant' }], ['→', '→']),
      lines: ['A new plant may grow from a seed.', 'The new plant will look like the plant that made the seed.'],
    },
    questions: [
      {
        type: 'choice', prompt: 'Which one is a seed?',
        options: [{ art: 'seed', label: 'seed', ok: true }, { art: 'leaf', label: 'leaf' }, { art: 'rock', label: 'rock', no: 'That is a rock. A plant cannot grow from a rock!' }],
        hint: 'A seed is small. A new plant can grow from it!',
        yes: 'That is a seed. A new plant may grow from it.',
      },
      {
        type: 'tapAll', prompt: 'Seeds come in many shapes! Tap all the seeds.',
        items: [
          { art: 'seed', label: 'bean seed', ok: true }, { art: 'sunSeed', label: 'sunflower seed', ok: true }, { art: 'pumpkinSeed', label: 'pumpkin seed', ok: true },
          { art: 'rock', label: 'rock', no: 'That is a rock. A plant cannot grow from a rock!' },
          { art: 'candy', label: 'candy', no: 'That is candy! A plant cannot grow from candy.' },
          { art: 'car', label: 'toy car', no: 'That is a toy car, silly! It is not a seed.' },
        ],
        hint: 'Look for the small things that a new plant can grow from.',
        yes: 'You found all the seeds!',
      },
      {
        type: 'order', prompt: 'How does a seed grow? Put the pictures in order.',
        items: [{ art: 'seed', label: 'seed' }, { art: 'sprout', label: 'sprout' }, { art: 'plantFlower', label: 'plant' }],
        hint: 'Every plant starts as a tiny seed. Then it grows a little, then it gets big!',
        yes: 'A seed grows into a sprout, and then into a big plant.',
      },
      {
        type: 'choice', prompt: 'This seed came from a sunflower. What will it grow into?', show: 'sunSeed',
        options: [{ art: 'sunflower', label: 'sunflower', ok: true }, { art: 'tree', label: 'tree' }, { art: 'tulip', label: 'tulip' }],
        hint: 'Remember: the new plant looks like the plant that made the seed!',
        yes: 'A sunflower seed grows into a sunflower. It looks like the plant that made it!',
      },
    ],
  },

  {
    id: 'roots', name: 'Roots', icon: 'roots', color: '#E8B26A',
    mapSay: "Next, let's learn about roots! Tap the roots.",
    doneTitle: 'You learned about roots!',
    recap: 'Roots hold the plant in place and take in water from the soil.',
    learn: {
      title: "Let's learn about roots!", word: 'roots',
      art: () => ART.plantDiagram('roots'),
      lines: ['Roots grow into the soil.', 'Roots hold the plant in place.', 'Roots take in water from the soil.'],
    },
    questions: [
      {
        type: 'label', prompt: 'Drag the word to the roots of the plant.', labels: ['roots'],
        hint: 'Roots grow down into the soil. Look under the ground!',
        yes: 'The roots are under the ground, in the soil.',
      },
      {
        type: 'choice', prompt: 'What holds this tree in place?', show: 'tree',
        options: [{ art: 'roots', label: 'roots', ok: true }, { art: 'leaf', label: 'leaves' }, { art: 'flower', label: 'flower' }],
        hint: 'It is under the ground. It holds on tight to the soil.',
        yes: 'Roots hold the tree in place.',
      },
      {
        type: 'dragTo', prompt: 'What do roots take in from the soil? Drag it to the roots.',
        target: { art: 'roots', label: 'roots' },
        items: [
          { art: 'water', label: 'water', ok: true },
          { art: 'candy', label: 'candy', no: 'Roots do not eat candy! Plants get thirsty. What do they drink?' },
          { art: 'car', label: 'toy car', no: 'A toy car? Silly! Plants get thirsty. What do they drink?' },
          { art: 'pizza', label: 'pizza', no: 'Plants do not eat pizza! What do roots drink from the soil?' },
        ],
        hint: 'Plants get thirsty! What do they drink?',
        yes: 'Roots take in water from the soil.',
      },
      {
        type: 'scene', scene: 'mangrove', prompt: 'Some roots grow above the water! Tap the roots of this mangrove tree.',
        hint: 'Roots are at the bottom of the tree, near the water.',
        yes: 'Mangrove tree roots grow above the water.',
      },
    ],
  },

  {
    id: 'stem', name: 'Stems', icon: 'stem', color: '#7FD46E',
    mapSay: "Now let's learn about stems! Tap the stem.",
    doneTitle: 'You learned about stems!',
    recap: 'The stem holds up the plant and takes water to the other parts.',
    learn: {
      title: "Let's learn about stems!", word: 'stem',
      art: () => ART.row([{ art: 'daisy', cap: 'thin, soft stem' }, { art: 'tree', cap: 'thick, woody trunk' }], ['']),
      lines: ['The stem holds up the plant.', 'It takes water from the roots to the other parts of the plant.', 'A flower has a thin, soft stem. A tree has a thick, woody stem, called a trunk.'],
    },
    questions: [
      {
        type: 'label', prompt: 'Drag the word to the stem of the plant.', labels: ['stem'],
        hint: 'The stem is the tall green part that holds up the plant.',
        yes: 'The stem holds up the plant.',
      },
      {
        type: 'sort', prompt: 'Thin and soft, or thick and woody? Sort the plants!',
        bins: [{ id: 'thin', art: 'stem', label: 'thin, soft stem' }, { id: 'thick', art: 'trunk', label: 'thick, woody trunk' }],
        items: [
          { art: 'daisy', label: 'daisy', bin: 'thin', no: 'Look again! A flower has a thin, soft stem.' },
          { art: 'tulip', label: 'tulip', bin: 'thin', no: 'Look again! A flower has a thin, soft stem.' },
          { art: 'tree', label: 'oak tree', bin: 'thick', no: 'A tree has a thick, woody stem called a trunk.' },
          { art: 'pineTree', label: 'pine tree', bin: 'thick', no: 'A tree has a thick, woody stem called a trunk.' },
        ],
        hint: 'Flowers have thin stems. Trees have thick trunks.',
        yes: 'Flowers have thin, soft stems. Trees have thick, woody trunks.',
      },
      {
        type: 'tapOrder', prompt: 'Water goes on a trip! Where does the water go first? Tap it.',
        steps: [
          { part: 'roots', hint: 'Water comes from the soil. Which part is in the soil?', say: 'Yes! The roots take in water. Where does the water go next?' },
          { part: 'stem', hint: 'The water goes up the tall part that holds up the plant.', say: 'Yes! The stem carries the water up. Where does it go next?' },
          { part: 'leaves', hint: 'The water goes to the green part that makes food.', say: '' },
        ],
        hint: 'Water comes from the soil.',
        yes: 'Water goes from the roots, up the stem, to the leaves.',
      },
      {
        type: 'choice', prompt: 'What do we call the thick, woody stem of a tree?',
        options: [{ art: 'trunk', label: 'trunk', ok: true }, { art: 'leaf', label: 'leaf' }, { art: 'apple', label: 'fruit' }],
        hint: 'It starts with T. It holds up the whole tree!',
        yes: "A tree's thick, woody stem is called a trunk.",
      },
    ],
  },

  {
    id: 'leaves', name: 'Leaves', icon: 'leaf', color: '#9BE28A',
    mapSay: "Let's learn about leaves! Tap the leaf.",
    doneTitle: 'You learned about leaves!',
    recap: 'A leaf makes food for the plant. It uses light, air, and water.',
    learn: {
      title: "Let's learn about leaves!", word: 'leaf',
      art: () => ART.row([{ art: 'sun', cap: 'light' }, { art: 'air', cap: 'air' }, { art: 'water', cap: 'water' }, { art: 'leaf', cap: 'food!' }], ['+', '+', '→']),
      lines: ['A leaf is a plant part that makes food for the plant.', 'It uses light, air, and water.', 'Leaves can be different shapes and sizes.'],
    },
    questions: [
      {
        type: 'dragTo', prompt: 'A leaf needs 3 things to make food. Drag them to the leaf!',
        target: { art: 'leaf', label: 'leaf' },
        items: [
          { art: 'sun', label: 'light', ok: true }, { art: 'air', label: 'air', ok: true }, { art: 'water', label: 'water', ok: true },
          { art: 'pizza', label: 'pizza', no: 'Plants do not eat pizza, silly! A leaf uses light, air, and water.' },
          { art: 'car', label: 'toy car', no: 'A leaf does not need a toy car! It uses light, air, and water.' },
          { art: 'rock', label: 'rock', no: 'A leaf does not use rocks. It uses light, air, and water.' },
        ],
        hint: 'A leaf uses light from the sun, air, and water.',
        yes: 'A leaf uses light, air, and water to make food.',
      },
      {
        type: 'tapAll', prompt: 'Leaves can be different shapes and sizes! Tap all the leaves.',
        items: [
          { art: 'bananaLeaf', label: 'banana leaf', ok: true }, { art: 'pineNeedles', label: 'pine needles', ok: true },
          { art: 'clover', label: 'clover', ok: true }, { art: 'maple', label: 'red maple', ok: true }, { art: 'ash', label: 'ash', ok: true },
          { art: 'butterfly', label: 'butterfly', no: 'That is a butterfly, not a leaf!' },
          { art: 'apple', label: 'apple', no: 'An apple is a fruit, not a leaf.' },
          { art: 'rock', label: 'rock', no: 'That is a rock, not a leaf.' },
        ],
        hint: 'Leaves are usually green, but some are red. Some are long and thin like needles!',
        yes: 'Pine needles, clover, and maple are all leaves. Leaves come in many shapes and sizes!',
      },
      {
        type: 'choice', prompt: 'What does a leaf make for the plant?',
        options: [{ art: 'food', label: 'food', ok: true }, { art: 'seeds', label: 'seeds', no: 'Flowers make seeds. A leaf makes something else!' }, { art: 'rock', label: 'rocks' }],
        hint: 'A leaf uses light, air, and water to make something the plant needs to grow.',
        yes: 'A leaf makes food for the plant.',
      },
      {
        type: 'choice', prompt: 'Which one is pine needles?', hideLabels: true,
        options: [{ art: 'pineNeedles', label: 'pine needles', ok: true }, { art: 'maple', label: 'red maple' }, { art: 'clover', label: 'clover' }, { art: 'bananaLeaf', label: 'banana leaf' }],
        hint: 'Pine needles are long and thin, like tiny sticks!',
        yes: 'Pine needles are leaves too. They are long and thin.',
      },
    ],
  },

  {
    id: 'flower', name: 'Flowers', icon: 'flower', color: '#FF8FB0',
    mapSay: "Let's learn about flowers! Tap the flower.",
    doneTitle: 'You learned about flowers!',
    recap: 'A flower is a plant part that makes seeds.',
    learn: {
      title: "Let's learn about flowers!", word: 'flower',
      art: () => ART.row([{ art: 'flower', cap: 'flower' }, { art: 'seeds', cap: 'seeds' }], ['→']),
      lines: ['Many plants have flowers.', 'A flower is a plant part that makes seeds.'],
    },
    questions: [
      {
        type: 'label', prompt: 'Drag the word to the flower of the plant.', labels: ['flower'],
        hint: 'The flower is the pink part at the top of the plant!',
        yes: 'That is the flower.',
      },
      {
        type: 'choice', prompt: 'What does a flower make?',
        options: [{ art: 'seeds', label: 'seeds', ok: true }, { art: 'water', label: 'water' }, { art: 'rock', label: 'rocks' }],
        hint: 'A flower makes something small that a new plant can grow from.',
        yes: 'A flower makes seeds.',
      },
      {
        type: 'scene', scene: 'lemonBranch', prompt: 'Look at this lemon tree! Tap all the flowers.',
        hint: 'Look for the white flowers!',
        yes: 'You found all the flowers on the lemon tree.',
      },
      {
        type: 'tapAll', prompt: 'Many plants have flowers! Tap all the flowers.',
        items: [
          { art: 'daisy', label: 'daisy', ok: true }, { art: 'tulip', label: 'tulip', ok: true }, { art: 'sunflower', label: 'sunflower', ok: true },
          { art: 'pineTree', label: 'pine tree', no: 'That is a pine tree. Look for the colorful flowers!' },
          { art: 'clover', label: 'clover', no: 'That is a clover leaf. Look for the colorful flowers!' },
          { art: 'lemon', label: 'lemon', no: 'A lemon is a fruit. Look for the colorful flowers!' },
        ],
        hint: 'Flowers have petals. They can be very colorful!',
        yes: 'Daisies, tulips, and sunflowers are all flowers.',
      },
    ],
  },

  {
    id: 'fruit', name: 'Fruits', icon: 'apple', color: '#FF9C6B',
    mapSay: "Let's learn about fruits! Tap the apple.",
    doneTitle: 'You learned about fruits!',
    recap: 'Many flowers grow into fruits. A fruit holds seeds.',
    learn: {
      title: "Let's learn about fruits!", word: 'fruit',
      art: () => ART.row([{ art: 'blossom', cap: 'flower' }, { art: 'lemon', cap: 'fruit' }, { art: 'lemonHalf', cap: 'seeds' }], ['→', '→']),
      lines: ['Many flowers grow into fruits.', 'A fruit holds seeds.'],
    },
    questions: [
      {
        type: 'scene', scene: 'lemonHalf', prompt: 'A fruit holds seeds. Tap all the seeds inside the lemon!',
        hint: 'Seeds are small. They look like little drops.',
        yes: 'The lemon holds its seeds inside.',
      },
      {
        type: 'choice', prompt: 'What does a fruit hold?',
        options: [{ art: 'seeds', label: 'seeds', ok: true }, { art: 'roots', label: 'roots' }, { art: 'water', label: 'water' }],
        hint: 'Think about the lemon. What was inside it?',
        yes: 'A fruit holds seeds.',
      },
      {
        type: 'order', prompt: 'What comes first? Put the pictures in order.',
        items: [{ art: 'blossom', label: 'flower' }, { art: 'lemon', label: 'fruit' }, { art: 'lemonHalf', label: 'seeds' }],
        hint: 'First a flower grows. The flower grows into a fruit. The fruit holds seeds!',
        yes: 'A flower grows into a fruit, and the fruit holds seeds.',
      },
      {
        type: 'tapAll', prompt: 'Tap all the fruits!',
        items: [
          { art: 'apple', label: 'apple', ok: true }, { art: 'lemon', label: 'lemon', ok: true }, { art: 'strawberry', label: 'strawberry', ok: true },
          { art: 'daisy', label: 'daisy', no: 'That is a flower. Many flowers grow into fruits, but it is not a fruit yet!' },
          { art: 'leaf', label: 'leaf', no: 'That is a leaf. A fruit holds seeds!' },
          { art: 'rock', label: 'rock', no: 'That is a rock. A fruit holds seeds!' },
        ],
        hint: 'A fruit holds seeds inside. Which ones could you cut open and find seeds?',
        yes: 'Apples, lemons, and strawberries are fruits. They all hold seeds.',
      },
    ],
  },

  {
    id: 'bloom', name: 'Big Bloom', icon: 'bloom', color: '#B9A6FF',
    mapSay: 'You learned all the plant parts! Now tap the big flower for the final challenge!',
    doneTitle: 'You finished the Big Bloom!',
    recap: '',
    learn: {
      title: 'The Big Bloom challenge!', word: 'Show what you know!',
      art: () => ART.plantDiagram(),
      lines: ['Plants have parts that help them grow and change.', 'Seeds, roots, stems, leaves, flowers, and fruits!'],
    },
    build() {
      const label = {
        type: 'label', prompt: 'Label the whole plant! Drag each word to its part.', labels: ['roots', 'stem', 'leaves', 'flower', 'fruit'],
        hint: 'Look carefully at each part of the plant.',
        yes: 'You labeled the whole plant!',
      };
      const riddles = shuffle(RIDDLES).slice(0, 4).map(r => ({
        type: 'choice', prompt: r.prompt, hint: r.hint, yes: r.yes,
        options: PART_CARDS.map(p => ({ ...p, ok: p.key === r.key })),
      }));
      return [label, ...riddles];
    },
  },
];
