import ProfileLayout from '@/layouts/profile';
import PageHead from '@/components/global/Head';
import EventForm from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect, useState } from 'react';

import { getEventById } from '@/utils/eventApi';
import { IEvent } from '@/types/event';
import dayjs from 'dayjs';
import { Typography, Card, CardContent } from '@mui/material';
import Loader from '@/components/global/Loader';

interface EventProps {
  eventData: IEvent;
}

// export async function getServerSideProps(context: any) {
//   const docId = context.query.id;
//   try {
//     const event = await getEventById(docId);
//     return {
//       props: {
//         eventData: event,
//       },
//     };
//   } catch (e) {
//     console.log(e);
//   }
// }

const EditEvent = () => {
  const router = useRouter();
  // const { id } = router.query;
  const { uid } = useAppSelector((state) => state.user);
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [eventId, setEventId] = useState('');

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const event = await getEventById(eventId as string);
      setEvent(event as IEvent);
    } catch (e) {
      console.log('no such event', e);
    }
    setLoading(false);
  };
  useEffect(() => {
    if (router.isReady && router.query.id) {
      const queryId = Array.isArray(router.query.id)
        ? router.query.id[0]
        : router.query.id;
      setEventId(queryId);
    }
    // fetchEventData();
  }, [router.isReady]);

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);

  const onSaveEvent = () => {
    router.push(`/event/${eventId}`);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <ProfileLayout>
      <PageHead pageTitle="Edit book club meeting" />
      <div className="flex w-fill flex-col p-2 items-center mt-4">
        <Typography variant="h3" gutterBottom>
          Edit event details
        </Typography>
        <Card sx={{ width: { xs: '100%', md: '600px' } }}>
          <CardContent>
            <EventForm
              onSaveEvent={onSaveEvent}
              uid={uid}
              isEdit={true}
              oldEvent={event}
            />
          </CardContent>
        </Card>
      </div>
    </ProfileLayout>
  );
};
export default EditEvent;
