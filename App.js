import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useRef } from 'react';
import { } from 'react-native';
import { Provider } from 'react-redux';
import Stack from './src/navigators/main-navigator';
import { store } from './src/root/store';
import { cancel, LocalNotifee } from './src/Notification/LocalPushController';
import { bootstrap, foreNotifee, notf, onBackNotify } from './src/Notification/NotificationHandler';
import { getLink } from './src/Services/DynamicLink';

const App = () => {
  const nav = useRef();

  useEffect(() => {
    getLink(nav)
    onBackNotify(nav)
    bootstrap(nav)
    foreNotifee(nav);
    notf();
  }, [])
  return (
    <Provider store={store}>
      <NavigationContainer ref={nav}>
        <Stack />
      </NavigationContainer>
    </Provider>
  )
}

export default App;
