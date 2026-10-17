# Pip's Magic Garden — design

Grade 1 science game for Lesson 3, "What Are Some Parts of Plants?" (source: `plant_parts_textbook.md`).
Played by a whole class on a touch smartboard, opened from an online link (Vercel).

## Agreed with the teacher

- **Look:** "B+ shaded cartoon" — bright saturated colors, bold dark outlines, plus light and shadow on everything (gradients, glossy highlights, soft drop shadows, grass/soil texture, sun rays). Bouncy, squash-and-stretch motion.
- **Story:** Grow the Magic Plant. Pip is a seed; each finished level grows Pip's next part in lesson order: seed → roots → stem → leaves → flower → fruit. The garden fills with life; Pip blooms into a giant magic plant at the end. The world is colorful from the first screen.
- **Play mode:** whole class together, no scores.
- **Voices:** narrator (warm, cheerful) reads story, lessons and questions; Pip (child voice) gives praise, hints and encouragement. Natural Microsoft neural voices, pre-generated as audio files.
- **Stack (approach 3):** React + Motion for the game, PixiJS (WebGL) layer for the living world and celebration effects, with automatic quality levels for slow PCs.

## Architecture

Three stacked layers over a fixed 1920×1080 stage scaled to fit any screen:

1. **World (PixiJS, back, never receives input):** sky, sun rays, drifting clouds, hills, swaying grass, pollen, garden creatures, celebration particles (bursts, confetti, fireworks).
2. **Game (React + Motion, middle):** Pip, plant, cards, drag and drop, transitions.
3. **Interface (front):** prompt banner with replay, watering-can progress, teacher controls.

```
src/
  content/     lesson data (levels, questions, hints, story and voice lines) — typed, no game logic
  art/         shaded vector art components + shared SVG gradient defs
  activities/  one component per question type + shared drag/tap engine + feedback hook
  screens/     Title, Intro, Garden, Level (Learn → activities → Growth), Finale
  world/       Pixi scene, effects, creatures, event bus, quality manager
  audio/       voice queue (Howler) with lip-sync analyser, synthesized sound effects
  state/       zustand store (screen, level, progress, sound, quality)
scripts/       extract-lines (content → lines.json) and generate_voices.py (edge-tts → public/voice/*.mp3)
```

Communication: React calls the world through a small event bus (`world.burst(x, y, kind)`, `world.confetti()`, `world.fireworks()`, `world.setCreatures(list)`). The world never calls React.

## Flow

1. **Title** — "Pip's Magic Garden", living garden, Pip peeking from the soil, giant Play button.
2. **Intro** (~20 s, skippable) — narrator tells the story; magic water wakes Pip; Pip asks the class for help.
3. **Garden hub** — Pip's plant in the center at its current growth stage (the plant is the progress bar). Seven level stones around it; next one glows, all are tappable. Each finished level adds a creature that roams the garden: earthworm (seed), ladybug (roots), snail (stem), butterflies (leaves), bees (flower), bird (fruit).
4. **Level** — Learn scene (narrator, animated illustration, line highlighting) → 4–5 activities (each correct answer drops magic water into Pip's watering can) → Growth scene (can pours, Pip grows the new part, celebration, creature arrives).
5. **Big Bloom** — mixed challenge → giant bloom, fireworks, "Garden Heroes" class award.

Teacher controls: sound, fullscreen, back to garden, reset progress (long-press). Progress saved in localStorage (guarded; game works without it).

## Activities

All activities support drag **and** tap-then-tap. Wrong answers never lock a child out.

| Type | Interaction |
|---|---|
| choice | tap the one right picture |
| tapAll | tap every right picture |
| sceneTap | tap the right spots inside an illustration (lemon seeds, lemon blossoms, mangrove roots) |
| label | drag words onto the plant diagram |
| dragTo | drag the right things into one target (water → roots; light/air/water → leaf) |
| sort | drag cards into two groups (thin soft stem / thick woody trunk) |
| order | drag cards into a sequence (seed → sprout → plant; flower → fruit → seeds) |
| tapOrder | tap plant parts in order (water's trip: roots → stem → leaves) |

Content covers every vocabulary word and fact on pages 143–147, plus challenge questions within scope (mangrove roots, leaf shapes, sunflower seed grows into a sunflower, who-am-I riddles).

## Voice and feedback

- Every spoken line lives in `content/`. `scripts/extract-lines.ts` collects them with their speaker; `scripts/generate_voices.py` renders each with edge-tts to `public/voice/<hash>.mp3` (hash of speaker + text, FNV-1a, shared with the runtime). Changed text regenerates automatically.
- Voices: narrator `en-US-AvaMultilingualNeural` (fallback Jenny), Pip `en-US-AnaNeural` (child).
- Runtime: queue of clips via Howler; a new line interrupts the old one. Pip's mouth follows the real audio amplitude (Web Audio analyser). Missing clip → browser speech as fallback, game never blocks.
- Right answer: sparkle burst at the card, Pip cheers, water drop flies to the can, Pip says praise + the fact.
- Wrong answer: card wobbles, Pip says encouragement + a hint specific to the mistake. After two misses, the right answer glows.
- Sound effects synthesized with Web Audio (pop, chime, boing, whoosh, fanfare, pour).

## Motion and effects

- Motion: spring entrances, squash-and-stretch on Pip, card drops/wobbles, drag lift and spring-back, screen transitions, growth transformation sequences.
- Pixi: wind-driven grass field, drifting clouds, rotating sun rays, pollen motes, roaming creatures, particle bursts (stars, petals, leaves, water drops), confetti rain, fireworks.
- Quality manager: watches frame rate; steps high → medium → low (fewer blades/particles) if the PC struggles. `prefers-reduced-motion` respected.

## Testing

- Vitest: hash parity, content integrity (every question has a reachable answer, every label matches a diagram part, every spoken line has an audio file after generation).
- Manual pass in the browser through every activity type, growth scene and finale at smartboard resolution.
