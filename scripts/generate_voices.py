"""Render every game line to natural-voice MP3 files with Microsoft neural voices (edge-tts).

Usage:  npm run voices        (extracts lines, then runs this script)
Only missing files are generated, so edited lines are picked up automatically.
Delete public/voice/ to regenerate everything (e.g. after changing a voice below).
"""
import asyncio
import json
import sys
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parent.parent
LINES = ROOT / "scripts" / "lines.json"
OUT = ROOT / "public" / "voice"

# warm, cheerful storyteller and a real child's voice for Pip
VOICES = {
    "narrator": {"voice": "en-US-AvaMultilingualNeural", "rate": "-6%", "pitch": "+0Hz"},
    "pip": {"voice": "en-US-AnaNeural", "rate": "+0%", "pitch": "+6Hz"},
}
FALLBACK = {"narrator": "en-US-JennyNeural", "pip": "en-US-AnaNeural"}
PARALLEL = 6


async def render(line: dict, sem: asyncio.Semaphore) -> str:
    target = OUT / f"{line['id']}.mp3"
    if target.exists() and target.stat().st_size > 0:
        return "skip"
    cfg = VOICES[line["who"]]
    async with sem:
        for voice in (cfg["voice"], FALLBACK[line["who"]]):
            for attempt in range(3):
                try:
                    tts = edge_tts.Communicate(line["text"], voice, rate=cfg["rate"], pitch=cfg["pitch"])
                    tmp = target.with_suffix(".part")
                    await tts.save(str(tmp))
                    tmp.replace(target)
                    return "made"
                except Exception as err:  # network hiccups: retry, then try the fallback voice
                    last = err
                    await asyncio.sleep(1.5 * (attempt + 1))
        print(f"FAILED {line['id']}: {line['text']!r} ({last})", file=sys.stderr)
        return "fail"


async def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    lines = json.loads(LINES.read_text(encoding="utf-8"))
    sem = asyncio.Semaphore(PARALLEL)
    results = await asyncio.gather(*(render(l, sem) for l in lines))
    made, skipped, failed = results.count("made"), results.count("skip"), results.count("fail")
    print(f"voices: {made} new, {skipped} already there, {failed} failed — {OUT}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
