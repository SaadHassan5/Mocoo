import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionDouble, filterCollectionSingle, getData, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import AlertService from '../../Services/alertService';

const GroupMembers = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])

  useEffect(() => {
    console.log('PROPS', props);
    // props?.navigation?.navigate('NewPost', props?.route?.params)
    // db.collection('Groups')?.where('Posts', 'groupId', '==', props?.route?.params?.groupId)
    // .onSnapshot(documentSnapshot => {
    getStates();
    // });
  }, [])
  async function getStates() {
    const res = await getData('GroupMembers', props?.route?.params?.groupId)
    console.log('States=======>', res);
    setAllGroups(res?.membersDetails ? res?.membersDetails : [])
  }

  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'Members'} />
      {/* <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewPost', props?.route?.params) }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center' }} /> */}
      {/* backgroundColor:palette?.white, */}
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <Text style={{ ...GlobalStyles.boldTxt, textAlign: 'center', paddingVertical: HP(1) }}>Total Group Members {allGroups?.length}</Text>
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(4) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <TouchableOpacity onPress={() => { props?.navigation?.navigate('OtherProfile',{email:item?.email})}} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, ...GlobalStyles.row, alignItems: 'flex-start', marginBottom: HP(3) }}>
              <Image source={{ uri: item?.profileUri }} style={{ width: WP(14), height: WP(14), borderRadius: WP(12) }} />
              <View style={{ paddingLeft: WP(5) }}>
                <Text style={{ ...GlobalStyles.boldTxt, width: WP(60) }}>{item?.name}</Text>
                {item?.bio != "" &&
                  <TouchableOpacity>
                    <Text style={{ ...GlobalStyles.lightTxt, width: WP(60),textDecorationLine:'underline' }}>{item?.bio}</Text>
                  </TouchableOpacity>
                }
                {item?.insta != "" &&
                  <Text style={{ ...GlobalStyles.lightTxt, width: WP(60) ,textDecorationLine:'underline'}}>Insta: {item?.insta}</Text>
                }
              </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(GroupMembers);