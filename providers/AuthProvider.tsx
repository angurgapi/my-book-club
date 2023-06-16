import { createContext, FC, useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  Auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
} from 'firebase/auth';
import {
  getFirestore,
  Firestore,
  onSnapshot,
  DocumentData,
  doc,
  collection,
  query,
} from 'firebase/firestore';
import {
  getDatabase,
  ref,
  onValue,
  onDisconnect,
  set,
  serverTimestamp,
  Database,
} from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';

import { useAppDispatch } from '@/hooks/redux';
import { setUser } from '@/store/reducers/UserSlice';

import { IUser } from '@/types/user';

type Props = {
  children: any;
};

interface IContext {
  getFirebaseAuth: Auth;
  db: Firestore;
  storage: FirebaseStorage;
  googleProvider: GoogleAuthProvider;
  facebookProvider: FacebookAuthProvider;
  rdb: Database;
  usersRdb: any;
}

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider: FC<Props> = ({ children }) => {
  const [usersRdb, setUsersRdb] = useState<any>({});

  const dispatch = useAppDispatch();

  const getFirebaseAuth = getAuth();
  const db = getFirestore();
  const storage = getStorage();
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const rdb = getDatabase();

  const values = useMemo(
    () => ({
      getFirebaseAuth,
      db,
      storage,
      googleProvider,
      facebookProvider,
      rdb,
      usersRdb,
    }),
    // eslint-disable-next-line
    [getFirebaseAuth, db, storage, rdb, usersRdb]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
