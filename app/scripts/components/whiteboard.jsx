"use strict";

var React = require('react'),
    _ = require('lodash'),
    fabric = require('../vendor/fabric').fabric;


var MousePointer = require('./mousepointer');

var whiteboard = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    dimensions: React.PropTypes.object.isRequired,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    participants: React.PropTypes.object.isRequired,
    whiteboardData: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      pariticipantsWithPointers: {}
    };
  },

  componentDidMount: function () {
    this.canvas = new fabric.Canvas(this.refs.canvas.getDOMNode());
    window.o = this.canvas;
    fabric.Object.prototype.selectable = false;
    this.canvas.selection = false;
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.freeDrawingBrush.color = '#56c1e6';
    this.canvas.setWidth(this.props.dimensions.width);
    this.canvas.setHeight(this.props.dimensions.height);
    this.canvas.calcOffset();

    if(this.props.collaborationToolsToggle === 'pen') {
      this.canvas.isDrawingMode = true;
    } else {
      this.canvas.isDrawingMode = false;
    }

    this.renderFromData();
  },

  componentDidUpdate: function (prevProps, prevState) {
    if(this.props.collaborationToolsToggle === 'pen') {
      this.canvas.isDrawingMode = true;
    } else {
      this.canvas.isDrawingMode = false;
    }

    if(this.props.dimensions.width !== prevProps.dimensions.width  || 
      this.props.dimensions.height !== prevProps.dimensions.height || 
      this.props.dimensions.top !== prevProps.dimensions.top       ||
      this.props.dimensions.right !== prevProps.dimensions.right   || 
      this.props.dimensions.bottom !== prevProps.dimensions.bottom || 
      this.props.dimensions.left !== prevProps.dimensions.left) {
      this.canvas.setHeight(this.props.dimensions.height);
      this.canvas.setWidth(this.props.dimensions.width);
      this.canvas.calcOffset();
      this.canvas.clear();       
      this.renderFromData();
    }

    if(this.props.id !== prevProps.id) {
      this.canvas.clear();
      this.renderFromData(); 
    }
  },

  commands: function() {
    return {
      updatePointer: this.updatePointer,
      deletePointer: this.deletePointer,
      updatePath: this.updatePath
    };
  },

  guid: function() {
    var s4 = function() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() +  s4();
  },

  renderFromData: function() {
    if(this.props.whiteboardData) {
      var that = this;
      debugger;
      _.forEach(this.props.whiteboardData, function(userData, resourceJid) {
        _.forEach(userData, function(path) {
          that.updatePath(resourceJid, path, true);
        });
      });
    }
  },

  updatePointer: function(resourceJid, x, y) {
    if(resourceJid !== APP.xmpp.myResource()) {
      var newParticipant = {};

      newParticipant['participant_' + resourceJid] = {
        resourceJid: resourceJid,
        x: x * this.props.dimensions.width,
        y: y * this.props.dimensions.height - 40,
        displayName: this.props.participants['participant_' + resourceJid].displayName ? this.props.participants['participant_' + resourceJid].displayName : 'Someone'
      };

      this.setState({pariticipantsWithPointers: _.assign(this.state.pariticipantsWithPointers, newParticipant)});
    }
  },

  deletePointer: function(resourceJid) {
    this.setState({pariticipantsWithPointers: _.omit(this.state.pariticipantsWithPointers, 
      'participant_' + resourceJid)});
  },

  getPathBoundingBox: function(points) {
    var xBounds = [],
        yBounds = [],
        p1 = points[0],
        p2 = points[1],
        startPoint = p1;

    for (var i = 1, len = points.length; i < len; i++) {
      var midPoint = p1.midPointFrom(p2);
      // with startPoint, p1 as control point, midpoint as end point
      xBounds.push(startPoint.x);
      xBounds.push(midPoint.x);
      yBounds.push(startPoint.y);
      yBounds.push(midPoint.y);

      p1 = points[i];
      p2 = points[i+1];
      startPoint = midPoint;
    }

    xBounds.push(p1.x);
    yBounds.push(p1.y);

    return {
      minx: _.min(xBounds),
      miny: _.min(yBounds),
      maxx: _.min(xBounds),
      maxy: _.min(yBounds)
    };
  },

  convertPointsToSVGPath: function(points, minX, minY) {
    var path = [],
        p1 = new fabric.Point(points[0].x - minX, points[0].y - minY),
        p2 = new fabric.Point(points[1].x - minX, points[1].y - minY);

    path.push('M ', points[0].x - minX, ' ', points[0].y - minY, ' ');

    for (var i = 1, len = points.length; i < len; i++) {
      var midPoint = p1.midPointFrom(p2);
      // p1 is our bezier control point
      // midpoint is our endpoint
      // start point is p(i-1) value.
      path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
      p1 = new fabric.Point(points[i].x - minX, points[i].y - minY);
      if ((i+1) < points.length) {
        p2 = new fabric.Point(points[i+1].x - minX, points[i+1].y - minY);
      }
    }

    path.push('L ', p1.x, ' ', p1.y, ' ');

    return path;
  },

  scalePathPointsToCurrent: function(points) {
    var that = this;

    return _.map(points, function(point) {
      return new fabric.Point(
        point.x * that.props.dimensions.width,
        point.y * that.props.dimensions.height);
      }
    );
  },

  updatePath: function(resourceJid, path, renderLocal) {
    if(resourceJid !== APP.xmpp.myResource() || renderLocal) {
      var points = this.scalePathPointsToCurrent(path.points),
          boundingBox = this.getPathBoundingBox(points),
          originLeft = boundingBox.minx  + (boundingBox.maxx - boundingBox.minx) / 2,
          originTop = boundingBox.miny  + (boundingBox.maxy - boundingBox.miny) / 2;

      var newPath = new fabric.Path(this.convertPointsToSVGPath(
          points, boundingBox.minx, boundingBox.miny
        ).join(''), { id: path.id, stroke: 'red', strokeWidth: 5, fill: null});

      this.canvas.remove(_.find(this.canvas.getObjects(), {id: path.id}));

      this.canvas.add(newPath);

      newPath.set({
        left: originLeft,
        top: originTop
      });

      this.canvas.renderAll();
    }
  },

  processCommand: function() {
    if(this.commands()[arguments[0]]) {
      this.commands()[arguments[0]].apply(this, Array.prototype.slice.call(arguments,1));
    }
  },

  scalePathPointsToStandard: function(points) {
    var that = this;

    return _.map(points, function(point){
      return new fabric.Point(
        (point.x) / that.props.dimensions.width,
        (point.y) / that.props.dimensions.height);
      }
    );
  },

  generateNewPathObj: function() {
    var points = this.scalePathPointsToStandard(this.canvas.freeDrawingBrush._points);

    return {
      points: points
    };
  },

  handleMouseDown: function() {
    if(this.props.collaborationToolsToggle === 'pen') {
      this.isDrawing = true;
      this.newPath = _.assign({
        id: APP.xmpp.myResource() + this.guid()
      }, this.generateNewPathObj());

      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'updatePath', // command
        APP.xmpp.myResource(), // resourceJid
        this.newPath // new path object
      );
    }
  },


  handleMouseMove: function(e) {
    var x = e.pageX;
    var y = e.pageY;

    if(this.props.collaborationToolsToggle === 'pointer') {
      var that = this;
      
      this.setState({localPointer: {
        x: x - this.props.dimensions.left,
        y: y - this.props.dimensions.top - 40,
        displayName: 'You'
      }});

      clearTimeout(that.pointerTransmitionTimer);

      this.pointerTransmitionTimer = window.setTimeout(function() {
        that.props.sendCommand(
          that.props.id,  // whiteboard id
          'updatePointer', // command
          APP.xmpp.myResource(), // resourceJid
          (x - that.props.dimensions.left) / that.props.dimensions.width, // x
          (y - that.props.dimensions.top) / that.props.dimensions.height // y
        );
      }, 20); 
    } else 
    if(this.props.collaborationToolsToggle === 'pen' && this.isDrawing) {
      this.newPath = _.assign(this.newPath,  this.generateNewPathObj());

      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'updatePath', // command
        APP.xmpp.myResource(), // resourceJid
        this.newPath // new path object
      );
    }
  },

  handleMouseUp: function() {
    this.isDrawing = false;
  },

  handleMouseLeave: function() {
    clearTimeout(this.pointerTransmitionTimer);
    this.isDrawing = false;

    if(this.props.collaborationToolsToggle === 'pointer') {
      this.setState({localPointer: null});
      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'deletePointer', // command
        APP.xmpp.myResource() // resourceJid
      );
    }
  },


  renderLocalMousePointer: function() {
    if(this.state.localPointer && this.props.collaborationToolsToggle === 'pointer') {
      return <MousePointer participant={this.state.localPointer} local={true} />;
    }
  },

  renderParticipantsMousePointers: function() {
    return _.map(this.state.pariticipantsWithPointers, function(participant, key) {
      return <MousePointer ref={key} participant={participant} />;
    });
  },

  render: function() {
    var whiteboardClass = this.props.collaborationToolsToggle;

    return (
      <div  className="whiteboard-wrap" 
            style={this.props.dimensions}
            onMouseEnter={this.handleMouseEnter} 
            onMouseMove={this.handleMouseMove}
            onMouseLeave={this.handleMouseLeave}
            onMouseDown={this.handleMouseDown} 
            onMouseUp={this.handleMouseUp} >
        <div className={"whiteboard " + whiteboardClass}>
          {this.renderLocalMousePointer()}
          {this.renderParticipantsMousePointers()}
          <canvas width={this.props.dimensions.width} height={this.props.dimensions.height} ref="canvas"
                   />
        </div>
      </div>
    );
  }
});

module.exports = whiteboard;