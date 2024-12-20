import { useGestures } from '../hooks/useGestures';
import { useZoomableLayout } from '../hooks/useZoomableLayout';
import { useZoomableHandle } from '../hooks/useZoomableHandle';
import type { UseZoomableProps } from '../types';

export const useZoomable = ({
  minScale,
  maxScale,
  scale,
  doubleTapScale,
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
}: UseZoomableProps) => {
  const { width, height, center, onZoomableLayout } = useZoomableLayout({
    onLayout,
  });
  const { animatedStyle, gestures, reset, zoom, getInfo } = useGestures({
    width,
    height,
    center,
    minScale,
    maxScale,
    scale,
    doubleTapScale,
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
  });
  useZoomableHandle(ref, reset, zoom, getInfo);

  return { animatedStyle, gestures, onZoomableLayout };
};
