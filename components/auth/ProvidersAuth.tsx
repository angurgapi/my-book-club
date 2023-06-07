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

const ProvidersAuth = () => {
  const { getFirebaseAuth, db, googleProvider, facebookProvider } = useAuth();
  const router = useRouter();
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
                  password: null,
                  photoURL: user.photoURL,
                  events: [],
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
            const sfDoc = await transaction.get(docRef);

            if (!sfDoc.exists()) {
              try {
                await setDoc(docRef, {
                  uid: user.uid,
                  displayName: user.displayName || '',
                  email: user.email,
                  password: null,
                  photoURL: user.photoURL,
                  events: [],
                  createdAt:
                    user.metadata.creationTime &&
                    +new Date(user.metadata.creationTime).getTime(),
                });
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
      <IconButton onClick={handleFacebookLogin}>
        <FacebookIcon className="mx-2 text-[#3b5998]" />
      </IconButton>
      <IconButton onClick={handleGoogleLogin}>
        <GoogleIcon className="text-[#4285F4]" />
      </IconButton>
    </div>
  );
};

export default ProvidersAuth;
