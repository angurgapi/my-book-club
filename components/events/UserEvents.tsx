import React from 'react';

import { IEvent } from '@/types/event';
import EventCard from '@/components/events/EventCard';

interface UserEventsProps {
  events: IEvent[];
}

const UserEvents: React.FC<UserEventsProps> = ({ events }) => {
  return (
    <div className="flex flex-col w-full">
      <ul className="events-grid w-full my-2">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </ul>
    </div>
  );
};

export default UserEvents;
