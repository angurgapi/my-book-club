import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import ProfileLayout from '@/layouts/profile';
import UserEvents from '@/components/events/UserEvents';
import { getAttendedEvents } from '@/utils/eventApi';
import { IEvent } from '@/types/event';

import { Button, Card, CardContent, Typography } from '@mui/material';

const AttendedEvents = () => {
  const { uid } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<IEvent[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const eventsData = await getAttendedEvents(uid);
      console.log(eventsData);
      setEvents(eventsData as IEvent[]);
      setLoading(false);
    };

    fetchEvents();
  }, [uid]);

  return (
    <ProfileLayout>
      <PageHead pageTitle="Dashboard" />
      {!loading && (
        <div className="flex flex-col">
          <Typography variant="h3" gutterBottom>
            Events you are attending
          </Typography>
          {events.length ? (
            <UserEvents events={events} />
          ) : (
            <Card className="w-full">
              <CardContent>
                <span>There is no upcoming events you are attending</span>
                <br />
                <Link className="text-teal-700 text-xl" href="/events">
                  Explore what is available
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      {loading && <Loader />}
    </ProfileLayout>
  );
};

export default AttendedEvents;
