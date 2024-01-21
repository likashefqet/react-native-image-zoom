import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from '../utils/clamp';
import {
  type ImageZoomUseGesturesProps,
  type OnPanEndCallback,
  type OnPanStartCallback,
  type OnPinchEndCallback,
  type OnPinchStartCallback,
  ANIMATION_VALUE,
} from '../types';

import { useInteractionId } from './useInteractionId';
import { useAnimationEnd } from './useAnimationEnd';

export const useGestures = ({
  center,
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onResetAnimationEnd,
}: ImageZoomUseGesturesProps) => {
  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const { getInteractionId, updateInteractionId } = useInteractionId();
  const { onAnimationEnd } = useAnimationEnd(onResetAnimationEnd);

  const reset = useCallback(() => {
    'worklet';
    const interactionId = getInteractionId();
    scale.value = withTiming(1, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.SCALE, ...args)
    );
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    focal.x.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.FOCAL_X, ...args)
    );
    focal.y.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.FOCAL_Y, ...args)
    );
    translate.x.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.TRANSLATE_X, ...args)
    );
    translate.y.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.TRANSLATE_Y, ...args)
    );
  }, [
    getInteractionId,
    scale,
    initialFocal.x,
    initialFocal.y,
    focal.x,
    focal.y,
    translate.x,
    translate.y,
    onAnimationEnd,
  ]);

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
      updateInteractionId();
    }
  };

  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
      reset();
      isInteracting.current = false;
      onInteractionEnd?.();
    }
  };

  const onPinchStarted: OnPinchStartCallback = (event) => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart?.(event);
  };

  const onPinchEnded: OnPinchEndCallback = (...args) => {
    isPinching.current = false;
    onPinchEnd?.(...args);
    onInteractionEnded();
  };

  const onPanStarted: OnPanStartCallback = (event) => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart?.(event);
  };

  const onPanEnded: OnPanEndCallback = (...args) => {
    isPanning.current = false;
    onPanEnd?.(...args);
    onInteractionEnded();
  };

  const panGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .minPointers(minPanPointers)
    .maxPointers(maxPanPointers)
    .onStart((event) => {
      runOnJS(onPanStarted)(event);
    })
    .onUpdate((event) => {
      translate.x.value = event.translationX;
      translate.y.value = event.translationY;
    })
    .onEnd((...args) => {
      runOnJS(onPanEnded)(...args);
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart((event) => {
      runOnJS(onPinchStarted)(event);
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;
    })
    .onUpdate((event) => {
      scale.value = clamp(event.scale, minScale, maxScale);
      focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
      focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
    })
    .onEnd((...args) => {
      runOnJS(onPinchEnded)(...args);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.x.value },
      { translateY: translate.y.value },
      { translateX: focal.x.value },
      { translateY: focal.y.value },
      { scale: scale.value },
    ],
  }));

  const gestures = Gesture.Simultaneous(pinchGesture, panGesture);

  return { gestures, animatedStyle };
};
