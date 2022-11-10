import React, { useEffect, useState } from 'react';
import { Share, View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, Text } from 'react-native';
import { connect } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import notifee, {
} from '@notifee/react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { db, filterCollectionSingle, getData, saveData, uploadFile } from '../../Auth/fire';
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

function Profile(props) {
  const [email, setEmail] = useState(props?.route?.params?.email)
  const [user, setUser] = useState({})
  const [allGroups, setAllGroups] = useState([])

  useEffect(() => {
    getUser();
    getSubscribedCities();
  }, [])
  async function getSubscribedCities() {
  }
  const getUser = async () => {
    const res = await getData("Users", props?.route?.params?.email)
    setUser(res)
    const res1 = await filterCollectionSingle('Groups', 'groupId', 'in', res?.subscribedIds?.length > 0 ? res?.subscribedIds : ['abc'])
    // console.log('grooooups', res);
    setAllGroups(res1)
    // Alert.alert(JSON.stringify(res))
  }
  return (
    <>
      <Header title="Profile" onPress={() => { props?.navigation?.goBack() }} style={{ backgroundColor: colors.light }} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: HP(20), paddingTop: HP(2) }}
      >
        <View style={styles.userProfileBox}>
          {user?.profileUri == '' ?
            <Image defaultSource={IMAGES.Loading} source={IMAGES?.dp} style={{ width: WP(30), height: WP(30), borderRadius: WP(15) }} />
            :
            <Image defaultSource={IMAGES.Loading} source={{ uri: user?.profileUri }} style={{ width: WP(30), height: WP(30), borderRadius: WP(15) }} />
          }
          <View style={styles.userInfo}>
            <View>

              <AppText style={{ ...styles.emailTxt, textAlign: 'center' }} preset='h4'>{user.name}</AppText>
              {/* <AppText style={{ ...styles.emailTxt, textAlign: 'center', fontFamily: fontFamily.medium }} preset='h4'>{user?.bio}</AppText> */}
              {user?.bio &&
                <AppText style={styles.emailTxt}>{user.bio}</AppText>
              }
              <AppText style={styles.userEmail}>{user.email}</AppText>

            </View>
            <TouchableOpacity onPress={() => { props?.navigation?.navigate('IndividualChat', { email: user?.email, profileUri: user?.profileUri, name: user?.name }) }} style={{ alignSelf: 'center', paddingVertical: HP(1), paddingHorizontal: WP(5) }}>
              <Entypo name='chat' color={palette?.letterRed} size={30} />
            </TouchableOpacity>
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
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.groupName}</Text>
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