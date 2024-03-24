import { useRef } from 'react';

export const usePanGestureCount = () => {
  const panGestureCount = useRef(0);

  const isPanning = () => panGestureCount.current > 0;
  const startPan = () => panGestureCount.current++;
  const endPan = () => panGestureCount.current > 0 && panGestureCount.current--;

  return { isPanning, startPan, endPan };
};
