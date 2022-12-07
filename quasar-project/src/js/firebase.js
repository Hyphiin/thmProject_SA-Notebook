import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANLGCMv_jMUgs9k-AXOj3UHKXjhsqzJwo",
  authDomain: "cookit-sa-ws22.firebaseapp.com",
  projectId: "cookit-sa-ws22",
  storageBucket: "cookit-sa-ws22.appspot.com",
  messagingSenderId: "890749892095",
  appId: "1:890749892095:web:b2356fed6003bfbbefe3ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
