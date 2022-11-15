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
import Entypo from 'react-native-vector-icons/Entypo'
const ShowGroups = (props) => {
  const [active, setActive] = useState(false)
  const [allGroups, setAllGroups] = useState([])
  const [category, setCategory] = useState([])

  useEffect(() => {
    db.collection('Groups')?.where('cityId', '==', props?.route?.params?.cityId)
      .onSnapshot(documentSnapshot => {
        getStates();
      });
    getCategories()
  }, [])
  async function getCategories() {
    let res = await getData('AdminData', 'group');
    let temp = res?.categorie?.map((i,index) => {
      return { category: i,select:index==0?true:false }
    })
    setCategory(temp)
  }
  async function getStates() {
    const res = await filterCollectionSingle('Groups', 'cityId', '==', props?.route?.params?.cityId)
    console.log('States=======>', res);
    setAllGroups(res)
  }
  async function goToGroup(item) {
    props?.navigation?.navigate('GroupTab', { groupId: item?.groupId, groupName: item?.groupName, owner: item?.owner })
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={props?.route?.params?.cityName} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewGroup', props?.route?.params) }} txt={'Add Group'} style={{ width: WP(70), backgroundColor: palette?.white, alignSelf: 'center' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5), paddingVertical: HP(2) }}>
        {category?.map((cItem, cIndex) =>
          <View key={cIndex} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginBottom: HP(3) }}>
            <TouchableOpacity onPress={() => {
              let temp = [...category]; temp[cIndex] = { ...cItem, select: !cItem?.select }; setCategory(temp)
            }} style={{ ...GlobalStyles.row, justifyContent: 'space-between', }}>
              {/* <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} /> */}
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10), width: WP(60) }}>{cItem?.category}</Text>
              <Entypo name='triangle-down' size={30} color='black' />
            </TouchableOpacity>
            {cItem?.select &&
              <FlatList
                numColumns={1}
                style={{ flex: 1,marginTop:HP(2) }}
                data={allGroups}
                contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) =>
                  <View>
                    {item?.category == cItem?.category &&
                      <TouchableOpacity onPress={() => {goToGroup(item)}} style={{  ...GlobalStyles.row, marginBottom: HP(3) }}>
                        <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
                        <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10), width: WP(60) }}>{item?.groupName}</Text>
                      </TouchableOpacity>
                    }
                  </View>
                } />
            }
          </View>
        )}
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowGroups);