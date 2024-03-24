import { Ref, useImperativeHandle } from 'react';
import { ImageZoomRef } from '../types';

export const useImageZoomHandle = (
  ref: Ref<unknown> | undefined,
  reset: () => void
) => {
  useImperativeHandle(
    ref,
    (): ImageZoomRef => ({
      reset() {
        reset();
      },
    }),
    [reset]
  );
};
