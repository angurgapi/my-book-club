import { createContext, FC, useMemo } from 'react';
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
} from 'firebase/firestore';
import {
  getDatabase,
  Database,
} from 'firebase/database';
import { FirebaseStorage, getStorage } from 'firebase/storage';

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
}

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider: FC<Props> = ({ children }) => {
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
    }),
    // eslint-disable-next-line
    [getFirebaseAuth, db, storage, rdb]
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};
