"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useImageLayout = void 0;
var _react = require("react");
const useImageLayout = ({
  onLayout
}) => {
  const [state, setState] = (0, _react.useState)({
    center: {
      x: 0,
      y: 0
    }
  });
  const onImageLayout = event => {
    const {
      x,
      y,
      width,
      height
    } = event.nativeEvent.layout;
    onLayout === null || onLayout === void 0 || onLayout(event);
    setState({
      center: {
        x: x + width / 2,
        y: y + height / 2
      }
    });
  };
  return {
    ...state,
    onImageLayout
  };
};
exports.useImageLayout = useImageLayout;
//# sourceMappingURL=useImageLayout.js.map