"use strict";

var React = require('react/addons');

var Video = require("./video.jsx"),
    Audio = require("./audio.jsx"),
    AudioLevel = require("./audioLevel.jsx");

var Participant = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
    local: React.PropTypes.bool,
    isActive: React.PropTypes.bool,
  },

  renderVideo: function() {
    if(this.props.participant.video) {
      return <Video stream={this.props.participant.video} shouldFlipVideo={this.props.local}/>
    }
  },

  renderAudio: function() {
    if(this.props.participant.audio) {
      return <Audio stream={this.props.participant.audio} muteAudio={this.props.local}/>;
    }
  },

  renderAudioLevel: function() {
    if(this.props.participant.audioLevel) {
      return <AudioLevel audioLevel={this.props.participant.audioLevel} />
    }
  },

  render: function() {
    var cx = React.addons.classSet;
    var participantNameClasses = cx({
      'on-top': this.props.isActive
    });

    return (
      <div className="participant">
        {this.renderAudio()}
        {this.renderVideo()}
        {this.renderAudioLevel()}
        <div className={"participant-name-wrap " + participantNameClasses}>
          <div className="participant-name">
            <span>{this.props.participant.displayName}</span>
          </div>
        </div>
      </div>  
    );
  }
});

module.exports = Participant;