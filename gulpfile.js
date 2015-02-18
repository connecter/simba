// This is to support self signed certificates when proxying to http-bind in local dev env.
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var requireDir = require('require-dir');

requireDir('./gulp/tasks', { recurse: true });
