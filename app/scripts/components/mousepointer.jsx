"use strict";

var React = require('react');

var MousePointer = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired
  },

  render: function() {
    var pointerStyle = {
      left: this.props.participant.x - 15,
      top: this.props.participant.y - 15
    };

    return (
      <div className="pointer" style={pointerStyle} />
    );
  }

});

module.exports = MousePointer;