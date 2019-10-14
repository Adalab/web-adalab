'use strict';

var config = require('./config.json');
var gulp = require('gulp');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');
var combineMq = require('gulp-combine-mq');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var htmlPartial = require('gulp-html-partial');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');

// > Procesa los archivos SASS/SCSS, añade sourcemaps y autoprefixer
gulp.task('styles', function(done) {
  gulp
    .src(config.scss.src)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      sass({
        outputStyle: 'extended',
      })
    )
    .pipe(
      combineMq({
        beautify: true,
      })
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions', 'ie >= 10'],
        cascade: false,
      })
    )
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.scss.dest))
    .pipe(browserSync.reload({ stream: true }));
  //.pipe(notify({message: 'CSS OK', onLast: true}));
  done();
});

// > Procesa los archivos SASS/SCSS, sin sourcemaps, minimizados y con autoprefixer
gulp.task('styles-min', function(done) {
  gulp
    .src(config.scss.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(
      sass({
        outputStyle: 'compressed',
      })
    )
    .pipe(
      combineMq({
        beautify: false,
      })
    )
    .pipe(
      autoprefixer({
        browsers: ['last 2 versions', 'ie >= 10'],
        cascade: false,
      })
    )
    .pipe(gulp.dest(config.scss.dest))
    .pipe(notify({ message: 'CSS MIN OK', onLast: true }));
  done();
});

// > Procesa los scripts concatenando
gulp.task('scripts', function(done) {
  gulp
    .src(config.js.src)
    .pipe(sourcemaps.init())
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(concat('main.min.js'))
    //.pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.js.dest))
    .pipe(browserSync.reload({ stream: true }));
  //.pipe(notify({message: 'JS OK', onLast: true}));
  done();
});

// > Procesa los scripts concatenando, minimizando y sin sourcemaps
gulp.task('scripts-min', function(done) {
  gulp
    .src(config.js.src)
    .pipe(
      plumber({ errorHandler: notify.onError('Error: <%= error.message %>') })
    )
    .pipe(concat('main.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dest))
    .pipe(notify({ message: 'JS MIN OK', onLast: true }));
  done();
});

gulp.task('html', function(done) {
  gulp
    .src(config.html_partials.src)
    .pipe(
      htmlPartial({
        basePath: config.html_partials.base,
      })
    )
    .pipe(
      rename(function(file) {
        if (file.basename !== 'index') {
          file.dirname = file.basename;
          file.basename = 'index';
          file.extname = '.html';
        }
      })
    )
    .pipe(gulp.dest(config.html_partials.dest));
  done();
});

// > Arranca el servidor web con BrowserSync
gulp.task(
  'default',
  gulp.series(['html', 'styles', 'scripts'], function(done) {
    browserSync.init({
      server: {
        baseDir: './docs/',
      },
      ghostMode: false,
      online: true,
    });
    gulp.watch(config.html, gulp.series(['html', 'bs-reload']));
    gulp.watch(config.images, gulp.series('bs-reload'));
    gulp.watch(config.scss.src, gulp.series('styles'));
    gulp.watch(config.js.src, gulp.series(['scripts', 'bs-reload']));
    done();
  })
);

// > Genera una versión lista para producción
gulp.task(
  'deploy',
  gulp.series(['styles-min', 'scripts-min'], function(done) {
    console.log('> Versión de producción: OK');
    done();
  })
);

// > Recarga las ventanas del navegador
gulp.task('bs-reload', function(done) {
  browserSync.reload();
  done();
});
