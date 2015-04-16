"use strict";

var UI = {};
var EventEmitter = require("events");
var React = require("react");
var RTCEvents = require("../../meet/service/RTC/RTCEvents");
var StreamEventTypes = require("../../meet/service/RTC/StreamEventTypes");
var XMPPEvents = require("../../meet/service/xmpp/XMPPEvents");
var NicknameHandler = require("../../meet/modules/UI/util/NicknameHandler");
var RoomNameGenerator = require("../../meet/modules/UI/welcome_page/RoomnameGenerator");
var UIEvents = require("../../meet/service/UI/UIEvents");
var eventEmitter = new EventEmitter();
var roomName = null;
var View;

UI.messageHandler = require("./messageHandler");

function registerListeners() {
  APP.RTC.addStreamListener(streamHandler, StreamEventTypes.EVENT_TYPE_LOCAL_CREATED);  

  APP.RTC.addStreamListener(streamHandler, StreamEventTypes.EVENT_TYPE_LOCAL_CHANGED);  
 
  APP.RTC.addListener(RTCEvents.DOMINANTSPEAKER_CHANGED, onDominantSpeakerChanged);

  APP.RTC.addStreamListener(remoteStreamHandler, StreamEventTypes.EVENT_TYPE_REMOTE_CREATED);

  APP.xmpp.addListener(XMPPEvents.STREAMS_CHANGED, onChangedStreams);

  APP.xmpp.addListener(XMPPEvents.MUC_JOINED, onMucJoined);

  APP.xmpp.addListener(XMPPEvents.MUC_MEMBER_JOINED, onMucEntered);

  APP.xmpp.addListener(XMPPEvents.MUC_MEMBER_LEFT, onMucLeft);
  
  APP.UI.addListener(UIEvents.NICKNAME_CHANGED, onNicknameChanged);

  APP.xmpp.addListener(XMPPEvents.DISPLAY_NAME_CHANGED, onDisplayNameChanged);

  APP.xmpp.addListener(XMPPEvents.MESSAGE_RECEIVED, processCommandReceivedThroughChat);

  APP.RTC.addStreamListener(onVideoTypeChanged, StreamEventTypes.EVENT_TYPE_REMOTE_CHANGED);

  APP.RTC.addListener(RTCEvents.LASTN_CHANGED, function (lastNEndpoints, endpointsEnteringLastN, stream) {
    console.log("LASTN_CHANGED");
    console.log(arguments);
  });

  APP.RTC.addListener(RTCEvents.LASTN_ENDPOINT_CHANGED, function (lastNEndpoints, endpointsEnteringLastN, stream) {
    console.log("LASTN_ENDPOINT_CHANGED");
    console.log(arguments);
  });

  APP.RTC.addListener(RTCEvents.SIMULCAST_LAYER_CHANGED,
    function (endpointSimulcastLayers) {
    console.log("SIMULCAST_LAYER_CHANGED");
    console.log(arguments);  
  });

  APP.RTC.addListener(RTCEvents.SIMULCAST_LAYER_CHANGING,
    function (endpointSimulcastLayers) {
    console.log("SIMULCAST_LAYER_CHANGING");
    console.log(arguments);
  });

  APP.statistics.addAudioLevelListener(audioLevelHandler);
}

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

function remoteStreamHandler(stream) {
  View.addStream(stream);
}

function onVideoTypeChanged(jid) {
  View.changeVideoType(jid);
}

function onDominantSpeakerChanged(resourceJid) {
  View.changeDominantSpeaker(resourceJid);
}

function onChangedStreams(jid, changedStreams) {
  View.checkMediaFlowAttributes(jid, changedStreams);
}

function onMucJoined(jid, info) {
  if(NicknameHandler.getNickname()===null) {
    NicknameHandler.setNickname(window.prompt("Your Nickname?"));
  } else {
    eventEmitter.emit(UIEvents.NICKNAME_CHANGED, NicknameHandler.getNickname());
  }

  var colors = ['#6FC90D', '#20AEE0', '#10C497', '#974CF4', '#FB5837', '#F12D42', '#FFA91C', '#F445AC', '#4A54FF'];
  View.setLocalColor(colors[Math.floor(Math.random() * colors.length)]);
}

function onMucEntered(jid, id, displayName) {
  View.addParticipant(jid, id, displayName);  
}

function onMucLeft(jid) {
  View.deleteParticipant(jid);
}

function onNicknameChanged(nickname) {
  View.setLocalName(nickname);
}

function onDisplayNameChanged(jid, displayName) {
  View.changeParticipantName(jid, displayName);
}

function audioLevelHandler(jid, audioLevel) {
  View.updateAudioLevel(jid, audioLevel);
}

function processCommandReceivedThroughChat(from, display, command) {
  if(Strophe.getResourceFromJid(from)!==APP.xmpp.myResource()) {
    View.processCommand(JSON.parse(command));
  }
}

UI.start = function() {
  var Container = require('../components/container');
  View = React.render(React.createElement(Container), $('.connecter-wrap')[0]);
  registerListeners();
  NicknameHandler.init(eventEmitter);
};

UI.setVideoMuteButtonsState = function(mute) {
  View.setVideoMuteButtonsState(mute);
};

UI.addListener = function (type, listener) {
  eventEmitter.on(type, listener);
};

UI.getLargeVideoState = function() {
  return View.getLargeVideoState();
};

UI.disableConnect = function () {
  return; 
};

UI.checkForNicknameAndJoin = function () {
  var nick = null;
  APP.xmpp.joinRoom(roomName, config.useNicks, nick);
};

UI.generateRoomName = function() {
  if(roomName) {
    return roomName;
  }

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