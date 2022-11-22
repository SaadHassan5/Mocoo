import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { filterCollection, filterCollectionDouble, filterCollectionSingle, getData, saveData } from './fire';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import AlertService from '../Services/alertService';
import firebase from '@react-native-firebase/app'
const iosCredentials = {
  clientId: '',
  appId: '1:302094283379:ios:7ce1b32738491d5721f006',
  apiKey: 'AIzaSyD4LhUHPXFXj_HHPZE75CGvu6Bxxlb5VQ0',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: 'personalize-4d320',
};
const androidCredentials = {
  clientId: '',
  appId: '1:302094283379:android:515aef4d4adb8cd621f006',
  apiKey: 'AIzaSyD4LhUHPXFXj_HHPZE75CGvu6Bxxlb5VQ0',
  databaseURL: '',
  storageBucket: '',
  messagingSenderId: '',
  projectId: 'personalize-4d320',
};
const credentials = Platform.select({
  android: androidCredentials,
  ios: iosCredentials,
});
const config = {
  name: 'com.ronakjoshid.time',
};

// firebase.initializeApp(credentials);

const Logout = async (props) => {
  await AsyncStorage.removeItem("User")
  await AsyncStorage.removeItem("Admin")
  props?.getUser({})
  props.navigation.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        { name: 'Splash' },
      ]
    })
  );
}
Date.prototype.getWeek = function () {
  var onejan = new Date(this.getFullYear(), 0, 1);
  var today = new Date(this.getFullYear(), this.getMonth(), this.getDate());
  var dayOfYear = ((today - onejan + 86400000) / 86400000);
  return Math.ceil(dayOfYear / 7)
};

const Signup = async (email, password, name, props) => {

  let response = false;
  const today = new Date();
  const currentWeekNumber = today.getWeek();
  const res = await getData('Login', email)
  if (res) {
    AlertService?.show('User Already Exist')
    response = false
  }
  else {
    AlertService.toastPrompt('User account created & signed in!');
    const fcmToken = await messaging().getToken()
    console.log("user", res);
    await AsyncStorage.setItem('User', email);
    await saveData("Users", email, {
      email: email,
      name: name,
      history: [],
      pin: [],
      subscribedIds: [],
      profileUri: '',
      showReminder: true,
      QA: [],
    })
    await saveData('Login', email, {
      email: email,
      password: password,
      token: fcmToken,
      month: new Date().getMonth(),
      date: new Date().getDate(),
      year: new Date().getFullYear(),
      week: currentWeekNumber,
    })
    response = true;
  }
  return response;
}
const Signin = async (email, password, props) => {
  // let dat=new Date().toDateString().toString().split(' ')
  console.log('signin', email + "  ", password);
  const res = await filterCollectionDouble('Login', "email", "==", email, "password", '==', password)
  if (res?.length > 0) {
    AlertService.toastPrompt('signed in!');
    const fcmToken = await messaging().getToken()
    await AsyncStorage.setItem('User', email);
    await saveData("Login", email, {
      email: email,
      token: fcmToken,
    })
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: 'Splash' },
        ]
      })
    );
  }
  else {
    AlertService?.show('Invalid Credentials')
  }
}
export const FireAuth = {
  Signup,
  Signin,
  Logout
}