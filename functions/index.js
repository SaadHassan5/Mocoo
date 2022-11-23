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
async function deleteData(collection, doc,) {
    await db
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
////////////Chats
exports.sendChatMsgNotification = functions.firestore
    .document('GroupChats/{cid}/messages/{mid}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            console.log("After", after);
            console.log("Before", before);
            let ownerAlbum = await getData('GroupMembers', after?.chatId);
            let p = ownerAlbum?.members ? [...ownerAlbum?.members] : []
            let allUsers = await filterCollections('Login', 'email', 'in', p?.length > 0 ? p : ['h1000@gmail.com'],)
            console.log('members', ownerAlbum, p, "All", allUsers,);
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
                if (i?.token && after?.email != i?.email) {
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
            let allUsers = await getData('Login', after?.reciever)
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
            if (allUsers?.token) {
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
            let p = ownerAlbum?.members ? [...ownerAlbum?.members] : []
            let allUsers = await filterCollections('Login', 'email', 'in', p?.length > 0 ? p : ['h1000@gmail.com'],)
            console.log('members', ownerAlbum, p, "All", allUsers,);
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
                if (i?.token && after?.email != i?.email) {
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

///////////////////////
exports.sendNewPostNotification = functions.firestore
    .document('Posts/{id}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            let docId = context.params.id;
            console.log("After", after);
            console.log("Before", before);
            if (!before) {
                let group = await getData('GroupMembers', after?.groupId);
                let p = group?.members.map(x => x);
                console.log('Members',p);
                const allUsers = await filterCollections("Login",'email','in',p?.length>0?p:['anc']);
                const payload = {
                    notification: {
                        title: `${after?.userDetails?.name} added new Post`,
                        body: `${after?.type}`,
                        sound: 'default',
                    },
                    data:{screen:'newPost',groupId:after?.groupId,postId:after?.postId}
                };
                const options = {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24,
                };
                allUsers?.map(i => {
                    if (i?.token) {
                        admin
                            .messaging()
                            .sendToDevice(i?.token, payload, options)
                            .then(reponse => {
                                console.log('Send Post Notification to Everybody ');
                            });
                    }
                })
            }
        } catch (error) {
            console.log('error in Post Notification', error);
        }
    });
    exports.sendNewPostNotificationFriendsPosts = functions.firestore
    .document('FriendsPosts/{id}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            let docId = context.params.id;
            console.log("After", after);
            console.log("Before", before);
            if (!before) {
                let group = await getData('Users', after?.email);
                let p = group?.history.map(x => x);
                console.log('Members',p);
                const allUsers = await filterCollections("Login",'email','in',p?.length>0?[...p,after?.email]:[after?.email]);
                const payload = {
                    notification: {
                        title: `${after?.userDetails?.name} added new Post`,
                        body: `${after?.type}`,
                        sound: 'default',
                    },
                    data:{screen:'newFriendPost',postId:after?.postId}
                };
                const options = {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24,
                };
                allUsers?.map(i => {
                    if (i?.token) {
                        admin
                            .messaging()
                            .sendToDevice(i?.token, payload, options)
                            .then(reponse => {
                                console.log('Send Post Notification to Everybody ');
                            });
                    }
                })
            }
        } catch (error) {
            console.log('error in Post Notification', error);
        }
    });
    exports.sendNewCommentNotification = functions.firestore
    .document('Comments/{id}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            let docId = context.params.id;
            console.log("After", after);
            console.log("Before", before);
            if (!before) {
                let group = await getData('GroupMembers', after?.groupId);
                let p = group?.members.map(x => x);
                const allUsers = await filterCollections("Login",'email','in',p?.length>0?p:['anc']);
                const payload = {
                    notification: {
                        title: `${after?.text}`,
                        body: `${after?.name} added new comment`,
                        sound: 'default',
                    },
                    data:{screen:'newComment',groupId:after?.groupId,postId:after?.postId}
                };
                const options = {
                    priority: 'high',
                    timeToLive: 60 * 60 * 24,
                };
                allUsers?.map(i => {
                    if (i?.token) {
                        admin
                            .messaging()
                            .sendToDevice(i?.token, payload, options)
                            .then(reponse => {
                                console.log('Send Comment Notification to Everybody ');
                            });
                    }
                })
            }
        } catch (error) {
            console.log('error in Comment Notification', error);
        }
    })

    //////////Delete
    exports.scheduledFunctionDelOntheGo = functions.pubsub.schedule('every 5 minutes').onRun(async(context) => {
        const res=await filterCollections('Posts','type','==','On The Go')
      console.log('reeeees',res);
      for (let index = 0; index < res?.length; index++){
        let da=new Date(res[index]?.time);
        if(da?.setHours(da?.getHours()+3)<new Date()?.getTime()){
          console.log('Valid for delete',res[index]);
          await deleteData('Posts',res[index]?.postId)
        }
        else{
          console.log('Not valid',da?.setHours(da?.getHours()+3),'===>',new Date().getTime());
        }
      }
      });
      exports.scheduledFunctionDelOntheGoFriendsPosts = functions.pubsub.schedule('every 5 minutes').onRun(async(context) => {
        const res=await filterCollections('FriendsPosts','type','==','On The Go')
      console.log('reeeees',res);
      for (let index = 0; index < res?.length; index++){
        let da=new Date(res[index]?.time);
        if(da?.setHours(da?.getHours()+3)<new Date()?.getTime()){
          console.log('Valid for delete',res[index]);
          await deleteData('Posts',res[index]?.postId)
        }
        else{
          console.log('Not valid',da?.setHours(da?.getHours()+3),'===>',new Date().getTime());
        }
      }
      });
    ////////////// friend
    exports.sendNewFrendNotification = functions.firestore
    .document('Users/{id}')
    .onWrite(async (change, context) => {
        try {
            let after = change.after.data();
            let before = change.before.data();
            let docId = context.params.id;
            console.log("After", after);
            console.log("Before", before);
            if (after?.history?.length>before?.history?.length) {
                    let group = await getData('Users', after?.email);
                    const allUsers = await getData('Login', group?.history[group?.history?.length-1]?.email);
                    const payload = {
                        notification: {
                            title: `${after?.name} added you as a Friend`,
                            body: `New Friend`,
                            sound: 'default',
                        },
                        data:{screen:'newFriend',email:after?.email}
                    };
                    const options = {
                        priority: 'high',
                        timeToLive: 60 * 60 * 24,
                    };
                        if (allUsers?.token) {
                            admin
                                .messaging()
                                .sendToDevice(allUsers?.token, payload, options)
                                .then(reponse => {
                                    console.log('Send new friend to Everybody ');
                                });
                        }
            }
        } catch (error) {
            console.log('error in new friend  Notification', error);
        }
    })
