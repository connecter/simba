'use strict';

var React = require('react');

var Header = React.createClass({

  render: function() {
    return (
      <header className="row">
        <input className="save-input" type="text" placeholder="Name this Room to save it" />
      </header>
    );
  }

});

module.exports = Header;