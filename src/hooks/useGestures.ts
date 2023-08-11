import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from '../utils/clamp';

import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
  TapGestureHandlerEventPayload
} from 'react-native-gesture-handler';

import type { ImageZoomUseGesturesProps } from '../types';

export const useGestures = ({
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
  const isDoubleTap = useRef(false);

  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const reset = useCallback(() => {
    'worklet';
    scale.value = withTiming(1);
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    focal.x.value = withTiming(0);
    focal.y.value = withTiming(0);
    translate.x.value = withTiming(0);
    translate.y.value = withTiming(0);
  }, [
    focal.x,
    focal.y,
    initialFocal.x,
    initialFocal.y,
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
      if (isDoubleTap.current) reset();
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

  const onDoubleTapStarted = () => {
    onInteractionStarted();
    isDoubleTap.current = true;
  };

  const onDoubleTapEnded = () => {
    isDoubleTap.current = false;
    onInteractionEnded();
  };

  const panGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .minPointers(minPanPointers)
    .maxPointers(maxPanPointers)
    .onStart(() => {
      runOnJS(onPanStarted)();
    })
    .onUpdate((event: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      translate.x.value = event.translationX;
      translate.y.value = event.translationY;
    })
    .onEnd(() => {
      runOnJS(onPanEnded)();
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart(
      (event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        runOnJS(onPinchStarted)();
        initialFocal.x.value = event.focalX;
        initialFocal.y.value = event.focalY;
      }
    )
    .onUpdate((event: GestureUpdateEvent<PinchGestureHandlerEventPayload>) => {
      scale.value = clamp(event.scale, minScale, maxScale);
      focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
      focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
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
        runOnJS(onDoubleTapStarted)();
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
          reset();
        }
      }
    )
    .onEnd(() => {
      runOnJS(onDoubleTapEnded)();
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

  const gestures = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  return { gestures, animatedStyle };
};
