
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studentsync-x1idn",
  "appId": "1:629081269732:web:f2c3b8f5e6bfacb483d3f1",
  "storageBucket": "studentsync-x1idn.firebasestorage.app",
  "apiKey": "AIzaSyBu9TjIOlNi07xsZgh-H4Y8-wgPmcOFDYM",
  "authDomain": "studentsync-x1idn.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "629081269732"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
