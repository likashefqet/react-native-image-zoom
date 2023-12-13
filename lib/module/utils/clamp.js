export const clamp = (value, min, max) => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};
//# sourceMappingURL=clamp.js.map