# Magic English Quest — Web Prototype 1.1

Fast acceptance harness for the story-first learning game.

## Playable

- real home / continue-adventure hub;
- complete zero-English Phase 0: 10 steps / 50 units;
- Chapter 1 — The Magic Letter;
- Chapter 2 — Potion Mystery;
- Chapter 3 — Owl Message with audio-first reading and functional writing;
- Chapter 4 — Forest Riddle with navigation/spatial play;
- Chapter 5 — Market Day with quantities and a guided market exchange;
- Chapter 6 — The Midnight Room with home/room language, spatial memory and less-assisted spoken responses;
- progressive help ending in short Spanish rescue;
- delayed memory review;
- one-time family-reward coin claims;
- parent-configurable weekly cap, default ARS 2,000;
- repeatable Sing & Speak rhythm mode with non-cash repeat rewards;
- browser speech trial with phrase + word-level transcript similarity feedback;
- conversation autonomy ladder: hear question → answer without model → request hint only if needed;
- lightweight original SVG scene art + optimized WebP concept art;
- original ambient/SFX assets;
- offline service worker when served over HTTP(S).

## Run

Direct `index.html` works for most non-PWA functionality. For service-worker caching and more predictable browser behavior:

```bash
python -m http.server 8000 -d prototype_web
```

Then open `http://localhost:8000`.

Speech recognition is browser-dependent. Missing recognition never counts as failed pronunciation; a guided path remains available.

## QA

```bash
python tools/sync_web_content.py
python tools/validate_content.py
python tools/perf_budget.py
node --check prototype_web/app.js
node --check prototype_web/dialogue_runtime.js
node --check prototype_web/chapter6.js
node tools/smoke_web.js
```
