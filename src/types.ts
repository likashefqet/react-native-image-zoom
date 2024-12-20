import { ForwardedRef } from 'react';
import type {
  ImageProps,
  ImageSourcePropType,
  LayoutRectangle,
  ViewProps,
} from 'react-native';
import type {
  GestureStateChangeEvent,
  PanGestureHandlerEventPayload,
  PinchGestureHandlerEventPayload,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {
  AnimatableValue,
  AnimateProps,
  SharedValue,
} from 'react-native-reanimated';

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

export type ProgrammaticZoomCallback = (event: {
  scale: number;
  x: number;
  y: number;
}) => void;

export type OnDoubleTapCallback = (zoomType: ZOOM_TYPE) => void;
export type OnProgrammaticZoomCallback = (zoomType: ZOOM_TYPE) => void;

export type GetInfoCallback = () => {
  container: {
    width: number;
    height: number;
    center: { x: number; y: number };
  };
  scaledSize: {
    width: number;
    height: number;
  };
  visibleArea: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  transformations: {
    translateX: number;
    translateY: number;
    scale: number;
  };
};

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
      lastValue: number;
      finished?: boolean;
      current?: AnimatableValue;
    }
  >
) => void;

export type ZoomProps = {
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
   * The `scale` property allows you to provide your own Reanimated shared value for scale.
   * This shared value will be updated as the zoom level changes, enabling you to use the
   * current scale in your own code.
   * @default useSharedValue(1)
   */
  scale?: SharedValue<number>;
  /**
   * The value of the scale when a double-tap gesture is detected.
   * @default 3
   */
  doubleTapScale?: number;
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
   * When enabled, this feature prevents automatic reset of the zoom to its initial position, allowing continuous zooming.
   * To return to the initial position, double tap again or zoom out to a scale level less than 1.
   * @default false
   */
  isDoubleTapEnabled?: boolean;
  /**
   * A callback triggered when the interaction starts.
   */
  onInteractionStart?: () => void;
  /**
   * A callback triggered when the interaction ends.
   */
  onInteractionEnd?: () => void;
  /**
   * A callback triggered when the pinching starts.
   */
  onPinchStart?: OnPinchStartCallback;
  /**
   * A callback triggered when the pinching ends.
   */
  onPinchEnd?: OnPinchEndCallback;
  /**
   * A callback triggered when the panning starts.
   */
  onPanStart?: OnPanStartCallback;
  /**
   * A callback triggered when the panning ends.
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
   * A callback function that is invoked when a programmatic zoom event occurs.
   */
  onProgrammaticZoom?: OnProgrammaticZoomCallback;
  /**
   * A callback triggered upon the completion of the reset animation. It accepts two parameters: finished and values.
   * The finished parameter evaluates to true if all animation values have successfully completed the reset animation;
   * otherwise, it is false, indicating interruption by another gesture or unforeseen circumstances.
   * The values parameter provides additional detailed information for each animation value.
   */
  onResetAnimationEnd?: OnResetAnimationEndCallback;
};

export type ZoomableProps = AnimateProps<ViewProps> & ZoomProps;

export type UseZoomableProps = ZoomProps & {
  ref: ForwardedRef<ZoomableRef>;
  /**
   * Invoked on mount and layout changes with
   *
   * {nativeEvent: { layout: {x, y, width, height}}}.
   */
  onLayout?: ZoomableProps['onLayout'];
};

export type ImageZoomProps = Omit<AnimateProps<ImageProps>, 'source'> &
  ZoomProps & {
    /**
     * The image's URI, which can be overridden by the `source` prop.
     * @default ''
     */
    uri?: string;
    /**
     * @see https://facebook.github.io/react-native/docs/image.html#source
     * @default undefined
     */
    source?: ImageSourcePropType;
  };

export type ZoomableUseLayoutProps = Pick<ZoomableProps, 'onLayout'>;

export type ZoomableLayoutState = LayoutRectangle & {
  /**
   * An object containing the x and y coordinates of the center point of the view, relative to the top-left corner of the container.
   */
  center: {
    /**
     * The x-coordinate of the center point of the view.
     */
    x: number;
    /**
     * The y-coordinate of the center point of the view.
     */
    y: number;
  };
};

export type ZoomableUseGesturesProps = Pick<
  ZoomableLayoutState,
  'width' | 'height' | 'center'
> &
  Pick<
    ZoomableProps,
    | 'minScale'
    | 'maxScale'
    | 'scale'
    | 'doubleTapScale'
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
    | 'onProgrammaticZoom'
    | 'onResetAnimationEnd'
  >;

export type ZoomableRef = {
  /**
   * Resets the zoom level to its original scale.
   */
  reset: () => void;
  /**
   * Triggers a zoom event to the specified coordinates (x, y) at the defined scale level.
   */
  zoom: ProgrammaticZoomCallback;
  /**
   * Retrieves detailed information about the zoomable component, including container dimensions,
   * scaled size, visible area (relative to the scaled component), and transformation values.
   *
   * @returns An object containing:
   * - `container`: The original container's dimensions and center point.
   *   - `width`: The width of the container.
   *   - `height`: The height of the container.
   *   - `center`: The center coordinates of the container.
   * - `scaledSize`: The dimensions of the component after applying the current scale.
   *   - `width`: The scaled width.
   *   - `height`: The scaled height.
   * - `visibleArea`: The visible region of the scaled component.
   *   - `x`: The x-coordinate of the top-left corner of the visible area (relative to the scaled component).
   *   - `y`: The y-coordinate of the top-left corner of the visible area (relative to the scaled component).
   *   - `width`: The width of the visible area (matches container width).
   *   - `height`: The height of the visible area (matches container height).
   * - `transformations`: The current transformation values.
   *   - `translateX`: The horizontal translation value (including focal point adjustment).
   *   - `translateY`: The vertical translation value (including focal point adjustment).
   *   - `scale`: The current scale factor.
   */
  getInfo: GetInfoCallback;
};

export type ImageZoomRef = ZoomableRef;
