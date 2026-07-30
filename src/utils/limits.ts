import { SharedValue } from 'react-native-reanimated';

export const getLimits = (
  width: number,
  height: number,
  scale: SharedValue<number>
) => {
  'worklet';
  const right = (width * (scale.value - 1)) / 2;
  const bottom = (height * (scale.value - 1)) / 2;
  return { right, left: -right, bottom, top: -bottom };
};
