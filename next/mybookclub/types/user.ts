import { IEvent } from './event';

export interface IUser {
  events: IEvent[];
  createdAt: string;
  displayName: string;
  email?: string;
  images: string[];
  password?: string;
  photoURL: string;
  uid: string;
  isAuth?: boolean;
}

export interface IUserState {
  events: IEvent[] | null;
  createdAt: string | null;
  displayName: string | null;
  email?: string | null;
  images: string[] | null;
  password?: string | null;
  photoURL: string | null;
  uid: string | null;
  isAuth?: boolean;
}

export interface IUserData {
  displayName: string;
  email: string;
  password: string;
  photoURL: string;
}
