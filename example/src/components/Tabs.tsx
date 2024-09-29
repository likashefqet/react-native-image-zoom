import React, { PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  FadeOutUp,
  FadeInDown,
  Layout,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS } from '../themes/colors';
import { FadeOutDown } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type TabProps = {
  isActive: boolean;
  isMenuVisible: boolean;
};

export const Tab = ({
  isActive,
  isMenuVisible,
  children,
}: PropsWithChildren<TabProps>) => {
  const { top } = useSafeAreaInsets();

  if (!isActive) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      style={[
        styles.tabContainer,
        isMenuVisible && {
          ...styles.tabContainerMenuActive,
          marginTop: top,
        },
      ]}
      layout={Layout}
    >
      {children}
    </Animated.View>
  );
};

type TabsProps = {
  tabs: {
    name: string;
    component: React.ReactNode;
  }[];
  isMenuVisible: boolean;
  renderMenu?: () => React.ReactNode | undefined;
};

export const Tabs = ({ tabs, isMenuVisible, renderMenu }: TabsProps) => {
  const { bottom } = useSafeAreaInsets();
  const [activeIndex, setActiveIndex] = useState(2);

  return (
    <>
      {tabs.map(({ component, name }, index) => (
        <Tab
          key={`Tab${index}${name}`}
          isActive={activeIndex === index}
          isMenuVisible={isMenuVisible}
        >
          {component}
        </Tab>
      ))}
      <Animated.View
        layout={Layout}
        style={{ paddingBottom: isMenuVisible ? 0 : bottom }}
      >
        {renderMenu && renderMenu()}
        {isMenuVisible && (
          <Animated.ScrollView
            entering={FadeInDown}
            exiting={FadeOutDown}
            horizontal
            contentContainerStyle={[
              styles.itemsContainer,
              { paddingBottom: bottom },
            ]}
          >
            {tabs.map(({ name }, index) => (
              <AnimatedPressable
                key={`MenuItem${index}${name}`}
                entering={FadeInDown.delay(64 * index)}
                exiting={FadeOutDown}
                layout={Layout}
                onPress={() => setActiveIndex(index)}
                style={[
                  styles.itemPressable,
                  index === activeIndex && styles.itemPressableActive,
                ]}
              >
                <Text style={styles.itemText}>{name}</Text>
              </AnimatedPressable>
            ))}
          </Animated.ScrollView>
        )}
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  tabContainerMenuActive: {
    marginHorizontal: 15,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: COLORS.mainDark,
  },
  itemsContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  itemPressable: {
    borderWidth: 1,
    borderColor: COLORS.mainDark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 25,
  },
  itemPressableActive: {
    borderColor: COLORS.accent,
  },
  itemText: {
    color: COLORS.white,
  },
});
