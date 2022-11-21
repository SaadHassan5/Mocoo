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
import { Input } from '../../assets/components/Input/Input';

const ShowCommunity = (props) => {
  const [allGroups, setAllGroups] = useState([])
  const [forSearch, setForSearch] = useState([])
  const [searchTxt, setSearchTxt] = useState('')

  useEffect(() => {
    db.collection('Community')?.where('groupId', '==', props?.route?.params?.groupId)
      .onSnapshot(documentSnapshot => {
        getStates();
      });
  }, [])
  async function getStates() {
    const res = await filterCollectionSingle('Community', 'groupId', '==', props?.route?.params?.groupId)
    console.log('States=======>', res);
    setAllGroups(res)
    setForSearch(res)
  }
  async function goToGroup(item) {
    props?.navigation?.navigate('CommunityChat', item)
  }
  async function onSearch(){
    let filteredData = forSearch.filter(function (item) {
      return item.name.toLowerCase().includes(searchTxt?.toLowerCase());
    });
    setAllGroups(filteredData)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'Community'} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewCommunity', props?.route?.params) }} txt={'Add Your Community'} style={{ width: WP(80), alignSelf: 'center', marginTop: HP(5.5) }} />
      <View style={{...GlobalStyles.row,alignSelf: "center",  marginTop: HP(3)}}>
        <Input onChange={(e)=>{setSearchTxt(e)}} placeTxt={'Search'} styles={{ borderRadius: WP(0), width: WP(60),padding:14 }} />
        <CustomBtn1 onPress={()=>{onSearch()}} txt={'Search'} txtStyle={{fontSize:13}} style={{height:HP(7),width:WP(20)}}/>
      </View>
        {allGroups?.length==0 &&
              <Text style={{ ...GlobalStyles.boldTxt,marginTop:HP(6),textAlign:'center' }}>Nothing Found</Text>
        }
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(7) }}
          data={allGroups}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <TouchableOpacity onPress={() => { goToGroup(item) }} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, ...GlobalStyles.row, marginBottom: HP(3) }}>
              <Image source={{ uri: item?.image }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10), width: WP(60) }}>{item?.name}</Text>
            </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowCommunity);