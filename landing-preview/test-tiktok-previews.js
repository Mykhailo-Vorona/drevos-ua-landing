const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const expected = [
  'agro-yagotin7.webp',
  'shurshim777.webp',
  'salo-vid-aliny.webp',
  'kopcheni-smakoluku.webp',
  'vorobiovy2020.webp',
  'kravchenko-family.webp',
  'volodymyrbrus.webp',
  'aleksandrbelyy.webp',
  'koptyl-house-zakarpattya.webp',
  'tetyana-derevyanko.webp'
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const previewImgCount = (html.match(/class=\"video-preview\"/g) || []).length;
assert(previewImgCount === expected.length, 'Expected ' + expected.length + ' video preview images, found ' + previewImgCount + '.');

for (const file of expected) {
  assert(html.includes('./images/tiktok-previews/' + file), 'Missing preview markup for ' + file + '.');
  assert(fs.existsSync(path.join(root, 'images/tiktok-previews', file)), 'Missing preview file ' + file + '.');
}

console.log('TikTok preview contract OK');
