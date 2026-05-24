const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

for (const marker of [
  '/* Typography and rhythm normalization */',
  '--section-title-size: clamp(32px, 3.2vw, 44px);',
  '--section-lead-size: 17px;',
  '--card-title-size: 20px;',
  '--card-text-size: 15px;',
  '--section-padding-y: 64px;',
  'text-align: center;',
  '.result-section h2,',
  '.model-choice-section h2,',
  '.advantages-section h2,',
  '.results-section h2,',
  '.certificates-heading h2',
  'font-size: var(--section-title-size);',
  '.section-lead {',
  'margin: 14px auto 0;',
  '.result-grid,',
  '.choice-grid,',
  '.advantages-grid,',
  '.results-grid,',
  '.certificates-slider {',
  'margin-top: 34px;',
  '.choice-card-body h3,',
  '.advantage-card h3 {',
  'font-size: var(--card-title-size);',
  '.choice-card-body p,',
  '.advantage-card p {',
  'font-size: var(--card-text-size);',
]) {
  if (!css.includes(marker)) {
    throw new Error(`Missing typography/rhythm marker: ${marker}`);
  }
}

console.log('Typography system contract OK');
