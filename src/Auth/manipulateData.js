import { makeid } from "../assets/config/MakeId";
import AlertService from "../Services/alertService";
import { saveData } from "./fire";

export async function onPost(props,title,desc,groupId,imgs) {
    if ( desc?.trim() != "") {
                let iid= groupId+""?.slice(0,5)+"-"+ makeid(20);
                let obj = {
                    title: title,
                    description: desc,
                    email:props?.user?.email,
                    approve:true,
                    reject:false,
                    groupId:groupId,
                    postId:iid,
                    userDetails:{
                        name:props?.user?.name,
                        profileUri:props?.user?.profileUri,
                    },
                    time:new Date()?.getTime(),   }
                // props?.navigation?.goBack();
                let upImgs=[];
                for (let index = 0; index < imgs.length; index++) {
                    let r = await uploadFile(imgs[index]?.uri, imgs[index]?.fileName, title)
                    upImgs?.push(r)
                }
                obj = {
                    ...obj,
                    images: upImgs,
                }
                console.log('Save obj',obj);
                await saveData("Posts", iid, {
                    ...obj,
                })
    }}