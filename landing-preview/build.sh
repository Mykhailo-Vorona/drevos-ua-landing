#!/bin/bash
# Build script для production-готовых файлов
# Запуск: bash build.sh
# Результат: dist/ с минифицированными файлами

set -e
cd "$(dirname "$0")"

SRC_DIR="."
DIST_DIR="./dist"

echo "🚀 Drevos Landing — Build Script"
echo "================================="
echo ""

# Очистка предыдущей сборки
rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

# Копирование статических файлов
echo "📦 Копирование статики..."
cp -R images "$DIST_DIR/"
echo "  ✓ images/ скопирована"

# === МИНИФИКАЦИЯ CSS ===
echo ""
echo "🎨 Минификация CSS..."
python3 << 'PYEOF'
import re

with open('styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

orig = len(css)

# Удаляем многострочные комментарии /* ... */
css = re.sub(r'/\*[\s\S]*?\*/', '', css)
# Удаляем пробелы вокруг символов { } : ; , > + ~
css = re.sub(r'\s*([{}:;,>+~])\s*', r'\1', css)
# Множественные пробелы → один
css = re.sub(r'\s+', ' ', css)
# Удаляем ; перед }
css = re.sub(r';}', '}', css)
# Trim
css = css.strip()

with open('dist/styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

new = len(css)
print(f"  ✓ styles.css: {orig//1024}KB → {new//1024}KB (-{100-new*100//orig}%)")
PYEOF

# === МИНИФИКАЦИЯ JS ===
echo ""
echo "📜 Минификация JS..."
python3 << 'PYEOF'
import re

with open('script.js', 'r', encoding='utf-8') as f:
    js = f.read()

orig = len(js)

# Удаляем многострочные комментарии /* ... */
js = re.sub(r'/\*[\s\S]*?\*/', '', js)
# Удаляем строки, начинающиеся с //  (только если // не внутри строки)
# Простая версия — удалить строковые // комментарии
lines = []
for line in js.split('\n'):
    # Найдём // не в строке
    in_string = False
    string_char = None
    i = 0
    comment_pos = -1
    while i < len(line):
        c = line[i]
        if not in_string and c in '"\'`':
            in_string = True
            string_char = c
        elif in_string and c == string_char and (i == 0 or line[i-1] != '\\'):
            in_string = False
        elif not in_string and i+1 < len(line) and c == '/' and line[i+1] == '/':
            comment_pos = i
            break
        i += 1
    if comment_pos >= 0:
        line = line[:comment_pos].rstrip()
    lines.append(line)
js = '\n'.join(lines)

# Удаляем пустые строки
js = re.sub(r'\n\s*\n+', '\n', js)
# Удаляем лидирующие пробелы
js = re.sub(r'^[ \t]+', '', js, flags=re.MULTILINE)
js = js.strip()

with open('dist/script.js', 'w', encoding='utf-8') as f:
    f.write(js)

new = len(js)
print(f"  ✓ script.js: {orig//1024}KB → {new//1024}KB (-{100-new*100//orig}%)")
PYEOF

# === МИНИФИКАЦИЯ HTML ===
echo ""
echo "📄 Минификация HTML..."
python3 << 'PYEOF'
import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

orig = len(html)

# Удаляем HTML комментарии (кроме условных IE)
html = re.sub(r'<!--(?!\[if).*?-->', '', html, flags=re.DOTALL)
# Удаляем пробелы между тегами (осторожно, не трогаем <pre>, <textarea>, <script>, <style>)
# Простая версия: удаляем переносы и табы между тегами
html = re.sub(r'>\s+<', '><', html)
# Множественные пробелы внутри тегов
html = re.sub(r' {2,}', ' ', html)
html = re.sub(r'\n\s*', '\n', html)
html = re.sub(r'\n{2,}', '\n', html)
html = html.strip()

with open('dist/index.html', 'w', encoding='utf-8') as f:
    f.write(html)

new = len(html)
print(f"  ✓ index.html: {orig//1024}KB → {new//1024}KB (-{100-new*100//orig}%)")
PYEOF

echo ""
echo "📊 Итого:"
echo "  Source: $(du -sh . --exclude=dist 2>/dev/null | head -1 | cut -f1)"
echo "  Dist:   $(du -sh dist 2>/dev/null | cut -f1)"

echo ""
echo "✅ Build готов! Файлы в ./dist/"
echo "   Заливайте папку dist/ на хостинг."
