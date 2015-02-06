var gulp    = require('gulp');
var config  = require('../config').build;

gulp.task('strophe', function () {
  return gulp.src(config.appSrc + '/meet/libs/strophe/**')
    .pipe(gulp.dest(config.jsDest + '/strophe'));
});