import { SharedValue } from 'react-native-reanimated';

const right = (width: number, scale: SharedValue<number>) => {
  'worklet';
  return (width * (scale.value - 1)) / 2;
};

const left = (width: number, scale: SharedValue<number>) => {
  'worklet';
  return -right(width, scale);
};

const bottom = (height: number, scale: SharedValue<number>) => {
  'worklet';
  return (height * (scale.value - 1)) / 2;
};

const top = (height: number, scale: SharedValue<number>) => {
  'worklet';
  return -bottom(height, scale);
};

export const limits = {
  right,
  left,
  top,
  bottom,
};
