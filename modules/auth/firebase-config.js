// Firebase Configuration
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth, GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyC8b4j5eW58Pl0Sw1y8-uCjhF9zP3RcWRU",
    authDomain: "syntaxerror-challenges.firebaseapp.com",
    projectId: "project-624915597751",
    storageBucket: "project-624915597751.appspot.com",
    messagingSenderId: "624915597751",
    appId: "1:624915597751:web:716d738d430798b08a8032",
    measurementId: "G-4DGVXYP6VP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth Providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Export instances
export { analytics, app, auth, db, githubProvider, googleProvider };

