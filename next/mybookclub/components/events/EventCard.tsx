import React from 'react';
import { IEvent } from '@/types/event';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { FaRegClock } from 'react-icons/fa';
import { ImLocation2 } from 'react-icons/im';
import Image from 'next/image';

interface EventCardProps {
  event: IEvent;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = event.date
    ? event.date.toDate().toLocaleDateString()
    : 'not set';
  const formattedTime = event.date
    ? event.date.toDate().toLocaleTimeString()
    : 'not set';

  const getImgSrc =
    event.coverUrl ||
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcROJGo_BDmE1BQXej-UemTXxZG6RkDsA95ZnA&usqp=CAU';

  return (
    <div className="flex flex-col md:flex-row justify-between w-full max-w-[500px] mb-2 shadow-lg hover:shadow-md">
      <div className="md:w-[60%] w-full flex flex-col items-start rounded-md w-full  p-2">
        <h3 className="text-lg font-semibold">{event.bookTitle}</h3>
        <div className="flex items-center">
          <BsFillCalendarDateFill className="text-teal-500 mr-2" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center">
          <FaRegClock className="text-teal-500 mr-2" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center">
          <ImLocation2 className="text-teal-500 mr-2" />
          <span> {event.city}</span>
        </div>
      </div>
      <div className="md:w-[40%] w-full max-h-[300px] relative min-h-[150px]">
        <Image src={getImgSrc} fill alt="bookcover" />
      </div>
    </div>
  );
};

export default EventCard;
