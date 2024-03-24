import React from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

import { useGestures } from '../hooks/useGestures';
import { useImageLayout } from '../hooks/useImageLayout';

import type { ImageZoomProps } from '../types';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

const ImageZoom: React.FC<ImageZoomProps> = ({
  uri = '',
  minScale,
  maxScale,
  doubleTapScale,
  minPanPointers,
  maxPanPointers,
  isPanEnabled,
  isPinchEnabled,
  isSingleTapEnabled,
  isDoubleTapEnabled,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onSingleTap,
  onDoubleTap,
  onResetAnimationEnd,
  onLayout,
  style = {},
  ...props
}) => {
  const { width, height, center, onImageLayout } = useImageLayout({ onLayout });
  const { animatedStyle, gestures } = useGestures({
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
    isSingleTapEnabled,
    isDoubleTapEnabled,
    onInteractionStart,
    onInteractionEnd,
    onPinchStart,
    onPinchEnd,
    onPanStart,
    onPanEnd,
    onSingleTap,
    onDoubleTap,
    onResetAnimationEnd,
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.Image
        style={[styles.image, style, animatedStyle]}
        source={{ uri }}
        resizeMode="contain"
        onLayout={onImageLayout}
        {...props}
      />
    </GestureDetector>
  );
};

export default ImageZoom;
