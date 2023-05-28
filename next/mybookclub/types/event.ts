import { IUser } from './user';
import { IComment } from './comment';
import { Timestamp } from 'firebase/firestore';

export interface IEvent {
  date: Timestamp;
  time: string;
  bookTitle: string;
  bookAuthor: string;
  city: string;
  location: string;
  id: string;
  participants: string[];
  coverUrl: string;
  hostId: string;
  fee: number;
}

export interface IEventsState {
  sortEventsBy: 'newest' | 'oldest' | 'likes' | 'controversial';
  events: IEvent[];
}
