"use strict";

var Mousetrap = require('mousetrap'),
    _ = require('lodash');

var commandsShortcutMap = {
  "undo": 'mod+z',
  'snapshot': 's'
};

module.exports = (function() {
  var commandBridge;

  function initBindings() {
    _.forEach(commandsShortcutMap, function( keys, command) {
      Mousetrap.bind(keys, function() {
        commandBridge(command)();
      });
    });  
  }

  return {
    start: function(View) {
      commandBridge = View.execCommand;  
      initBindings();
    }
  };
})();
  