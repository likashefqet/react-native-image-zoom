import React from 'react';
import { Image } from 'expo-image';
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

const AnimatedImage = Animated.createAnimatedComponent(Image);

const ImageZoom: React.FC<ImageZoomProps> = ({
  uri = '',
  minScale,
  maxScale,
  minPanPointers,
  maxPanPointers,
  isPanEnabled,
  isPinchEnabled,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onResetAnimationEnd,
  onLayout,
  style = {},
  ...props
}) => {
  const { center, onImageLayout } = useImageLayout({ onLayout });
  const { animatedStyle, gestures } = useGestures({
    center,
    minScale,
    maxScale,
    minPanPointers,
    maxPanPointers,
    isPanEnabled,
    isPinchEnabled,
    onInteractionStart,
    onInteractionEnd,
    onPinchStart,
    onPinchEnd,
    onPanStart,
    onPanEnd,
    onResetAnimationEnd,
  });

  return (
    <GestureDetector gesture={gestures}>
      <AnimatedImage
        style={[styles.image, style, animatedStyle]}
        source={{ uri }}
        contentFit="contain"
        onLayout={onImageLayout}
        {...props}
      />
    </GestureDetector>
  );
};

export default ImageZoom;
