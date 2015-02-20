'use strict';

var React = require('react/addons');

var Screenshare = require('./screenshare');

var Footer = React.createClass({
  getInitialState: function() {
    return {isToolbarExpanded: false, isScreenshareOpen: false}
  },

  toggleToolbar: function() {
    this.setState({isToolbarExpanded: !this.state.isToolbarExpanded});
  },

  toggleScreenshare: function() {
    this.setState({isScreenshareOpen: !this.state.isScreenshareOpen});
  },

  render: function() {
    var cx = React.addons.classSet,
      toolbarClasses = cx({
        'is-expanded': this.state.isToolbarExpanded,
      }),

      toggleButtonClasses = cx({
        'btn-arrow-small-right': !this.state.isToolbarExpanded,
        'btn-arrow-small-left': this.state.isToolbarExpanded
      }),

      toggleVerticalSeperatorClasses = cx({
        'vertical-seperator': this.state.isToolbarExpanded
      }),

      toggleButtonText = cx({
        'Show more': !this.state.isToolbarExpanded,
        'Show less': this.state.isToolbarExpanded
      }),

      videoButtonClasses = cx({
        'is-toggled': this.props.callControlToggleStates.videoMute
      }),

      videoButtonText = cx({
        'Turn video off': !this.props.callControlToggleStates.videoMute,
        'Turn video on': this.props.callControlToggleStates.videoMute
      }),

      audioButtonClasses = cx({
        'is-toggled': this.props.callControlToggleStates.micMute
      }),

      audioButtonText = cx({
        'Turn mic off': !this.props.callControlToggleStates.micMute,
        'Turn mic on': this.props.callControlToggleStates.micMute
      }),

      screenshareButtonClasses = cx({
        'is-toggled': this.state.isScreenshareOpen
      });

    return (
      <div>
        <footer className="row">
          <ul className={"toolbar btn-group pull-left " + toolbarClasses}>
            <li><button className={"btn-icon btn-screenshare " + screenshareButtonClasses} onClick={this.toggleScreenshare} title="Share my screen"><span className="sr-only">Share my screen</span></button></li>
            <li><div className="vertical-seperator"></div></li>
            <li><button className="btn-icon btn-cursor" title="Show my cursor to participants"><span className="sr-only">Show my cursor to participants</span></button></li>
            <li><button className="btn-icon btn-pen" title="Draw on screen"><span className="sr-only">Draw on screen</span></button></li>
            <li><button className="btn-icon btn-text" title="Write on screen"><span className="sr-only">Write on screen</span></button></li>
            <li><button className="btn-icon btn-undo" title="Undo"><span className="sr-only">Undo</span></button></li>
            <li><button className="btn-icon btn-clear" title="Clear"><span className="sr-only">Clear</span></button></li>
            <li><button className="btn-icon btn-snapshot" title="Take a snapshot"><span className="sr-only">Take a snapshot</span></button></li>
          </ul>
          <button className={"btn-icon pull-left " +  toggleButtonClasses} title={toggleButtonText} onClick={this.toggleToolbar}><span className="sr-only">{toggleButtonText}</span></button>
          <div className={"pull-left " + toggleVerticalSeperatorClasses}></div>
          <ul className="btn-group pull-right">
            <li><button className={"btn-icon btn-mic " + audioButtonClasses} title={audioButtonText} onClick={this.props.execCommand("toggleAudio")}><span className="sr-only">{videoButtonText}</span></button></li>
            <li><button className={"btn-icon btn-camera " + videoButtonClasses} title={videoButtonText} onClick={this.props.execCommand("toggleVideo")}><span className="sr-only">{videoButtonText}</span></button></li>
            <li><button className="btn-icon btn-lock" title="Lock this room"><span className="sr-only">Lock this room</span></button></li>
            <li><button className="btn-icon btn-end-call" title="End call"><span className="sr-only">End call</span></button></li>
          </ul>
          <div className="clearfix"></div>
        </footer>
        <Screenshare isOpen={this.state.isScreenshareOpen} />
      </div>
    );
  }

});

module.exports = Footer;
