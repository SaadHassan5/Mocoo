import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionDouble, filterCollectionSingle, getData, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import AlertService from '../../Services/alertService';

const ShowGroups = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])

  useEffect(() => {
    db.collection('Groups')?.where('cityId', '==', props?.route?.params?.cityId)
    .onSnapshot(documentSnapshot => {
        getStates();
    });
  }, [])
  async function getStates() {
    const res = await filterCollectionSingle('Groups', 'cityId', '==', props?.route?.params?.cityId)
    console.log('States=======>', res);
    setAllGroups(res)
  }
  async function goToGroup(item) {
    const res = await getData('GroupMembers', item?.id)
    if (res?.members?.find(i => i?.email == props?.user?.emai))
      props?.navigation?.navigate('GroupChat', item)
    else {
      AlertService.confirm('You need to Join Group', 'Subscribe', 'cancel').then(async (r) => {
        if (r) {
          AlertService?.toastPrompt("Subscribed")
          props?.navigation?.navigate('GroupChat', item)
          let temp=res?.members?[...res?.members]:[props?.user?.email]
          await saveData('GroupMembers',item?.id,{
            members:temp,
          })
        }
      })
    }
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'Groups'} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewGroup', props?.route?.params)}} txt={'Add Group'} style={{ width: WP(70), marginTop: HP(4), alignSelf: 'center' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(7) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <TouchableOpacity onPress={() => { goToGroup(item) }} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, ...GlobalStyles.row, marginBottom: HP(3) }}>
              <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.groupName}</Text>
            </TouchableOpacity>
          } />
      </ScrollView>
    </SafeAreaView>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowGroups);