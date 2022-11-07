import { Alert, ToastAndroid } from 'react-native';
class alertService {
  toastPrompt = (msg) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(msg, ToastAndroid.SHORT)
    } else {
      // alert(msg);
    }
  }
  show(title, message) {
    Alert.alert(title, message, [
      {
        text: 'OK',
        style: 'destructive'
      }
    ])
  }

  deleteAlert() {
    return new Promise((resolve, reject) => {


      Alert.alert(
        "Delete",
        "Are you sure you want to delete?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK", onPress: () => {
              resolve();
            }
          }
        ]
      );
    })
  }

  confirm(message, okText, cancelText, title) {
    return new Promise((resolve, reject) => {
      Alert.alert(
        title ? title : null,
        message,
        [
          {
            text: cancelText || "Cancel",
            onPress: () => { reject(); },
            style: "cancel",
          },
          { text: okText || "OK", onPress: () => resolve(true) },
        ],
        { cancelable: false }
      );
    });
  }

}
const AlertService = new alertService();
export default AlertService;