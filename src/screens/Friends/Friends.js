import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, Image, Linking, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import { db, filterCollectionSingle, getData } from '../../Auth/fire';
import Fontiso from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { onLike, onPost, onPostFriend, unLike } from '../../Auth/manipulateData';
import SuggestedPostsRender from '../../assets/components/FlatRender/SuggestedPosts';
import AlertService from '../../Services/alertService';
import { suggestedPosts } from '../../assets/config/Constants';
const Friends = (props) => {
  const [active, setActive] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [opt, setOpt] = useState('posts')
  useEffect(() => {
    let p = props?.user?.history?.map(i => i?.email);
    db.collection('FriendsPosts').where('email', 'in', p?.length > 0 ? [...p, props?.user?.email] : [props?.user?.email])
      .onSnapshot(documentSnapshot => {
        getPosts();
      });
    db.collection('Users').where('email', '==', props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getUser();
      });
  }, [])
  async function getUser() {
    const res = await getData('Users', props?.user?.email)
    props?.getUser(res)
  }
  async function getPosts() {
    let p = props?.user?.history?.map(i => i?.email);
    const res = await filterCollectionSingle('FriendsPosts', 'email', 'in', [...p, props?.user?.email])
    console.log('Posts', res);
    let tempSort = res?.sort((a, b) => b?.time - a?.time)
    setAllPosts(tempSort)
  }
  async function onSugPost(item) {
    AlertService.confirm('Are you sure?').then(async (res) => {
      if (res) {
        await onPostFriend(props, item?.title, item?.type)
      }
    })
  }
  async function shareFriends() {
    const url = `whatsapp://send?text=https://mocooproject.page.link/profile/${props?.user?.email}`
    await Linking.openURL(url)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container, }}>
      <Header goBack={false} title={'Friends'} leftOptionPress={() => { props?.navigation?.navigate('Profile') }} leftOptionTxt={'Profile'} rightOptionPress={() => { props?.navigation?.navigate('MyChat') }} rightOptionTxt={'Chats'} />
      <CustomBtn1 onPress={() => { shareFriends() }} txt={'Add Friends'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(2), backgroundColor: palette.status_dot_bg_green, paddingVertical: HP(1) }} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewFriendPost') }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(2), backgroundColor: palette.blackGray, paddingVertical: HP(1) }} />
      {/* backgroundColor:palette?.white, */}
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly', marginTop: HP(7) }}>
          <CustomBtn1 onPress={() => { setOpt('posts') }} txt={'Posts'} style={{ width: WP(40), alignSelf: 'center', backgroundColor: opt == 'posts' ? palette.purple : palette.lightGrey, paddingVertical: HP(1) }} />
          <CustomBtn1 onPress={() => { setOpt('friends') }} txt={'Friends'} style={{ width: WP(40), alignSelf: 'center', backgroundColor: opt == 'friends' ? palette.purple : palette.lightGrey, paddingVertical: HP(1) }} />
        </View>
        {opt == 'posts' ?
          <View>
            <Text style={{ ...GlobalStyles.boldTxt, color: palette.blackGray, width: WP(80), alignSelf: 'center', marginTop: HP(2) }}>Recommended 1 click post - Will be auto removed in 3 hours</Text>
            <FlatList
              horizontal
              style={{ flex: 1, marginTop: HP(1) }}
              data={suggestedPosts}
              contentContainerStyle={{}}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) =>
                <SuggestedPostsRender props={props} onSelect={() => { onSugPost(item) }} item={item} />
              } />
            <FlatList
              numColumns={1}
              style={{ flex: 1, marginTop: HP(2) }}
              data={allPosts}
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
                      <Text style={{ ...GlobalStyles.mediumTxt, color: palette.blackGray, width: WP(60) }}>{item?.title}</Text>
                      {item?.type &&
                        <Text style={{ ...GlobalStyles.mediumTxt, width: WP(70), color: palette.primary1 }}>{item?.type} {item?.type == 'On The Go' && `(will be hide after${'\n'}3 hours)`}</Text>
                      }
                    </View>
                  </TouchableOpacity>
                  <View style={{ ...GlobalStyles?.row, justifyContent: 'space-around', paddingHorizontal: WP(10) }}>
                    {item?.likedBy?.find(e => e?.email == props?.user?.email) ?
                      <TouchableOpacity onPress={() => { unLike(item, props, 'FriendsPosts') }} style={{ ...GlobalStyles?.row }}>
                        <AntDesign name='like1' size={25} color={palette?.purple} />
                        <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                      </TouchableOpacity>
                      :
                      <TouchableOpacity onPress={() => { onLike(item, props, 'FriendsPosts') }} style={{ ...GlobalStyles?.row }}>
                        <AntDesign name='like2' size={25} color={palette?.purple} />
                        <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                      </TouchableOpacity>
                    }
                    {/* <TouchableOpacity onPress={() => { props?.navigation?.navigate('PostDetails', item) }} style={{ ...GlobalStyles?.row }}>
                    <Fontiso name='comment' size={30} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.commentCount}</Text>
                  </TouchableOpacity> */}
                  </View>
                </View>
              } />
          </View>
          :
          <FlatList
            numColumns={1}
            style={{ flex: 1, marginTop: HP(2) }}
            data={props?.user?.history}
            contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) =>
              <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginTop: HP(4) }}>
                <View style={{ ...GlobalStyles.row }}>
                  <Image source={{ uri: item?.profileUri }} style={{ width: WP(14), height: WP(14), borderRadius: WP(12) }} />
                  <Text style={{ ...GlobalStyles.mediumTxt, paddingLeft: WP(5) }}>{item?.name}</Text>
                </View>
              </View>
            } />
        }
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
export default connect(mapStateToProps, mapDispatchToProps)(Friends);