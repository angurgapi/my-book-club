import React, { useEffect, useState } from 'react';
import { useAppSelector } from '@/hooks/redux';
import {
  setHostedEvents,
  setAttendedEvents,
} from '@/store/reducers/UserEventsSlice';
import { useAppDispatch } from '@/hooks/redux';

import { IEvent } from '@/types/event';
import EventCard from '@/components/events/EventCard';
import { getHostedEvents, getAttendedEvents } from '@/utils/eventApi';

interface UserEventsProps {
  uid: string;
}

const UserEvents: React.FC<UserEventsProps> = ({ uid }) => {
  // const [attendedEvents, setAttendedEvents] = useState<IEvent[]>([]);
  // const [hostedEvents, setHostedEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('attending');
  const dispatch = useAppDispatch();

  const hostedEvents = useAppSelector((state) => state.userEvents.hostedEvents);
  const attendedEvents = useAppSelector(
    (state) => state.userEvents.attendedEvents
  );
  // console.log('hosted', hostedEvents);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        const attendedEventsList = await getAttendedEvents(uid);
        dispatch(setAttendedEvents(attendedEventsList));
        const hostedEventsList = await getHostedEvents(uid);
        dispatch(setHostedEvents(hostedEventsList));
      } catch (e) {
        console.log(e);
      }

      setLoading(false);

      // const queryParams =
      //   currentTab === 'attending'
      //     ? ['participants', 'array-contains']
      //     : ['hostId', '=='];
      // setLoading(true);
      // try {
      //   const db = getFirestore();
      //   const eventsCollection = query(
      //     collection(db, 'events'),
      //     where(queryParams[0], queryParams[1] as WhereFilterOp, uid)
      //   );

      //   const eventsSnapshot = await getDocs(eventsCollection); // Fetch the documents from the collection

      //   const eventsData: IEvent[] = eventsSnapshot.docs.map((doc) => ({
      //     id: doc.id,
      //     bookTitle: doc.data().bookTitle,
      //     bookAuthor: doc.data().bookAuthor,
      //     hostId: doc.data().hostId,
      //     city: doc.data().city,
      //     location: doc.data().location,
      //     participants: doc.data().participants,
      //     date: doc.data().date,
      //     time: doc.data().time,
      //     coverUrl: doc.data().coverUrl,
      //     fee: doc.data().fee,
      //     registrationOpen: doc.data().registrationOpen,
      //   }));
      //   setEvents(eventsData);
      // } catch (error) {
      //   console.error('Error fetching events:', error);
      // }
      // setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex flex-col w-full">
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
      {/* <div className="flex flex-col items-center justify-center max-w-md my-2">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div> */}
      {currentTab === 'attending' && (
        <div className="flex flex-col items-center justify-center w-full my-2">
          {!!attendedEvents && attendedEvents.length > 0 && (
            <ul className="flex flex-col items-center justify-center w-full my-2">
              {attendedEvents.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </ul>
          )}
          {attendedEvents === null ||
            (attendedEvents?.length < 1 && (
              <span>there are no events you participate</span>
            ))}
        </div>
      )}
      {currentTab === 'hosting' && (
        <div>
          {hostedEvents?.length && (
            <ul className="flex flex-col items-center justify-center w-full my-2">
              {hostedEvents.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default UserEvents;
