import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import DefaultLayout from '../layouts/default';
import { IEvent } from '@/types/event';

import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const db = getFirestore(); // Initialize Firestore
        const eventsCollection = collection(db, 'events'); // Reference the 'events' collection
        const eventsSnapshot = await getDocs(eventsCollection); // Fetch the documents from the collection

        const eventsData: IEvent[] = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          bookTitle: doc.data().bookTitle,
          title: doc.data().title,
        }));

        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <DefaultLayout>
      <PageHead pageTitle="Events" />
      {!loading && (
        <div className="p-2 md:p-5 text-center">
          <h2 className="text-xl">Bookclub events</h2>
          <div className="user-data flex flex-col ">
            <div className="flex flex-col items-center justify-center md:flex-row my-2">
              {events.map((event) => (
                <div
                  className="flex flex-col shadow-lg shadow-cyan-500/50 p-2"
                  key={event.id}
                >
                  <span>{event.title}</span>
                  <span>{event.bookTitle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Events;
