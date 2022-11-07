/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {} from 'react-native';
import { Provider } from 'react-redux';
import Stack from './src/navigators/main-navigator';
import { store } from './src/root/store';

const App=()=>{
  return(
    <Provider store={store}>
    <NavigationContainer>
      <Stack/>
    </NavigationContainer>
    </Provider>
  )
}

export default App;
