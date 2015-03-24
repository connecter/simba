'use strict';

var React = require('react/addons');

var Screenshare = require('./screenshare');

var Footer = React.createClass({
  propTypes: {
    execCommand: React.PropTypes.func.isRequired,
    callControlToggles: React.PropTypes.object.isRequired, 
    collaborationToolsToggle: React.PropTypes.string.isRequired,
    hasUndo: React.PropTypes.number.isRequired,
    canClear: React.PropTypes.bool.isRequired
  },
  getInitialState: function() {
    return {isToolbarExpanded: false, isScreenshareOpen: false};
  },

  toggleToolbar: function() {
    this.setState({isToolbarExpanded: !this.state.isToolbarExpanded});
  },

  render: function() {
    var cx = React.addons.classSet,
      toolbarClasses = cx({
        'is-expanded': this.state.isToolbarExpanded,
      }),

      pointerButtonClasses = cx({
        'is-toggled': this.props.collaborationToolsToggle === 'pointer'
      }),

      pointerButtonText = cx({
        'Show my cursor to participants': this.props.collaborationToolsToggle !== 'pointer',
        'Stop showing my cursor to participants': this.props.collaborationToolsToggle === 'pointer'
      }),      

      penButtonClasses = cx({
        'is-toggled': this.props.collaborationToolsToggle === 'pen'
      }),

      penButtonText = cx({
        'Draw on screen': this.props.collaborationToolsToggle !== 'pen',
        'Stop drawing': this.props.collaborationToolsToggle === 'pen'
      }),
      
      textButtonClasses = cx({
        'is-toggled': this.props.collaborationToolsToggle === 'text'
      }),

      textButtonText = cx({
        'Write on screen': this.props.collaborationToolsToggle !== 'text',
        'Stop writing on screen': this.props.collaborationToolsToggle === 'text'
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
        'is-toggled': this.props.callControlToggles.videoMute
      }),

      videoButtonText = cx({
        'Turn video off': !this.props.callControlToggles.videoMute,
        'Turn video on': this.props.callControlToggles.videoMute
      }),

      audioButtonClasses = cx({
        'is-toggled': this.props.callControlToggles.micMute
      }),

      audioButtonText = cx({
        'Turn mic off': !this.props.callControlToggles.micMute,
        'Turn mic on': this.props.callControlToggles.micMute
      }),

      screenshareButtonClasses = cx({
        'is-toggled': this.props.callControlToggles.screenStream
      }),

      screenshareText = cx({
        'Share screen': !this.props.callControlToggles.screenStream,
        'Turn screen sharing off': this.props.callControlToggles.screenStream
      }),

      undoButtonClasses = cx({
        'is-disabled': !this.props.hasUndo
      }),

      clearButtonClasses = cx({
        'is-disabled': !this.props.canClear
      });

    return (
      <div>
        <footer className="row">
          <ul className={"toolbar btn-group pull-left " + toolbarClasses}>
            <li><button className={"btn-icon btn-screenshare " + screenshareButtonClasses} onClick={this.props.execCommand("toggleScreenshare")} title={screenshareText}><span className="sr-only">{screenshareText}</span></button></li>
            <li><div className="vertical-seperator"></div></li>
            <li><button className={"btn-icon btn-cursor " + pointerButtonClasses} title={pointerButtonText} onClick={this.props.execCommand("togglePointer")}><span className="sr-only">{pointerButtonText}</span></button></li>
            <li><button className={"btn-icon btn-pen " + penButtonClasses} title={penButtonText} onClick={this.props.execCommand("togglePen")}><span className="sr-only">{penButtonText}</span></button></li>
            <li><button className={"btn-icon btn-text " + textButtonClasses} title={textButtonText} onClick={this.props.execCommand("toggleText")}><span className="sr-only">{textButtonText}</span></button></li>
            <li><button className={"btn-icon btn-undo " + undoButtonClasses} title="Undo" onClick={this.props.execCommand("undo")}><span className="sr-only">Undo</span></button></li>
            <li><button className={"btn-icon btn-clear " + clearButtonClasses} title="Clear" onClick={this.props.execCommand("clear")}><span className="sr-only">Clear</span></button></li>
            <li><button className="btn-icon btn-snapshot" title="Take a snapshot"><span className="sr-only">Take a snapshot</span></button></li>
          </ul>
          <button className={"btn-icon pull-left " +  toggleButtonClasses} title={toggleButtonText} onClick={this.toggleToolbar}><span className="sr-only">{toggleButtonText}</span></button>
          <div className={"pull-left " + toggleVerticalSeperatorClasses}></div>
          <ul className="btn-group pull-right">
            <li><button className={"btn-icon btn-mic " + audioButtonClasses} title={audioButtonText} onClick={this.props.execCommand("toggleAudio")}><span className="sr-only">{videoButtonText}</span></button></li>
            <li><button className={"btn-icon btn-camera " + videoButtonClasses} title={videoButtonText} onClick={this.props.execCommand("toggleVideo")}><span className="sr-only">{videoButtonText}</span></button></li>
            <li><button className="btn-icon btn-lock" title="Lock this room"><span className="sr-only">Lock this room</span></button></li>
            <li><button className="btn-icon btn-end-call" title="End call" onClick={this.props.execCommand("hangup")}><span className="sr-only">End call</span></button></li>
          </ul>
          <div className="clearfix"></div>
        </footer>
      </div>
    );
  }

});

module.exports = Footer;
