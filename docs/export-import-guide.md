# Export & Import Guide

This explains how your test data is stored, exported, and imported — including what happens to photos.

---

## How test data is stored

Your test records live in your **browser's localStorage**, not in any file on disk. Each record is stored under a key like `glaze_studio_test_PC-20_PC-23` and contains three fields:

| Field | What it holds |
|-------|--------------|
| `status` | One of `untested`, `tried`, `love`, or `skip` |
| `note` | Your free-text notes |
| `photo` | A base64-encoded JPEG string, or `null` |

Photos are embedded directly in the record as a base64 data URL (e.g. `data:image/jpeg;base64,...`) — there are no separate image files.

---

## How photos are processed on upload

When you attach a photo to a test, the app resizes it before saving:

1. The image is loaded into a canvas element
2. If either dimension exceeds **600px**, it is scaled down proportionally
3. It is re-encoded as **JPEG at 0.82 quality**
4. The resulting base64 string is saved into localStorage alongside the status and notes

This keeps photos small enough to fit within the browser's localStorage limit (~5MB total). If a photo is still too large after resizing, the app will show an alert and skip saving it.

---

## Exporting

Clicking **Export my tests ↓** on the My Tests tab:

1. Reads every `glaze_studio_*` key from localStorage
2. Bundles them all into a single JSON object
3. Downloads the result as `glaze-tests.json`

Because photos are already stored as base64 strings inside each test record, they are automatically included in the export — no extra steps needed.

### Example export structure

```json
{
  "test_PC-20_PC-23": {
    "status": "love",
    "note": "Applied thick — really rich result.",
    "photo": "data:image/jpeg;base64,/9j/..."
  },
  "test_PC-17_PC-20": {
    "status": "tried",
    "note": "Too runny at cone 6.",
    "photo": null
  }
}
```

---

## Importing

Clicking **Import tests** and picking a `glaze-tests.json` file:

1. Reads the file as text and parses the JSON
2. Writes each record back into localStorage (overwriting any existing record for the same key)
3. Rebuilds the test grid to reflect the imported data

The import does not delete records that aren't in the file — it only adds or overwrites. If you want a clean slate, clear localStorage first (DevTools → Application → Local Storage → clear all `glaze_studio_*` keys).

---

## Moving data to another device

1. Export on the source device — this downloads `glaze-tests.json` including all photos
2. Transfer the file to the other device (AirDrop, email, etc.)
3. Open the app on the new device and import the file
