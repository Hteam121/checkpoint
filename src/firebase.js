// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCinhS9yTZ19d8VLJEjnR7ukDS2Bw1_RNc",
  authDomain: "checkpoint-77dd4.firebaseapp.com",
  databaseURL: "https://checkpoint-77dd4-default-rtdb.firebaseio.com",
  projectId: "checkpoint-77dd4",
  storageBucket: "checkpoint-77dd4.appspot.com",
  messagingSenderId: "250629851274",
  appId: "1:250629851274:web:5a52719e4cb5fb424a4573",
  measurementId: "G-TLL6YHS1K4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };