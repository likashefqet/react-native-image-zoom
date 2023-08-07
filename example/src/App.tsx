import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoom } from '../../src';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    overflow: 'hidden',
  },
});

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ImageZoom
        uri={imageUri}
        minScale={0.5}
        minPanPointers={1}
        onInteractionStart={() => console.log('onInteractionStart')}
        onInteractionEnd={() => console.log('onInteractionEnd')}
        onPanStart={() => console.log('onPanStart')}
        onPanEnd={() => console.log('onPanEnd')}
        onPinchStart={() => console.log('onPinchStart')}
        onPinchEnd={() => console.log('onPinchEnd')}
        style={styles.image}
        resizeMode="cover"
      />
    </SafeAreaView>
  );
}

export default gestureHandlerRootHOC(App);
