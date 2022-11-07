import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';

const MyStack = createStackNavigator();
const GroupTab=()=>{
    return (
        <MyStack.Navigator initialRouteName={'HomeScreen'} screenOptions={{headerShown:false}}>
          {/* <MyStack.Screen name="HomeScreen" component={HomeScreen} /> */}
        </MyStack.Navigator>
    )
}
export default GroupTab;