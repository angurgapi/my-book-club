import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import EventForm from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const CreateEvent = () => {
  const router = useRouter();
  const { isAuth, uid } = useAppSelector((state) => state.user);

  // useEffect(() => {
  //   if (!isAuth) {
  //     router.push('/auth');
  //   }
  // }, [isAuth, router]);

  const onSaveEvent = () => {
    router.push('/dashboard/events/hosting');
  };
  return (
    isAuth && (
      <DefaultLayout>
        <PageHead pageTitle="New book club meeting" />
        <div className="flex w-fill flex-col p-2 items-center mt-4">
          <Typography variant="h3" gutterBottom>
            New event
          </Typography>
          <Card sx={{ width: { xs: '100%', md: '600px' } }}>
            <CardContent>
              <EventForm uid={uid} onSaveEvent={onSaveEvent} />
            </CardContent>
          </Card>
        </div>
      </DefaultLayout>
    )
  );
};

export default CreateEvent;
