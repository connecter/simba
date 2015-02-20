'use strict';

var React = require('react/addons'),
    _ = require('lodash');

var Invite = require("./invite"),
    Participant = require("./Participant");

var Participants = React.createClass({
  propTypes: {
    participants: React.PropTypes.object.isRequired,
    local: React.PropTypes.object.isRequired,
    isParticipantActive: React.PropTypes.func.isRequired,
  },

  getInitialState: function() {
    return {collapsed: false, isInviteOpen: false};
  },

  handleToggle: function() {
    this.setState({collapsed: !this.state.collapsed, isInviteOpen: false} );
  },

  toggleInviteBox: function() {
    this.setState({isInviteOpen: !this.state.isInviteOpen});
  },

  renderParticipants: function() {
    var participants = [];
    var that = this;

    _.forEach(this.props.participants, function(participant, key) {
      participants.push(
        <Participant participant={participant}  key={key} isActive={that.props.isParticipantActive(participant.jid)} />
      )
    });
    return participants;
  },

  render: function() {
    var cx = React.addons.classSet;
     var classes = cx({
      'is-collapsed': this.state.collapsed,
    });
    return (
      <section className={"participants col " + classes}>
        <div className="toggle">
          <button className={"btn-icon btn-arrow-left " + classes} title="Close" onClick={this.handleToggle}><span className="sr-only">Close</span></button>
        </div>
        <div className="participant">
          <Participant participant={this.props.local} local={true} isActive={this.props.isParticipantActive('local')} />
        </div>
        {this.renderParticipants()}
        <Invite isInviteOpen={this.state.isInviteOpen} toggleInviteBox={this.toggleInviteBox} />
        <div className="bg"></div>
      </section>
    );
  }
});

module.exports = Participants; 