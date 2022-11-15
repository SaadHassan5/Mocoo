import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, Keyboard } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { colors, spacing } from '../../theme';
import Header from '../../components/Header';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../assets/components/Input/Input';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, filterOP, getAllOfNestedCollection, saveData, saveNestedData } from '../../Auth/fire';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { makeid } from '../../assets/config/MakeId';

const IndividualChat = (props) => {
  const [post, setPost] = useState(props?.route?.params)
  const [members, setMembers] = useState([])
  const [chat, setChat] = useState([])
  const [chatId, setChatId] = useState(props?.route?.params?.chatId ? props?.route?.params?.chatId + "" : "")
  const [newCom, setNewCom] = useState('')
  const [partner, setPartner] = useState('')
  const [active, setActive] = useState(false)
  const [first, setFirst] = useState(false)
  const scrollRef = useRef();
  useEffect(() => {

    setTimeout(() => {
      console.log("OPEN CHAT==>", props.route);
    }, 3000)
    db.collection('IndividualChat').where("members", "array-contains", props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getConservation();
      });
    // getConservation();
  }, [])
  const getConservation = async () => {
    const value = await AsyncStorage.getItem("User")
    const res = await filterCollectionSingle("IndividualChat", "members", "array-contains", value + "", "members", "array-contains", props?.route?.params?.email);
    console.log('main', res);
    let kk = res?.find((k) => {
      return k?.members?.find(j => j == props?.route?.params?.email)
    })
    const ch = await getAllOfNestedCollection("IndividualChat", kk?.chatId ? kk?.chatId : 'abc', "messages")
    console.log('sub msgs', ch);
    let chatSort = ch?.sort((a, b) => b?.createdAt - a?.createdAt)
    setChat(chatSort)
    setChatId(kk?.chatId ? kk?.chatId : '')
    scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })

  }
  const onSend = async () => {
    if (newCom?.trim() != "") {
      setActive(true)
      Keyboard?.dismiss()
      const value = await AsyncStorage.getItem("User")
      if (!chat?.length > 0) {
        await saveData("IndividualChat", props?.route?.params?.email + '-' + value, {
          members: [props?.route?.params?.email, value],
          membersName: [props?.route?.params?.name, props?.user?.name],
          name: props?.route?.params?.name,
          profileImgs: [props?.route?.params?.profileUri, props?.user?.profileUri],
          chatId: props?.route?.params?.email + '-' + value,
          lastMsg: new Date().getTime(),
          lastMsgTxt: newCom,
        });
        await saveNestedData("IndividualChat", props?.route?.params?.email + '-' + value, "messages", {
          email: value,
          createdAt: new Date().getTime(),
          profileUri: props?.user?.profileUri,
          name: props?.user?.name,
          msg: newCom,
          reciever: props?.route?.params?.email,
          chatData: { id: props?.route?.params?.email + '-' + value, screen: 'IndividualChat', reciever: props?.route?.params?.email }
        })
      }
      else {
        await saveNestedData("IndividualChat", chatId, "messages", {
          email: value,
          createdAt: new Date().getTime(),
          profileUri: props?.user?.profileUri,
          name: props?.user?.name,
          msg: newCom,
          reciever: props?.route?.params?.email,
          chatData: { id: chatId, screen: 'IndividualChat', reciever: props?.route?.params?.email },
        })
        await saveData("IndividualChat", chatId, {
          lastMsg: new Date().getTime(),
          lastMsgTxt: newCom,
        });
      }
      setNewCom('')
      scrollRef?.current?.scrollToOffset({ animated: true, offset: 0 })
      setActive(false)
    }
  }
  return (
    <>
      <Header
        style={{ backgroundColor: colors.light }}
        img={post?.profileUri}
        onPressImg={()=>{props?.navigation?.navigate('OtherProfile',{email:post?.email})}}
        imgStyle={{ width: WP(13), height: WP(13), borderRadius: WP(10), marginRight: WP(5) }}
        titleView={{ ...styles.row, justifyContent: 'center' }}
        title={post?.name}
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
                  <TouchableOpacity onPress={() => { item?.email!=props?.user?.email?props?.navigation?.navigate('OtherProfile',{email:item?.email}) :console.log('my');}}>
                    <Image source={{ uri: item?.profileUri }} style={{ width: WP(12), height: WP(12), borderRadius: WP(10) }} />
                  </TouchableOpacity>
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
          <Input multi style={{ paddingRight: WP(18), borderRadius: 0 }} value={newCom} onChange={(e) => { setNewCom(e) }} placeTxt={"Send Text"} />
        </View>
        <TouchableOpacity disabled={active} onPress={() => { onSend() }} style={{ position: 'absolute', right: 0, paddingRight: WP(5) }}>
          {/* <Text style={{ ...styles.emailTxt, color: palette.lighBlueBtnTitle, fontSize: 18 }}>Send</Text> */}
          <Ionicons name={'send'} size={30} color={palette?.lighBlueBtnTitle} />
        </TouchableOpacity>
      </View>
    </>
  )
}

const mapStateToProps = (state) => {
  const { backgroundColor } = state;
  const { user } = state;
  console.log('Redux User=>', user);

  return state;
};
const mapDispatchToProps = (dispatch) => {
  return {
    changeBackgroundColor: (bg) => dispatch(ChangeBackgroundColor(bg)),
    getUser: (userInfo) => dispatch(GetUser(userInfo)),
  }
}
// export default Home
export default connect(mapStateToProps, mapDispatchToProps)(IndividualChat);

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
