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
  getDocs,
  addDoc,
  collection,
  doc,
  updateDoc,
  onSnapshot,
  query,
  deleteDoc,
  where,
  orderBy,
  arrayUnion,
  getFirestore,
} from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

import { IEvent } from '@/types/event';

export const saveEvent = async (eventData: IEvent) => {
  console.log(eventData);
  const db = getFirestore();
  const storage = getStorage();

  try {
    const docRef = await addDoc(collection(db, 'events'), eventData);
    const imageRef = ref(storage, `events/${docRef.id}/image`);
    if (eventData.coverUrl) {
      await uploadString(imageRef, eventData.coverUrl, 'data_url').then(
        async () => {
          const downloadURL = await getDownloadURL(imageRef);

          await updateDoc(doc(db, 'events', docRef.id), {
            coverUrl: downloadURL,
          });
        }
      );
    } else {
      console.log('No cover picture provided');
    }

    console.log('Event saved successfully');
    getHostedEvents(eventData.hostId);
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const getHostedEvents = async (uid: string) => {
  try {
    const db = getFirestore();
    const hostedEventsCollection = query(
      collection(db, 'events'),
      where('hostId', '==', uid),
      orderBy('date', 'desc')
    );

    const eventsSnapshot = await getDocs(hostedEventsCollection); // Fetch the documents from the collection

    const eventsData = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      bookTitle: doc.data().bookTitle,
      bookAuthor: doc.data().bookAuthor,
      city: doc.data().city,
      participants: doc.data().participants,
      date: doc.data().date,
      time: doc.data().time,
      coverUrl: doc.data().coverUrl,
      fee: doc.data().fee,
      registrationOpen: doc.data().registrationOpen,
    }));
    return eventsData;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const getAttendedEvents = async (uid: string) => {
  try {
    const db = getFirestore();
    const attendedEventsCollection = query(
      collection(db, 'events'),
      where('participants', 'array-contains', uid),
      orderBy('date', 'desc')
    );

    const eventsSnapshot = await getDocs(attendedEventsCollection); // Fetch the documents from the collection

    const eventsData = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      bookTitle: doc.data().bookTitle,
      bookAuthor: doc.data().bookAuthor,
      city: doc.data().city,
      participants: doc.data().participants,
      date: doc.data().date,
      time: doc.data().time,
      coverUrl: doc.data().coverUrl,
      fee: doc.data().fee,
      registrationOpen: doc.data().registrationOpen,
    }));
    return eventsData;
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};
