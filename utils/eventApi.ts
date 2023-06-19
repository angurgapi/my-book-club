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
  Timestamp,
} from '@firebase/firestore';
import { getStorage } from 'firebase/storage';

import { IEvent, IEventFormData } from '@/types/event';
import dayjs from 'dayjs';

const addEventCover = async (picUrl: string, eventId: string) => {
  const storage = getStorage();
  const imageRef = ref(storage, `events/${eventId}/image`);
  await uploadString(imageRef, picUrl, 'data_url').then(async () => {
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  });
};
export const saveEvent = async (eventData: IEventFormData) => {
  // eventData.date = Timestamp.fromMillis(eventData.date.valueOf()),
  const db = getFirestore();

  try {
    const docRef = await addDoc(collection(db, 'events'), {
      ...eventData,
      date: Timestamp.fromMillis(eventData.date.valueOf()),
    });

    if (eventData.coverUrl) {
      const downloadURL = await addEventCover(eventData.coverUrl, docRef.id);
      await updateDoc(doc(db, 'events', docRef.id), {
        coverUrl: downloadURL,
      });
    } else {
      console.log('No cover picture provided');
    }

    console.log('Event saved successfully');
    // getHostedEvents(eventData.hostId);
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const updateEvent = async (id: string, eventData: IEventFormData) => {
  const db = getFirestore();
  const docRef = doc(db, 'events', id);
  try {
    if (eventData.coverUrl) {
      const downloadURL = await addEventCover(eventData.coverUrl, id);
      await updateDoc(doc(db, 'events', docRef.id), {
        coverUrl: downloadURL,
      });
    } else {
      console.log(eventData);
    }
    await updateDoc(docRef, {
      ...eventData,
      date: Timestamp.fromMillis(eventData.date.valueOf()),
    });
  } catch (e) {
    console.log(e);
  }
};

export const getEventById = async (id: string): Promise<IEvent | undefined> => {
  const db = getFirestore();
  const docRef = doc(db, 'events', id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const event = {
      ...docSnap.data(),
      date: docSnap.data().date.toMillis(),
    } as IEvent;
    event.id = docSnap.id;
    console.log(typeof event.date);
    // return {
    //   ...event,
    //   date: event.date.toMillis(),
    // };
    return event;
  } else {
    console.log('No such document!');
  }
};

export const getHostedEvents = async (uid: string) => {
  try {
    const db = getFirestore();
    const hostedEventsCollection = query(
      collection(db, 'events'),
      where('hostId', '==', uid),
      where('date', '>', Timestamp.now()),
      orderBy('date', 'desc')
    );

    const eventsSnapshot = await getDocs(hostedEventsCollection);

    const eventsData = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
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
      where('date', '>', Timestamp.now()),
      orderBy('date', 'desc')
    );

    const eventsSnapshot = await getDocs(attendedEventsCollection);

    const eventsData = eventsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return eventsData as IEvent[];
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const getUpcomingEvents = async (
  queryString: string
): Promise<IEvent[]> => {
  const db = getFirestore();
  let eventsCollectionQuery = query(
    collection(db, 'events'),
    where('date', '>', Timestamp.now()),
    orderBy('date', 'asc')
  );

  if (queryString.length > 0) {
    eventsCollectionQuery = query(
      collection(db, 'events'),
      where('date', '>', Timestamp.now()),
      where('city', '==', queryString),
      orderBy('date', 'asc')
    );
  }
  try {
    const querySnapshot = await getDocs(eventsCollectionQuery);
    const events: IEvent[] = [];

    querySnapshot.forEach((doc) => {
      const eventData = { id: doc.id, ...doc.data() } as IEvent;
      events.push(eventData);
    });

    return events;
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const toggleAttendee = async (
  uid: string,
  attendees: string[],
  eventId: string
) => {
  const db = getFirestore();
  const docRef = doc(db, 'events', eventId);
  const newAttendeesList = attendees.includes(uid)
    ? attendees.filter((attendee) => attendee !== uid)
    : [...attendees, uid];
  try {
    await updateDoc(docRef, {
      participants: newAttendeesList,
    });
  } catch (e) {
    console.log(e);
  }
};

export const getEventHost = async (uid: string) => {
  const db = getFirestore();
  const hostRef = doc(db, 'users', uid);
  try {
    const hostData = await getDoc(hostRef);
    return hostData.data();
  } catch (e) {
    console.log(e);
  }
};
