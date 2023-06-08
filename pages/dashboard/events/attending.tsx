import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import ProfileLayout from '@/layouts/profile';
import UserEvents from '@/components/events/UserEvents';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, Card, CardContent, Typography } from '@mui/material';

const AttendedEvents = () => {
  const { uid } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const router = useRouter();

  return (
    <ProfileLayout>
      <PageHead pageTitle="Dashboard" />
      {!loading && (
        <Card className="w-full">
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Events to attend
            </Typography>
            {events.length ? (
              <UserEvents events={[]} />
            ) : (
              <span>There is no upcoming events you are attending</span>
            )}
          </CardContent>
        </Card>
      )}
      {loading && <Loader />}
    </ProfileLayout>
  );
};

export default AttendedEvents;
