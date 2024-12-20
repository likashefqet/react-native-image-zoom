import React, { useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text, Alert } from 'react-native';
import Animated, {
  useSharedValue,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoomRef } from '../../../src';
import { AnimatedCircle } from '../components/AnimatedCircle';
import ImageZoom from '../components/ImageZoom';
import { COLORS } from '../themes/colors';

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const IMAGE_URI =
  'https://images.unsplash.com/photo-1596003906949-67221c37965c';
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_IN_X = 146;
const ZOOM_IN_Y = 491;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ImageZoomTab = () => {
  const imageZoomRef = useRef<ImageZoomRef>(null);
  const { top, bottom } = useSafeAreaInsets();

  const scale = useSharedValue(1);

  const [isZoomed, setIsZoomed] = useState(false);

  const zoomIn = () => {
    imageZoomRef?.current?.zoom({ scale: 5, x: ZOOM_IN_X, y: ZOOM_IN_Y });
  };
  const zoomOut = () => {
    imageZoomRef?.current?.reset();
  };

  const getInfo = () => {
    const info = imageZoomRef?.current?.getInfo();
    Alert.alert('Info', JSON.stringify(info, null, 2));
  };

  const animatedStyle = useAnimatedStyle(
    () => ({
      borderRadius: 30 / scale.value,
    }),
    [scale]
  );

  return (
    <View style={styles.container}>
      <ImageZoom
        ref={imageZoomRef}
        uri={IMAGE_URI}
        scale={scale}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        setIsZoomed={setIsZoomed}
        style={animatedStyle}
      />
      {isZoomed ? (
        <>
          <AnimatedPressable
            onPress={zoomOut}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout}
            style={[styles.button, { top: top + 8 }]}
          >
            <Text style={styles.buttonText}>Zoom Out</Text>
          </AnimatedPressable>
          <AnimatedCircle
            size={50}
            scale={scale}
            minScale={1}
            maxScale={MAX_SCALE}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout}
            style={[styles.progressCircle, { bottom: bottom + 8 }]}
          />
        </>
      ) : (
        <>
          <View pointerEvents="none" style={styles.zoomInCircle} />
          <AnimatedPressable
            onPress={zoomIn}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout}
            style={[styles.button, styles.leftButton, { bottom: bottom + 8 }]}
          >
            <Text style={styles.buttonText}>Zoom In the 🟡 Circle</Text>
          </AnimatedPressable>
        </>
      )}
      <AnimatedPressable
        onPress={getInfo}
        entering={FadeIn}
        exiting={FadeOut}
        layout={Layout}
        style={[styles.button, styles.leftButton, { bottom: bottom + 64 }]}
      >
        <Text style={styles.buttonText}>Info</Text>
      </AnimatedPressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    position: 'absolute',
    zIndex: 10,
    right: 8,
    height: 40,
    justifyContent: 'center',
    backgroundColor: COLORS.mainDarkAlpha(0.16),
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: COLORS.accent,
  },
  leftButton: {
    right: undefined,
    left: 8,
  },
  zoomInCircle: {
    position: 'absolute',
    top: ZOOM_IN_Y,
    left: ZOOM_IN_X,
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: COLORS.accent,
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  buttonText: {
    fontWeight: 'bold',
    color: COLORS.white,
  },
  progressCircle: {
    position: 'absolute',
    left: 16,
    bottom: 16,
  },
});
