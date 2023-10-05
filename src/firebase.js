import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyCc65IWTTF2CpjOGLk2GbYDoz4KFg7bnBg",
  authDomain: "linkedin-clone-7d4eb.firebaseapp.com",
  projectId: "linkedin-clone-7d4eb",
  storageBucket: "linkedin-clone-7d4eb.appspot.com",
  messagingSenderId: "814109911373",
  appId: "1:814109911373:web:6df6a25b422daeb044af04",
  measurementId: "G-8HKXKXBN59",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);

export { auth, provider, storage };
export default db;
