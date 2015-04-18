'use strict';

var React = require('react'),
    Chat = require('./chat'),
    Notes = require('./notes');

var Discussions = React.createClass({
  getInitialState: function() {
    return {collapsed: true, currentOpened: null};
  },

  closeToggle: function() {
    this.setState({collapsed: true, currentOpened: null});
  },

  openChat: function() {
    this.setState({collapsed: false, currentOpened: "chat"});
  },

  openNotes: function() {
    this.setState({collapsed: false, currentOpened: "notes"});
  },

  renderTool: function() {
    if(this.state.currentOpened === "chat") {
      return <Chat />;
    } else if (this.state.currentOpened === "notes") {
      return <Notes />;
    }
  },

  render: function() {
    var cx = React.addons.classSet,

        containerClasses = cx({
          'is-collapsed': this.state.collapsed
        }),

        chatButtonClasses = cx({
          'is-toggled': this.state.currentOpened === "chat"
        }),

        buttonsTabIndex = cx({
          '0': !this.state.collapsed,
          '-1': this.state.collapsed,
        }),

        notesButtonClasses = cx({
          'is-toggled': this.state.currentOpened === "notes"
        });

    return (
      <section className={"discussions col " + containerClasses}>
        <div className="toggle">
          <button className={"btn-icon btn-chat " + chatButtonClasses} title="Chat" onClick={this.openChat}><span className="sr-only">Chat</span></button>
          <button tabIndex={buttonsTabIndex} className={"btn-icon btn-notes " + notesButtonClasses} title="Notes" onClick={this.openNotes}><span className="sr-only">Notes</span></button>
          <button tabIndex={buttonsTabIndex} className="btn-icon btn-arrow-right pull-right" title="Close" onClick={this.closeToggle}><span className="sr-only">Close</span></button>
          <div className="clearfix"></div>
        </div>
        {this.renderTool()}
      </section>
    );
  }

});

module.exports = Discussions;