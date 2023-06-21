import DefaultLayout from '@/layouts/default';
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
  const { id } = router.query;
  const { uid } = useAppSelector((state) => state.user);
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const event = await getEventById(id as string);
      setEvent(event as IEvent);
    } catch (e) {
      console.log('no such event', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventData();
  }, [router.query.id]);

  const onSaveEvent = () => {
    router.push(`/event/${id}`);
  };
  if (isLoading) {
    return <Loader />;
  }
  return (
    <DefaultLayout>
      <PageHead pageTitle="Edit book club meeting" />
      <div className="flex flex-col p-2 items-center mt-4">
        <Typography variant="h3" gutterBottom>
          Edit event details
        </Typography>
        <Card>
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
    </DefaultLayout>
  );
};
export default EditEvent;
