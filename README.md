# Pip's Magic Garden

A grade 1 science game for Lesson 3, *What Are Some Parts of Plants?* (seeds, roots, stems, leaves, flowers, fruits).
Made for a classroom touch smartboard. Pip the seed grows a new part for every level the class finishes.

## Play it

- **Online:** open the deployed link on the smartboard and press the full-screen button (top right).
- **On this computer:** `npm install` once, then `npm run dev` and open http://localhost:5173

Children can **drag** cards or **tap a card, then tap where it goes**.
Teacher shortcuts: **→ / Enter** = Next, **R** = hear the question again.
To start over, **press and hold** the round arrow button in the bottom-left of the garden screen.

## Put it online (Vercel)

Live at **https://pips-magic-garden.vercel.app**. The code lives at https://github.com/bongeska7/Plant-Game.

The Vercel project is connected to that GitHub repo: every push to `main` rebuilds and updates the live site
automatically (about a minute). Nothing else to run.

## Change the lesson

All questions, hints and spoken lines live in `src/content/levels.ts` and `src/content/lines.ts`.
After editing any text, regenerate the voices:

```bash
python -m pip install --upgrade edge-tts   # once
npm run voices                              # only new or changed lines are recorded
npm test                                    # checks every question and that every line has a voice file
```

Voices: narrator `en-US-AvaMultilingualNeural`, Pip `en-US-AnaNeural` (set in `scripts/generate_voices.py`).
To use different voices, change them there, delete `public/voice/`, and run `npm run voices` again.

## How it is built

- React + Motion for the game, PixiJS for the living garden behind it and the celebration effects in front.
- The game measures its frame rate and lowers the background effects on slow computers.
- Design notes: `docs/superpowers/specs/2026-10-17-pips-magic-garden-design.md`
- The first version of the game is kept in `_old-v1/`.
