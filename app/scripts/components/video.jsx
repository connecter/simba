"use strict";

var React = require('react');

var Video = React.createClass({

  componentDidMount: function() {
    this.setup();
  },

  componentDidUpdate: function() {
    this.setup();
  },

  setup: function () {
    var videoNode = this.refs.video.getDOMNode();
    APP.RTC.attachMediaStream($(videoNode), this.props.stream.getOriginalStream());
  },

  render: function() {
    return (
      <video ref="video" autoPlay="true"></video>
    );
  }

});

module.exports = Video;