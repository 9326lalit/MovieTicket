// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth,GoogleAuthProvider,signInWithPopup } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyDUIui6ysh8SwH2ErLWJ4b0BZAM7GVe2F0",
    authDomain: "moviezo.firebaseapp.com",
    projectId: "moviezo",
    appId: "1:1061868454338:web:5e7865710eecf1e3a3565b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


// ✅ Export auth and db
export const db = getFirestore(app);
export { googleProvider,signInWithPopup };
