import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzVD2V3GIujMs_a9zA8dh6tTf6DjjjMp8",
  authDomain: "habitbuilder-9ffbc.firebaseapp.com",
  projectId: "habitbuilder-9ffbc",
  storageBucket: "habitbuilder-9ffbc.appspot.com",
  messagingSenderId: "834243892756",
  appId: "1:834243892756:web:727552d8829ac33d1f3901",
  measurementId: "G-33P7ZFLQNJ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// can be optimised to only include the dependencies we need
// https://firebase.google.com/docs/auth/web/custom-dependencies
const auth = getAuth();
const provider = new GoogleAuthProvider();

export { db, auth, provider };
