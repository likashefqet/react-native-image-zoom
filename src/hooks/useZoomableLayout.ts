import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import type { ZoomableLayoutState, ZoomableUseLayoutProps } from '../types';

export const useZoomableLayout = ({ onLayout }: ZoomableUseLayoutProps) => {
  const [state, setState] = useState<ZoomableLayoutState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    center: { x: 0, y: 0 },
  });

  const onZoomableLayout = (event: LayoutChangeEvent) => {
    const { layout } = event.nativeEvent;
    const { x, y, width, height } = layout;
    const center = {
      x: x + width / 2,
      y: y + height / 2,
    };

    if (typeof onLayout === 'function') {
      onLayout(event);
    }

    setState({ ...layout, center });
  };

  return { ...state, onZoomableLayout };
};
