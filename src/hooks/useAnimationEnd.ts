import { useCallback } from 'react';
import { AnimatableValue, useSharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { ANIMATION_VALUE, type OnResetAnimationEndCallback } from '../types';

export type OnAnimationEndCallback = (
  resetId: number,
  value: ANIMATION_VALUE,
  lastValue: number,
  finished?: boolean,
  current?: AnimatableValue
) => void;

type EndValues = Record<
  ANIMATION_VALUE,
  {
    lastValue: number;
    finished?: boolean;
    current?: AnimatableValue;
  }
>;
type PartialEndValues = Partial<EndValues>;
type ResetEndValues = Record<number, PartialEndValues>;

const ANIMATION_VALUES = [
  ANIMATION_VALUE.SCALE,
  ANIMATION_VALUE.FOCAL_X,
  ANIMATION_VALUE.FOCAL_Y,
  ANIMATION_VALUE.TRANSLATE_X,
  ANIMATION_VALUE.TRANSLATE_Y,
];

const isAnimationComplete = (
  endValues: PartialEndValues
): endValues is EndValues => {
  'worklet';
  return ANIMATION_VALUES.every((item) => !!endValues[item]);
};

export const useAnimationEnd = (
  onResetAnimationEnd?: OnResetAnimationEndCallback
) => {
  const endValues = useSharedValue<ResetEndValues>({});

  const onAnimationEnd: OnAnimationEndCallback = useCallback(
    (resetId, value, lastValue, finished, current) => {
      'worklet';
      if (!onResetAnimationEnd) {
        return;
      }
      const currentEndValues: PartialEndValues = {
        ...endValues.value[resetId],
        [value]: { lastValue, finished, current },
      };
      if (isAnimationComplete(currentEndValues)) {
        const completed = ANIMATION_VALUES.every(
          (item) => currentEndValues[item].finished
        );
        scheduleOnRN(onResetAnimationEnd, completed, currentEndValues);
        endValues.value = {};
      } else {
        endValues.value = { ...endValues.value, [resetId]: currentEndValues };
      }
    },
    [onResetAnimationEnd, endValues]
  );

  return { onAnimationEnd };
};
