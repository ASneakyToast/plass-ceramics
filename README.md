# Glaze Studio

A personal app for tracking AMACO glaze combinations, test results, bowl firing plans, and a shopping list for missing glazes.

Built with [Astro](https://astro.build) — fast, simple, no framework overhead.

---

## Running locally

```bash
npm install
npm run dev
```

Then open [localhost:4321](http://localhost:4321) in your browser.

---

## Building

```bash
npm run build
```

This creates a `dist/` folder with your finished app. To test the PWA (installable, offline) before deploying:

```bash
npm run preview
```

Then open the local URL it prints. You can install it from there just like you would on your phone.

---

## Project structure

```
src/
  data/         ← Your glaze and combo reference data (JSON files you can edit)
  components/   ← One file per tab (Combos, Tests, Planner, Shopping List)
  layouts/      ← Base.astro: the HTML shell, head tags, and tab bar
  scripts/      ← All the interactive JavaScript
  styles/       ← global.css: all the visual design
  pages/
    index.astro ← Puts everything together

public/
  manifest.json ← PWA config
  sw.js         ← Service worker (offline support)
  icon-192.png
  icon-512.png
```

---

## Your data

All your glaze reference data lives in `src/data/`. These are plain text files you can open and edit directly.

| File | What it contains |
|------|-----------------|
| `glazes.json` | Your 11 glazes — code, name, colour hex, AMACO slug |
| `combos.json` | All 26 documented combinations |
| `missing.json` | Glazes you don't own yet, with combos they'd unlock |
| `props.json` | Fluid level and celadon flag for each glaze (used by the Bowl Planner) |

See `docs/data-guide.md` for step-by-step instructions on adding a new glaze or combination.

---

## Your test data

Your personal test records (status, notes, photos) are saved in your **browser's localStorage** — they stay on your device and work offline. They are not in any file on disk.

To back them up or move them to another device:

1. Go to the **My Tests** tab
2. Click **Export my tests ↓** — this downloads a `glaze-tests.json` file
3. On the other device, click **Import tests** and pick that file

---

## Deploying

Build the app with `npm run build`, then drop the `dist/` folder onto [Netlify](https://netlify.com) or [Vercel](https://vercel.com). Both have free tiers that work perfectly for a personal app like this. No server required — it's all static files.
