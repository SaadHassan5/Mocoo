import { HP, WP } from '../../assets/config'
import { StyleSheet } from 'react-native'
import { colors } from '../../theme'
import fontFamily from '../../assets/config/fontFamily'
export const styles = StyleSheet.create({
    btnView: {
      backgroundColor: colors.primary, paddingHorizontal: HP(1), paddingVertical: HP(1.2), alignItems: 'center', alignSelf: 'center',
      marginBottom: HP(1),
      width: WP(60)
    },
    btnTxt: { fontFamily: fontFamily.medium, color: "#fff", fontSize: 13 },
    img: {
      width: WP(25),
      height: WP(25),
    },
    paymentWrapper: {
      paddingHorizontal: 20,
      paddingTop: 5
    },
    paymentBox: {
      paddingHorizontal: 20,
      paddingVertical: 35,
      backgroundColor: colors.white,
      borderRadius: 5
    },
  })