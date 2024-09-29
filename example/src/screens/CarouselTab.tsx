import * as React from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
} from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import ImageZoom from '../components/ImageZoom';
import { COLORS } from '../themes/colors';

const DEFAULT_IMAGE_URI =
  'https://images.unsplash.com/photo-1596003906949-67221c37965c'; // https://unsplash.com/@walling
const IMAGE_URLS = [
  'https://images.unsplash.com/photo-1502318217862-aa4e294ba657', // https://unsplash.com/@n8rayfield
  'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1', // https://unsplash.com/@jdiegoph
  'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c', // https://unsplash.com/@resul
  'https://images.unsplash.com/photo-1534229317157-f846a08d8b73', // https://unsplash.com/@mischievous_penguins
  'https://images.unsplash.com/photo-1516690553959-71a414d6b9b6', // https://unsplash.com/@jordansteranka
  'https://images.unsplash.com/photo-1545243424-0ce743321e11', // https://unsplash.com/@therawhunter
];

const data = IMAGE_URLS;

interface ItemProps {
  index: number;
  animationValue: Animated.SharedValue<number>;
  setIsZoomed: (value: boolean) => void;
}

const CustomItem: React.FC<ItemProps> = ({
  index,
  animationValue,
  setIsZoomed,
}) => {
  const maskStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      ['#000000dd', 'transparent', '#000000dd']
    );

    return {
      backgroundColor,
    };
  }, [animationValue]);

  return (
    <View style={styles.container}>
      <ImageZoom
        uri={data[index] ?? DEFAULT_IMAGE_URI}
        setIsZoomed={setIsZoomed}
      />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, maskStyle]}
      />
    </View>
  );
};
export const CarouselTab = () => {
  const { width } = useWindowDimensions();
  const [isZoomed, setIsZoomed] = React.useState(false);
  const customAnimation = React.useCallback(
    (value: number) => {
      'worklet';

      const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
      const translateX = interpolate(value, [-2, 0, 1], [-width, 0, width]);

      return {
        transform: [{ translateX }],
        zIndex,
      };
    },
    [width]
  );

  return (
    <Carousel
      loop={true}
      // autoPlay={!isZoomed}
      style={styles.container}
      width={width}
      data={data}
      renderItem={({ index, animationValue }) => {
        return (
          <CustomItem
            key={index}
            index={index}
            animationValue={animationValue}
            setIsZoomed={setIsZoomed}
          />
        );
      }}
      customAnimation={customAnimation}
      scrollAnimationDuration={1200}
      enabled={!isZoomed}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
