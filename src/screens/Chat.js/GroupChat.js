import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Keyboard, Alert } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors, spacing } from '../../theme';
import Header from '../../components/Header';
import { db, deleteData, getAllOfNestedCollection, getData, nestedDeleteData, saveData, saveNestedData } from '../../Auth/fire';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../assets/components/Input/Input';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetLimit, GetUser } from '../../root/action';
import Entypo from 'react-native-vector-icons/Entypo'
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import AlertService from '../../Services/alertService';
import { GlobalStyles } from '../../global/globalStyles';
import { Menu } from 'react-native-paper';
import { onPost } from '../../Auth/manipulateData';
import ParsedText from 'react-native-parsed-text';
import { giveLink } from '../../Services/DynamicLink';
import PostTypeModal from '../../assets/components/Modal/PostTypeModal';
import { IMAGES } from '../../assets/imgs';
const GroupChat = (props) => {
  const [post, setPost] = useState(props?.route?.params)
  const [chat, setChat] = useState([])
  const [members, setMembers] = useState([])
  const [membersDetail, setMembersDetail] = useState([])
  const [chatId, setChatId] = useState(props?.route?.params?.groupId)
  const [newCom, setNewCom] = useState('')
  const [active, setActive] = useState(false)
  const [replyMod, setReplyMod] = useState(false)
  const [replyObj, setReplyObj] = useState({})
  const [isMember, setisMember] = useState(false);
  const [postType, setPostType] = useState('Discussion');
  const [postMod, setPostMod] = useState(false);
  const [pos, setPos] = useState({});
  const scrollRef = useRef();
  useEffect(() => {
    db.collection('GroupChats').doc(chatId)?.collection('messages')
      .onSnapshot(documentSnapshot => {
        getConservation();
      });
    db.collection('GroupMembers').doc(chatId)
      .onSnapshot(documentSnapshot => {
        getMembers();
      });

  }, [])
  async function getUser() {
    const res = await getData('Users', props?.user?.email)
    props?.getUser(res)
  }
  const getMembers = async () => {
    let res = await getData('GroupMembers', chatId)
    setMembers(res?.members ? res?.members : [])
    setMembersDetail(res?.membersDetails ? res?.membersDetails : [])
    console.log(res);
    let f = res?.members?.find(i => i == props?.user?.email)
    setisMember(!f ? true : false)
  }
  const getConservation = async () => {
    const res = await getAllOfNestedCollection("GroupChats", chatId, "messages");
    let temp = res?.sort((b, a) => a?.createdAt - b?.createdAt)
    console.log(res);
    scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    setChat(temp)
  }
  const onSend = async () => {
    if (newCom?.trim() != "") {
      setisMember(false)
      Keyboard?.dismiss()
      const value = await AsyncStorage.getItem("User")

      let rObj = {
        email: value,
        createdAt: new Date().getTime(),
        profileUri: props?.user?.profileUri,
        name: props?.user?.name,
        msg: newCom,
        chatId: chatId,
        verified: props?.user?.verified ? props?.user?.verified : false,
        chatData: { id: chatId, screen: 'GroupChat' },
      }
      if (replyMod) {
        rObj = {
          ...rObj, reply: { replyTxt: replyObj?.msg, replyEmail: replyObj?.email, replyName: replyObj?.name }
        }
        setReplyMod(false); setReplyObj({})
      }
      setNewCom('')
      // console.log("Reply OBJ",r);
      await saveData('GroupChats', chatId, {
        chatId: chatId,
        groupName: props?.route?.params?.groupName,
        owner: props?.route?.params?.owner,
      })
      await saveNestedData("GroupChats", chatId, 'messages', {
        ...rObj
      })
      if (chat?.length == 0) {
        await getConservation();
      }
      scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
      if (isMember)
        await joinGroup()
    }
  }
  async function joinGroup() {
    setisMember(false)
    AlertService?.toastPrompt("Subscribed")
    let tempUser = !props?.user?.subscribedIds?.find(i => i == chatId) ? [...props?.user?.subscribedIds, chatId] : [...props?.user?.subscribedIds]
    await saveData('Users', props?.user?.email, {
      subscribedIds: tempUser,
    })
    let temp = members ? [...members, props?.user?.email] : [props?.user?.email]
    let us = { email: props?.user?.email, name: props?.user?.name, profileUri: props?.user?.profileUri, insta: props?.user?.insta ? props?.user?.insta : '', bio: props?.user?.bio ? props?.user?.bio : '' }
    let tempD = membersDetail ? [...membersDetail, us] : [us]
    await saveData('GroupMembers', chatId, {
      members: temp,
      membersDetails: tempD
    })
    setMembers(temp)
    getUser()
  }
  async function onDelete(item) {
    AlertService?.confirm('Are you sure?').then(async (res) => {
      if (res) {
        await nestedDeleteData('GroupChats', chatId, 'messages', item?.id)
      }
    })
  }
  async function makePost(item) {
    AlertService.confirm('Upload this message as Post?', 'Yes', 'No').then(async (res) => {
      if (res) {
        setPos({}); setPostMod(false)
        await onPost(props, '', item?.msg, chatId, [], postType)
        AlertService.toastPrompt('Posted')
      }
    })
  }
  async function handleUrlPress(url, matchIndex /*: number*/) {
    console.log(url, matchIndex);
    giveLink(props, url)
    // LinkingIOS.openURL(url);
  }
  return (
    <>
      <Header
        style={{ backgroundColor: colors.light }}
        title={post?.groupName}
        onPress={() => { props?.navigation?.goBack() }}
      />
      {isMember &&
        <CustomBtn1 onPress={() => { joinGroup() }} txt={'Join +'} txtStyle={{ fontSize: 14 }} style={{ width: WP(40), paddingVertical: HP(1), alignSelf: "center" }} />
      }
      <View style={{ flex: 1, flexDirection: 'column-reverse', justifyContent: 'center' }}>
        <FlatList
          ref={scrollRef}
          numColumns={1}
          data={chat}
          inverted={true}
          style={{ paddingHorizontal: WP(5) }}
          contentContainerStyle={{ paddingBottom: HP(6) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) =>
            <View style={{ marginTop: HP(2) }}>

              <TouchableOpacity onLongPress={() => { setReplyMod(true); setReplyObj(item) }}
                style={{ ...styles?.card,paddingVertical:0, backgroundColor: item?.email != props?.user?.email ? "rgba(245,128,128,0.7)" : palette?.lighBlueBtnTitle, width: WP(85), alignSelf: item?.email != props?.user?.email ? 'flex-start' : 'flex-end' }}>
                {item?.reply &&
                  <View style={{ paddingVertical: HP(1) }}>
                    <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.light }}>{item?.email != props?.user?.name && item?.name?.split(' ')[0] + " "}Replied to {item?.reply?.replyEmail == props?.user?.email ? 'You' : item?.reply?.replyName?.split(' ')[0]}</Text>
                    {/* <Text style={{ ...styles.emailTxt,}}>{item?.reply?.replyEmail == props?.user?.email ? 'You' : item?.reply?.replyName}</Text> */}
                    <Text style={{ ...styles.emailTxt, }}>{item?.reply?.replyTxt}</Text>
                  </View>
                }
                <View style={{ ...styles.row,paddingVertical:HP(1),paddingTop:HP(2), }}>
                  <TouchableOpacity onPress={() => { item?.email != props?.user?.email ? props?.navigation?.navigate('OtherProfile', { email: item?.email }) : console.log('my'); }}>
                    <Image source={{ uri: item?.profileUri }} style={{ width: WP(12), height: WP(12), borderRadius: WP(10) }} />
                  </TouchableOpacity>
                  <View style={{ paddingHorizontal: WP(2) }}>
                    <View style={{ ...GlobalStyles?.row }}>
                      <Text style={{ ...styles.emailTxt, }}>{item?.name}</Text>
                      {item?.verified &&
                        <Image source={IMAGES?.tick} style={{ width: WP(6), height: WP(6), borderRadius: WP(10), marginLeft: WP(3) }} />
                      }
                    </View>
                    <ParsedText
                      style={{ ...GlobalStyles?.mediumTxt, color: '#fff', width: WP(60) }}
                      parse={
                        [
                          { type: 'url', style: GlobalStyles.urlTxt, onPress: handleUrlPress },
                        ]
                      }
                      childrenProps={{ allowFontScaling: false }}
                    >
                      {item?.msg}
                    </ParsedText>
                    {/* <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.regular, paddingRight: WP(5), fontSize: 17 }}>{item?.msg}</Text> */}
                  </View>
                </View>
                <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.light, fontSize: 13, marginTop: HP(1), alignSelf: 'flex-end' }}>{new Date(item?.createdAt).toTimeString().split(" ")[0]}</Text>
                {props?.user?.email == '921234567890' &&
                  <CustomBtn1 onPress={() => { onDelete(item) }} txt={'Delete'} txtStyle={{ fontSize: 14 }} style={{ backgroundColor: palette?.purple, width: WP(20) }} />
                }
                <View style={{ ...styles.row, position: 'absolute', right: 0, }}>
                  {props?.user?.email != item?.email &&
                    <TouchableOpacity onPress={()=>{AlertService.show('Reported')}} style={{ paddingHorizontal: WP(2) }}>
                      <Text style={{ ...GlobalStyles.mediumTxt, color: '#fff' }}>Report</Text>
                    </TouchableOpacity>
                  }
                  <TouchableOpacity onPress={() => { setPos(item); setPostMod(true) }} style={{ paddingHorizontal: WP(5) }}>
                    <Text style={{ ...GlobalStyles.boldTxt, color: '#fff' }}>...</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </View>
          } />
      </View>
      <View>
        {replyMod &&
          <View style={{ backgroundColor: 'rgba(215,245,245,1)', paddingVertical: HP(1), ...styles.row }}>
            <View style={{ paddingHorizontal: WP(6) }}>
              <Text style={{ ...styles.emailTxt, color: palette.lighBlueBtnTitle, fontSize: 15 }}>{replyObj?.email == props?.user?.email ? 'You' : replyObj?.name}</Text>
              <Text style={{ ...styles.emailTxt, color: palette.lighBlueBtnTitle, fontSize: 12, fontFamily: fontFamily.light }}>{replyObj?.msg}</Text>
            </View>
            <TouchableOpacity onPress={() => { setReplyMod(false); setReplyObj({}) }} style={{ position: 'absolute', right: 0, paddingHorizontal: WP(3) }}>
              <Entypo name='circle-with-cross' size={30} color={palette.lighBlueBtnTitle} />
            </TouchableOpacity>
          </View>
        }
        <View style={{ paddingHorizontal: WP(3), ...styles.row }}>
          <View style={{ width: '100%' }}>
            <Input multi numberOfLines={5} styles={{ paddingRight: WP(18) }} value={newCom} onChange={(e) => { setNewCom(e) }} placeTxt={"Send Text"} />
          </View>
          <TouchableOpacity disabled={active} onPress={() => { onSend() }} style={{ position: 'absolute', right: 0, paddingRight: WP(5) }}>
            <Text style={{ ...styles.emailTxt, color: palette.lighBlueBtnTitle, fontSize: 18 }}>Send</Text>
          </TouchableOpacity>
        </View>
        <PostTypeModal onSave={() => { makePost(pos) }} mod={postMod} onPress={() => { setPostMod(false) }} type={postType} setType={setPostType} />
      </View>
    </>
  )
}

const mapStateToProps = (state) => {
  const { backgroundColor } = state;
  const { user } = state;
  const { limit } = state;
  // alert(backgroundColor);
  // alert(Imgs);
  // console.log(backgroundColor);
  console.log('Redux User=>', user);

  return state;
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeBackgroundColor: (bg) => dispatch(ChangeBackgroundColor(bg)),
    getUser: (userInfo) => dispatch(GetUser(userInfo)),
    getLimit: (lim) => dispatch(GetLimit(lim)),
  }
}
// export default Home
export default connect(mapStateToProps, mapDispatchToProps)(GroupChat);

const styles = StyleSheet.create({

  emailTxt: {
    fontFamily: fontFamily.semi_bold,
    color: palette.white,
    fontSize: 15
  },
  card: {
    backgroundColor: "#fff", paddingHorizontal: spacing[8],
    // paddingVertical: spacing[2],
    borderRadius: spacing[3],
    // marginBottom: spacing[5]
  },
  touchIcon: {
    paddingHorizontal: WP(3)
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
  infoBtn: {
    width: 130,
    marginRight: 10,
    backgroundColor: "#EDEEF3",
  },

})
