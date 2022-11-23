import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { HP, palette, WP } from '../../config';
import { GlobalStyles } from '../../../global/globalStyles';

const SuggestedPostsRender = ({ props, onSelect,item }) => {
    return (
        <View style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow,  }}>
                    <TouchableOpacity onPress={onSelect} style={{ ...GlobalStyles?.card, ...GlobalStyles.shadow,marginRight:WP(5) }}>
                        <Text style={{ ...GlobalStyles.mediumTxt }}>{item?.title}</Text>
                        <Text style={{ ...GlobalStyles.lightTxt, color: palette.purple }}>{item?.type}</Text>
                    </TouchableOpacity>
        </View>
    )
}
export default SuggestedPostsRender;