import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

export const db=firestore();
export async function getAllOfCollection(collection: any) {
  let data: any[] = [];
  let querySnapshot = await firestore().collection(collection).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      data.push({ ...doc?.data(), id: doc?.ref?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export async function getAllOfNestedCollection(collection: any,doc,collection1) {
  let data: any[] = [];
  let querySnapshot = await firestore().collection(collection).doc(doc).collection(collection1).get();
  querySnapshot.forEach(function (doc) {
    if (doc.exists) {
      // console.log("DOCCC",{...doc?.data(),id:doc?.ref?.id});
      // let n={...doc?.data(),id:doc?.ref?.id}
      data.push({ ...doc?.data(), id: doc?.ref?.id });
    } else {
      console.log('No document found!');
    }
  });
  return data;
}
export async function filterCollectionDouble(collection: any,key,op,value,key1,op1,value1) {
  try {
    let data: any[] = [];
    let querySnapshot = await firestore().collection(collection).where(key,op,value).where(key1,op1,value1).get();
    querySnapshot.forEach(function (doc) {
        data.push({ ...doc?.data(), id: doc?.ref?.id });
    });
    console.log('querySnapshot:',data);
    
    return data;
  } catch (error) {
    throw new Error(error);
  }
 
}
export async function filterCollectionTriple(collection: any,key,op,value,key1,op1,value1,key2,op2,value2) {
  try {
    let data: any[] = [];
    let querySnapshot = await firestore().collection(collection).where(`${key}`,op,value).where(`${key1}`,op1,value1).where(`${key2}`,op2,value2).get();
    querySnapshot.forEach(function (doc) {
        data.push({ ...doc?.data(), id: doc?.ref?.id });
    });
    console.log('querySnapshot:',data);
    
    return data;
  } catch (error) {
    throw new Error(error);
  }
 
}
export async function filterCollectionSingle(collection: any,key,op,value) {
  try {
    let data: any[] = [];
    let querySnapshot = await firestore().collection(collection).where(`${key}`,op,value).get();
    querySnapshot.forEach(function (doc) {
        data.push({ ...doc?.data(), id: doc?.ref?.id });
    });
    console.log('querySnapshot:',data);
    
    return data;
  } catch (error) {
    throw new Error(error);
  }
 
}
export async function deleteData(collection: any, doc: any, ) {
  let res;
  await  firestore()
    .collection(collection)
    .doc(doc)
    .delete()
    .then(() => {
      res=true
      console.log('Data deleted!');
    }).catch((err)=>{
      res=false;
    })
    return res;
}
export async function nestedDeleteData(collection: any, doc: any,col1:any,doc1 ) {
  let res;
  await  firestore()
    .collection(collection)
    .doc(doc)?.collection(col1)?.doc(doc1)
    .delete()
    .then(() => {
      res=true
      console.log('Data deleted!');
    }).catch((err)=>{
      res=false;
    })
    return res;
}
export function getData(collection: any, doc: any, objectKey?: any) {
  if (!objectKey) {
    return firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log(doc);

          return doc.data();
        } else {
          return false;
        }
      });
  } else {
    return firestore()
      .collection(collection)
      .doc(doc)
      .get()
      .then((doc: any) => {
        if (doc.exists && doc.data()[objectKey] != undefined) {
          return doc.data()[objectKey];
        } else {
          return false;
        }
      });
  }
}
export async function saveData(collection: any, doc: any, jsonObject: any,merge=true) {
  await firestore()
    .collection(collection)
    .doc(doc)
    .set(jsonObject, { merge: merge })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
  //console.log("Document successfully written!");
}
export async function saveNestedData(collection: any, doc: any,collection1, jsonObject: any) {
  await firestore()
    .collection(collection)
    .doc(doc).collection(collection1).doc()
    .set(jsonObject, { merge: true })
    .catch(function (error) {
      console.error('Error writing document: ', error);
    });
  //console.log("Document successfully written!");
}
export async function uploadFile(file, fileName?,doc) {
console.log("UPLOAAAAAAAAAD");

  return new Promise(async (resolve, reject) => {
    const now = new Date().getTime();
    if (fileName) {
      var storageRef = await storage()
        .ref()
        .child(`${doc}/${fileName}`);
    }
    else {
      var storageRef = await storage()
        .ref(now.toString());
    }
    storageRef.putFile(file).then(async (snapshot) => {
      // resolve(snapshot.ref.getDownloadURL());
      let url = await storage().ref(`${snapshot.metadata.fullPath}`).getDownloadURL();
      console.log('this is upload photo ', url)
      resolve(url);

    })
  })
}
