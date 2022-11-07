import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { palette } from "../assets/config";
import { colors } from "../theme/colors";

export default function AppTextInput({
  icon,
  placeholderText,
  style,
  penIcon,
  value,
  onChange,
  editable,
  keyboard,
  inpStyle,
  multi,numLines,
  ...otherProps
}) {
  return (
    <View style={[styles.container, style,penIcon && {flexDirection:'row',justifyContent:'space-between',alignItems:'center'},icon && {flexDirection:'row',alignItems:'center'}]}>
      {icon && icon}
      <TextInput multiline={multi} numberOfLines={multi?numLines:1} textAlignVertical={multi?'top':'center'} editable={editable} style={{color:'black',...inpStyle}} placeholderTextColor={palette.labelGray} keyboardType={keyboard} value={value} onChangeText={onChange} placeholder={placeholderText} {...otherProps} />
      {penIcon && penIcon}
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.light,
    padding: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.light2,
    marginBottom: 15,
  },
});
