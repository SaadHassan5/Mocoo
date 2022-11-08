import React, { useState } from "react";
import { View, Image, StyleSheet, TouchableOpacity, ActivityIndicator, SafeAreaView, ScrollView } from "react-native";
import * as Yup from "yup";
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, spacing } from "../../theme";
import Header from "./../../components/Header";
import AppForm from './../../components/form/AppForm';
import AppFormField from './../../components/form/AppFormField';
import SubmitButton from './../../components/form/SubmitButton';
import AppText from './../../components/AppText';
import { HP, palette, WP } from "../../assets/config";
import { FireAuth } from "../../Auth/socialAuth";
import fontFamily from "../../assets/config/fontFamily";
import Entypo from "react-native-vector-icons/Entypo"
import { CommonActions } from '@react-navigation/native';
import { saveData, uploadFile } from "../../Auth/fire";
import { CustomBtn1 } from "../../assets/components/CustomButton/CustomBtn1";
import AlertService from "../../Services/alertService";
import { CountryPicker } from "react-native-country-codes-picker";
import { Input } from "../../assets/components/Input/Input";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
});



export default function RegisterScreen(props) {

  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [eye, setEye] = useState(true);
  const [imgs, setImgs] = useState({})
  const [active, setActive] = useState(false)
  const [countryCode, setCountryCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');
  const [show, setShow] = useState(true);

  const handleFormSubmit = async (values) => {
    if (phone.length<7 || countryCode?.trim() == "" || country?.trim() == "" || imgs=={}) {
      AlertService?.show('Enter valid number')
      return
    }
    const name = values.name;
    const password = values.password;
    // if (imgs.uri) {
    // setActive(true)
    AlertService.toastPrompt("Processing")
    const res = await FireAuth.Signup(countryCode+phone, password, name, props)
    if (res) {
      setTimeout(() => {
        AlertService?.toastPrompt("Please wait Image is Uploading")
      }, 2000);
      const rs = await uploadFile(imgs?.uri, imgs?.fileName, countryCode+phone);
      if (rs) {
        await saveData("Users", countryCode+phone, {
          profileUri: rs,
          country:country,
        })
      setActive(false)
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            { name: 'Splash' },
          ]
        })
      );
      }
    }
  }
  async function onBrowse(res) {
    const options = {
      mediaType: 'photos',
      base64: true,
      // selectionLimit: 5
    }
    await launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else {
        let _img = response?.assets[0]?.uri;
        console.log("image---->", response?.assets);
        setImgs(response?.assets[0])
        // toastPrompt("Image Uploaded")
      }
    })
  }
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <Header title="Register" onPress={() => props.navigation.goBack()} />
      <CountryPicker
        show={show}
        pickerButtonOnPress={(item) => {
          console.log('OBJ',item?.name?.en);
          setCountryCode(item.dial_code?.split('+')[1]);
          setCountry(item?.name?.en)
          setShow(false);
        }}
        onBackdropPress={() => { setShow(false) }}
      />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image style={{ height: WP(30), width: WP(70) }} source={require("../../assets/images/logo/logo.png")} />

        </View>
        <View style={styles.formContainer}>
          <AppForm
            initialValues={{ name: "", password: "" }}

            onSubmit={handleFormSubmit}
            validationSchema={validationSchema}
          >

            <AppFormField autoCapitalize="none" placeholderText="Name" name="name" />
            <View style={{ flexDirection: 'row', marginBottom: HP(2) }}>
              <TouchableOpacity style={{ backgroundColor: colors.light }} onPress={() => { setShow(true) }}>
                <Input editable placeTxt={"Code"} value={countryCode} styles={{ borderTopLeftRadius: WP(2), borderBottomLeftRadius: WP(2), borderRadius: 0, width: WP(27), backgroundColor: 'transparent' }} />
              </TouchableOpacity>
              <Input onChange={(e) => { setPhone(e) }} keyboardType={'number-pad'} placeTxt={'Phone'} styles={{ borderTopRightRadius: WP(2), borderBottomRightRadius: WP(2), borderRadius: 0, width: WP(60), backgroundColor: colors.light }} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <AppFormField autoCapitalize="none" placeholderText="Password" name="password" secureTextEntry={eye} style={{ width: '100%' }} />
              <TouchableOpacity onPress={() => { setEye(!eye) }} style={{ position: 'absolute', paddingBottom: WP(3), right: 0, paddingHorizontal: WP(5) }}>
                {eye ?
                  <Entypo name={'eye'} size={25} color={palette?.lighBlueBtnTitle} />
                  :
                  <Entypo name={'eye-with-line'} size={25} color={palette?.lighBlueBtnTitle} />
                }
              </TouchableOpacity>
            </View>
            {/* {imgs?.uri &&
              <Image source={{ uri: imgs?.uri }} style={{ alignSelf: 'center', width: WP(25), height: WP(25), marginLeft: WP(2), marginTop: HP(1) }} />
            } */}
            {/* <AppButton onPress={() => onBrowse()} style={{ marginTop: 10, marginBottom: 10, backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.gray }} textColor={true} title="Add Profile Image" /> */}
            <CustomBtn1 onPress={() => onBrowse()} style={{ height: HP(6), marginTop: 10, marginBottom: 10, backgroundColor: 'transparent', borderWidth: 2, borderColor: colors.gray }} txtStyle={{ color: 'black', fontFamily: fontFamily.regular, fontSize: 15 }} txt={imgs?.uri ? imgs?.fileName : "Add Profile Image"} />

            <SubmitButton title="Register" style={{ marginTop: spacing[4], paddingVertical: HP(1) }} />
          </AppForm>
        </View>


        <View style={styles.signUpLinkContainer}>
          <View style={styles.signUpTextContainer}>
            <AppText preset="default">Already have an account?</AppText>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
              <AppText preset="bold" style={styles.link}>Login</AppText>
            </TouchableOpacity>
          </View>
        </View>
        {active &&
          <View style={{ width: '100%', height: "100%", backgroundColor: 'transparent', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', position: 'absolute', }}>
            <ActivityIndicator size={"large"} color="#00ff00" />
          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginTop: 5,
    marginBottom: 50,
    alignItems: "center",
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
