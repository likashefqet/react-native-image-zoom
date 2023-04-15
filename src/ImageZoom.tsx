import React, { useRef, useState } from 'react';
import { LayoutChangeEvent, StyleSheet } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from './helpers';

import type { ImageZoomProps } from './types';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default function ImageZoom({
  uri = '',
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  style = {},
  ...props
}: ImageZoomProps) {
  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const [center, setCenter] = useState({
    x: 0,
    y: 0,
  });

  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

  const onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }: LayoutChangeEvent) => {
    setCenter({
      x: x + width / 2,
      y: y + height / 2,
    });
  };

  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart?.();
    }
  };

  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
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
      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);
      runOnJS(onPanEnded)();
    });

  const pinchGesture = Gesture.Pinch()
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
      scale.value = withTiming(1);
      focal.x.value = withTiming(0);
      focal.y.value = withTiming(0);
      initialFocal.x.value = 0;
      initialFocal.y.value = 0;
      runOnJS(onPinchEnded)();
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

  return (
    <GestureDetector gesture={Gesture.Simultaneous(panGesture, pinchGesture)}>
      <Animated.Image
        style={[styles.image, style, animatedStyle]}
        source={{ uri }}
        resizeMode="contain"
        onLayout={onLayout}
        {...props}
      />
    </GestureDetector>
  );
}
