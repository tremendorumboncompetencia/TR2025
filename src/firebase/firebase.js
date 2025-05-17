// src/firebase/firebase.js
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA7_9boQaJQ-IUBhDbL1DQ4zNB0UgweM2g",
  authDomain: "tr2025-7f86e.firebaseapp.com",
  databaseURL: "https://tr2025-7f86e-default-rtdb.firebaseio.com",
  projectId: "tr2025-7f86e",
  //storageBucket: "tr2025-7f86e.firebasestorage.app",
  storageBucket: "tr2025-7f86e.appspot.com",
  messagingSenderId: "1019841114004",
  appId: "1:1019841114004:web:fc925898d09d6d0bd4a981",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);