import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './src/screen/mapScreen';
import HomeScreen from './src/screen/home';
import AutoCompleteScreen from './src/screen/autoComplete';
import FindPlaceScreen from './src/screen/findPlace';
import ManualEditingScreen from './src/screen/manualediting';

import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
const Stack = createNativeStackNavigator();

const options = {
    headerShown: false,
    gestureDirection: 'vertical',
    transitionSpec: {
      open: TransitionSpecs.TransitionIOSSpec,
      close: TransitionSpecs.TransitionIOSSpec,
    },
  }
const App = () => {
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={options} />
        <Stack.Screen name="MapScreen" component={MapScreen} options={options}/>
        <Stack.Screen name="AutoCompleteScreen" component={AutoCompleteScreen}options={options} />
        <Stack.Screen name="FindPlaceScreen" component={FindPlaceScreen}options={options} />
        <Stack.Screen name="ManualEditingScreen" component={ManualEditingScreen}options={options} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
