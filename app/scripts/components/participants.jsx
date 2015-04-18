'use strict';

var React = require('react/addons'),
    _ = require('lodash');

var Invite = require("./invite"),
    Participant = require("./participant");

var Participants = React.createClass({
  propTypes: {
    participants: React.PropTypes.object.isRequired,
    local: React.PropTypes.object.isRequired,
    isParticipantActive: React.PropTypes.func.isRequired,
    isParticipantPinned: React.PropTypes.func.isRequired,
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
    var that = this;

    return _.map(this.props.participants, function(participant, key) {
      return <Participant
        participant={participant}
        key={key}
        isActive={that.props.isParticipantActive(participant.jid)}
        isPinned={that.props.isParticipantPinned(participant.jid)} 
        pinParticipant={that.props.pinParticipant} 
      />;
    });
  },

  render: function() {
    var cx = React.addons.classSet,
        
        classes = cx({
          'is-collapsed': this.state.collapsed,
        }),

        buttonClasses = cx({
          'is-toggled': !this.state.collapsed,
        }),

        buttonsTabIndex = cx({
          '0': !this.state.collapsed,
          '-1': this.state.collapsed,
        });

    return (
      <section className={"participants col " + classes}>
        <div className="toggle">
          <button className={"btn-icon btn-participant pull-right " + buttonClasses} title="Chat" onClick={this.handleToggle}><span className="sr-only">Participants</span></button>
          <button tabIndex={buttonsTabIndex} className={"btn-icon btn-arrow-left " + classes} title="Close" onClick={this.handleToggle}><span className="sr-only">Close</span></button>
        </div>
        <div className="participant">
          <Participant 
            participant={this.props.local}
            local={true}
            isActive={this.props.isParticipantActive('local')}
            isPinned={this.props.isParticipantPinned('local')} 
            pinParticipant={this.props.pinParticipant}  
          />
        </div>
        {this.renderParticipants()}
        <Invite isInviteOpen={this.state.isInviteOpen} toggleInviteBox={this.toggleInviteBox} />
        <div className="bg"></div>
      </section>
    );
  }
});

module.exports = Participants; 