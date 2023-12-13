function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
import React from 'react';
import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useGestures } from '../hooks/useGestures';
import { useImageLayout } from '../hooks/useImageLayout';
const styles = StyleSheet.create({
  image: {
    flex: 1
  }
});
const AnimatedImage = Animated.createAnimatedComponent(Image);
const ImageZoom = ({
  uri = '',
  minScale,
  maxScale,
  minPanPointers,
  maxPanPointers,
  isPanEnabled,
  isPinchEnabled,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd,
  onLayout,
  style = {},
  ...props
}) => {
  const {
    center,
    onImageLayout
  } = useImageLayout({
    onLayout
  });
  const {
    animatedStyle,
    gestures
  } = useGestures({
    center,
    minScale,
    maxScale,
    minPanPointers,
    maxPanPointers,
    isPanEnabled,
    isPinchEnabled,
    onInteractionStart,
    onInteractionEnd,
    onPinchStart,
    onPinchEnd,
    onPanStart,
    onPanEnd
  });
  return /*#__PURE__*/React.createElement(GestureDetector, {
    gesture: gestures
  }, /*#__PURE__*/React.createElement(Animated.View, _extends({
    onLayout: onImageLayout,
    style: [styles.image, style, animatedStyle]
  }, props), /*#__PURE__*/React.createElement(AnimatedImage, {
    style: [styles.image, style],
    source: {
      uri
    }
  })));
};
export default ImageZoom;
//# sourceMappingURL=ImageZoom.js.map