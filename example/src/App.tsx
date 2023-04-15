import React from 'react';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';

// Photo by Walling [https://unsplash.com/photos/XLqiL-rz4V8] on Unsplash [https://unsplash.com/]
const imageUri = 'https://images.unsplash.com/photo-1596003906949-67221c37965c';

function App() {
  return (
    <ImageZoom
      uri={imageUri}
      onInteractionStart={() => console.log('onInteractionStart')}
      onInteractionEnd={() => console.log('onInteractionEnd')}
      onPanStart={() => console.log('onPanStart')}
      onPanEnd={() => console.log('onPanEnd')}
      onPinchStart={() => console.log('onPinchStart')}
      onPinchEnd={() => console.log('onPinchEnd')}
      minScale={0.6}
    />
  );
}

export default gestureHandlerRootHOC(App);
