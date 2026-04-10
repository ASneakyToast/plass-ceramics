const LS_PREFIX = 'glaze_studio_';

export function saveTest(key, val) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(val)); } catch (e) {}
}

export function loadTest(key) {
  try {
    const v = localStorage.getItem(LS_PREFIX + key);
    return v ? JSON.parse(v) : null;
  } catch (e) { return null; }
}

export function loadAllTests(testState) {
  Object.keys(localStorage)
    .filter(k => k.startsWith(LS_PREFIX))
    .forEach(k => {
      try {
        const v = JSON.parse(localStorage.getItem(k));
        const key = k.slice(LS_PREFIX.length);
        testState[key] = v;
      } catch (e) {}
    });
}

export function exportTests() {
  const data = {};
  Object.keys(localStorage)
    .filter(k => k.startsWith(LS_PREFIX))
    .forEach(k => {
      try { data[k.slice(LS_PREFIX.length)] = JSON.parse(localStorage.getItem(k)); } catch (e) {}
    });
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'glaze-tests.json';
  a.click();
  URL.revokeObjectURL(url);
}

export function importTests(file, testState, onDone) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      let count = 0;
      Object.entries(data).forEach(([key, val]) => {
        testState[key] = val;
        saveTest(key, val);
        count++;
      });
      onDone(null, count);
    } catch (err) {
      onDone('Invalid JSON file — import failed.');
    }
  };
  reader.readAsText(file);
}
