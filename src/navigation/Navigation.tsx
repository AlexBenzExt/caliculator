import {Text, View} from 'react-native';
import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Caliculator from '../screens/caliculator/Caliculator';
import History from '../screens/history/History';

const Stack = createNativeStackNavigator();

export default class Navigation extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          <Stack.Screen name="Caliculator" component={Caliculator} />
          <Stack.Screen name="Histroy" component={History} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
