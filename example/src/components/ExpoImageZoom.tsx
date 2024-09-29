import React, {
  ForwardRefRenderFunction,
  ForwardedRef,
  forwardRef,
} from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  SharedValue,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import { ZOOM_TYPE, Zoomable, ZoomableProps, ZoomableRef } from '../../../src';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const styles = StyleSheet.create({
  image: {
    flex: 1,
    overflow: 'hidden',
  },
});

type Props = {
  uri: string;
  scale?: SharedValue<number>;
  minScale?: number;
  maxScale?: number;
  ref: ForwardedRef<ZoomableRef>;
  setIsZoomed: (value: boolean) => void;
  style?: ZoomableProps['style'];
};

const ExpoImageZoom: ForwardRefRenderFunction<ZoomableRef, Props> = (
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
    <Zoomable
      ref={ref}
      entering={FadeIn}
      exiting={FadeOut}
      layout={Layout}
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
    >
      <AnimatedImage
        entering={FadeIn}
        exiting={FadeOut}
        layout={Layout}
        style={styles.image}
        source={{ uri }}
        contentFit="cover"
      />
      {/* Without Layout Animations
        <Image
          style={styles.image}
          source={{ uri }}
          contentFit="cover"
        />
      */}
    </Zoomable>
  );
};

export default forwardRef(ExpoImageZoom);
