var gulp      = require('gulp');
var config    = require('../config').build;
var minifyCSS = require('gulp-minify-css');
var size      = require('gulp-filesize');

gulp.task('minifyCss', ['sass'], function() {
  return gulp.src(config.cssSrc)
    .pipe(minifyCSS({processImport: false}))
    .pipe(gulp.dest(config.cssDest))
    .pipe(size());
})
