import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  forwardRef,
} from 'react';
import { StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { ZOOM_TYPE, Zoomable, ZoomableRef } from '../../../src';

const styles = StyleSheet.create({
  image: {
    flex: 1,
  },
});

type ExpoImageZoomProps = {
  uri: string;
  ref: ForwardedRef<ZoomableRef>;
  setIsZoomed: (value: boolean) => void;
};

const ExpoImageZoom: ForwardRefRenderFunction<
  ZoomableRef,
  ExpoImageZoomProps
> = ({ uri, setIsZoomed }, ref) => {
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
    <Zoomable
      ref={ref}
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
    >
      <Image style={styles.image} source={{ uri }} contentFit="cover" />
    </Zoomable>
  );
};

export default forwardRef(ExpoImageZoom);
