import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDg6gA8pl1MX6TOIKISIFefRev-JSlKPMQ",
  authDomain: "noteballs-a927c.firebaseapp.com",
  projectId: "noteballs-a927c",
  storageBucket: "noteballs-a927c.appspot.com",
  messagingSenderId: "252524287072",
  appId: "1:252524287072:web:a7435a23ab7f1f3aee5f05"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {
  db
}
