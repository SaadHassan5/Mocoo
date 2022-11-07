import React from 'react'
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { palette, WP } from '../../config';
import fontFamily from '../../config/fontFamily';

export interface Props {
  password?: any,
  onChange?: any,
  value?: any,
  eye?: any,
  editable?: any,
  placeTxt?: any,
  isEmail?: any,
  keyboardType?: string,
  autoCapitalization?: string,
  onPressIn?: any;
  multi?: any;
  styles?: any;
  // value?:any;
}

export interface State {
  count: 0,
}

const Styles = StyleSheet.create({
  inp: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    borderWidth: 1,
    borderColor: '#B7C1DF',
    borderRadius: WP(4),
    paddingHorizontal: WP(6),
    color:palette.black,
    height:55,
    // width: '100%',
  }
})
export class Input extends React.Component<Props, State> {
  render() {
    return (
      <View>
        {this.props.password ?
          <TextInput autoCapitalize='none' onChangeText={this.props.onChange} secureTextEntry={this.props.eye} textContentType={'password'}  placeholder={this.props.placeTxt} placeholderTextColor={'#B7C1DF'} style={{ ...Styles.inp, ...this?.props?.styles, }} />
          :
          <TextInput multiline={this.props?.multi} autoCapitalize='none' keyboardType={this.props.keyboardType}  onChangeText={this.props.onChange} value={this.props.value} editable={this.props.editable?false:true} placeholder={this.props.placeTxt} placeholderTextColor={'#B7C1DF'} style={{ ...Styles.inp, ...this?.props?.styles,}} />
        }
      </View>
    );
  }
}
