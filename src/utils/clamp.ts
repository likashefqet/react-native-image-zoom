export const clamp = (value: number, min: number, max: number): number => {
  'worklet';

  return Math.min(Math.max(min, value), max);
};
