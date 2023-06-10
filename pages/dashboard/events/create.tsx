import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import EventForm from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

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
        <div className="flex flex-col p-2 items-center mt-4">
          <Card>
            <CardContent>
              <h2>New event</h2>
              <EventForm uid={uid} onSaveEvent={onSaveEvent} />
            </CardContent>
          </Card>
        </div>
      </DefaultLayout>
    )
  );
};

export default CreateEvent;
