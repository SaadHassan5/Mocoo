import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { getData } from "../Auth/fire";

export async function getLink(nav) {
    const linkingSubscription = Linking.addEventListener('url', async ({ url }) => {
      let sp = url.split('/')
      console.log("LinkedUrl", sp?.length, url, 'len-2' + sp[sp?.length - 2],'len-1',sp[sp?.length - 1]);
      const value = await AsyncStorage.getItem("User")
      if (value != null) {
        if(sp[sp?.length - 2]=='community'){
            let res =await getData('CommunityChats',sp[sp?.length - 1])
            nav?.current?.navigate('CommunityChat',{name:res?.communityName,communityId:res?.chatId,owner:res?.owner    })
        }
      }
    });
    return linkingSubscription;
  }
  export async function giveLink(props,url) {
      let sp = url.split('/')
      console.log("LinkedUrl", sp?.length, url, 'len-2' + sp[sp?.length - 2],'len-1',sp[sp?.length - 1]);
      const value = await AsyncStorage.getItem("User")
      if (value != null) {
        if(sp[sp?.length - 2]=='community'){
            let res =await getData('CommunityChats',sp[sp?.length - 1])
            props?.navigation?.navigate('CommunityChat',{name:res?.communityName,communityId:res?.chatId,owner:res?.owner    })
        }
        else
        await Linking?.openURL(url)
      }
  }