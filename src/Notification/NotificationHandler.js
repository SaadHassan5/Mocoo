import notifee, { EventType } from "@notifee/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getData } from "../Auth/fire";
import { cancel, LocalNotifee } from "./LocalPushController";
import messaging from '@react-native-firebase/messaging';

export async function bootstrap(nav,) {
    const initialNotification = await notifee.getInitialNotification();
    const value = await AsyncStorage.getItem("User")

    if (initialNotification) {
      console.log('Notification caused application to open initial', initialNotification.notification);
      console.log('User pres', initialNotification.notification);
      if (initialNotification.notification?.data?.screen == 'Folders') {
        const res = await getData('Folders', initialNotification.notification?.data?.groupId)
        if (value != null)
          nav?.current?.navigate('UserTab', res)
        else
          nav?.current?.navigate('PostDetailGuest', res)
      }
      else if (initialNotification.notification?.data?.screen == 'post' && value!=null) {
        nav?.current?.navigate('Profile')
        // const res = await getData('Posts', initialNotification.notification?.data?.postId)
        // nav?.current?.navigate('PostDetails', {...res,id:initialNotification.notification?.data?.postId})
      }
        cancel(initialNotification.notification?.id)
      console.log('User pressed notification fore', initialNotification.notification);

      console.log('Press action used to open the app initial', initialNotification.pressAction);
    }
  }

  export async function onBackNotify(nav) {
    const sub = notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;
      console.log('hello back', detail);
      switch (type) {
        case EventType.DISMISSED:
          cancel(detail.notification?.id)
          console.log('User dismissed notification fore', detail.notification);
          break;
        case EventType.PRESS:
          const value = await AsyncStorage.getItem("User");
          let getUserData = await getData("Users", value)
          console.log(getUserData);
          console.log('User pres', detail.notification);
          if (detail.notification?.data?.screen == 'Folders') {
            const res = await getData('Folders', detail.notification?.data?.groupId)
            if (value != null)
              nav?.current?.navigate('UserTab', res)
            else
              nav?.current?.navigate('PostDetailGuest', res)
          }
          else if (detail.notification?.data?.screen == 'post' && value!=null) {
            // const res = await getData('Posts', detail.notification?.data?.postId)
            nav?.current?.navigate('Profile')
          }
          // setNotiMod(true)
          // selectImg(detail?.notification?.id)
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
 export  const foreNotifee = async (nav) => {
    const unsub = await notifee.onForegroundEvent(async ({ type, detail }) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification fore', detail.notification);
          cancel(detail.notification?.id)
          break;
        case EventType.PRESS:
          const value = await AsyncStorage.getItem("User");
          let getUserData = await getData("Users", value)
          console.log(getUserData);
          console.log('User pres', detail.notification);
          if (detail.notification?.data?.screen == 'Folders') {
            const res = await getData('Folders', detail.notification?.data?.groupId)
            if (value != null)
              nav?.current?.navigate('UserTab', res)
            else
              nav?.current?.navigate('PostDetailGuest', res)
          }
          else if (detail.notification?.data?.screen == 'post' && value!=null) {
            nav?.current?.navigate('Profile')
            // const res = await getData('Posts', detail.notification?.data?.postId)
            // nav?.current?.navigate('PostDetails', {...res,id:detail.notification?.data?.postId})
          }
          
          // setNotiMod(true)
          // selectImg(detail?.notification?.id)
          cancel(detail.notification?.id)
          break;
      }
    });
    return unsub
  }