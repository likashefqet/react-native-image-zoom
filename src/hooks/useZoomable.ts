import { useGestures } from '../hooks/useGestures';
import { useZoomableLayout } from '../hooks/useZoomableLayout';
import { useZoomableHandle } from '../hooks/useZoomableHandle';
import type { UseZoomableProps } from '../types';

export const useZoomable = ({ onLayout, ref, ...props }: UseZoomableProps) => {
  const { width, height, center, onZoomableLayout } = useZoomableLayout({
    onLayout,
  });
  const { animatedStyle, gestures, reset, zoom, getInfo } = useGestures({
    width,
    height,
    center,
    ...props,
  });
  useZoomableHandle(ref, reset, zoom, getInfo);

  return { animatedStyle, gestures, onZoomableLayout };
};
