"use strict";

var UndoManager = function() {
  this.undoStack = [];
};

UndoManager.prototype.add = function(command) {
  this.undoStack.push(command);
};

UndoManager.prototype.add = function(command) {
  this.undoStack.push(command);
};

UndoManager.prototype.undo = function() {
  var command = this.undoStack.pop();

  if (command) {
    command();
  }
};

UndoManager.prototype.hasUndo = function() {
  return this.undoStack.length;
};

module.exports = UndoManager;