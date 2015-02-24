"use strict";

module.exports = {
  openDialog: function(title, msg) {
    alert(title + ' - ' + msg);
  },

  showError: function(titleKey, title, msgKey, msg) {
    alert(title + ' - ' + msg);
  }
};