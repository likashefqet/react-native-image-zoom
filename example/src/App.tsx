import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Button } from 'react-native';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoom } from '../../src';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    overflow: 'hidden',
  },
  buttonContainer: {
    zIndex: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'yellow',
  },
});

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

function App() {
  const [isVisible, setVisible] = useState(true);

  const onAnimationStart = () => {
    setVisible(false);
  };

  const onAnimationEnd = (finished?: boolean) => {
    if (finished) {
      setVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageZoom
        uri={imageUri}
        minScale={0.5}
        minPanPointers={2}
        onInteractionStart={() => {
          console.log('onInteractionStart');
          onAnimationStart();
        }}
        onInteractionEnd={() => console.log('onInteractionEnd')}
        onPanStart={() => console.log('onPanStart')}
        onPanEnd={() => console.log('onPanEnd')}
        onPinchStart={() => console.log('onPinchStart')}
        onPinchEnd={() => console.log('onPinchEnd')}
        style={styles.image}
        onResetAnimationEnd={(finished) => {
          onAnimationEnd(finished);
        }}
        resizeMode="cover"
      />
      {isVisible && (
        <View style={styles.buttonContainer}>
          <Button title="BUTTON" />
        </View>
      )}
    </SafeAreaView>
  );
}

export default gestureHandlerRootHOC(App);
