import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoom } from 'react-native-image-zoom';

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black',
  },
});

function App() {
  return (
    <>
      <StatusBar hidden />
      <ImageZoom
        uri={imageUri + `?date=${new Date()}`}
        containerStyle={styles.container}
        activityIndicatorProps={{
          color: 'white',
          style: styles.loader,
        }}
      />
    </>
  );
}

export default gestureHandlerRootHOC(App);
