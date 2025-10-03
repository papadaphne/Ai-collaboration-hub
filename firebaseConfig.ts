// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBBW6NGBl-F9oY_Qi6WEwj3A_1IQnOviuw",
  authDomain: "ai-collaboration-hub.firebaseapp.com",
  projectId: "ai-collaboration-hub",
  storageBucket: "ai-collaboration-hub.appspot.com",
  messagingSenderId: "619229661319",
  appId: "1:619229661319:web:eae5ce474649896e7e9022",
  measurementId: "G-9V0RJHQTSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const analytics = getAnalytics(app);
