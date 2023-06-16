import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import EventCard from '@/components/events/EventCard';
import DefaultLayout from '../layouts/default';
import { IEvent } from '@/types/event';
import { getUpcomingEvents } from '@/utils/eventApi';
import { subscribeRdb } from '@/utils/eventsRdb';

import { Typography, Input, InputAdornment, IconButton } from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const fetchEvents = async () => {
    try {
      const upcomingEvents = await getUpcomingEvents(query);
      setEvents(upcomingEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const clearSearch = () => {
    setQuery('');
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
    subscribeRdb();
  }, []);

  return (
    <DefaultLayout>
      <PageHead pageTitle="Events" />
      {!loading && (
        <div className="p-2 md:p-5 text-center">
          <Typography variant="h3" gutterBottom>
            Upcoming events
          </Typography>
          <div className="flex w-full items-center justify-end">
            <span className="mr-2">Search by city</span>
            <Input
              type="text"
              name="name"
              required
              value={query}
              sx={{ width: 250 }}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => (e.key === 'Enter' ? fetchEvents() : null)}
              endAdornment={
                <InputAdornment position="end">
                  {query && (
                    <IconButton disableRipple onClick={clearSearch}>
                      <Clear />
                    </IconButton>
                  )}
                  <IconButton
                    color="primary"
                    onClick={() => {
                      fetchEvents();
                    }}
                  >
                    <Search />
                  </IconButton>
                </InputAdornment>
              }
            />
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
