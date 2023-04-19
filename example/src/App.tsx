import React, { useRef } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoom, ImageZoomRef } from '../../src';
import Button from './Button';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 24,
  },
  image: {
    overflow: 'hidden',
    marginBottom: 24,
  },
});

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

function App() {
  const imageRef = useRef<ImageZoomRef>();

  return (
    <SafeAreaView style={styles.container}>
      <ImageZoom
        ref={imageRef}
        uri={imageUri}
        minScale={0.5}
        minPanPointers={1}
        isDoubleTapEnabled
        onInteractionStart={() => console.log('onInteractionStart')}
        onInteractionEnd={() => console.log('onInteractionEnd')}
        onPanStart={() => console.log('onPanStart')}
        onPanEnd={() => console.log('onPanEnd')}
        onPinchStart={() => console.log('onPinchStart')}
        onPinchEnd={() => console.log('onPinchEnd')}
        style={styles.image}
        resizeMode="cover"
      />
      <Button title="Reset" onPress={() => imageRef.current?.reset()} />
    </SafeAreaView>
  );
}

export default gestureHandlerRootHOC(App);
