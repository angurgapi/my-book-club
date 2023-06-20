import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import EventCard from '@/components/events/EventCard';
import DefaultLayout from '../layouts/default';
import { IEvent } from '@/types/event';
import { getUpcomingEvents } from '@/utils/eventApi';
import { subscribeRdb } from '@/utils/eventsRdb';

import {
  Typography,
  Input,
  InputAdornment,
  IconButton,
  Pagination,
} from '@mui/material';
import { Clear, Search } from '@mui/icons-material';

const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchEvents = async (query: string, page: number) => {
    try {
      setLoading(true);
      const { events, totalLength } = await getUpcomingEvents(query, page);
      setEvents(events);
      setTotalPages(Math.ceil(totalLength / 12));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage((prevPage) => {
      if (newPage !== prevPage) {
        fetchEvents(query, newPage);
        return newPage;
      }
      return prevPage;
    });
  };

  const clearSearch = () => {
    setQuery('');
    setPage(1);
    fetchEvents('', 1);
  };

  useEffect(() => {
    fetchEvents(query, page);
    // subscribeRdb();
  }, []);

  return (
    <DefaultLayout>
      <PageHead pageTitle="Events" />
      <div className="p-2 md:p-5 text-center">
        <Typography variant="h3" gutterBottom>
          Upcoming events
        </Typography>
        {!loading && (
          <div className="flex items-center flex-col ">
            {events && (
              <div className="flex flex-col items-center justify-center w-full my-2">
                <div className="flex w-full items-center justify-end mb-4">
                  <span className="mr-2">Search by city</span>
                  <Input
                    type="text"
                    name="name"
                    required
                    value={query}
                    sx={{ width: 250 }}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === 'Enter' ? fetchEvents(query, 1) : null
                    }
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
                            fetchEvents(query, 1);
                          }}
                        >
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </div>
                <div className="events-grid">
                  {events.map((event) => (
                    <EventCard event={event} key={event.id} />
                  ))}
                </div>
                {totalPages > 1 && (
                  <Pagination
                    count={totalPages}
                    page={page}
                    onChange={(e, page) => {
                      handleChangePage(page);
                    }}
                    defaultPage={6}
                    siblingCount={0}
                    color="primary"
                  />
                )}
              </div>
            )}
            {!events && !query && (
              <span>There are no upcoming events at the moment</span>
            )}
            {!events && query && (
              <span>There are no upcoming events matching your query</span>
            )}
          </div>
        )}
      </div>
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Events;
