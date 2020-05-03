"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(obj, properties) {
  obj = obj || {};
  const response = {};
  if (typeof properties === 'string') properties = properties.split(/\s+/);

  for (const i in obj) if (properties.indexOf(i) === -1) response[i] = obj[i];

  return response;
}