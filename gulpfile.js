const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browserSync = require('browser-sync').create();
const purgecss = require('gulp-purgecss');
const rename = require('gulp-rename');

// Sass task
function scssTask() {
  return (
    src('node_modules/bootstrap/dist/css/bootstrap.css', { sourcemaps: true })
      // .pipe(sass())
      // .pipe(purgecss({ content: ['templates/**/*.twig'] }))
      // .pipe(postcss([cssnano()]))
      .pipe(rename('bootstrap.css'))
      .pipe(dest('assets/css/', { sourcemaps: '.' }))
  );
}

function jsTask() {
  return src('node_modules/bootstrap/dist/js/bootstrap.bundle.min.js', {
    sourcemaps: true,
  })
    .pipe(terser())
    .pipe(rename('main.js'))
    .pipe(dest('assets/js/', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb) {
  browserSync.init({
    watchOptions: {
      ignoreInitial: true,
      // ignored: '*.txt'
    },
    proxy: 'timber.local',
  });
  cb();
}

function browsersyncReload(cb) {
  browserSync.reload();
  cb();
}

// Watch task
function watchTask() {
  watch('templates/**/*.twig', browsersyncReload);
  watch(
    ['assets/sass/*.scss', 'assets/js/**/*.js'],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// Default Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
