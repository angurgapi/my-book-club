import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import EventForm from '@/components/events/EventForm';
import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
// import { useParams } from 'react-router-dom';

const CreateEvent = () => {
  const router = useRouter();
  const { isAuth } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuth) {
      router.push('/');
    }
  }, []);
  const { eventId } = router.query;
  console.log(eventId);
  const onSaveEvent = () => {
    router.push('/dashboard');
  };
  return (
    isAuth && (
      <DefaultLayout>
        <PageHead pageTitle="Edit book club meeting" />
        <div className="flex flex-col p-2 items-center mt-4">
          <EventForm onSaveEvent={onSaveEvent} />
        </div>
      </DefaultLayout>
    )
  );
};

export default CreateEvent;
