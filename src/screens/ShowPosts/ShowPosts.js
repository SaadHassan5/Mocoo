import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, getData, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import Header from '../../components/Header';
import { copyToClip, onLike, unLike } from '../../Auth/manipulateData';
import { Menu, MenuItem } from 'react-native-material-menu';
import PostRender from '../../assets/components/FlatRender/postRender';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import { AdminPopUp } from '../../assets/components/Modal/AdminPopUp';
import UpdateModal from '../../assets/components/Modal/UpdateModal';
import AlertService from '../../Services/alertService';
const ShowPosts = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  const [opt, setOpt] = useState('all')
  const [adminPop, setAdminPop] = useState(false)
  const [adminPopObj, setAdminPopObj] = useState({})
  const [updeteMod, setUpdateMod] = useState(false)
  const [allStates, setAllStates] = useState([])
  const [optTab, setOptTab] = useState('Posts')

  useEffect(() => {
    console.log('PROPS', props);
    db.collection('Posts').where('groupId', 'in', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc'])
      .onSnapshot(documentSnapshot => {
        getPosts();
      });
    db.collection('States')?.where('country', '==', props?.user?.country?.toLowerCase())
      .onSnapshot(documentSnapshot => {
        getStates();
      });
    if (props?.updateApp)
      setUpdateMod(true)
    else
      getDataPop();
  }, [])
  async function getDataPop() {
    const res = await getData('AdminData', 'popup');
    if (res?.visible) {
      console.log('RS', res);
      setAdminPopObj(res)
      setAdminPop(true)
    }
  }
  async function getPosts() {
    console.log('ids', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc']);
    const res = await filterCollectionSingle('Posts', 'groupId', 'in', props?.user?.subscribedIds?.length > 0 ? props?.user?.subscribedIds : ['abc'])
    console.log('States=======>', res);
    let temp = res?.sort((a, b) => b?.time - a?.time)
    setAllGroups(temp)
  }
  const hideMenu = (item, index) => {
    let temp = [...allGroups];
    temp[index] = { ...item, select: false }
    setAllGroups(temp)
  }

  const showMenu = (item, index) => {
    let temp = [...allGroups];
    temp[index] = { ...item, select: true }
    setAllGroups(temp)
  }
  async function onShare(item, index) {
    copyToClip('whatsapp://send?text=https://mocooproject.page.link/posts/${item?.id}')
    hideMenu(item, index)
  }
  async function getStates() {
    const res = await filterCollectionSingle('Groups', 'groupId', 'in', props?.user?.subscribedIds)
    console.log('States=======>', res);
    setAllStates(res)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container, }}>
      <Header goBack={false} title={optTab} />
      {/* <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewPost', props?.route?.params) }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(4), backgroundColor: '#fff' }} /> */}
      {/* backgroundColor:palette?.white, */}

      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <View style={{ ...GlobalStyles.row, justifyContent: 'space-evenly',marginTop:HP(3) }}>
          <CustomBtn1 onPress={()=>{setOptTab('Posts')}} txt={'Posts'} style={{ ...GlobalStyles.btnView,backgroundColor:optTab!='Posts'?palette.gray:palette.airbnb }} />
          <CustomBtn1 onPress={()=>{setOptTab('Subscribed')}} txt={'Subscribed'} style={{ ...GlobalStyles.btnView,backgroundColor:optTab!='Subscribed'?palette.gray:palette.airbnb}} />
        </View>
        {optTab == 'Posts' ?
          <View style={{flex:1}}>
            {allGroups?.length < 1 &&
              <Text style={{ ...GlobalStyles.boldTxt, fontSize: 22, textAlign: "center", marginTop: HP(20) }}>Join Group to See Posts</Text>
            }
            {opt != 'all' &&
              <CustomBtn1 onPress={() => { setOpt('all') }} style={{ paddingVertical: HP(1), width: WP(40), marginTop: HP(3), alignSelf: 'center' }} txt={'See All'} />
            }
            <FlatList
              numColumns={1}
              style={{ flex: 1, marginTop: HP(2) }}
              data={allGroups}
              contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) =>
                <View>
                  {opt == 'all' ?
                    <PostRender props={props} index={index} hideMenu={() => { hideMenu(item, index) }}
                      showMenu={() => { showMenu(item, index) }} item={item} onShare={() => { onShare(item, index) }} onType={() => { setOpt(item?.type) }} opt={opt} setOpt={setOpt} />
                    : opt == item?.type &&
                    <PostRender props={props} index={index} hideMenu={() => { hideMenu(item, index) }}
                      showMenu={() => { showMenu(item, index) }} item={item} onShare={() => { onShare(item, index) }} onType={() => { setOpt(item?.type) }} opt={opt} setOpt={setOpt} />}
                </View>
              } />
          </View>
          :
          <View style={{flex:1}}>
            {allStates?.length == 0 &&
              <Text style={{ ...GlobalStyles.boldTxt, marginTop: HP(6), textAlign: 'center' }}>Nothing Found</Text>
            }
            <FlatList
              numColumns={1}
              style={{ flex: 1, marginTop: HP(7) }}
              data={allStates}
              contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
              keyExtractor={item => item.id}
              renderItem={({ item, index }) =>
                <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginBottom: HP(3) }}>
                  <TouchableOpacity onPress={() => { props?.navigation?.navigate('ShowCities', item) }} style={{ ...GlobalStyles.row, }}>
                    <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
                    <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(6),width:WP(60) }}>{item?.groupName}</Text>
                  </TouchableOpacity>
                </View>
              } />
          </View>
        }
      </ScrollView>
      <AdminPopUp obj={adminPopObj} mod={adminPop} onPress={() => { setAdminPop(false) }} />
      <UpdateModal mod={updeteMod} onPress={() => { props?.updateAppClose?AlertService.show('Update First'):setUpdateMod(false) }} onUpate={async () => { await Linking?.openURL('https://play.google.com/store/apps/details?id=com.mocooproject') }} />

    </SafeAreaView>
  )
}

const mapStateToProps = (state) => {
  const { backgroundColor } = state;
  const { user } = state;
  const { updateApp } = state;
  const { updateAppClose } = state;
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