"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useGestures = void 0;
var _react = require("react");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = require("react-native-reanimated");
var _clamp = require("../utils/clamp");
const useGestures = ({
  center,
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onInteractionStart,
  onInteractionEnd,
  onPinchStart,
  onPinchEnd,
  onPanStart,
  onPanEnd
}) => {
  const isInteracting = (0, _react.useRef)(false);
  const isPanning = (0, _react.useRef)(false);
  const isPinching = (0, _react.useRef)(false);
  const scale = (0, _reactNativeReanimated.useSharedValue)(1);
  const initialFocal = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const focal = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const translate = {
    x: (0, _reactNativeReanimated.useSharedValue)(0),
    y: (0, _reactNativeReanimated.useSharedValue)(0)
  };
  const reset = (0, _react.useCallback)(() => {
    'worklet';

    scale.value = (0, _reactNativeReanimated.withTiming)(1);
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    focal.x.value = (0, _reactNativeReanimated.withTiming)(0);
    focal.y.value = (0, _reactNativeReanimated.withTiming)(0);
    translate.x.value = (0, _reactNativeReanimated.withTiming)(0);
    translate.y.value = (0, _reactNativeReanimated.withTiming)(0);
  }, [focal.x, focal.y, initialFocal.x, initialFocal.y, scale, translate.x, translate.y]);
  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart === null || onInteractionStart === void 0 || onInteractionStart();
    }
  };
  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
      reset();
      isInteracting.current = false;
      onInteractionEnd === null || onInteractionEnd === void 0 || onInteractionEnd();
    }
  };
  const onPinchStarted = () => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart === null || onPinchStart === void 0 || onPinchStart();
  };
  const onPinchEnded = () => {
    isPinching.current = false;
    onPinchEnd === null || onPinchEnd === void 0 || onPinchEnd();
    onInteractionEnded();
  };
  const onPanStarted = () => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart === null || onPanStart === void 0 || onPanStart();
  };
  const onPanEnded = () => {
    isPanning.current = false;
    onPanEnd === null || onPanEnd === void 0 || onPanEnd();
    onInteractionEnded();
  };
  const panGesture = _reactNativeGestureHandler.Gesture.Pan().enabled(isPanEnabled).minPointers(minPanPointers).maxPointers(maxPanPointers).onStart(() => {
    (0, _reactNativeReanimated.runOnJS)(onPanStarted)();
  }).onUpdate(event => {
    translate.x.value = event.translationX;
    translate.y.value = event.translationY;
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(onPanEnded)();
  });
  const pinchGesture = _reactNativeGestureHandler.Gesture.Pinch().enabled(isPinchEnabled).onStart(event => {
    (0, _reactNativeReanimated.runOnJS)(onPinchStarted)();
    initialFocal.x.value = event.focalX;
    initialFocal.y.value = event.focalY;
  }).onUpdate(event => {
    scale.value = (0, _clamp.clamp)(event.scale, minScale, maxScale);
    focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
    focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
  }).onEnd(() => {
    (0, _reactNativeReanimated.runOnJS)(onPinchEnded)();
  });
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateX: translate.x.value
    }, {
      translateY: translate.y.value
    }, {
      translateX: focal.x.value
    }, {
      translateY: focal.y.value
    }, {
      scale: scale.value
    }]
  }));
  const gestures = _reactNativeGestureHandler.Gesture.Simultaneous(pinchGesture, panGesture);
  return {
    gestures,
    animatedStyle
  };
};
exports.useGestures = useGestures;
//# sourceMappingURL=useGestures.js.map