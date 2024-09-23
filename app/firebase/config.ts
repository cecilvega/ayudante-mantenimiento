import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache, persistentSingleTabManager } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCm-zFwCHudHp3Cg6_FvaoaAoS0BvbTWwk",
    authDomain: "maintenance-mate-37ba3.firebaseapp.com",
    databaseURL: "https://maintenance-mate-37ba3.firebaseio.com",
    projectId: "maintenance-mate-37ba3",
    storageBucket: "maintenance-mate-37ba3.appspot.com",
    messagingSenderId: "921935745153",
    appId: "1:921935745153:web:133a82d69b054fcbe23d80"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentSingleTabManager({}) }),
})
// enableIndexedDbPersistence(db, { synchronizeTabs: true })
//     .then(() => console.log("Enabled offline persistence"))
//     .catch((error) => {
//       if (error.code == "failed-precondition") {
//         // Multiple tabs open, persistence can only be enabled
//         // in one tab at a a time.
//         // ...
//       } else if (error.code == "unimplemented") {
//         // The current browser does not support all of the
//         // features required to enable persistence
//         // ...
//       }
//     });

export { db };