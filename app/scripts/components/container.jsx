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
    return {participants: {}, largeVideo: {stream: null, userJid: null}, dominantSpeaker: null};
  },

  changeLocalAudio: function(stream) {
    this.setState({localAudio: stream});
  },

  changeLocalVideo: function(stream) {
    var newState = {localVideo: stream};

    if(this.state.largeVideo.userJid===null) {
      newState.largeVideo = {stream: stream, userJid: APP.xmpp.myResource()};
    }
    this.setState(newState);
  },

  onRemoteStreamAdded: function (stream) {    
    if (stream.peerjid) {
      var newParticipant = {}
      newParticipant['participant_' + Strophe.getResourceFromJid(stream.peerjid)] = {stream: stream}
      this.setState({participants: _.assign(this.state.participants, newParticipant)});
    } else {  
      var id = stream.getOriginalStream().id;
      if (id !== 'mixedmslabel'&& id !== 'default') {
        console.error('can not associate stream', id, 'with a participant'); 
        return; 
      }
    }
  },

  onDominantSpeakerChanged: function(resourceJid) {
    if (resourceJid === APP.xmpp.myResource()) {
      return;
    } else {
      var newSpeaker = 'participant_' + resourceJid;
      var newState = {dominantSpeaker: newSpeaker}
      if(this.state.participants[newSpeaker]) {
        newState.largeVideo = {userJid: resourceJid, stream: this.state.participants[newSpeaker].stream};
      }
      this.setState(newState);
    }
  },

  getLargeVideoState: function() {
    return this.state.largeVideo;
  },

  renderPresentation: function() {
    if(this.state.largeVideo.stream) {
      return (
        <Presentation largeVideo={this.state.largeVideo.stream}></Presentation>
      );
    }
  },
  
  renderParticipants: function() {
    if(this.state.localAudio && this.state.localVideo) {
      return (<Participants participants={this.state.participants} local={{video:this.state.localVideo, audio: this.state.localAudio}}></Participants>)
    }
  },

  render: function() {
    return (
      <div>
        <Header></Header>
        {this.renderPresentation()}
        {this.renderParticipants()}
        <Discussions></Discussions>
        <Footer></Footer>
      </div>
    );
  }
});

module.exports = Container;