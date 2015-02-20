"use strict";

var React = require('react');

var Audio = React.createClass({
  propTypes: {
    muteAudio: React.PropTypes.bool
  },

  componentDidMount: function() {
    this.setup();
  },

  componentDidUpdate: function(prevProps) {
    if(this.props.stream !== prevProps.stream) {
      this.setup();
    }
  },

  setup: function () {
    var audioNode = this.refs.audio.getDOMNode();
    APP.RTC.attachMediaStream($(audioNode), this.props.stream.getOriginalStream());
    if (this.props.muteAudio) {
      audioNode.volume = 0;
    };
  },

  render: function() {
    return (
      <audio ref="audio" autoPlay="true"></audio>
    );
  }

});

module.exports = Audio;