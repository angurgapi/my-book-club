import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import DefaultLayout from '../layouts/default';
import { IEvent } from '@/types/event';
import { getUpcomingEvents } from '@/utils/eventApi';

import { Typography, Pagination } from '@mui/material';
import EventsGrid from '@/components/events/EventsGrid';
import LottiePlayer from '@/components/ui/LottiePlayer';

const Events = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  type Period = 'all' | 'today' | 'tomorrow';

  const [activeFilter, setActiveFilter] = useState<Period>('all');

  const filterEventsByPeriod = (items: IEvent[], period: Period): IEvent[] => {
    if (period === 'all') return items;
    const now = new Date();
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const offset = period === 'today' ? 0 : 1;
    const start = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset).getTime();
    const end = new Date(base.getFullYear(), base.getMonth(), base.getDate() + offset + 1).getTime();
    return items.filter((e) => e.date >= start && e.date < end);
  };

  const fetchEvents = async (pageNum: number, period: Period = activeFilter) => {
    try {
      setLoading(true);
      const { events, totalLength } = await getUpcomingEvents('', pageNum);
      const filtered = filterEventsByPeriod(events, period);
      setEvents(filtered);
      setTotalPages(period === 'all' ? Math.ceil(totalLength / 12) : 1);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleChangePage = (newPage: number) => {
    setPage((prevPage) => {
      if (newPage !== prevPage) {
        fetchEvents(newPage, activeFilter);
        return newPage;
      }
      return prevPage;
    });
  };

  useEffect(() => {
    fetchEvents(page, activeFilter);
  }, []);

  const filterByDate = (period: Period) => {
    setActiveFilter(period);
    setPage(1);
    fetchEvents(1, period);
  };

  const filteredEvents = React.useMemo(() => {
    return filterEventsByPeriod(events, activeFilter);
  }, [events, activeFilter]);

  return (
    <DefaultLayout>
      <PageHead pageTitle="Events" />
      <div className="p-2 md:p-5 text-center w-full max-w-[1100px] mx-auto">
        <Typography variant="h3" gutterBottom>
          Upcoming events
        </Typography>
        {!loading && (
          <div className="flex items-center flex-col ">
            {events && (
              <div className="flex flex-col items-center justify-center w-full my-2">
                <div className="flex w-full items-center justify-end mb-4 gap-2">
                  <button
                    className={`px-3 py-1 rounded border ${activeFilter === 'all' ? 'bg-teal-600 text-white' : 'bg-white'}`}
                    onClick={() => filterByDate('all')}
                  >
                    all
                  </button>
                  <button
                    className={`px-3 py-1 rounded border ${activeFilter === 'today' ? 'bg-teal-600 text-white' : 'bg-white'}`}
                    onClick={() => filterByDate('today')}
                  >
                    today
                  </button>
                  <button
                    className={`px-3 py-1 rounded border ${activeFilter === 'tomorrow' ? 'bg-teal-600 text-white' : 'bg-white'}`}
                    onClick={() => filterByDate('tomorrow')}
                  >
                    tomorrow
                  </button>
                </div>
                <div className="pt-5">
                  <EventsGrid events={filteredEvents} />
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
            {!events.length && (
              <div className="flex flex-col items-center justify-center mt-10 w-full max-w-md">
                <LottiePlayer src="/animations/no-events.lottie" size="m" />
                <Typography variant="h4" sx={{ mt: 3 }}>
                  There are no upcoming events at the moment
                </Typography>
              </div>
            )}
          </div>
        )}
      </div>
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Events;
