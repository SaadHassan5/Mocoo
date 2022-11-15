import React, { useEffect } from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { StyleSheet, View } from 'react-native';
import { HP, WP } from '../../config';
import fontFamily from '../../config/fontFamily';
import { CustomBtn1 } from '../CustomButton/CustomBtn1';

const UpdateModal = ({ mod, onPress,onUpate}) => {
    const Styles = StyleSheet.create({
        uploadTxt: {
            fontFamily: fontFamily.bold,
            color: 'black',
            fontSize: 16,
            textAlign: 'center'
        },
        shadow: {
            shadowColor: 'black',
            shadowOffset: {
                width: 0,
                height: 10,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.5, elevation: 5,
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center'
        },
        optView: {
            width: WP(27), height: HP(20),
            borderWidth: .3
        },
        img: {
            width: WP(20),
            height: WP(20),
            alignSelf: 'center'
        },
        optTxt: {
            fontFamily: fontFamily.semi_bold, color: 'black', fontSize: 13,
            width: WP(13),
            textAlign: 'center'
        }
    })
    useEffect(() => {
    }, [])
    return (
        <ReactNativeModal isVisible={mod} style={{ margin: 0 }} onBackButtonPress={onPress} onBackdropPress={onPress}>
            <View style={{ height: HP(80), width: WP(90), backgroundColor: "black", alignSelf: 'center', borderRadius: WP(4) }}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                    <CustomBtn1 disable txtStyle={{color:'black',textAlign:'center'}} txt={'To use the App in right way and to access new Features update the App'} style={{width:WP(70),paddingHorizontal:WP(5),paddingVertical:HP(1),backgroundColor:'#fff',}}/>
                    <CustomBtn1 onPress={onUpate} txtStyle={{color:'black'}} txt={'Update'} style={{width:WP(70),paddingVertical:HP(1),backgroundColor:'#fff',marginTop:HP(2)}}/>
                </View>
            </View>
        </ReactNativeModal>
    )
}
export default UpdateModal;