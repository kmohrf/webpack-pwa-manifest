"use strict";

var _presets = _interopRequireDefault(require("./validators/presets"));

var _colors = _interopRequireDefault(require("./validators/colors"));

var _versioning = _interopRequireDefault(require("./validators/versioning"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class WebpackPwaManifest {
  constructor(options = {}) {
    (0, _presets.default)(options, 'dir', 'display', 'orientation', 'crossorigin');
    (0, _colors.default)(options, 'background_color', 'theme_color');
    (0, _versioning.default)(options, 'useWebpackPublicPath');
    this._generator = null;
    this.assets = null;
    this.htmlPlugin = false;
    const shortName = options.short_name || options.name || 'App'; // fingerprints is true by default, but we want it to be false even if users
    // set it to undefined or null.

    if (!options.hasOwnProperty('fingerprints')) {
      options.fingerprints = true;
    }

    this.options = Object.assign({
      filename: options.fingerprints ? '[name].[hash].[ext]' : '[name].[ext]',
      name: 'App',
      short_name: shortName,
      orientation: 'portrait',
      display: 'standalone',
      start_url: '.',
      inject: true,
      fingerprints: true,
      ios: false,
      publicPath: null,
      includeDirectory: true,
      crossorigin: null
    }, options);
  }

  _acquireGenerator(hooks) {
    return hooks ? require('./generators/tapable') : require('./generators/legacy');
  }

  apply(compiler) {
    const hooks = compiler.hooks;

    const generator = this._generator || (this._generator = this._acquireGenerator(hooks));

    generator(this, compiler);
  }

}

module.exports = WebpackPwaManifest;