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
  ZOOM_TYPE,
} from '../types';

import { useInteractionId } from './useInteractionId';
import { useAnimationEnd } from './useAnimationEnd';

export const useGestures = ({
  width,
  height,
  center,
  minScale = 1,
  maxScale = 5,
  doubleTapScale = 3,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  isSingleTapEnabled = false,
  isDoubleTapEnabled = false,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onSingleTap = () => {},
  onDoubleTap = () => {},
  onResetAnimationEnd,
}: ImageZoomUseGesturesProps) => {
  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const prevScale = useSharedValue(1);
  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const prevFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const prevTranslate = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const { getInteractionId, updateInteractionId } = useInteractionId();
  const { onAnimationEnd } = useAnimationEnd(onResetAnimationEnd);

  const moveIntoView = () => {
    'worklet';
    if (scale.value > 1) {
      const rightLimit = (width * (scale.value - 1)) / 2;
      const leftLimit = -rightLimit;
      const totalTranslateX = translate.x.value + focal.x.value;

      const bottomLimit = (height * (scale.value - 1)) / 2;
      const topLimit = -bottomLimit;
      const totalTranslateY = translate.y.value + focal.y.value;

      if (totalTranslateX > rightLimit) {
        translate.x.value = withTiming(rightLimit);
        focal.x.value = withTiming(0);
      } else if (totalTranslateX < leftLimit) {
        translate.x.value = withTiming(leftLimit);
        focal.x.value = withTiming(0);
      }

      if (totalTranslateY > bottomLimit) {
        translate.y.value = withTiming(bottomLimit);
        focal.y.value = withTiming(0);
      } else if (totalTranslateY < topLimit) {
        translate.y.value = withTiming(topLimit);
        focal.y.value = withTiming(0);
      }
    } else {
      reset();
    }
  };

  const reset = useCallback(() => {
    'worklet';
    const interactionId = getInteractionId();

    prevScale.value = 1;
    scale.value = withTiming(1, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.SCALE, ...args)
    );
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    prevFocal.x.value = 0;
    prevFocal.y.value = 0;
    focal.x.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.FOCAL_X, ...args)
    );
    focal.y.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.FOCAL_Y, ...args)
    );
    prevTranslate.x.value = 0;
    prevTranslate.y.value = 0;
    translate.x.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.TRANSLATE_X, ...args)
    );
    translate.y.value = withTiming(0, undefined, (...args) =>
      onAnimationEnd(interactionId, ANIMATION_VALUE.TRANSLATE_Y, ...args)
    );
  }, [
    prevScale,
    scale,
    initialFocal.x,
    initialFocal.y,
    prevFocal.x,
    prevFocal.y,
    focal.x,
    focal.y,
    prevTranslate.x,
    prevTranslate.y,
    translate.x,
    translate.y,
    getInteractionId,
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
      if (isDoubleTapEnabled) {
        moveIntoView();
      } else {
        reset();
      }
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
      prevTranslate.x.value = translate.x.value;
      prevTranslate.y.value = translate.y.value;
    })
    .onUpdate((event) => {
      translate.x.value = prevTranslate.x.value + event.translationX;
      translate.y.value = prevTranslate.y.value + event.translationY;
    })
    .onEnd((...args) => {
      runOnJS(onPanEnded)(...args);
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart((event) => {
      runOnJS(onPinchStarted)(event);
      prevScale.value = scale.value;
      prevFocal.x.value = focal.x.value;
      prevFocal.y.value = focal.y.value;
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;
    })
    .onUpdate((event) => {
      scale.value = clamp(prevScale.value * event.scale, minScale, maxScale);
      focal.x.value =
        prevFocal.x.value +
        (center.x - initialFocal.x.value) * (scale.value - prevScale.value);
      focal.y.value =
        prevFocal.y.value +
        (center.y - initialFocal.y.value) * (scale.value - prevScale.value);
    })
    .onEnd((...args) => {
      runOnJS(onPinchEnded)(...args);
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(isDoubleTapEnabled)
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart((event) => {
      if (scale.value === 1) {
        runOnJS(onDoubleTap)(ZOOM_TYPE.ZOOM_IN);
        scale.value = withTiming(doubleTapScale);
        focal.x.value = withTiming((center.x - event.x) * (doubleTapScale - 1));
        focal.y.value = withTiming((center.y - event.y) * (doubleTapScale - 1));
      } else {
        runOnJS(onDoubleTap)(ZOOM_TYPE.ZOOM_OUT);
        reset();
      }
    });

  const singleTapGesture = Gesture.Tap()
    .enabled(isSingleTapEnabled)
    .numberOfTaps(1)
    .maxDuration(250)
    .onStart(() => {
      runOnJS(onSingleTap)();
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

  const pinchPanGestures = Gesture.Simultaneous(pinchGesture, panGesture);
  const tapGestures = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const gestures =
    isDoubleTapEnabled || isSingleTapEnabled
      ? Gesture.Race(tapGestures, pinchPanGestures)
      : pinchPanGestures;

  return { gestures, animatedStyle };
};
