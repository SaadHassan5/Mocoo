import React, { useEffect } from 'react';
import { ReactNativeModal } from 'react-native-modal';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HP, palette, WP } from '../../config';
import fontFamily from '../../config/fontFamily';
import { CustomBtn1 } from '../CustomButton/CustomBtn1';
import { Menu, MenuItem } from 'react-native-material-menu';
import { GlobalStyles } from '../../../global/globalStyles';
import Fontiso from 'react-native-vector-icons/EvilIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { onLike, unLike } from '../../../Auth/manipulateData';

const PostRender = ({ props, item, index, hideMenu, showMenu, onShare, onType, opt,setOpt }) => {
    return (
        <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow, marginTop: HP(4) }}>
            <TouchableOpacity onPress={() => { props?.navigation?.navigate('PostDetails', item) }} style={{ ...GlobalStyles.row, alignItems: 'flex-start', marginBottom: HP(1.5) }}>
                <TouchableOpacity onPress={() => { item?.email != props?.user?.email ? props?.navigation?.navigate('OtherProfile', { email: item?.email }) : console.log('my'); }}>
                    <Image source={{ uri: item?.userDetails?.profileUri }} style={{ width: WP(14), height: WP(14), borderRadius: WP(12) }} />
                </TouchableOpacity>
                <View style={{ paddingLeft: WP(5) }}>
                    <Text style={{ ...GlobalStyles.boldTxt, width: WP(60) }}>{item?.userDetails?.name}</Text>
                    {/* <Text style={{ ...GlobalStyles.mediumTxt, width: WP(60) }}>{item?.title}</Text> */}
                    <Text style={{ ...GlobalStyles.lightTxt, width: WP(60) }}>{item?.description}</Text>
                    {item?.type &&
                        <TouchableOpacity onPress={onType} style={{ backgroundColor: 'rgba(15, 201, 169,1)', alignSelf: 'flex-start', paddingHorizontal: WP(5), marginTop: HP(2), paddingVertical: HP(0.6), borderRadius: WP(10) }}>
                            <Text style={{ ...GlobalStyles.mediumTxt, color: palette.white }}>{item?.type} {item?.type == 'On The Go' && `(will be hide after${'\n'}3 hours)`}</Text>
                        </TouchableOpacity>
                    }
                </View>
            </TouchableOpacity>
            <View style={{ ...GlobalStyles?.row, justifyContent: 'space-around', paddingHorizontal: WP(10) }}>
                {item?.likedBy?.find(e => e?.email == props?.user?.email) ?
                    <TouchableOpacity onPress={() => { unLike(item, props, 'Posts') }} style={{ ...GlobalStyles?.row }}>
                        <AntDesign name='like1' size={25} color={palette?.purple} />
                        <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={() => { onLike(item, props, 'Posts') }} style={{ ...GlobalStyles?.row }}>
                        <AntDesign name='like2' size={25} color={palette?.purple} />
                        <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.likes ? item?.likes : 0}</Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => { props?.navigation?.navigate('PostDetails', item) }} style={{ ...GlobalStyles?.row }}>
                    <Fontiso name='comment' size={30} color={palette?.purple} />
                    <Text style={{ ...GlobalStyles?.boldTxt, paddingLeft: WP(2) }}>{item?.commentCount}</Text>
                </TouchableOpacity>
            </View>
            <View style={{ position: 'absolute', right: 0, }}>
                <Menu
                    visible={item?.select ? item?.select : false}
                    anchor={<TouchableOpacity onPress={showMenu}><Text style={{ ...GlobalStyles.boldTxt, fontSize: 25, paddingHorizontal: WP(3), top: -12 }}>...</Text></TouchableOpacity>}
                    onRequestClose={hideMenu}
                >
                    <MenuItem style={{}} onPress={onShare}>Share</MenuItem>
                </Menu>
            </View>
           
        </View>
    )
}
export default PostRender;