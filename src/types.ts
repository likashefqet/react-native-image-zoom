import type {
  ActivityIndicatorProps,
  ImageProps,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';

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
   * The style object applied to the container.
   * @default {}
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The style object applied to the image container.
   * @default {}
   */
  imageContainerStyle?: StyleProp<ViewStyle>;
  /**
   * The `ActivityIndicator` props used to customize the default loader.
   * @default {}
   */
  activityIndicatorProps?: ActivityIndicatorProps;
  /**
   * A function that renders a custom loading component. Set to `null` to disable the loader.
   */
  renderLoader?: Function;
  /**
   * @see https://facebook.github.io/react-native/docs/image.html#source
   * @default undefined
   */
  source?: ImageSourcePropType;
};
