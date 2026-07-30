import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import type {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withDecay,
  withTiming,
  WithTimingConfig,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { clamp } from '../utils/clamp';
import { getLimits } from '../utils/limits';
import { ANIMATION_VALUE, ZOOM_TYPE } from '../types';
import type {
  GetInfoCallback,
  OnPanEndCallback,
  OnPanStartCallback,
  OnPinchEndCallback,
  OnPinchStartCallback,
  ProgrammaticZoomCallback,
  ZoomableUseGesturesProps,
} from '../types';
import { useAnimationEnd } from './useAnimationEnd';
import { usePanGestureCount } from './usePanGestureCount';

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

  const { onAnimationEnd } = useAnimationEnd(onResetAnimationEnd);
  const lastResetId = useSharedValue(0);

  const reset = useCallback(() => {
    'worklet';
    const resetId = lastResetId.value + 1;
    lastResetId.value = resetId;

    const animateReset = (
      value: SharedValue<number>,
      key: ANIMATION_VALUE,
      toValue: number
    ) => {
      const lastValue = value.value;
      value.value = withTiming(toValue, withTimingConfig, (...args) =>
        onAnimationEnd(resetId, key, lastValue, ...args)
      );
    };

    savedScale.value = 1;
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    savedFocal.x.value = 0;
    savedFocal.y.value = 0;
    savedTranslate.x.value = 0;
    savedTranslate.y.value = 0;
    animateReset(scale, ANIMATION_VALUE.SCALE, 1);
    animateReset(focal.x, ANIMATION_VALUE.FOCAL_X, 0);
    animateReset(focal.y, ANIMATION_VALUE.FOCAL_Y, 0);
    animateReset(translate.x, ANIMATION_VALUE.TRANSLATE_X, 0);
    animateReset(translate.y, ANIMATION_VALUE.TRANSLATE_Y, 0);
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
    lastResetId,
    onAnimationEnd,
  ]);

  const moveIntoView = () => {
    'worklet';
    if (scale.value <= 1) {
      reset();
      return;
    }
    const { left, right, top, bottom } = getLimits(width, height, scale);
    const totalTranslateX = translate.x.value + focal.x.value;
    const totalTranslateY = translate.y.value + focal.y.value;

    if (totalTranslateX > right) {
      translate.x.value = withTiming(right, withTimingConfig);
      focal.x.value = withTiming(0, withTimingConfig);
    } else if (totalTranslateX < left) {
      translate.x.value = withTiming(left, withTimingConfig);
      focal.x.value = withTiming(0, withTimingConfig);
    }

    if (totalTranslateY > bottom) {
      translate.y.value = withTiming(bottom, withTimingConfig);
      focal.y.value = withTiming(0, withTimingConfig);
    } else if (totalTranslateY < top) {
      translate.y.value = withTiming(top, withTimingConfig);
      focal.y.value = withTiming(0, withTimingConfig);
    }
  };

  const zoom: ProgrammaticZoomCallback = (event) => {
    'worklet';
    if (event.scale > 1) {
      scheduleOnRN(onProgrammaticZoom, ZOOM_TYPE.ZOOM_IN);
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
      scheduleOnRN(onProgrammaticZoom, ZOOM_TYPE.ZOOM_OUT);
      reset();
    }
  };

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
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

  const handlePanStart = (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
  ) => {
    'worklet';
    scheduleOnRN(onPanStarted, event);
    savedTranslate.x.value = translate.x.value;
    savedTranslate.y.value = translate.y.value;
  };

  const handlePanUpdate = (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>
  ) => {
    'worklet';
    translate.x.value = savedTranslate.x.value + event.translationX;
    translate.y.value = savedTranslate.y.value + event.translationY;
  };

  const handlePanEnd = (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
    success: boolean
  ) => {
    'worklet';
    if (scale.value <= 1 || !isDoubleTapEnabled) {
      scheduleOnRN(onPanEnded, event, success);
      return;
    }
    const { left, right, top, bottom } = getLimits(width, height, scale);
    translate.x.value = withDecay(
      {
        velocity: event.velocityX,
        velocityFactor: 0.6,
        rubberBandEffect: true,
        rubberBandFactor: 0.9,
        clamp: [left - focal.x.value, right - focal.x.value],
      },
      () => {
        if (event.velocityX >= event.velocityY) {
          scheduleOnRN(onPanEnded, event, success);
        }
      }
    );
    translate.y.value = withDecay(
      {
        velocity: event.velocityY,
        velocityFactor: 0.6,
        rubberBandEffect: true,
        rubberBandFactor: 0.9,
        clamp: [top - focal.y.value, bottom - focal.y.value],
      },
      () => {
        if (event.velocityY > event.velocityX) {
          scheduleOnRN(onPanEnded, event, success);
        }
      }
    );
  };

  const panWhilePinchingGesture = Gesture.Pan()
    .enabled(isPanEnabled)
    .averageTouches(true)
    .enableTrackpadTwoFingerGesture(true)
    .minPointers(2)
    .maxPointers(maxPanPointers)
    .onStart(handlePanStart)
    .onUpdate(handlePanUpdate)
    .onEnd(handlePanEnd);

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
    .onStart(handlePanStart)
    .onUpdate(handlePanUpdate)
    .onEnd(handlePanEnd);

  const pinchGesture = Gesture.Pinch()
    .enabled(isPinchEnabled)
    .onStart((event) => {
      scheduleOnRN(onPinchStarted, event);
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
      scheduleOnRN(onPinchEnded, ...args);
    });

  const doubleTapGesture = Gesture.Tap()
    .enabled(isDoubleTapEnabled)
    .numberOfTaps(2)
    .maxDuration(250)
    .onStart((event) => {
      if (scale.value === 1) {
        scheduleOnRN(onDoubleTap, ZOOM_TYPE.ZOOM_IN);
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
        scheduleOnRN(onDoubleTap, ZOOM_TYPE.ZOOM_OUT);
        reset();
      }
    });

  const singleTapGesture = Gesture.Tap()
    .enabled(isSingleTapEnabled)
    .numberOfTaps(1)
    .maxDistance(24)
    .onStart((event) => {
      scheduleOnRN(onSingleTap, event);
    });

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [
        { translateX: translate.x.value },
        { translateY: translate.y.value },
        { translateX: focal.x.value },
        { translateY: focal.y.value },
        { scale: scale.value },
      ],
    }),
    [translate.x, translate.y, focal.x, focal.y, scale]
  );

  const getInfo: GetInfoCallback = () => {
    const totalTranslateX = translate.x.value + focal.x.value;
    const totalTranslateY = translate.y.value + focal.y.value;
    return {
      container: {
        width,
        height,
        center,
      },
      scaledSize: {
        width: width * scale.value,
        height: height * scale.value,
      },
      visibleArea: {
        x: Math.abs(totalTranslateX - (width * (scale.value - 1)) / 2),
        y: Math.abs(totalTranslateY - (height * (scale.value - 1)) / 2),
        width,
        height,
      },
      transformations: {
        translateX: totalTranslateX,
        translateY: totalTranslateY,
        scale: scale.value,
      },
    };
  };

  const pinchPanGestures = Gesture.Simultaneous(
    pinchGesture,
    panWhilePinchingGesture
  );
  const tapGestures = Gesture.Exclusive(doubleTapGesture, singleTapGesture);
  const gestures =
    isDoubleTapEnabled || isSingleTapEnabled
      ? Gesture.Race(pinchPanGestures, panOnlyGesture, tapGestures)
      : pinchPanGestures;

  return { gestures, animatedStyle, zoom, reset, getInfo };
};
