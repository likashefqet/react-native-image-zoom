import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
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
  isDoubleTapEnabled,
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
}) => {
  const { center, onImageLayout } = useImageLayout({ onLayout });
  const { animatedStyle, gestures } = useGestures({
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
};

export default ImageZoom;
