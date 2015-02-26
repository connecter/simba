/* Notes:
   - gulp/tasks/watchify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp     = require('gulp');
var config   = require('../config');

gulp.task('watch', ['watchify','browserSync'], function(callback) {
  gulp.watch(config.sass.src + '**/**',   ['sass']);
  gulp.watch(config.images.src, ['images']);
  gulp.watch(config.markup.src, ['markup']);
  gulp.watch(config.fonts.src, ['fonts']);
  gulp.watch(config.sounds.src, ['sounds']);
  // Watchify will watch and recompile our JS, so no need to gulp.watch it
});
