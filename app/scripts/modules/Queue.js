"use strict";

var Queue = function() {
  this.queue = [];
  this.isRunning = false;
};

Queue.prototype.add = function(func) { 
  this.queue.push(function() {
    var finished = func();

    if(typeof finished === "undefined" || finished) {
      this.next();
    }
  }.bind(this));

  if(!this.isRunning) {
    this.next();
  }

  return this;
};

Queue.prototype.next = function() {
  var shift = this.queue.shift(); 
  this.isRunning = false;

  if(shift) { 
    this.running = true;
    shift(); 
  }
};

module.exports = Queue;