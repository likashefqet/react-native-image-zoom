import React, { useMemo } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, {
  AnimateProps,
  SharedValue,
  useAnimatedProps,
  useDerivedValue,
} from 'react-native-reanimated';
import { ReText } from 'react-native-redash';
import Svg, { Circle } from 'react-native-svg';

import { COLORS } from '../themes/colors';

const AnimatedSvgCircle = Animated.createAnimatedComponent(Circle);
const AnimatedView = Animated.createAnimatedComponent(View);

type AnimatedCircleProps = AnimateProps<ViewProps> & {
  scale: SharedValue<number>;
  minScale: number;
  maxScale: number;
  size: number;
};

export const AnimatedCircle = ({
  scale,
  minScale,
  maxScale,
  size,
  ...viewProps
}: AnimatedCircleProps) => {
  const halfSize = size / 2;
  const circleLength = useMemo(
    () => 2 * Math.PI * (halfSize - 2.5),
    [halfSize]
  );
  const text = useDerivedValue(
    () => `${(Math.round(scale.value * 10) / 10).toFixed(1)}`
  );
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset:
      circleLength * (1 - (scale.value - minScale) / (maxScale - minScale)),
  }));

  return (
    <AnimatedView {...viewProps}>
      <Svg width={size} height={size}>
        <Circle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - 2.5}
          fill="transparent"
          stroke={COLORS.mainLightAlpha(0.08)}
          strokeWidth={5}
          strokeDasharray={circleLength}
          strokeLinecap={'round'}
        />
        <AnimatedSvgCircle
          cx={halfSize}
          cy={halfSize}
          r={halfSize - 2.5}
          fill="transparent"
          stroke={COLORS.accent}
          strokeWidth={5}
          strokeDasharray={circleLength}
          animatedProps={animatedProps}
          strokeLinecap={'round'}
        />
      </Svg>
      <ReText
        style={[styles.progressText, { borderRadius: halfSize - 8 }]}
        text={text}
      />
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  progressText: {
    position: 'absolute',
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
    fontSize: 16,
    color: COLORS.mainLightAlpha(),
    textAlign: 'center',
    verticalAlign: 'middle',
    backgroundColor: COLORS.mainDarkAlpha(0.16),
    zIndex: -1,
  },
});
