"use strict";

var fabric = require('../vendor/fabric').fabric,
    _ = require('lodash');

var canvasUtils = {
  getPathBoundingBox: function(points) {
    var xBounds = [],
        yBounds = [],
        p1 = points[0],
        p2 = points[1],
        startPoint = p1;

    for (var i = 1, len = points.length; i < len; i++) {
      var midPoint = p1.midPointFrom(p2);
      // with startPoint, p1 as control point, midpoint as end point
      xBounds.push(startPoint.x);
      xBounds.push(midPoint.x);
      yBounds.push(startPoint.y);
      yBounds.push(midPoint.y);

      p1 = points[i];
      p2 = points[i+1];
      startPoint = midPoint;
    }

    xBounds.push(p1.x);
    yBounds.push(p1.y);

    return {
      minx: _.min(xBounds),
      miny: _.min(yBounds),
      maxx: _.min(xBounds),
      maxy: _.min(yBounds)
    };
  },

  convertPointsToSVGPath: function(points, minX, minY) {
    var path = [],
        p1 = new fabric.Point(points[0].x - minX, points[0].y - minY),
        p2 = new fabric.Point(points[1].x - minX, points[1].y - minY);

    path.push('M ', points[0].x - minX, ' ', points[0].y - minY, ' ');

    for (var i = 1, len = points.length; i < len; i++) {
      var midPoint = p1.midPointFrom(p2);
      // p1 is our bezier control point
      // midpoint is our endpoint
      // start point is p(i-1) value.
      path.push('Q ', p1.x, ' ', p1.y, ' ', midPoint.x, ' ', midPoint.y, ' ');
      p1 = new fabric.Point(points[i].x - minX, points[i].y - minY);
      if ((i+1) < points.length) {
        p2 = new fabric.Point(points[i+1].x - minX, points[i+1].y - minY);
      }
    }

    path.push('L ', p1.x, ' ', p1.y, ' ');

    return path;
  },

  scalePathPointsToCurrent: function(points, dimensions) {
    return _.map(points, function(point) {
      return new fabric.Point(
        point.x * dimensions.width,
        point.y * dimensions.height);
      }
    );
  },

  scalePathPointsToStandard: function(points, dimensions) {
    return _.map(points, function(point){
      return {
        x: point.x / dimensions.width,
        y: point.y / dimensions.height
      };
    });
  },
};

module.exports = canvasUtils;