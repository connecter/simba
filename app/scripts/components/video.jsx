"use strict";

var React = require('react/addons');

var Video = React.createClass({

  propTypes: {
    shouldFlipVideo: React.PropTypes.bool
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
    var videoNode = this.refs.video.getDOMNode();
    APP.RTC.attachMediaStream($(videoNode), this.props.stream.getOriginalStream());
  },

  render: function() {
    var cx = React.addons.classSet;
    var videoClasses = cx({
      'flip-x': this.props.shouldFlipVideo
    });
    
    return (
      <video ref="video" className={videoClasses} autoPlay="true"></video>
    );
  }

});

module.exports = Video;