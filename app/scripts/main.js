'use strict';

var React = require('react'),
    $ = require('jquery');

var Container = require('./components/container');

$(document).ready(function() {
  React.render(React.createElement(Container), $('body')[0]);
}); 
