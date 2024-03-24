import type {
  ImageProps,
  ImageSourcePropType,
  LayoutRectangle,
} from 'react-native';
import type {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { AnimatableValue } from 'react-native-reanimated';

export type OnPinchStartCallback = (
  event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>
) => void;

export type OnPinchEndCallback = (
  event: GestureStateChangeEvent<PinchGestureHandlerEventPayload>,
  success: boolean
) => void;

export type OnPanStartCallback = (
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>
) => void;

export type OnPanEndCallback = (
  event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  success: boolean
) => void;

export type OnSingleTapCallback = (
  event: GestureStateChangeEvent<TapGestureHandlerEventPayload>
) => void;

export enum ZOOM_TYPE {
  ZOOM_IN = 'ZOOM_IN',
  ZOOM_OUT = 'ZOOM_OUT',
}

export type OnDoubleTapCallback = (zoomType: ZOOM_TYPE) => void;

export enum ANIMATION_VALUE {
  SCALE = 'SCALE',
  FOCAL_X = 'FOCAL_X',
  FOCAL_Y = 'FOCAL_Y',
  TRANSLATE_X = 'TRANSLATE_X',
  TRANSLATE_Y = 'TRANSLATE_Y',
}

export type OnResetAnimationEndCallback = (
  finished?: boolean,
  values?: Record<
    ANIMATION_VALUE,
    {
      finished?: boolean;
      current?: AnimatableValue;
    }
  >
) => void;

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
   * The value of the image scale when a double-tap gesture is detected.
   * @default 3
   */
  doubleTapScale?: number;
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
   * Determines whether panning is enabled within the range of the minimum and maximum pan pointers.
   * @default true
   */
  isPanEnabled?: boolean;
  /**
   * Determines whether pinching is enabled.
   * @default true
   */
  isPinchEnabled?: boolean;
  /**
   * Enables or disables the single tap feature.
   * @default false
   */
  isSingleTapEnabled?: boolean;
  /**
   * Enables or disables the double tap feature.
   * When enabled, this feature prevents automatic reset of the image zoom to its initial position, allowing continuous zooming.
   * To return to the initial position, double tap again or zoom out to a scale level less than 1.
   * @default false
   */
  isDoubleTapEnabled?: boolean;
  /**
   * A callback triggered when the image interaction starts.
   */
  onInteractionStart?: () => void;
  /**
   * A callback triggered when the image interaction ends.
   */
  onInteractionEnd?: () => void;
  /**
   * A callback triggered when the image pinching starts.
   */
  onPinchStart?: OnPinchStartCallback;
  /**
   * A callback triggered when the image pinching ends.
   */
  onPinchEnd?: OnPinchEndCallback;
  /**
   * A callback triggered when the image panning starts.
   */
  onPanStart?: OnPanStartCallback;
  /**
   * A callback triggered when the image panning ends.
   */
  onPanEnd?: OnPanEndCallback;
  /**
   * A callback triggered when a single tap is detected.
   */
  onSingleTap?: OnSingleTapCallback;
  /**
   * A callback triggered when a double tap gesture is detected.
   */
  onDoubleTap?: OnDoubleTapCallback;
  /**
   * A callback triggered when the image panning ends.
   */
  onResetAnimationEnd?: OnResetAnimationEndCallback;
  /**
   * @see https://facebook.github.io/react-native/docs/image.html#source
   * @default undefined
   */
  source?: ImageSourcePropType;
};

export type ImageZoomUseLayoutProps = Pick<ImageZoomProps, 'onLayout'>;

export type ImageZoomLayoutState = LayoutRectangle & {
  /**
   * An object containing the x and y coordinates of the center point of the image, relative to the top-left corner of the container.
   */
  center: {
    /**
     * The x-coordinate of the center point of the image.
     */
    x: number;
    /**
     * The y-coordinate of the center point of the image.
     */
    y: number;
  };
};

export type ImageZoomUseGesturesProps = Pick<
  ImageZoomLayoutState,
  'width' | 'height' | 'center'
> &
  Pick<
    ImageZoomProps,
    | 'minScale'
    | 'maxScale'
    | 'doubleTapScale'
    | 'minPanPointers'
    | 'maxPanPointers'
    | 'isPanEnabled'
    | 'isPinchEnabled'
    | 'isSingleTapEnabled'
    | 'isDoubleTapEnabled'
    | 'onInteractionStart'
    | 'onInteractionEnd'
    | 'onPinchStart'
    | 'onPinchEnd'
    | 'onPanStart'
    | 'onPanEnd'
    | 'onSingleTap'
    | 'onDoubleTap'
    | 'onResetAnimationEnd'
  >;

export type ImageZoomRef = {
  /**
   * Resets the image zoom level to its original scale.
   */
  reset: () => void;
};
