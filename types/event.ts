import { IUser } from './user';
import { IComment } from './comment';
import { Timestamp } from 'firebase/firestore';

export interface IEvent {
  bookTitle: string;
  bookAuthor: string;
  date: Timestamp;
  description?: string;
  city: string;
  location?: string;
  id?: string;
  participants: string[];
  coverUrl: string;
  hostId?: string;
  fee: number;
  currency?: string;
  capacity?: number;
  registrationOpen: boolean;
}

export interface IEventsState {
  sortEventsBy: 'newest' | 'oldest' | 'likes' | 'controversial';
  events: IEvent[];
}
