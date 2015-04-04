"use strict";

var _ = require('lodash');

var UndoManager = function() {
  this.undoStack = [];
};

UndoManager.prototype.add = function(command, type) {
  this.undoStack.push({type: type, command: command});
};

UndoManager.prototype.undo = function() {
  var undo = this.undoStack.pop();

  if (undo.command) {
    undo.command();
  }
};

UndoManager.prototype.removeLastOfType = function(type) {
  var undoIndex;

  _.forEach(this.undoStack, function(undo, index) {
    if(undo.type === type) {
      undoIndex = index;
    }
  });

  if(!isNaN(undoIndex)) {
    this.undoStack.splice(undoIndex, 1);
  }
};

UndoManager.prototype.hasUndo = function() {
  return this.undoStack.length;
};

module.exports = UndoManager;