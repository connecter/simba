"use strict";

var React = require('react');

var Video = require("./video.jsx")
var Audio = require("./audio.jsx");

var Participant = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
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
    }

    if(newProps.participant.displayName) {
      newState.displayName = newProps.participant.displayName;
    }

    this.setState(newState);
  },

  renderVideo: function() {
    if(this.state.video) {
      return <Video stream={this.state.video} />
    }
  },

  renderAudio: function() {
    if(this.state.audio) {
      return <Audio stream={this.state.audio} />;
    }
  },

  render: function() {
    return (
      <div className="participant">
        <div className="participant-name">{this.props.participant.displayName}</div>
        {this.renderAudio()}
        {this.renderVideo()}
      </div>  
    );
  }
});

module.exports = Participant;