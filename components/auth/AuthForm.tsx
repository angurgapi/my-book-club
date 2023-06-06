import React, { useEffect, useState, SyntheticEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

import { useAuth } from '@/hooks/useAuth';
import { IUserData } from '@/types/user';
import { IAuthData } from '@/types/auth';

import MailOutlineIcon from '@mui/icons-material/MailOutline';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Person2Icon from '@mui/icons-material/Person2';

import { toast } from 'react-toastify';

interface AuthFormProps {
  mode: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { getFirebaseAuth, db } = useAuth();
  const router = useRouter();

  const [userData, setUserData] = useState<IUserData>({
    displayName: '',
    email: '',
    password: '',
    photoURL: '',
  });

  // const [authData, setAuthData] = useState<IAuthData>({
  //   invalidEmail: false,
  //   invalidPassword: false,
  //   wrongPassword: false,
  //   userNotFound: false,
  //   alreadyInUseEmail: false,
  // });

  const [value, setValue] = useState(0);

  const sendErrorToast = (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      theme: 'light',
    });
  };

  const logExistingUser = async (email: string, password: string) => {
    await signInWithEmailAndPassword(getFirebaseAuth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        router.push('/dashboard');
      })
      .catch((error) => {
        error.code === 'auth/user-not-found' &&
          sendErrorToast('There is no user with these credentials!');
        error.code === 'auth/wrong-password' &&
          sendErrorToast('The password is wrong!');
      });
  };

  // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
  //   setValue(newValue);
  //   setAuthData({
  //     ...authData,
  //     invalidEmail: false,
  //     invalidPassword: false,
  //     wrongPassword: false,
  //     userNotFound: false,
  //   });
  //   setUserData({
  //     email: '',
  //     password: '',
  //     displayName: '',
  //     photoURL: '',
  //   });
  // };

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === 'register') {
      await createUserWithEmailAndPassword(
        getFirebaseAuth,
        userData.email,
        userData.password
      )
        .then(async (userCredential: any) => {
          const user = userCredential.user;

          await updateProfile(user, {
            displayName: userData.displayName,
          });

          try {
            await setDoc(doc(db, 'users', user.uid), {
              uid: user.uid,
              displayName: user.displayName || '',
              email: user.email,
              password: userData.password,
              photoURL: user.photoURL,
              createdAt:
                user.metadata.creationTime &&
                +new Date(user.metadata.creationTime).getTime(),
            });
            logExistingUser(userData.email, userData.password);
          } catch (e) {
            console.error('Error adding document: ', e);
          }
        })
        .catch((error) => {
          error.code === 'auth/invalid-email' &&
            sendErrorToast('Invald email!');
          error.code === 'auth/email-already-in-use' &&
            sendErrorToast('This email is already in use!');
          error.code === 'auth/weak-password' &&
            sendErrorToast('Password chosen is too insecure!');
        });
    } else {
      logExistingUser(userData.email, userData.password);
      // await signInWithEmailAndPassword(
      //   getFirebaseAuth,
      //   userData.email,
      //   userData.password
      // )
      //   .then((userCredential) => {
      //     console.log(userCredential);
      //     router.push('/dashboard');
      //   })
      //   .catch((error) => {
      //     error.code === 'auth/user-not-found' &&
      //       setAuthData({ ...authData, userNotFound: true });
      //     error.code === 'auth/wrong-password' &&
      //       setAuthData({ ...authData, wrongPassword: true });
      //   });
    }
  };
  return (
    <form
      className="w-full flex flex-col justify-center"
      onSubmit={handleSubmit}
    >
      {mode === 'register' && (
        <>
          <label htmlFor="displayName">User name</label>
          <div className="w-full relative">
            <input
              type="text"
              name="displayName"
              className="border px-10 py-2 mb-3 rounded-md w-full"
              required
              value={userData.displayName}
              onChange={(e) =>
                setUserData({ ...userData, displayName: e.target.value })
              }
            />
            <Person2Icon className=" absolute left-4 top-3 text-gray-300 text-xl" />
          </div>
        </>
      )}
      <label htmlFor="email">Email address</label>
      <div className="w-full relative">
        <input
          type="email"
          name="email"
          className="border px-10 py-2 mb-3 rounded-md w-full"
          required
          value={userData.email}
          onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        />
        <MailOutlineIcon className=" absolute left-4 top-3 text-gray-300 text-xl" />
      </div>
      <label htmlFor="password">Password</label>
      <div className="w-full relative">
        <input
          type="password"
          name="password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          className="border px-10 py-2 mb-4 rounded-md w-full"
          required
        />
        <VpnKeyIcon className=" absolute left-4 top-3 text-gray-300 text-xl" />
      </div>
      <button
        type="submit"
        className="bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md"
      >
        {mode === 'register' ? 'Create account' : 'Log in'}
      </button>
    </form>
  );
};

export default AuthForm;
