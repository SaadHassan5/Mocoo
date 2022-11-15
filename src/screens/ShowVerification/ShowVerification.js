import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, deleteData, filterCollectionSingle, getAllOfCollection, getData, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import { Input } from '../../assets/components/Input/Input';
import UpdateModal from '../../assets/components/Modal/UpdateModal';
import AlertService from '../../Services/alertService';
import { FireAuth } from '../../Auth/socialAuth';

const ShowVerificarion = (props) => {
  const [active, setActive] = useState(false)
  const [allStates, setAllStates] = useState([])
  const [forSearch, setForSearch] = useState([])
  const [searchTxt, setSearchTxt] = useState('')
  const [updeteMod, setUpdateMod] = useState(false)

  useEffect(() => {
    console.log('RED', props?.user);
    if (props?.updateApp)
      setUpdateMod(true)
    db.collection('Verification')
      .onSnapshot(documentSnapshot => {
        getStates();
      });
  }, [])
  async function getStates() {
    const res = await getAllOfCollection('Verification',)
    console.log('States=======>', res);
    setAllStates(res)
    setForSearch(res)
  }
  async function onSearch() {
    let filteredData = forSearch.filter(function (item) {
      return item.name.toLowerCase().includes(searchTxt?.toLowerCase());
    });
    setAllStates(filteredData)
  }
  async function onVerify(item) {
   AlertService.confirm('Are you sure to accept?').then(async(res)=>{
    if(res){
      await saveData('Users',item?.email,{
        verified:true,rejectedVerification:false,
      })
      await saveData('VerifiedUsers',item?.email,{
        ...item,
      })
      await deleteData('Verification',item?.id,)
    }
   })
  }
  async function onReject(item) {
    AlertService.confirm('Are you sure to reject?').then(async(res)=>{
     if(res){
       await saveData('Users',item?.email,{
         rejectedVerification:true
       })
       await deleteData('Verification',item?.id,)
     }
    })
   }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'States'} rightOptionTxt={'Logout'} rightOptionPress={()=>{FireAuth.Logout(props)}}/>
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewState') }} txt={'Add States'} style={{ width: WP(70), alignSelf: 'center', backgroundColor: palette?.white }} />
      <View style={{ ...GlobalStyles.row, alignSelf: "center", marginTop: HP(3) }}>
        <Input onChange={(e) => { setSearchTxt(e) }} placeTxt={'Search'} styles={{ borderRadius: WP(0), width: WP(60), }} />
        <CustomBtn1 onPress={() => { onSearch() }} txt={'Search'} txtStyle={{ fontSize: 13 }} style={{ height: HP(7), width: WP(20) }} />
      </View>
      {allStates?.length == 0 &&
        <Text style={{ ...GlobalStyles.boldTxt, marginTop: HP(6), textAlign: 'center' }}>Nothing Found</Text>
      }
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1, marginTop: HP(7) }}
          data={allStates}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
            <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, }}>
              <TouchableOpacity onPress={() => { }} style={{...GlobalStyles.row, }}>
                <Image source={{ uri: item?.profileUri }} style={{ width: WP(20), height: WP(20), borderRadius: WP(20) }} />
                <View>
                  <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.name}</Text>
                  <Text style={{ ...GlobalStyles.lightTxt, paddingLeft: WP(10) }}>{item?.email}</Text>
                </View>
              </TouchableOpacity>
              <Image source={{ uri: item?.img }} style={{ width: WP(50), height: WP(50), borderRadius: WP(2),alignSelf:'center'}} />
              <View style={{...GlobalStyles.row,justifyContent:'space-around',paddingVertical:HP(2)}}>
                <CustomBtn1 onPress={()=>{onVerify(item)}} txt={'Verify'} txtStyle={{fontSize:15}} style={{width:WP(30),paddingVertical:HP(1),backgroundColor:palette.status_dot_bg_green}}/>
                <CustomBtn1 onPress={()=>{onReject(item)}} txt={'Reject'} txtStyle={{fontSize:15}} style={{width:WP(30),paddingVertical:HP(1),backgroundColor:palette.letterRed}}/>
              </View>
            </View>
          } />
      </ScrollView>
      {/* <UpdateModal mod={updeteMod} onPress={()=>{setUpdateMod(false)}} onUpate={async()=>{await Linking?.openURL('https://play.google.com/store/apps/details?id=com.mocooproject')}}/> */}
    </SafeAreaView>
  )
}

const mapStateToProps = (state) => {
  const { backgroundColor } = state;
  const { user } = state;
  const { updateApp } = state;
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowVerificarion);