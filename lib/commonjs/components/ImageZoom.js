"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ImageZoom;
var _react = _interopRequireWildcard(require("react"));
var _expoImage = require("expo-image");
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _index = require("../helpers/index");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const AnimatedImage = _reactNativeReanimated.default.createAnimatedComponent(_expoImage.Image);
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1
  },
  content: {
    flex: 1,
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden'
  },
  loader: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    backgroundColor: 'whitesmoke'
  }
});
function ImageZoom({
  uri = '',
  minScale = 1,
  maxScale = 5,
  minPanPointers = 2,
  maxPanPointers = 2,
  isPanEnabled = true,
  isPinchEnabled = true,
  onLoadEnd = _index.noop,
  onInteractionStart = _index.noop,
  onInteractionEnd = _index.noop,
  onPinchStart = _index.noop,
  onPinchEnd = _index.noop,
  onPanStart = _index.noop,
  onPanEnd = _index.noop,
  style = {},
  containerStyle = {},
  imageContainerStyle = {},
  activityIndicatorProps = {},
  renderLoader,
  ...props
}) {
  const panRef = (0, _react.useRef)();
  const pinchRef = (0, _react.useRef)();
  const isInteracting = (0, _react.useRef)(false);
  const isPanning = (0, _react.useRef)(false);
  const isPinching = (0, _react.useRef)(false);
  const [isLoading, setIsLoading] = (0, _react.useState)(true);
  const [state, setState] = (0, _react.useState)({
    canInteract: false,
    centerX: 0,
    centerY: 0
  });
  const {
    canInteract,
    centerX,
    centerY
  } = state;
  const scale = (0, _reactNativeReanimated.useSharedValue)(1);
  const initialFocalX = (0, _reactNativeReanimated.useSharedValue)(0);
  const initialFocalY = (0, _reactNativeReanimated.useSharedValue)(0);
  const focalX = (0, _reactNativeReanimated.useSharedValue)(0);
  const focalY = (0, _reactNativeReanimated.useSharedValue)(0);
  const translateX = (0, _reactNativeReanimated.useSharedValue)(0);
  const translateY = (0, _reactNativeReanimated.useSharedValue)(0);
  const onInteractionStarted = () => {
    if (!isInteracting.current) {
      isInteracting.current = true;
      onInteractionStart();
    }
  };
  const onInteractionEnded = () => {
    if (isInteracting.current && !isPinching.current && !isPanning.current) {
      isInteracting.current = false;
      onInteractionEnd();
    }
  };
  const onPinchStarted = () => {
    onInteractionStarted();
    isPinching.current = true;
    onPinchStart();
  };
  const onPinchEnded = () => {
    isPinching.current = false;
    onPinchEnd();
    onInteractionEnded();
  };
  const onPanStarted = () => {
    onInteractionStarted();
    isPanning.current = true;
    onPanStart();
  };
  const onPanEnded = () => {
    isPanning.current = false;
    onPanEnd();
    onInteractionEnded();
  };
  const panHandler = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onActive: event => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
    },
    onFinish: () => {
      translateX.value = (0, _reactNativeReanimated.withTiming)(0);
      translateY.value = (0, _reactNativeReanimated.withTiming)(0);
    }
  });
  const pinchHandler = (0, _reactNativeReanimated.useAnimatedGestureHandler)({
    onStart: event => {
      initialFocalX.value = event.focalX;
      initialFocalY.value = event.focalY;
    },
    onActive: event => {
      // onStart: focalX & focalY result both to 0 on Android
      if (initialFocalX.value === 0 && initialFocalY.value === 0) {
        initialFocalX.value = event.focalX;
        initialFocalY.value = event.focalY;
      }
      scale.value = (0, _index.clamp)(event.scale, minScale, maxScale);
      focalX.value = (centerX - initialFocalX.value) * (scale.value - 1);
      focalY.value = (centerY - initialFocalY.value) * (scale.value - 1);
    },
    onFinish: () => {
      scale.value = (0, _reactNativeReanimated.withTiming)(1);
      focalX.value = (0, _reactNativeReanimated.withTiming)(0);
      focalY.value = (0, _reactNativeReanimated.withTiming)(0);
      initialFocalX.value = 0;
      initialFocalY.value = 0;
    }
  });
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => ({
    transform: [{
      translateX: translateX.value
    }, {
      translateY: translateY.value
    }, {
      translateX: focalX.value
    }, {
      translateY: focalY.value
    }, {
      scale: scale.value
    }]
  }));
  const onLayout = ({
    nativeEvent: {
      layout: {
        x,
        y,
        width,
        height
      }
    }
  }) => {
    setState(current => ({
      ...current,
      canInteract: true,
      centerX: x + width / 2,
      centerY: y + height / 2
    }));
  };
  const onImageLoadEnd = () => {
    onLoadEnd();
    setIsLoading(false);
  };
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PinchGestureHandler, {
    ref: pinchRef,
    simultaneousHandlers: [panRef],
    onGestureEvent: pinchHandler,
    onActivated: onPinchStarted,
    onCancelled: onPinchEnded,
    onEnded: onPinchEnded,
    onFailed: onPinchEnded,
    enabled: isPinchEnabled && canInteract
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    style: [styles.container, containerStyle]
  }, /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.PanGestureHandler, {
    ref: panRef,
    simultaneousHandlers: [pinchRef],
    onGestureEvent: panHandler,
    onActivated: onPanStarted,
    onCancelled: onPanEnded,
    onEnded: onPanEnded,
    onFailed: onPanEnded,
    minPointers: minPanPointers,
    maxPointers: maxPanPointers,
    enabled: isPanEnabled && canInteract
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, {
    onLayout: onLayout,
    style: [styles.content, imageContainerStyle]
  }, /*#__PURE__*/_react.default.createElement(AnimatedImage, _extends({
    style: [styles.container, style, animatedStyle],
    source: {
      uri
    },
    onLoadEnd: onImageLoadEnd
  }, props)), isLoading && (renderLoader ? renderLoader() : /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, _extends({
    size: "small",
    style: styles.loader,
    color: "dimgrey"
  }, activityIndicatorProps)))))));
}
//# sourceMappingURL=ImageZoom.js.map