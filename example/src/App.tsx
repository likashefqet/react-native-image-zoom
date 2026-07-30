import React from 'react';
import { StyleSheet } from 'react-native';
import { TabScreen } from './screens/TabsScreen';
import safeAreaContextProviderHOC from './safeAreaContextProviderHOC';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <TabScreen />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default safeAreaContextProviderHOC(App);
