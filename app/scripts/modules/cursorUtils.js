"use strict";

var CursorUtils = {
  get: function(type, color) {
    switch(type) {
      case 'pointer':
        return  CursorUtils.getPointer(color);
      case 'pen':
        return CursorUtils.getPen(color);
      case 'text':
        return CursorUtils.getText(color);
    }
  },

  getPointer: function(color) {
    return ('data:image/svg+xml;utf8,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="12px" height="18px">' +
              '<g  stroke="%color" fill="#000000">' +
                '<g>' +
                  '<path d="M0,0 L0,12 L3,9 L5.5,14 L6.5,14 C6.5,14 7.14566022,13.3495845 7,13 C6.31232691,11.3495845 4.5,8 4.5,8 ' +'L8,8 L0,0 Z"></path>' +
                '</g>' +
              '</g>' +
            '</svg>').replace('%color', color);
  },

  getPen: function(color) {
    return ('data:image/svg+xml;utf8,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="32px">' +
              '<g>' +
                '<g transform="translate(0.000000, 17.000000)" stroke="#FFFFFF" stroke-width="0.25" fill="#000000">' +
                  '<g transform="translate(7.000000, 0.000000)">' +
                    '<rect x="0" y="0" width="1.5" height="6" rx="40"></rect>' +
                    '<rect x="0" y="9" width="1.5" height="6" rx="40"></rect>' +
                  '</g>' +
                  '<g transform="translate(8.000000, 7.500000) rotate(-270.000000) translate(-8.000000, -7.500000) translate(7.000000, 0.000000)">' +
                    '<rect x="0" y="0" width="1.5" height="6" rx="40"></rect>' +
                    '<rect x="0" y="9" width="1.5" height="6" rx="40"></rect>' +
                  '</g>' +
                '</g>' +
                '<g  transform="translate(9.000000, 0.000000)" stroke="%color">' +
                  '<path d="M13.4237374,0.16636194 L13.4226035,0.16636194 L7.51799168,0.16636194 L7.51629088,0.16636194 C7.40120339,0.16636194 7.2861159,0.205480347 7.19824122,0.283150229 C7.10696494,0.364221711 7.06557879,0.470805199 7.0689804,0.576821753 L7.0689804,16.2582008 C7.06671266,16.3279336 7.09165773,16.3942648 7.12964227,16.4571944 L10.1077437,21.5074375 C10.1077437,21.5074375 10.1508306,21.5669656 10.1808781,21.5930445 C10.2693197,21.6712813 10.3849741,21.7098328 10.5000616,21.7098328 C10.615716,21.7098328 10.7313704,21.6712813 10.8198121,21.5930445 C10.8492926,21.5669656 10.8923795,21.5068706 10.8923795,21.5068706 L13.8109529,16.4571944 C13.8489374,16.3942648 13.8744494,16.3267997 13.8716148,16.2576339 L13.8716148,0.577388686 C13.8755833,0.471372132 13.8336302,0.364221711 13.741787,0.283150229 C13.6544793,0.206047281 13.5393918,0.16636194 13.4237374,0.16636194" id="Imported-Layers-3" fill="#000000" transform="translate(10.470329, 10.938097) rotate(40.000000) translate(-10.470329, -10.938097) "></path>' +
                  '<path d="M5.31478714,12.5 L10,16.2481703" id="Line" stroke-linecap="square"></path>' +
                '</g>' +
              '</g>' +
            '</svg>').replace('%color', color);
  },

  getText: function(color) {
    return ('data:image/svg+xml;utf8,<svg width="9px" height="16px" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
              '<g stroke-width="0.5" stroke="%color" fill="#000000">' +
                '<path d="M5,1.94 L5,14 L8.17480469,14 L8.17480469,15.5 L4.69816361,15.5 L4.69816361,15 L4.69816361,15 L3.52362271,15 L3.52362271,15 L3.52362271,15.5 L0,15.5 L0,14 L3,14 L3,1.94 L3,1.94 L0,1.94 L0,0.5 L3.52362271,0.5 L3.52362271,1 L4.69816361,1 L4.69816361,0.5 L8.17480469,0.5 L8.17480469,1.94 L5,1.94 Z"></path>' +
              '</g>' +
            '</svg>').replace('%color', color);
  },

  getInteractionPoint: function(type, local) {
    if(local) {
      return {x: 0, y: 0};
    }

    switch(type) {
      case 'pointer':
        return  {x: 0, y: 0};
      case 'pen':
        return {x: 8, y: 24};
      case 'text':
        return {x: 0, y: 0};
    }
  },
};

module.exports = CursorUtils;