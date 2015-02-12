'use strict';

var React = require('react');

var Header = require('./header')
var Footer = require('./footer')
var Participants = require('./participants')
var Discussions = require('./discussions')
var Presentation = require('./presentation')

var Container = React.createClass({

  render: function() {
    return (
      <div>
        <Header></Header>
        <Presentation></Presentation>
        <Participants></Participants>
        <Discussions></Discussions>
        <Footer></Footer>
      </div>
    );
  }

});

module.exports = Container;
