import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import { clamp } from '../utils/clamp';
import { limits } from '../utils/limits';
import { ANIMATION_VALUE, ZOOM_TYPE } from '../types';
import type {
  OnPanEndCallback,
  OnPanStartCallback,
  OnPinchEndCallback,
  OnPinchStartCallback,
  ProgrammaticZoomCallback,
  ZoomableUseGesturesProps,
} from '../types';
import { useAnimationEnd } from './useAnimationEnd';
import { useInteractionId } from './useInteractionId';
import { usePanGestureCount } from './usePanGestureCount';
import { sum } from '../utils/sum';

const withTimingConfig: WithTimingConfig = {
  easing: Easing.inOut(Easing.quad),
};

export const useGestures = ({
  width,
  height,
  center,
  minScale = 1,
  maxScale = 5,
  scale: scaleValue,
  doubleTapScale = 3,
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
  onProgrammaticZoom = () => {},
  onResetAnimationEnd,
}: ZoomableUseGesturesProps) => {
  const isInteracting = useRef(false);
  const isPinching = useRef(false);
  const { isPanning, startPan, endPan } = usePanGestureCount();

  const savedScale = useSharedValue(1);
  const internalScaleValue = useSharedValue(1);
  const scale = scaleValue ?? internalScaleValue;
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const savedFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const savedTranslate = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const { getInteractionId, updateInteractionId } = useInteractionId();
  const { onAnimationEnd } = useAnimationEnd(onResetAnimationEnd);

  const reset = useCallback(() => {
    'worklet';
    const interactionId = getInteractionId();

    savedScale.value = 1;
    const lastScaleValue = scale.value;
    scale.value = withTiming(1, withTimingConfig, (...args) =>
      onAnimationEnd(
        interactionId,
        ANIMATION_VALUE.SCALE,
        lastScaleValue,
        ...args
      )
    );
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    savedFocal.x.value = 0;
    savedFocal.y.value = 0;
    const lastFocalXValue = focal.x.value;
    focal.x.value = withTiming(0, withTimingConfig, (...args) =>
      onAnimationEnd(
        interactionId,
        ANIMATION_VALUE.FOCAL_X,
        lastFocalXValue,
        ...args
      )
    );
    const lastFocalYValue = focal.y.value;
    focal.y.value = withTiming(0, withTimingConfig, (...args) =>
      onAnimationEnd(
        interactionId,
        ANIMATION_VALUE.FOCAL_Y,
        lastFocalYValue,
        ...args
      )
    );
    savedTranslate.x.value = 0;
    savedTranslate.y.value = 0;
    const lastTranslateXValue = translate.x.value;
    translate.x.value = withTiming(0, withTimingConfig, (...args) =>
      onAnimationEnd(
        interactionId,
        ANIMATION_VALUE.TRANSLATE_X,
        lastTranslateXValue,
        ...args
      )
    );
    const lastTranslateYValue = translate.y.value;
    translate.y.value = withTiming(0, withTimingConfig, (...args) =>
      onAnimationEnd(
        interactionId,
        ANIMATION_VALUE.TRANSLATE_Y,
        lastTranslateYValue,
        ...args
      )
    );
  }, [
    savedScale,
    scale,
    initialFocal.x,
    initialFocal.y,
    savedFocal.x,
    savedFocal.y,
    focal.x,
    focal.y,
    savedTranslate.x,
    savedTranslate.y,
    translate.x,
    translate.y,
    getInteractionId,
    onAnimationEnd,
  ]);

  const moveIntoView = () => {
    'worklet';
    if (scale.value > 1) {
      const rightLimit = limits.right(width, scale);
      const leftLimit = -rightLimit;
      const bottomLimit = limits.bottom(height, scale);
      const topLimit = -bottomLimit;
      const totalTranslateX = sum(translate.x, focal.x);
      const totalTranslateY = sum(translate.y, focal.y);

      if (totalTranslateX > rightLimit) {
        translate.x.value = withTiming(rightLimit, withTimingConfig);
        focal.x.value = withTiming(0, withTimingConfig);
      } else if (totalTranslateX < leftLimit) {
        translate.x.value = withTiming(leftLimit, withTimingConfig);
        focal.x.value = withTiming(0, withTimingConfig);
      }

      if (totalTranslateY > bottomLimit) {
        translate.y.value = withTiming(bottomLimit, withTimingConfig);
        focal.y.value = withTiming(0, withTimingConfig);
      } else if (totalTranslateY < topLimit) {
        translate.y.value = withTiming(topLimit, withTimingConfig);
        focal.y.value = withTiming(0, withTimingConfig);
      }
    } else {
      reset();
    }
  };

  const zoom: ProgrammaticZoomCallback = (event) => {
    'worklet';
    if (event.scale > 1) {
      runOnJS(onProgrammaticZoom)(ZOOM_TYPE.ZOOM_IN);
      scale.value = withTiming(event.scale, withTimingConfig);
      focal.x.value = withTiming(
        (center.x - event.x) * (event.scale - 1),
        withTimingConfig
      );
      focal.y.value = withTiming(
        (center.y - event.y) * (event.scale - 1),
        withTimingConfig
      );
    } else {
      runOnJS(onProgrammaticZoom)(ZOOM_TYPE.ZOOM_OUT);
      reset();
    }
  };

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
      updateInteractionId();
    }
  };

  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning()) {
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
    startPan();
    onPanStart?.(event);
  };

  const onPanEnded: OnPanEndCallback = (...args) => {
    endPan();
    onPanEnd?.(...args);
    onInteractionEnded();
  };

  const panWhilePinchingGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .averageTouches(true)
    .enableTrackpadTwoFingerGesture(true)
    .minPointers(2)
    .maxPointers(maxPanPointers)
    .onStart((event) => {
      runOnJS(onPanStarted)(event);
      savedTranslate.x.value = translate.x.value;
      savedTranslate.y.value = translate.y.value;
    })
    .onUpdate((event) => {
      translate.x.value = savedTranslate.x.value + event.translationX;
      translate.y.value = savedTranslate.y.value + event.translationY;
    })
    .onEnd((event, success) => {
      const rightLimit = limits.right(width, scale);
      const leftLimit = -rightLimit;
      const bottomLimit = limits.bottom(height, scale);
      const topLimit = -bottomLimit;

      if (scale.value > 1 && isDoubleTapEnabled) {
        translate.x.value = withDecay(
          {
            velocity: event.velocityX,
            velocityFactor: 0.6,
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
            clamp: [leftLimit - focal.x.value, rightLimit - focal.x.value],
          },
          () => {
            if (event.velocityX >= event.velocityY) {
              runOnJS(onPanEnded)(event, success);
            }
          }
        );
        translate.y.value = withDecay(
          {
            velocity: event.velocityY,
            velocityFactor: 0.6,
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
            clamp: [topLimit - focal.y.value, bottomLimit - focal.y.value],
          },
          () => {
            if (event.velocityY > event.velocityX) {
              runOnJS(onPanEnded)(event, success);
            }
          }
        );
      } else {
        runOnJS(onPanEnded)(event, success);
      }
    });

  const panOnlyGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .averageTouches(true)
    .enableTrackpadTwoFingerGesture(true)
    .minPointers(1)
    .maxPointers(1)
    .onTouchesDown((_, manager) => {
      if (scale.value <= 1) {
        manager.fail();
      }
    })
    .onStart((event) => {
      runOnJS(onPanStarted)(event);
      savedTranslate.x.value = translate.x.value;
      savedTranslate.y.value = translate.y.value;
    })
    .onUpdate((event) => {
      translate.x.value = savedTranslate.x.value + event.translationX;
      translate.y.value = savedTranslate.y.value + event.translationY;
    })
    .onEnd((event, success) => {
      const rightLimit = limits.right(width, scale);
      const leftLimit = -rightLimit;
      const bottomLimit = limits.bottom(height, scale);
      const topLimit = -bottomLimit;

      if (scale.value > 1 && isDoubleTapEnabled) {
        translate.x.value = withDecay(
          {
            velocity: event.velocityX,
            velocityFactor: 0.6,
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
            clamp: [leftLimit - focal.x.value, rightLimit - focal.x.value],
          },
          () => {
            if (event.velocityX >= event.velocityY) {
              runOnJS(onPanEnded)(event, success);
            }
          }
        );
        translate.y.value = withDecay(
          {
            velocity: event.velocityY,
            velocityFactor: 0.6,
            rubberBandEffect: true,
            rubberBandFactor: 0.9,
            clamp: [topLimit - focal.y.value, bottomLimit - focal.y.value],
          },
          () => {
            if (event.velocityY > event.velocityX) {
              runOnJS(onPanEnded)(event, success);
            }
          }
        );
      } else {
        runOnJS(onPanEnded)(event, success);
      }
    });

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart((event) => {
      runOnJS(onPinchStarted)(event);
      savedScale.value = scale.value;
      savedFocal.x.value = focal.x.value;
      savedFocal.y.value = focal.y.value;
      initialFocal.x.value = event.focalX;
      initialFocal.y.value = event.focalY;
    })
    .onUpdate((event) => {
      scale.value = clamp(savedScale.value * event.scale, minScale, maxScale);
      focal.x.value =
        savedFocal.x.value +
        (center.x - initialFocal.x.value) * (scale.value - savedScale.value);
      focal.y.value =
        savedFocal.y.value +
        (center.y - initialFocal.y.value) * (scale.value - savedScale.value);
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
        scale.value = withTiming(doubleTapScale, withTimingConfig);
        focal.x.value = withTiming(
          (center.x - event.x) * (doubleTapScale - 1),
          withTimingConfig
        );
        focal.y.value = withTiming(
          (center.y - event.y) * (doubleTapScale - 1),
          withTimingConfig
        );
      } else {
        runOnJS(onDoubleTap)(ZOOM_TYPE.ZOOM_OUT);
        reset();
      }
    });

  const singleTapGesture = Gesture.Tap()
    .enabled(isSingleTapEnabled)
    .numberOfTaps(1)
    .maxDistance(24)
    .onStart((event) => {
      runOnJS(onSingleTap)(event);
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

  const pinchPanGestures = Gesture.Simultaneous(
    pinchGesture,
    panWhilePinchingGesture
  );
  const tapGestures = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const gestures =
    isDoubleTapEnabled || isSingleTapEnabled
      ? Gesture.Race(pinchPanGestures, panOnlyGesture, tapGestures)
      : pinchPanGestures;

  return { gestures, animatedStyle, zoom, reset };
};
