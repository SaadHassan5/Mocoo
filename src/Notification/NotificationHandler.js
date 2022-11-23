import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../Auth/fire";
import { cancel, LocalNotifee } from "./LocalPushController";
import messaging from '@react-native-firebase/messaging';
import AlertService from "../Services/alertService";

export async function bootstrap(nav,) {
  const initialNotification = await notifee.getInitialNotification();
  const value = await AsyncStorage.getItem("User")

  if (initialNotification) {
    // console.log('Notification caused application to open initial', initialNotification.notification);
    // console.log('User pres', initialNotification.notification);
    if (value != null)
      whatToDo(nav,initialNotification?.notification)
  cancel(initialNotification.notification?.id)
  // console.log('User pressed notification fore', initialNotification.notification);

  // console.log('Press action used to open the app initial', initialNotification.pressAction);
}
}

export async function onBackNotify(nav) {
  const sub = notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;
    // console.log('hello back', detail);
    switch (type) {
      case EventType.DISMISSED:
        cancel(detail.notification?.id)
        // console.log('User dismissed notification fore', detail.notification);
        break;
      case EventType.PRESS:
        const value = await AsyncStorage.getItem("User");
        if (value != null)
          whatToDo(nav,detail?.notification)
        cancel(detail.notification?.id)
        break;
    }
  });
  return sub;
}

export const notf = async () => {
  const unsubscribe = await messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    LocalNotifee(remoteMessage?.notification?.title, remoteMessage?.notification?.body, remoteMessage?.data != {} ? remoteMessage?.data : {})
    // Alert.alert(remoteMessage?.notification?.title)
    // selectFile();
  })
  return unsubscribe;
}
export const foreNotifee = async (nav) => {
  const unsub = await notifee.onForegroundEvent(async ({ type, detail }) => {
    switch (type) {
      case EventType.DISMISSED:
        // console.log('User dismissed notification fore', detail.notification);
        cancel(detail.notification?.id)
        break;
      case EventType.PRESS:
        const value = await AsyncStorage.getItem("User");
        if (value != null) {
          whatToDo(nav,detail?.notification);
        }
        cancel(detail.notification?.id)
        break;
    }
  });
  return unsub
}

async function whatToDo(nav,notification) {
  console.log('WhatToDO', notification);
  if(notification?.data?.screen=='GroupChat'){
    let res=await getData('Groups',notification?.data?.id)
    nav?.current?.navigate('GroupChat',{...res})
  }
  else if(notification?.data?.screen=='IndividualChat'){
    let res=await getData('Users',notification?.data?.reciever)
    console.log('DAAAA',res);
    nav?.current?.navigate('IndividualChat',{email:res?.email,name:res?.name,profileUri:res?.profileUri})
  }
  else if(notification?.data?.screen=='CommunityChat'){
    let res=await getData('CommunityChats',notification?.data?.id)
    console.log('DAAAA',res);
    nav?.current?.navigate('CommunityChat',{name:res?.communityName,communityId:notification?.data?.id,owner:res?.owner    })
  }
  else if(notification?.data?.screen=='newPost'){
    let res=await getData('Posts',notification?.data?.postId)
    console.log('DAAAA',res);
    nav?.current?.navigate('PostDetails',{...res})
  }
  else if(notification?.data?.screen=='newComment'){
    console.log('comooooooooooo');
    let res=await getData('Posts',notification?.data?.postId)
    console.log('DAAAA',res);
    nav?.current?.navigate('PostDetails',{...res})
  }
  else if(notification?.data?.screen=='newFriendPost'){
    nav?.current?.navigate('Friends')
  }
}