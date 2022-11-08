import React, { useEffect } from 'react';
import { View, ActivityIndicator, ImageBackground, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { IMAGES } from '../../assets/imgs';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle, getData } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';

const ShowStates = (props) => {
  const [active, setActive] = useState(false)
  const [allStates, setAllStates] = useState([])

  useEffect(() => { 
    console.log('RED',props?.user);
    db.collection('States')?.where('country', '==', props?.user?.country?.toLowerCase())
    .onSnapshot(documentSnapshot => {
        getStates();
    });
  }, [])
  async function getStates() {
    const res = await filterCollectionSingle('States', 'country', '==', props?.user?.country?props?.user?.country.toLowerCase():"")
    console.log('States=======>', res);
    setAllStates(res)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'States'} />
      <CustomBtn1 onPress={() => { props?.navigation?.navigate('NewState') }} txt={'Add States'} style={{ width: WP(70), alignSelf: 'center',backgroundColor:palette?.white }} />
      <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
        <FlatList
          numColumns={1}
          style={{ flex: 1,marginTop:HP(7) }}
          data={allStates}
          contentContainerStyle={{ paddingBottom: HP(10), paddingHorizontal: WP(5) }}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) =>
          <TouchableOpacity onPress={()=>{props?.navigation?.navigate('ShowCities',item)}} style={{...GlobalStyles?.card,...GlobalStyles.shadow,...GlobalStyles.row,marginBottom:HP(3)}}>
            <Image source={{uri:item?.image}} style={{width:WP(20),height:WP(20),borderRadius:WP(2)}}/>
            <Text style={{...GlobalStyles.boldTxt,paddingLeft:WP(10)}}>{item?.state}</Text>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowStates);