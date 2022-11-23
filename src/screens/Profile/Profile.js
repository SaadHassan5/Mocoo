import React, { useEffect, useState } from 'react';
import { Share, View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import notifee, {
} from '@notifee/react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { db, deleteData, filterCollectionSingle, getData, saveData, uploadFile } from '../../Auth/fire';
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
import { GlobalStyles } from '../../global/globalStyles';
import { FireAuth } from '../../Auth/socialAuth';
import { contactUs, openInsta, VerifyMyAccount } from '../../Auth/manipulateData';

function Profile(props) {
  const [email, setEmail] = useState(props?.user?.email)
  const [editName, setEditName] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  const [nameToBe, setNameToBe] = useState(props?.user?.name)
  const [bio, setBio] = useState(props?.user?.bio ? props?.user?.bio : '')
  const [insta, setInsta] = useState(props?.user?.insta ? props?.user?.insta : '@')
  const [active, setActive] = useState(false)

  useEffect(() => {
    db.collection('Users')?.doc(props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getUser();
        getSubscribedCities();
      });
  }, [])
  async function getSubscribedCities() {
    const res = await filterCollectionSingle('Groups', 'groupId', 'in', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc'])
    console.log('grooooups', res);
    setAllGroups(res)
  }
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
        FireAuth.Logout(props)
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
          name: nameToBe, bio: bio, insta: insta,
        })
        setEditName(false)
      }
    })
  }
  async function onDelete() {
    AlertService?.confirm('Are You sure?').then(async (res) => {
      if (res) {
        await deleteData('Users', props?.user?.email,)
        await deleteData('Login', props?.user?.email,)
        FireAuth.Logout(props)
      }
    })
  }
  async function onVerify() {
    AlertService?.confirm('For Verication Add Image!', 'Browse')?.then(async (res) => {
      await VerifyMyAccount(props)
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
            <TouchableOpacity onPress={() => { setEditName(!editName) }} style={{ alignSelf: 'center' }}>
              <Text style={{ ...styles.emailTxt, color: 'gray', marginTop: -HP(3), textDecorationLine: 'underline' }} preset='h4'>Edit</Text>
            </TouchableOpacity>
            {editName ?
              <View>
                <AppTextInput value={nameToBe} onChange={(e) => { setNameToBe(e) }} />
                <Text style={{ ...styles.emailTxt, color: 'black', }} >Bio</Text>
                <AppTextInput placeholderText={'BIO'} value={bio} onChange={(e) => { setBio(e) }} />
                <Text style={{ ...styles.emailTxt, color: 'black', }} >Instagram</Text>
                <AppTextInput placeholderText={'Insta'} value={insta} onChange={(e) => { setInsta(e) }} />
                <View style={{ marginVertical: HP(1), ...styles.row, justifyContent: 'space-around' }}>
                  <CustomBtn1 txt={'Save'} txtStyle={{ fontSize: 15 }} style={{ width: WP(30), paddingVertical: HP(1), }} onPress={() => { saveName() }} />
                  <CustomBtn1 txt={'Cancel'} txtStyle={{ fontSize: 15 }} style={{ marginLeft: WP(5), width: WP(30), paddingVertical: HP(1), }} onPress={() => { setEditName(!editName) }} />
                </View>
              </View>
              :
              <View>
                <View style={{ alignSelf: 'center' }}>
                  <AppText style={{ ...styles.emailTxt, textAlign: 'center',}} preset='h4'>{props.user?.name}</AppText>
                  {props.user?.verified &&
                    <View style={{ ...GlobalStyles.row,paddingLeft:WP(3),paddingBottom:HP(1) }}>
                      <Image source={IMAGES?.tick} style={{ width: WP(8), height: WP(8), }} />
                  <AppText style={{ ...GlobalStyles.lightTxt,paddingLeft:WP(2) }} preset='h4'>ID Verified</AppText>
                    </View>
                  }
                </View>
                {props?.user?.bio != "" &&
                  <AppText style={{ ...GlobalStyles.lightTxt, textAlign: 'center' }} preset='h4'>Bio: {props?.user?.bio}</AppText>
                }
                {props?.user?.insta &&
                  <TouchableOpacity onPress={async () => { await openInsta(props?.user?.insta) }} style={{ paddingVertical: HP(1) }}>
                    <AppText style={{ ...GlobalStyles.lightTxt, textAlign: 'center', }} preset='h4'>Insta: {props?.user?.insta}</AppText>
                  </TouchableOpacity>
                }
              </View>
            }
            <AppText style={styles.userEmail}>{props.user.email}</AppText>
            {!props?.user?.vericationApplied &&
              <CustomBtn1 onPress={() => { onVerify() }} txt={'Verify My Account'} txtStyle={{ color: palette.status_dot_bg_green }} style={{ paddingVertical: HP(1), backgroundColor: 'transparent' }} />
            }
            <CustomBtn1 onPress={() => { onDelete() }} txt={'Delete My Account'} txtStyle={{ color: palette.letterRed }} style={{ paddingVertical: HP(1), backgroundColor: 'transparent' }} />
            <CustomBtn1 onPress={() => { contactUs('ronakjoshifly@Gmail.com','','') }} txt={'Contact us'} txtStyle={{ color: palette.blue,fontSize:14,textDecorationLine:'underline' }} style={{ paddingVertical: HP(1), backgroundColor: 'transparent' }} />
          </View>

        </View >
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(7) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <TouchableOpacity onPress={() => { console.log('ITEM', item); props?.navigation?.navigate('GroupTab', { groupId: item?.groupId, groupName: item?.groupName, owner: item?.owner }) }} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, ...GlobalStyles.row, marginBottom: HP(3) }}>
              <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10), width: WP(60) }}>{item?.groupName}</Text>
            </TouchableOpacity>
          } />

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