/*import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import squoosh from 'gulp-squoosh';
import svgo from 'gulp-svgo';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';
*/
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const squoosh = require("gulp-squoosh");
const terser = require("gulp-terser");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const del = require("del");
const sync = require("browser-sync").create();


// Styles
/*
export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(), csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}
*/
const styles = () => {
  return gulp.src("source/less/style.less")
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(less())
  .pipe(postcss([
  autoprefixer(),
  csso()
  ]))
  .pipe(rename("style.min.css"))
  .pipe(sourcemap.write("."))
  .pipe(gulp.dest("build/css"))
  .pipe(sync.stream());
  }
  exports.styles = styles;

//html
/*
export const html = () => {
  return gulp.src('source/*.html')
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest('build'));
  }
*/
const html = () => {
  return gulp.src("source/*.html")
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(gulp.dest("build"));
  }

//scripts
/*
export const scripts = () => {
  return gulp.src('source/js/*.js')
  .pipe(gulp.dest('build/js'));
  }
*/
const scripts = () => {
  return gulp.src("source/js/script.js")
  .pipe(terser())
  .pipe(gulp.dest("build/js"))
  .pipe(sync.stream());
  }
  exports.scripts = scripts;

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
  }

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
  .pipe(gulp.dest('build/img'))
  }


//WebP

// export const createWebp = () => {
//   return gulp.src('source/img/**/*.{jpg,png}')
//   .pipe(squoosh({
//     webp: {}
//   }))
//   .pipe(gulp.dest('build/img'));
//   }

const createWebp = () => {
  return gulp.src("source/img/**/*.{jpg,png}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"))
  }
  exports.createWebp = createWebp;

//svg

// export const svg = () => {
//   return gulp.src(['source/img/**/*.svg', '!source/img/logo/*.svg'])//выбрать все svg, кроме папки logo
//   .pipe(svgo())
//   .pipe(gulp.dest('build/img'));
//   }

//svg sprite

// export const sprite = () => {
//   return gulp.src('source/img/logo/*.svg')
//   .pipe(svgo())
//   .pipe(svgstore({
//     inlineSvg: true
//   }))
//   .pipe(rename('sprite.svg'))
//   .pipe(gulp.dest('build/img'));
//   }

const sprite = () => {
  return gulp.src("source/img/logo/*.svg")
  .pipe(svgstore({
  inlineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
  }

  exports.sprite = sprite;

//copy
// export const copy = () => {
//   return gulp.src([
//     'source/fonts/*.{woff2,woff}',
//     'source/*.ico',
//     'source/manifest.webmanifest'
//   ], {
//     base: 'source'
//   })
//   .pipe(gulp.dest('build'));
//   }

const copy = (done) => {
  gulp.src([
  "source/fonts/*.{woff2,woff}",
  "source/*.ico",
  "source/img/**/*.svg",
  "!source/img/logo/*.svg",
  ], {
  base: "source"
  })
  .pipe(gulp.dest("build"))
  done();
  }
  exports.copy = copy;


//clean

// export const clean = () => {
//   return del('build');
// };

const clean = () => {
  return del("build");
  };

// Server

// const server = (done) => {
//   browser.init({
//     server: {
//       baseDir: 'build'
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// }

const server = (done) => {
  sync.init({
  server: {
  baseDir: "build"
  },
  cors: true,
  notify: false,
  ui: false,
  });
  done();
  }
  exports.server = server;

const reload = (done) => {
  sync.reload();
  done();
  }

// Watcher

// const watcher = () => {
//   gulp.watch('source/less/**/*.less', gulp.series(styles));
//   gulp.watch('source/*.html').on('change', browser.reload);
// }
const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series(styles));
  gulp.watch("source/js/script.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
  }

// Build

// export const build = gulp.series(
//   clean,
//   copy,
//   copyImages,
//   gulp.parallel(
//   styles,
//   html,
//   scripts,
//   svg,
//   sprite,
//   createWebp
//   )
//   );

const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
  styles,
  html,
  scripts,
  sprite,
  createWebp
  ),
  );
  exports.build = build;


// Default

// export default gulp.series(
//   clean,
//   copy,
//   copyImages,
//   gulp.parallel(
//   styles,
//   html,
//   scripts,
//   svg,
//   sprite,
//   createWebp
//   ),
//   gulp.series(
//   server,
//   watcher
//   ));

exports.default = gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
  styles,
  html,
  scripts,
  sprite,
  createWebp
  ),
  gulp.series(
  server,
  watcher
  ));

