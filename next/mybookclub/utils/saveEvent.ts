import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { toast } from 'react-toastify';
import {
  getDownloadURL,
  ref,
  uploadString,
  deleteObject,
} from '@firebase/storage';

import emailjs from '@emailjs/browser';

import {
  getDoc,
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  deleteDoc,
  where,
  arrayUnion,
  getFirestore,
} from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

import { IEvent } from '@/types/event';

export const saveEvent = async (eventData: IEvent) => {
  const db = getFirestore();
  const storage = getStorage();

  const docRef = await addDoc(collection(db, 'events'), eventData);

  const imageRef = ref(storage, `events/${docRef.id}/image`);

  if (eventData.coverUrl !== '') {
    await uploadString(imageRef, eventData.coverUrl, 'data_url').then(
      async () => {
        //👇🏻 Gets the image URL
        const downloadURL = await getDownloadURL(imageRef);
        //👇🏻 Updates the docRef, by adding the logo URL to the document
        await updateDoc(doc(db, 'events', docRef.id), {
          image_url: downloadURL,
        });
      }
    );
  } else {
    console.log('good');
  }
};
