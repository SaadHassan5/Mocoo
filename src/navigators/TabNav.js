import * as React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HP, WP } from '../assets/config';
import fontFamily from '../assets/config/fontFamily';
import FontAwesome from "react-native-vector-icons/FontAwesome"
import ShowVerification from '../screens/ShowVerification/ShowVerification';

const Tab = createBottomTabNavigator();
const TabNav=(props)=> {

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
       <Tab.Screen name="ShowVerification" component={ShowVerification}
        options={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <FontAwesome name={'pagelines'} size={20} color={focused ? "#fff" : "grey"} />
              <Text style={{ color: focused ? "#fff" : "grey", fontFamily: fontFamily.bold, fontSize: 10 }}>Verify</Text>
            </View>
          )
        }}
      />
    </Tab.Navigator >
  );
}
export default TabNav