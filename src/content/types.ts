/* Shapes of the lesson content. Content files hold data only — no game logic. */

export type Speaker = 'narrator' | 'pip';

/** Every picture the game can show. The art registry must provide each one. */
export type ArtKey =
  | 'seed' | 'seeds' | 'sunSeed' | 'pumpkinSeed' | 'sprout' | 'plant'
  | 'sunflower' | 'tulip' | 'daisy' | 'flower' | 'blossom' | 'bloom'
  | 'tree' | 'pineTree' | 'trunk' | 'stem' | 'roots'
  | 'leaf' | 'bananaLeaf' | 'pineNeedles' | 'clover' | 'maple' | 'ash'
  | 'sun' | 'air' | 'water' | 'cloud' | 'food'
  | 'apple' | 'lemon' | 'lemonHalf' | 'strawberry'
  | 'pizza' | 'car' | 'rock' | 'candy' | 'butterfly';

export type SceneKey = 'mangrove' | 'lemonBranch' | 'lemonHalf';

export type LearnArt = 'seed' | 'roots' | 'stem' | 'leaves' | 'flower' | 'fruit' | 'bloom';

/** Parts on the labeled plant diagram. */
export type Part = 'roots' | 'stem' | 'leaves' | 'flower' | 'fruit';

export type CreatureKey = 'worm' | 'ladybug' | 'snail' | 'butterfly' | 'bee' | 'bird';

export interface Pic {
  art: ArtKey;
  label: string;
  /** this picture is a right answer */
  ok?: boolean;
  /** what Pip says when this wrong picture is chosen (replaces the general hint) */
  no?: string;
}

interface Base {
  /** read by the narrator and shown in the banner */
  prompt: string;
  /** Pip's general hint after a wrong answer */
  hint: string;
  /** Pip's fact after the right answer, said after a praise word */
  yes: string;
}

export interface ChoiceQ extends Base { type: 'choice'; options: Pic[]; show?: ArtKey; hideLabels?: boolean }
export interface TapAllQ extends Base { type: 'tapAll'; items: Pic[] }
export interface SceneTapQ extends Base { type: 'sceneTap'; scene: SceneKey; wrong?: Record<string, string> }
export interface LabelQ extends Base { type: 'label'; labels: Part[] }
export interface DragToQ extends Base { type: 'dragTo'; target: Pic; items: Pic[] }
export interface SortQ extends Base {
  type: 'sort';
  bins: { id: string; art: ArtKey; label: string }[];
  items: (Pic & { bin: string })[];
}
export interface OrderQ extends Base { type: 'order'; items: Pic[] }
export interface TapOrderQ extends Base {
  type: 'tapOrder';
  steps: { part: Part; hint: string; say?: string }[];
}

export type Question = ChoiceQ | TapAllQ | SceneTapQ | LabelQ | DragToQ | SortQ | OrderQ | TapOrderQ;

export interface Level {
  id: 'seed' | 'roots' | 'stem' | 'leaves' | 'flower' | 'fruit' | 'bloom';
  name: string;
  icon: ArtKey;
  color: string;
  creature?: CreatureKey;
  /** narrator line on the garden screen when this is the next level */
  gardenLine: string;
  learn: { title: string; word: string; art: LearnArt; lines: string[] };
  questions: Question[];
  /** extra questions; a few are picked at random each time (used by Big Bloom) */
  pool?: Question[];
  poolPick?: number;
  growth: { title: string; narrator: string; pip: string };
}
