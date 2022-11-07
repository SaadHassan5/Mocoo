import React, { useEffect, useState } from 'react';
import { Share, View, StyleSheet, Image, TouchableOpacity, ScrollView,ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import notifee, {
} from '@notifee/react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { db, getData, saveData, uploadFile } from '../../Auth/fire';
import { IMAGES } from '../../assets/imgs';
import { colors, spacing } from '../../theme';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import Header from '../../components/Header';
import AppText from '../../components/AppText';
import AlertService from '../../Services/alertService';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import AppTextInput from '../../components/AppTextInput';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Entypo from 'react-native-vector-icons/Entypo';

function Profile(props) {
  const [email, setEmail] = useState(props?.user?.email)
  const [editName, setEditName] = useState(false)
  const [nameToBe, setNameToBe] = useState(props?.user?.name)
  const [active, setActive] = useState(false)

  useEffect(() => {
    db.collection('Users')?.doc(props?.user?.email)
            .onSnapshot(documentSnapshot => {
                getUser();
            });
      getUser();
  }, [])
  const getUser = async () => {
    const val = await AsyncStorage.getItem("User")
    const res = await getData("Users", val)
    console.log("USSS", res);
    props?.getUser(res)
    // Alert.alert(JSON.stringify(res))
  }
  async function onEditProfie() {
    let imgPro = await onBrowse();
    console.log("PRO==", imgPro);
    if (imgPro?.uri) {
      AlertService?.confirm("Press ok to change Profile Picture!").then(async (res) => {
        if (res) {
          setActive(true)
          const value = await AsyncStorage.getItem("User")
          const resImg = await uploadFile(imgPro.uri, imgPro?.fileName, value)
          await saveData("Users", value, {
            profileUri: resImg
          })
          await getUser();
          setActive(false)
        }
      })
    }
  }
  async function onBrowse() {
    let data = {}
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
        // let _img = response?.assets[0]?.uri;
        console.log("image---->", response?.assets[0]);
        // return response?.assets[0]
        // setImgs(response?.assets)
        data = response?.assets[0];
        // toastPrompt("Image Uploaded")
      }
    })
    return data;
  }

  const handleSignOut = async () => {
    AlertService.confirm("Are you sure you want to Logout?").then(async (res) => {
      if (res) {
        await AsyncStorage.removeItem("User")
        await AsyncStorage.removeItem("Admin")
        await notifee.cancelAllNotifications();
        const goo = await AsyncStorage.getItem("google");
        if (goo != null) {
          Google?.onGoogleLogout()
          await AsyncStorage.removeItem("google");
        }
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: 'Splash' },
            ]
          })
        );
      }
    })
  }
  async function saveName() {
    if (nameToBe?.trim() == '')
      return;
    AlertService?.confirm('Are You Sure').then(async (res) => {
      if (res) {
        setEditName(false)
        await saveData('Users', props?.user?.email, {
          name: nameToBe,
        })
        setEditName(false)
      }
    })
  }
  return (
    <>
      <Header title="Profile" goBack={false} style={{ backgroundColor: colors.light }} rightOptionTxt={'Logout'} rightOptionPress={() => { handleSignOut() }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HP(20), paddingTop: HP(2) }}
      >
        <View style={styles.userProfileBox}>
          {props.user?.profileUri == '' ?
            <Image defaultSource={IMAGES.Loading} source={IMAGES?.dp} style={{ width: WP(30), height: WP(30), borderRadius: WP(15) }} />
            :
            <Image defaultSource={IMAGES.Loading} source={{ uri: props.user?.profileUri }} style={{ width: WP(30), height: WP(30), borderRadius: WP(15) }} />
          }
          <TouchableOpacity
            onPress={() => { onEditProfie() }}
          >
            {active ?
              <ActivityIndicator size={"large"} color="#00ff00" />
              :
              <Image style={styles.editImg} source={require('../..//assets/images/user/edit.png')} />
            }
          </TouchableOpacity>
          <View style={styles.userInfo}>
            {editName ?
              <View>
                <AppTextInput value={nameToBe} onChange={(e) => { setNameToBe(e) }} />
                <View style={{ marginVertical: HP(1), ...styles.row, justifyContent: 'space-around' }}>
                  <CustomBtn1 txt={'Save'} txtStyle={{ fontSize: 15 }} style={{ width: WP(30), paddingVertical: HP(1), }} onPress={() => { saveName() }} />
                  <CustomBtn1 txt={'Cancel'} txtStyle={{ fontSize: 15 }} style={{ marginLeft: WP(5), width: WP(30), paddingVertical: HP(1), }} onPress={() => { setEditName(!editName) }} />
                </View>
              </View>
              :
              <TouchableOpacity onPress={() => { setEditName(!editName) }} style={{ marginTop: HP(1), ...styles.row, alignSelf: 'center' }}>
                <AppText style={{ ...styles.emailTxt, textAlign: 'center' }} preset='h4'>{props.user.name}</AppText>
                <Entypo name='pencil' size={20} color={palette?.lighBlueBtnTitle} style={{ paddingLeft: WP(2) }} />
              </TouchableOpacity>
            }
            <AppText style={styles.userEmail}>{props.user.email}</AppText>
          </View>
        </View>

      </ScrollView>
    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
const styles = StyleSheet.create({
  img: {
    width: WP(25),
    height: WP(25),
  }, row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: spacing[3],
    marginBottom: spacing[8]
  },
  emailTxt: {
    fontFamily: fontFamily.semi_bold,
    color: palette.black,
    fontSize: 14,
    letterSpacing: 1
  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5, elevation: 5,
  },
  image: {
    width: '100%',
    borderRadius: 10,
  },
  optView: {
    backgroundColor: colors.lightGray,
    paddingVertical: HP(1),
    paddingHorizontal: WP(5)
  },
  optTxt: {
    color: "#fff",
    fontFamily: fontFamily.bold,
    fontSize: 13
  },
  container: {
    backgroundColor: colors.light,
    paddingHorizontal: 20,
  },
  userProfileBox: {
    backgroundColor: colors.white,
    paddingHorizontal: WP(5),
    paddingVertical: HP(2),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  updateText: {
    color: colors.gray4,
    fontWeight: '500'
  },
  updateDate: {
    color: colors.black,
    fontWeight: '700'
  },
  editImg: {
    position: 'relative',
    top: -20,
    left: 30
  },
  userName: {
    alignSelf: 'center',
    color: colors.black
  },
  userEmail: {
    alignSelf: 'center'
  },
  listItems: {
    paddingVertical: 35,
  }
})