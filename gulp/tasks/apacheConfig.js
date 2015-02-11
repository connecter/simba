var gulp    = require('gulp');
var config  = require('../config').build;

gulp.task('apacheConfig', function () {
  return gulp.src('./node_modules/apache-server-configs/dist/.htaccess', 
    {dot: true }).pipe(gulp.dest(config.dest)); 
});