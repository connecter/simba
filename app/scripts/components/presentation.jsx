"use strict";

var React = require('react/addons'),
    _ = require('lodash');  

var  LargeVideo = require('./largeVideo'),
    Whiteboard = require('./whiteboard'),
    UndoManager = require('../modules/UndoManager');

var Presentation = React.createClass({
  propTypes: {
    largeVideo: React.PropTypes.object,
    isScreen: React.PropTypes.bool,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    shouldFlipVideo: React.PropTypes.bool,
    participants: React.PropTypes.object.isRequired,
    local: React.PropTypes.object.isRequired,
    hasUndo: React.PropTypes.number.isRequired,
    setHasUndo: React.PropTypes.func.isRequired,
    canClear: React.PropTypes.bool.isRequired,
    setCanClear: React.PropTypes.func.isRequired
  },

  getInitialState: function () {
    var initialState = {
      dimensions: {
        width: 'auto',
        height: 'auto'
      },
      whiteboards: {},
      whiteboardsCache: {},
      undoManagers: {}
    };

    if(this.props.largeVideo && this.props.largeVideo.stream) {
      initialState = _.assign(initialState, {
        currentWhiteboardId: this.props.largeVideo.stream.id.replace('-', '_')
      });
    }

    this.prevCommand = [];

    return initialState;
  },


  componentDidUpdate: function (prevProps, prevState) {

    if(this.props.largeVideo && this.props.largeVideo.stream) {
      if(this.state.currentWhiteboardId !== this.props.largeVideo.stream.id.replace('-', '_')) {
        this.setState({currentWhiteboardId: this.props.largeVideo.stream.id.replace('-', '_')});
      }
    } else if(this.state.currentWhiteboardId) {
      this.setState({currentWhiteboardId: null});
    }

    if(this.state.undoManagers[this.state.currentWhiteboardId] && (this.state.undoManagers[this.state.currentWhiteboardId].hasUndo() !== this.props.hasUndo)) {
      this.props.setHasUndo(this.state.undoManagers[this.state.currentWhiteboardId].hasUndo());
    } else if(!this.state.undoManagers[this.state.currentWhiteboardId] && this.props.hasUndo) {
      this.props.setHasUndo(0);
    }

    var resourceJid = APP.xmpp.myResource(),
        whiteboardId = this.state.currentWhiteboardId,
        whiteboards = this.state.whiteboards,
        canClear;

    if(!_.isEmpty(whiteboards[whiteboardId])) {
      canClear = true;
    } else {
      canClear = false;
    }

    if(canClear !== this.props.canClear) {
      this.props.setCanClear(canClear);
    }
  }, 

  getPresentationSpaceDOMNode: function() {
    return this.refs.presentationSpace.getDOMNode();
  },

  setDimensions: function(dimensions) {
    this.setState({dimensions: dimensions});
  },

  interceptReceivingCommands: function() {
    return {
      syncPath: this.interceptSyncPath,
      syncText: this.interceptSyncText,
      removeObject: this.interceptRemoveObject,
      clearWhiteboard: this.cacheAndClear,
      undoClear: this.restoreFromCache
    };
  },

  interceptSendingCommands: function() {
    return {
      syncPath: this.generateUndoSyncPath,
      syncText: this.generateUndoSyncText
    };
  },

  undo: function() {
    if(this.state.undoManagers[this.state.currentWhiteboardId] && this.state.undoManagers[this.state.currentWhiteboardId].hasUndo()) {
      this.state.undoManagers[this.state.currentWhiteboardId].undo();
      this.props.setHasUndo(this.state.undoManagers[this.state.currentWhiteboardId].hasUndo());
    }
  },

  snapshot: function() {
    var markup, video, snapshotCanvas, drawContext, dimensions, videoScale, a, width, height, dWidth;

    if(this.props.largeVideo) {
      video = this.refs.largeVideoContainer.refs.largeVideo.getDOMNode();
      
      if(this.state.currentWhiteboardId && this.state.whiteboards[this.state.currentWhiteboardId]) {
        markup = this.refs[this.state.currentWhiteboardId].refs.canvas.getDOMNode();
      }

      snapshotCanvas = document.createElement('canvas');
      drawContext = snapshotCanvas.getContext('2d');
      
      dimensions = this.state.dimensions;

      if(video) {
        videoScale = {
          width: dimensions.width / video.videoWidth,
          height: dimensions.height / video.videoHeight
        };

        width = dWidth = dimensions.width + dimensions.left + dimensions.right;
        height = dimensions.height + dimensions.top + dimensions.bottom - 60;

        snapshotCanvas.width = width;
        snapshotCanvas.height = height;

        if(this.props.shouldFlipVideo) {
          drawContext.save();
          drawContext.scale(-1, 1);
          dWidth = dWidth * -1;
        }

        drawContext.drawImage(video,
          -dimensions.left / videoScale.width,
          -dimensions.top / videoScale.height,
          width / videoScale.width,
          height / videoScale.height,
          0,
          0,
          dWidth,
          height
        );
      }


      if(this.props.shouldFlipVideo) {
        drawContext.restore();
        dWidth = dWidth * -1;
      }

      if(markup) {
        drawContext.drawImage(markup,
          -dimensions.left,
          -dimensions.top,
          width,
          height,
          0,
          0,
          dWidth,
          height
        );
      }

      var now = new Date();

      a = document.createElement('a');
      a.download = "Connecter.io " + now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
      a.href = snapshotCanvas.toDataURL();
      a.click();
    }
  },

  clear: function() {
    this.sendCommand(this.state.currentWhiteboardId, 'clearWhiteboard');
  },

  cacheAndClear: function(whiteboardId, commandName) {
    if(this.state.whiteboards[whiteboardId]) {
      var whiteboards = this.state.whiteboards,
          whiteboardsCache = this.state.whiteboardsCache;

      whiteboardsCache[whiteboardId] = whiteboardsCache[whiteboardId] || [];
      whiteboardsCache[whiteboardId].push(this.state.whiteboards[whiteboardId]);
      this.state.whiteboards[whiteboardId] = {};
      this.setState({whiteboards: whiteboards, whiteboardsCache: whiteboardsCache});
      
      if(this.refs[whiteboardId]) {
        this.refs[whiteboardId].renderFromData();
      }

      this.generateUndoClear(whiteboardId, commandName);
    }
  },

  restoreFromCache: function(whiteboardId, commandName) {
    var whiteboards = this.state.whiteboards,
        whiteboardsCache = this.state.whiteboardsCache;

    whiteboardsCache = this.state.whiteboardsCache;
    whiteboardsCache[whiteboardId] = whiteboardsCache[whiteboardId] || [];
    whiteboards[whiteboardId] = _.assign(whiteboards[whiteboardId], whiteboardsCache[whiteboardId].pop());
    this.setState({whiteboards: whiteboards, whiteboardsCache: whiteboardsCache});
    
    if(this.refs[whiteboardId]) {
        this.refs[whiteboardId].renderFromData();
    }
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
    
    this.prevCommand = arguments;
    
    this.props.sendCommand.apply(this, arguments);
  },

  interceptSyncPath: function(whiteboardId, commandName, path, color) {
    var whiteboards = this.state.whiteboards;

    whiteboards[whiteboardId] = whiteboards[whiteboardId] || {};

    if(whiteboards[whiteboardId][path.id]) {
      if(whiteboards[whiteboardId][path.id].points.length < path.length) {
        _.forEach(path.points, function(point) {
          whiteboards[whiteboardId][path.id].points.push(point);
        });
        whiteboards[whiteboardId][path.id].length = path.length;
      }
    } else {
      whiteboards[whiteboardId][path.id] = _.cloneDeep(path);
    }

    whiteboards[whiteboardId][path.id].color = color;

    if(this.refs[whiteboardId] &&
      this.refs[whiteboardId].processCommand && 
      whiteboards[whiteboardId][path.id].points.length) {
      var lastPoint = whiteboards[whiteboardId][path.id].points[whiteboards[whiteboardId][path.id].points.length - 1];
      this.refs[whiteboardId]
          .processCommand
          .call(this.refs[whiteboardId], 'syncPointer', path.owner, lastPoint.x, lastPoint.y, 'pen', color);
    }  
    
    this.setState({whiteboards: whiteboards});
  }, 

  interceptSyncText: function(whiteboardId, commandName, text, color) {
    var whiteboards = this.state.whiteboards;

    whiteboards[whiteboardId] = whiteboards[whiteboardId] || {};
    whiteboards[whiteboardId][text.id] = _.cloneDeep(text);
    whiteboards[whiteboardId][text.id].color = color;
    this.setState({whiteboards: whiteboards});
  },

  interceptRemoveObject: function(whiteboardId, commandName, id) {
    var whiteboards = this.state.whiteboards;
    delete whiteboards[whiteboardId][id];
    this.setState({whiteboards: whiteboards});
  },

  generateUndoSyncText: function(whiteboardId, commandName, text, color) {
    if(this.prevCommand[0] !== whiteboardId || this.prevCommand[1] !== commandName || this.prevCommand[2].id !== text.id) {
      var undoManagers = this.state.undoManagers,
          whiteboards = this.state.whiteboards;
      
      undoManagers[whiteboardId] = undoManagers[whiteboardId] || new UndoManager();

      if(whiteboards[whiteboardId] &&
        whiteboards[whiteboardId][text.id]) {
        var cachedText =  _.cloneDeep(whiteboards[whiteboardId][text.id]);
        undoManagers[whiteboardId].add(function() {
          var args = [whiteboardId, 'syncText', cachedText, color, true];
          this.props.sendCommand.apply(this, args);
          this.processCommand.apply(this, args);
        }.bind(this));
      } 
      else {
        undoManagers[whiteboardId].add(function() {
          var args = [whiteboardId, 'removeObject', text.id];
          this.props.sendCommand.apply(this, args);
          this.processCommand.apply(this, args);
        }.bind(this));
      }

      this.setState({undoManagers: undoManagers});
    }
  },

  generateUndoSyncPath: function(whiteboardId, commandName, path, color) {
    if(this.prevCommand[0] !== whiteboardId || this.prevCommand[1] !== commandName || this.prevCommand[2].id !== path.id) {
      var undoManagers = this.state.undoManagers;

      undoManagers[whiteboardId] = undoManagers[whiteboardId] || new UndoManager();

      undoManagers[whiteboardId].add(function() {
        this.props.sendCommand(whiteboardId, 'removeObject', path.id);
        this.processCommand(whiteboardId, 'removeObject', path.id);
      }.bind(this));

      this.setState({undoManagers: undoManagers});
    }
  },

  generateUndoClear: function(whiteboardId, commandName) {
    var undoManagers = this.state.undoManagers;

    undoManagers[whiteboardId] = undoManagers[whiteboardId] || new UndoManager();

    undoManagers[whiteboardId].add(function() {
      this.props.sendCommand(whiteboardId, 'undoClear');
    }.bind(this));

    this.setState({undoManagers: undoManagers});    
  },

  renderWhiteboard: function() {
    if(this.state.currentWhiteboardId) {
      return <Whiteboard
                id={this.state.currentWhiteboardId}
                ref={this.state.currentWhiteboardId}
                dimensions={this.state.dimensions} 
                collaborationToolsToggle={this.props.collaborationToolsToggle} 
                sendCommand={this.sendCommand}
                participants={this.props.participants} 
                whiteboardData={this.state.whiteboards[this.state.currentWhiteboardId]}
                local={this.props.local} />;
    }
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
                      shouldFlipVideo={this.props.shouldFlipVideo}
                      ref="largeVideoContainer" />
        </section>
      ); 
    }
    else {
      return <div />;
    }
  }
});

module.exports = Presentation;