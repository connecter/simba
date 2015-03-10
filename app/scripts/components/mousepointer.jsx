"use strict";

var React = require('react/addons');

var CursorUtils =   require('../modules/cursorUtils');

var MousePointer = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
    local: React.PropTypes.bool
  },

  renderPointer: function() {
    if(!this.props.local) {
      return <img src={CursorUtils.get(this.props.participant.type, this.props.participant.color)} />;
    }
  },

  getInteractionPoint: function(type) {
    if(this.props.local) {
      return {x: 0, y: 0};
    }

    switch(type) {
      case 'pointer':
        return  {x: 0, y: 0};
      case 'pen':
        return {x: 8, y: 32};
      case 'text':
        return {x: 0, y: 0};
    }
  },

  render: function() {
    var interactionPoint = this.getInteractionPoint(this.props.participant.type);


    var pointerStyle = {
      left: this.props.participant.x - interactionPoint.x,
      top: this.props.participant.y - interactionPoint.y
    };

    var nameStyle = {
      backgroundColor: this.props.participant.color
    };

    var cx = React.addons.classSet,
        pointerClasses = cx({
          'local': this.props.local
        });

    return (
      <div className={this.props.participant.type + " pointer " +  pointerClasses} style={pointerStyle} >
        {this.renderPointer()}
        <span className="name" style={nameStyle}>
          {this.props.participant.displayName}
        </span>
      </div>
    );
  }

});

module.exports = MousePointer;