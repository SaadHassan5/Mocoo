import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import IconMatCom from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { colors, spacing } from '../../theme';
import Header from '../../components/Header';
import { db, filterCollectionSingle, getData,  saveData } from '../../Auth/fire';
import AppText from '../../components/AppText';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Input } from '../../assets/components/Input/Input';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import AlertService from '../../Services/alertService';
import { GlobalStyles } from '../../global/globalStyles';
import { makeid } from '../../assets/config/MakeId';
import Fontiso from 'react-native-vector-icons/EvilIcons'
const PostDetails = (props) => {
  const [img, setImg] = useState([])
  const [comment, setComments] = useState([])
  const [AllComments, setAllComments] = useState([])
  const [predictions, setPredictions] = useState([])
  const [newCom, setNewCom] = useState('')
  const [active, setActive] = useState(false)
  const [post, setPost] = useState(props?.route?.params)

  useEffect(() => {
    console.log('Props', post);
    db.collection('Comments').where('postId', '==', post?.postId)
      .onSnapshot(documentSnapshot => {
        getComments()
      });
    db.collection('Posts').where('postId', '==', post?.postId)
      .onSnapshot(documentSnapshot => {
        getItem()
      });
    db.collection('Users').doc(props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getUser()
      });
  }, [])
  const getUser = async () => {
    const val = await AsyncStorage.getItem("User")
    const res = await getData("Users", val)
    props.getUser(res)
  }
  const getItem = async () => {
    const res = await getData("Posts", post?.postId)
    console.log(res);
    setPost(res)
  }
  const getComments = async () => {
    const res = await filterCollectionSingle("Comments", "postId",'==',post?.postId,)
    console.log("Cooooo COm", res);
    let tempSort = res?.sort((a, b) => b?.time - a?.time)
    let sp8 = [], sp = []; let spPre = [];
    tempSort?.map((k, index) => {
      if (index < 8)
        sp8?.push(k)
      else
        sp?.push(k)
    })
    setComments(sp8)
    setAllComments(tempSort);
  }
  const onSend = async () => {
    if (newCom.trim() != "") {
      AlertService.show('Thanks for the Comment.')
      const value = await AsyncStorage.getItem("User")
      let iid = props?.user?.name?.split(' ')[0]?.trim() + makeid(20);
      let obj = {
        text: newCom,
        email: value,
        time: new Date().getTime(),
        likes: 0,
        pinned: false,
        likedBy: [],
        approve: true,
        reject: false,
        postId: post?.postId,
        groupId: post?.groupId,
        profileUri: props.user.profileUri,
        name: props?.user?.name,
        commentId:iid,
      }
      setNewCom("")
      console.log('OBJ',obj);
      // let tCom = [obj, ...comment]
      // setComments(tCom)

      await saveData("Comments", iid, {
        ...obj,
      })

      await saveData("Posts", post?.postId, {
        commentCount: post?.commentCount ? parseInt(post?.commentCount) + 1 : 1,
      })
      setImg([])
      // await getComments();
    }
  }
  async function showMore() {
    console.log(AllComments?.length - comment?.length);
    if (AllComments?.length - comment?.length < 4) {
      let temp = [...comment]
      for (let index = comment?.length; index < AllComments.length; index++) {
        temp?.push(AllComments[index])
      }
      setComments(temp)
    }
    else {
      let temp = [...comment]
      for (let index = comment?.length; index < comment.length + 4; index++) {
        temp?.push(AllComments[index])
      }
      setComments(temp)
    }
  }
  const onLike = async () => {
    console.log(post);
    let sub = post?.likedBy ? [...post?.likedBy] : [];
    sub.push({ email: props?.user?.email, name: props?.user?.name, profileUri: props?.user?.profileUri })
    console.log('Sub', post?.id,sub);
    await saveData("Posts", post?.postId, {
      likes: post?.likedBy ? post?.likes + 1 : 1,
      likedBy: sub
    })
    // await getPosts();
  }
  const unLike = async () => {
    let sub = [];
    post.likedBy.filter((i) => {
      if (i?.email != props?.user?.email)
      sub.push(i)
    })
    console.log("unlike",sub);
    await saveData("Posts", post?.postId, {
      likes: post.likes - 1,
      likedBy: sub
    })
  }
  const RenderItem = ({ item, index, prediction = false }) => {
    return (
      <View style={{ paddingHorizontal: WP(5), marginTop: HP(2), paddingTop: HP(1), backgroundColor: item?.claimmed ? "rgba(147, 250, 165,1)" : '#fff', borderRadius: WP(3) }}>
        <View style={{ flexDirection: "row" }}>
          <TouchableOpacity onPress={() => { props?.navigation?.navigate('OtherProfile', { email: item?.email }) }}>
            {item?.profileUri != "" ?
              <Image source={{ uri: item?.profileUri }} style={{ width: WP(13), height: WP(13), borderRadius: WP(10) }} />
              :
              <Image source={IMAGES.dp} style={{ width: WP(13), height: WP(13), borderRadius: WP(10) }} />
            }
          </TouchableOpacity>
          <View style={{ paddingLeft: WP(5), width: WP(70) }}>
            <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.regular }}>{item?.name}</Text>
            <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.regular }}>{item?.text}</Text>
            {/* {item?.img &&
              <Image source={{ uri: item?.img }} resizeMode={'stretch'} style={{ width: WP(60), height: WP(40), borderRadius: WP(2), alignSelf: 'center', marginTop: HP(2) }} />
            } */}
          </View>
        </View>
      </View >
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        style={{}}
        title={post?.description?.substring(0,10)}
        onPress={() => props.navigation.goBack()}
      />
      <ScrollView
        style={{ flex: 1, }}
        contentContainerStyle={{ paddingVertical: 30, }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: WP(7), flex: 1 }}>
          <View style={{ backgroundColor: "#fff", marginTop: HP(3), paddingBottom: HP(2) }}>
            {/* < */}
            <Text style={{...GlobalStyles.mediumTxt}}>{post?.description}</Text>
            <View style={{ ...GlobalStyles?.row, justifyContent:'space-around',paddingHorizontal:WP(10) ,paddingVertical:HP(2)}}>
                {post?.likedBy?.find(e => e?.email == props?.user?.email) ?
                  <TouchableOpacity onPress={() => { unLike() }} style={{ ...GlobalStyles?.row }}>
                    <AntDesign name='like1' size={25} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{post?.likes ? post?.likes : 0}</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => { onLike() }} style={{ ...GlobalStyles?.row }}>
                    <AntDesign name='like2' size={25} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{post?.likes ? post?.likes : 0}</Text>
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => {  }} style={{ ...GlobalStyles?.row }}>
                    <Fontiso name='comment' size={30} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{post?.commentCount}</Text>
                  </TouchableOpacity>
              </View>
            <View>
              <FlatList
                numColumns={1}
                data={comment}
                style={{}}
                contentContainerStyle={{ paddingBottom: HP(6), paddingHorizontal: WP(3) }}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) =>
                  <RenderItem item={item} index={index} />
                } />
              {comment?.length != AllComments?.length &&
                <TouchableOpacity onPress={() => { showMore() }} style={{ alignSelf: "center" }}>
                  <CustomBtn1 disable={true} txt={'Show More'} style={{ paddingLeft: WP(1), backgroundColor: "transparent", width: WP(50) }} txtStyle={{ color: "black" }} />
                  <IconMatCom style={{ position: "absolute", }} name='reload' size={25} color={'red'} />
                </TouchableOpacity>
              }
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={{ backgroundColor: 'rgba(18,180,220,.2)', paddingTop: HP(1) }}>
        <View style={{ paddingHorizontal: WP(3), ...styles.row }}>
          <View style={{ width: '100%' }}>
            <Input styles={{ paddingRight: WP(25), borderRadius: 4, }} numLines={4} value={newCom} multi onChange={(e) => { setNewCom(e) }} placeTxt={"Add Comment"} />
          </View>
          <TouchableOpacity onPress={()=>{onSend()}} style={{position:'absolute',paddingHorizontal:WP(5),right:0}}>
            <Text style={{...GlobalStyles.mediumTxt}}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <ReportModal onReport={() => { onSendReport() }} mod={reportMod} onPress={() => { setReportMod(false) }} selected={selectedReport} setSelected={setSelectedReport} /> */}
      {/* <ReplyModal props={props} mod={replyMod} replyObj={replyObj} onPress={() => { setReplyMod(false) }} replies={replyComment} replyTxt={replyText} setReplyTxt={setReplyText} onSend={() => { onSendReply(replyObj) }} /> */}
    </SafeAreaView>
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
export default connect(mapStateToProps, mapDispatchToProps)(PostDetails);

const styles = StyleSheet.create({

  emailTxt: {
    fontFamily: fontFamily.semi_bold,
    color: palette.black,
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
  updateContainer: {
    flexDirection: 'row'
  },
  title: {
    color: colors.black,
    marginVertical: 20,
  },
  updateText: {
    color: colors.gray4,
    fontWeight: '500'
  },
  updateDate: {
    color: colors.black,
    fontWeight: '700'
  },
})
