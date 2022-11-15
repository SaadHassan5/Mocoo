import { launchImageLibrary } from "react-native-image-picker";

export async function onBrowse(limit) {
    let data = []
    const options = {
      mediaType: 'photos',
      base64: true,
      selectionLimit: limit,
    }
    await launchImageLibrary(options, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else {
        // let _img = response?.assets[0]?.uri;
        console.log("image---->", response?.assets[0]);
        // return response?.assets[0]
        // setImgs(response?.assets)
        data = response?.assets;
        // toastPrompt("Image Uploaded")
      }
    })
    return data;
  }
