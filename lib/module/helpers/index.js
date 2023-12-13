export const clamp = (value, min, max) => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};
export const noop = () => {};
//# sourceMappingURL=index.js.map