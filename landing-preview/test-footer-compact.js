const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf8');

for (const marker of [
  'padding: 38px 0 16px;',
  'gap: 28px;',
  'margin-bottom: 34px;',
  'font-size: clamp(28px, 3.2vw, 40px);',
  'grid-template-columns: 1fr 1fr 1.1fr 0.9fr;',
  'gap: 30px;',
  'font-size: clamp(17px, 1.35vw, 22px);',
  'font-size: 15px;',
  'width: 42px;',
  'height: 42px;',
  'width: 22px;',
  'height: 22px;',
  'margin-top: 34px;',
  'font-size: 12px;',
]) {
  if (!css.includes(marker)) {
    throw new Error(`Footer compact CSS marker missing: ${marker}`);
  }
}

console.log('Footer compact scale contract OK');
