"use strict";
var whiteboard = {};

whitebord.commands = {
  mouseTrack: whiteboard.wbInstace.prototype.mouseTrack,
  draw: whiteboard.wbInstance.protoptype.draw
};

whiteboard.wbInstance = function(participant,  steamId, lockedColors) {
  this.ownerResourceJid = resourceJid;
  this.streamId = streamId;
  this.id = 'wb_' + resrouceJid + '_' + streamId;
};


whiteboard.wbInstance.prototype.processCommands = function(command) {
  if(whiteboard.commands[command[0]]) {
    command[0].apply(window, Array.prototype.slice.call(command,1));
  }
};

whiteboard.wbInstace.prototype.mouseTrack = function(jid, x, y, ) {

}