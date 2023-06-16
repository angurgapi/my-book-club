import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import ErrorPage from '@/components/global/Error';

import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Link from "next/link";
// import Attendees from "../../../components/Attendees";
import emailjs from '@emailjs/browser';
// import { useRouter } from "next/router";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  getFirestore,
  runTransaction,
} from '@firebase/firestore';
import { GetServerSideProps } from 'next';
import { IEvent } from '@/types/event';
import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import cover from '@/images/cover.jpg';
import { useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { Card, CardContent } from '@mui/material';

import { getEventById, toggleAttendee, getEventHost } from '@/utils/eventApi';

interface EventProps {
  event: IEvent;
}

export async function getServerSideProps(context: any) {
  const docId = context.query.id;
  try {
    const event = await getEventById(docId);
    return {
      props: {
        event,
      },
    };
  } catch (e) {
    console.log(e);
  }
}

export default function EventPage({ event }: EventProps) {
  const { uid, email, isAuth } = useAppSelector((state) => state.user);

  const db = getFirestore();

  const [attending, setAttending] = useState(
    Array.isArray(event.participants) &&
      isAuth &&
      event.participants.includes(uid)
  );
  const [participantsLength, setParticipantsLength] = useState(
    event.participants.length
  );

  const getImgSrc = () => {
    return event.coverUrl || cover;
  };

  const isOwnEvent = () => {
    return event.hostId === uid;
  };

  const canRegister = () => {
    return isAuth && !isOwnEvent() && event.registrationOpen && !attending;
  };

  const sendEmail = (eventDetails: IEvent) => {
    emailjs
      .send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_TEMPLATE_ID,
        { ...eventDetails, attendeeEmail: email },
        process.env.NEXT_PUBLIC_MAILER_KEY
      )
      .then(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const toggleAttendEvent = async (addNew: boolean) => {
    try {
      await toggleAttendee(uid, event.participants, event.id);
      if (addNew) {
        setParticipantsLength(participantsLength + 1);
        event.participants.push(uid);
        setAttending(true);
        sendEmail(event);
      } else {
        event.participants.splice(event.participants.indexOf(uid), 1);
        setAttending(false);
        setParticipantsLength(participantsLength - 1);
      }
    } catch (e) {
      console.log(e);
    }
  };

  if (!event.bookTitle) return <ErrorPage />;
  return (
    <DefaultLayout>
      <PageHead pageTitle={event.bookTitle} />
      <div className="flex flex-col p-2 items-center mt-4">
        <Typography variant="h3" gutterBottom>
          {event.bookTitle} by {event.bookAuthor}
        </Typography>
        <Card className="w-full md:max-w-[800px] mb-4">
          <div className="relative w-full  aspect-[18/4]">
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
          <CardContent>
            <div className="event-data">
              <p className="text-teal-800">city</p>
              <p className="text-xl">{event.city}</p>
              <p className="text-teal-800">location </p>
              <p className="text-xl">{event.location}</p>
              <p className="text-teal-800">date/time </p>
              <p className="text-xl">{event.date}</p>
              <p className="text-teal-800">attendees </p>
              <p className="text-xl">{participantsLength || 'nobody yet'}</p>
              <p className="text-teal-800">capacity </p>
              {event.capacity && (
                <p className="text-xl">{event.capacity} ppl</p>
              )}
              {!event.capacity && <p className="text-xl">no limit</p>}
            </div>
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
            {event.description && (
              <div className="bg-slate-100 mt-3 p-2 rounded">
                <span className="text-justify italic">{event.description}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}
