import { G, PROPS } from './data.js';

export function initPlanner() {
  const gbtn = document.getElementById('gbtn');
  if (gbtn && !gbtn.dataset.wired) {
    gbtn.dataset.wired = '1';
    gbtn.addEventListener('click', genPlan);
  }
}

function genPlan() {
  const b = document.getElementById('pbase').value;
  const t = document.getElementById('ptop').value;
  const bg = G[b], tg = G[t];
  const bp = PROPS[b], tp = PROPS[t];
  const pout = document.getElementById('pout');

  const isMix = bp.celadon && tp.celadon;
  const isCeladonBase = bp.celadon && !tp.celadon;
  const maxFluid = Math.max(bp.fluid, tp.fluid);
  const fluidGlaze = bp.fluid >= tp.fluid ? b : t;
  const foot = maxFluid >= 3 ? '¾–1 inch (2–2.5 cm)' : maxFluid === 2 ? '½–¾ inch (1.5–2 cm)' : '½ inch (1.5 cm)';
  const coats = isCeladonBase ? 3 : 2;

  const steps = [];

  if (isMix) {
    steps.push(`Interior and exterior: Both are celadons — food-safe and glossy. Apply the same mix inside and out. Fix your ratio before starting and keep it consistent across all 4 bowls.`);
    steps.push(`Application: Mix to your desired ratio first. Apply 3 even brush coats all over, letting each coat dry to the touch (5–10 min) before the next. Smooth overlapping strokes give the most even result.`);
  } else {
    if (maxFluid >= 3) {
      steps.push(`Interior vs exterior: Apply a plain C-10 Snow White inside only (3 coats) — ${G[fluidGlaze].name} is too fluid and unpredictable in a curved bowl interior. Reserve the ${b} + ${t} combo for the exterior only.`);
    } else if (isCeladonBase) {
      steps.push(`Interior vs exterior: Apply 3 coats of ${b} ${bg.name} alone on the interior — food-safe, glossy, and gives a clean consistent look across all 4 bowls. Apply the full ${b} + ${t} layered combo to the exterior only.`);
    } else {
      steps.push(`Interior vs exterior: Apply 2 coats of ${b} ${bg.name} alone on the interior. The full layered combo reads best on the exterior where it can be appreciated from the outside.`);
    }

    if (isCeladonBase) {
      steps.push(`Base coat (${b} ${bg.name}): Apply ${coats} even coats to the exterior by brush. Let each coat dry to the touch (5–10 min) before the next. Work in smooth overlapping strokes from rim down toward the wax line.`);
      steps.push(`Top coat (${t} ${tg.name}): Apply ${coats} coats over the fully dried celadon exterior. Brush in the same direction as the base. Let dry completely before loading.`);
    } else {
      steps.push(`Base coat (${b} ${bg.name}): Apply ${coats} even coats to the exterior by brush, fully drying between coats. PC glazes need consistent thickness — too thin looks pale, too thick runs.`);
      steps.push(`Top coat (${t} ${tg.name}): Apply ${coats} coats over the fully dried base. Don't over-brush — a smooth, light-handed pass prevents streaking where coats overlap.`);
    }
  }

  steps.push(`Wax resist: Wax the foot ring and the bottom ${foot} of the exterior wall before glazing. Apply at room temperature and let dry fully (20–30 min) — glaze over wet wax will bead and flake during firing.`);
  steps.push(`Foot ring clearance: Leave ${foot} completely unglazed above the foot ring. ${maxFluid >= 3 ? `${G[fluidGlaze].name} is a high-movement glaze — be generous here and check every piece under bright light before loading.` : maxFluid === 2 ? 'Check the foot area under bright light before loading.' : 'These glazes are stable — standard clearance is sufficient.'}`);

  const warns = [bp.warn, tp.warn].filter(Boolean);
  if (maxFluid >= 3) {
    steps.push(`Drip warning: ${G[fluidGlaze].name} runs significantly at cone 6. Fire upright on a clean kiln-washed shelf. Never load a piece where glaze is visible near the foot.`);
  } else if (warns.length) {
    steps.push(`Glaze note: ${warns.join('; ')}. Apply conservatively and fire your first bowl alone before committing the full set.`);
  } else {
    steps.push(`These glazes are stable at cone 5-6 with no major drip risk. Test one bowl first, note how the colours interact, and adjust thickness if needed.`);
  }

  steps.push(`Consistency across 4 bowls: Glaze all four in the same session from the same batch. Count brush strokes per coat to keep thickness consistent. Load all four at the same shelf height — pieces near elements fire slightly hotter, which affects fluid glazes most. Photograph your first fired result so you can replicate the application next time.`);

  let html = '<ol>';
  steps.forEach(s => { html += `<li>${s}</li>`; });
  html += '</ol>';
  pout.innerHTML = html;
}
