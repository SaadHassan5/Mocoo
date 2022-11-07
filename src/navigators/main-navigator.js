import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import Splash from '../screens/Splash/Splash';
import UserTab from './userTab';
import NewState from '../screens/NewState';

const MyStack = createStackNavigator();
class Stack extends Component {
  render() {
    return (
        <MyStack.Navigator initialRouteName={'Splash'} screenOptions={{headerShown:false}}>
          <MyStack.Screen name="LoginScreen" component={LoginScreen} />
          <MyStack.Screen name="Splash" component={Splash} />
          <MyStack.Screen name="RegisterScreen" component={RegisterScreen} />
          <MyStack.Screen name="UserTab" component={UserTab} />
          <MyStack.Screen name="NewState" component={NewState} />
        </MyStack.Navigator>
    )
  }
}



export default Stack;