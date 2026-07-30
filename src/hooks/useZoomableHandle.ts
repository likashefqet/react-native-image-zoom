import { Ref, useImperativeHandle } from 'react';
import type {
  GetInfoCallback,
  ProgrammaticZoomCallback,
  ZoomableRef,
} from '../types';

export const useZoomableHandle = (
  ref: Ref<unknown> | undefined,
  reset: () => void,
  zoom: ProgrammaticZoomCallback,
  getInfo: GetInfoCallback
) => {
  useImperativeHandle(ref, (): ZoomableRef => ({ reset, zoom, getInfo }), [
    reset,
    zoom,
    getInfo,
  ]);
};
