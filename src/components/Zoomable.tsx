import React, { forwardRef, ForwardRefRenderFunction } from 'react';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useZoomable } from '../hooks/useZoomable';
import type { ZoomableProps, ZoomableRef } from '../types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Zoomable: ForwardRefRenderFunction<ZoomableRef, ZoomableProps> = (
  {
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
    onProgrammaticZoom,
    onResetAnimationEnd,
    onLayout,
    style = {},
    children,
    ...props
  },
  ref
) => {
  const { animatedStyle, gestures, onZoomableLayout } = useZoomable({
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
    onProgrammaticZoom,
    onResetAnimationEnd,
    onLayout,
    ref,
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View
        style={[styles.container, style, animatedStyle]}
        onLayout={onZoomableLayout}
        {...props}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default forwardRef(Zoomable);
