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

## Features

- **Smooth Zooming Gestures:** Ensure smooth and responsive zooming functionality, allowing users to easily zoom in and out of images using intuitive pinch and pan gestures.

- **Reset Zoom and Snap Back:** The component automatically resets zoom and snaps back to the initial position when the gesture ends.

- **Double Tap to Zoom:** Enable a double tap gesture for users to seamlessly zoom in and out of images. When double tap functionality is enabled, the automatic Reset Zoom and Snap Back feature will be disabled, allowing users to maintain their desired zoom level without automatic resets.

- **Single Tap Functionality:** Detect and process single tap gestures to trigger specific actions or functionality as needed within the component

- **Customizable Zoom Settings:** Utilize `minScale`, `maxScale`, and `doubleTapScale` props for precise control over minimum, maximum, and double tap zoom levels, tailoring the zoom behavior to application requirements

- **Customizable Functionality:** Fine-tune the component's behavior with `minPanPointers` and `maxPanPointers` props to define the range of pointers necessary for pan gesture detection. Enable or disable features such as panning (`isPanEnabled`), pinching (`isPinchEnabled`), single tap handling (`isSingleTapEnabled`), and double tap zoom (`isDoubleTapEnabled`) based on specific application needs.

- **Interactive Callbacks:** The component provides interactive callbacks such as `onInteractionStart`, `onInteractionEnd`, `onPinchStart`, `onPinchEnd`, `onPanStart`, `onPanEnd`, `onSingleTap`, `onDoubleTap` and `onResetAnimationEnd` that allow you to handle image interactions.

- **Ref Handle:** Customize the functionality further by utilizing the exposed `reset` method. This method allows you to programmatically reset the image zoom as a side effect to another user action or event, in addition to the default double tap and pinch functionalities.

- **Reanimated Compatibility**: Compatible with `Reanimated v2` & `Reanimated v3`, providing optimized performance and smoother animations during image manipulations`.

- **TypeScript Support:** Developed with `TypeScript` to enhance codebase maintainability and ensure type safety, reducing potential errors during development and refactoring processes

- **Full React Native Image Props Support:** The component supports all React Native Image props, making it easy to integrate with existing code and utilize all the features that React Native Image provides.

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
  ref={imageZoomRef}
  uri={imageUri}
  minScale={0.5}
  maxScale={5}
  doubleTapScale={3}
  minPanPointers={1}
  isSingleTapEnabled
  isDoubleTapEnabled
  onInteractionStart={() => {
    console.log('onInteractionStart');
    onAnimationStart();
  }}
  onInteractionEnd={() => console.log('onInteractionEnd')}
  onPanStart={() => console.log('onPanStart')}
  onPanEnd={() => console.log('onPanEnd')}
  onPinchStart={() => console.log('onPinchStart')}
  onPinchEnd={() => console.log('onPinchEnd')}
  onSingleTap={() => console.log('onSingleTap')}
  onDoubleTap={(zoomType) => {
    console.log('onDoubleTap', zoomType);
    if (zoomType === ZOOM_TYPE.ZOOM_IN) {
      onAnimationStart();
      setTimeout(() => {
        imageZoomRef.current?.reset();
      }, 3000);
    }
  }}
  style={styles.image}
  onResetAnimationEnd={(finished) => {
    onAnimationEnd(finished);
  }}
  resizeMode="cover"
/>
```

## Properties

### ImageZoom Props

All `React Native Image Props` &

| Property           | Type     | Default             | Description                                                                                     |
| ------------------ | -------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| uri                | String   | `''` (empty string) | The image's URI, which can be overridden by the `source` prop.                                  |
| minScale           | Number   | `1`                 | The minimum scale allowed for zooming.                                                          |
| maxScale           | Number   | `5`                 | The maximum scale allowed for zooming.                                                          |
| doubleTapScale     | Number   | `3`                 | The value of the image scale when a double-tap gesture is detected.                             |
| minPanPointers     | Number   | `2`                 | The minimum number of pointers required to enable panning.                                      |
| maxPanPointers     | Number   | `2`                 | The maximum number of pointers required to enable panning.                                      |
| isPanEnabled       | Boolean  | `true`              | Determines whether panning is enabled within the range of the minimum and maximum pan pointers. |
| isPinchEnabled     | Boolean  | `true`              | Determines whether pinching is enabled.                                                         |
| isSingleTapEnabled | Boolean  | `false`             | Enables or disables the single tap feature.                                                     |
| isDoubleTapEnabled | Boolean  | `false`             | Enables or disables the double tap feature. When enabled, this feature prevents automatic reset of the image zoom to its initial position, allowing continuous zooming. To return to the initial position, double tap again or zoom out to a scale level less than 1.  |
| onInteractionStart | Function | `undefined`         | A callback triggered when the image interaction starts.                                         |
| onInteractionEnd   | Function | `undefined`         | A callback triggered when the image interaction ends.                                           |
| onPinchStart       | Function | `undefined`         | A callback triggered when the image pinching starts.                                            |
| onPinchEnd         | Function | `undefined`         | A callback triggered when the image pinching ends.                                              |
| onPanStart         | Function | `undefined`         | A callback triggered when the image panning starts.                                             |
| onPanEnd           | Function | `undefined`         | A callback triggered when the image panning ends.                                               |
| onSingleTap        | Function | `undefined`         | A callback triggered when a single tap is detected.                                             |
| onDoubleTap        | Function | `undefined`         | A callback triggered when a double tap gesture is detected.                                     |
| onResetAnimationEnd| Function | `undefined`         | A callback triggered upon the completion of the reset animation. It accepts two parameters: `finished` and `values`. The `finished` parameter evaluates to true if all animation values have successfully completed the reset animation; otherwise, it is false, indicating interruption by another gesture or unforeseen circumstances. The `values` parameter provides additional detailed information for each animation value.  |

### ImageZoom Ref

| Property           | Type     | Description                                                                                     |
| ------------------ | -------- | ----------------------------------------------------------------------------------------------- |
| reset              | Function | Resets the image zoom, restoring it to its initial position and scale level.                    |

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
