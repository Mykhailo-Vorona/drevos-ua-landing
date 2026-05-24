const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'script.js'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

const certificates = [
  'images/certificates/certificate-01-quality-management.jpg',
  'images/certificates/certificate-02-energy-management.jpg',
  'images/certificates/certificate-03-quality-services.jpg',
  'images/certificates/certificate-04-technical-conditions.jpg',
  'images/certificates/certificate-05-eu-conformity.jpg',
  'images/certificates/certificate-06-icr-conformity.jpg',
  'images/certificates/certificate-07-food-contact.jpg',
];

const resultsIndex = html.indexOf('<section class="results-section">');
const certificatesIndex = html.indexOf('<section class="certificates-section"');
if (certificatesIndex === -1 || certificatesIndex < resultsIndex) {
  throw new Error('Certificates section must be placed after the video results section.');
}

if (!html.includes('data-certificates-slider data-start-index="4"')) {
  throw new Error('Certificates slider must start from the last three uploaded certificates.');
}

for (const src of certificates) {
  if (!html.includes(`src="${src}"`)) {
    throw new Error(`Missing certificate slide: ${src}`);
  }

  if (!fs.existsSync(path.join(root, src))) {
    throw new Error(`Missing certificate image file: ${src}`);
  }
}

const slideCount = (html.match(/class="certificate-slide"/g) || []).length;
if (slideCount !== certificates.length) {
  throw new Error(`Expected ${certificates.length} certificate slides, found ${slideCount}.`);
}

for (const marker of [
  'data-certificates-prev',
  'data-certificates-next',
  'data-certificate-modal',
  'data-certificate-modal-image',
  'data-certificate-close',
]) {
  if (!html.includes(marker)) {
    throw new Error(`Missing certificate UI marker: ${marker}`);
  }
}

for (const marker of [
  'const certificateSlider',
  'function updateCertificatesSlider',
  'function openCertificateModal',
]) {
  if (!script.includes(marker)) {
    throw new Error(`Missing certificate slider script marker: ${marker}`);
  }
}

if (!styles.includes('.certificate-slide')) {
  throw new Error('Missing certificate slider styles.');
}

console.log('Certificates slider contract OK');
