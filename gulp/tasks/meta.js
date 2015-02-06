var gulp    = require('gulp');
var config  = require('../config').build;

gulp.task('meta', function () {
  return gulp.src(config.appSrc + '/*.{txt,ico,png}')
    .pipe(gulp.dest(config.dest));
});