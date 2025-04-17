// Import Firebase core and auth
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdd2WGtAPj3COaEFyDXwBaOIcHcFMl1RI",
  authDomain: "inotebook-71a17.firebaseapp.com",
  projectId: "inotebook-71a17",
  storageBucket: "inotebook-71a17.firebasestorage.app",
  messagingSenderId: "64158830136",
  appId: "1:64158830136:web:a1b2dd62348544e67960cd",
  measurementId: "G-0B8TEVK1VM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize Authentication
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Export auth and providers
export { auth, googleProvider, facebookProvider };
