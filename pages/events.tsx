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
    const fetchEvents = async () => {
      setLoading(true);
      const eventsData = await getUpcomingEvents();
      setEvents(eventsData as IEvent[]);
      setLoading(false);
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
