import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { useState } from 'react';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import Header from '../../components/Header';
import { copyToClip, onLike, unLike } from '../../Auth/manipulateData';
import { Menu, MenuItem } from 'react-native-material-menu';
import PostRender from '../../assets/components/FlatRender/postRender';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
const ShowPosts = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  const [opt, setOpt] = useState('all')
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
  return (
    <SafeAreaView style={{ ...GlobalStyles.container, }}>
      <Header goBack={false} title={'Posts'} />
      {/* <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewPost', props?.route?.params) }} txt={'Add Post'} style={{ width: WP(70), alignSelf: 'center', marginTop: HP(4), backgroundColor: '#fff' }} /> */}
      {/* backgroundColor:palette?.white, */}
      {allGroups?.length < 1 &&
        <Text style={{ ...GlobalStyles.boldTxt, fontSize: 22, textAlign: "center", marginTop: HP(20) }}>Join Group to See Posts</Text>
      }
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
      {opt!='all' &&
                <CustomBtn1 onPress={() => {setOpt('all') }} style={{paddingVertical:HP(1),width:WP(40),marginTop:HP(3),alignSelf:'center'}} txt={'See All'}/>
            }
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(2) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <View>
              {opt=='all'?
                <PostRender props={props} index={index} hideMenu={() => { hideMenu(item, index) }}
                  showMenu={() => { showMenu(item, index) }} item={item} onShare={() => { onShare(item, index) }} onType={()=>{setOpt(item?.type)}} opt={opt} setOpt={setOpt} />
              :opt==item?.type &&
              <PostRender props={props} index={index} hideMenu={() => { hideMenu(item, index) }}
              showMenu={() => { showMenu(item, index) }} item={item} onShare={() => { onShare(item, index) }} onType={()=>{setOpt(item?.type)}} opt={opt} setOpt={setOpt}/>  }
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