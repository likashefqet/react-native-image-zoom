"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _expoImage = require("expo-image");
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireDefault(require("react-native-reanimated"));
var _useGestures = require("../hooks/useGestures");
var _useImageLayout = require("../hooks/useImageLayout");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
const styles = _reactNative.StyleSheet.create({
  image: {
    flex: 1
  }
});
const AnimatedImage = _reactNativeReanimated.default.createAnimatedComponent(_expoImage.Image);
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
  } = (0, _useImageLayout.useImageLayout)({
    onLayout
  });
  const {
    animatedStyle,
    gestures
  } = (0, _useGestures.useGestures)({
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
  return /*#__PURE__*/_react.default.createElement(_reactNativeGestureHandler.GestureDetector, {
    gesture: gestures
  }, /*#__PURE__*/_react.default.createElement(_reactNativeReanimated.default.View, _extends({
    onLayout: onImageLayout,
    style: [styles.image, style, animatedStyle]
  }, props), /*#__PURE__*/_react.default.createElement(AnimatedImage, {
    style: [styles.image, style],
    source: {
      uri
    }
  })));
};
var _default = exports.default = ImageZoom;
//# sourceMappingURL=ImageZoom.js.map