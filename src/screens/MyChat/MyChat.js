import { StyleSheet, View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { colors, spacing } from '../../theme';
import Header from '../../components/Header';
import { db, filterCollectionSingle, filterCollectionSingleOP } from '../../Auth/fire';
import fontFamily from '../../assets/config/fontFamily';
import { HP, palette, WP } from '../../assets/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';

const MyChat = (props) => {
  const [chat, setChat] = useState([])
  useEffect(() => {

    setTimeout(() => {
      console.log(props.route);
    }, 3000)
    db.collection('IndividualChat').where("members", "array-contains", props?.user?.email)
      .onSnapshot(documentSnapshot => {
        getConservation();
      });
  }, [])
  const getConservation = async () => {
    const value = await AsyncStorage.getItem("User")
    const res = await filterCollectionSingle("IndividualChat", "members", "array-contains", value);
    console.log('myyy', res);
    setChat(res)
  }
  return (
    <>
      <Header
        style={{ backgroundColor: colors.light }}
        title={"My Chats"}
        goBack={false}
        onPress={() => { props?.navigation?.goBack() }}
      />
      <View style={{ flex: 1, flexDirection: 'column-reverse', justifyContent: 'center' }}>
        <FlatList
          numColumns={1}
          data={chat}
          style={{marginTop:HP(3)}}
          contentContainerStyle={{ paddingBottom: HP(6) }}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) =>
            <View style={{}}>
              {item?.members?.map((subItem, index) =>
                <View style={{}}>
                  {/* <Text style={{ ...styles.emailTxt, }}>{item?.name}</Text> */}
                  {subItem != props?.user?.email &&
                    <TouchableOpacity onPress={() => { props?.navigation?.navigate("IndividualChat", { email: item?.members[index], name: item?.membersName[index], profileUri: item?.profileImgs[index] }) }} style={{ ...styles.row, ...styles?.card }}>
                      <Image source={{ uri: item?.profileImgs[index] }} style={{ width: WP(15), height: WP(15), borderRadius: WP(10) }} />
                      <View style={{ paddingHorizontal: WP(5) }}>
                        <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.light, fontSize: 17 }}>{item?.membersName[index]}</Text>
                        <Text style={{ ...styles.emailTxt, fontFamily: fontFamily.regular, color: palette?.labelGray }}>{item?.lastMsgTxt}</Text>
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              )
              }
            </View>
          } />
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
export default connect(mapStateToProps, mapDispatchToProps)(MyChat);

const styles = StyleSheet.create({

  emailTxt: {
    fontFamily: fontFamily.semi_bold,
    color: palette.black,
    fontSize: 15
  },
  card: {
    backgroundColor: "#fff", paddingHorizontal: spacing[8],
    paddingVertical: spacing[8],
    borderRadius: spacing[3],
    // marginBottom: spacing[8]
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
