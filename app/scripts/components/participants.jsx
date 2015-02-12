'use strict';

var React = require('react/addons'),
    _ = require('lodash');

var Participans = React.createClass({
  propTypes: {
    pariticipants: React.PropTypes.array.isRequired
  },

  getInitialState: function() {
    return {collapsed: false};
  },

  handleToggle: function() {
    this.setState({collapsed: !this.state.collapsed});
  },

  renderParticipants: function() {
    var participants = []
    _.forEach(this.props.pariticipants, function(participant) {
      participants.push(
        <div className="participant">
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
     console.log(this.renderParticipants());
    return (
      <section className={"participants col " + classes}>
        <div className="toggle">
          <button className={"btn-icon btn-arrow-left " + classes} title="Close" onClick={this.handleToggle}><span className="sr-only">Close</span></button>
        </div>
        {this.renderParticipants()}
        <div className="bg"></div>
      </section>
    );
  }

});

module.exports = Participans;