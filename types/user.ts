import { IEvent } from './event';

export interface IUser {
  events: IEvent[];
  createdAt?: string;
  displayName: string;
  email: string;
  // password?: string;
  photoURL: string;
  uid: string;
  isAuth?: boolean;
}

export interface IUserState {
  events: IEvent[];
  createdAt: string;
  displayName: string | null;
  email: string;
  // password?: string | null;
  photoURL: string;
  uid: string;
  isAuth?: boolean;
}

export interface IUserData {
  displayName: string;
  email: string;
  password: string;
  photoURL: string;
}
