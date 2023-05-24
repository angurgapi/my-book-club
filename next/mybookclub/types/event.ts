import { IUser } from './user';
import { IComment } from './comment';

export interface IEvent {
  // author: IUser;
  // createdAt: string;
  // eventDate: string;
  // description: string;
  // comments: IComment[];
  // images: string[];
  // id: string;
  bookTitle: string;
  title: string;
  id: string;
}

export interface IEventsState {
  sortEventsBy: 'newest' | 'oldest' | 'likes' | 'controversial';
  events: IEvent[];
}
