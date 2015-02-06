var dest = "./dist";
var src = './app';
var meetPath = './app/meet'

module.exports = {
  browserSync: {
    root: dest,
    xmppBindUrl: 'http://www.connecter.io/http-bind/'
  },
  sass: {
    src: src + "/styles/",
    dest: dest + '/styles',
    settings: {
      // sourcemap: true, // TODO fix error while enabling source m
      bundleExec: true,
      require: "sass-css-importer"
    }
  },
  images: {
    src: [src + "/images/**" , meetPath + "/images/**"],
    dest: dest + "/images"
  },  
  sounds: {
    src: meetPath + "/sounds/**",
    dest: dest + "/sounds"
  },  
  fonts: {
    src: meetPath + "/fonts/**",
    dest: dest + "/fonts"
  },
  markup: {
    src: src + "/markups/**",
    dest: dest
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/scripts/main.js',
      dest: dest + '/scripts',
      outputName: 'main.js'
    }, {
      entries: src + '/scripts/meetLayer.js',
      dest: dest + '/scripts',
      outputName: 'meet.js'
    }]
  },
  build: {
    cssSrc: dest + '/styles/*.css',
    jsSrc: dest + '/scripts/*.js',
    jsDest: dest + '/scripts',
    cssDest: dest + '/styles',
    dest: dest,
    appSrc: src
  }
};
