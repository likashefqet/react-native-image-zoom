import type {
  ActivityIndicatorProps,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type ImageZoomProps = {
  /**
   * Uri of the image.
   * @default ''
   */
  uri?: string;
  /**
   * Minimum scale value.
   * @default 1
   */
  minScale?: number;
  /**
   * Maximum scale value.
   * @default 5
   */
  maxScale?: number;
  /**
   * Minimum pointers to enable pan gesture.
   * @default 2
   */
  minPanPointers?: number;
  /**
   * Minimum pointers to enable pan gesture.
   * @default 2
   */
  maxPanPointers?: number;
  /**
   * Determines if pan gesture should be enabled within the limits of min and max pan pointers.
   * @default true
   */
  isPanEnabled?: boolean;
  /**
   * Determines if pinch gesture should be enabled.
   * @default true
   */
  isPinchEnabled?: boolean;
  /**
   * Callback to trigger when the image load either succeeds or fails.
   * @default noop
   */
  onLoadEnd?: Function;
  /**
   * Callback to trigger when the image interaction starts.
   * @default noop
   */
  onInteractionStart?: Function;
  /**
   * Callback to trigger when the image interaction ends.
   * @default noop
   */
  onInteractionEnd?: Function;
  /**
   * Callback to trigger when the image pinching starts.
   * @default noop
   */
  onPinchStart?: Function;
  /**
   * Callback to trigger when the image pinching ends.
   * @default noop
   */
  onPinchEnd?: Function;
  /**
   * Callback to trigger when the image panning starts.
   * @default noop
   */
  onPanStart?: Function;
  /**
   * Callback to trigger when the image panning ends.
   * @default noop
   */
  onPanEnd?: Function;
  /**
   * Image style.
   * @default {}
   */
  style?: StyleProp<ImageStyle>;
  /**
   * Container style.
   * @default {}
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Image container style.
   * @default {}
   */
  imageContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Activity Indicator Props.
   * @default {}
   */
  activityIndicatorProps?: ActivityIndicatorProps;
  /**
   * Render custom loader component.
   */
  renderLoader?: Function;
    /**
   * Reset zoom and snap back to initial position on gesture end.
   */
  resetZoomOnGestureEnd?: boolean
};
