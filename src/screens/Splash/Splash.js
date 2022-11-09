import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { getData } from '../../Auth/fire';

const Splash = (props) => {
  const [active, setActive] = useState(false)

  useEffect(() => {
      checkUser();
      // checkDate();
  }, [])
  const checkUser = async () => {
    const adm = await AsyncStorage.getItem("Admin")
    if (adm != null) {
      setTimeout(() => {
        props.navigation.replace('TabNavigator');
      }, 1000);
    }
    else {
      const value = await AsyncStorage.getItem("User")
      if (value != null) {
        const res =await getData('Users',value)
        props?.getUser(res)
        props.navigation.replace('UserTab');
      }
      else
        props.navigation.replace('LoginScreen');

    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <View style={{ width: '100%', height: "100%", backgroundColor: '#FF5757', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', position: 'absolute', }}>
        <ImageBackground resizeMode='contain' style={{width: '100%', height: "100%", }} source={IMAGES.blackLogo}>

        </ImageBackground>
      </View>
    </View>
  )
}

const mapStateToProps = (state) => {
  const { backgroundColor } = state;
  const { user } = state;
  console.log('Redux Profile=>', user);

  return state;
};
const mapDispatchToProps = (dispatch) => {
  return {
      changeBackgroundColor: (bg) => dispatch(ChangeBackgroundColor(bg)),
      getUser: (userInfo) => dispatch(GetUser(userInfo)),
  }
}
// export default Home
export default connect(mapStateToProps, mapDispatchToProps)(Splash);