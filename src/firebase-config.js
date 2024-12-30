// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGu4MDQLYavr4xbpMGiTQL3hKViLBjqw8",
  authDomain: "alquilerautos-83750.firebaseapp.com",
  projectId: "alquilerautos-83750",
  storageBucket: "alquilerautos-83750.firebasestorage.app",
  messagingSenderId: "244113930427",
  appId: "1:244113930427:web:b2b8f816a789fcdbd9919e",
  measurementId: "G-VCC1LLT4J0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firestore = getFirestore(app);
