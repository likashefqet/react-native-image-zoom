import { useCallback } from 'react';
import {
  AnimatableValue,
  AnimationCallback,
  runOnJS,
  useSharedValue,
} from 'react-native-reanimated';

import { ANIMATION_VALUE, OnResetAnimationEndCallback } from '../types';

export type OnAnimationEndCallback = AnimationCallback extends (
  ...a: infer I
) => infer O
  ? (interactionId: string, value: ANIMATION_VALUE, ...a: I) => O
  : never;

type EndValues = Record<
  ANIMATION_VALUE,
  {
    finished?: boolean;
    current?: AnimatableValue;
  }
>;
type PartialEndValues = Partial<EndValues>;
type InteractionEndValues = Record<string, PartialEndValues>;

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
  const endValues = useSharedValue<InteractionEndValues>({});

  const onAnimationEnd: OnAnimationEndCallback = useCallback(
    (interactionId, value, finished, current) => {
      'worklet';
      if (onResetAnimationEnd) {
        const currentEndValues = endValues.value[interactionId] || {};
        currentEndValues[value] = { finished, current };
        if (isAnimationComplete(currentEndValues)) {
          const completed = !Object.values(currentEndValues).some(
            (item) => !item.finished
          );
          runOnJS(onResetAnimationEnd)(completed, currentEndValues);
          delete endValues.value[interactionId];
        } else {
          endValues.value[interactionId] = currentEndValues;
        }
      }
    },
    [onResetAnimationEnd, endValues.value]
  );

  return { onAnimationEnd };
};
