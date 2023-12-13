import { useState } from 'react';
export const useImageLayout = ({
  onLayout
}) => {
  const [state, setState] = useState({
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
//# sourceMappingURL=useImageLayout.js.map