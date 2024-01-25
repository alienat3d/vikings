const {src, dest, series, watch} = require('gulp');
const del = require('del');
const less = require("gulp-less");
const squoosh = require('gulp-squoosh');
const uglify = require('gulp-uglify-es').default;
const cleanCSS = require('gulp-clean-css');
const include = require('gulp-file-include');
const webpAvifHTML = require('gulp-avif-webp-html');
const svgstore = require('gulp-svgstore');
const svgmin = require('gulp-svgmin');
const rename = require('gulp-rename');
const cachebust = require('gulp-cache-bust');
const sync = require('browser-sync').create();
const webpackStream = require('webpack-stream');
const gulpHtmlBemValidator = require('gulp-html-bem-validator');
const sourcemaps = require('gulp-sourcemaps');
const LessAutoprefix = require("less-plugin-autoprefix");
const autoprefix = new LessAutoprefix({ browsers: ["last 8 versions"] });
const fonter = require("gulp-fonter");
const ttf2woff2 = require("gulp-ttf2woff2");

const sourceFolder = 'app'; //папка куда собираем все исходники проекта (html, less, js, img и т.п.)
const buildFolder = 'docs'; //папка куда собирается проект (указываем docs, если нужен gitHubPage, дополнительно нужно указать в настройках gitHub)

function html() {
  return src(sourceFolder + "/html/**/*.html")
    .pipe(include())
    .pipe(webpAvifHTML())
    .pipe(gulpHtmlBemValidator())
    .pipe(cachebust({ type: "timestamp" }))
    .pipe(dest(buildFolder))
};

function bem() {
  return src(sourceFolder + '/html/**/*.html')
    .pipe(gulpHtmlBemValidator())
    .pipe(dest(buildFolder))
};

function svg() {
  return src(sourceFolder + '/img/**/*.svg')
    .pipe(svgmin())
    .pipe(dest(buildFolder + '/img'))
};

function sprite() {
  return src(sourceFolder + '/img/icons/**/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename("sprite.svg"))
    .pipe(dest(buildFolder + '/img/icons'))
};

function styles() {
  return src(sourceFolder + "/less/main.less")
    .pipe(sourcemaps.init())
    .pipe(less({ plugins: [ autoprefix ] }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename("main.min.css"))
    .pipe(sourcemaps.write())
    .pipe(dest(buildFolder + "/css"));
};

function js() {
  return src(sourceFolder + "/js/main.js")
    .pipe(sourcemaps.init())
    .pipe(
      webpackStream({
        mode: "none",
        output: {
          filename: "main.min.js",
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: "babel-loader",
                options: {
                  presets: [["@babel/preset-env", { targets: "defaults" }]],
                },
              },
            },
          ],
        },
      })
    )

    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(buildFolder + "/js"));
};

function img() {
  return src(sourceFolder + '/img/**/*.{png,jpg}')
    .pipe(dest(buildFolder + "/img"))
    .pipe(
      squoosh(() => ({
        encodeOptions: {
          webp: {},
          avif: {}
        },
      }))
    )
    .pipe(dest(buildFolder + "/img"));
};

function convertFonts() {
  return src(sourceFolder + "/fonts/src/*.*")
    .pipe(fonter({ formats: [ "woff", "ttf" ] }))
    .pipe(src(sourceFolder + "/fonts/*.ttf"))
    .pipe(ttf2woff2())
    .pipe(dest(sourceFolder + "/fonts"));
}

function fonts() {
  return src(sourceFolder + "/fonts/*.*").pipe(dest(buildFolder + "/fonts"));
};

function clear() {
  return del(buildFolder)
};

function clearBlocksDir() {
  return del(buildFolder + "/blocks")
};

function serve() {
  sync.init({
    port: 3010,
    reloadOnRestart: true,
    server: {
      baseDir: buildFolder,
      directory: true, // чтобы загружался сразу index.html поменять на "false"
    },
    notify: false, // чтобы всплывало сообщение об обновлении браузера поменять на "true"
  });

  watch(sourceFolder + '/html/**/*.html', series(html)).on('change', sync.reload)
  watch(sourceFolder + '/less/**/*.less', series(styles, html)).on('change', sync.reload)
  watch(sourceFolder + '/js/**/*.js', series(js)).on('change', sync.reload)
  watch(sourceFolder + '/img/**/*', series(img)).on('change', sync.reload)
  watch(sourceFolder + '/img/**/*', series(svg)).on('change', sync.reload)
  watch(sourceFolder + '/img/icons/**/*', series(sprite)).on('change', sync.reload)
  watch(sourceFolder + '/fonts/**/*', series(fonts)).on('change', sync.reload)
};

exports.build = series(
  clear,
  styles,
  js,
  img,
  sprite,
  fonts,
  html,
  clearBlocksDir
);
exports.default = series(
  clear,
  styles,
  js,
  img,
  svg,
  sprite,
  fonts,
  html,
  serve
);
exports.fonts = convertFonts;
exports.bem = bem;
exports.clear = clear;