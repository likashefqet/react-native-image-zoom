import type {
  ActivityIndicatorProps,
  ImageStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';

export type ImageZoomProps = {
  /**
   * Uri of the image.
   */
  uri?: string;
  /**
   * Minimum scale value.
   */
  minScale?: number;
  /**
   * Maximum scale value.
   */
  maxScale?: number;
  /**
   * Callback to trigger when the image load either succeeds or fails.
   */
  onLoadEnd?: Function;
  /**
   * Image style.
   */
  style?: StyleProp<ImageStyle>;
  /**
   * Container style.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * Image container style.
   */
  imageContainerStyle?: StyleProp<ViewStyle>;
  /**
   * Activity Indicator Props.
   */
  activityIndicatorProps?: ActivityIndicatorProps;
  /**
   * Render custom loader component.
   */
  renderLoader?: Function;
};
