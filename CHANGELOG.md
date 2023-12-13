# Changelog

## [1.2.1](https://github.com/likashefqet/react-native-image-zoom/compare/v1.2.0...v1.2.1) (2021-12-27)

### Enhanced

- Adds interaction controllers and callbacks
  - minPanPointers (default: 2)
  - maxPanPointers (default: 2)
  - isPanEnabled (default: true)
  - isPinchEnabled (default: true)
  - onInteractionStart (default: noop)
  - onInteractionEnd (default: noop)
  - onPinchStart (default: noop)
  - onPinchEnd (default: noop)
  - onPanStart (default: noop)
  - onPanEnd (default: noop)
- Upgrade React Native version to 0.66.4 on the example.

## [1.2.0](https://github.com/likashefqet/react-native-image-zoom/compare/v1.1.2...v1.2.0) (2021-12-09)

### Enhanced

- Improve package size on npm by adding a link to the demo instead of the file.

## [1.1.2](https://github.com/likashefqet/react-native-image-zoom/compare/v1.1.1...v1.1.2) (2021-12-09)

### Fixes

- Add source code to npm to fix errors with reanimated.

## 1.1.1 (2021-12-09)
_initial release_

#### New

- Zoom (pinch and/or pan) the image using gestures.
- Reset zoom and snap back to initial position on gesture end.
- Smooth gesture interactions & snapping animations.
- Loading state while image is loading.
- Customize the default loader.
- Provide custom loader to override/remove the default one.
- Configure maximum zoom value.
- Compatible with `Reanimated v2`.
- Written in `TypeScript`.
