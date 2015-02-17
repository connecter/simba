var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config').browserSync;
var modRewrite  = require('connect-modrewrite');
var proxy       = require('proxy-middleware')
var url         = require('url')  

var proxyOptions = url.parse(config.xmppBindUrl);
proxyOptions.route = '/http-bind/';

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: config.root,
      middleware: [
        modRewrite(['^/([a-zA-Z0-9]+)$ /index.html']),
        proxy(proxyOptions)
      ]
    }
  });
});
