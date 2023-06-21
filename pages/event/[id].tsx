import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Link from "next/link";
// import Attendees from "@/components/events/AttendeesModal";
import emailjs from '@emailjs/browser';
// import { useRouter } from "next/router";
import { getFirestore } from '@firebase/firestore';
// import { GetServerSideProps } from 'next';
import { IEvent } from '@/types/event';
import { IUser } from '@/types/user';
import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import { useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Link from 'next/link';
import { getEventById, toggleAttendee, getEventHost } from '@/utils/eventApi';

import EditIcon from '@mui/icons-material/Edit';
import { Card, CardActions, CardContent, Skeleton } from '@mui/material';

import { EventHostCard } from '@/components/events/EventHostCard';

// interface EventProps {
//   event: IEvent;
// }

// export async function getServerSideProps(context: any) {
//   const docId = context.query.id;
//   try {
//     const event = await getEventById(docId);

//     return {
//       props: {
//         event,
//       },
//     };
//   } catch (e) {
//     console.log('no such event', e);
//   }
// }

export default function EventPage() {
  const { uid, email, isAuth } = useAppSelector((state) => state.user);
  const db = getFirestore();

  const [attending, setAttending] = useState<boolean | undefined>(false);
  const [event, setEvent] = useState<IEvent | undefined>(undefined);
  const [host, setHost] = useState<IUser | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);
  const [participantsLength, setParticipantsLength] = useState(
    event?.participants.length
  );

  const router = useRouter();

  const fetchEventData = async () => {
    setLoading(true);
    const { id } = router.query;
    try {
      const event = await getEventById(id as string);
      setEvent(event as IEvent);
      setAttending(isAuth && event?.participants.includes(uid));
    } catch (e) {
      console.log('no such event', e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  useEffect(() => {
    const fetchHostData = async () => {
      if (event) {
        const hostData = await getEventHost(event.hostId);
        setHost(hostData as IUser);
      }
    };
    fetchHostData();
  }, [event]);

  const formattedDate = dayjs(event?.date).format('MMM DD hh:mm a');

  const getImgSrc = () => {
    return event?.coverUrl || '/images.cover.jpg';
  };

  const isOwnEvent = () => {
    return event?.hostId === uid;
  };

  const canRegister = () => {
    return (
      event && isAuth && !isOwnEvent() && event.registrationOpen && !attending
    );
  };

  // const sendEmail = (eventDetails: IEvent) => {
  //   emailjs
  //     .send(
  //       process.env.NEXT_PUBLIC_SERVICE_ID,
  //       process.env.NEXT_PUBLIC_TEMPLATE_ID,
  //       { ...eventDetails, attendeeEmail: email },
  //       process.env.NEXT_PUBLIC_MAILER_KEY
  //     )
  //     .then(
  //       (result) => {
  //         console.log(result);
  //       },
  //       (error) => {
  //         console.log(error);
  //       }
  //     );
  // };

  const toggleAttendEvent = async (addNew: boolean) => {
    if (event) {
      try {
        await toggleAttendee(uid, event.participants, event.id);
        if (addNew) {
          setParticipantsLength(event.participants.length + 1);
          event.participants.push(uid);
          setAttending(true);
          // sendEmail(event);
        } else {
          event.participants.splice(event.participants.indexOf(uid), 1);
          setAttending(false);
          setParticipantsLength(event.participants.length - 1);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };
  if (isLoading) {
    return (
      <DefaultLayout>
        <PageHead pageTitle="Loading..." />
        <div className="flex flex-col p-2 items-center mt-4">
          <Skeleton animation="wave" height={40} style={{ marginBottom: 16 }} />
          <Card className="w-full md:max-w-[800px] mb-4">
            <Skeleton
              animation="wave"
              height={170}
              style={{ marginBottom: 6 }}
              width="100%"
            />

            {Array.from({ length: 6 }, (_, index) => (
              <div className="grid grid-cols-[1fr,4fr] gap-3 pt-2" key={index}>
                <Skeleton height={20} />
                <Skeleton height={20} />
              </div>
            ))}
            <Skeleton height={40} width="100%" />
          </Card>
        </div>
      </DefaultLayout>
    );
  }
  return (
    <DefaultLayout>
      {event && (
        <>
          <PageHead pageTitle={event.bookTitle} />
          <div className="flex flex-col p-2 items-center mt-4">
            <Typography variant="h3" gutterBottom>
              {event.bookTitle} by {event.bookAuthor}
            </Typography>
            <Card className="w-full md:max-w-[800px] mb-4">
              <div className="relative w-full  aspect-[18/4]">
                {isLoading ? (
                  <Skeleton
                    sx={{ height: 190 }}
                    animation="wave"
                    variant="rectangular"
                  />
                ) : (
                  <Image
                    src={getImgSrc()}
                    fill
                    alt="book cover"
                    style={{ objectFit: 'cover' }}
                  />
                )}

                {attending && (
                  <div className="absolute bottom-2 right-2 bg-amber-400 text-black rounded p-2 w-fit">
                    You are attending
                  </div>
                )}
                {isOwnEvent() && (
                  <Link
                    className="btn absolute top-2 right-2 w-fit btn bg-teal-500 text-white"
                    href={`/event/edit/${event.id}`}
                  >
                    <EditIcon />
                    edit
                  </Link>
                )}
              </div>
              <CardContent>
                <div className="event-data">
                  <p className="text-teal-800">city</p>
                  <p className="text-xl">{event.city}</p>
                  <p className="text-teal-800">location </p>
                  <p className="text-xl">{event.location}</p>
                  <p className="text-teal-800">date/time </p>
                  <p className="text-xl">{formattedDate}</p>
                  <p className="text-teal-800">attendees </p>
                  <p className="text-xl">
                    {event.participants.length || 'nobody yet'}
                  </p>
                  <p className="text-teal-800">capacity </p>
                  {event.capacity && (
                    <p className="text-xl">{event.capacity} ppl</p>
                  )}
                  {!event.capacity && <p className="text-xl">no limit</p>}

                  {host && (
                    <>
                      <p className="text-teal-800">Hosted by</p>
                      <div className="w-fit">
                        <EventHostCard hostData={host} />
                      </div>
                    </>
                  )}
                </div>

                {event.description && (
                  <div className="bg-slate-100 mt-3 p-2 rounded">
                    <span className="text-justify italic break-all">
                      {event.description}
                    </span>
                  </div>
                )}
              </CardContent>
              <CardActions>
                {canRegister() && (
                  <button
                    className="mt-3 p-2 bg-teal-500 text-white rounded w-fit"
                    onClick={() => {
                      toggleAttendEvent(true);
                    }}
                  >
                    Attend
                  </button>
                )}
                {attending && (
                  <button
                    className="mt-3 p-2 bg-teal-500 text-white rounded w-fit"
                    onClick={() => {
                      toggleAttendEvent(false);
                    }}
                  >
                    Leave event
                  </button>
                )}
                {!event.registrationOpen && <span>Registration is closed</span>}
              </CardActions>
            </Card>
          </div>
        </>
      )}
    </DefaultLayout>
  );
}
