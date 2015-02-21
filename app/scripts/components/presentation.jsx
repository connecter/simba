"use strict";

var React = require('react/addons');

var Presentation = React.createClass({

  componentDidMount: function() {
    this.setup();
  },

  componentDidUpdate: function(prevProps) {
    if(this.props.largeVideo !== prevProps.largeVideo) {
      this.setup();
    }
  },

  componentWillUnmount: function() {
    this.cleanUp();
  },

  componentWillUpdate: function(prevProps) {
    if(this.props.largeVideo !== prevProps.largeVideo) {
      this.setup();
    }
  },

  setup: function () {
    var videoNode = this.refs.largeVideo.getDOMNode();
    APP.RTC.attachMediaStream($(videoNode), this.props.largeVideo.getOriginalStream());
    $(videoNode).on('loadedmetadata', this.invokePositionLarge);
  },
  
  cleanUp: function () {
    var videoNode = this.refs.largeVideo.getDOMNode();    
    $(videoNode).off('loadedmetadata', this.invokePositionLarge);
  },

  invokePositionLarge: function() {
    var videoNode = this.refs.largeVideo.getDOMNode();
    this.positionLarge(videoNode.videoWidth, videoNode.videoHeight);
  },

  getCameraVideoSize: function(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight) {
    var aspectRatio = videoWidth / videoHeight;
    var availableWidth = Math.max(videoWidth, videoSpaceWidth);
    var availableHeight = Math.max(videoHeight, videoSpaceHeight);

    if (availableWidth / aspectRatio < videoSpaceHeight) {
      availableHeight = videoSpaceHeight;
      availableWidth = availableHeight * aspectRatio;
    }

    if (availableHeight * aspectRatio < videoSpaceWidth) {
      availableWidth = videoSpaceWidth;
      availableHeight = availableWidth / aspectRatio;
    }

    return [availableWidth, availableHeight];
  },

  getCameraVideoPosition: function(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight) {
    var isFullScreen = document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    if (isFullScreen)
      videoSpaceHeight = window.innerHeight-100;

    var horizontalIndent = (videoSpaceWidth - videoWidth) / 2;
    var verticalIndent = (videoSpaceHeight - videoHeight) / 2;

    return [horizontalIndent, verticalIndent];
  },

  positionVideo: function(video, width, height, horizontalIndent, verticalIndent) {  
    video.width(width);
    video.height(height);
    video.css({  top: verticalIndent + 'px',
      bottom: verticalIndent + 'px',
      left: horizontalIndent + 'px',
      right: horizontalIndent + 'px',
      position: "absolute"
    });
  },

  positionLarge: function (videoWidth, videoHeight) {
    var videoSpaceWidth = $(this.refs.videoSpace.getDOMNode()).width();
    var videoSpaceHeight = window.innerHeight;
    var videoSize = this.getCameraVideoSize(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight);
    var largeVideoWidth = videoSize[0];
    var largeVideoHeight = videoSize[1];
    var videoPosition = this.getCameraVideoPosition(largeVideoWidth, largeVideoHeight, videoSpaceWidth, videoSpaceHeight);
    var horizontalIndent = videoPosition[0];
    var verticalIndent = videoPosition[1];

    this.positionVideo($(this.refs.largeVideo.getDOMNode()), largeVideoWidth, largeVideoHeight, horizontalIndent, verticalIndent)
  },

  render: function() {
     var cx = React.addons.classSet;
     var videoClasses = cx({
      'flip-x': this.props.shouldFlipVideo
    });
    return (
      <section className="presentation row" ref="videoSpace">
        <video ref="largeVideo" autoPlay="true" className={videoClasses}></video>
      </section>
    );
  }

});

module.exports = Presentation;