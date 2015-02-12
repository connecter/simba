'use strict';

var React = require('react');

var Header = require('./header'),
    Footer = require('./footer'),
    Participants = require('./participants'),
    Discussions = require('./discussions'),
    Presentation = require('./presentation'),
    data = require('../mockdata');

var Container = React.createClass({

  render: function() {
    return (
      <div>
        <Header></Header>
        <Presentation></Presentation>
        <Participants pariticipants={data.participants}></Participants>
        <Discussions></Discussions>
        <Footer></Footer>
      </div>
    );
  }

});

module.exports = Container;
