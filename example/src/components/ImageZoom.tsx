import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  forwardRef,
} from 'react';
import { StyleSheet } from 'react-native';
import {
  ImageZoom as RNImagedZoom,
  ZOOM_TYPE,
  ImageZoomRef,
} from '../../../src';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

type ImageZoomProps = {
  uri: string;
  ref: ForwardedRef<ImageZoomRef>;
  setIsZoomed: (value: boolean) => void;
};
const ImageZoom: ForwardRefRenderFunction<ImageZoomRef, ImageZoomProps> = (
  { uri, setIsZoomed },
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
      ref={ref}
      uri={uri}
      minScale={0.5}
      maxScale={5}
      doubleTapScale={3}
      minPanPointers={1}
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
      style={styles.image}
      onResetAnimationEnd={(finished) => {
        console.log('onResetAnimationEnd', finished);
        onAnimationEnd(finished);
      }}
      resizeMode="cover"
    />
  );
};

export default forwardRef(ImageZoom);
