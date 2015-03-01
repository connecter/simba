"use strict";

var React = require('react'),
    _ = require('lodash');


var MousePointer = require('./mousepointer');

var whiteboard = React.createClass({
  propTypes: {
    id: React.PropTypes.string.isRequired,
    dimensions: React.PropTypes.object.isRequired,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggles: React.PropTypes.object.isRequired,
    participants: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
    return {
      pariticipantsWithPointers: {}
    };
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

  commands: function() {
    return {
      updatePointer: this.updatePointer,
      deletePointer: this.deletePointer
    };
  },

  processCommand: function() {
    if(this.commands()[arguments[0]]) {
      this.commands()[arguments[0]].apply(this, Array.prototype.slice.call(arguments,1));
    }
  },

  handleMouseMove: function(e) {
    var x = e.pageX;
    var y = e.pageY;

    if(this.props.collaborationToolsToggles.pointer) {
      var that = this;
      
      this.setState({localPointer: {
        x: x - this.props.dimensions.left,
        y: y - this.props.dimensions.top - 40,
        displayName: 'You'
      }});

      clearTimeout(that.pointerTransmitionTimer);

      this.pointerTransmitionTimer = window.setTimeout(function(){
        that.props.sendCommand([
          that.props.id,  // whiteboard id
          'updatePointer', // command
          APP.xmpp.myResource(), // resourceJid
          (x - that.props.dimensions.left) / that.props.dimensions.width, // x
          (y - that.props.dimensions.top) / that.props.dimensions.height, // y
        ]);
      }, 20); 
    }
  },

  handleMouseLeave: function() {
    clearTimeout(this.pointerTransmitionTimer);

    if(this.props.collaborationToolsToggles.pointer) {
      this.setState({localPointer: null});
      this.props.sendCommand([
        this.props.id,  // whiteboard id
        'deletePointer', // command
        APP.xmpp.myResource(), // resourceJid
      ]);
    }
  },

  renderLocalMousePointer: function() {
    if(this.state.localPointer && this.props.collaborationToolsToggles.pointer) {
      return <MousePointer participant={this.state.localPointer} local={true} />;
    }
  },

  renderParticipantsMousePointers: function() {
    return _.map(this.state.pariticipantsWithPointers, function(participant, key) {
      return <MousePointer ref={key} participant={participant} />;
    });
  },

  render: function() {
    return (
      <div className="whiteboard-wrap" style={this.props.dimensions}>
        <div className="whiteboard">
          {this.renderLocalMousePointer()}
          {this.renderParticipantsMousePointers()}
          <canvas ref="canvas"
                  onMouseEnter={this.handleMouseEnter} 
                  onMouseMove={this.handleMouseMove}
                  onMouseLeave={this.handleMouseLeave} />
        </div>
      </div>
    );
  }
});

module.exports = whiteboard;