"use strict";

Var Command = function(name, undo, interceptors) {
  this.name = name;
  this.undo = undo;
  this.interceptors = interceptors;
};

Command.prototype.execute(function() {

});


var syncPath = new Command('syncPath', 'remove', interceptors, args)

