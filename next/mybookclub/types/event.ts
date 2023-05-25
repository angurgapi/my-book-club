import { IUser } from './user';
import { IComment } from './comment';
import { Timestamp } from 'firebase/firestore';

export interface IEvent {
  // author: IUser;
  // createdAt: string;
  // eventDate: string;
  // description: string;
  // comments: IComment[];
  // images: string[];
  // id: string;
  date: Timestamp;
  bookTitle: string;
  city: string;
  id: string;
  participants: string[];
  coverUrl: string;
  hostId: string;
}

export interface IEventsState {
  sortEventsBy: 'newest' | 'oldest' | 'likes' | 'controversial';
  events: IEvent[];
}
