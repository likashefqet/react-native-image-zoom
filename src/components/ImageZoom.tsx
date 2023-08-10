import React, { forwardRef, useImperativeHandle } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useGestures } from './hooks/useGestures';
import { useImageLayout } from './hooks/useImageLayout';

import type { ImageZoomProps, ImageZoomRef } from './types';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

export default forwardRef(function ImageZoom(
  {
    uri = '',
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
    onLayout,
    style = {},
    children,
    ...props
  }: ImageZoomProps,
  ref
) {
  const { width, height, center, onImageLayout } = useImageLayout({ onLayout });
  const { animatedStyle, gestures, reset } = useGestures({
    width,
    height,
    center,
    minScale,
    maxScale,
    doubleTapScale,
    minPanPointers,
    maxPanPointers,
    isPanEnabled,
    isPinchEnabled,
    isDoubleTapEnabled,
    onInteractionStart,
    onInteractionEnd,
    onPinchStart,
    onPinchEnd,
    onPanStart,
    onPanEnd,
  });

  useImperativeHandle(
    ref,
    (): ImageZoomRef => {
      return {
        reset() {
          reset();
        }
      };
    },
    [reset]
  );
  const AnimatedImageBackground = Animated.createAnimatedComponent(ImageBackground)
  return (
    <GestureDetector gesture={gestures}>
      <Animated.View onLayout={onImageLayout}>
        <AnimatedImageBackground 
          style={[styles.image, style, animatedStyle]}
          source={{ uri }}
          resizeMode="contain"
          {...props}
        >
          {children}
        </AnimatedImageBackground> 
      </Animated.View>
    </GestureDetector>
  );
});
