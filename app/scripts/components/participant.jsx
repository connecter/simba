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
    console.log("Recieving props");
    console.log(this.props);
    if(this.props.participant.stream.type=="Video") {
      state.video = this.props.participant.stream;
    } 

    if(this.props.participant.stream.type=="Audio") {
      state.audio = this.props.participant.stream;
    }
    return state;
  },

  componentWillReceiveProps: function(newProps) {
    console.log("Recieving new props");
    console.log(newProps);
    var newState = {};
    if(newProps.participant.stream.type=="Video") {
      newState.video = newProps.participant.stream;
    }

    if(newProps.participant.stream.type=="Audio") {
      newState.audio = newProps.participant.stream;
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
    console.log("participant state")
    console.log(this.state)
    return (
      <div className="participant">
        {this.renderAudio()}
        {this.renderVideo()}
      </div>  
    );
  }
});

module.exports = Participant;