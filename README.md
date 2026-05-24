# Drevos UA Landing

Лендинг для коптилень Drevos — для дому та бізнесу.

## 🚀 Структура

```
drevos-ua-landing/
├── landing-preview/        # Исходники сайта
│   ├── index.html          # Главная страница
│   ├── styles.css          # Стили
│   ├── script.js           # JS логика (модалы, квиз, слайдер)
│   ├── images/             # Изображения (showcase, advantages, certificates, etc.)
│   ├── build.sh            # Build скрипт для production
│   └── dist/               # Production билд (не в git)
├── docs/                   # Документация
├── memory.md               # Память проекта
└── plan.md                 # План работ
```

## 🛠 Разработка

```bash
# Локальный запуск (Python http server)
cd landing-preview
python3 -m http.server 8000

# Открыть в браузере
open http://localhost:8000
```

## 📦 Production билд

```bash
cd landing-preview
bash build.sh
# Готовый сайт в landing-preview/dist/
```

Минификация:
- CSS: ~21% экономия
- JS: ~12% экономия
- HTML: ~19% экономия

## ✨ Возможности сайта

- Адаптивный дизайн (mobile-first)
- Интерактивный квиз подбора коптильни
- 4 модальные формы заявок (Розтермінування, Технолог, Консультація, Каталог)
- Закреплённая мобильная панель (Дзвінок / Telegram / Каталог)
- Слайдер сертификатів
- TikTok-превью с реальными отзывами
- SEO + Open Graph готов

## 📱 Контакти

- Телефон: +38 (097) 053-62-90
- Telegram: [@Drevos_smoker](https://t.me/Drevos_smoker)
- Email: info.drevos@gmail.com
- Адреси: Харків (Сидоренківська 3), Черкаси (Сергія Амброса 56)
