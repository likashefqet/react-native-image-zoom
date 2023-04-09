import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  PinchGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { clamp } from './helpers';

import type { ImageZoomProps } from './types';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'whitesmoke',
  },
});

export default function ImageZoom({
  uri = '',
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onLoadEnd,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  style = {},
  containerStyle = {},
  imageContainerStyle = {},
  activityIndicatorProps = {},
  renderLoader,
  ...props
}: ImageZoomProps) {
  const panRef = useRef();
  const pinchRef = useRef();

  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);

  const [isLoading, setIsLoading] = useState(true);
  const [state, setState] = useState({
    canInteract: false,
    center: { x: 0, y: 0 },
  });

  const { canInteract, center } = state;

  const scale = useSharedValue(1);
  const initialFocal = { x: useSharedValue(0), y: useSharedValue(0) };
  const focal = { x: useSharedValue(0), y: useSharedValue(0) };
  const translate = { x: useSharedValue(0), y: useSharedValue(0) };

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

  const panHandler = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
    onActive: (event: PanGestureHandlerEventPayload) => {
      translate.x.value = event.translationX;
      translate.y.value = event.translationY;
    },
    onFinish: () => {
      translate.x.value = withTiming(0);
      translate.y.value = withTiming(0);
    },
  });

  const pinchHandler =
    useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>({
      onStart: (event: PinchGestureHandlerEventPayload) => {
        initialFocal.x.value = event.focalX;
        initialFocal.y.value = event.focalY;
      },
      onActive: (event: PinchGestureHandlerEventPayload) => {
        // onStart: focalX & focalY result both to 0 on Android
        if (initialFocal.x.value === 0 && initialFocal.x.value === 0) {
          initialFocal.x.value = event.focalX;
          initialFocal.y.value = event.focalY;
        }
        scale.value = clamp(event.scale, minScale, maxScale);
        focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
        focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
      },
      onFinish: () => {
        scale.value = withTiming(1);
        focal.x.value = withTiming(0);
        focal.y.value = withTiming(0);
        initialFocal.x.value = 0;
        initialFocal.y.value = 0;
      },
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

  const onLayout = ({
    nativeEvent: {
      layout: { x, y, width, height },
    },
  }: LayoutChangeEvent) => {
    setState((current) => ({
      ...current,
      canInteract: true,
      center: { x: x + width / 2, y: y + height / 2 },
    }));
  };

  const onImageLoadEnd = () => {
    onLoadEnd?.();
    setIsLoading(false);
  };

  return (
    <PinchGestureHandler
      ref={pinchRef}
      simultaneousHandlers={[panRef]}
      onGestureEvent={pinchHandler}
      onActivated={onPinchStarted}
      onCancelled={onPinchEnded}
      onEnded={onPinchEnded}
      onFailed={onPinchEnded}
      enabled={isPinchEnabled && canInteract}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        <PanGestureHandler
          ref={panRef}
          simultaneousHandlers={[pinchRef]}
          onGestureEvent={panHandler}
          onActivated={onPanStarted}
          onCancelled={onPanEnded}
          onEnded={onPanEnded}
          onFailed={onPanEnded}
          minPointers={minPanPointers}
          maxPointers={maxPanPointers}
          enabled={isPanEnabled && canInteract}
        >
          <Animated.View
            onLayout={onLayout}
            style={[styles.content, imageContainerStyle]}
          >
            <AnimatedImage
              style={[styles.container, style, animatedStyle]}
              source={{ uri }}
              resizeMode="contain"
              onLoadEnd={onImageLoadEnd}
              {...props}
            />
            {isLoading &&
              (renderLoader ? (
                renderLoader()
              ) : (
                <ActivityIndicator
                  size="small"
                  style={styles.loader}
                  color="dimgrey"
                  {...activityIndicatorProps}
                />
              ))}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </PinchGestureHandler>
  );
}
