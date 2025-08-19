// Firebase initialization for Google Login
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyCFQL607xMZ15YZeTZ6jTfVUB1Y1D7X7Uk",
  authDomain: "novacells-469509.firebaseapp.com",
  projectId: "novacells-469509",
  storageBucket: "novacells-469509.firebasestorage.app",
  messagingSenderId: "235801636213",
  appId: "1:235801636213:web:ed1cb4b023e7e84727373c",
  measurementId: "G-1WES90HYC6"
  // Optional: add databaseURL if you use a regional RTDB instance
  // databaseURL: "https://novacells-469509-default-rtdb.firebaseio.com"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics (only if supported/browsers)
if (typeof window !== 'undefined') {
  isSupported().then((ok) => { if (ok) getAnalytics(app); }).catch(()=>{});
}

// Realtime Database
export const db = getDatabase(app);

// Auth + Google Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup, onAuthStateChanged, signOut };
