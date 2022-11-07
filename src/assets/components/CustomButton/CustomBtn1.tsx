import React from 'react'
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HP, palette, WP } from '../../config';
import fontFamily from '../../config/fontFamily';

export interface Props {
  txt?: any,
  onPress?: any,
  disable?: any,
  style?:any,
  txtStyle?:any,
  icon?:any,
}

export interface State {
  count: 0,
}

const Styles = StyleSheet.create({
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
export class CustomBtn1 extends React.Component<Props, State> {
  render() {
    return (
        <View>
            <TouchableOpacity disabled={this.props.disable?true:false} onPress={this.props.onPress} style={{width:'100%',borderRadius:WP(1),backgroundColor:"#d70465",justifyContent:'center',alignItems:'center',...this.props.style,}}> 
            {/* ...Styles.shadow,borderWidth:1,borderColor:'#B7C1DF' */}
                <Text style={{fontFamily:fontFamily.bold,fontSize:20,color:'white',...this?.props.txtStyle}}>{this.props.txt}</Text>
            </TouchableOpacity>
        </View>
    );
  }
}
