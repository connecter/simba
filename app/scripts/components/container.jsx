'use strict';

var React = require('react');

var Header = require('./header'),
    Footer = require('./footer'),
    Participants = require('./participants'),
    Discussions = require('./discussions'),
    Presentation = require('./presentation'),
    data = require('../mockdata');

var Container = React.createClass({
  getInitialState: function() {
    return {};
  },

  changeLocalAudio: function(stream) {
    this.setState({localAudio: stream});
  },

  changeLocalVideo: function(stream) {
    this.setState({localVideo: stream})
  },

  renderPresentation: function() {
    if(this.state.localAudio && this.state.localVideo) {
      return (
        <Presentation largeVideo={this.state.localVideo} localAudio={this.state.localAudio}></Presentation>
      );
    }
  },

  render: function() {
    return (
      <div>
        <Header></Header>
        {this.renderPresentation()}
        <Participants pariticipants={data.participants}></Participants>
        <Discussions></Discussions>
        <Footer></Footer>
      </div>
    );
  }

});

module.exports = Container;
