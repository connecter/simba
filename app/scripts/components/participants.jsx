'use strict';

var React = require('react/addons'),
    _ = require('lodash');

var Invite = require("./invite"),
    Participant = require("./Participant");

var Participants = React.createClass({
  propTypes: {
    participants: React.PropTypes.object.isRequired,
    local: React.PropTypes.object.isRequired
  },

  getInitialState: function() {
    return {collapsed: false, isInviteOpen: false};
  },

   componentDidMount: function () {
    var localVideoNode = this.refs.localVideo.getDOMNode(),
        localAudioNode = this.refs.localAudio.getDOMNode();
    APP.RTC.attachMediaStream($(localAudioNode), this.props.local.audio.getOriginalStream());
    APP.RTC.attachMediaStream($(localVideoNode), this.props.local.video.getOriginalStream());
    localAudioNode.volume = 0;
  },

  handleToggle: function() {
    this.setState({collapsed: !this.state.collapsed, isInviteOpen: false} );
  },

  toggleInviteBox: function() {
    this.setState({isInviteOpen: !this.state.isInviteOpen});
  },

  renderParticipants: function() {
    var participants = []
    _.forEach(this.props.participants, function(participant, key) {
      participants.push(
        <Participant participant={participant}  key={key} />
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
          <video ref="localVideo" autoPlay="true" className="flip-x"></video>
          <audio ref="localAudio" autoPlay="true"></audio>
        </div>
        {this.renderParticipants()}
        <Invite isInviteOpen={this.state.isInviteOpen} toggleInviteBox={this.toggleInviteBox} />
        <div className="bg"></div>
      </section>
    );
  }
});

module.exports = Participants; 