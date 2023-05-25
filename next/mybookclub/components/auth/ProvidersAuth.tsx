import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { GrFacebook } from 'react-icons/gr';

import { useRouter } from 'next/router';

import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { signInWithPopup } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

const ProvidersAuth = () => {
  const { getFirebaseAuth, db, googleProvider, facebookProvider } = useAuth();

  const handleFacebookLogin = () => {
    signInWithPopup(getFirebaseAuth, facebookProvider)
      .then(async (result) => {
        const user = result.user;
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
                  photoURL: user.photoURL?.slice(0, -6),
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

  return (
    <div className="flex justify-start items-center">
      Enter with
      <button onClick={handleFacebookLogin}>
        <GrFacebook className="mx-2 text-[#3b5998]" />
      </button>
      <button onClick={handleGoogleLogin}>
        <FcGoogle />
      </button>
    </div>
  );
};

export default ProvidersAuth;
