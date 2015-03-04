"use strict";

var React = require('react/addons'),
    _ = require('lodash');  

var  LargeVideo = require('./largeVideo'),
    Whiteboard = require('./whiteboard');

var Presentation = React.createClass({
  propTypes: {
    largeVideo: React.PropTypes.object.isRequired,
    isScreen: React.PropTypes.bool.isRequired,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    shouldFlipVideo: React.PropTypes.bool,
    participants: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      dimensions: {
        width: 'auto',
        height: 'auto'
      },
      whiteboard: {}
    };
  },

  getPresentationSpaceDOMNode: function() {
    return this.refs.presentationSpace.getDOMNode();
  },

  setDimensions: function(dimensions) {
    this.setState({dimensions: dimensions});
  },

  interceptSendingCommands: function() {
    return {
      updatePath: this.interceptUpdatePath
    };
  },

  interceptReceivingCommands: function() {
    return {
      updatePath: this.interceptUpdatePath
    };
  },

  processCommand: function() {
    if(this.interceptReceivingCommands()[arguments[1]]) {
       this.interceptReceivingCommands()[arguments[1]].apply(this, arguments);
    }

    if(this.refs[arguments[0]]) {
      this.refs[arguments[0]]
          .processCommand
          .apply(this.refs[arguments[0]], Array.prototype.slice.call(arguments,1));
    }
  },

  sendCommand: function() {
    if(this.interceptSendingCommands()[arguments[1]]) {
     this.interceptSendingCommands()[arguments[1]].apply(this, arguments);
    }
    
    this.props.sendCommand.apply(this, arguments);
  },

  interceptUpdatePath: function(whiteboardId, commandName, resourceJid, path) {
    var newWhiteboardState = {};

    newWhiteboardState[whiteboardId] = this.state.whiteboard[whiteboardId]  || {};
    newWhiteboardState[whiteboardId][resourceJid] = newWhiteboardState[whiteboardId][resourceJid] || [];
    newWhiteboardState[whiteboardId][resourceJid].push(path);
    
    this.setState({whiteboard: _.assign(this.state.whiteboard, newWhiteboardState)});
  },

  renderWhiteboard: function() {
    var whiteboardId = 'wb_' + this.props.largeVideo.stream.id.replace('-', '_');
    
    return <Whiteboard
              id={whiteboardId}
              ref={whiteboardId}
              dimensions={this.state.dimensions} 
              collaborationToolsToggle={this.props.collaborationToolsToggle} 
              sendCommand={this.sendCommand}
              participants={this.props.participants} 
              whiteboardData={this.state.whiteboard[whiteboardId]} />;
  },

  render: function() {
    return (
      <section className="presentation row" ref="presentationSpace">
        {this.renderWhiteboard()}
        <LargeVideo largeVideo={this.props.largeVideo}
                    isScreen={this.props.isScreen}
                    getPresentationSpaceDOMNode={this.getPresentationSpaceDOMNode}
                    setDimensions={this.setDimensions}
                    shouldFlipVideo={this.props.shouldFlipVideo} />
      </section>
    );
  }
});

module.exports = Presentation;