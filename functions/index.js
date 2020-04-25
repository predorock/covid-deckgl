const functions = require('firebase-functions');
const axios = require('axios');
const admin = require('firebase-admin');
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const db = admin.firestore();

const dataUrl = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-province.json';
const step = 100;

function chunk(array, size) {
    const chunked_arr = [];
    let copied = [...array]; // ES6 destructuring
    const numOfChild = Math.ceil(copied.length / size); // Round up to the nearest integer
    for (let i = 0; i < numOfChild; i++) {
        chunked_arr.push(copied.splice(0, size));
    }
    return chunked_arr;
}

async function writeChunk(array, chunkIndex) {
    let batch = db.batch();
    console.log(array);
    for (let j = 0; j < array.length; j++) {
        const documentPath = `doc_${chunkIndex}x${j}`;
        const ref = db.collection("province").doc(documentPath);
        batch.set(ref, array[j],{merge: true});
    }
    return batch.commit();
}


exports.updateData = functions.pubsub.topic('update-data-cron').onPublish(async (message) => {
    let req;
    try {
        req = await axios.get(dataUrl);
    } catch (e) {
        return Promise.error(e);
    }

    const chunks = chunk(req.data, step);

    // const promises = chunks.map((chunk,i) => new Promise((res, rej) => writeChunk(chunk,i).then(res, rej)));

    return chunks.reduce( async (acc, chunk, i) => {
        await acc;
        return writeChunk(chunk,i);
    }, Promise.resolve());
});
