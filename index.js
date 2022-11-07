/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { EventType } from "@notifee/react-native";
import { LocalNotifee } from './src/Notification/LocalPushController';

const channelId = notifee.createChannel({
  id: 'default',
  name: 'Default Channel',
});
messaging().setBackgroundMessageHandler(async remoteMessage => {
  LocalNotifee(remoteMessage?.notification?.title, remoteMessage?.notification?.body, remoteMessage?.data != {} ? remoteMessage?.data : {})
  console.log('Message handled in the background!', remoteMessage);
});
AppRegistry.registerComponent(appName, () => App);
