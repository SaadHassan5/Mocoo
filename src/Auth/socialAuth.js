import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { filterCollection, filterCollectionDouble, filterCollectionSingle, getData, saveData } from './fire';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import AlertService from '../Services/alertService';
import firebase from '@react-native-firebase/app'
import { makeid } from '../assets/config/MakeId';
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
      QA: [],
      profileUri: '',
      showReminder: true,
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
    asGuest(props)
    // AlertService?.show('Invalid Credentials')
  }
}
async function asGuest(props) {
  const fcmToken = await messaging().getToken()
  const today = new Date();
  const currentWeekNumber = today.getWeek();
      let nw = await makeid(4);
      let em = 'guest' + nw + makeid(1) + '@gmail.com';
      let nm = 'Guest' + nw;
      await AsyncStorage.setItem('User', em);
      // await AsyncStorage.setItem('register', 'yes');
      await saveData("Login", em, {
        email: em,
        token: fcmToken,
        password: makeid(8),
        month: new Date().getMonth(),
        date: new Date().getDate(),
        year: new Date().getFullYear(),
        week: currentWeekNumber,
      })
      await saveData('Users', em, {
        email: em,
        name: nm,
        coupon: makeid(10).toLowerCase(),
        profileUri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ3LgaGH7CJf64-nrZrGMkQHuXw8li8k_P30qyBn3F3Ahcx0lJc7bLrg1ALMk4zJGbz7tg&usqp=CAU',
        history: [],
        pin: [],
        country:'United States',
        subscribedIds: [],
        QA: [],
        userStatus:'',
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
export const FireAuth = {
  Signup,
  Signin,
  Logout
}