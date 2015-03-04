"use strict";

module.exports = {
  openDialog: function(title, msg) {
    alert(title + ' - ' + msg);
  },

  showError: function(titleKey, msgKey) {
    alert(titleKey + ' - ' + msgKey);
  }
};