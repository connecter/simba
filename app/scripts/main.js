'use strict';

window.$ = window.jquery = require('jquery');

var Container = require('./components/container');
window.config = require('../meetConfig');


var APP = {
  init: function () {
    this.UI = require("./modules/UI");
    this.connectionquality = require("../meet/modules/connectionquality/connectionquality");
        this.statistics = require("../meet/modules/statistics/statistics");
    this.RTC = require("../meet/modules/RTC/RTC");
    this.simulcast = require("../meet/modules/simulcast/simulcast");
    this.xmpp = require("../meet/modules/xmpp/xmpp");
    this.desktopsharing = require("../meet/modules/desktopsharing/desktopsharing");

    APP.RTC.start();
    APP.xmpp.start({});
    APP.statistics.start();
    APP.connectionquality.init();
    APP.desktopsharing.init();
    APP.UI.start();
  }
};

$(document).ready(function() {
  APP.init();
}); 

module.exports = APP;
