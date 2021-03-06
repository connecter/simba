'use strict';

var React = require('react'),
    _ = require('lodash');

var Header = require('./header'),
    Footer = require('./footer'),
    Participants = require('./participants'),
    Discussions = require('./discussions'),
    Presentation = require('./presentation');

var Container = React.createClass({
  getInitialState: function() {
    return {
      participants: {},
      largeVideo: {
        stream: null,
        userJid: null
      },
      local: {jid:'local'},
      callControlToggles: {},
      collaborationToolsToggle: '',
      hasUndo: 0,
      canClear: false
    };
  },

  sendCommand: function() {
    APP.xmpp.sendChatMessage(JSON.stringify(Array.prototype.slice.call(arguments)));
  },

  processCommand: function(command) {
    this.refs.presentation.processCommand.apply(this.refs.presentation, command);
  },

  changeLocalAudio: function(stream) {
    var newLocal = this.state.local,
        that = this;
        
    newLocal.audio = stream;
    this.setState({local: newLocal});

    stream.getOriginalStream().onended = function() {
      var newLocal = that.state.local;

      newLocal.audio = null;
      that.setState({local: newLocal});
    };
  },

  changeLocalVideo: function(stream) {
    var newState = {local:this.state.local},
        that = this;

    newState.local.video = stream;
    newState.local.isScreen = APP.desktopsharing.isUsingScreenStream();
    this.setState({callControlToggles: _.assign(this.state.callControlToggles,
        {screenStream: newState.local.isScreen})});

    if(this.state.largeVideo.userJid===null || this.state.largeVideo.userJid==='local') {
      this.changeLargeVideoTo(newState.local);
    }

    this.setState(newState);
  },
  
  changeLargeVideoTo: function(participant, returnNewState) {
    if(!participant.videoMute) {
      var newState = {};
      newState.largeVideo = {
        userJid: participant.jid,
        stream: participant.video,
        isScreen: participant.isScreen
      };

      if(returnNewState) {
        return newState.largeVideo;
      } else {
        this.setState(newState);
      }
    }
  },

  setLocalName: function(nickname) {
    var newLocal = this.state.local;
        
    newLocal.displayName = nickname;
    this.setState({local: newLocal});
  },

  setLocalColor: function(color) {
    var newLocal = this.state.local;
        
    newLocal.color = color;
    this.setState({local: newLocal});
  },

  toggleVideo: function() {
    APP.RTC.setVideoMute(!APP.RTC.localVideo.isMuted(),
      this.setVideoMuteButtonsState);
  },

  setVideoMuteButtonsState: function(mute) {
    var newLocal = this.state.local;

    newLocal.videoMute = mute;
    this.setState({callControlToggles: _.assign(this.state.callControlToggles,
      {videoMute: mute}), local: newLocal});
  },

  toggleAudio: function() {
    var that = this;

    APP.xmpp.setAudioMute(!this.state.callControlToggles.micMute, function() {
      that.setState({callControlToggles: _.assign(that.state.callControlToggles,
        {micMute: !that.state.callControlToggles.micMute})});
    });
  },

  toggleScreenshare: function() {
     APP.desktopsharing.toggleScreenSharing();
  },

  hangup: function() {
    APP.xmpp.disposeConference();
    APP.UI.messageHandler.openDialog(
      "Session Terminated",
      "You hung up the call. Refresh the browser to join again"
    );
  },

  togglePointer: function() {
    this.setState({collaborationToolsToggle: this.state.collaborationToolsToggle === 'pointer' ? '' : 'pointer'});
  },  

  togglePen: function() {
    this.setState({collaborationToolsToggle: this.state.collaborationToolsToggle === 'pen' ? '' : 'pen'});
  },  

  toggleText: function() {
    this.setState({collaborationToolsToggle: this.state.collaborationToolsToggle === 'text' ? '' : 'text'});
  },

  undo: function() {
    this.refs.presentation.undo();
  },

  clear: function() {
    if(this.state.canClear) {
      this.refs.presentation.clear();
    }
  },

  snapshot: function() {
    this.refs.presentation.snapshot();
  },

  setHasUndo: function(hasUndo) {
    this.setState({hasUndo: hasUndo});
  },
  
  setCanClear: function(canClear) {
    this.setState({canClear: canClear});
  },

  execCommand: function(command) {
    var that = this;

    return function() {
      that[command]();
    };
  },

  addStream: function (stream) {
    if (stream.peerjid) {
      var participantId = 'participant_' + Strophe.getResourceFromJid(stream.peerjid),
          participant = {},
          newState = {};

      participant[participantId] = this.state.participants[participantId] || {};
      

      if(stream.type==="Video") {
        participant[participantId].video = stream;        

        if(this.state.largeVideo.userJid === stream.peerjid) {
          newState.largeVideo = this.changeLargeVideoTo(this.state.participants[participantId], true);
        }

        newState.participants = _.assign(this.state.participants, participant);
        this.setState(newState);
      } 

      if(stream.type==="Audio") {
        participant[participantId].audio = stream;
        this.setState({participants: _.assign(this.state.participants, participant)});
      }
    } else {
      var id = stream.getOriginalStream().id;

      if (id !== 'mixedmslabel'&& id !== 'default') {
        console.error('can not associate stream', id, 'with a participant');
        return;
      }
    }
  },

  changeVideoType: function(jid) {
    if(jid) {
      var participantId = 'participant_' + Strophe.getResourceFromJid(jid),
          participants = this.state.participants;

      participants[participantId].isScreen = APP.RTC.isVideoSrcDesktop(jid);

      this.setState({participants: participants});
    }
  },

  changeDominantSpeaker: function(resourceJid) {
    if (resourceJid === APP.xmpp.myResource()) {
      return;
    } else {      
      var newSpeaker = 'participant_' + resourceJid;

      if(this.state.participants[newSpeaker] && !this.state.pinnedParticipant) {
        this.changeLargeVideoTo(this.state.participants[newSpeaker]);
        this.setState({dominantSpeaker: newSpeaker, previousDominantSpeaker: this.state.dominantSpeaker});
      }
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
    var newParticipant = {};
    
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
      participant[participantId].displayName = newName;

      this.setState({participants: _.assign(this.state.participants, participant)});
    }
  },

  deleteParticipant: function(jid) {
    this.setState({participants: _.omit(this.state.participants, 
      'participant_' + Strophe.getResourceFromJid(jid))});

    if(this.state.largeVideo.userJid === jid) {
      if(this.state.dominantSpeaker && this.state.participants[this.state.dominantSpeaker]) {
        this.changeLargeVideoTo(this.state.participants[this.state.dominantSpeaker]);
      } else 
      if(this.state.previousDominantSpeaker && this.state.participants[this.state.previousDominantSpeaker]) {
        this.changeLargeVideoTo(this.state.participants[this.state.previousDominantSpeaker]);
      } else {
        this.changeLargeVideoTo(this.state.local);
      }
      this.setState({pinnedParticipant: null});
    }
  },

  updateAudioLevel: function(jid, audioLevel) {
    if (jid === APP.xmpp.myJid() || jid === 'local') {
      var newLocal = this.state.local;

      if(this.state.callControlToggles.micMute) {
        newLocal.audioLevel = 0;
      } else {
        newLocal.audioLevel = audioLevel;
      }

      this.setState({local: newLocal});
    } 
    else {
      var participantId = 'participant_' + Strophe.getResourceFromJid(jid);  
      var participant = {};
      
      if(this.state.participants[participantId]) {
        participant[participantId] = this.state.participants[participantId];
        participant[participantId].audioLevel = audioLevel;

        this.setState({participants: _.assign(this.state.participants, participant)});
      }
    }
  },

  pinParticipant: function(jid) {
    if(this.state.pinnedParticipant === jid) {
      this.setState({pinnedParticipant: null});
      if(this.state.dominantSpeaker && this.state.participants[this.state.dominantSpeaker]) {
        this.changeLargeVideoTo(this.state.participants[this.state.dominantSpeaker]);
      }
    } 
    else if(jid==='local') {
      this.changeLargeVideoTo(this.state.local);
      this.setState({pinnedParticipant: 'local'});
    } 
    else {
      var participantId = 'participant_' + Strophe.getResourceFromJid(jid);

      if(this.state.participants[participantId]) {
        this.changeLargeVideoTo(this.state.participants[participantId]);
        this.setState({pinnedParticipant: jid});
      }
    }
  },

  isParticipantActive: function(jid) {
    if (jid === 'local') {
      return this.state.largeVideo.userJid === jid && _.keys(this.state.participants).length > 0;
    } else {
        return this.state.largeVideo.userJid === jid;
    }
  },

  isParticipantPinned: function(jid) {
    return this.state.pinnedParticipant === jid;
  },

  shouldFlipVideo: function() {
    return this.state.largeVideo.userJid === "local" && !this.state.local.isScreen;
  },

  renderPresentation: function() {
    return <Presentation ref="presentation" largeVideo={this.state.largeVideo.stream}
                         isScreen={this.state.largeVideo.isScreen}
                         local={this.state.local}
                         shouldFlipVideo={this.shouldFlipVideo()}
                         collaborationToolsToggle={this.state.collaborationToolsToggle}
                         sendCommand={this.sendCommand} participants={this.state.participants} 
                         hasUndo={this.state.hasUndo}
                         setHasUndo={this.setHasUndo}
                         canClear={this.state.canClear}
                         setCanClear={this.setCanClear} />;
  },

  renderParticipants: function() {
    return (<Participants 
              participants={this.state.participants}
              local={this.state.local}
              isParticipantActive={this.isParticipantActive}
              isParticipantPinned={this.isParticipantPinned}
              pinParticipant={this.pinParticipant}
            ></Participants>);
  },

  render: function() {
    return (
      <div>
        <Header></Header>
        {this.renderPresentation()}
        {this.renderParticipants()}
        <Discussions></Discussions>
        <Footer execCommand={this.execCommand} callControlToggles={this.state.callControlToggles} collaborationToolsToggle={this.state.collaborationToolsToggle} hasUndo={this.state.hasUndo} canClear={this.state.canClear}></Footer>
      </div>
    );
  }
});

module.exports = Container;