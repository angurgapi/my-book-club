import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';

import emailjs from '@emailjs/browser';
import { getFirestore } from '@firebase/firestore';
import { GetServerSideProps, GetStaticProps } from 'next';
import { IEvent } from '@/types/event';
import { IUser } from '@/types/user';
import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import { useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Link from 'next/link';
import {
  getEventById,
  toggleAttendee,
  getEventHost,
  closeRegistration,
} from '@/utils/eventApi';

import EditIcon from '@mui/icons-material/Edit';
import {
  Card,
  CardActions,
  CardContent,
  Skeleton,
  Typography,
  Button,
  Chip,
  CardMedia,
} from '@mui/material';

import { EventHostCard } from '@/components/events/EventHostCard';
import { AttendDialog } from '@/components/events/AttendDialog';

interface EventProps {
  eventId: string;
}

// export async function getStaticProps(context: any) {
//   // const eventId = context.query.id;
//   const eventId = context.query.id;
//   return {
//     props: {
//       eventId,
//     },
//   };
// }

// args: { eventId }: EventProps
export default function EventPage() {
  const { uid, email, isAuth } = useAppSelector((state) => state.user);
  const db = getFirestore();
  const [eventId, setEventId] = useState('');
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
    try {
      const event = await getEventById(eventId);
      setEvent(event as IEvent);
      setAttending(isAuth && event?.participants.includes(uid));
    } catch (e) {
      console.log('no such event', e);
    }
    setLoading(false);
  };

  const [isDialogOpen, setDialogOpen] = useState(false);

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

  useEffect(() => {
    if (
      event?.isRegistrationOpen &&
      event?.date &&
      event?.date < new Date().getTime()
    ) {
      const autoCloseRegistration = async () => {
        await closeRegistration(event.id);
        fetchEventData();
      };
      autoCloseRegistration();
    }
  }, [event]);

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
    return event?.coverUrl || '/images/cover.jpg';
  };

  const isOwnEvent = () => {
    return event?.hostId === uid;
  };

  const canRegister = () => {
    return (
      event && isAuth && !isOwnEvent() && event.isRegistrationOpen && !attending
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
  const onHandleConfirm = async () => {
    await toggleAttendEvent();
    setDialogOpen(false);
    fetchEventData();
  };
  const toggleAttendEvent = async () => {
    if (event) {
      try {
        await toggleAttendee(uid, event.participants, event.id);
      } catch (e) {
        console.log(e);
      }
    }
  };
  if (isLoading) {
    return (
      <DefaultLayout>
        <PageHead pageTitle="Loading..." />
        <div className="flex flex-col items-center mt-4 pt-0">
          <Skeleton
            animation="wave"
            height={40}
            width={220}
            style={{ marginBottom: 16 }}
          />
          <div className="event-page w-full">
            <Card>
              <div className="relative w-full h-full min-h-[300px] aspect-ratio-[3/4]">
                <Skeleton
                  animation="wave"
                  height={'100%'}
                  style={{ marginBottom: 6, marginTop: 0, display: 'flex' }}
                  variant="rectangular"
                  width="100%"
                />
              </div>
            </Card>
            <Card>
              <CardContent>
                <div className="p-2">
                  {Array.from({ length: 6 }, (_, index) => (
                    <div
                      className="grid grid-cols-[1fr,4fr] gap-3 pt-2"
                      key={index}
                    >
                      <Skeleton height={20} />
                      <Skeleton height={20} />
                    </div>
                  ))}
                  <Skeleton height={60} width="100%" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DefaultLayout>
    );
  }
  return (
    <DefaultLayout>
      {event && (
        <>
          <PageHead pageTitle={event.bookTitle} />
          <div className="flex flex-col p-2 items-center m-auto w-full max-w-[800px]">
            <Typography variant="h3" gutterBottom className="event-title">
              {event.bookTitle} by {event.bookAuthor}
            </Typography>
            <div className="event-page w-full">
              <Card>
                <div className="relative w-full h-full min-h-[300px] aspect-ratio-[3/4]">
                  <Image
                    src={getImgSrc()}
                    fill
                    alt="book cover"
                    style={{ objectFit: 'cover' }}
                  />

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
              </Card>

              <Card>
                <CardContent>
                  <div className="event-page__data">
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
                    <div className="bg-slate-100 mt-3 p-2 rounded w-full">
                      <span className="text-justify italic break-all">
                        {event.description}
                      </span>
                    </div>
                  )}
                  {!event.isRegistrationOpen && (
                    <Chip
                      sx={{
                        backgroundColor: '#eb4034',
                        color: '#fff',
                        mt: 2,
                        justifySelf: 'end',
                      }}
                      label="Registration is closed"
                    />
                  )}
                </CardContent>
                <CardActions>
                  {canRegister() && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setDialogOpen(true);
                      }}
                    >
                      Attend event
                    </Button>
                  )}
                  {attending && (
                    <Button
                      variant="contained"
                      onClick={() => {
                        setDialogOpen(true);
                      }}
                    >
                      Leave event
                    </Button>
                  )}
                </CardActions>
              </Card>
            </div>
          </div>
          <AttendDialog
            title={
              attending
                ? 'Are you sure you are not coming?'
                : 'Are you sure you want to attend?'
            }
            handleConfirm={onHandleConfirm}
            handleClose={() => {
              setDialogOpen(false);
            }}
            open={isDialogOpen}
          />
        </>
      )}
    </DefaultLayout>
  );
}
