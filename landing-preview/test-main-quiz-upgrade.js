const fs = require('fs');
const path = require('path');

const root = __dirname;
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');

for (const marker of [
  'quiz-section-upgraded',
  'data-quiz-preview',
  'data-step="1"',
  'data-step="4"',
  'data-contact-method="Telegram"',
  'data-contact-method="Viber"',
  'data-contact-method="Телефон"',
  'Ваш номер телефону для звінка',
  'Телефон, на якому є Viber',
]) {
  if (!indexHtml.includes(marker)) {
    throw new Error(`Main landing is missing upgraded quiz marker/copy: ${marker}`);
  }
}

for (const legacy of [
  'class="quiz-container"',
  'class="quiz-question active"',
  'data-answer="email"',
  '>На email<',
  'Ваш номер телефону. Менеджер з вами зателефонує',
]) {
  if (indexHtml.includes(legacy)) {
    throw new Error(`Main landing still contains legacy quiz markup/copy: ${legacy}`);
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
  if (!indexHtml.includes(`src="${photo}"`)) {
    throw new Error(`Main landing quiz must reference photo: ${photo}`);
  }

  if (!fs.existsSync(path.join(root, photo))) {
    throw new Error(`Missing quiz photo file: ${photo}`);
  }
}

for (const marker of [
  '.quiz-section-upgraded .quiz-preview',
  '.quiz-section-upgraded .option.has-visual',
  '.quiz-section-upgraded .method-icon-telegram',
  '.quiz-section-upgraded .method-icon-viber',
]) {
  if (!styles.includes(marker)) {
    throw new Error(`Main stylesheet is missing upgraded quiz style: ${marker}`);
  }
}

for (const marker of [
  'const quizPreview = document.querySelector("[data-quiz-preview]")',
  'function showQuizResult',
  'function chooseQuizMethod',
  'Ваш номер телефону для звінка',
]) {
  if (!script.includes(marker)) {
    throw new Error(`Main script is missing upgraded quiz logic: ${marker}`);
  }
}

if (script.includes('alert("Дякуємо!')) {
  throw new Error('Main quiz must use the inline result screen instead of alert.');
}

console.log('Main landing upgraded quiz contract OK');
