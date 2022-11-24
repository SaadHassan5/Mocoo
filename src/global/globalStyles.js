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
        fontFamily:fontFamily.bold,fontSize:16,color:palette.blackGray
      },
      mediumTxt:{
        fontFamily:fontFamily.medium,fontSize:14,color:palette.blackGray
      },
      lightTxt:{
        fontFamily:fontFamily.light,fontSize:14,color:palette.blackGray
      },
      urlTxt:{
        fontFamily:fontFamily.light,fontSize:14,color:palette.white,textDecorationLine:'underline'
      },
      btnView:{
        paddingVertical:HP(1),width:WP(40)
      }
})