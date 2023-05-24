import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'my-book-club-a097a.firebaseapp.com',
  projectId: 'my-book-club-a097a',
  storageBucket: 'my-book-club-a097a.appspot.com',
  messagingSenderId: '250292865021',
  appId: '1:250292865021:web:56386b23105fbe66f03b94',
  measurementId: 'G-7JP80291N0',
};

// Initialize Firebase
initializeApp(firebaseConfig);
