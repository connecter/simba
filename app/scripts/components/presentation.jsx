"use strict";

var React = require('react/addons'),
    LargeVideo = require('./largeVideo'),
    Whiteboard = require('./whiteboard');

var Presentation = React.createClass({
  propTypes: {
    largeVideo: React.PropTypes.object.isRequired,
    isScreen: React.PropTypes.bool.isRequired,
    sendCommand: React.PropTypes.func.isRequired,
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    shouldFlipVideo: React.PropTypes.bool,
    participants: React.PropTypes.object.isRequired
  },

  getInitialState: function () {
      return {
        dimensions: {
          width: 'auto',
          height: 'auto'
        }
      };
  },

  getPresentationSpaceDOMNode: function() {
    return this.refs.presentationSpace.getDOMNode();
  },

  setDimensions: function(dimensions) {
    this.setState({dimensions: dimensions});
  },

  processCommand: function() {
    if(this.refs[arguments[0]]) {
      this.refs[arguments[0]]
          .processCommand
          .apply(this.refs[arguments[0]], Array.prototype.slice.call(arguments,1));
    }
  },

  renderWhiteboard: function() {
    return <Whiteboard
              id={'wb' + this.props.largeVideo.stream.id.replace('-', '_')}
              ref={'wb' + this.props.largeVideo.stream.id.replace('-', '_')}
              dimensions={this.state.dimensions} 
              collaborationToolsToggle={this.props.collaborationToolsToggle} 
              sendCommand={this.props.sendCommand} 
              participants={this.props.participants} />;
  },

  render: function() {
    return (
      <section className="presentation row" ref="presentationSpace">
        {this.renderWhiteboard()}
        <LargeVideo largeVideo={this.props.largeVideo}
                    isScreen={this.props.isScreen}
                    getPresentationSpaceDOMNode={this.getPresentationSpaceDOMNode}
                    setDimensions={this.setDimensions}
                    shouldFlipVideo={this.props.shouldFlipVideo} />
      </section>
    );
  }
});

module.exports = Presentation;