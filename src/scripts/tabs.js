import { initCombos } from './combos.js';
import { initTests }  from './tests.js';
import { initPlanner } from './planner.js';
import { initShop }   from './shop.js';

const inited = new Set();

const tabInits = {
  combos:  initCombos,
  tests:   initTests,
  planner: initPlanner,
  shop:    initShop,
};

document.getElementById('tabs').querySelectorAll('.tbtn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tbtn').forEach(x => x.classList.remove('on'));
    document.querySelectorAll('.tp').forEach(x => x.classList.remove('on'));
    btn.classList.add('on');
    const tabId = btn.dataset.t;
    document.getElementById('tp-' + tabId).classList.add('on');
    if (!inited.has(tabId)) {
      inited.add(tabId);
      tabInits[tabId]?.();
    }
  });
});

// Init the default tab (Combos) on page load
if (!inited.has('combos')) {
  inited.add('combos');
  initCombos();
}
