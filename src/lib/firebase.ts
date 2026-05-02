
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studentsync-x1idn",
  "appId": "1:629081269732:web:f2c3b8f5e6bfacb483d3f1",
  "storageBucket": "studentsync-x1idn.firebasestorage.app",
  "apiKey": "AIzaSyBrZulfd7h7dUu2nzXBM0QsCsVbGqnMUU4",
  "authDomain": "studentsync-x1idn.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "629081269732"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
