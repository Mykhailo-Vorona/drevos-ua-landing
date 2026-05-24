const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

for (const marker of [
  '<footer class="site-footer"',
  'НАШІ <span>КОНТАКТИ</span>',
  'Телефонуйте',
  'Пишіть онлайн',
  'Чекаємо у гості',
  'Ми у соц. мережах',
  'м. Харків',
  'Офіс: вул. Клочківська 28',
  'Вул. Сидоренківська 3',
  'м. Черкаси',
  'Вул. Сергія Амброса, 56',
  'https://telegram.me/drevos_ua',
  'https://www.youtube.com/channel/UC2SQAhQ5sTqUr7XFedI-i5w',
  'https://www.facebook.com/koptilnidrevos',
  'https://www.instagram.com/koptilni_drevos_ua/',
  'https://www.tiktok.com/@drevos_official?_r=1&amp;_t=ZN-96cqRYf3mtC',
  'footer-social-tiktok',
  '© 2015-2026«Drevos» Коптильні від виробника. Увага! Всі матеріали, розміщені на сайті є власністю ТМ Древос. Будь-яке копіювання та використання матеріалів можливе лише з дозволу правовласника.',
]) {
  if (!html.includes(marker)) {
    throw new Error(`Footer is missing required content/link: ${marker}`);
  }
}

for (const oldCopy of [
  'Виробництво: вул. Сидоренківська 3',
  'Виробництво: вул. Сергія Амброса, 56',
]) {
  if (html.includes(oldCopy)) {
    throw new Error(`Footer still contains old address copy: ${oldCopy}`);
  }
}

for (const marker of [
  '.site-footer',
  '.footer-grid',
  '.footer-social-link',
  '.footer-social-tiktok',
  '.footer-bottom',
]) {
  if (!css.includes(marker)) {
    throw new Error(`Footer stylesheet is missing: ${marker}`);
  }
}

console.log('Footer contacts contract OK');
