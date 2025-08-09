import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOMfh8t4DK8Wsx9ZoOLDWMEO9kJ2F9a4c",
  authDomain: "react-todo-db-d2093.firebaseapp.com",
  projectId: "react-todo-db-d2093",
  storageBucket: "react-todo-db-d2093.firebasestorage.app",
  messagingSenderId: "275532551494",
  appId: "1:275532551494:web:3b8119a55d35f861354147"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
