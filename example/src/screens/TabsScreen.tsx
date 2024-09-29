import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
import { Tabs } from '../components/Tabs';
import { COLORS } from '../themes/colors';
import { CarouselTab } from './CarouselTab';
import { ExpoImageZoomTab } from './ExpoImageZoomTab';
import { ImageZoomTab } from './ImageZoomTab';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TabScreen = () => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const toggleMenu = () => {
    setIsMenuVisible((current) => !current);
  };
  return (
    <>
      <Tabs
        tabs={[
          {
            name: 'Image Zoom',
            component: <ImageZoomTab />,
          },
          {
            name: 'Expo Image Zoom',
            component: <ExpoImageZoomTab />,
          },
          {
            name: 'Carousel',
            component: <CarouselTab />,
          },
        ]}
        renderMenu={() => (
          <AnimatedPressable
            onPress={toggleMenu}
            entering={FadeIn}
            exiting={FadeOut}
            layout={Layout} // LinearLayout on reanimated 3
            style={styles.menuPressable}
          >
            <Text style={styles.menuText}>{isMenuVisible ? '×' : '≡'}</Text>
          </AnimatedPressable>
        )}
        isMenuVisible={isMenuVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  menuPressable: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.mainDarkAlpha(0.16),
    borderWidth: 2,
    borderRadius: 25,
    borderColor: COLORS.white,
    marginTop: 16,
    marginRight: 16,
    alignSelf: 'flex-end',
  },
  menuText: {
    fontSize: 28,
    lineHeight: 28,
    color: COLORS.white,
    verticalAlign: 'middle',
    includeFontPadding: false,
  },
});
