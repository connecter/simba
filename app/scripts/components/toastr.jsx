"use strict";

var React = require('react');


var Toastr = React.createClass({

  getInitialState: function () {
    return {
        notification: null 
    };
  },

  addNotification: function(notification) {
    this.setState({notification: notification});
  },

  componentDidUpdate: function (prevProps, prevState) {
    if(this.state.notification !== prevState.notification && this.state.notification) {
      this.startTimer();
    }
  },

  remove: function() {
    this.setState({notification: null});
  },

  startTimer: function() {
    setTimeout(function() {
      this.remove();
    }.bind(this), 3000);
  },

  render: function() {
    if(this.state.notification) {
      return <div className='toastr'>{this.state.notification}</div>;
    } else {
      return <div />;
    }
  }
});

module.exports = Toastr;