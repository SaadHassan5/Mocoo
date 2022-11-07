import React from 'react';
import {StyleSheet} from 'react-native';
import { HP, palette, WP } from '../assets/config';
import fontFamily from '../assets/config/fontFamily';

export const GlobalStyles=StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
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
      card: {
          backgroundColor: "#fff",
          paddingHorizontal: WP(5),
          paddingVertical: HP(1)
      },
      row:{
          flexDirection:"row",
          alignItems:"center"
      },
      boldTxt:{
        fontFamily:fontFamily.bold,fontSize:18,color:palette.blackGray
      }
})