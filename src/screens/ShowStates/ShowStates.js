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
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
const ShowStates = (props) => {
  const [active, setActive] = useState(false)
  const [allStates, setAllStates] = useState([])
  const [forSearch, setForSearch] = useState([])
  const [searchTxt, setSearchTxt] = useState('')

  useEffect(() => {
    console.log('RED', props?.user);
    db.collection('States')?.where('country', '==', props?.user?.country?.toLowerCase())
      .onSnapshot(documentSnapshot => {
        getStates();
      });
  }, [])
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
  const hideMenu = (item, index) => {
    let temp = [...allStates];
    temp[index] = { ...item, select: false }
    setAllStates(temp)
  }

  const showMenu = (item, index) => {
    let temp = [...allStates];
    temp[index] = { ...item, select: true }
    setAllStates(temp)
  }
  async function onShare(item,index) {
    const url = `whatsapp://send?text=https://mocooproject.page.link/states/${item?.id}`
    await Linking.openURL(url)
    hideMenu(item,index)
  }
  return (
    <SafeAreaView style={{ ...GlobalStyles.container }}>
      <Header goBack={false} title={'States'} />
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
            <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginBottom: HP(3) }}>
              <TouchableOpacity onPress={() => { props?.navigation?.navigate('ShowCities', item) }} style={{ ...GlobalStyles.row, }}>
                <Image source={{ uri: item?.image }} style={{ width: WP(20), height: WP(20), borderRadius: WP(2) }} />
                <Text style={{ ...GlobalStyles.boldTxt, paddingLeft: WP(10) }}>{item?.state}</Text>
              </TouchableOpacity>
              {/* <View style={{ position: 'absolute', right: 0, }}>
                <Menu
                  visible={item?.select ? item?.select : false}
                  anchor={<TouchableOpacity onPress={() => { showMenu(item, index) }}><Text style={{ ...GlobalStyles.boldTxt, fontSize: 25,paddingHorizontal:WP(3),top:-12 }}>...</Text></TouchableOpacity>}
                  onRequestClose={() => { hideMenu(item, index) }}
                >
                  <MenuItem onPress={() => { onShare(item,index) }}>Share</MenuItem>
                </Menu>
              </View> */}
            </View>
          } />

      </ScrollView>
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