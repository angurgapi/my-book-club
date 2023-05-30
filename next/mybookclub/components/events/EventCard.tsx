import React from 'react';
import { IEvent } from '@/types/event';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { FaRegClock } from 'react-icons/fa';
import { ImLocation2 } from 'react-icons/im';
import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import cover from '@/images/cover.jpg';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // const formattedDate = event.date
  //   ? event.date.toDate().toLocaleDateString()
  //   : 'not set';
  // const formattedTime = event.date
  //   ? dayjs(event.date.seconds).format('HH:mm')
  //   : 'not set';

  const getImgSrc = event.coverUrl || cover;

  return (
    <Link
      href={`event/${event.id}`}
      className="flex flex-col md:flex-row justify-between w-full max-w-[500px] mb-2 shadow-lg hover:shadow-md"
    >
      <div className="md:w-[60%] w-full flex flex-col items-start rounded-md w-full bg-white p-2">
        <h3 className="text-lg font-semibold">
          {event.bookTitle} | {event.bookAuthor}
        </h3>
        <div className="flex items-center">
          <BsFillCalendarDateFill className="text-teal-500 mr-2" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center">
          <FaRegClock className="text-teal-500 mr-2" />
          <span>{event.time}</span>
        </div>
        <div className="flex items-center">
          <ImLocation2 className="text-teal-500 mr-2" />
          <span> {event.city}</span>
        </div>
      </div>
      <div className="md:w-[40%] w-full max-h-[300px] relative min-h-[150px]">
        <Image src={getImgSrc} fill alt="bookcover" />
      </div>
    </Link>
  );
};

export default EventCard;
