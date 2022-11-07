import React from 'react'
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HP, palette, WP } from '../../config';
import fontFamily from '../../config/fontFamily';
import { IMAGES, SVGS } from '../../imgs';
import { ChatComp } from '../SvgComponent/chatComp';
import { NotiComp } from '../SvgComponent/NotiComp';
import { SearchComp } from '../SvgComponent/SearchComp';


export class HomeHeader extends React.Component {
    render() {
        return (
            <View style={{ marginTop: HP(1), flexDirection: 'row', justifyContent: 'center' }}>
                {/* <TouchableOpacity onPress={this.props.onPressArrow} style={{ position: 'absolute', padding: WP(4), left: 5 }}>
                    <NotiComp col={'#7E9DFE'} />
                </TouchableOpacity> */}
                <Image source={IMAGES.soch} resizeMode={'cover'} style={{ marginTop: HP(1.4),width: WP(30),height:WP(10) }} />
                {/* <View style={{ position: 'absolute', right: WP(4),flexDirection:'row',alignItems:'center' }}>
                    <TouchableOpacity style={{padding: WP(3)}}>
                        <SearchComp col={'#7E9DFE'} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{padding: WP(3)}}>
                        <ChatComp col={'#7E9DFE'} />
                    </TouchableOpacity>
                </View> */}
            </View>
        );
    }
}
