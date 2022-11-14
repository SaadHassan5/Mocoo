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
import StateNav from './statesNav';
import ShowPosts from '../screens/ShowPosts/ShowPosts';

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
          <MyStack.Screen name="ShowCities" component={ShowCities} />
          <MyStack.Screen name="ShowStates" component={ShowStates} />
          <MyStack.Screen name="NewCities" component={NewCities} />
          <MyStack.Screen name="GroupChat" component={GroupChat} />
          <MyStack.Screen name="ShowGroups" component={ShowGroups} />
          <MyStack.Screen name="NewGroup" component={NewGroup} />
          <MyStack.Screen name="Profile" component={Profile} />
          <MyStack.Screen name="IndividualChat" component={IndividualChat} />
          <MyStack.Screen name="MyChat" component={MyChat} />
          <MyStack.Screen name="SubGroupPosts" component={SubGroupPosts} />
          <MyStack.Screen name="GroupTab" component={GroupTab} />
          <MyStack.Screen name="NewPost" component={NewPost} />
          <MyStack.Screen name="GroupMembers" component={GroupMembers} />
          <MyStack.Screen name="ShowCommunity" component={ShowCommunity} />
          <MyStack.Screen name="NewCommunity" component={NewCommunity} />
          <MyStack.Screen name="CommunityChat" component={CommunityChat} />
          <MyStack.Screen name="OtherProfile" component={OtherProfile} />
          <MyStack.Screen name="PostDetails" component={PostDetails} />
          <MyStack.Screen name="StateNav" component={StateNav} />
          <MyStack.Screen name="ShowPosts" component={ShowPosts} />
        </MyStack.Navigator>
    )
  }
}



export default Stack;