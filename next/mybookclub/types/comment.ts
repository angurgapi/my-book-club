import { IUser } from './user';

export interface IComment {
  author: IUser;
  content: string;
  createdAt: string;
  id: string;
  likes: IUser[];
  images: string[];
}
