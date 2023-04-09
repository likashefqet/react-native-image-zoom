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
built with Reanimated v2 and TypeScript. 🌃 🚀**

_Demo:_

![React Native Image Zoom](https://raw.githubusercontent.com/likashefqet/react-native-image-zoom/main/demo.gif)

<div dir="rtl">
Photo by <a href="https://unsplash.com/photos/XLqiL-rz4V8" title="Photo by Walling">Walling</a> on <a href="https://unsplash.com" title="Unsplash">Unsplash</a>
</div>

## Features

- **Smooth Zooming Gestures:** Smooth and responsive zooming functionality, allowing users to zoom in and out of images using intuitive pinch and pan gestures.
- **Customizable Zoom Settings:** With the `minScale` and `maxScale` props, you can set the minimum and maximum zoom levels for your images, giving you precise control over the zooming experience.
- **Reset zoom and snap back:** The component automatically resets zoom and snaps back to the initial position when the gesture ends.
- **Interactive Callbacks:** The component provides interactive callbacks such as `onInteractionStart`, `onInteractionEnd`, `onPinchStart`, `onPinchEnd`, `onPanStart`, and `onPanEnd` that allow you to handle image interactions and customize the user experience.
- **Reanimated**: Compatible with `Reanimated v2`.
- **Written in TypeScript:** The library is written in `TypeScript`, providing type safety and improving the maintainability of your code.
- **Customizable Loader:** You can customize the default loader or provide your own custom loader using the `activityIndicatorProps` and `renderLoader` props, giving you full control over the loading state of the image.
- **Full React Native Image Props Support:** The component supports all React Native Image props, making it easy to integrate with existing code and utilize all the features that React Native Image provides.

## Getting Started

To use the `ImageZoom` component, you first need to install the package via npm or yarn. Run either of the following commands:

```sh
npm install @likashefqet/react-native-image-zoom
```

```sh
yarn add @likashefqet/react-native-image-zoom
```

🚨 🚨 Please note that this library is built with React Native Reanimated v2 and uses React Native Gesture Handler. If you haven't installed Reanimated and Gesture Handler yet, please follow the installation instructions for [Reanimated](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) and [Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/docs/).

## Usage

First, import the `ImageZoom` component from the `@likashefqet/react-native-image-zoom` library:

```javascript
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
```

To use the `ImageZoom` component, simply pass the uri prop with the URL of the image you want to zoom:

```javascript
<ImageZoom uri={imageUri} />
```

```javascript
<ImageZoom
  uri={imageUri}
  minScale={0.5}
  maxScale={3}
  onInteractionStart={() => console.log('Interaction started')}
  onInteractionEnd={() => console.log('Interaction ended')}
  onPinchStart={() => console.log('Pinch gesture started')}
  onPinchEnd={() => console.log('Pinch gesture ended')}
  onPanStart={() => console.log('Pan gesture started')}
  onPanEnd={() => console.log('Pan gesture ended')}
  renderLoader={() => <CustomLoader />}
/>
```

## Properties

All `React Native Image Props` &

| Property               | Type     | Default             | Description                                                                                     |
| ---------------------- | -------- | ------------------- | ----------------------------------------------------------------------------------------------- |
| uri                    | String   | `''` (empty string) | The image's URI, which can be overridden by the `source` prop.                                  |
| minScale               | Number   | `1`                 | The minimum scale allowed for zooming.                                                          |
| maxScale               | Number   | `5`                 | The maximum scale allowed for zooming.                                                          |
| minPanPointers         | Number   | `2`                 | The minimum number of pointers required to enable panning.                                      |
| maxPanPointers         | Number   | `2`                 | The maximum number of pointers required to enable panning.                                      |
| isPanEnabled           | Boolean  | `true`              | Determines whether panning is enabled within the range of the minimum and maximum pan pointers. |
| isPinchEnabled         | Boolean  | `true`              | Determines whether pinching is enabled.                                                         |
| onInteractionStart     | Function | `undefined`         | A callback triggered when the image interaction starts.                                         |
| onInteractionEnd       | Function | `undefined`         | A callback triggered when the image interaction ends.                                           |
| onPinchStart           | Function | `undefined`         | A callback triggered when the image pinching starts.                                            |
| onPinchEnd             | Function | `undefined`         | A callback triggered when the image pinching ends.                                              |
| onPanStart             | Function | `undefined`         | A callback triggered when the image panning starts.                                             |
| onPanEnd               | Function | `undefined`         | A callback triggered when the image panning ends.                                               |
| containerStyle         | Object   | `{}`                | The style object applied to the container.                                                      |
| imageContainerStyle    | Object   | `{}`                | The style object applied to the image container.                                                |
| activityIndicatorProps | Object   | `{}`                | The `ActivityIndicator` props used to customize the default loader.                             |
| renderLoader           | Function | `undefined`         | A function that renders a custom loading component. Set to `null` to disable the loader.        |

## Changelog

Please refer to the [Releases](https://github.com/likashefqet/react-native-image-zoom/releases) section on the GitHub repository. Each release includes a detailed list of changes made to the library, including bug fixes, new features, and any breaking changes. We recommend reviewing these changes before updating to a new version of the library to ensure a smooth transition.

## Author

<table> <tr> <td align='center'> <p></p><a href="https://github.com/likashefqet"><pre><img src="https://avatars.githubusercontent.com/u/22661589?v=4?s=96" width="128px;" marginBottom="8px" alt=""/><br/><br/>Shefqet Lika</pre></a> <a href="https://github.com/likashefqet/react-native-image-zoom/commits?author=likashefqet" title="Code"><pre>💻 commits</pre></a> </td></tr></table>

<!-- ## Sponsor & Support -->

## Support

<!-- To keep this library maintained and up-to-date please consider [sponsoring it on GitHub](https://github.com/sponsors/likashefqet). Or i -->

If you need further assistance, feel free to reach out to me by email at [@likashefi](mailto:likashefi@gmail.com).

## License

The library is licensed under the [MIT](./LICENSE) License.

<!--
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT -->
