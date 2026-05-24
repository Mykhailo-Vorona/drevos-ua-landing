const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const requiredIds = ['7334996345666718981', '7632599063103294727'];
for (const id of requiredIds) {
  assert(html.includes('data-video-id="' + id + '"'), 'Missing problem video id ' + id + ' in markup.');
}

assert(script.includes('www.tiktok.com/player/v1/'), 'TikTok modal must use official player/v1 instead of embed/v2.');
assert(!script.includes('www.tiktok.com/embed/v2/'), 'TikTok modal must not use old embed/v2 player.');
assert(/autoplay:\s*["']1["']/.test(script), 'TikTok player URL must request autoplay after the visitor click.');
assert(/muted:\s*["']0["']/.test(script), 'TikTok player URL must request sound enabled by default.');
assert(/volume_control:\s*["']1["']/.test(script), 'TikTok player URL must keep the volume control visible.');
assert(/sendTikTokPlayerCommand\(["']play["']\)/.test(script), 'TikTok modal must message the player to play.');
assert(/sendTikTokPlayerCommand\(["']unMute["']\)/.test(script), 'TikTok modal must message the player to unMute.');
assert(/addEventListener\(["']message["']/.test(script), 'TikTok modal must listen for player readiness messages.');

console.log('TikTok player contract OK');
