window.jQuery = window.$ = require('jquery');
window.config = require('../meetConfig').general;
window.interfaceConfig = require('../meetConfig').interface;
// TODO Strophe CommonJS
// window.Strophe =require('../meet/libs/strophe/strophe.min'); s
// require('../meet/libs/strophe/strophe.disco.min');
// require('../meet/libs/strophe/strophe.caps.jsonly.min');
window.toastr = require('../meet/libs/toastr');
require('../meet/libs/jquery-ui');
require('../meet/libs/tooltip');
require('../meet/libs/popover');
require('../meet/libs/jquery-impromptu');
require('../meet/libs/jquery.autosize');

window.APP = require('../meet/app.js');