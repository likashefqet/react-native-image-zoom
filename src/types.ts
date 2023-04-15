import type { ImageProps, ImageSourcePropType } from 'react-native';

export type ImageZoomProps = Omit<ImageProps, 'source'> & {
  /**
   * The image's URI, which can be overridden by the `source` prop.
   * @default ''
   */
  uri?: string;
  /**
   * The minimum scale allowed for zooming.
   * @default 1
   */
  minScale?: number;
  /**
   * The maximum scale allowed for zooming.
   * @default 5
   */
  maxScale?: number;
  /**
   * The minimum number of pointers required to enable panning.
   * @default 2
   */
  minPanPointers?: number;
  /**
   * The maximum number of pointers required to enable panning.
   * @default 2
   */
  maxPanPointers?: number;
  /**
   * A callback triggered when the image interaction starts.
   */
  onInteractionStart?: Function;
  /**
   * A callback triggered when the image interaction ends.
   */
  onInteractionEnd?: Function;
  /**
   * A callback triggered when the image pinching starts.
   */
  onPinchStart?: Function;
  /**
   * A callback triggered when the image pinching ends.
   */
  onPinchEnd?: Function;
  /**
   * A callback triggered when the image panning starts.
   */
  onPanStart?: Function;
  /**
   * A callback triggered when the image panning ends.
   */
  onPanEnd?: Function;
  /**
   * @see https://facebook.github.io/react-native/docs/image.html#source
   * @default undefined
   */
  source?: ImageSourcePropType;
};
