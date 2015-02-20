"use strict";

var React = require('react');

var Audio = React.createClass({

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
  },

  render: function() {
    return (
      <audio ref="audio" autoPlay="true"></audio>
    );
  }

});

module.exports = Audio;