"use strict";

var React = require('react/addons');

var Presentation = React.createClass({

  componentDidMount: function() {
    this.setup();
  },

  componentDidUpdate:  function(prevProps) {
    this.setup();
  },

  shouldComponentUpdate: function (nextProps, nextState) {
    return this.props.largeVideo !== nextProps.largeVideo || this.props.isScreen !== nextProps.isScreen || this.props.largeVideo.videoType !== nextProps.largeVideo.videoType;
  },

  componentWillUnmount: function() {
    this.cleanUp();
  },

  setup: function () {
    var videoNode = this.refs.largeVideo.getDOMNode();
    APP.RTC.attachMediaStream($(videoNode), this.props.largeVideo.getOriginalStream());
    $(videoNode).on('loadedmetadata', this.invokePositionLarge);
  },
  
  cleanUp: function () {
    var videoNode = this.refs.largeVideo.getDOMNode();    
    $(videoNode).off('loadedmetadata', this.invokePositionLarge);
    $(videoNode).off('resize', this.resizeHandler);
    clearTimeout(this.resizeTimer);
  },

  invokePositionLarge: function() {
    var videoNode = this.refs.largeVideo.getDOMNode(),
        that = this;
    
    this.positionLarge(videoNode.videoWidth, videoNode.videoHeight);
    
    this.resizeHandler = function() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(that.invokePositionLarge, 1000);
    };
    
    $(window).on('resize', this.resizeHandler);
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

  getDesktopVideoSize: function(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight) {
    var aspectRatio = videoWidth / videoHeight;
    var availableWidth = Math.max(videoWidth, videoSpaceWidth);
    var availableHeight = Math.max(videoHeight, videoSpaceHeight);

    if (availableWidth / aspectRatio >= videoSpaceHeight) {
      availableHeight = videoSpaceHeight;
      availableWidth = availableHeight * aspectRatio;
    }

    if (availableHeight * aspectRatio >= videoSpaceWidth) {
      availableWidth = videoSpaceWidth;
      availableHeight = availableWidth / aspectRatio;
    }

    return [availableWidth, availableHeight];
  },

  getCameraVideoPosition: function(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight) {
    var isFullScreen = document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    if (isFullScreen) {
      videoSpaceHeight = window.innerHeight-100;
    }

    var horizontalIndent = (videoSpaceWidth - videoWidth) / 2;
    var verticalIndent = (videoSpaceHeight - videoHeight) / 2;

    return [horizontalIndent, verticalIndent];
  },

  getDesktopVideoPosition: function(videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight) {
    var horizontalIndent = (videoSpaceWidth - videoWidth) / 2;
    var verticalIndent = 0;
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
    var isScreen = this.props.largeVideo.videoType === 'screen' || this.props.isScreen;
    var videoSpaceHeight = isScreen ? $(this.refs.videoSpace.getDOMNode()).outerHeight() : window.innerHeight;
    var videoSize = this[isScreen ? 'getDesktopVideoSize': 'getCameraVideoSize'](videoWidth, videoHeight, videoSpaceWidth, videoSpaceHeight);
    var largeVideoWidth = videoSize[0];
    var largeVideoHeight = videoSize[1];
    var videoPosition = this[isScreen ? 'getDesktopVideoPosition': 'getCameraVideoPosition'](largeVideoWidth, largeVideoHeight, videoSpaceWidth, videoSpaceHeight);
    var horizontalIndent = videoPosition[0];
    var verticalIndent = videoPosition[1];

    this.positionVideo($(this.refs.largeVideo.getDOMNode()), largeVideoWidth, largeVideoHeight, horizontalIndent, verticalIndent);
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