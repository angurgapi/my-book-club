import React from 'react';

import { IEvent } from '@/types/event';
import EventCard from '@/components/events/EventCard';
import EventsGrid from './EventsGrid';

interface UserEventsProps {
  events: IEvent[];
}

const UserEvents: React.FC<UserEventsProps> = ({ events }) => {
  return (
    <EventsGrid events={events} hasSidebar />
  );
};

export default UserEvents;
