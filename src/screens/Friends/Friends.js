import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, Image, Linking, TouchableOpacity, Alert, Share } from 'react-native';
import { useState } from 'react';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import { db, filterCollectionSingle, getData } from '../../Auth/fire';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { muteFriend, onChangeStatus, onLike, onPost, onPostFriend, unLike } from '../../Auth/manipulateData';
import SuggestedPostsRender from '../../assets/components/FlatRender/SuggestedPosts';
import AlertService from '../../Services/alertService';
import { suggestedPosts } from '../../assets/config/Constants';
const Friends = (props) => {
  const [active, setActive] = useState(false)
  const [allPosts, setAllPosts] = useState([])
  const [opt, setOpt] = useState('friends')
  const [history, setHistory] = useState([])
  const [status, setStatus] = useState(props?.user?.userStatus ? props?.user?.userStatus : '')
  useEffect(() => {
    db.collection('Users').where('email', '==', props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getUser();
      });
      getFriends();
    let p = props?.user?.history?.map(i => i?.email);
    db.collection('FriendsPosts').where('email', 'in', p?.length > 0 ? [...p, props?.user?.email] : [props?.user?.email])
      .onSnapshot(documentSnapshot => {
        getPosts();
      });
  }, [])
  async function getUser() {
    const res = await getData('Users', props?.user?.email)
    props?.getUser(res)
  }
  async function getFriends() {
    const his = await getData('Users', props?.user?.email)

    let p = his?.history?.map(i => i?.email);
    const res = await filterCollectionSingle('Users', 'email', 'in', p);
    let temp = [];
    res?.map((i) => {
      if (his?.history?.find(k => k?.email == i?.email && k?.mute)) {
        temp?.push({ ...i, mute: true })
      }
      else {
        temp?.push(i)
      }
    })
    setHistory(temp);
    console.log('HISTORY', temp);
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
    try {
      const result = await Share.share({
        message:
          `${props?.user?.name} invited you to join https://mocooproject.page.link/profile/${props?.user?.email}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      // alert(error.message);
    }
  }
  async function onChangeUserStatus(stat, emj) {
    AlertService.confirm('Are You Sure?').then(async (res) => {
      if (res) {
        setStatus(stat)
        await onChangeStatus(props, stat, emj)
      }
    })
  }
  async function muteFriendHere(item, value,index) {
    let temp=[...history]
    temp[index]={...item,mute:value}
    setHistory(temp)
    if(value){
      AlertService.show('You will not recieve this user Status Notification')
    }
  await  muteFriend(props, item, value)
  }

  return (
    <SafeAreaView style={{ ...GlobalStyles.container, }}>
      <Header goBack={false} title={'Friends'} leftOptionPress={() => { props?.navigation?.navigate('Profile') }} leftOptionTxt={'Profile'} rightOptionPress={() => { props?.navigation?.navigate('MyChat') }} rightOptionTxt={'Chats'} />
      <CustomBtn1 onPress={() => { shareFriends() }} txt={'Add Friends'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(2), backgroundColor: palette.status_dot_bg_green, paddingVertical: HP(1) }} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewFriendPost') }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(2), backgroundColor: palette.blackGray, paddingVertical: HP(1) }} />
      {/* backgroundColor:palette?.white, */}
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <Text style={{ ...GlobalStyles.boldTxt, fontSize: 22, textAlign: "center", paddingTop: HP(2) }}>Your Status </Text>
        <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly', paddingVertical: HP(2) }}>
          <TouchableOpacity onPress={() => { onChangeUserStatus('Food', '🍕') }} style={{ alignItems: 'center' }}>
            <Text style={{ ...GlobalStyles.boldTxt, fontSize: status == 'Food' ? 50 : 22 }}>🍕</Text>
            <Text style={{ ...GlobalStyles.mediumTxt, }}>Food</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onChangeUserStatus('Walk', '🚶🏻') }} style={{ alignItems: 'center' }}>
            <Text style={{ ...GlobalStyles.boldTxt, fontSize: status == 'Walk' ? 50 : 22 }}>🚶🏻</Text>
            <Text style={{ ...GlobalStyles.mediumTxt, }}>Walk</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onChangeUserStatus('Going Out', '⛳') }} style={{ alignItems: 'center' }}>
            <Text style={{ ...GlobalStyles.boldTxt, fontSize: status == 'Going Out' ? 50 : 22 }}>⛳</Text>
            <Text style={{ ...GlobalStyles.mediumTxt, }}>Going Out</Text>
          </TouchableOpacity>
        </View>
        <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly', paddingVertical: HP(2) }}>
          <TouchableOpacity onPress={() => { onChangeUserStatus('Drinks', '🍻') }} style={{ alignItems: 'center' }}>
            <Text style={{ ...GlobalStyles.boldTxt, fontSize: status == 'Drinks' ? 50 : 22 }}>🍻</Text>
            <Text style={{ ...GlobalStyles.mediumTxt, }}>Drinks</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { onChangeUserStatus('Movie', '🍿') }} style={{ alignItems: 'center' }}>
            <Text style={{ ...GlobalStyles.boldTxt, fontSize: status == 'Movie' ? 50 : 22 }}>🍿</Text>
            <Text style={{ ...GlobalStyles.mediumTxt, }}>Movie</Text>
          </TouchableOpacity>
        </View>
        {/* <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly', }}>
          <TouchableOpacity style={{ ...GlobalStyles.row, }}>
            <MaterialIcons name={'restaurant'} size={30} color={palette?.airbnb}/>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...GlobalStyles.row, }}>
            <MaterialCommunityIcons name={'walk'} size={30} color={palette?.airbnb}/>
          </TouchableOpacity>
        </View> */}
        <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly', marginTop: HP(2) }}>
          <CustomBtn1 onPress={() => { setOpt('friends') }} txt={'Friends'} style={{ width: WP(40), alignSelf: 'center', backgroundColor: opt == 'friends' ? palette.purple : palette.lightGrey, paddingVertical: HP(1) }} />
          <CustomBtn1 onPress={() => { setOpt('posts') }} txt={'Posts'} style={{ width: WP(40), alignSelf: 'center', backgroundColor: opt == 'posts' ? palette.purple : palette.lightGrey, paddingVertical: HP(1) }} />
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
                        <Text style={{ ...GlobalStyles.mediumTxt, width: WP(70), color: palette.primary1 }}>{item?.type} {item?.type == 'On The Go' && `- Happening Now.`}</Text>
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
          <View>
            {props?.user?.statusEmoji &&
                    <Text style={{ ...GlobalStyles.boldTxt, fontSize: 18, textAlign:'center',}}>Your current status is <Text style={{fontSize:29}}>{props?.user?.statusEmoji}</Text></Text>
            }
          <FlatList
            numColumns={1}
            style={{ flex: 1, marginTop: HP(2) }}
            data={history}
            contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
            keyExtractor={item => item.id}
            renderItem={({ item, index }) =>
              <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginTop: HP(4) }}>
                <TouchableOpacity disabled={item?.email==props?.user?.email?true:false} onPress={() => { props?.navigation?.navigate('IndividualChat', { email: item?.email, profileUri: item?.profileUri, name: item?.name }) }} style={{ ...GlobalStyles.row }}>
                  <Image source={{ uri: item?.profileUri }} style={{ width: WP(14), height: WP(14), borderRadius: WP(12) }} />
                  <Text style={{ ...GlobalStyles.mediumTxt, paddingLeft: WP(5) }}>{item?.name}</Text>
                  {item?.statusActive &&
                    <Text style={{ ...GlobalStyles.boldTxt, fontSize: 22, paddingLeft: WP(5) }}>{item?.statusEmoji}</Text>
                  }
                </TouchableOpacity>
                {item?.mute ?
                  <TouchableOpacity onPress={() => { muteFriendHere(item, false,index) }} style={{ position: "absolute", right: 0, paddingHorizontal: WP(5), paddingVertical: HP(1) }}>
                    <Entypo name={'sound-mute'} size={20} color={palette.blackGray} />
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => { muteFriendHere(item, true,index) }} style={{ position: "absolute", right: 0, paddingHorizontal: WP(5), paddingVertical: HP(1) }}>
                    <MaterialCommunityIcons name={'volume-high'} size={20} color={palette.airbnb} />
                  </TouchableOpacity>
                }
              </View>
            } />
            </View>
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