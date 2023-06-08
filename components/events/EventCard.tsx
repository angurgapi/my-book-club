import React from 'react';
import { IEvent } from '@/types/event';

import Image from 'next/image';
import dayjs from 'dayjs';
import Link from 'next/link';
import cover from '@/images/cover.jpg';
import { Typography, Chip } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PublicIcon from '@mui/icons-material/Public';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = dayjs(event.date.toDate()).format('MMM DD hh:mm a');

  const getImgSrc = event.coverUrl || cover;

  return (
    <Link
      href={`/event/${event.id}`}
      className="flex flex-col md:flex-row justify-between w-full mb-2 shadow-lg hover:shadow-md"
    >
      <div className="md:w-[60%] w-full flex flex-col items-start rounded-md w-full bg-white p-2">
        <Typography gutterBottom variant="h5" component="p">
          {event.bookTitle} | {event.bookAuthor}
        </Typography>
        <div className="flex items-center mt-2">
          <CalendarMonthIcon className="text-teal-500 mr-2" />
          <span>{formattedDate}</span>
        </div>

        <div className="flex items-center  mt-2">
          <LocationOnIcon className="text-teal-500 mr-2" />
          <span> {event.city}</span>
        </div>
        {event.fee ? (
          <div className="flex items-center  mt-2">
            <MonetizationOnIcon className="text-teal-500 mr-2" />
            <span>
              {' '}
              {event.fee} {event.currency}
            </span>
          </div>
        ) : (
          <Chip
            sx={{ backgroundColor: '#009688', color: '#fff', mt: 2 }}
            label="Free entrance"
          />
        )}
      </div>
      <div className="md:w-[40%] w-full max-h-[300px] relative min-h-[150px]">
        <Image src={getImgSrc} fill alt="bookcover" />
      </div>
    </Link>
  );
};

export default EventCard;
