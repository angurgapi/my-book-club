import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import EventForm from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';

import { getEventById } from '@/utils/eventApi';
import { IEvent } from '@/types/event';
import dayjs from 'dayjs';
// import { useParams } from 'react-router-dom';
interface EventProps {
  eventData: IEvent;
}

export async function getServerSideProps(context: any) {
  const docId = context.query.id;
  try {
    const event = await getEventById(docId);
    return {
      props: {
        eventData: event,
      },
    };
  } catch (e) {
    console.log(e);
  }
}

const EditEvent = ({ eventData }: EventProps) => {
  const router = useRouter();
  const { isAuth, uid } = useAppSelector((state) => state.user);
  useEffect(() => {
    if (!isAuth) {
      router.push('/auth');
    }
  }, [isAuth, router]);

  const onSaveEvent = () => {
    router.push('/dashboard/events');
  };
  return (
    isAuth && (
      <DefaultLayout>
        <PageHead pageTitle="Edit book club meeting" />
        <div className="flex flex-col p-2 items-center mt-4">
          <EventForm
            onSaveEvent={onSaveEvent}
            uid={uid}
            isEdit={true}
            oldEvent={eventData}
          />
        </div>
      </DefaultLayout>
    )
  );
};

export default EditEvent;
