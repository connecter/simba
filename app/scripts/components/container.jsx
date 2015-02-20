'use strict';

var React = require('react'),
    _ = require('lodash');;

var Header = require('./header'),
    Footer = require('./footer'),
    Participants = require('./participants'),
    Discussions = require('./discussions'),
    Presentation = require('./presentation')

var Container = React.createClass({
  getInitialState: function() {
    return {
      participants: {},
      largeVideo: {
        stream: null,
        userJid: null
      },
      dominantSpeaker: null,
      callControlToggleStates: {}
    };
  },

  changeLocalAudio: function(stream) {
    this.setState({localAudio: stream});

    stream.getOriginalStream().onended = function() {
      this.setState({localAudio: null});
    }
  },

  changeLocalVideo: function(stream) {
    var newState = {localVideo: stream};

    if(this.state.largeVideo.userJid===null) {
      newState.largeVideo = {
        stream: stream, 
        userJid: "local"
      };
    }

    this.setState(newState);

    stream.getOriginalStream().onended = function() {
      this.setState({localVideo: null});
    }
  },

  setLocalName: function(nickname) {
    this.setState({localName: nickname});
  },

  toggleVideo: function() {
    var that = this;

    APP.xmpp.setVideoMute(!this.state.callControlToggleStates.videoMute, function() {
      that.setState({callControlToggleStates: _.assign(that.state.callControlToggleStates,
        {videoMute: !that.state.callControlToggleStates.videoMute})});
    });
  },

  toggleAudio: function() {
    var that = this;

    APP.xmpp.setAudioMute(!this.state.callControlToggleStates.micMute, function() {
      that.setState({callControlToggleStates: _.assign(that.state.callControlToggleStates,
        {micMute: !that.state.callControlToggleStates.micMute})});
    });
  },

  hangup: function() {
    APP.xmpp.disposeConference();
    APP.UI.messageHandler.openDialog(
      "Session Terminated",
      "You hung up the call. Refresh the browser to join again"
    );
  },

  execCommand: function(command) {
    var that = this;

    return function() {
      that[command]();
    };
  },

  addStream: function (stream) {
    if (stream.peerjid) {
      var participantId = 'participant_' + Strophe.getResourceFromJid(stream.peerjid);
      var participant = {};

      participant[participantId] = this.state.participants[participantId] || {}
      participant[participantId]['stream'] = stream; 

      this.setState({participants: _.assign(this.state.participants, participant)});
    } else {
      var id = stream.getOriginalStream().id;

      if (id !== 'mixedmslabel'&& id !== 'default') {
        console.error('can not associate stream', id, 'with a participant');
        return;
      }
    }
  },

  changeDominantSpeaker: function(resourceJid) {
    if (resourceJid === APP.xmpp.myResource()) {
      return;
    } else {      
      var newSpeaker = 'participant_' + resourceJid;
      var newState = {dominantSpeaker: newSpeaker};

      if(this.state.participants[newSpeaker] && !this.state.participants[newSpeaker].videoMute) {
        newState.largeVideo = {
          userResourceJid: resourceJid,
          userJid: this.state.participants[newSpeaker].jid,
          stream: this.state.participants[newSpeaker].stream
        };
      }

      this.setState(newState);
    }
  },

  checkMediaFlowAttributes: function(jid, changedStreams) {
    if (jid === APP.xmpp.myJid()) {
      return;
    } else {
      var that = this;
          var participantId = 'participant_' + Strophe.getResourceFromJid(jid);  
          var participant = {};
          participant[participantId] = that.state.participants[participantId] || {};

      _.forEach(changedStreams, function(stream) {
        if(stream.type === 'video' || stream.type === 'screen') {

          switch (stream.direction) {
            case 'sendrecv':
              participant[participantId].videoMute = false;
              that.setState({participants: _.assign(that.state.participants, participant)});
              break;
            case 'recvonly':
              participant[participantId].videoMute = true;
              that.setState({participants: _.assign(that.state.participants, participant)});
              break;
          }
        }
      });
    }
  },

  getLargeVideoState: function() {
    return this.state.largeVideo;
  },

  addParticipant: function(jid, id, displayName) {
    var newParticipant = {}
    
    newParticipant['participant_' + Strophe.getResourceFromJid(jid)] = {
      jid: jid,
      id: id,
      displayName: displayName
    };

    this.setState({participants: _.assign(this.state.participants, newParticipant)});
  },

  changeParticipantName: function(jid, newName) {
    if (jid === APP.xmpp.myJid()) {
      return;
    } else {
      var participantId = 'participant_' + Strophe.getResourceFromJid(jid);  
      var participant = {};

      participant[participantId] = this.state.participants[participantId] || {};
      participant[participantId]['displayName'] = newName;

      this.setState({participants: _.assign(this.state.participants, participant)});
    }
  },

  deleteParticipant: function(jid) {
    this.setState({participants: _.omit(this.state.participants, 
      'participant_' + Strophe.getResourceFromJid(jid))});
  },

  isParticipantActive: function(jid) {
    if(jid==='local') {
      return this.state.largeVideo.userJid === jid && this.state.localName && _.keys(this.state.participants).length > 0;
    } else {
      return this.state.largeVideo.userJid === jid;
    }
  },

  shouldFlipVideo: function() {
    return this.state.largeVideo.userJid === "local";
  }, 

  renderPresentation: function() {
    if(this.state.largeVideo.stream) {
      return (
        <Presentation largeVideo={this.state.largeVideo.stream} shouldFlipVideo={this.shouldFlipVideo()}></Presentation>
      );
    }
  },

  renderParticipants: function() {
    if(this.state.localAudio && this.state.localVideo) {
      return (<Participants participants={this.state.participants} local={{video: this.state.localVideo, audio: this.state.localAudio, displayName: this.state.localName}} isParticipantActive={this.isParticipantActive}></Participants>)
    }
  },

  render: function() {
    return (
      <div>
        <Header></Header>
        {this.renderPresentation()}
        {this.renderParticipants()}
        <Discussions></Discussions>
        <Footer execCommand={this.execCommand} callControlToggleStates={this.state.callControlToggleStates}></Footer>
      </div>
    );
  }
});

module.exports = Container;
