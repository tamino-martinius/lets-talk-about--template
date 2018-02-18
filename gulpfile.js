var gulp = require('gulp');
var p = require('gulp-load-plugins')();

var browserSync = require('browser-sync');
var reload = browserSync.reload;

// Start the server
gulp.task('browser-sync', function() {
  browserSync({
    open : true,
    server: {
      baseDir: "./"
    }
  });
});

gulp.task('slides',function () {
  gulp.src('index.pug')
    .pipe(p.plumber())
    .pipe(p.pug())
    .pipe(gulp.dest('./'))
    .pipe(reload({stream:true}))
  ;
});


gulp.task('styles',function() {
  gulp.src('*.styl')
    .pipe(p.stylus())
    .pipe(p.autoprefixer())
    .pipe(gulp.dest('./'))
    .pipe(reload({stream:true}))
  ;
});

module.exports = gulp.task('default', ['slides','styles','browser-sync'] ,function() {
  gulp.watch('./**/*.pug',['slides']);
  gulp.watch('./**/*.styl',['styles']);
});
