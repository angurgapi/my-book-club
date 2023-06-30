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

const addEventCover = async (picUrl: string, eventId: string) => {
  const storage = getStorage();
  const imageRef = ref(storage, `events/${eventId}/image`);
  try {
    await uploadString(imageRef, picUrl, 'data_url');
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error adding event cover:', error);
    throw error;
  }
};

export const saveEvent = async (eventData: IEventFormData) => {
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
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

export const updateEvent = async (id: string, eventData: IEventFormData) => {
  const db = getFirestore();
  const docRef = doc(db, 'events', id);
  const newImgRegex = /^data:/;
  try {
    if (eventData.coverUrl && newImgRegex.test(eventData.coverUrl)) {
      console.log('new image, blob!');
      const downloadURL = await addEventCover(eventData.coverUrl, id);
      await updateDoc(doc(db, 'events', docRef.id), {
        ...eventData,
        date: Timestamp.fromMillis(eventData.date.valueOf()),
        coverUrl: downloadURL,
      });
    } else if (eventData.coverUrl && eventData.coverUrl.length) {
      console.log('data has image, but its an old url!');
      await updateDoc(docRef, {
        ...eventData,
        date: Timestamp.fromMillis(eventData.date.valueOf()),
      });
    } else {
      await updateDoc(docRef, {
        ...eventData,
        date: Timestamp.fromMillis(eventData.date.valueOf()),
        coverUrl: '',
      });
    }
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
      date: doc.data().date.toMillis(),
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
      date: doc.data().date.toMillis(),
    }));
    return eventsData as IEvent[];
  } catch (error) {
    console.error('Error fetching events:', error);
  }
};

export const getUpcomingEvents = async (
  queryString: string,
  pageNum: number
): Promise<{ events: IEvent[]; totalLength: number }> => {
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
      const eventData = {
        id: doc.id,
        ...doc.data(),
        date: doc.data().date.toMillis(),
      } as IEvent;
      events.push(eventData);
    });

    const totalLength = events.length;
    const startIndex = (pageNum - 1) * 12;
    const endIndex = startIndex + 12;
    const pagedEvents = events.slice(startIndex, endIndex);

    return { events: pagedEvents, totalLength };
  } catch (error) {
    console.error('Error fetching events:', error);
    return { events: [], totalLength: 0 };
  }
};

export const toggleAttendee = async (
  uid: string,
  attendees: string[],
  eventId: string
) => {
  const db = getFirestore();
  const docRef = doc(db, 'events', eventId);
  try {
    const currentEvent = await getDoc(docRef);
    const currentEventData = currentEvent.data();
    const newAttendeesList = currentEventData?.participants.includes(uid)
      ? currentEventData?.filter((attendee: string) => attendee !== uid)
      : [...currentEventData?.participants, uid];
    if (
      currentEventData?.capacity &&
      newAttendeesList.length < currentEventData?.capacity
    ) {
      try {
        await updateDoc(docRef, {
          participants: newAttendeesList,
        });
      } catch (e) {
        console.log(e);
      }
    } else {
      alert('oops, limit if attendees exceeded');
      closeRegistration(eventId);
    }
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

export const closeRegistration = async (eventId: string) => {
  const db = getFirestore();
  const docRef = doc(db, 'events', eventId);
  try {
    await updateDoc(docRef, {
      isRegistrationOpen: false,
    });
  } catch (e) {
    console.log(e);
  }
};
