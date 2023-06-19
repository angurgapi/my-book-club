import React from 'react';
import { useRouter } from 'next/router';

import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';

import { useAuth } from '@/hooks/useAuth';
import { setUser } from '@/store/reducers/UserSlice';
import { useAppDispatch } from '@/hooks/redux';

import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import { IconButton } from '@mui/material';
import { IUser } from '@/types/user';

const ProvidersAuth = () => {
  const { getFirebaseAuth, db, googleProvider, facebookProvider } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleFacebookLogin = () => {
    signInWithPopup(getFirebaseAuth, facebookProvider)
      .then(async (result) => {
        const user = result.user;
        const docRef = doc(db, 'users', user.uid);

        try {
          await runTransaction(db, async (transaction) => {
            const sfDoc = await transaction.get(docRef);
            console.log(sfDoc.exists());
            if (!sfDoc.exists()) {
              try {
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: user.displayName || '',
                  email: user.email,
                  photoURL: user.photoURL,
                  createdAt:
                    user.metadata.creationTime &&
                    +new Date(user.metadata.creationTime).getTime(),
                });
              } catch (e) {
                console.error('Error adding document: ', e);
              }
            }
          });
        } catch (e) {
          console.log('runTransaction Auth failed: ', e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('----------------', errorCode, errorMessage);
      });
  };

  const handleGoogleLogin = () => {
    signInWithPopup(getFirebaseAuth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        console.log('google auth response', user);
        const docRef = doc(db, 'users', user.uid);

        try {
          await runTransaction(db, async (transaction) => {
            const docSnap = await transaction.get(docRef);
            console.log(docSnap.exists());
            //successfull google auth & not the first
            if (docSnap.exists()) {
              dispatch(setUser(docSnap.data() as IUser));
              console.log('docsnap data:', docSnap.data());
            }
            //successfull google auth but no user doc yet
            else {
              console.log('new user, google auth');
              const userData = {
                uid: user.uid,
                displayName: user.displayName || '',
                email: user.email,
                photoURL: user.photoURL,
                events: [],
                createdAt:
                  user.metadata.creationTime &&
                  +new Date(user.metadata.creationTime).getTime(),
              };
              try {
                await setDoc(docRef, userData);
                dispatch(setUser({ ...userData, isAuth: true } as IUser));
              } catch (e) {
                console.error('Error adding document: ', e);
              }
            }
          });
          router.push('/dashboard/profile');
        } catch (e) {
          console.log('runTransaction Auth failed: ', e);
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('----------------', errorCode, errorMessage);
      });
  };

  return (
    <div className="flex justify-start items-center">
      Enter with
      {/* <IconButton onClick={handleFacebookLogin}>
        <FacebookIcon className="mx-2 text-[#3b5998]" />
      </IconButton> */}
      <IconButton onClick={handleGoogleLogin}>
        <GoogleIcon className="text-[#4285F4]" />
      </IconButton>
    </div>
  );
};

export default ProvidersAuth;
