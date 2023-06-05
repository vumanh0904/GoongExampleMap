import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MapScreen from './src/screen/mapScreen';
import HomeScreen from './src/screen/home';
import AutoCompleteScreen from './src/screen/autoComplete';
import FindPlaceScreen from './src/screen/findPlace';
import ManualEditingScreen from './src/screen/manualediting';
import DistanceMatrixScreen from './src/screen/distanceMatrix';
import CircleMapScreen from './src/screen/circleMap';

import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

const options = {
  headerShown: false,
  gestureDirection: 'vertical',
  transitionSpec: {
    open: TransitionSpecs.TransitionIOSSpec,
    close: TransitionSpecs.TransitionIOSSpec,
  },
};
const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={options}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="MapScreen" component={MapScreen} />
          <Stack.Screen
            name="AutoCompleteScreen"
            component={AutoCompleteScreen}
          />
          <Stack.Screen name="FindPlaceScreen" component={FindPlaceScreen} />
          <Stack.Screen
            name="ManualEditingScreen"
            component={ManualEditingScreen}
          />
          <Stack.Screen
            name="DistanceMatrixScreen"
            component={DistanceMatrixScreen}
          />
          <Stack.Screen name="CircleMapScreen" component={CircleMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
