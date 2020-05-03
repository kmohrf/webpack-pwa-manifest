"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
const deprecated = {
  useWebpackPublicPath: 'https://github.com/arthurbergmz/webpack-pwa-manifest/issues/12'
};

function _default(options, ...properties) {
  for (var _i = 0, _properties = properties; _i < _properties.length; _i++) {
    const property = _properties[_i];

    if (options[property]) {
      console.log(`"${property}" is a deprecated option. Read more at "${deprecated[property]}".`);
    }
  }
}