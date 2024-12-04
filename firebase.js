// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import {
//   getAuth,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   sendEmailVerification,
//   GoogleAuthProvider,
//   signInWithPopup,
//   onAuthStateChanged,
//   updateProfile,


// } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
// import {getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
// // Firebase configuration
// const firebaseConfig = {
//     apiKey: "AIzaSyC9CsSfwW5OJ0xcQhud7HwFUrnwoMEWUDM",
//     authDomain: "hackathon-ab400.firebaseapp.com",
//     projectId: "hackathon-ab400",
//     storageBucket: "hackathon-ab400.firebasestorage.app",
//     messagingSenderId: "438362367999",
//     appId: "1:438362367999:web:59bac463030fc4655129ca",
//     measurementId: "G-WMPRQH4SGJ"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);



// // Initialize Google Auth Provider
// const googleProvider = new GoogleAuthProvider();


// // Export modules
// export {
//   auth,
//   googleProvider,
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   sendEmailVerification,
//   signInWithPopup,
//   onAuthStateChanged,
//   db,
//   doc,
//   setDoc,
//   getDoc,
//   updateProfile
// };





// Import Firebase
import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js';
import { getFirestore, doc, setDoc, getDoc, updateDoc, deleteDoc, collection, addDoc, getDocs,query ,where} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js';


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9CsSfwW5OJ0xcQhud7HwFUrnwoMEWUDM",
    authDomain: "hackathon-ab400.firebaseapp.com",
    projectId: "hackathon-ab400",
    storageBucket: "hackathon-ab400.firebasestorage.app",
    messagingSenderId: "438362367999",
    appId: "1:438362367999:web:59bac463030fc4655129ca",
    measurementId: "G-WMPRQH4SGJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Authentication instance
const auth = getAuth(app);

// Firebase Firestore instance
const db = getFirestore(app);

// Export Firebase Authentication and Firestore
export { auth, db, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, setDoc, doc, getDoc, updateDoc, deleteDoc, addDoc, collection, getDocs,query,where };


