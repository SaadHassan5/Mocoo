import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { getData, saveData } from "../Auth/fire";

export async function getLink(nav) {
  const linkingSubscription = Linking.addEventListener('url', async ({ url }) => {
    let sp = url.split('/')
    console.log("LinkedUrl", sp?.length, url, 'len-2' + sp[sp?.length - 2], 'len-1', sp[sp?.length - 1]);
    const value = await AsyncStorage.getItem("User")
    if (value != null) {
      if (sp[sp?.length - 2] == 'community') {
        let res = await getData('CommunityChats', sp[sp?.length - 1])
        nav?.current?.navigate('CommunityChat', { name: res?.communityName, communityId: res?.chatId, owner: res?.owner })
      }
     else if (sp[sp?.length - 2] == 'profile') {
        if (sp[sp?.length - 1] == value)
          return;
        let res = await getData('Users', sp[sp?.length - 1])
        nav?.current?.navigate('OtherProfile', { email: res?.email })
        let resMy = await getData('Users', value)
        let resInMy=resMy?.history?.find(i=> i?.email==sp[sp?.length - 1]);
        let meInRes=res?.history?.find(i=> i?.email==value);
        console.log('My OBJ',{history:resInMy?[...resMy?.history]:[resMy?.history,{name:res?.name,email:sp[sp?.length - 1],profileUri:res?.profileUri}]});
        console.log('Friend OBJ',{ history:meInRes?[...res?.history]:[res?.history,{name:resMy?.name,email:resMy?.email,profileUri:resMy?.profileUri}]});
        await saveData('Users',value,{
          history:resInMy?[...resMy?.history]:[...resMy?.history,{name:res?.name,email:sp[sp?.length - 1],profileUri:res?.profileUri}]
        })
        await saveData('Users',sp[sp?.length - 1],{
          history:meInRes?[...res?.history]:[...res?.history,{name:resMy?.name,email:resMy?.email,profileUri:resMy?.profileUri}]
        })
      }
      else if (sp[sp?.length - 2] == 'posts') {
        let res = await getData('Posts', sp[sp?.length - 1])
        nav?.current?.navigate('PostDetails', {...res })
      }
      else if (sp[sp?.length - 2] == 'states') {
        let res = await getData('States', sp[sp?.length - 1])
        nav?.current?.navigate('ShowCities', {...res })
      }
      else if (sp[sp?.length - 2] == 'city') {
        let res = await getData('Cities', sp[sp?.length - 1])
        nav?.current?.navigate('ShowGroups', {...res })
      }
      else if (sp[sp?.length - 2] == 'group') {
        let res = await getData('Groups', sp[sp?.length - 1])
        nav?.current?.navigate('GroupTab', { groupId: sp[sp?.length - 1], groupName: res?.groupName, owner: res?.owner })
      }
    }
  });
  return linkingSubscription;
}
export async function giveLink(props, url) {
  let sp = url.split('/')
  console.log("LinkedUrl", sp?.length, url, 'len-2' + sp[sp?.length - 2], 'len-1', sp[sp?.length - 1]);
  const value = await AsyncStorage.getItem("User")
  if (value != null) {
    if (sp[sp?.length - 2] == 'community') {
      let res = await getData('CommunityChats', sp[sp?.length - 1])
      props?.navigation?.navigate('CommunityChat', { name: res?.communityName, communityId: res?.chatId, owner: res?.owner })
    }
    else
      await Linking?.openURL(url)
  }
}