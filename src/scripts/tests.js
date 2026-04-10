import { G, DATA, dot, amacoURL } from './data.js';
import { saveTest, loadAllTests, exportTests, importTests } from './storage.js';

const testState = {};

export function initTests() {
  loadAllTests(testState);
  const grid = document.getElementById('tgrid');
  grid.innerHTML = '';
  DATA.forEach(item => grid.appendChild(comboCard(item)));

  // Wire export/import buttons (only once)
  const exportBtn = document.getElementById('export-btn');
  const importInput = document.getElementById('import-input');
  const importMsg = document.getElementById('import-msg');

  if (exportBtn && !exportBtn.dataset.wired) {
    exportBtn.dataset.wired = '1';
    exportBtn.addEventListener('click', exportTests);
  }

  if (importInput && !importInput.dataset.wired) {
    importInput.dataset.wired = '1';
    importInput.addEventListener('change', () => {
      if (!importInput.files[0]) return;
      importTests(importInput.files[0], testState, (err, count) => {
        if (err) {
          importMsg.textContent = err;
        } else {
          importMsg.textContent = `Imported ${count} test records. Reloading...`;
          setTimeout(() => {
            // Rebuild grid with imported data
            grid.innerHTML = '';
            DATA.forEach(item => grid.appendChild(comboCard(item)));
            importMsg.textContent = '';
          }, 800);
        }
        importInput.value = '';
      });
    });
  }
}

function comboCard(item) {
  const c = document.createElement('div');
  c.className = 'card';

  const kindLabels = { official: 'AMACO documented', community: 'community — test first', mix: 'celadon mixing' };

  const hrow = document.createElement('div');
  hrow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:8px';

  const badge = document.createElement('div');
  badge.className = `badge ${item.kind}`;
  badge.style.margin = '0';
  badge.textContent = kindLabels[item.kind];
  hrow.appendChild(badge);

  const links = document.createElement('div');
  links.style.cssText = 'display:flex;gap:8px;align-items:center';

  if (item.kind === 'official') {
    const url = amacoURL(item.base, item.top);
    if (url) {
      const lnk = document.createElement('a');
      lnk.href = url; lnk.target = '_blank'; lnk.rel = 'noopener';
      lnk.style.cssText = 'font-size:11px;color:var(--blue-txt);text-decoration:none;white-space:nowrap';
      lnk.textContent = 'AMACO tile →';
      links.appendChild(lnk);
    }
  }

  const bg = G[item.base], tg = G[item.top];
  const q = encodeURIComponent(`AMACO ${item.base} ${bg?.name ?? item.base} ${item.top} ${tg?.name ?? item.top} pottery glaze`);
  const pin = document.createElement('a');
  pin.href = `https://www.pinterest.com/search/pins/?q=${q}`;
  pin.target = '_blank'; pin.rel = 'noopener';
  pin.style.cssText = 'font-size:11px;color:#e60023;text-decoration:none;white-space:nowrap';
  pin.textContent = 'Pinterest ↗';
  links.appendChild(pin);
  hrow.appendChild(links);
  c.appendChild(hrow);

  const pair = document.createElement('div');
  pair.className = 'pair';
  pair.appendChild(pill(item.base));
  const sp = document.createElement('div');
  sp.className = 'gsep';
  sp.textContent = item.kind === 'mix' ? '+' : '→';
  pair.appendChild(sp);
  pair.appendChild(pill(item.top));
  c.appendChild(pair);

  if (item.kind !== 'mix') {
    const n = document.createElement('div');
    n.className = 'note-s';
    n.textContent = 'base coat → top coat';
    c.appendChild(n);
  }

  const r = document.createElement('div');
  r.className = 'res';
  r.textContent = item.description;
  c.appendChild(r);

  c.appendChild(makeTestCtrl(item));
  return c;
}

function pill(code) {
  const g = G[code] || { hex: '#999', name: code };
  const el = document.createElement('div');
  el.className = 'gp';
  el.innerHTML = dot(g.hex) + `<div><div class="gcode">${code}</div><div class="gnm">${g.name}</div></div>`;
  return el;
}

function makeTestCtrl(item) {
  const key = `test_${item.base}_${item.top}`;
  const state = testState[key] || { status: 'untested', note: '', photo: null };

  const wrap = document.createElement('div');
  wrap.className = 'tbar';

  const srow = document.createElement('div');
  srow.className = 'srow';

  [['untested', 'Not tried'], ['tried', 'Tried'], ['love', 'Love it'], ['skip', 'Skip']].forEach(([s, l]) => {
    const b = document.createElement('button');
    b.className = 'sbtn' + (state.status === s && s !== 'untested' ? ' ' + s : '');
    b.textContent = l;
    b.addEventListener('click', () => {
      const cur = testState[key] || { status: 'untested', note: '', photo: null };
      testState[key] = { ...cur, status: s };
      saveTest(key, testState[key]);
      wrap.replaceWith(makeTestCtrl(item));
    });
    srow.appendChild(b);
  });
  wrap.appendChild(srow);

  const ta = document.createElement('textarea');
  ta.className = 'nt'; ta.rows = 2;
  ta.placeholder = 'Notes (thickness, results, tweaks...)';
  ta.value = state.note || '';
  ta.addEventListener('blur', () => {
    const cur = testState[key] || { status: 'untested', note: '', photo: null };
    testState[key] = { ...cur, note: ta.value };
    saveTest(key, testState[key]);
  });
  wrap.appendChild(ta);

  const photoWrap = document.createElement('div');
  photoWrap.style.cssText = 'margin-top:9px';

  if (state.photo) {
    const img = document.createElement('img');
    img.src = state.photo;
    img.style.cssText = 'width:100%;border-radius:6px;display:block;margin-bottom:6px;border:0.5px solid var(--border)';
    photoWrap.appendChild(img);

    const removeBtn = document.createElement('button');
    removeBtn.className = 'sbtn'; removeBtn.textContent = 'Remove photo';
    removeBtn.addEventListener('click', () => {
      const cur = testState[key] || {};
      testState[key] = { ...cur, photo: null };
      saveTest(key, testState[key]);
      wrap.replaceWith(makeTestCtrl(item));
    });
    photoWrap.appendChild(removeBtn);
  } else {
    const lbl = document.createElement('label');
    lbl.style.cssText = 'display:inline-flex;align-items:center;gap:5px;font-size:11px;color:var(--text-2);cursor:pointer;padding:3px 9px;border-radius:12px;background:var(--bg);border:0.5px solid var(--border-med)';
    lbl.textContent = '+ Add photo';
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*'; inp.style.display = 'none';
    inp.addEventListener('change', () => {
      if (!inp.files[0]) return;
      resizeImage(inp.files[0], 600, dataUrl => {
        const cur = testState[key] || {};
        testState[key] = { ...cur, photo: dataUrl };
        try {
          saveTest(key, testState[key]);
        } catch (e) {
          alert('Photo too large to save — try a smaller image.');
        }
        wrap.replaceWith(makeTestCtrl(item));
      });
    });
    lbl.appendChild(inp);
    photoWrap.appendChild(lbl);
  }

  wrap.appendChild(photoWrap);
  return wrap;
}

function resizeImage(file, maxPx, cb) {
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      let w = img.width, h = img.height;
      if (w > maxPx || h > maxPx) { const sc = maxPx / Math.max(w, h); w = Math.round(w * sc); h = Math.round(h * sc); }
      const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      cv.getContext('2d').drawImage(img, 0, 0, w, h);
      cb(cv.toDataURL('image/jpeg', 0.82));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}
