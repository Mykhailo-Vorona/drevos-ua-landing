const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const expectedCards = [
  {
    title: 'ВЛАСНЕ ВИРОБНИЦТВО',
    src: 'images/advantages/production.jpg',
  },
  {
    title: 'СПІЛЬНОТА КОПЧУНІВ',
    src: 'images/advantages/community.jpg',
  },
  {
    title: 'ПІДТРИМКА ПІСЛЯ ПОКУПКИ',
    src: 'images/advantages/support.jpg',
  },
  {
    title: 'СЕРВІС ТА ГАРАНТІЯ',
    src: 'images/advantages/warranty.jpg',
  },
];

for (const card of expectedCards) {
  const cardPattern = new RegExp(
    `<article[^>]*class="[^"]*advantage-card[^"]*"[^>]*>[\\s\\S]*?<img[^>]+src="${card.src}"[^>]*>[\\s\\S]*?<h3>${card.title}</h3>`,
  );

  if (!cardPattern.test(html)) {
    throw new Error(`Missing advantage image ${card.src} for ${card.title}`);
  }

  const imageTag = html.match(new RegExp(`<img[^>]+src="${card.src}"[^>]*>`))?.[0] || '';
  if (imageTag.includes('loading="lazy"')) {
    throw new Error(`Advantage image should load eagerly for visible scroll section: ${card.src}`);
  }

  const imagePath = path.join(root, card.src);
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Missing image file: ${imagePath}`);
  }
}

const mediaCount = (html.match(/class="advantage-media"/g) || []).length;
if (mediaCount !== expectedCards.length) {
  throw new Error(`Expected ${expectedCards.length} advantage media blocks, found ${mediaCount}`);
}

console.log('Advantage images are wired to all four cards.');
