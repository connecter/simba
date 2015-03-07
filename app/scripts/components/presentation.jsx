"use strict";

var React = require('react/addons'),
    _ = require('lodash');  

var  LargeVideo = require('./largeVideo'),
    Whiteboard = require('./whiteboard');

var Presentation = React.createClass({
  propTypes: {
    largeVideo: React.PropTypes.object,
    isScreen: React.PropTypes.bool,
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
      whiteboards: {}
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

    if(this.refs[arguments[0]] && this.refs[arguments[0]].processCommand) {
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
    var whiteboards = this.state.whiteboards;

    whiteboards[whiteboardId] = whiteboards[whiteboardId] || {};
    whiteboards[whiteboardId][resourceJid] = whiteboards[whiteboardId][resourceJid] || {};   
    if(whiteboards[whiteboardId][resourceJid][path.id]) {
      if(whiteboards[whiteboardId][resourceJid][path.id].points.length < path.length) {
        _.forEach(path.points, function(point) {
          whiteboards[whiteboardId][resourceJid][path.id].points.push(point);
        });
        whiteboards[whiteboardId][resourceJid][path.id].length = path.length;
      }
    } else {
      whiteboards[whiteboardId][resourceJid][path.id] = _.cloneDeep(path);
    }
    
    this.setState({whiteboards: whiteboards});
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
              whiteboardData={this.state.whiteboards[whiteboardId]} />;
  },

  render: function() {
    if(this.props.largeVideo) {
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
    else {
      return <div />;
    }
  }
});

module.exports = Presentation;