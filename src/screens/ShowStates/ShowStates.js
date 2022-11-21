import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, getData, saveData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import { Input } from '../../assets/components/Input/Input';
import UpdateModal from '../../assets/components/Modal/UpdateModal';
// import Geocoder from 'react-native-geocoding';
// import { _returnAddress } from '../../Services/LocationService';
// Geocoder.init('AIzaSyA-nEsnSMgDAHbXJpP81LIxkW_ITv23VMc');

const ShowStates = (props) => {
  const [active, setActive] = useState(false)
  const [allStates, setAllStates] = useState([])
  const [forSearch, setForSearch] = useState([])
  const [searchTxt, setSearchTxt] = useState('')
  const [updeteMod, setUpdateMod] = useState(false)

  useEffect(() => {
    console.log('RED', props?.user);
    if (props?.updateApp)
      setUpdateMod(true)
    db.collection('States')?.where('country', '==', props?.user?.country?.toLowerCase())
      .onSnapshot(documentSnapshot => {
        getStates();
      });
      // if(!props?.user?.city){
      //   getLocation()
      // }
  }, [])
  // async function getLocation(){
  //   Geocoder.from(32.585411, 71.54361700000004)
  //   .then(async(json) => {
  //       var addressComponent = _returnAddress(json);
  //      console.log('Add',addressComponent);
  //      await saveData('Users',props?.user?.email,{
  //       city:addressComponent?.city,
  //      })
  //   }).catch(error => {
  //    console.log('error',error);
        
  //   })
  // }
  async function getStates() {
    const res = await filterCollectionSingle('States', 'country', '==', props?.user?.country ? props?.user?.country.toLowerCase() : "")
    console.log('States=======>', res);
    setAllStates(res)
    setForSearch(res)
  }
  async function onSearch() {
    let filteredData = forSearch.filter(function (item) {
      return item.state.toLowerCase().includes(searchTxt?.toLowerCase());
    });
    setAllStates(filteredData)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'States'} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewState') }} txt={'Add States'} style={{ width: WP(70), alignSelf: 'center', backgroundColor: palette?.white }} />
      <View style={{ ...GlobalStyles.row, alignSelf: "center", marginTop: HP(3) }}>
        <Input onChange={(e) => { setSearchTxt(e) }} placeTxt={'Search'} styles={{ borderRadius: WP(0), width: WP(60),padding:14 }} />
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
            <TouchableOpacity onPress={() => { props?.navigation?.navigate('ShowCities', item) }} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, ...GlobalStyles.row, marginBottom: HP(3) }}>
              <Image source={{ uri: item?.image }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
              <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.state}</Text>
            </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowStates);