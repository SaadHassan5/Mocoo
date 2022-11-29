import React, { useEffect } from 'react';
import { View, SafeAreaView, ScrollView, FlatList, Text, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { connect } from 'react-redux';
import { ChangeBackgroundColor, GetUser } from '../../root/action';
import { db, filterCollectionSingle } from '../../Auth/fire';
import { GlobalStyles } from '../../global/globalStyles';
import { HP, palette, WP } from '../../assets/config';
import { CustomBtn1 } from '../../assets/components/CustomButton/CustomBtn1';
import Header from '../../components/Header';
import { Input } from '../../assets/components/Input/Input';
const ShowSubscribed = (props) => {
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
  }, [])
  async function getStates() {
    const res = await filterCollectionSingle('Groups', 'groupId','in',props?.user?.subscribedIds)
    console.log('States=======>', res);
    setAllStates(res)
    setForSearch(res)
  }
  async function onSearch() {
    let filteredData = forSearch.filter(function (item) {
      return item.groupName.toLowerCase().includes(searchTxt?.toLowerCase());
    });
    setAllStates(filteredData)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'Groups'} />
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
            <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginBottom: HP(3) }}>
              <TouchableOpacity onPress={() => { props?.navigation?.navigate('ShowCities', item) }} style={{ ...GlobalStyles.row, }}>
                <Image source={{ uri: item?.groupImage }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
                <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.groupName}</Text>
              </TouchableOpacity>
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
export default connect(mapStateToProps, mapDispatchToProps)(ShowSubscribed);