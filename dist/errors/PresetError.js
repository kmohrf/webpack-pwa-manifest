"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class PresetError extends Error {
  constructor(key, value) {
    super(`Unknown value of "${key}": ${value}`);
    this.name = this.constructor.name;
  }

}

exports.default = PresetError;