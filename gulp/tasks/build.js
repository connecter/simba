var gulp = require('gulp');

// Run this to compress all the things!
gulp.task('build', ['markup', 'images', 'fonts', 'sounds','minifyCss', 'uglifyJs', 'meta', 'strophe', 'apacheConfig']);
