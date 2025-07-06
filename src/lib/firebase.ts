import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMV7I34Gk_VCQ9LREEP4NW0EbtfBmISUk",
  authDomain: "kingdom-business-studio.firebaseapp.com",
  projectId: "kingdom-business-studio",
  storageBucket: "kingdom-business-studio.firebasestorage.app",
  messagingSenderId: "724422379635",
  appId: "1:724422379635:web:8b61cbabcd50fb65120206"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app; 