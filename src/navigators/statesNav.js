import React, { Component } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen/RegisterScreen';
import Splash from '../screens/Splash/Splash';
import UserTab from './userTab';
import NewState from '../screens/NewState';
import ShowCities from '../screens/ShowCities/ShowCities';
import ShowStates from '../screens/ShowStates/ShowStates';
import NewCities from '../screens/NewCities';
import GroupChat from '../screens/Chat.js/GroupChat';
import ShowGroups from '../screens/ShowGroups/ShowGroups';
import NewGroup from '../screens/NewGroup';
import Profile from '../screens/Profile/Profile';
import IndividualChat from '../screens/IndividualChat/IndividualChat';
import MyChat from '../screens/MyChat/MyChat';
import SubGroupPosts from '../screens/SubGroupPosts/SubGroupPosts';
import GroupTab from './groupTab';
import NewPost from '../screens/NewPost';
import GroupMembers from '../screens/GroupMembers/GroupMembers';
import ShowCommunity from '../screens/ShowCommunity/ShowCommunity';
import NewCommunity from '../screens/NewCommunity';
import CommunityChat from '../screens/CommunityChat/CommunityChat';
import OtherProfile from '../screens/OtherProfile/OtherProfile';
import PostDetails from '../screens/PostDetails/PostDetails';

const MyStack = createStackNavigator();
class StateNav extends Component {
  render() {
    return (
        <MyStack.Navigator initialRouteName={'ShowStates'} screenOptions={{headerShown:false}}>
          <MyStack.Screen name="ShowStates" component={ShowStates} />
          <MyStack.Screen name="NewState" component={NewState} />
          <MyStack.Screen name="ShowCities" component={ShowCities} />
          <MyStack.Screen name="NewCities" component={NewCities} />
          <MyStack.Screen name="ShowGroups" component={ShowGroups} />
          <MyStack.Screen name="NewGroup" component={NewGroup} />
          {/* <MyStack.Screen name="SubGroupPosts" component={SubGroupPosts} /> */}
          {/* <MyStack.Screen name="GroupTab" component={GroupTab} /> */}
        </MyStack.Navigator>
    )
  }
}



export default StateNav;