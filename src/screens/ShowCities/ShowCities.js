import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, getData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';

const ShowCities = (props) => {
  const [active, setActive] = useState(false)
  const [allCities, setAllCities] = useState([])

  useEffect(() => {
    db.collection('Cities')?.where('stateId', '==', props?.route?.params?.stateId)
    .onSnapshot(documentSnapshot => {
        getStates();
    });
  }, [])
  async function getStates() {
    const res = await filterCollectionSingle('Cities', 'stateId', '==', props?.route?.params?.stateId)
    console.log('States=======>', res);
    setAllCities(res)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'Cities'} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewCities',props?.route?.params) }} txt={'Add City'} style={{ width: WP(70), marginTop: HP(4), alignSelf: 'center' }} />
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1,marginTop:HP(7) }}
          data={allCities}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
          <TouchableOpacity onPress={()=>{props?.navigation?.navigate("ShowGroups",item)}} style={{...GlobalStyles?.card,...GlobalStyles.shadow,...GlobalStyles.row,marginBottom:HP(3)}}>
            <Image source={{uri:item?.image}} style={{width:WP(20),height:WP(20),borderRadius:WP(2)}}/>
            <Text style={{...GlobalStyles.boldTxt,paddingLeft:WP(10)}}>{item?.cityName}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowCities);