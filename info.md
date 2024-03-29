**1. Установка пакетов:**
> npm i

**2. Запуск сборщика:**
> gulp

**3. Сборка проекта на деплой:**
> gulp build
---

**Конвертирует шрифты в .woff & .woff2:** 
> gulp fonts

**Проверяет разметку на правильность нейминга BEM:** 
> npm run bem

---
**ВАЖНО!**  
1. Папка **app** нужна для разработки проекта, больше никуда ничего не добавляем, работаем только в ней!  
2. Папка **docs** содержит скомпилированную, готовую версию проекта, которая отображается в браузере.
3. Не оставлять в HTML <img> без ссылки на картинку, иначе будет ошибка в Gulp.

---
**Возможности сборки:**
>> <u>HTML</u>
* шаблонизация [gulp-file-include]
* преобразование <img> в <picture><source><img></picture> для WebP & Avif [gulp-avif-webp-html]
* валидация BEM [gulp-html-bem-validator]
* кэширование файлов [gulp-cache-bust]
* минификация [gulp-htmlmin]

>> <u>CSS</u>
* создание карт кода [gulp-sourcemaps]
* обработка препроцессора LESS [gulp-less]
* склейка множества .less-файлов в один .css-файл [gulp-less]
* добавление префиксов свойств для старых браузеров [less-plugin-autoprefix]
* минификация [gulp-clean-css]
* добавление постфикса ".min" после имени файла [gulp-rename]

>> <u>JavaScript</u>
* создание карт кода [gulp-sourcemaps]
* модульный JavaScript и добавление постфикса ".min" после имени файла с WebPack [webpack-stream]
* минификация JavaScript [gulp-uglify-es]

>> <u>Images</u>
* оптимизация изображений [ JPG, PNG ] и конвертация\добавление [ WEBP, AVIF ] [gulp-squoosh]
* чистка и минификация SVG [gulp-svgmin]
* создание карты спрайтов SVG [gulp-svgstore]

>> <u>Fonts</u>
* конвертация любых форматов шрифтов в .ttf … [gulp-fonter]
* … с последующей конвертацией их в оптимизированные .woff & .woff2 [gulp-ttf2woff2]
* [Исходники должны быть в папке fonts/src]
* ["gulp fonts" в консоль для разовой конвертации шрифтов]