"use strict";

var React = require('react/addons');

var Video = require("./video.jsx")
var Audio = require("./audio.jsx");

var Participant = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
    local: React.PropTypes.bool,
    isActive: React.PropTypes.bool,
  },

  getInitialState: function () {
    var state = {};
    if(this.props.participant.stream) {
      if(this.props.participant.stream.type=="Video") {
        state.video = this.props.participant.stream;
      } 

      if(this.props.participant.stream.type=="Audio") {
        state.audio = this.props.participant.stream;
      }
    } else {
      if(this.props.participant.video) {
        state.video = this.props.participant.video
      }

      if(this.props.participant.audio) {
        state.audio = this.props.participant.audio
      }
    }
    return state;
  },

  componentWillReceiveProps: function(newProps) {
    var newState = {};
    if(newProps.participant.stream) {
      if(newProps.participant.stream.type=="Video") {
        newState.video = newProps.participant.stream;
      }

      if(newProps.participant.stream.type=="Audio") {
        newState.audio = newProps.participant.stream;
      }
    } else {
      if(this.props.participant.video) {
        newState.video = this.props.participant.video
      }

      if(this.props.participant.audio) {
        newState.audio = this.props.participant.audio
      }
    }

    this.setState(newState);
  },

  renderVideo: function() {
    if(this.state.video) {
      return <Video stream={this.state.video} shouldFlipVideo={this.props.local}/>
    }
  },

  renderAudio: function() {
    if(this.state.audio) {
      return <Audio stream={this.state.audio} muteAudio={this.props.local}/>;
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