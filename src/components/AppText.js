import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { presets } from './text.preset'

export default function AppText({ children, preset = "default", style ,otherProps}) {
  const textStyle = StyleSheet.compose(presets[preset], style)
  return <Text style={textStyle} {...otherProps} >{children}</Text>
}