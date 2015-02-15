'use strict';

var React = require('react/addons'),
    _ = require('lodash');

var Invite = require("./invite");

var Participans = React.createClass({
  propTypes: {
    pariticipants: React.PropTypes.array.isRequired
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
    var participants = []
    _.forEach(this.props.pariticipants, function(participant, key) {
      participants.push(
        <div className="participant" key={key}>
          <img src={participant.image} alt={participant.name} />
        </div>
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
        {this.renderParticipants()}
        <Invite isInviteOpen={this.state.isInviteOpen} toggleInviteBox={this.toggleInviteBox} />
        <div className="bg"></div>
      </section>
    );
  }

});

module.exports = Participans;