// // import * as React from 'react';
// // import {NavigationContainer} from '@react-navigation/native';
// // import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
// // import MapScreen from './screen/mapScreen';
// // import {createNativeStackNavigator} from '@react-navigation/native-stack';

// // const Stack = createNativeStackNavigator();


// // const options = {
// //   headerShown: false,
// //   gestureDirection: 'vertical',
// //   transitionSpec: {
// //     open: TransitionSpecs.TransitionIOSSpec,
// //     close: TransitionSpecs.TransitionIOSSpec,
// //   },
// // };
// // function NavigationStack() {
// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator>
// //         <Stack.Screen
// //           name="MapScreen"
// //           component={MapScreen}
// //           options={options}
// //         />        
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // }

// // export default NavigationStack;
// import * as React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
// import MapScreen from './screen/mapScreen';
// import HomeScreen from './screen/home';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';

// const Stack = createNativeStackNavigator();
// const StackSignedIn = createNativeStackNavigator();

// const options = {
//   headerShown: false,
//   gestureDirection: 'vertical',
//   transitionSpec: {
//     open: TransitionSpecs.TransitionIOSSpec,
//     close: TransitionSpecs.TransitionIOSSpec,
//   },
// };
// function NavigationStack() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>        
//         <Stack.Screen
//           name="HomeScreen"
//           component={HomeScreen}
//           options={options}
//         />
//         {/* <Stack.Screen
//           name="MapScreen"
//           component={MapScreen}
//           options={options}
//         /> */}
        
//         {/* <StackSignedIn.Group
//           initialRouteName="MainStack"
//           screenOptions={{
//             headerShown: false,
//           }}>
//           <StackSignedIn.Screen name="MainStack" component={MainStack} />
//           <StackSignedIn.Screen
//             name="RVCCashierScreen"
//             component={RVCCashier}
//           />
//           <StackSignedIn.Screen name="HomeScreen" component={HomeScreen} />
//           <StackSignedIn.Screen name="OpenTable" component={OpenTable} />
//           <StackSignedIn.Screen name="MenuScreen" component={MenuScreen} />
//           <StackSignedIn.Screen name="SearchScreen" component={SearchScreen} />
//           <StackSignedIn.Screen name="MenuListScreen" component={MenuList} />
//           <StackSignedIn.Screen name="Others" component={Others} />
//           <StackSignedIn.Screen name="Language" component={Language} />
//           <StackSignedIn.Screen
//             name="ViewOrderScreen"
//             component={ViewOrderScreen}
//           />
//           <StackSignedIn.Screen name="ChangeScreen" component={ChangeScreen} />
//         </StackSignedIn.Group> */}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }
// export default NavigationStack;
