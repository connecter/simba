"use strict";

var React = require('react/addons');

var Invite = React.createClass({
  render: function() {
    var cx = React.addons.classSet,
      containerClasses = cx({
        'is-collapsed': this.props.isInviteOpen,
      });

    if(this.props.isInviteOpen) {
      return (
        <div className="invite is-toggled">
          <div className="bg"></div>
          <button className="btn-icon btn-add is-toggled" title="Close" onClick={this.props.toggleInviteBox}>
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
      );
    } else {
      return (
        <button className="invite" title="Add Participant" onClick={this.props.toggleInviteBox}>
          <span className="sr-only">Add Participant</span>
          <div className="bg"></div>
        </button>
      );
    }
  }

});

module.exports = Invite;