import { useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';

import type { ImageZoomLayoutState, ImageZoomUseLayoutProps } from '../types';

export const useImageLayout = ({ onLayout }: ImageZoomUseLayoutProps) => {
  const [state, setState] = useState<ImageZoomLayoutState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    center: { x: 0, y: 0 },
  });

  const onImageLayout = (event: LayoutChangeEvent) => {
    onLayout?.(event);
    const {
      nativeEvent: { layout },
    } = event;
    const { x, y, width, height } = layout;
    setState({
      ...layout,
      center: {
        x: x + width / 2,
        y: y + height / 2,
      },
    });
  };
  return { ...state, onImageLayout };
};
