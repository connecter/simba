"use strict";

var React = require('react/addons');

var MousePointer = React.createClass({
  propTypes: {
    participant: React.PropTypes.object.isRequired,
    local: React.PropTypes.bool
  },

  render: function() {
    var pointerStyle = {
      left: this.props.participant.x - 15,
      top: this.props.participant.y - 15
    };

    var cx = React.addons.classSet,
        pointerClasses = cx({
          'local': this.props.local
        });

    return (
      <div className={"pointer " + pointerClasses} style={pointerStyle} >
        <span className="name">
          {this.props.participant.displayName}
        </span>
      </div>
    );
  }

});

module.exports = MousePointer;