import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, FlatList, Image, ScrollView } from 'react-native'
import AppButton from '../../components/AppButton'
import AppTextInput from '../../components/AppTextInput'
import Header from '../../components/Header'
import { launchImageLibrary } from 'react-native-image-picker';
import { HP, WP } from '../../assets/config'
import { colors } from '../../theme'
import { saveData, uploadFile } from '../../Auth/fire'
import AlertService from '../../Services/alertService'
import { styles } from './style'
import DropDownPicker from 'react-native-dropdown-picker'
import { connect } from 'react-redux'
import { ChangeBackgroundColor, GetUser } from '../../root/action'
import { makeid } from '../../assets/config/MakeId'

function NewPost(props) {
    const [imgs, setImgs] = useState([])
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState("")

    useEffect(() => {
        console.log(props?.route);

    }, [])
    async function onPost() {
        if (title?.trim() != "" && desc?.trim() != "" && imgs?.length > 0) {

            // console.log("TMEMATCH", tempMatch);
            AlertService.confirm("Confirmation").then(async (res) => {
                if (res) {
                    let iid= props?.route?.params?.groupId+""?.slice(0,5)+"-"+ makeid(20);
                    let obj = {
                        title: title,
                        description: desc,
                        email:props?.user?.email,
                        approve:true,
                        reject:false,
                        groupId:props?.route?.params?.groupId,
                        postId:iid,
                        userDetails:{
                            name:props?.user?.name,
                            email:props?.user?.email,
                            profileUri:props?.user?.profileUri,
                        },
                        time:new Date()?.getTime(),   }
                    props?.navigation?.goBack();
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
                }
            })
        }
        else
            AlertService.toastPrompt("Enter Full Detail")
    }

    async function onBrowse(setImage) {
        const options = {
            mediaType: 'photos',
            base64: true,
            selectionLimit: 2
        }
        await launchImageLibrary(options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else {
                console.log("image---->", response?.assets);
                setImgs(response?.assets)
                // toastPrompt("Image Uploaded")
            }
        })
    }
    return (
        <>
            <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
                <Header
                    style={{ backgroundColor: colors.light }}
                    title="Add Post"
                    onPress={() => props.navigation.goBack()}
                />

                    <View style={styles.paymentWrapper}>
                        <View style={styles.paymentBox}>
                            <AppTextInput value={title} onChange={(e) => { setTitle(e) }} placeholderText="Title" />
                            <AppTextInput value={desc} multi numLines={3} onChange={(e) => { setDesc(e) }} placeholderText="Description" />
                          
                            {imgs?.length > 0 &&
                                <FlatList
                                    numColumns={2}
                                    data={imgs}

                                    contentContainerStyle={{ paddingVertical: HP(5), paddingHorizontal: WP(5) }}
                                    keyExtractor={item => item.id}
                                    renderItem={({ item }) =>
                                        <View>{item?.uri ?
                                            <Image source={{ uri: item?.uri }} style={{ width: WP(30), height: WP(30), marginRight: WP(5), marginTop: HP(2) }} />
                                            :
                                            <Image source={{ uri: item }} style={{ width: WP(30), height: WP(30), marginRight: WP(5), marginTop: HP(2) }} />}
                                        </View>
                                    } />
                            }
                            <AppButton onPress={() => onBrowse()} style={{ marginTop: 15 }} title="Add Images" />
                            <AppButton onPress={() => onPost()} style={{ marginTop: 15 }} title="Add Post" />
                        </View>
                    </View>
            </ScrollView>
        </>
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
  export default connect(mapStateToProps, mapDispatchToProps)(NewPost);