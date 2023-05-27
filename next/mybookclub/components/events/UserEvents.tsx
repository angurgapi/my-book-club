import React, { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { IEvent } from '@/types/event';
import EventCard from '@/components/events/EventCard';

interface UserEventsProps {
  uid: string;
}

const UserEvents: React.FC<UserEventsProps> = ({ uid }) => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('attending');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const db = getFirestore();
        const eventsCollection = query(
          collection(db, 'events'),
          where('participants', 'array-contains', uid)
        );

        const eventsSnapshot = await getDocs(eventsCollection); // Fetch the documents from the collection

        const eventsData: IEvent[] = eventsSnapshot.docs.map((doc) => ({
          id: doc.id,
          bookTitle: doc.data().bookTitle,
          city: doc.data().city,
          participants: doc.data().participants,
          date: doc.data().date,
          coverUrl: doc.data().coverUrl,
        }));
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex my-3 justify-center">
        <button
          className={`tab-btn mx-2 ${
            currentTab === 'attending' ? 'tab-btn--active' : ''
          }`}
          onClick={() => setCurrentTab('attending')}
        >
          attending
        </button>
        <button
          className={`tab-btn mx-2 ${
            currentTab === 'hosting' ? 'tab-btn--active' : ''
          }`}
          onClick={() => setCurrentTab('hosting')}
        >
          hosting
        </button>
      </div>
      <div className="flex flex-col items-center justify-center max-w-md my-2">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
    </div>
  );
};

export default UserEvents;
