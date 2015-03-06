var browserSync = require('browser-sync');
var gulp        = require('gulp');
var config      = require('../config').devServer;
var modRewrite  = require('connect-modrewrite');
var httpProxy = require('http-proxy');
var https = require('https');
var url         = require('url');
var fs = require('fs');

gulp.task('devServer', function() {
  var proxy = new httpProxy.createProxyServer({
    target: {
      host: config.xmpp.host,
      port: config.xmpp.port
    }
  });

  var options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
  };

  var proxyServer = https.createServer(options, function (req, res) {
    proxy.web(req, res);
  });
  
  proxyServer.on('upgrade', function (req, socket, head) {
    proxy.ws(req, socket, head);
  });

  proxyServer.listen(8015);

  browserSync({
    server: {
      https: true,
      baseDir: config.root,
      middleware: [
        modRewrite(['^/([a-zA-Z0-9]+)$ /index.html'])
      ]
    }
  });
});
