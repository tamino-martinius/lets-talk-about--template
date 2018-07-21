const gulp = require('gulp');
const p = require('gulp-load-plugins')();

const browserSync = require('browser-sync');
const reload = browserSync.reload;

const paths = {
  slides: {
    src: './*.pug',
    dest: './',
  },
  styles: {
    src: './*.styl',
    dest: './',
  }
};

// Start the server
function serve() {
  browserSync.init({
    open: true,
    server: {
      baseDir: "./",
    },
  });
}

function slides() {
  return gulp.src(paths.slides.src)
    .pipe(p.plumber())
    .pipe(p.pug())
    .pipe(gulp.dest(paths.slides.dest))
    .pipe(reload({
      stream: true,
    }));
}


function styles() {
  return gulp.src(paths.styles.src)
    .pipe(p.stylus())
    .pipe(p.autoprefixer())
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(reload({
      stream: true,
    }));
}

function watch() {
  gulp.watch(paths.slides.src, slides);
  gulp.watch(paths.styles.src, styles);
}

const build = gulp.series(
  gulp.parallel(slides, styles),
  gulp.parallel(serve, watch),
);

gulp.task('default', build);

exports.build = build;
exports.serve = serve;
exports.slides = slides;
exports.styles = styles;
exports.watch = watch;
