var React = require('react');

var audioLevel = React.createClass({
  propTypes: {
    audioLevel: React.PropTypes.number.isRequired
  },

  componentDidMount: function() {
    this.drawAudioLevelCanvas();
  },

  componentWillUpdate: function(prevProps) {
    this.drawAudioLevelCanvas();
  },

  drawAudioLevelCanvas: function() {
    var canvas = this.refs.audioLevelCanvas.getDOMNode(),
        drawContext = canvas.getContext('2d'),
        parentHeight = $(canvas).parent().height(),
        parentWidth = $(canvas).parent().width(),
        shadowLevel = this.getShadowLevel(parentHeight, this.props.audioLevel),
        that = this;
    
    canvas.height = parentHeight + 20;
    canvas.width = parentWidth + 20;
    
    drawContext.clearRect(0, 0, canvas.width, canvas.width);

    if (shadowLevel > 0) {
      window.setTimeout(function(){
        that.drawRoundRectGlow(drawContext, 0, 10, parentWidth, parentHeight, '#56A1BD', shadowLevel); 
      }, 0);
    }
  },

  getShadowLevel: function (parentHeight, audioLevel) {
    var shadowLevel = 0;

    if (audioLevel <= 0.3) {
      shadowLevel = Math.round(parentHeight/2*(audioLevel/0.3));
    }
    else if (audioLevel <= 0.6) {
      shadowLevel = Math.round(parentHeight/2*((audioLevel - 0.3) / 0.3));
    }
    else {
      shadowLevel = Math.round(parentHeight/2*((audioLevel - 0.6) / 0.4));
    }
    return shadowLevel;
  },

  drawRoundRectGlow: function(drawContext, x, y, w, h, glowColor, glowWidth) {
    drawContext.shadowColor = glowColor;
    drawContext.shadowBlur = glowWidth;
    drawContext.shadowOffsetX = 0;
    drawContext.shadowOffsetY = 0;
    drawContext.rect(x, y, w, h);
    drawContext.fill();
    drawContext.clearRect(x, y, w, h);
  },

  render: function() {
    return (
      <canvas ref="audioLevelCanvas" className="audio-level" width="150"/>
    );
  }
});

module.exports = audioLevel;