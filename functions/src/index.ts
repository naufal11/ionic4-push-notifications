import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp();

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.newSubscriberNotification = functions.firestore
    .document('documents/{userId}')
    .onCreate(async (snap, context) => {
        // const data = event.after.data();
    
        const userId = snap.data().approverId;
        console.log(userId);
        const doc = snap.data().docId;
        console.log(doc);
        const docName = snap.data().docName;
        console.log(docName);

        // Notification details.
        const payload = {
            notification: {
            title: 'New notifications!',
            body: `${doc}, ${docName} has been approved.`
            }
        };

        // ref to the device collection for the user
        const db = admin.firestore();
        const devicesRef = db.collection('devices').where('userId', '==', userId);

        // get the user's tokens and send notifications
        const devices = await devicesRef.get();

        const tokens = [];

        // send a notification to each device token
        devices.forEach(result => {
        const token = result.data().token;

        tokens.push(token);
        })

        return admin.messaging().sendToDevice(tokens, payload);
    });