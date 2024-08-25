import React, { useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ImageZoomRef } from '../../src';
import { AnimatedCircle } from './components/AnimatedCircle';
import ExpoImageZoom from './components/ExpoImageZoom';
import ImageZoom from './components/ImageZoom';
import safeAreaContextProviderHOC from './safeAreaContextProviderHOC';
import { COLORS } from './themes/colors';

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const IMAGE_URI =
  'https://images.unsplash.com/photo-1596003906949-67221c37965c';
const MIN_SCALE = 0.5;
const MAX_SCALE = 5;
const ZOOM_IN_X = 146;
const ZOOM_IN_Y = 491;

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const FadeInAnimation = FadeIn.duration(256);
const FadeOutAnimation = FadeOut.duration(256);

function App() {
  const imageZoomRef = useRef<ImageZoomRef>(null);
  const { top, bottom } = useSafeAreaInsets();

  const scale = useSharedValue(1);

  const [useCustomComponent, setUseCustomComponent] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const toggleComponent = () => {
    setUseCustomComponent((current) => !current);
  };
  const zoomIn = () => {
    imageZoomRef?.current?.zoom({ scale: 5, x: ZOOM_IN_X, y: ZOOM_IN_Y });
  };
  const zoomOut = () => {
    imageZoomRef?.current?.reset();
  };

  return (
    <View style={styles.container}>
      {useCustomComponent ? (
        <ExpoImageZoom
          ref={imageZoomRef}
          uri={IMAGE_URI}
          scale={scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          setIsZoomed={setIsZoomed}
        />
      ) : (
        <ImageZoom
          ref={imageZoomRef}
          uri={IMAGE_URI}
          scale={scale}
          minScale={MIN_SCALE}
          maxScale={MAX_SCALE}
          setIsZoomed={setIsZoomed}
        />
      )}
      <AnimatedPressable
        onPress={toggleComponent}
        entering={FadeInAnimation}
        exiting={FadeOutAnimation}
        style={[styles.button, styles.switchComponentButton, { top: top + 8 }]}
      >
        <Text style={styles.buttonText}>
          Use {useCustomComponent ? 'React Native Image' : 'Expo Image'}
        </Text>
      </AnimatedPressable>

      {isZoomed ? (
        <>
          <AnimatedPressable
            onPress={zoomOut}
            entering={FadeInAnimation}
            exiting={FadeOutAnimation}
            style={[styles.button, { top: top + 8 }]}
          >
            <Text style={styles.buttonText}>Zoom Out</Text>
          </AnimatedPressable>
          <AnimatedCircle
            size={50}
            scale={scale}
            minScale={1}
            maxScale={MAX_SCALE}
            entering={FadeInAnimation}
            exiting={FadeOutAnimation}
            style={[styles.progressCircle, { bottom: bottom + 8 }]}
          />
        </>
      ) : (
        <>
          <View pointerEvents="none" style={styles.zoomInCircle} />
          <AnimatedPressable
            onPress={zoomIn}
            entering={FadeInAnimation}
            exiting={FadeOutAnimation}
            style={[styles.button, { bottom: bottom + 8 }]}
          >
            <Text style={styles.buttonText}>Zoom In the 🟡 Circle</Text>
          </AnimatedPressable>
        </>
      )}
    </View>
  );
}

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
  switchComponentButton: {
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

export default safeAreaContextProviderHOC(gestureHandlerRootHOC(App));
