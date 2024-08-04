import React, { useRef, useState } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoomRef } from '../../src';
import ExpoImageZoom from './components/ExpoImageZoom';
import ImageZoom from './components/ImageZoom';
import safeAreaContextProviderHOC from './safeAreaContextProviderHOC';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    overflow: 'hidden',
  },
  button: {
    zIndex: 10,
    position: 'absolute',
    right: 8,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.64)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: 'yellow',
  },
  zoomInButton: {
    bottom: 48,
  },
  zoomOutButton: {
    top: 48,
  },
  switchComponentButton: {
    right: undefined,
    left: 8,
  },
  circle: {
    position: 'absolute',
    top: 491,
    left: 146,
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 12,
    borderColor: 'yellow',
    transform: [{ translateX: -12 }, { translateY: -12 }],
  },
  buttonText: {
    fontWeight: 'bold',
  },
});

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

function App() {
  const imageZoomRef = useRef<ImageZoomRef>(null);
  const { top, bottom } = useSafeAreaInsets();
  const [useCustomComponent, setUseCustomComponent] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  return (
    <View style={styles.container}>
      {useCustomComponent ? (
        <ExpoImageZoom
          ref={imageZoomRef}
          uri={imageUri}
          setIsZoomed={setIsZoomed}
        />
      ) : (
        <ImageZoom
          ref={imageZoomRef}
          uri={imageUri}
          setIsZoomed={setIsZoomed}
        />
      )}
      <Pressable
        onPress={() => {
          setUseCustomComponent((current) => !current);
        }}
        style={[styles.button, styles.switchComponentButton, { top: top + 16 }]}
      >
        <Text style={styles.buttonText}>
          Use {useCustomComponent ? 'React Native Image' : 'Expo Image'}
        </Text>
      </Pressable>

      {isZoomed ? (
        <Pressable
          onPress={() => {
            imageZoomRef?.current?.reset();
          }}
          style={[styles.button, { top: top + 16 }]}
        >
          <Text style={styles.buttonText}>Zoom Out</Text>
        </Pressable>
      ) : (
        <>
          <View pointerEvents="none" style={styles.circle} />
          <Pressable
            onPress={() => {
              imageZoomRef?.current?.zoom({ scale: 5, x: 146, y: 491 });
            }}
            style={[styles.button, { bottom: bottom + 16 }]}
          >
            <Text style={styles.buttonText}>Zoom In the 🟡 Circle</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

export default safeAreaContextProviderHOC(gestureHandlerRootHOC(App));
