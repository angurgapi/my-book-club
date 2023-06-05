import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import ErrorPage from '@/components/global/Error';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Link from "next/link";
// import Attendees from "../../../components/Attendees";
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

// import ShareEventModal from "../../../components/ShareEventModal";
// import ErrorPage from "../../../components/ErrorPage";

interface EventProps {
  event: IEvent;
}

export async function getServerSideProps(context) {
  const db = getFirestore();
  const docId = context.query.id;
  const docRef = doc(db, 'events', docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const event = docSnap.data() as IEvent;
    event.id = docId;

    return {
      props: {
        event: {
          ...event,
          date: event.date.seconds,
        },
      },
    };
  } else {
    console.log('No such document!');
  }
}

export default function EventPage({ event }: EventProps) {
  const { uid } = useAppSelector((state) => state.user);
  const db = getFirestore();
  const [attending, setAttending] = useState(
    Array.isArray(event.participants) && uid && event.participants.includes(uid)
  );
  const [participantsLength, setParticipantsLength] = useState(
    event.participants.length
  );

  // const [click, setClick] = useState(firebaseEvent.disableRegistration);
  // const [showModal, setShowModal] = useState(false);
  // const [disableRegModal, setDisableRegModal] = useState(false);
  // const openModal = () => setShowModal(true);
  // const closeModal = () => setShowModal(false);

  const getFormattedDate = () => {
    return dayjs.unix(event.date).format('MMM DD hh:mm a');
  };

  const getImgSrc = () => {
    return event.coverUrl || cover;
  };

  const isOwnEvent = () => {
    console.log();
    return event.hostId === uid;
  };

  const attendEvent = async () => {
    const docRef = doc(db, 'events', event.id);
    if (uid && !event.participants.includes(uid)) {
      let participantsList = Array.isArray(event.participants)
        ? [...event.participants, uid]
        : [uid];
      await updateDoc(docRef, {
        participants: participantsList,
      });
      setParticipantsLength(participantsLength + 1);
      event.participants.push(uid);
      setAttending(true);
    }
  };

  const unattendEvent = async () => {
    if (uid && event.participants.includes(uid)) {
      const docRef = doc(db, 'events', event.id);
      event.participants.splice(event.participants.indexOf(uid), 1);
      await updateDoc(docRef, {
        participants: event.participants,
      });
      setAttending(false);
      setParticipantsLength(participantsLength - 1);
    }
  };
  if (!event.bookTitle) return <ErrorPage />;
  return (
    <DefaultLayout>
      <PageHead pageTitle={event.bookTitle} />
      <div className="flex flex-col p-2 items-center mt-4">
        <h1 className="text-center text-2xl">
          {event.bookTitle} by {event.bookAuthor}
        </h1>
        <div className="flex flex-col mt-4 w-full max-w-[800px] justify-start items-center">
          <div className="relative w-full aspect-[16/7]">
            <Image
              className="rounded"
              src={getImgSrc()}
              fill
              alt="book cover"
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

          <div className="p-3 md:col-span-2 flex flex-col w-full justify-start items-start">
            {event.description && (
              <span className="text-justify italic text-emerald-700">
                {event.description}
              </span>
              //   <Accordion className="w-full">
              //     <AccordionSummary
              //       expandIcon={<ExpandMoreIcon />}
              //       aria-controls="panel1a-content"
              //       id="panel1a-header"
              //     >
              //       <Typography><span>Event details</span></Typography>
              //     </AccordionSummary>
              //     <AccordionDetails>
              //       <Typography>{event.description}</Typography>
              //     </AccordionDetails>
              //   </Accordion>
            )}
            <div className="grid md:grid-cols-3 auto-cols-max gap-2 mt-3">
              <span className="text-teal-800">city</span>
              <span className="col-span-2">{event.city}</span>
              <span className="text-teal-800">location </span>
              <span className="col-span-2">{event.location}</span>
              <span className="text-teal-800">date/time </span>
              <span className="col-span-2">{getFormattedDate()}</span>
              <span className="text-teal-800">attendees </span>
              <span className="col-span-2">
                {participantsLength || 'nobody yet'}
              </span>
              <span className="text-teal-800">capacity </span>
              {event.capacity && (
                <span className="col-span-2">{event.capacity} ppl</span>
              )}
              {!event.capacity && <span className="col-span-2">no limit</span>}
            </div>
            {!attending && !isOwnEvent && (
              <button
                className="mt-3 p-2 bg-teal-500 text-white rounded w-fit"
                onClick={attendEvent}
              >
                Attend
              </button>
            )}
            {attending && (
              <button
                className="mt-3 p-2 bg-teal-500 text-white rounded w-fit"
                onClick={unattendEvent}
              >
                Leave event
              </button>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
