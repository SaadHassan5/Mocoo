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

function NewCities(props) {
    const [active, setActive] = useState(false)
    const [change, setChange] = useState(false)
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
                    let obj = {
                        country: countryName?.toLowerCase(),
                    }
                    props?.navigation?.goBack();
                            let r = await uploadFile(imgs[0]?.uri, imgs[0]?.fileName, countryName)
                    obj = {
                        ...obj,
                        image: r,
                    }
                    let iid= props?.user?.name?.split(' ')[0]?.toLowerCase()+ makeid(20);
                    console.log('Save obj',obj);
                    await saveData("Cities", iid, {
                        ...obj,
                        cityId:iid,
                        cityName:cState,
                        country:props?.route?.params?.country,
                        stateId:props?.route?.params?.stateId,
                        state:props?.route?.params?.state,
                        stateImage:props?.route?.params?.image,
                        time:new Date()?.getTime(),
                        owner:props?.user?.email,
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
                    title="Add City"
                    onPress={() => props.navigation.goBack()}
                />

                    <View style={styles.paymentWrapper}>
                        <View style={styles.paymentBox}>
                            <AppTextInput editable={false} value={props?.route?.params?.country}  placeholderText="Country" />
                            <AppTextInput editable={false} value={props?.route?.params?.state}  placeholderText="State" />
                            <AppTextInput value={cState} onChange={(e) => { setcState(e) }} placeholderText="City" />
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
                            <AppButton onPress={() => onBrowse()} style={{ marginTop: 15 }} title="Add Image" />
                            <AppButton onPress={() => onPost()} style={{ marginTop: 15 }} title="Add City" />
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
  export default connect(mapStateToProps, mapDispatchToProps)(NewCities);