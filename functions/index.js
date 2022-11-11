const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const getData = (collection, doc) => {
    return db
        .collection(collection)
        .doc(doc)
        .get()
        .then(function (doc) {
            if (doc.exists) {
                return doc.data();
            } else {
                return false;
            }
        });
};
async function deleteData(collection, doc, ) {
    await  db
      .collection(collection)
      .doc(doc)
      .delete()
      .then(() => {
        console.log('Data deleted!');
      });
  }
const getAllData = async (collection) => {
    try {
        const ref = db.collection(collection);
        const querySnapshot = await ref?.get();
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
            data?.push(documentSnapshot.data());
        });
        return data;
    } catch (error) {
        throw new Error(SERVICES._returnError(error));
    }
};
const filterCollections = async (collection, key, op, value) => {
    try {
        const ref = db.collection(collection);
        const querySnapshot = await ref?.where(key, op, value).get();
        const data = [];
        querySnapshot.forEach(documentSnapshot => {
            data?.push(documentSnapshot.data());
        });
        return data;
    } catch (error) {
        throw new Error(SERVICES._returnError(error));
    }
};
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() *
        charactersLength));
    }
    return result;
  }
async function saveData(collection, doc, jsonObject, merge = true) {
    await db
        .collection(collection)
        .doc(doc)
        .set(jsonObject, { merge: merge })
        .catch(function (error) {
            console.error('Error writing document: ', error);
        });
}
exports.sendChatMsgNotification = functions.firestore
    .document('GroupChats/{cid}/messages/{mid}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            console.log("After", after);
            console.log("Before", before);
            let ownerAlbum = await getData('GroupMembers', after?.chatId);
            let p=ownerAlbum?.members?[...ownerAlbum?.members]:[]
            let allUsers = await filterCollections('Login', 'email', 'in', p?.length > 0 ? p : ['h1000@gmail.com'],)
            console.log('members',ownerAlbum,p,"All",allUsers,);
            const payload = {
                notification: {
                    title: `${after?.name} Sent a message`,
                    body: `${after?.msg}`,
                    sound: 'default',
                },
                data: after?.chatData,
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24,
            };
            allUsers?.map(i => {
                if (i?.token  && after?.email!=i?.email) {
                    admin
                        .messaging()
                        .sendToDevice(i?.token, payload, options)
                        .then(reponse => {
                            console.log('Send Chat Notification ');
                        });
                }
            })
        } catch (error) {
            console.log('error in Chat Notification', error);
        }
    });
    exports.sendIndividualChatMsgNotification = functions.firestore
    .document('IndividualChat/{cid}/messages/{mid}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            console.log("After", after);
            console.log("Before", before);
            let allUsers = await getData('Login',after?.reciever)
            const payload = {
                notification: {
                    title: `${after?.name} Sent a message`,
                    body: `${after?.msg}`,
                    sound: 'default',
                },
                data: after?.chatData,
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24,
            };
                if (allUsers?.token ) {
                    admin
                        .messaging()
                        .sendToDevice(allUsers?.token, payload, options)
                        .then(reponse => {
                            console.log('Send individual Chat Notification ');
                        });
                }
        } catch (error) {
            console.log('error in individual Chat Notification', error);
        }
    });
    exports.sendCommmunityChatMsgNotification = functions.firestore
    .document('CommunityChats/{cid}/messages/{mid}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            console.log("After", after);
            console.log("Before", before);
            let ownerAlbum = await getData('CommunityMembers', after?.chatId);
            let p=ownerAlbum?.members?[...ownerAlbum?.members]:[]
            let allUsers = await filterCollections('Login', 'email', 'in', p?.length > 0 ? p : ['h1000@gmail.com'],)
            console.log('members',ownerAlbum,p,"All",allUsers,);
            const payload = {
                notification: {
                    title: `${after?.name} Sent a message`,
                    body: `${after?.msg}`,
                    sound: 'default',
                },
                data: after?.chatData,
            };
            const options = {
                priority: 'high',
                timeToLive: 60 * 60 * 24,
            };
            allUsers?.map(i => {
                if (i?.token && after?.email!=i?.email) {
                    admin
                        .messaging()
                        .sendToDevice(i?.token, payload, options)
                        .then(reponse => {
                            console.log('Send CommunityMembers Notification ');
                        });
                }
            })
        } catch (error) {
            console.log('error in CommunityMembers Notification', error);
        }
    });