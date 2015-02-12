"use strict";

var React = require('react/addons');

var Invite = React.createClass({

  getInitialState: function() {
    return {collapsed: true}
  },

  toggleInviteBox: function() {
    this.setState({collapsed: !this.state.collapsed});
  },

  render: function() {
    var cx = React.addons.classSet,
      containerClasses = cx({
        'is-collapsed': this.state.collapsed,
      });

    if(this.state.collapsed) {
      return (
        <button className="invite" title="Invite" onClick={this.toggleInviteBox}>
          <span className="sr-only">Invite</span>
          <div className="bg"></div>
        </button>
      );
    } else {
      return (
        <div className="invite is-toggled">
          <div className="bg"></div>
          <button className="btn-icon btn-add is-toggled" title="Close" onClick={this.toggleInviteBox}>
            <span className="sr-only">Close</span>
          </button>
          <div className="invite-form pull-right">
            <button className="btn-primary" title="Copy Meeting Link">Copy Meeting Link</button>
            <span className="vertical-seperator"></span>
            <input type="text" placeholder="E-Mail Address" />
            <button className="btn-primary" title="Sent">Send</button>
          </div>
          <div className="clearfix"></div>
        </div>
      )
    }
  }

});

module.exports = Invite;