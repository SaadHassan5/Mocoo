import { Linking } from "react-native";
import { onBrowse } from "../assets/config/Browse";
import { makeid } from "../assets/config/MakeId";
import AlertService from "../Services/alertService";
import { deleteData, saveData, uploadFile } from "./fire";
import Clipboard from '@react-native-clipboard/clipboard';

export async function onPost(props, title, desc, groupId, imgs, type) {
    if (desc?.trim() != "") {
        let iid = groupId + ""?.slice(0, 5) + "-" + makeid(20);
        let obj = {
            title: title,
            description: desc,
            email: props?.user?.email,
            approve: true,
            reject: false,
            groupId: groupId,
            postId: iid,
            type: type,
            groupName:props?.route?.params?.groupName?props?.route?.params?.groupName:'',
            userDetails: {
                name: props?.user?.name,
                profileUri: props?.user?.profileUri,
            },
            time: new Date()?.getTime(),
        }
        // props?.navigation?.goBack();
        let upImgs = [];
        for (let index = 0; index < imgs.length; index++) {
            let r = await uploadFile(imgs[index]?.uri, imgs[index]?.fileName, title)
            upImgs?.push(r)
        }
        obj = {
            ...obj,
            images: upImgs,
        }
        console.log('Save obj', obj);
        await saveData("Posts", iid, {
            ...obj,
        })
    }
}
export async function onPostFriend(props, title,  type) {
    if (title?.trim() != "") {
        let iid = props?.user?.email?.split(' ')[0]+ "-" + makeid(20);
        let obj = {
            title: title,
            email: props?.user?.email,
            approve: true,
            reject: false,
            postId: iid,
            type: type,
            userDetails: {
                name: props?.user?.name,
                profileUri: props?.user?.profileUri,
            },
            time: new Date()?.getTime(),
        }
        console.log('Save obj', obj);
        await saveData("FriendsPosts", iid, {
            ...obj,
        })
        AlertService.show('Posted')
    }
}
export async function openInsta(insta) {
    let p = insta?.split('@');
    if (p?.length > 0)
        await Linking?.openURL(`instagram://user?username=${p[1]}`)
    else
        await Linking?.openURL(`instagram://user?username=${p[0]}`)
}
export async function VerifyMyAccount(props) {
    let img = await onBrowse(1);
    if (img?.length > 0) {
        AlertService?.confirm('Are you sure')?.then(async (rrr) => {
            if (rrr) {
                await saveData('Users', props?.user?.email, {
                    vericationApplied: true,
                })
                AlertService?.show('Applied')
                let r = await uploadFile(img[0]?.uri, img[0]?.fileName, props?.user?.email)
                await saveData('Verification', props?.user?.email, {
                    img: r,
                    email: props?.user?.email,
                    name: props?.user?.name,
                    profileUri: props?.user?.profileUri,
                    time: new Date()?.getTime(),
                })
            }
        })
    }
}
export const onLike = async (item1,props,col) => {
    console.log(item1);
    let sub = item1?.likedBy ? [...item1?.likedBy] : [];
    sub.push({ email: props?.user?.email, name: props?.user?.name, profileUri: props?.user?.profileUri })
    console.log('Sub', item1?.id, sub);
    await saveData(col, item1?.id, {
      likes: item1?.likedBy ? item1?.likes + 1 : 1,
      likedBy: sub
    })
  }
  export const unLike = async (item1,props,col) => {
    let sub = [];
    console.log("unlike");
    item1.likedBy.filter((i) => {
      if (i?.email != props?.user?.email)
        sub.push(i)
    })
    await saveData(col, item1?.id, {
      likes: item1.likes - 1,
      likedBy: sub
    })
  }
export const copyToClip=(copyText='')=>{
    Clipboard.setString(copyText)
    AlertService.show('Url has been Copied')
}
export const onReport=(chatId)=>{
    AlertService.confirm('Are you sure??').then(async(res)=>{
        if(res){
            await deleteData('IndividualChat',chatId)
            AlertService.show('Reported!! Admin will look into your report.')
        }
    })
}
export async function contactUs(email='ronakjoshifly@Gmail.com',desc='Forgot MY Password',body=''){
    await Linking.openURL(`mailto:${email}?subject=${desc}&body=${body}`)
}