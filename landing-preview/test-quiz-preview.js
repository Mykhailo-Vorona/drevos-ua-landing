const fs = require('fs');
const path = require('path');

const root = __dirname;
const filePath = path.join(root, 'quiz-preview.html');

if (!fs.existsSync(filePath)) {
  throw new Error('Missing standalone quiz preview page: quiz-preview.html');
}

const html = fs.readFileSync(filePath, 'utf8');

for (const marker of [
  'data-quiz-preview',
  'data-step="1"',
  'data-step="2"',
  'data-step="3"',
  'data-step="4"',
  'data-progress-bar',
  'data-progress-label',
  'data-next',
  'data-back',
  'data-contact-input',
  'data-contact-label',
  'data-result-screen',
  'data-restart',
]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing quiz preview marker: ${marker}`);
  }
}

for (const copy of [
  'Крок 1 з 4',
  'залишилось 3 питання',
  'Для дому',
  'Ковбаси',
  'Усе: рибу, мʼясо, ковбаси',
  'Ваш телефон або Telegram',
  'Телефон, на якому є Viber',
  'Ваш номер телефону для звінка',
  'Отримати рекомендацію',
  'Телефон',
]) {
  if (!html.includes(copy)) {
    throw new Error(`Missing improved quiz copy: ${copy}`);
  }
}

for (const marker of [
  'method-icon-telegram',
  'method-icon-viber',
  'method-icon-phone',
  'data-contact-method="Телефон"',
  '#229ED9',
  '#7360F2',
]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing final contact method marker: ${marker}`);
  }
}

if (html.includes('data-contact-method="Email"') || html.includes('>Email<')) {
  throw new Error('Final quiz contact methods must use phone instead of email.');
}

if (html.includes('Ваш номер телефону. Менеджер з вами зателефонує')) {
  throw new Error('Phone contact copy must use the shorter call-focused label.');
}

for (const visual of [
  'option-visual-home',
  'option-visual-sales',
  'option-visual-business',
  'option-visual-consult',
]) {
  if (!html.includes(visual)) {
    throw new Error(`Missing first-step quiz visual: ${visual}`);
  }
}

for (const photo of [
  'images/quiz-preview/quiz-purpose-home.jpg',
  'images/quiz-preview/quiz-purpose-sales.jpg',
  'images/quiz-preview/quiz-purpose-business.jpg',
  'images/quiz-preview/quiz-purpose-consult.jpg',
  'images/quiz-preview/quiz-product-fish.jpg',
  'images/quiz-preview/quiz-product-sausage.jpg',
  'images/quiz-preview/quiz-product-meat.jpg',
  'images/quiz-preview/quiz-product-all.jpg',
]) {
  if (!html.includes(`src="${photo}"`)) {
    throw new Error(`Missing first-step quiz photo: ${photo}`);
  }

  if (!fs.existsSync(path.join(root, photo))) {
    throw new Error(`Missing first-step quiz photo file: ${photo}`);
  }
}

if (!html.includes('nextButton.disabled = true')) {
  throw new Error('Next button must be disabled until a valid answer/contact is selected.');
}

if (!html.includes('autoAdvanceTimer = window.setTimeout')) {
  throw new Error('Quiz answers must auto-advance after selection.');
}

if (!html.includes('function showResult')) {
  throw new Error('Quiz preview must use an inline result screen instead of browser alert.');
}

console.log('Quiz preview contract OK');
