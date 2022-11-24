import React, { useEffect } from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { StyleSheet, Text, View, Image, ScrollView, Linking } from 'react-native';
import { HP, WP } from '../../config';
import fontFamily from '../../config/fontFamily';
import { CustomBtn1 } from '../CustomButton/CustomBtn1';
export const AdminPopUp = ({ mod, onPress, props, obj, }) => {
    const Styles = StyleSheet.create({
        uploadTxt: {
            fontFamily: fontFamily.regular,
            color: 'black',
            fontSize: 18,
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
    })

    return (
        <ReactNativeModal isVisible={mod} style={{ margin: 0 }} onBackButtonPress={onPress} onBackdropPress={onPress}>
            <View style={{height:HP(70), width: WP(80), backgroundColor: "#fff", alignSelf: 'center', borderRadius: WP(4) }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:WP(5)}}>
                    <Text style={{...Styles.uploadTxt,paddingVertical:HP(3)}}>{obj?.text?obj?.text:''}</Text>
                </ScrollView>
                    {obj?.onPress!="" ?
                    <CustomBtn1 onPress={async()=>{await Linking.openURL(obj?.onPress)}} style={{width:WP(70),alignSelf:'center',paddingVertical:HP(1),marginTop:HP(5),marginBottom:HP(5)}} txt={obj?.buttonText?obj?.buttonText:'Okay'}/>
                    :obj?.buttonText!="" &&
                    <CustomBtn1 onPress={onPress} style={{width:WP(70),alignSelf:'center',paddingVertical:HP(1),marginTop:HP(5),marginBottom:HP(5)}} txt={obj?.buttonText?obj?.buttonText:'Okay'}/>
                    }
            </View>
        </ReactNativeModal>
    )
}
