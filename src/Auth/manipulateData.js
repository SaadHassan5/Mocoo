import { Linking } from "react-native";
import { onBrowse } from "../assets/config/Browse";
import { makeid } from "../assets/config/MakeId";
import AlertService from "../Services/alertService";
import { saveData, uploadFile } from "./fire";

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