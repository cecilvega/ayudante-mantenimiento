import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBH5VGe8Urirozo5EYdUuzjBC6UtaweEaI",
    authDomain: "ayudante-mantenimiento.firebaseapp.com",
    databaseURL: "https://ayudante-mantenimiento.firebaseio.com",
    projectId: "ayudante-mantenimiento",
    storageBucket: "ayudante-mantenimiento.appspot.com",
    messagingSenderId: "951868294353",
    appId: "1:951868294353:web:af69e2c183438359b8b1f0"
};

let app;
let db;
let auth;

if (typeof window !== 'undefined' && !getApps().length) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
}

export { db, auth };