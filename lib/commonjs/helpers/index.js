"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noop = exports.clamp = void 0;
const clamp = (value, min, max) => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};
exports.clamp = clamp;
const noop = () => {};
exports.noop = noop;
//# sourceMappingURL=index.js.map