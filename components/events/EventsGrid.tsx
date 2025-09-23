import { IEvent } from '@/types/event';
import { FC } from 'react';
import EventCard from './EventCard';

interface EventsGridProps {
  events: IEvent[];
  hasSidebar?: boolean;
}

const EventsGrid: FC<EventsGridProps> = ({ events, hasSidebar }) => {
  const mdCols = hasSidebar ? 'md:grid-cols-2' : 'md:grid-cols-3';
  const lgCols = hasSidebar ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
  return (
    <div
      className={`w-full grid grid-cols-2 ${mdCols} ${lgCols} gap-2 md:gap-4`}
    >
      {events.map((event) => (
        <EventCard event={event} key={event.id} />
      ))}
    </div>
  );
};

export default EventsGrid;
