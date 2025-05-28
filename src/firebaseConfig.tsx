import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Import Realtime Database

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVjHMvEj5iy2n1fbDOOwzJdyw5UQmDwD0",
  authDomain: "utmm-e3b67.firebaseapp.com",
  projectId: "utmm-e3b67",
  storageBucket: "utmm-e3b67.appspot.com",
  messagingSenderId: "372047152781",
  appId: "1:372047152781:web:d84d6109cabd212b0504c4",
  measurementId: "G-YSM9ZRV1NW",
  databaseURL: "https://utmm-e3b67-default-rtdb.asia-southeast1.firebasedatabase.app", // Add database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const database = getDatabase(app); // Initialize Realtime Database

export { app, analytics, storage, database };