import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { EmailAuthProvider } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA4KWQayQfLcJxUP3WV6oeETSbzSZU6ht4",
  authDomain: "my-book-club-a097a.firebaseapp.com",
  projectId: "my-book-club-a097a",
  storageBucket: "my-book-club-a097a.appspot.com",
  messagingSenderId: "250292865021",
  appId: "1:250292865021:web:56386b23105fbe66f03b94",
  measurementId: "G-7JP80291N0"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const provider = new EmailAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { provider, auth, storage };
export default db;
