import { Ref, useImperativeHandle } from 'react';
import type { ProgrammaticZoomCallback, ZoomableRef } from '../types';

export const useZoomableHandle = (
  ref: Ref<unknown> | undefined,
  reset: () => void,
  zoom: ProgrammaticZoomCallback
) => {
  useImperativeHandle(
    ref,
    (): ZoomableRef => ({
      reset() {
        reset();
      },
      zoom(event) {
        zoom(event);
      },
    }),
    [reset, zoom]
  );
};
