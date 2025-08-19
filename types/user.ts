import { IEvent } from './event';

export interface IUser {
  createdAt?: string;
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  isAuth?: boolean;
}

export interface IUserState {
  createdAt: string;
  displayName: string;
  email: string;
  photoURL: string;
  uid: string;
  isAuth?: boolean;
}
