import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  Platform,
  StyleSheet,
  Text,
  PressableProps,
  GestureResponderEvent,
} from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const IS_IOS = Platform.OS === 'ios';

const styles = StyleSheet.create({
  button: {
    height: 48,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#85C1E9',
  },
  content: {
    flex: 1,
    flexGrow: 1,
    position: 'relative',
    overflow: 'hidden',
  },
  title: {
    color: '#1B4F72',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

type ButtonProps = PressableProps & {
  title: string;
};

const addIf = <T,>(condition: boolean, value: T): T | {} => {
  return condition ? value : {};
};

export default function Button({
  title,
  onPressIn,
  onPressOut,
  ...rest
}: ButtonProps) {
  const anim = useRef(new Animated.Value(1)).current;

  const animate = (toValue: number) => {
    Animated.spring(anim, {
      toValue,
      useNativeDriver: true,
    }).start();
  };

  const onPressInAnim = (event: GestureResponderEvent) => {
    onPressIn?.(event);
    animate(0);
  };
  const onPressOutAnim = (event: GestureResponderEvent) => {
    onPressOut?.(event);
    animate(1);
  };

  const style = [
    styles.button,
    addIf(!IS_IOS, { overflow: 'hidden' }),
    {
      transform: [
        {
          scale: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.92, 1],
          }),
        },
      ],
    },
    addIf(IS_IOS, {
      opacity: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
      }),
    }),
  ];

  return (
    <AnimatedPressable
      onPressIn={onPressInAnim}
      onPressOut={onPressOutAnim}
      style={style}
      android_ripple={{
        color: 'rgba(235, 245, 251 ,0.64)',
        foreground: true,
      }}
      {...rest}
    >
      <Text style={styles.title}>{title}</Text>
    </AnimatedPressable>
  );
}
