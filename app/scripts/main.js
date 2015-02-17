'use strict';

var $ = require('jquery');

window.$ = window.jquery = $;

var Container = require('./components/container');

window.config = require('../meetConfig');

var APP = window.APP = {
  init: function () {
    this.UI = require("./modules/UI")
    this.RTC = require("../meet/modules/RTC/RTC");
    this.simulcast = require("../meet/modules/simulcast/simulcast");
    this.xmpp = require("../meet/modules/xmpp/xmpp");
    this.desktopsharing = require("../meet/modules/desktopsharing/desktopsharing");

    APP.RTC.start();
    APP.xmpp.start({});
    APP.UI.start();
  }
};


$(document).ready(function() {
  APP.init();
}); 

module.exports = APP;
