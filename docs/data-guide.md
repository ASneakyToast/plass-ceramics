# Data Guide

This is the reference for editing the JSON files in `src/data/`. JSON is just structured text — think of it like a very strict spreadsheet. The main rules: use double quotes around all text values, put commas after every item except the last, and keep brackets and braces matched.

---

## Adding a new glaze — `glazes.json`

Each glaze has four fields:

```json
{ "code": "PC-17", "name": "Honey Flux", "hex": "#C07838", "slug": "pc-17-honey-flux" }
```

| Field | What it is | Example |
|-------|-----------|---------|
| `code` | The AMACO product code | `"PC-17"` |
| `name` | The glaze name | `"Honey Flux"` |
| `hex` | The colour as a hex value | `"#C07838"` |
| `slug` | The AMACO URL slug (see below) | `"pc-17-honey-flux"` |

**Finding the slug:** Go to any AMACO layering page, for example:
`https://amaco.com/resources/layering/pc-20-blue-rutile-over-pc-17-honey-flux`

The slug for each glaze is the part that looks like `pc-20-blue-rutile`. The pattern is always `code-name` in lowercase with hyphens. For codes like `C-01`, the slug drops the leading zero: `c-1-obsidian`.

**Also update `props.json`** when you add a new glaze — see below.

---

## Adding a glaze to `props.json`

Every glaze in `glazes.json` needs a matching entry in `props.json`. This is what the Bowl Planner uses to generate its instructions.

```json
"PC-17": { "fluid": 2, "celadon": false, "warn": "flux glaze — amplifies movement in the top coat" }
```

| Field | What it means | Values |
|-------|--------------|--------|
| `fluid` | How much the glaze moves/drips at cone 6 | `1` = stable, `2` = moderate, `3` = very fluid |
| `celadon` | Is it a C-series celadon? | `true` or `false` |
| `warn` | Optional warning shown in the planner | A short string, or `null` for none |

If you're unsure about fluid level, start with `1` (stable) and update after you fire it.

---

## Adding a new combination — `combos.json`

Each combo has four fields:

```json
{ "base": "PC-20", "top": "PC-23", "kind": "official", "description": "Deep royal blue with floating indigo." }
```

| Field | What it is | Values |
|-------|-----------|--------|
| `base` | The bottom glaze code | Any code from `glazes.json` |
| `top` | The glaze applied on top | Any code from `glazes.json` |
| `kind` | Where the combo comes from | `"official"`, `"community"`, or `"mix"` |
| `description` | What it looks like when fired | A sentence or two |

**Kind values:**
- `"official"` — documented by AMACO with a tile photo on their website
- `"community"` — tried and shared by potters online, worth testing before committing
- `"mix"` — two celadons mixed together (not layered), ratio adjustable

---

## Adding a missing glaze — `missing.json`

This is your shopping list. Each entry shows a glaze you don't own yet and which combos it would unlock.

```json
{
  "code": "PC-29",
  "name": "Deep Olive Speckle",
  "hex": "#4A5A30",
  "why": "Pairs with PC-20, PC-31 Oatmeal, and all three of your Celadons.",
  "combos": [
    { "base": "PC-20", "top": "PC-29" },
    { "base": "C-10",  "top": "PC-29" }
  ]
}
```

| Field | What it is |
|-------|-----------|
| `code` | AMACO product code |
| `name` | Glaze name |
| `hex` | Colour hex value |
| `why` | One sentence on why it's interesting |
| `combos` | Array of base+top pairs it would unlock |

The Shopping List tab automatically sorts by number of combos, so glazes that unlock the most combinations appear first.

---

## Finding hex colour values

A hex colour looks like `#C07838` — a `#` followed by six characters (0–9 and A–F).

**Option 1:** Use your browser's colour picker. Open DevTools (right-click any page → Inspect), go to the Elements tab, click a coloured circle, and the picker shows the hex value.

**Option 2:** Search for the glaze on the AMACO website or a pottery forum — someone usually shares a photo. Then use a colour picker browser extension to sample the colour from the photo.

**Option 3:** Make up a close approximation. The hex values are only used for the small colour dots in the app — they don't need to be exact.
