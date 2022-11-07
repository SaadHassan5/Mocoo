import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors, spacing } from '../../theme';
import Header from '../../components/Header';
import { db, getAllOfNestedCollection, saveData, saveNestedData } from '../../Auth/fire';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../assets/components/Input/Input';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetLimit, GetUser } from '../../root/action';

const GroupChat = (props) => {
  const [post, setPost] = useState(props?.route?.params)
  const [members, setMembers] = useState([])
  const [chat, setChat] = useState([])
  const [chatId, setChatId] = useState(props?.route?.params?.groupId+"-"+props?.route?.params?.cityId)
  const [newCom, setNewCom] = useState('')
  const [partner, setPartner] = useState('')
  const [active, setActive] = useState(false)
  const [first, setFirst] = useState(false)
  const scrollRef = useRef();
  useEffect(() => {

    setTimeout(() => {
      console.log("OPEN CHAT==>", props.route,chatId);
    }, 3000)
    db.collection('GroupChats').doc(chatId)?.collection('messages')
      .onSnapshot(documentSnapshot => {
        getConservation();
      });
  }, [])
  const getConservation = async () => {
    const res = await getAllOfNestedCollection("GroupChats", chatId, "messages");
    let temp=res?.sort((b,a)=> a?.createdAt-b?.createdAt)
    console.log(res);
    scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
    setChat(temp)
  }
  const onSend = async () => {
    if (newCom?.trim() != "") {
      setActive(true)
      Keyboard?.dismiss()
      const value = await AsyncStorage.getItem("User")
      await saveData('GroupChats',chatId,{
        chatId:chatId,
        groupName:props?.route?.params?.groupName,
        owner:props?.route?.params?.owner,
      })
        await saveNestedData("GroupChats", chatId,'messages', {
          email: value,
          createdAt: new Date().getTime(),
          profileUri: props?.user?.profileUri,
          name: props?.user?.name,
          msg: newCom,
          chatId:chatId,
          chatData:{id:chatId,screen:'GroupChat'},
        })
        setNewCom('')
        if(chat?.length==0){
          await getConservation();
        }
      scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
      setActive(false)
    }
  }
  return (
    <>
      <Header
        style={{ backgroundColor: colors.light }}
        title={post?.groupName}
        onPress={() => { props?.navigation?.goBack() }}
      />
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
            <View>
              <View style={{ marginTop: HP(2), ...styles?.card, backgroundColor: item?.reciever == props?.user?.email ? "rgba(128,128,128,0.7)" : palette?.lighBlueBtnTitle, width: WP(85), alignSelf: item?.reciever == props?.user?.email ? 'flex-start' : 'flex-end' }}>
                <View style={{ ...styles.row, }}>
                  <Image source={{ uri: item?.profileUri }} style={{ width: WP(12), height: WP(12), borderRadius: WP(10) }} />
                  <View style={{ paddingHorizontal: WP(2) }}>
                    <Text style={{ ...styles.emailTxt, }}>{item?.name}</Text>
                    <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.regular, paddingRight: WP(5), fontSize: 17 }}>{item?.msg}</Text>
                  </View>
                </View>
                <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.light, fontSize: 13, marginTop: HP(1), alignSelf: 'flex-end' }}>{new Date(item?.createdAt).toTimeString().split(" ")[0]}</Text>
              </View>
            </View>
          } />
      </View>
      <View style={{ paddingHorizontal: WP(3), ...styles.row }}>
        <View style={{ width: '100%' }}>
          <Input multi style={{ paddingRight: WP(18) }} value={newCom} onChange={(e) => { setNewCom(e) }} placeTxt={"Send Text"} />
        </View>
          <TouchableOpacity disabled={active} onPress={() => { onSend() }} style={{ position: 'absolute', right: 0, paddingRight: WP(5) }}>
            <Text style={{ ...styles.emailTxt, color: palette.lighBlueBtnTitle, fontSize: 18 }}>Send</Text>
          </TouchableOpacity>
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
    paddingVertical: spacing[5],
    borderRadius: spacing[3],
    marginBottom: spacing[8]
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
