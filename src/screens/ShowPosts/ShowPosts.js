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
import Fontiso from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
const ShowPosts = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  useEffect(() => {
    console.log('PROPS', props);
    // props?.navigation?.navigate('NewPost', props?.route?.params)
    db.collection('Posts').where('groupId', 'in', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc'])
      .onSnapshot(documentSnapshot => {
        getStates();
      });
  }, [])
  async function getStates() {
    console.log('ids', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc']);
    const res = await filterCollectionSingle('Posts', 'groupId', 'in', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc'])
    console.log('States=======>', res);
    let temp = res?.sort((a, b) => b?.time - a?.time)
    setAllGroups(temp)
  }
  const onLike = async (item1) => {
    console.log(item1);
    let sub = item1?.likedBy ? [...item1?.likedBy] : [];
    sub.push({ email: props?.user?.email, name: props?.user?.name, profileUri: props?.user?.profileUri })
    console.log('Sub', item1?.id, sub);
    await saveData("Posts", item1?.id, {
      likes: item1?.likedBy ? item1?.likes + 1 : 1,
      likedBy: sub
    })
    // await getPosts();
  }
  const unLike = async (item1) => {
    let sub = [];
    console.log("unlike");
    item1.likedBy.filter((i) => {
      if (i?.email != props?.user?.email)
        sub.push(i)
    })
    await saveData("Posts", item1?.id, {
      likes: item1.likes - 1,
      likedBy: sub
    })
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container, }}>
      <Header goBack={false} title={'Posts'} />
      {/* <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewPost', props?.route?.params) }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(4), backgroundColor: '#fff' }} /> */}
      {/* backgroundColor:palette?.white, */}
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(2) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginTop: HP(4) }}>
              <TouchableOpacity onPress={() => { props?.navigation?.navigate('PostDetails', item) }} style={{ ...GlobalStyles.row, alignItems: 'flex-start', marginBottom: HP(3) }}>
                <TouchableOpacity onPress={() => { item?.email != props?.user?.email ? props?.navigation?.navigate('OtherProfile', { email: item?.email }) : console.log('my'); }}>
                  <Image source={{ uri: item?.userDetails?.profileUri }} style={{ width: WP(14), height: WP(14), borderRadius: WP(12) }} />
                </TouchableOpacity>
                <View style={{ paddingLeft: WP(5) }}>
                  <Text style={{ ...GlobalStyles.boldTxt, width: WP(60) }}>{item?.userDetails?.name}</Text>
                  {/* <Text style={{ ...GlobalStyles.mediumTxt, width: WP(60) }}>{item?.title}</Text> */}
                  <Text style={{ ...GlobalStyles.lightTxt, width: WP(60) }}>{item?.description}</Text>
                  {item?.type &&
                    <Text style={{ ...GlobalStyles.mediumTxt, width: WP(70), color: palette.primary1 }}>{item?.type}</Text>
                  }
                </View>
              </TouchableOpacity>
              <View style={{ ...GlobalStyles?.row, justifyContent: 'space-around', paddingHorizontal: WP(10) }}>
                {item?.likedBy?.find(e => e?.email == props?.user?.email) ?
                  <TouchableOpacity onPress={() => { unLike(item) }} style={{ ...GlobalStyles?.row }}>
                    <AntDesign name='like1' size={25} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => { onLike(item) }} style={{ ...GlobalStyles?.row }}>
                    <AntDesign name='like2' size={25} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => { props?.navigation?.navigate('PostDetails', item) }} style={{ ...GlobalStyles?.row }}>
                  <Fontiso name='comment' size={30} color={palette?.purple} />
                  <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.commentCount}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowPosts);