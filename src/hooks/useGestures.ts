import { useCallback, useRef } from 'react';
import {
  Gesture,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from '../helpers';

import type { ImageZoomUseGesturesProps } from '../types';

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
  isDoubleTapEnabled = false,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
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
      translate.x.value = withTiming(0);
      focal.x.value = withTiming(0);
      translate.y.value = withTiming(0);
      focal.y.value = withTiming(0);
    }
  };

  const reset = useCallback(() => {
    'worklet';
    prevScale.value = 1;
    scale.value = withTiming(1);
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    prevFocal.x.value = 0;
    prevFocal.y.value = 0;
    focal.x.value = withTiming(0);
    focal.y.value = withTiming(0);
    prevTranslate.x.value = 0;
    prevTranslate.y.value = 0;
    translate.x.value = withTiming(0);
    translate.y.value = withTiming(0);
  }, [
    focal.x,
    focal.y,
    initialFocal.x,
    initialFocal.y,
    prevFocal.x,
    prevFocal.y,
    prevScale,
    prevTranslate.x,
    prevTranslate.y,
    scale,
    translate.x,
    translate.y,
  ]);

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
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

  const onPinchStarted = () => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart?.();
  };

  const onPinchEnded = () => {
    isPinching.current = false;
    onPinchEnd?.();
    onInteractionEnded();
  };

  const onPanStarted = () => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart?.();
  };

  const onPanEnded = () => {
    isPanning.current = false;
    onPanEnd?.();
    onInteractionEnded();
  };

  const panGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .minPointers(minPanPointers)
    .maxPointers(maxPanPointers)
    .onStart(() => {
      runOnJS(onPanStarted)();
      prevTranslate.x.value = translate.x.value;
      prevTranslate.y.value = translate.y.value;
    })
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      translate.x.value = prevTranslate.x.value + event.translationX;
      translate.y.value = prevTranslate.y.value + event.translationY;
    })
    .onEnd(() => {
      runOnJS(onPanEnded)();
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart(
      (event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        runOnJS(onPinchStarted)();
        prevScale.value = scale.value;
        prevFocal.x.value = focal.x.value;
        prevFocal.y.value = focal.y.value;
        initialFocal.x.value = event.focalX;
        initialFocal.y.value = event.focalY;
      }
    )
    .onUpdate((event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      scale.value = clamp(prevScale.value * event.scale, minScale, maxScale);
      focal.x.value =
        prevFocal.x.value +
        (center.x - initialFocal.x.value) * (scale.value - prevScale.value);
      focal.y.value =
        prevFocal.y.value +
        (center.y - initialFocal.y.value) * (scale.value - prevScale.value);
    })
    .onEnd(() => {
      runOnJS(onPinchEnded)();
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(isDoubleTapEnabled)
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart(
      (event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
        console.log('Double tap!');
        if (scale.value === 1) {
          console.log('Zoom in!');
          scale.value = withTiming(doubleTapScale);
          focal.x.value = withTiming(
            (center.x - event.x) * (doubleTapScale - 1)
          );
          focal.y.value = withTiming(
            (center.y - event.y) * (doubleTapScale - 1)
          );
        } else {
          console.log('Zoom out!');
          reset();
        }
      }
    );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translate.x.value },
      { translateY: translate.y.value },
      { translateX: focal.x.value },
      { translateY: focal.y.value },
      { scale: scale.value },
    ],
  }));

  const simultaneousGestures = Gesture.Simultaneous(pinchGesture, panGesture);
  const gestures = isDoubleTapEnabled
    ? Gesture.Race(doubleTapGesture, simultaneousGestures)
    : simultaneousGestures;

  return { gestures, animatedStyle, reset };
};
