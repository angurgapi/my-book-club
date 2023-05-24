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

  useEffect(() => {
    const unListen = onAuthStateChanged(getFirebaseAuth, (userAuth) => {
      if (!userAuth) return;
      console.log('userAuth', userAuth);
      dispatch(
        setUser({
          // events: [...userAuth.events] || [],
          // createdAt: userAuth.createdAt || [],
          displayName: userAuth.displayName,
          // photoURL: userAuth.photoURL,
          // images: [...userAuth.images],
          uid: userAuth.uid,
          isAuth: true,
        })
      );

      onSnapshot(doc(db, 'users', userAuth.uid), (doc) => {
        console.log('on snapshot!', userAuth.uid, db);
        const userData: DocumentData | undefined = doc.data();
        console.log(userData);
        if (!userData) return;

        // Realtime Database
        // const userRef = ref(rdb, `users/${userData.uid}`);

        // const connectedRef = ref(rdb, '.info/connected');

        // onValue(connectedRef, (snap) => {
        //   if (snap.val() === true) {
        //     set(userRef, {
        //       events: [...userData.events],
        //       createdAt: userData.createdAt,
        //       displayName: userData.displayName,
        //       email: userData.email,
        //       password: userData.password,
        //       photoURL: userData.photoURL,
        //       images: [...userData.images],
        //       uid: userData.uid,
        //       isOnline: true,
        //     });
        //   }
        // });

        const usersRef = ref(rdb, 'users');

        onValue(usersRef, (snapshot) => {
          const data = snapshot.val();
          setUsersRdb(data);
        });
      });
    });

    return () => {
      unListen();
    };
    // eslint-disable-next-line
  }, []);

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
