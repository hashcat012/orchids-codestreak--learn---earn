import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCG54FW0Ti1yWB_imhrec6Oz3zl1uwqoaA",
  authDomain: "c0destreak.firebaseapp.com",
  projectId: "c0destreak",
  storageBucket: "c0destreak.firebasestorage.app",
  messagingSenderId: "378259987552",
  appId: "1:378259987552:web:d0b91f0cebfeb78bceb705",
  measurementId: "G-LEPR105MFW"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
