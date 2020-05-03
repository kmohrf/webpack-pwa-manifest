"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class IconError extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name;
  }

}

exports.default = IconError;