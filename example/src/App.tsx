import React from 'react';
import { TabScreen } from './screens/TabsScreen';
import safeAreaContextProviderHOC from './safeAreaContextProviderHOC';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

function App() {
  return <TabScreen />;
}

export default safeAreaContextProviderHOC(gestureHandlerRootHOC(App));
