/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useRef} from 'react';
import {} from 'react-native';
import {Provider} from 'react-redux';
import Stack from './src/navigators/main-navigator';
import {store} from './src/root/store';
import {cancel, LocalNotifee} from './src/Notification/LocalPushController';
import {
  bootstrap,
  foreNotifee,
  notf,
  onBackNotify,
} from './src/Notification/NotificationHandler';
import {requestUserPermission} from './src/Notification/notificationService';

const App = () => {
  const nav = useRef();

  useEffect(() => {
    requestUserPermission();
    onBackNotify(nav);
    bootstrap(nav);
    foreNotifee(nav);
    notf();
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer ref={nav}>
        <Stack />
      </NavigationContainer>
    </Provider>
  );
};

export default App;
