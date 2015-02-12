'use strict';

var React = require('react/addons');

var Participans = React.createClass({
  getInitialState: function() {
    return {collapsed: false};
  },

  handleToggle: function() {
    this.setState({collapsed: !this.state.collapsed});
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
        <div className="bg"></div>
      </section>
    );
  }

});

module.exports = Participans;