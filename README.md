# REACT NATIVE IMAGE ZOOM

![npm](https://img.shields.io/npm/v/@likashefqet/react-native-image-zoom)
![NPM](https://img.shields.io/npm/l/@likashefqet/react-native-image-zoom)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@likashefqet/react-native-image-zoom/peer/react-native-reanimated)
![npm peer dependency version](https://img.shields.io/npm/dependency-version/@likashefqet/react-native-image-zoom/peer/react-native-gesture-handler)
![npm bundle size](https://img.shields.io/bundlephobia/min/@likashefqet/react-native-image-zoom)
[![npm](https://img.shields.io/badge/types-included-blue)](https://github.com/likashefqet/react-native-image-zoom)
![npms.io (final)](https://img.shields.io/npms-io/maintenance-score/@likashefqet/react-native-image-zoom)
![GitHub issues](https://img.shields.io/github/issues/likashefqet/react-native-image-zoom)

**A performant and customizable image zoom component  
built with Reanimated v2+ and TypeScript. 🌃 🚀**

_Demo:_

![React Native Image Zoom](https://raw.githubusercontent.com/likashefqet/react-native-image-zoom/main/demo.gif)

<div dir="rtl">
Photo by <a href="https://unsplash.com/photos/XLqiL-rz4V8" title="Photo by Walling">Walling</a> on <a href="https://unsplash.com" title="Unsplash">Unsplash</a>
</div>

## What's new

- **Enhanced Pan Gesture Handling:** Improved the accuracy and responsiveness of pan gestures, ensuring smoother and more natural interactions when panning images.

- **Refined Single Tap Detection:** The single tap gesture functionality has been enhanced to trigger more reliably, providing better consistency and control without interfering with other gestures.

- **Updated Example Integration:**
  - Added new examples demonstrating how to leverage the scale value for custom animation effects.
  - Provided an example showcasing how to integrate the Image Zoom Component with react-native-reanimated-carousel, allowing for animated, zoomable image carousels.
- **TypeScript Support for Animated Props:** Expanded TypeScript definitions to include support for animated props, ensuring better type safety and compatibility with Reanimated-based animations.

## Features

- **Smooth Zooming Gestures:** Ensure smooth and responsive zooming functionality, allowing users to easily zoom in and out of images using intuitive pinch and pan gestures.

- **Reset Zoom and Snap Back:** The component automatically resets zoom and snaps back to the initial position when the gesture ends.

- **Double Tap to Zoom:** Enable a double tap gesture for users to seamlessly zoom in and out of images. When double tap functionality is enabled, the automatic Reset Zoom and Snap Back feature will be disabled, allowing users to maintain their desired zoom level without automatic resets.

- **Single Tap Functionality:** Detect and process single tap gestures to trigger specific actions or functionality as needed within the component

- **Customizable Zoom Settings:** Utilize `minScale`, `maxScale`, and `doubleTapScale` props for precise control over minimum, maximum, and double tap zoom levels, tailoring the zoom behavior to application requirements

- **Customizable Functionality:** Enable or disable features such as panning (`isPanEnabled`), pinching (`isPinchEnabled`), single tap handling (`isSingleTapEnabled`), and double tap zoom (`isDoubleTapEnabled`) based on specific application needs.

- **Access Scale Animated Value:** Provide a Reanimated shared value for the scale property, allowing you to access and utilize the current zoom scale in your own code.

- **Interactive Callbacks:** The component provides interactive callbacks such as `onInteractionStart`, `onInteractionEnd`, `onPinchStart`, `onPinchEnd`, `onPanStart`, `onPanEnd`, `onSingleTap`, `onDoubleTap` and `onResetAnimationEnd` that allow you to handle image interactions.

- **Access Last Values on Reset:** The `onResetAnimationEnd` callback returns the last zoom and position values when the component resets (zooms out), providing more control and feedback for custom logic.

- **Ref Handle:** Customize the functionality further by utilizing the exposed `reset` and `zoom` methods. The 'reset' method allows you to programmatically reset the image zoom as a side effect to another user action or event, in addition to the default double tap and pinch functionalities. The 'zoom' method allows you to programmatically zoom in the image to a given point (x, y) at a given scale level.

- **Reanimated Compatibility**: Compatible with `Reanimated v2` & `Reanimated v3`, providing optimized performance and smoother animations during image manipulations`.

- **TypeScript Support:** Developed with `TypeScript` to enhance codebase maintainability and ensure type safety, reducing potential errors during development and refactoring processes

- **Full React Native Image Props Support:** The component supports all React Native Image props, making it easy to integrate with existing code and utilize all the features that React Native Image provides.

- **Zoomable Component:** This component makes any child elements zoomable, ensuring they behave like the image zoom component. This is particularly useful when you need to replace the default image component with alternatives like Expo Image (see example) or Fast Image.

## Getting Started

To use the `ImageZoom` component, you first need to install the package via npm or yarn. Run either of the following commands:

```sh
npm install @likashefqet/react-native-image-zoom
```

```sh
yarn add @likashefqet/react-native-image-zoom
```

> [!CAUTION]
>
> # 🚨
>
> ### Please note that this library is compatible with `Reanimated v2` & `Reanimated v3` and uses `GestureHandler v2`.
>
> ## If you haven't installed Reanimated and Gesture Handler yet, please follow the installation instructions for [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/).

> [!NOTE]
>
> ### [Usage with modals on Android](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/#usage-with-modals-on-android)
>
> On Android RNGH does not work by default because modals are not located under React Native Root view in native hierarchy. To fix that, components need to be wrapped with gestureHandlerRootHOC (it's no-op on iOS and web).

## Usage

First, import the `ImageZoom` component from the `@likashefqet/react-native-image-zoom` library:

```javascript
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
```

To use the `ImageZoom` component, simply pass the uri prop with the URL of the image you want to zoom:

### Basic Example

```javascript
<ImageZoom uri={imageUri} />
```

### Customized Example

```javascript
<ImageZoom
  ref={ref}
  uri={uri}
  minScale={minScale}
  maxScale={maxScale}
  scale={scale}
  doubleTapScale={3}
  isSingleTapEnabled
  isDoubleTapEnabled
  onInteractionStart={() => {
    console.log('onInteractionStart');
    onZoom();
  }}
  onInteractionEnd={() => console.log('onInteractionEnd')}
  onPanStart={() => console.log('onPanStart')}
  onPanEnd={() => console.log('onPanEnd')}
  onPinchStart={() => console.log('onPinchStart')}
  onPinchEnd={() => console.log('onPinchEnd')}
  onSingleTap={() => console.log('onSingleTap')}
  onDoubleTap={(zoomType) => {
    console.log('onDoubleTap', zoomType);
    onZoom(zoomType);
  }}
  onProgrammaticZoom={(zoomType) => {
    console.log('onZoom', zoomType);
    onZoom(zoomType);
  }}
  style={styles.image}
  onResetAnimationEnd={(finished, values) => {
    console.log('onResetAnimationEnd', finished);
    console.log('lastScaleValue:', values?.SCALE.lastValue);
    onAnimationEnd(finished);
  }}
  resizeMode="cover"
/>
```

### Zoomable with Expo Image Example

```javascript
<Zoomable
  ref={ref}
  minScale={minScale}
  maxScale={maxScale}
  scale={scale}
  doubleTapScale={3}
  isSingleTapEnabled
  isDoubleTapEnabled
  onInteractionStart={() => {
    console.log('onInteractionStart');
    onZoom();
  }}
  onInteractionEnd={() => console.log('onInteractionEnd')}
  onPanStart={() => console.log('onPanStart')}
  onPanEnd={() => console.log('onPanEnd')}
  onPinchStart={() => console.log('onPinchStart')}
  onPinchEnd={() => console.log('onPinchEnd')}
  onSingleTap={() => console.log('onSingleTap')}
  onDoubleTap={(zoomType) => {
    console.log('onDoubleTap', zoomType);
    onZoom(zoomType);
  }}
  onProgrammaticZoom={(zoomType) => {
    console.log('onZoom', zoomType);
    onZoom(zoomType);
  }}
  style={styles.image}
  onResetAnimationEnd={(finished, values) => {
    console.log('onResetAnimationEnd', finished);
    console.log('lastScaleValue:', values?.SCALE.lastValue);
    onAnimationEnd(finished);
  }}
>
  <Image style={styles.image} source={{ uri }} contentFit="cover" />
</Zoomable>
```

## Properties

### ImageZoom Props

All `React Native Image Props` &

| Property            | Type     | Default             | Description                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------- | -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| uri                 | String   | `''` (empty string) | The image's URI, which can be overridden by the `source` prop.                                                                                                                                                                                                                                                                                                                                                                     |
| minScale            | Number   | `1`                 | The minimum scale allowed for zooming.                                                                                                                                                                                                                                                                                                                                                                                             |
| maxScale            | Number   | `5`                 | The maximum scale allowed for zooming.                                                                                                                                                                                                                                                                                                                                                                                             |
| doubleTapScale      | Number   | `3`                 | The value of the image scale when a double-tap gesture is detected.                                                                                                                                                                                                                                                                                                                                                                |
| maxPanPointers      | Number   | `2`                 | The maximum number of pointers required to enable panning.                                                                                                                                                                                                                                                                                                                                                                         |
| isPanEnabled        | Boolean  | `true`              | Determines whether panning is enabled within the range of the minimum and maximum pan pointers.                                                                                                                                                                                                                                                                                                                                    |
| isPinchEnabled      | Boolean  | `true`              | Determines whether pinching is enabled.                                                                                                                                                                                                                                                                                                                                                                                            |
| isSingleTapEnabled  | Boolean  | `false`             | Enables or disables the single tap feature.                                                                                                                                                                                                                                                                                                                                                                                        |
| isDoubleTapEnabled  | Boolean  | `false`             | Enables or disables the double tap feature. When enabled, this feature prevents automatic reset of the image zoom to its initial position, allowing continuous zooming. To return to the initial position, double tap again or zoom out to a scale level less than 1.                                                                                                                                                              |
| onInteractionStart  | Function | `undefined`         | A callback triggered when the image interaction starts.                                                                                                                                                                                                                                                                                                                                                                            |
| onInteractionEnd    | Function | `undefined`         | A callback triggered when the image interaction ends.                                                                                                                                                                                                                                                                                                                                                                              |
| onPinchStart        | Function | `undefined`         | A callback triggered when the image pinching starts.                                                                                                                                                                                                                                                                                                                                                                               |
| onPinchEnd          | Function | `undefined`         | A callback triggered when the image pinching ends.                                                                                                                                                                                                                                                                                                                                                                                 |
| onPanStart          | Function | `undefined`         | A callback triggered when the image panning starts.                                                                                                                                                                                                                                                                                                                                                                                |
| onPanEnd            | Function | `undefined`         | A callback triggered when the image panning ends.                                                                                                                                                                                                                                                                                                                                                                                  |
| onSingleTap         | Function | `undefined`         | A callback triggered when a single tap is detected.                                                                                                                                                                                                                                                                                                                                                                                |
| onDoubleTap         | Function | `undefined`         | A callback triggered when a double tap gesture is detected.                                                                                                                                                                                                                                                                                                                                                                        |
| onProgrammaticZoom  | Function | `undefined`         | A callback function that is invoked when a programmatic zoom event occurs.                                                                                                                                                                                                                                                                                                                                                         |
| onResetAnimationEnd | Function | `undefined`         | A callback triggered upon the completion of the reset animation. It accepts two parameters: `finished` and `values`. The `finished` parameter evaluates to true if all animation values have successfully completed the reset animation; otherwise, it is false, indicating interruption by another gesture or unforeseen circumstances. The `values` parameter provides additional detailed information for each animation value. |

### ImageZoom Ref

| Property | Type     | Description                                                                                                                              |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| reset    | Function | Resets the image zoom, restoring it to its initial position and scale level.                                                             |
| zoom     | Function | Zoom in the image to a given point (x, y) at a given scale level. Calls the reset method if the given scale level is less or equal to 1. |

## Changelog

Please refer to the [Releases](https://github.com/likashefqet/react-native-image-zoom/releases) section on the GitHub repository. Each release includes a detailed list of changes made to the library, including bug fixes, new features, and any breaking changes. We recommend reviewing these changes before updating to a new version of the library to ensure a smooth transition.

# Troubleshooting

Not working on android?

> [Usage with modals on Android](https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/#usage-with-modals-on-android)

## Author

<table> <tr> <td align='center'> <p></p><a href="https://github.com/likashefqet"><pre><img src="https://avatars.githubusercontent.com/u/22661589?v=4?s=96" width="128px;" marginBottom="8px" alt=""/><br/><br/>Shefqet Lika</pre></a> <a href="https://github.com/likashefqet/react-native-image-zoom/commits?author=likashefqet" title="Code"><pre>💻 commits</pre></a> </td></tr></table>

<!-- ## Sponsor & Support -->

## Support

For ongoing maintenance and updates, your support is greatly appreciated

<a href="https://www.buymeacoffee.com/likashefqet" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

If you need further assistance, feel free to reach out to me by email at [@likashefi](mailto:likashefi@gmail.com).

## License

The library is licensed under the [MIT](./LICENSE) License.
