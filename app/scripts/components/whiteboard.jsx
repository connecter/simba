"use strict";

var React = require('react'),
    _ = require('lodash'),
    fabric = require('../vendor/fabric').fabric;

window.fabric = fabric;

var MousePointer = require('./mousepointer'),
    CursorUtils =   require('../modules/cursorUtils');

var whiteboard = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    dimensions: React.PropTypes.object.isRequired,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    participants: React.PropTypes.object.isRequired,
    local: React.PropTypes.object.isRequired,
    whiteboardData: React.PropTypes.object,
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
    fabric.Object.prototype.hasRotatingPoint = false;
    fabric.Object.prototype.hasControls = false;
    fabric.IText.prototype.editable = false;
    fabric.IText.prototype.selectable = false;
    fabric.IText.prototype.editingBorderColor = 'rgba(0,0,0,0)';
    fabric.IText.prototype.borderColor = 'rgba(0,0,0,0)';
    fabric.IText.prototype.lockMovementX = true;
    fabric.IText.prototype.lockMovementY = true;
    this.canvas.selection = false;
    this.canvas.freeDrawingBrush.width = 5;
    this.canvas.freeDrawingBrush.color = this.props.local.color;
    this.canvas.setWidth(this.props.dimensions.width);
    this.canvas.setHeight(this.props.dimensions.height);
    this.canvas.calcOffset();

    if(this.props.collaborationToolsToggle === 'pen') {
      this.canvas.isDrawingMode = true;
    } else {
      this.canvas.isDrawingMode = false;
    }

    if(this.props.collaborationToolsToggle === 'text') {
      this.setupTextTool();
    }

    this.renderFromData();
  },

  componentDidUpdate: function (prevProps, prevState) {
    if(this.props.collaborationToolsToggle === 'pen') {
      this.canvas.isDrawingMode = true;
    } else {
      this.canvas.isDrawingMode = false;
    }

    if(['pointer', 'pen', 'text'].indexOf(this.props.collaborationToolsToggle) > -1) {
      var interactionPoint = CursorUtils.getInteractionPoint(this.props.collaborationToolsToggle);

      this.canvas.moveCursor = this.canvas.hoverCursor = this.canvas.defaultCursor = this.canvas.freeDrawingCursor = 
        "url('" + 
        CursorUtils.get(this.props.collaborationToolsToggle, this.props.local.color) + 
        "') " + 
        interactionPoint.x + ' ' + interactionPoint.y +
        " ,default"; 
    } else {
      this.canvas.moveCursor = this.canvas.hoverCursor = this.canvas.defaultCursor = this.canvas.freeDrawingCursor = 'default';
    }
    
    this.canvas.freeDrawingBrush.color = this.props.local.color;

    if(!_.isEqual(this.props.dimensions, prevProps.dimensions)) {
      this.canvas.setHeight(this.props.dimensions.height);
      this.canvas.setWidth(this.props.dimensions.width);
      this.canvas.calcOffset();
      this.canvas.clear();       
      this.renderFromData();
    }

    if(this.props.id !== prevProps.id) {
      if(['pointer', 'pen', 'text'].indexOf(this.props.collaborationToolsToggle)) {
        this.setState({localPointer: null});
        this.props.sendCommand(
          this.props.id,  // whiteboard id
          'deletePointer', // command
          APP.xmpp.myResource() // resourceJid
        );
      }

      this.canvas.clear();
      this.renderFromData(); 
    }

    if(prevProps.collaborationToolsToggle !== 'text' && this.props.collaborationToolsToggle === 'text') {
      this.setupTextTool();
    } 

    if(this.props.collaborationToolsToggle !== 'text' && prevProps.collaborationToolsToggle === 'text') {
      this.cleanupTextTool();
    }
  },

  commands: function() {
    return {
      syncPointer: this.syncPointer,
      deletePointer: this.deletePointer,
      syncPath: this.syncPath,
      syncText: this.syncText
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
      _.forEach(this.props.whiteboardData, function(userData, resourceJid) {
        _.forEach(userData.paths, function(path) {
          that.syncPath(resourceJid, path, path.color, true);
        });

        _.forEach(userData.texts, function(text) {
          that.syncText(resourceJid, text.text, text.color, true);
        });
      });
    }
  },

  syncPointer: function(resourceJid, x, y, type, color) {
    if(resourceJid !== APP.xmpp.myResource()) {
      var newParticipant = {};

      newParticipant['participant_' + resourceJid] = {
        resourceJid: resourceJid,
        x: x * this.props.dimensions.width,
        y: y * this.props.dimensions.height,
        displayName: this.props.participants['participant_' + resourceJid].displayName ? this.props.participants['participant_' + resourceJid].displayName : 'Someone',
        type: type,
        color: color
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

  syncPath: function(resourceJid, path, color, renderLocal) {
    if(resourceJid !== APP.xmpp.myResource() || renderLocal) {
      var points = this.scalePathPointsToCurrent(path.points),
          boundingBox,
          originLeft,
          originTop,
          currentPath,
          newPath;

      currentPath = _.find(this.canvas.getObjects(), {id: path.id});

      if(currentPath) {
        points = currentPath.pathPoints.concat(points);
        this.canvas.remove(currentPath);
      }

      boundingBox = this.getPathBoundingBox(points);
      originLeft = boundingBox.minx  + (boundingBox.maxx - boundingBox.minx) / 2;
      originTop = boundingBox.miny  + (boundingBox.maxy - boundingBox.miny) / 2;

      newPath = new fabric.Path(this.convertPointsToSVGPath(
          points, boundingBox.minx, boundingBox.miny).join(''), 
          { id: path.id, stroke: color, strokeWidth: 5, fill: null, pathPoints: points});
      
      this.canvas.add(newPath);

      newPath.set({
        left: originLeft,
        top: originTop
      });

      this.canvas.renderAll();
    }
  },

  syncText: function(resourceJid, text, color, renderLocal) {
    var textObj, 
        TextType;

    if(resourceJid !== APP.xmpp.myResource() || renderLocal) {
      textObj = _.find(this.canvas.getObjects(), {id: text.id});
      TextType = resourceJid === APP.xmpp.myResource() ? fabric.IText : fabric.Text;
      
      if(!textObj) {
        textObj = new TextType('', {id: text.id});
        this.canvas.add(textObj);
      }

      textObj.set({
        top: text.top * this.props.dimensions.height,
        left: text.left * this.props.dimensions.width,
        text: text.text,
        fill: color,
        fontSize: 20,
        fontFamily: 'Titillium Web'
      });

      this.canvas.renderAll();

      if(TextType === fabric.IText) {
        textObj.set({cursorColor: color});
        this.bindITextChanged(textObj);
        
        if(this.props.collaborationToolsToggle === 'text') {
          textObj.editable = true;
        }
      }
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
      return {
        x: point.x / that.props.dimensions.width,
        y: point.y / that.props.dimensions.height
      };
    });
  },

  generatePathObj: function() {
    var brushPoints = _.clone(this.canvas.freeDrawingBrush._points),
        pointsDiff = _.difference(this.canvas.freeDrawingBrush._points, this.prevPoints),
        points = this.scalePathPointsToStandard(pointsDiff);

    this.prevPoints = brushPoints;

    return {
      points: points,
      length: brushPoints.length
    };
  },

  setupTextTool: function() {
    _.forEach(fabric.IText.instances, function(obj) {
      obj.exitEditing();
      obj.editable = true;
    });

    this.canvas.on('mouse:up', function(e) {
      if(this.props.collaborationToolsToggle === 'text') {
        _.forEach(fabric.IText.instances, function(obj) {
          obj.exitEditing();
        });
        if(!e.target || e.target.get('type')!=='i-text') {
          var iText = new fabric.IText('', {
            left: e.e.offsetX,
            top: e.e.offsetY,
            id: APP.xmpp.myResource() + this.guid(),
            fill: this.props.local.color,
            cursorColor: this.props.local.color,
            fontSize: 20,
            fontFamily: 'Titillium Web'
          });

          iText.editable = true;
          this.canvas.add(iText);
          this.canvas.setActiveObject(iText);
          iText.enterEditing();
          this.bindITextChanged(iText);
        } else
        if(e.target.get('type')==='i-text') {
          this.canvas.setActiveObject(e.target);
          e.target.enterEditing();
          window.setTimeout(function() {
            e.target.setCursorByClick(e.e);
            e.target.initDelayedCursor(true);
          }, 0);
        }
      }
    }.bind(this));
  },

  bindITextChanged: function(iText) {
    iText.on('changed', function() {
      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'syncText', // command
        APP.xmpp.myResource(), // resourceJid
        { id: iText.id, text: _.clone(iText.text), top: iText.top / this.props.dimensions.height, left: iText.left / this.props.dimensions.width}, // text
        this.props.local.color // color
      );
    }.bind(this));
  },

  cleanupTextTool: function() {
    this.canvas.off('mouse:up');
    _.forEach(fabric.IText.instances, function(obj) {
      obj.exitEditing();
      obj.editable = false;
    });
  },

  handleMouseDown: function(e) {
    if(this.props.collaborationToolsToggle === 'pen') {
      this.isDrawing = true;
      this.prevPoints = [];
      this.newPath = _.assign({
        id: APP.xmpp.myResource() + this.guid()
      }, this.generatePathObj());

      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'syncPath', // command
        APP.xmpp.myResource(), // resourceJid
        this.newPath // new path object
      );
    }
  },

  handleMouseMove: function(e) {
    var x = e.pageX,
        y = e.pageY;

    this.setState({localPointer: {
      x: x - this.props.dimensions.left,
      y: y - this.props.dimensions.top - 40,
      type: this.props.collaborationToolsToggle,
      displayName: 'You',
      color: this.props.local.color
    }});

    e.persist();

    this.syncMouseMove(e);
  },

  syncMouseMove: _.throttle(function(e) {
    var x = e.pageX;
    var y = e.pageY;

    if(['pointer', 'pen', 'text'].indexOf(this.props.collaborationToolsToggle) > -1 && !this.isDrawing) {
      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'syncPointer', // command
        APP.xmpp.myResource(), // resourceJid
        (x - this.props.dimensions.left) / this.props.dimensions.width, // x
        (y - this.props.dimensions.top - 40) / this.props.dimensions.height,
        this.props.collaborationToolsToggle,  // type
        this.props.local.color // color
      );
    }

    if(this.props.collaborationToolsToggle === 'pen' && this.isDrawing) {
      this.newPath = _.assign(this.newPath,  this.generatePathObj());
      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'syncPath', // command
        APP.xmpp.myResource(), // resourceJid
        this.newPath, // new path object,
        this.props.local.color // color
      );
    }
  }, 50, {leading: true, trailing: true}),

  handleMouseUp: function() {
    this.isDrawing = false;
  },

  handleMouseLeave: function() {
    this.isDrawing = false;
    this.setState({localPointer: null});

    if(['pointer', 'pen', 'text'].indexOf(this.props.collaborationToolsToggle)) {
      this.setState({localPointer: null});
      this.props.sendCommand(
        this.props.id,  // whiteboard id
        'deletePointer', // command
        APP.xmpp.myResource() // resourceJid
      );
    }
  },

  renderLocalMousePointer: function() {
    if(this.state.localPointer && ['pointer', 'pen', 'text'].indexOf(this.props.collaborationToolsToggle) > -1) {
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
          <canvas width={this.props.dimensions.width} height={this.props.dimensions.height} ref="canvas" />
        </div>
      </div>
    );
  }
});

module.exports = whiteboard;