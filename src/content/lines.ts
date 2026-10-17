/* Story and feedback lines. Every string here is voiced (see scripts/extract-lines.ts). */
import type { Part, Speaker } from './types';

export interface Line { who: Speaker; text: string }

export const PRAISE = [
  'Great job!', 'Wow!', 'Amazing!', 'You did it!', 'Super!', 'Fantastic!',
  'Hooray!', 'Way to go!', 'You are a plant expert!', 'Brilliant!', 'Yay! That is right!',
];

export const STEP = ['Yes!', 'Good!', 'Nice!', "That's right!", 'Great!', 'Keep going!'];

export const OOPS = [
  'Good try!', 'Oops, try again!', 'Almost!', "Don't give up!",
  'Hmm, not quite.', 'You can do it!', 'Let’s try again!',
];

export const INTRO: Line[] = [
  { who: 'narrator', text: 'Welcome to the Magic Garden!' },
  { who: 'narrator', text: 'Down in the soil, there is a tiny seed named Pip.' },
  { who: 'narrator', text: 'Pip has a big dream: to grow into the most magical plant in the whole garden!' },
  { who: 'pip', text: "Hi! I'm Pip! But I can't grow all by myself." },
  { who: 'pip', text: 'Every time you answer a question, I get magic water. Will you help me grow?' },
  { who: 'narrator', text: "Let's go, Garden Helpers!" },
];

export const GARDEN_WELCOME = 'Tap a stone to play!';
export const GARDEN_ALL_DONE = 'Pip is a magic plant now! Tap any stone to play again.';

export const READY = "I'm ready!";

export const FINALE: Line[] = [
  { who: 'narrator', text: 'Look! Pip bloomed into a magic plant!' },
  { who: 'pip', text: 'Thank you, Garden Heroes!' },
  { who: 'pip', text: 'You know all my parts: seeds, roots, stems, leaves, flowers, and fruits!' },
];

export const AWARD_TITLE = 'Garden Heroes!';

/** quick cheers Pip says while labeling */
export const LABEL_CHEER: Record<Part, string> = {
  roots: 'Roots!', stem: 'Stem!', leaves: 'Leaves!', flower: 'Flower!', fruit: 'Fruit!',
};

/** hints when a label is dropped on the wrong part of the plant */
export const LABEL_HINT: Record<Part, string> = {
  roots: 'Roots grow down into the soil. Look under the ground!',
  stem: 'The stem is the tall part that holds up the plant.',
  leaves: 'Leaves are green. They make food for the plant.',
  flower: 'The flower is the pink part at the top. It makes seeds.',
  fruit: 'A fruit holds seeds. Look for the round red one!',
};
