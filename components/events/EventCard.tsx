import React from 'react';
import { IEvent } from '@/types/event';

import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';

import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import cover from '@/images/cover.jpg';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // const formattedDate = dayjs
  //   .unix(event.date.toMillis() / 1000)
  //   .format('MMM-DD hh:mm a');
  const formattedDate = dayjs.unix(event.date).format('MMM-DD hh:mm a');

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
          <CalendarMonthIcon className="text-teal-500 mr-2" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center">
          <LocationOnIcon className="text-teal-500 mr-2" />
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
