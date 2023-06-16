import {
  ref,
  get,
  getDatabase,
  onValue,
  onChildChanged,
  onDisconnect,
  set,
  push,
  serverTimestamp,
  Database,
} from 'firebase/database';

import { IEvent } from '@/types/event';

export const subscribeRdb = async () => {
  console.log('subscribe was called');
  const rdb = getDatabase();
  const eventsRef = ref(rdb, 'events');
  const eventRef = push(eventsRef);
  set(eventRef, {
    kek: 'lol',
  });

  //   await get(eventsRef)
  //     .then((snapshot) => {
  //       if (snapshot.exists()) {
  //         const eventData = snapshot.val();
  //         console.log('Events data:', eventData);
  //       } else {
  //         console.log('No data found in the events collection.');
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching events data:', error);
  //     });

  onChildChanged(eventsRef, (data) => {
    console.log('child changed', data);
  });
};
