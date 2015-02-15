var React = require('react');

var Screenshare = React.createClass({

  render: function() {
    return (
      <div className={"row screenshare " + (this.props.isOpen? 'is-open': '')}>
        <div className="bg"></div>
        <button className="btn-icon btn-arrow-left" title="Scroll left"><span className="sr-only">Scroll left</span></button>
        <button className="btn-icon btn-arrow-right" title="Scroll right"><span className="sr-only">Scroll right</span></button>
      </div>
    );
  }

});

module.exports = Screenshare;