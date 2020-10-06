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
var browserSync = require("browser-sync");
var replace = require("gulp-replace");
var fileinclude = require("gulp-file-include");
const dom = require("gulp-jsdom");
var concatCss = require("gulp-concat-css");
var wait = require("gulp-wait");
var merge = require('merge-stream')

function promisifyStream(stream) {
  return new Promise((res) => stream.on("end", res));
}

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

  done();
});

// > Procesa los archivos SASS/SCSS, sin sourcemaps, minimizados y con autoprefixer
gulp.task('styles-min', function(done) {
  var sassStream;
  var cssStream;
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

gulp.task('concat-webflow-styles', function(done) {
  gulp
    .src(config.webflow.css)
    .pipe(replace("../../images", "../images"))
    .pipe(replace("../images", "/assets/webflow/images"))
    .pipe(concat("webflow.css"))
    .pipe(gulp.dest(config.scss.dest));
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
      fileinclude({
        prefix: "@@",
        basepath: "docs/assets",
      })
    )
    .pipe(
      htmlPartial({
        basePath: config.html_partials.base,
      })
    )
    .pipe(
      rename(function (file) {
        if (file.basename !== "index") {
          file.dirname = file.basename;
          file.basename = "index";
          file.extname = ".html";
        }
      })
    )
    .pipe(gulp.dest(config.html_partials.dest));

  console.log('HTML OK')
  done();
});

gulp.task("webflow-landings", function (done) {
  gulp
    .src(config.webflow.landings)
    .pipe(replace("../../", "../"))
    .pipe(replace("../", "/assets/webflow/"))
    .pipe(
      rename(function (file) {
        if (file.basename !== "index") {
          file.dirname = file.basename;
          file.basename = "index";
          file.extname = ".html";
        }
      })
    )
    .pipe(gulp.dest(config.html_partials.dest));

  console.log("Landings OK");
  done();
});


gulp.task("rewrite-webflow-paths", async function (done) {
  await promisifyStream(
    gulp
      .src(config.webflow.html_src)
      .pipe(replace('src="../images/', 'src="/assets/webflow/images/'))
      .pipe(replace('src="../../images/', 'src="/assets/webflow/images/'))
      .pipe(replace('../../images/', '/assets/webflow/images/'))
      .pipe(replace('../images/', '/assets/webflow/images/'))
      .pipe(gulp.dest(config.webflow.tmp))
    )
  done();
});
gulp.task("rewrite-webflow-css", async function (done) {
  await promisifyStream(
    gulp
      .src(config.webflow.css)
      .pipe(replace('../../images', '/assets/webflow/images'))
      .pipe(replace('../images', '/assets/webflow/images'))
      .pipe(gulp.dest(config.webflow.tmp))
    )
  done();
});

gulp.task("rewrite-webflow-partials", async function (done) {
  await promisifyStream (
    gulp
      .src(config.webflow.partials)
      .pipe(
        dom(function (document) {
          console.log('Rewriting partials')
          return document.body.innerHTML;
        }, {

        }, false)
      ).pipe(wait(500))
      .pipe(gulp.dest(config.webflow.finalPartials))
    )
  done();
});

gulp.task("copy-webflow-images", function (done) {
  gulp
    .src(config.webflow.images)
    .pipe(gulp.dest(config.webflow.final + "/images"));
  done();
});

gulp.task("copy-webflow-css", function (done) {
  gulp
    .src(config.webflow.css)
    .pipe(gulp.dest(config.webflow.final + "/css"));
  done();
});

gulp.task("copy-webflow-js", function (done) {
  gulp
    .src(config.webflow.js)
    .pipe(gulp.dest(config.webflow.final + "/js"));
  done();
});

gulp.task(
  "webflow",
  gulp.series(
    [
      "rewrite-webflow-paths",
      "rewrite-webflow-partials",
      "copy-webflow-images",
      "copy-webflow-css",
      "copy-webflow-js",
      "webflow-landings",
      "concat-webflow-styles",
    ],
    function (done) {
      console.log("> Webflow: OK");
      done();
    }
  )
);

// > Arranca el servidor web con BrowserSync
gulp.task(
  "default",
  gulp.series(
    [
      "webflow",
      "html",
      "styles",
      "scripts",
    ],
    function (done) {
      browserSync.init({
        server: {
          baseDir: "./docs/",
        },
        ghostMode: false,
        online: true,
      });
      gulp.watch(
        config.webflow.html_src,
        gulp.series(["webflow", "html", "bs-reload"])
      );
      gulp.watch(config.html, gulp.series(["html", "bs-reload"]));
      gulp.watch(config.images, gulp.series("bs-reload"));
      gulp.watch(config.scss.src, gulp.series("styles"));
      gulp.watch(config.js.src, gulp.series(["scripts", "bs-reload"]));
      done();
    }
  )
);

// > Arranca el servidor web con BrowserSync
gulp.task(
  "build",
  gulp.series(
    ["webflow", "html", "styles-min", "scripts-min"],
    function (done) {
      console.log("> Versión de producción: OK");
      done();
    }
  )
);

// > Genera una versión lista para producción
gulp.task(
  "deploy",
  gulp.series(["styles-min", "concat-webflow-styles", "scripts-min"], function (
    done
  ) {
    console.log("> Versión de producción: OK");
    done();
  })
);

// > Recarga las ventanas del navegador
gulp.task('bs-reload', function(done) {
  browserSync.reload();
  done();
});
