var UI = {};

var EventEmitter = require("events");
var React = require("react");

var RTCEvents = require("../../meet/service/RTC/RTCEvents");
var StreamEventTypes = require("../../meet/service/RTC/StreamEventTypes");
var XMPPEvents = require("../../meet/service/xmpp/XMPPEvents");

var RoomNameGenerator = require("../../meet/modules/UI/welcome_page/RoomnameGenerator");

var eventEmitter = new EventEmitter();
var roomName = null;
var View;

function streamHandler(stream) {
  switch (stream.type) {
    case "audio":
      View.changeLocalAudio(stream);
    break;
    case "video":
      View.changeLocalVideo(stream);
    break;
    case "stream":
      View.changeLocalVideo(stream);
    break;
  }
}


function registerListeners() {
  APP.RTC.addStreamListener(streamHandler, StreamEventTypes.EVENT_TYPE_LOCAL_CREATED);  

  APP.RTC.addStreamListener(streamHandler, StreamEventTypes.EVENT_TYPE_LOCAL_CHANGED);  
 
  APP.RTC.addListener(RTCEvents.DOMINANTSPEAKER_CHANGED, function (resourceJid) {
    View.onDominantSpeakerChanged(resourceJid);
  });

  APP.RTC.addStreamListener(function (stream) {
    View.onRemoteStreamAdded(stream);
  }, StreamEventTypes.EVENT_TYPE_REMOTE_CREATED);
}

UI.start = function() {
  registerListeners();
  var Container = require('../components/container')
  View = React.render(React.createElement(Container), $('.connecter-wrap')[0]);
};

UI.addListener = function (type, listener) {
  eventEmitter.on(type, listener);
}

UI.messageHandler = {
  showError: function(title, msg) {
    alert(title + ' - ' + msg);
  }
};

UI.getLargeVideoState = function() {
  return View.getLargeVideoState();
}

UI.disableConnect = function () {
  return; 
};

UI.checkForNicknameAndJoin = function () {
    var nick = null;
    APP.xmpp.joinRoom(roomName, config.useNicks, nick);
};

UI.generateRoomName = function() {
  if(roomName)
    return roomName;
  var roomnode = null;
  var path = window.location.pathname;

// determinde the room node from the url
// TODO: just the roomnode or the whole bare jid?
if (config.getroomnode && typeof config.getroomnode === 'function') {
  // custom function might be responsible for doing the pushstate
  roomnode = config.getroomnode(path);
} else {
  /* fall back to default strategy
   * this is making assumptions about how the URL->room mapping happens.
   * It currently assumes deployment at root, with a rewrite like the
   * following one (for nginx):
   location ~ ^/([a-zA-Z0-9]+)$ {
   rewrite ^/(.*)$ / break;
   }
   */
   if (path.length > 1) {
    roomnode = path.substr(1).toLowerCase();
  } else {
    var word = RoomNameGenerator.generateRoomWithoutSeparator();
    roomnode = word.toLowerCase();

    window.history.pushState('VideoChat',
      'Room: ' + word, window.location.pathname + word);
  }
}

  roomName = roomnode + '@' + config.hosts.muc;
  return roomName;
};

module.exports = UI;