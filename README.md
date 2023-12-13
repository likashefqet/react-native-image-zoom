# React Native Image Zoom

[![Reanimated](https://img.shields.io/badge/Reanimated-v2-blue)](https://github.com/likashefqet/react-native-image-zoom) [![npm](https://img.shields.io/github/license/likashefqet/react-native-image-zoom)](https://github.com/likashefqet/react-native-image-zoom) [![npm](https://img.shields.io/badge/types-included-blue)](https://github.com/likashefqet/react-native-image-zoom)

#### A performant zoomable image written in Reanimated v2 🚀

![React Native Image Zoom](https://raw.githubusercontent.com/likashefqet/react-native-image-zoom/main/demo.gif)
>Photo by [Walling](https://unsplash.com/photos/XLqiL-rz4V8) on [Unsplash](https://unsplash.com/)

---

## Features

- Zoom (pinch and/or pan) the image using gestures.
- Reset zoom and snap back to initial position on gesture end.
- Smooth gesture interactions & snapping animations.
- Loading state while image is loading.
- Customize the default loader.
- Provide custom loader to override/remove the default one.
- Configure maximum zoom value.
- Compatible with `Reanimated v2`.
- Written in `TypeScript`.

## Getting Started

`npm install @likashefqet/react-native-image-zoom`
or `yarn add @likashefqet/react-native-image-zoom`


This library been written in `React Native Reanimated v2`, make sure to follow [installation instructions](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation) if you haven't installed Reanimated yet.

This library uses `React Native Gesture Handler`, make sure to follow [installation instructions](https://docs.swmansion.com/react-native-gesture-handler/docs/) if you haven't installed Gesture Handler yet.
## Usage

```javascript
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
```

Basics:
```javascript
<ImageZoom uri={imageUri} />
```

## Properties
All `React Native Image Props` &

| Property | Type | Default | Description |
|-----------------|----------|-------|--------------------------------------------------------------|
| uri | String | `''` (empty string) | Image uri. Can be overridden by source prop. |
| minScale | Number | `1` | The minimum allowed zoom scale. |
| maxScale | Number | `5` | The maximum allowed zoom scale.|
| containerStyle | Object | `{}` | Style object to be applied to the container. |
| imageContainerStyle | Object | `{}` | Style object to be applied to the image container. |
| activityIndicatorProps | Object | `{}` | Activity Indicator Props to customize the default loader. |
| renderLoader | Function | `undefined` | Function that renders a custom loading component. Render `null` to disable loader. |


## Changelog

Read the [changelog](CHANGELOG.md).

## Author

<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/likashefqet"><img src="https://avatars.githubusercontent.com/u/22661589?v=4?s=96" width="96px;" alt=""/><br /><sub><b>Shefqet Lika</b></sub></a><br /><a href="https://github.com/likashefqet/react-native-image-zoom/commits?author=likashefqet" title="Code">💻</a></td>
  </tr>
</table>
<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ## Sponsor & Support -->
## Support

<!-- To keep this library maintained and up-to-date please consider [sponsoring it on GitHub](https://github.com/sponsors/likashefqet). Or i -->
If you are looking for a private support or help in customizing the experience, then reach out to me by email [@likashefi](mailto:likashefi@gmail.com).

## License

[MIT](./LICENSE)

---

<!-- 
## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT -->
