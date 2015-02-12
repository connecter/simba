'use strict';

var React = require('react'),
    Chat = require('./chat'),
    Notes = require('./notes');

var Discussions = React.createClass({
  getInitialState: function() {
    return {collapsed: true, current_opened: null};
  },

  closeToggle: function() {
    this.setState({collapsed: true, current_opened: null});
  },

  openChat: function() {
    this.setState({collapsed: false, current_opened: "chat"});
  },

  openNotes: function() {
    this.setState({collapsed: false, current_opened: "notes"});
  },

  renderTool: function() {
    if(this.state.current_opened === "chat") {
      return <Chat />
    } else if (this.state.current_opened === "notes") {
      return <Notes />
    }
  },

  render: function() {
    var cx = React.addons.classSet,

        containerClasses = cx({
          'is-collapsed': this.state.collapsed,
        }),

        chatButtonClasses = cx({
          'is-toggled': this.state.current_opened === "chat",
        }),

        notesButtonClasses = cx({
          'is-toggled': this.state.current_opened === "notes",
        });

    return (
      <section className={"discussions col " + containerClasses}>
        <div className="toggle">
          <button className={"btn-icon btn-chat " + chatButtonClasses} title="Chat" onClick={this.openChat}><span className="sr-only">Chat</span></button>
          <button className={"btn-icon btn-notes " + notesButtonClasses} title="Notes" onClick={this.openNotes}><span className="sr-only">Notes</span></button>
          <button className="btn-icon btn-arrow-right pull-right" title="Close" onClick={this.closeToggle}><span className="sr-only">Close</span></button>
          <div className="clearfix"></div>
        </div>
        {this.renderTool()}
      </section>
    );
  }

});

module.exports = Discussions;