import { DATA } from './data.js';

let active = 'all';

export function initCombos() {
  document.querySelectorAll('#fb .chip').forEach(btn => {
    btn.addEventListener('click', () => {
      active = btn.dataset.f;
      refreshChips();
      filterCards();
    });
  });
  filterCards();
}

function refreshChips() {
  document.querySelectorAll('#fb .chip').forEach(c => {
    c.classList.toggle('on', c.dataset.f === active);
  });
}

function filterCards() {
  // Count visible combos and update counter
  let visible = 0;

  // Update section groups: hide entire section if it has no visible cards
  document.querySelectorAll('#secs .section-group').forEach(group => {
    let groupVisible = 0;
    group.querySelectorAll('.card').forEach(card => {
      const show = active === 'all' || card.dataset.base === active || card.dataset.top === active;
      card.style.display = show ? '' : 'none';
      if (show) { visible++; groupVisible++; }
    });
    group.style.display = groupVisible ? '' : 'none';
  });

  const ct = document.getElementById('ct');
  if (ct) ct.textContent = visible + ' combination' + (visible !== 1 ? 's' : '');
}
