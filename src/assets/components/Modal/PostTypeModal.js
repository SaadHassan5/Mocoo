import React, { useEffect } from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HP, WP } from '../../config';
import fontFamily from '../../config/fontFamily';
import { CustomBtn1 } from '../CustomButton/CustomBtn1';
import { styles } from '../../../screens/NewState/style';
import { GlobalStyles } from '../../../global/globalStyles';
import { Checkbox } from 'react-native-paper';

const PostTypeModal = ({ mod, onPress, onSave, type, setType }) => {
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
            <View style={{ height: HP(60), width: WP(90), backgroundColor: "black", alignSelf: 'center', borderRadius: WP(4) }}>
                <Text style={{ ...GlobalStyles.boldTxt, textAlign: 'center', marginTop: HP(5), fontSize: 20, color: '#fff' }}>Post Reason?</Text>
                {type == 'On The Go' &&
                    <Text style={{ ...GlobalStyles.boldTxt, color: '#fff', marginTop: HP(2),textAlign:'center',paddingHorizontal:WP(8) }}>This Post Will be removed after 3 hours</Text>
                }  
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ ...GlobalStyles.row, justifyContent: 'space-between', width: WP(70) }}>
                        <TouchableOpacity onPress={() => { setType('Buy/Sell') }} style={{ ...GlobalStyles.row }}>
                            <Checkbox color='#fff' uncheckedColor='red' onPress={() => { setType('Buy/Sell') }} status={type == 'Buy/Sell' ? 'checked' : 'unchecked'} />
                            <Text style={{ ...GlobalStyles.lightTxt, color: '#fff' }}>Buy/Sell</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('On The Go') }} style={{ ...GlobalStyles.row }}>
                            <Checkbox color='#fff' uncheckedColor='red' onPress={() => { setType('On The Go') }} status={type == 'On The Go' ? 'checked' : 'unchecked'} />
                            <View>
                                <Text style={{ ...GlobalStyles.lightTxt, color: '#fff' }}>On The Go</Text>

                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...GlobalStyles.row, justifyContent: 'space-between', width: WP(70) }}>
                        <TouchableOpacity onPress={() => { setType('Events') }} style={{ ...GlobalStyles.row }}>
                            <Checkbox color='#fff' uncheckedColor='red' onPress={() => { setType('Events') }} status={type == 'Events' ? 'checked' : 'unchecked'} />
                            <Text style={{ ...GlobalStyles.lightTxt, color: '#fff' }}>Events</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setType('Discussion') }} style={{ ...GlobalStyles.row }}>
                            <Checkbox color='#fff' uncheckedColor='red' onPress={() => { setType('Discussion') }} status={type == 'Discussion' ? 'checked' : 'unchecked'} />
                            <Text style={{ ...GlobalStyles.lightTxt, color: '#fff' }}>Discussion</Text>
                        </TouchableOpacity>
                    </View>
                    <CustomBtn1 onPress={onSave} txtStyle={{ color: 'black' }} txt={'Save'} style={{ width: WP(70), paddingVertical: HP(1), backgroundColor: '#fff', marginTop: HP(5) }} />
                </View>
            </View>
        </ReactNativeModal>
    )
}
export default PostTypeModal;