import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAw5 from "react-native-vector-icons/FontAwesome5"
import Entypo from "react-native-vector-icons/Entypo"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import fontFamily from '../assets/config/fontFamily';
import { HP } from '../assets/config';
import GroupChat from '../screens/Chat.js/GroupChat';
import SubGroupPosts from '../screens/SubGroupPosts/SubGroupPosts';
import GroupMembers from '../screens/GroupMembers/GroupMembers';
import ShowCommunity from '../screens/ShowCommunity/ShowCommunity';

const Tab = createBottomTabNavigator();

const GroupTab=(props)=> {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderColor: 'red',
          height: HP(9),
          position: 'absolute',
          top: 0
        }
      }}
    >
       <Tab.Screen name="GroupChat" component={GroupChat} initialParams={props?.route?.params}
        options={{
          // tabBarLabel: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name={'chat'} size={20} color={focused ? "black" : "grey"} />
              <Text style={{ color: focused ? "black" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Chat</Text>
            </View>
          )
        }}
      />
        <Tab.Screen name="Members" component={GroupMembers} initialParams={props?.route?.params}
        options={{
          // tabBarLabel: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <Entypo name={'users'} size={20} color={focused ? "black" : "grey"} />
              <Text style={{ color: focused ? "black" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Members</Text>
            </View>
          )
        }}
      />
      <Tab.Screen name="ShowCommunity" component={ShowCommunity} initialParams={props?.route?.params}
        options={{
          // tabBarLabel: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons name={'nature-people'} size={20} color={focused ? "black" : "grey"} />
              <Text style={{ color: focused ? "black" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Small Chat</Text>
            </View>
          )
        }}
      /> 
      <Tab.Screen name="Post" component={SubGroupPosts} initialParams={props?.route?.params}
        options={{
          // tabBarLabel: true,
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FontAw5 name={'share'} size={20} color={focused ? "black" : "grey"} />
              <Text style={{ color: focused ? "black" : "grey", fontFamily: fontFamily.bold, fontSize: 12 }}>Posts</Text>
            </View>
          )
        }}
      /> 
    </Tab.Navigator >
  );
}
export default GroupTab;