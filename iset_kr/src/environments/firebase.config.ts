// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging } from "firebase/messaging";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyANJ5t03u4KCY1KfcfVDgGmy_IsPYp87zs",
    authDomain: "iset-kr.firebaseapp.com",
    projectId: "iset-kr",
    storageBucket: "iset-kr.firebasestorage.app",
    messagingSenderId: "527521339384",
    appId: "1:527521339384:web:014218d9262328d4a4e80d",
    measurementId: "G-5PK0ZFBLGE"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Messaging (optional, for push notifications)
let messaging: any = null;
if (typeof window !== 'undefined' && 'Notification' in window) {
    try {
        messaging = getMessaging(app);
    } catch (error) {
        console.warn('Firebase Messaging not available:', error);
    }
}
export { messaging };
