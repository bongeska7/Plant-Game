/* Lesson 3 — What Are Some Parts of Plants? (textbook pages 143–147)
   Every fact below comes from plant_parts_textbook.md. */
import type { Level, Question } from './types';

const PART_CARDS = [
  { key: 'seed', art: 'seed', label: 'seed' },
  { key: 'roots', art: 'roots', label: 'roots' },
  { key: 'stem', art: 'stem', label: 'stem' },
  { key: 'leaf', art: 'leaf', label: 'leaf' },
  { key: 'flower', art: 'flower', label: 'flower' },
  { key: 'fruit', art: 'apple', label: 'fruit' },
] as const;

const riddle = (key: (typeof PART_CARDS)[number]['key'], prompt: string, hint: string, yes: string): Question => ({
  type: 'choice', prompt, hint, yes,
  options: PART_CARDS.map(p => ({ art: p.art, label: p.label, ok: p.key === key })),
});

export const LEVELS: Level[] = [
  {
    id: 'seed', name: 'Seeds', icon: 'seed', color: '#F2A65A', creature: 'worm',
    gardenLine: 'Pip is a tiny seed. Tap the seed stone to begin!',
    learn: {
      title: "Let's learn about seeds!", word: 'seed', art: 'seed',
      lines: ['A new plant may grow from a seed.', 'The new plant will look like the plant that made the seed.'],
    },
    questions: [
      {
        type: 'choice', prompt: 'Which one is a seed?',
        options: [
          { art: 'seed', label: 'seed', ok: true },
          { art: 'leaf', label: 'leaf', no: 'That is a leaf. Look for something small that a plant can grow from.' },
          { art: 'rock', label: 'rock', no: 'That is a rock. A plant cannot grow from a rock!' },
        ],
        hint: 'A seed is small. A new plant can grow from it!',
        yes: 'That is a seed. A new plant may grow from it.',
      },
      {
        type: 'tapAll', prompt: 'Seeds come in many shapes! Tap all the seeds.',
        items: [
          { art: 'seed', label: 'bean seed', ok: true },
          { art: 'sunSeed', label: 'sunflower seed', ok: true },
          { art: 'pumpkinSeed', label: 'pumpkin seed', ok: true },
          { art: 'rock', label: 'rock', no: 'That is a rock. A plant cannot grow from a rock!' },
          { art: 'candy', label: 'candy', no: 'That is candy! A plant cannot grow from candy.' },
          { art: 'car', label: 'toy car', no: 'A toy car? Silly! That is not a seed.' },
        ],
        hint: 'Look for the small things that a new plant can grow from.',
        yes: 'You found all the seeds!',
      },
      {
        type: 'order', prompt: 'How does a seed grow? Put the pictures in order.',
        items: [{ art: 'seed', label: 'seed' }, { art: 'sprout', label: 'sprout' }, { art: 'plant', label: 'plant' }],
        hint: 'Every plant starts as a tiny seed. Then it grows a little, then it gets big!',
        yes: 'A seed grows into a sprout, and then into a big plant.',
      },
      {
        type: 'choice', prompt: 'This seed came from a sunflower. What will it grow into?', show: 'sunSeed',
        options: [
          { art: 'sunflower', label: 'sunflower', ok: true },
          { art: 'tree', label: 'tree' },
          { art: 'tulip', label: 'tulip' },
        ],
        hint: 'Remember: the new plant looks like the plant that made the seed!',
        yes: 'A sunflower seed grows into a sunflower. It looks like the plant that made it!',
      },
    ],
    growth: {
      title: 'Pip woke up!',
      narrator: 'The magic water made Pip wake up and sprout!',
      pip: 'Yay! A new plant may grow from a seed. That is me!',
    },
  },

  {
    id: 'roots', name: 'Roots', icon: 'roots', color: '#E9B872', creature: 'ladybug',
    gardenLine: 'Next, Pip needs roots. Tap the roots stone!',
    learn: {
      title: "Let's learn about roots!", word: 'roots', art: 'roots',
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
        options: [
          { art: 'roots', label: 'roots', ok: true },
          { art: 'leaf', label: 'leaves', no: 'Leaves are up high. Look under the ground!' },
          { art: 'flower', label: 'flower', no: 'A flower makes seeds. What holds on tight under the ground?' },
        ],
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
        type: 'sceneTap', scene: 'mangrove', prompt: 'Some roots grow above the water! Tap the roots of this mangrove tree.',
        wrong: {
          trunk: "That is the trunk. It is the tree's thick stem. Look down for the roots!",
          leaves: 'Those are the leaves. Look down, near the water!',
        },
        hint: 'Roots are at the bottom of the tree, near the water.',
        yes: 'Mangrove tree roots grow above the water.',
      },
    ],
    growth: {
      title: 'Pip grew roots!',
      narrator: 'Look! Pip grew roots deep down into the soil!',
      pip: 'My roots hold me in place, and they drink water. Slurp!',
    },
  },

  {
    id: 'stem', name: 'Stems', icon: 'stem', color: '#8FD46E', creature: 'snail',
    gardenLine: 'Now Pip needs a stem to stand tall. Tap the stem stone!',
    learn: {
      title: "Let's learn about stems!", word: 'stem', art: 'stem',
      lines: [
        'The stem holds up the plant.',
        'It takes water from the roots to the other parts of the plant.',
        'A flower has a thin, soft stem. A tree has a thick, woody stem, called a trunk.',
      ],
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
          { part: 'leaves', hint: 'The water goes to the green part that makes food.' },
        ],
        hint: 'Water comes from the soil.',
        yes: 'Water goes from the roots, up the stem, to the leaves.',
      },
      {
        type: 'choice', prompt: 'What do we call the thick, woody stem of a tree?',
        options: [
          { art: 'trunk', label: 'trunk', ok: true },
          { art: 'leaf', label: 'leaf' },
          { art: 'apple', label: 'fruit' },
        ],
        hint: 'It starts with T. It holds up the whole tree!',
        yes: "A tree's thick, woody stem is called a trunk.",
      },
    ],
    growth: {
      title: 'Pip grew a stem!',
      narrator: 'Wow! Pip grew a tall, strong stem!',
      pip: 'My stem holds me up, and it carries water from my roots. Look how tall I am!',
    },
  },

  {
    id: 'leaves', name: 'Leaves', icon: 'leaf', color: '#7BD86A', creature: 'butterfly',
    gardenLine: 'Pip needs leaves to make food. Tap the leaf stone!',
    learn: {
      title: "Let's learn about leaves!", word: 'leaf', art: 'leaves',
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
        options: [
          { art: 'food', label: 'food', ok: true },
          { art: 'seeds', label: 'seeds', no: 'Flowers make seeds. A leaf makes something else!' },
          { art: 'rock', label: 'rocks', no: 'Leaves do not make rocks! What does the plant need to grow?' },
        ],
        hint: 'A leaf uses light, air, and water to make something the plant needs to grow.',
        yes: 'A leaf makes food for the plant.',
      },
      {
        type: 'choice', prompt: 'Which one is pine needles?', hideLabels: true,
        options: [
          { art: 'pineNeedles', label: 'pine needles', ok: true },
          { art: 'maple', label: 'red maple' },
          { art: 'clover', label: 'clover' },
          { art: 'bananaLeaf', label: 'banana leaf' },
        ],
        hint: 'Pine needles are long and thin, like tiny sticks!',
        yes: 'Pine needles are leaves too. They are long and thin.',
      },
    ],
    growth: {
      title: 'Pip grew leaves!',
      narrator: 'Hooray! Pip grew big green leaves!',
      pip: 'My leaves make food for me. They use light, air, and water. Yummy!',
    },
  },

  {
    id: 'flower', name: 'Flowers', icon: 'flower', color: '#FF8FB0', creature: 'bee',
    gardenLine: 'Pip is ready to bloom! Tap the flower stone!',
    learn: {
      title: "Let's learn about flowers!", word: 'flower', art: 'flower',
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
        options: [
          { art: 'seeds', label: 'seeds', ok: true },
          { art: 'water', label: 'water' },
          { art: 'rock', label: 'rocks' },
        ],
        hint: 'A flower makes something small that a new plant can grow from.',
        yes: 'A flower makes seeds.',
      },
      {
        type: 'sceneTap', scene: 'lemonBranch', prompt: 'Look at this lemon tree! Tap all the flowers.',
        wrong: {
          lemon: 'That is a lemon. A lemon is a fruit! Look for the white flowers.',
          leaf: 'That is a leaf. Look for the white flowers!',
        },
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
    growth: {
      title: 'Pip has a flower!',
      narrator: 'Ooh! A beautiful flower opened on top of Pip!',
      pip: 'My flower will make seeds. And look, the bees came to visit!',
    },
  },

  {
    id: 'fruit', name: 'Fruits', icon: 'apple', color: '#FF9C6B', creature: 'bird',
    gardenLine: 'Pip is almost done growing! Tap the fruit stone!',
    learn: {
      title: "Let's learn about fruits!", word: 'fruit', art: 'fruit',
      lines: ['Many flowers grow into fruits.', 'A fruit holds seeds.'],
    },
    questions: [
      {
        type: 'sceneTap', scene: 'lemonHalf', prompt: 'A fruit holds seeds. Tap all the seeds inside the lemon!',
        hint: 'Seeds are small. They look like little drops.',
        yes: 'The lemon holds its seeds inside.',
      },
      {
        type: 'choice', prompt: 'What does a fruit hold?',
        options: [
          { art: 'seeds', label: 'seeds', ok: true },
          { art: 'roots', label: 'roots' },
          { art: 'water', label: 'water' },
        ],
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
    growth: {
      title: 'Pip grew fruit!',
      narrator: 'Amazing! Pip’s flower grew into a juicy fruit!',
      pip: 'My fruit holds seeds inside. New plants can grow from them!',
    },
  },

  {
    id: 'bloom', name: 'Big Bloom', icon: 'bloom', color: '#B9A6FF',
    gardenLine: 'Pip has all the parts! Tap the big flower for the final challenge!',
    learn: {
      title: 'The Big Bloom challenge!', word: 'Show what you know!', art: 'bloom',
      lines: ['Plants have parts that help them grow and change.', 'Seeds, roots, stems, leaves, flowers, and fruits!'],
    },
    questions: [
      {
        type: 'label', prompt: 'Label the whole plant! Drag each word to its part.', labels: ['roots', 'stem', 'leaves', 'flower', 'fruit'],
        hint: 'Look carefully at each part of the plant.',
        yes: 'You labeled the whole plant!',
      },
    ],
    pool: [
      riddle('roots', 'I hold the plant in place. I take in water from the soil. Who am I?', 'I grow under the ground, in the soil.', 'Roots hold the plant in place and take in water.'),
      riddle('stem', 'I hold up the plant. I carry water from the roots. Who am I?', 'I am tall. A tree has a thick, woody one called a trunk.', 'The stem holds up the plant.'),
      riddle('leaf', 'I make food for the plant. I use light, air, and water. Who am I?', 'I am green, and I come in many shapes and sizes.', 'A leaf makes food for the plant.'),
      riddle('flower', 'I am a plant part that makes seeds. Who am I?', 'Many plants have me. I can be very colorful!', 'A flower makes seeds.'),
      riddle('fruit', 'I hold seeds inside me. A lemon is one of me! Who am I?', 'Many flowers grow into me. An apple is one too!', 'A fruit holds seeds.'),
      riddle('seed', 'A new plant may grow from me. Who am I?', 'I am small. I am inside a fruit.', 'A new plant may grow from a seed.'),
    ],
    poolPick: 4,
    growth: {
      title: 'Pip bloomed!',
      narrator: 'Look! Pip bloomed into a magic plant!',
      pip: 'Thank you, Garden Heroes!',
    },
  },
];
