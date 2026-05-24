const fs = require('fs');
const path = require('path');

const root = __dirname;
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(
  /iframe\.allow\s*=\s*["'][^"']*fullscreen/.test(script),
  'TikTok iframe allow attribute must include fullscreen permission.'
);

assert(
  /requestFullscreen\s*\(/.test(script),
  'Opening a TikTok video must request browser fullscreen for the modal.'
);

assert(
  /\[data-tiktok-embed-container\][^{]*\{[^}]*width:\s*100%[^}]*height:\s*100%/s.test(styles),
  'The dynamic TikTok embed container must fill the fullscreen modal.'
);

console.log('TikTok fullscreen contract OK');
