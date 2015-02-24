'use strict';

var React = require('react'),
    _ = require('lodash');

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
      local: {jid:'local'},
      callControlToggleStates: {}
    };
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
    }
  },

  changeLocalVideo: function(stream) {
    var newState = {local:this.state.local},
        that = this;

    newState.local[stream.videoType] = stream;

    if(this.state.largeVideo.userJid===null || this.state.largeVideo.userJid==='local') {
      var isScreen = (stream.videoType==='screen')
      this.changeLargeVideoTo(newState.local, isScreen);
    }

    this.setState(newState);

    stream.getOriginalStream().onended = function() {
      var newState =that.state.local;
      
      newState[stream.videoType] = null;
     that.setState({local: newState});
    }
  },
  
  changeLargeVideoTo: function(participant, toScreen) {
    if(!participant.videoMute || toScreen) {
      var newState = {}
      newState.largeVideo = {
        userJid: participant.jid,
        stream: participant[toScreen ? 'screen' : 'video']
      }
      this.setState(newState);
    }
  },

  setLocalName: function(nickname) {
    var newLocal = this.state.local
        
    newLocal.displayName = nickname;
    this.setState({local: newLocal});
  },

  toggleVideo: function() {
    var that = this;

    APP.xmpp.setVideoMute(!this.state.callControlToggleStates.videoMute, function() {
      var newLocal = this.state.local;
    
      newLocal.videoMute = !that.state.callControlToggleStates.videoMute;
      that.setState({callControlToggleStates: _.assign(that.state.callControlToggleStates,
        {videoMute: !that.state.callControlToggleStates.videoMute}), local:newLocal});
    });
  },

  toggleAudio: function() {
    var that = this;

    APP.xmpp.setAudioMute(!this.state.callControlToggleStates.micMute, function() {
      that.setState({callControlToggleStates: _.assign(that.state.callControlToggleStates,
        {micMute: !that.state.callControlToggleStates.micMute})});
    });
  },

  toggleScreenshare: function() {
     APP.desktopsharing.toggleScreenSharing();
     this.setState({callControlToggleStates: _.assign(this.state.callControlToggleStates,
        {screenStream: !this.state.callControlToggleStates.screenStream})});
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
    var that = this,
        findVideoType = function() {
          window.setTimeout(function() {
            if(stream.videoType) {
              participant[participantId][stream.videoType] = stream;
              that.setState({participants: _.assign(that.state.participants, participant)});

              if(that.isParticipantActive(Strophe.getResourceFromJid(stream.peerjid))) {
                that.changeLargeVideoTo(this.state.participants[newSpeaker], (stream.videoType==='screen'));
              }

              stream.getOriginalStream().onended = function() {
                participant[participantId][stream.videoType] = null;
                that.setState({participants: _.assign(that.state.participants, participant)});                
              }
            } else {
              findVideoType();
            }
          }, 0);
        }

    if (stream.peerjid) {
      var participantId = 'participant_' + Strophe.getResourceFromJid(stream.peerjid),
          participant = {},
          that = this;

      participant[participantId] = this.state.participants[participantId] || {}
      
      if(stream.type==="Video") {
        if(stream.videoType) {
          participant[participantId][stream.videoType] = stream;
          this.setState({participants: _.assign(that.state.participants, participant)});
        } else {
          findVideoType();
        }
      } 

      if(stream.type=="Audio") {
        participant[participantId].audio = stream;
        this.setState({participants: _.assign(that.state.participants, participant)});
      }


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

      if(this.state.participants[newSpeaker] && !this.state.pinnedParticipant) {
        this.changeLargeVideoTo(this.state.participants[newSpeaker], this.state.participants[newSpeaker].screen);
        this.setState({dominantSpeaker: newSpeaker});
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

  updateAudioLevel: function(jid, audioLevel) {
    if (jid === APP.xmpp.myJid() || jid === 'local') {
      var newLocal = this.state.local;

      if(this.state.callControlToggleStates.micMute) {
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
        this.changeLargeVideoTo(this.state.participants[participantId], this.state.participants[participantId].screen);
        this.setState({pinnedParticipant: jid});
      }
    }
  },

  isParticipantActive: function(jid) {
    if (jid === 'local') {
      return this.state.localName && this.state.largeVideo.userJid === jid && _.keys(this.state.participants).length > 0;
    } else {
      return this.state.largeVideo.userJid === jid;
    }
  },

  isParticipantPinned: function(jid) {
    return this.state.pinnedParticipant === jid;
  },

  shouldFlipVideo: function() {
    return this.state.largeVideo.userJid === "local" && this.state.largeVideo.stream.videoType !='screen';
  }, 

  renderPresentation: function() {
    if(this.state.largeVideo.stream) {
      return (
        <Presentation largeVideo={this.state.largeVideo.stream} shouldFlipVideo={this.shouldFlipVideo()}></Presentation>
      );
    }
  },

  renderParticipants: function() {
    return (<Participants 
              participants={this.state.participants}
              local={this.state.local}
              isParticipantActive={this.isParticipantActive}
              isParticipantPinned={this.isParticipantPinned}
              pinParticipant={this.pinParticipant}
            ></Participants>)
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