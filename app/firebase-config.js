// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCm-zFwCHudHp3Cg6_FvaoaAoS0BvbTWwk",
    authDomain: "maintenance-mate-37ba3.firebaseapp.com",
    databaseURL: "https://maintenance-mate-37ba3.firebaseio.com",
    projectId: "maintenance-mate-37ba3",
    storageBucket: "maintenance-mate-37ba3.appspot.com",
    messagingSenderId: "921935745153",
    appId: "1:921935745153:web:133a82d69b054fcbe23d80"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore
const db = firebase.firestore();

// Enable offline persistence using the new method
db.settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
});

db.enablePersistence({synchronizeTabs: true})
    .catch((err) => {
        if (err.code == 'failed-precondition') {
            // Multiple tabs open, persistence can only be enabled in one tab at a time.
            console.log('Persistence failed to enable: Multiple tabs open');
        } else if (err.code == 'unimplemented') {
            // The current browser does not support all of the
            // features required to enable persistence
            console.log('Persistence is not available in this browser');
        }
    });

export {db};


//
// // Import the functions you need from the SDKs you need
// import {initializeApp} from "firebase/app";
// // "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
// import {
//     getFirestore,
//     enableIndexedDbPersistence
// } from "firebase/firestore";
// // "https://www.gstatic.com/firebasejs/10.12.3/firebase-firestore.js";
//
// // Your web app's Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyCm-zFwCHudHp3Cg6_FvaoaAoS0BvbTWwk",
//     authDomain: "maintenance-mate-37ba3.firebaseapp.com",
//     databaseURL: "https://maintenance-mate-37ba3.firebaseio.com",
//     projectId: "maintenance-mate-37ba3",
//     storageBucket: "maintenance-mate-37ba3.appspot.com",
//     messagingSenderId: "921935745153",
//     appId: "1:921935745153:web:133a82d69b054fcbe23d80"
// };
//
// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
//
// // Initialize Firestore
// const db = getFirestore(app);
//
// // Enable offline persistence
// enableIndexedDbPersistence(db)
//     .catch((err) => {
//         if (err.code == 'failed-precondition') {
//             // Multiple tabs open, persistence can only be enabled in one tab at a time.
//             console.log('Persistence failed to enable: Multiple tabs open');
//         } else if (err.code == 'unimplemented') {
//             // The current browser does not support all of the
//             // features required to enable persistence
//             console.log('Persistence is not available in this browser');
//         }
//     });
//
// export {db};
