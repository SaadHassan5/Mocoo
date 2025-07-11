import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, FlatList, Image, ScrollView, Text, TouchableOpacity } from 'react-native'
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
import { GlobalStyles } from '../../global/globalStyles'
import { Checkbox } from 'react-native-paper'

function NewCommunity(props) {
    const [active, setActive] = useState(false)
    const [change, setChange] = useState(false)
    const [check, setCheck] = useState('Public')
    const [imgs, setImgs] = useState([])
    const [countryName, setCountryName] = useState(props?.user?.country)
    const [cState, setcState] = useState("")
    useEffect(() => {
        console.log(props?.route);

    }, [])
    function makeid(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    async function onPost() {
        if (countryName?.trim() != "" && cState?.trim() != "" && imgs?.length > 0) {

            // console.log("TMEMATCH", tempMatch);
            AlertService.confirm("Confirmation").then(async (res) => {
                if (res) {
                    let iid = props?.user?.name?.split(' ')[0]?.toLowerCase() + makeid(20);
                    let obj = {
                        name: props?.route?.params?.groupName + "-" + cState,
                        groupName: props?.route?.params?.groupName,
                        groupId: props?.route?.params?.groupId,
                        status:check,
                        communityId: iid,
                        owner: props?.user?.email,
                        ownerDetail: {
                            profileUri: props?.user?.profileUri, name: props?.user?.name,
                        }
                    }
                    props?.navigation?.goBack();
                    let r = await uploadFile(imgs[0]?.uri, imgs[0]?.fileName, countryName)
                    obj = {
                        ...obj,
                        image: r,
                    }
                    console.log('Save obj', obj);
                    await saveData("Community", iid, {
                        ...obj,
                        time: new Date()?.getTime(),
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
            selectionLimit: 1
        }
        await launchImageLibrary(options, async (response) => {
            console.log('Response = ', response);

            if (response.didCancel) {
                console.log('User cancelled image picker');
            }
            else {
                console.log("image---->", response?.assets);
                setImgs(response?.assets)
                setChange(true)
                // toastPrompt("Image Uploaded")
            }
        })
    }
    return (
        <>
            <ScrollView contentContainerStyle={{ paddingBottom: HP(5) }}>
                <Header
                    style={{ backgroundColor: colors.light }}
                    title="Add Community"
                    onPress={() => props.navigation.goBack()}
                />

                <View style={styles.paymentWrapper}>
                    <View style={styles.paymentBox}>
                        <AppTextInput editable={false} value={props?.route?.params?.groupName} placeholderText="Country" />
                        <Text style={{ ...styles.btnTxt, color: 'black' }}>Name will be: {props?.route?.params?.groupName}-{cState}</Text>
                        <AppTextInput value={cState} onChange={(e) => { setcState(e) }} placeholderText="Community Name" />
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
                        <View style={{ ...GlobalStyles.row,justifyContent:'space-evenly' }}>
                            <TouchableOpacity onPress={()=>{setCheck('Public')}} style={{ ...GlobalStyles.row }}>
                                <Checkbox onPress={()=>{setCheck('Public')}} status={check=='Public'?'checked':'unchecked'} />
                                <Text style={{...styles.btnTxt,color:'black',paddingLeft:WP(2)}}>Public</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{setCheck('Private')}} style={{ ...GlobalStyles.row }}>
                                <Checkbox onPress={()=>{setCheck('Private')}} status={check=='Private'?'checked':'unchecked'}  />
                                <Text style={{...styles.btnTxt,color:'black',paddingLeft:WP(2)}}>Private</Text>
                            </TouchableOpacity>
                        </View>
                        <AppButton onPress={() => onBrowse()} style={{ marginTop: 15 }} title="Add Image" />
                        <AppButton onPress={() => onPost()} style={{ marginTop: 15 }} title="Add Group" />
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
export default connect(mapStateToProps, mapDispatchToProps)(NewCommunity);