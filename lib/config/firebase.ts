import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
  Firestore,
  getFirestore,
  enableNetwork,
  disableNetwork,
} from "firebase/firestore";
import {
  getAuth,
  Auth,
  initializeAuth,
  indexedDBLocalPersistence,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBH5VGe8Urirozo5EYdUuzjBC6UtaweEaI",
  authDomain: "ayudante-mantenimiento.firebaseapp.com",
  projectId: "ayudante-mantenimiento",
  storageBucket: "ayudante-mantenimiento.appspot.com",
  messagingSenderId: "951868294353",
  appId: "1:951868294353:web:af69e2c183438359b8b1f0",
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage; // Add this line

if (typeof window !== "undefined") {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);

    db = initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentSingleTabManager({
          forceOwnership: true,
        }),
      }),
    });

    auth = initializeAuth(app, {
      persistence: [indexedDBLocalPersistence, browserLocalPersistence],
    });

    storage = getStorage(app); // Add this line

    setPersistence(auth, browserLocalPersistence);

    // Handle network state changes with navigation preservation
    window.addEventListener("online", async () => {
      try {
        await enableNetwork(db);
        // Instead of reloading immediately, wait a bit and check if we're still online
        setTimeout(() => {
          if (navigator.onLine) {
            // Reload only specific assets instead of full page
            const reload = async () => {
              const currentPath = window.location.pathname;
              window.location.href = currentPath;
            };
            reload();
          }
        }, 2000);
      } catch (error) {
        console.error("Error enabling network:", error);
      }
    });

    window.addEventListener("offline", async () => {
      try {
        await disableNetwork(db);
      } catch (error) {
        console.error("Error disabling network:", error);
      }
    });
  } else {
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  }
} else {
  app = getApps()[0] || initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
}

export const networkControls = {
  enableNetwork: () => enableNetwork(db),
  disableNetwork: () => disableNetwork(db),
};

export { db, auth, storage };
