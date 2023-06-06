import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import EventCard from '@/components/events/EventCard';
import DefaultLayout from '../layouts/default';
import { IEvent } from '@/types/event';
import { getUpcomingEvents } from '@/utils/eventApi';

import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import dayjs from 'dayjs';
import { Typography } from '@mui/material';

const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // const fetchEvents = async () => {
    //   setLoading(true);
    //   try {
    //     const db = getFirestore();
    //     const eventsCollection = collection(db, 'events');
    //     const eventsSnapshot = await getDocs(eventsCollection); // Fetch the documents from the collection

    //     const eventsData: IEvent[] = eventsSnapshot.docs.map((doc) => ({
    //       id: doc.id,
    //       bookTitle: doc.data().bookTitle,
    //       bookAuthor: doc.data().bookAuthor,
    //       city: doc.data().city,
    //       participants: doc.data().participants,
    //       date: doc.data().date,
    //       time: doc.data().time,
    //       coverUrl: doc.data().coverUrl,
    //     }));

    //     setEvents(eventsData);
    //   } catch (error) {
    //     console.error('Error fetching events:', error);
    //   }
    //   setLoading(false);
    // };
    const fetchEvents = async () => {
      const upcomingEvents: IEvent[] = await getUpcomingEvents();
      setEvents(upcomingEvents);
    };

    fetchEvents();
  }, []);

  return (
    <DefaultLayout>
      <PageHead pageTitle="Events" />
      {!loading && (
        <div className="p-2 md:p-5 text-center">
          <Typography variant="h3" gutterBottom>
            Upcoming events
          </Typography>
          <div className="flex">
            {/* <input
              type="text"
              name="name"
              className="w-full border px-2 py-2 mb-3 rounded-md"
              required
              value={queryString}
              onChange={(e) => setQuery(e.target.value)}
            /> */}
          </div>
          <div className="flex items-center flex-col ">
            {events && (
              <div className="flex flex-col items-center justify-center w-full my-2">
                {events.map((event) => (
                  <EventCard event={event} key={event.id} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Events;
