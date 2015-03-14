var dest = "./dist";
var src = './app';
var meetPath = './app/meet'

module.exports = {
  devServer: {
    root: dest,
    xmpp: {
      host: 'www.connecter.io',
      port: 5280
    },

    xmppBosh: 'http://www.connecter.io/http-bind/'

  },
  sass: {
    src: src + "/styles/",
    entryFile: "main.scss",
    dest: dest + '/styles',
    settings: {
      // sourcemap: true, // TODO fix error while enabling source m
      bundleExec: true,
      require: "sass-css-importer"
    }
  },
  images: {
    src: [src + "/images/**/**" , meetPath + "/images/**", src + "/mock_data/images/**"],
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
      extensions: ['.jsx'],
      outputName: 'main.js',
      standalone: 'APP'
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
