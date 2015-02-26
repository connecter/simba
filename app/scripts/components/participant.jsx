"use strict";

var React = require('react/addons');

var Video = require("./video.jsx"),
    AudioComponent = require("./audio.jsx"),
    AudioLevel = require("./audioLevel.jsx");

var Participant = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
    local: React.PropTypes.bool,
    pinParticipant: React.PropTypes.func.isRequired,
    isPinned: React.PropTypes.bool,
    isActive: React.PropTypes.bool,
  },

  onClickHandler: function() {
    this.props.pinParticipant(this.props.participant.jid);
  },

  renderVideo: function() {
    if(this.props.participant.video && !this.props.participant.isScreen) {
      return <Video stream={this.props.participant.video} shouldFlipVideo={this.props.local && !this.props.participant.isScreen} />;
    }
  },

  renderAudio: function() {
    if(this.props.participant.audio) {
      return <AudioComponent stream={this.props.participant.audio} muteAudio={this.props.local}/>;
    }
  },

  renderAudioLevel: function() {
    if(this.props.participant.audioLevel) {
      return <AudioLevel audioLevel={this.props.participant.audioLevel} />;
    }
  },

  render: function() {
    var cx = React.addons.classSet;
    var participantClasses = cx({
          'is-pinned': this.props.isPinned,
          'is-screenshare': this.props.participant.isScreen
        }),  
        
        participantNameClasses = cx({
          'on-top': this.props.isActive
        });

    return (
      <div className={"participant " + participantClasses} onClick={this.onClickHandler}>
        {this.renderAudio()}
        {this.renderVideo()}
        {this.renderAudioLevel()}
        <div className={"participant-name-wrap " + participantNameClasses}>
          <div className="participant-name">
            <span>{this.props.participant.displayName || (this.props.local ? 'You' : 'Someone')}</span>
          </div>
        </div>
      </div>  
    );
  }
});

module.exports = Participant;