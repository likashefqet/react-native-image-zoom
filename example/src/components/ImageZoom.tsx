import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  forwardRef,
} from 'react';
import { StyleSheet } from 'react-native';
import { FadeIn, FadeOut, Layout, SharedValue } from 'react-native-reanimated';
import {
  ImageZoom as RNImagedZoom,
  ZOOM_TYPE,
  ImageZoomRef,
  ImageZoomProps,
} from '../../../src';

const styles = StyleSheet.create({
  image: { flex: 1 },
});

type Props = {
  uri: string;
  scale?: SharedValue<number>;
  minScale?: number;
  maxScale?: number;
  ref: ForwardedRef<ImageZoomRef>;
  setIsZoomed: (value: boolean) => void;
  style?: ImageZoomProps['style'];
};
const ImageZoom: ForwardRefRenderFunction<ImageZoomRef, Props> = (
  { uri, scale, minScale = 0.5, maxScale = 5, setIsZoomed, style },
  ref
) => {
  const onZoom = (zoomType?: ZOOM_TYPE) => {
    if (!zoomType || zoomType === ZOOM_TYPE.ZOOM_IN) {
      setIsZoomed(true);
    }
  };

  const onAnimationEnd = (finished?: boolean) => {
    if (finished) {
      setIsZoomed(false);
    }
  };

  return (
    <RNImagedZoom
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
      ref={ref}
      uri={uri}
      minScale={minScale}
      maxScale={maxScale}
      scale={scale}
      doubleTapScale={3}
      isSingleTapEnabled
      isDoubleTapEnabled
      onInteractionStart={() => {
        console.log('onInteractionStart');
        onZoom();
      }}
      onInteractionEnd={() => console.log('onInteractionEnd')}
      onPanStart={() => console.log('onPanStart')}
      onPanEnd={() => console.log('onPanEnd')}
      onPinchStart={() => console.log('onPinchStart')}
      onPinchEnd={() => console.log('onPinchEnd')}
      onSingleTap={() => console.log('onSingleTap')}
      onDoubleTap={(zoomType) => {
        console.log('onDoubleTap', zoomType);
        onZoom(zoomType);
      }}
      onProgrammaticZoom={(zoomType) => {
        console.log('onZoom', zoomType);
        onZoom(zoomType);
      }}
      style={[styles.image, style]}
      onResetAnimationEnd={(finished, values) => {
        console.log('onResetAnimationEnd', finished);
        console.log('lastScaleValue:', values?.SCALE.lastValue);
        onAnimationEnd(finished);
      }}
      resizeMode="cover"
    />
  );
};

export default forwardRef(ImageZoom);
