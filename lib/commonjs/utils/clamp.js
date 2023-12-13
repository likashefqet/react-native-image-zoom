"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clamp = void 0;
const clamp = (value, min, max) => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};
exports.clamp = clamp;
//# sourceMappingURL=clamp.js.map