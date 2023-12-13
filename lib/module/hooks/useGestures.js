import { useCallback, useRef } from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { clamp } from '../utils/clamp';
export const useGestures = ({
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
  const isInteracting = useRef(false);
  const isPanning = useRef(false);
  const isPinching = useRef(false);
  const scale = useSharedValue(1);
  const initialFocal = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
  const focal = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
  const translate = {
    x: useSharedValue(0),
    y: useSharedValue(0)
  };
  const reset = useCallback(() => {
    'worklet';

    scale.value = withTiming(1);
    initialFocal.x.value = 0;
    initialFocal.y.value = 0;
    focal.x.value = withTiming(0);
    focal.y.value = withTiming(0);
    translate.x.value = withTiming(0);
    translate.y.value = withTiming(0);
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
  const panGesture = Gesture.Pan().enabled(isPanEnabled).minPointers(minPanPointers).maxPointers(maxPanPointers).onStart(() => {
    runOnJS(onPanStarted)();
  }).onUpdate(event => {
    translate.x.value = event.translationX;
    translate.y.value = event.translationY;
  }).onEnd(() => {
    runOnJS(onPanEnded)();
  });
  const pinchGesture = Gesture.Pinch().enabled(isPinchEnabled).onStart(event => {
    runOnJS(onPinchStarted)();
    initialFocal.x.value = event.focalX;
    initialFocal.y.value = event.focalY;
  }).onUpdate(event => {
    scale.value = clamp(event.scale, minScale, maxScale);
    focal.x.value = (center.x - initialFocal.x.value) * (scale.value - 1);
    focal.y.value = (center.y - initialFocal.y.value) * (scale.value - 1);
  }).onEnd(() => {
    runOnJS(onPinchEnded)();
  });
  const animatedStyle = useAnimatedStyle(() => ({
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
  const gestures = Gesture.Simultaneous(pinchGesture, panGesture);
  return {
    gestures,
    animatedStyle
  };
};
//# sourceMappingURL=useGestures.js.map