import * as React from 'react';
import { StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function safeAreaContextProviderHOC<P extends object>(
  Component: React.ComponentType<P>,
  containerStyles?: StyleProp<ViewStyle>
): React.ComponentType<P> {
  function Wrapper(props: P) {
    return (
      <SafeAreaProvider style={[styles.container, containerStyles]}>
        <Component {...props} />
      </SafeAreaProvider>
    );
  }

  Wrapper.displayName = `safeAreaContextProviderHOC(${
    Component.displayName || Component.name
  })`;

  return Wrapper;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
});
