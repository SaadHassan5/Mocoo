
import React, { useState } from "react";
import * as Yup from 'yup';
import { ActivityIndicator, View, Image, StyleSheet, TouchableOpacity, Text, SafeAreaView,ScrollView } from "react-native";
import Header from "../../components/Header";
import AppText from "../../components/AppText";
import AppForm from './../../components/form/AppForm';
import AppFormField from './../../components/form/AppFormField';
import SubmitButton from './../../components/form/SubmitButton';
import { spacing, colors } from "../../theme";
import { FireAuth } from '../../Auth/socialAuth';
import { Checkbox } from 'react-native-paper';
import { HP, palette, WP } from "../../assets/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from "react-native-vector-icons/Entypo"
import messaging from '@react-native-firebase/messaging';
// import CountryPicker from "react-native-country-codes-picker";
import { Input } from "../../assets/components/Input/Input";
import AlertService from "../../Services/alertService";
import { useEffect } from "react";
import { CountryPicker } from "react-native-country-codes-picker";
import { filterCollectionDouble, filterCollectionSingle } from "../../Auth/fire";

const validationSchema = Yup.object().shape({
});

export default function LoginScreen(props) {
  const [active, setActive] = useState(false)
  const [check, setCheck] = useState("uncheck")
  const [eye, setEye] = useState(true);
  const [countryCode, setCountryCode] = useState('');
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(false);
  useEffect(() => {
    // getToken()
  }, [])
  const getToken = async () => {
    const fcmToken = await messaging().getToken()
    const res = await filterCollectionSingle('Guests','token','==', fcmToken + '')
    if (res?.length > 0) {
      console.log('Exist');
    }
    else
      await saveData('Guests', '', {
        token: fcmToken
      })
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Login" goBack={false} />
      <CountryPicker
        show={show}
        pickerButtonOnPress={(item) => {
          setCountryCode(item.dial_code?.split('+')[1]);
          setShow(false);
        }}
        onBackdropPress={() => { setShow(false) }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 10,
          paddingVertical: 25,
        }}
      >
        <View style={styles.logoContainer}>
          <Image style={{ height: WP(30), width: WP(70) }} source={require("../../assets/images/logo/logo.png")} />
        </View>
        <View style={styles.formContainer}>
          <AppForm
          validationSchema={validationSchema}
            initialValues={{ password: "" }}
            onSubmit={async (values) => {
              const password = values.password;
              if (phone.length < 7 || countryCode?.trim() == "") {
                AlertService?.show('Enter valid number')
                return
              }
              if (check == 'uncheck')
                await FireAuth.Signin(countryCode + phone, password, props)
              else {
                const adm = await filterCollectionDouble("Admin", 'email','==',countryCode + phone, "password",'==', password);
                if (adm.length > 0) {
                  const fcmToken = await messaging().getToken()
                  await saveData("Admin", adm?.id, {
                    token: fcmToken,
                  })
                  await AsyncStorage.setItem('User', countryCode + phone);
                  await AsyncStorage.setItem('Admin', countryCode + phone);
                  props.navigation.replace('TabNavigator')
                }
                else
                  console.warn("Incorrect");
                AlertService?.toastPrompt("Wrong Credentials")
              }
            }}
          >
            <View style={{ flexDirection: 'row', marginBottom: HP(2) }}>
              <TouchableOpacity style={{ backgroundColor: colors.light }} onPress={() => { setShow(true) }}>
                <Input editable placeTxt={"Code"} value={countryCode} styles={{ borderTopLeftRadius: WP(2), borderBottomLeftRadius: WP(2), borderRadius: 0, width: WP(25), backgroundColor: 'transparent', padding:10 }} />
              </TouchableOpacity>
              <Input onChange={(e) => { setPhone(e) }} keyboardType={'number-pad'} placeTxt={'Phone'} styles={{ borderTopRightRadius: WP(2), borderBottomRightRadius: WP(2), borderRadius: 0, width: WP(57), backgroundColor: colors.light, padding:10 }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppFormField placeholderText="Password" name="password" secureTextEntry={eye} style={{ width: '100%' }} />
              <TouchableOpacity onPress={() => { setEye(!eye) }} style={{ position: 'absolute', paddingBottom: WP(3), right: 0, paddingHorizontal: WP(5) }}>
                {eye ?
                  <Entypo name={'eye'} size={25} color={palette?.lighBlueBtnTitle} />
                  :
                  <Entypo name={'eye-with-line'} size={25} color={palette?.lighBlueBtnTitle} />
                }
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => { check == "check" ? setCheck('uncheck') : setCheck('check') }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: HP(1) }}>
              <Text style={{ ...styles.label }}>Login as Admin</Text>
              <Checkbox status={check == "check" ? 'checked' : 'unchecked'} color={colors.primary} uncheckedColor={'red'} />
            </TouchableOpacity>
            <SubmitButton title="Login" style={{ marginTop: spacing[4],paddingVertical:HP(1) }} />
            
          </AppForm>
        </View>
      </ScrollView>
        <View style={styles.signUpLinkContainer}>
          <TouchableOpacity onPress={() => props.navigation.navigate("RegisterScreen")} style={styles.signUpTextContainer}>
            <AppText>Don’t have an account?</AppText>
            <AppText  style={styles.link}>Sign Up</AppText>
          </TouchableOpacity>
        </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 15,
    marginBottom: 50,
    alignItems: "center",
  },
  userCheckMeta: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  forgotPass: {
    textAlign: "right",
    color: colors.black
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    margin: 8,
    color: colors.black
  },
  loginBtn: {
    marginTop: 20,
  },
  signUpLinkContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: "row",
  },
  signUpTextContainer: {
    flexDirection: "row",
  },
  link: {
    marginLeft: 5,
    color: colors.primary,
  },
});
