import * as React from 'react';
import { Image, Settings, Text, TouchableOpacity, View } from 'react-native';
// import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { HP, palette, WP } from '../assets/config';
import { colors } from '../theme';
import fontFamily from '../assets/config/fontFamily';
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import ShowStates from '../screens/ShowStates/ShowStates';
import Profile from '../screens/Profile/Profile';
import MyChat from '../screens/MyChat/MyChat';
import StateNav from './statesNav';
import ShowPosts from '../screens/ShowPosts/ShowPosts';

const ScannerButton = (prop) => {
  return (
    <TouchableOpacity onPress={() => { prop.navigation?.navigate('QRR') }} style={{ backgroundColor: '#fff', width: WP(20), height: WP(20), borderRadius: WP(10), marginTop: -HP(5), justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: palette.lighterGrey }}>
      {/* <IconScanner name='qr-code-scanner' color={colors.primary} size={30} /> */}
    </TouchableOpacity>
  )
}
const Tab = createBottomTabNavigator();
const UserTab=(props)=> {

  return (
    <Tab.Navigator
      initialRouteName='QRR'
      screenOptions={{
        headerShown: false,
        // tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'black',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          // borderWidth: 1,
          borderColor: '#fff',
          paddingLeft: 20, paddingRight: 20,
          height: HP(9),
          position: 'absolute',
          bottom: 6,
          width: "98%", marginLeft: WP(2.5),
        }
      }}

    >
       <Tab.Screen name="Posts" component={ShowPosts}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesome name={'pagelines'} size={20} color={focused ? "#fff" : "grey"} />
              <Text style={{ color: focused ? "#fff" : "grey", fontFamily: fontFamily.bold, fontSize: 10 }}>Posts/Events</Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="ShowStates" component={StateNav}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesome5 name={'map'} size={20} color={focused ? "#fff" : "grey"} />
              <Text style={{ color: focused ? "#fff" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>States</Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="Chat" component={MyChat}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name={'chat'} size={20} color={focused ? "#fff" : "grey"} />
              <Text style={{ color: focused ? "#fff" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Chat</Text>
            </View>
          )
        }}
      />
     
      <Tab.Screen name="Profile" component={Profile}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name={'user'} size={20} color={focused ? "#fff" : "grey"} />
              <Text style={{ color: focused ? "#fff" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Profile</Text>
            </View>
          )
        }}
      />
    </Tab.Navigator >
  );
}
export default UserTab