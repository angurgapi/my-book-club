import React, { useEffect, useState, SyntheticEvent, useCallback } from 'react';
import { doc, runTransaction, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { useAuth } from '@/hooks/useAuth';
import { IUserData } from '@/types/user';
import { IAuthData } from '@/types/auth';

import { HiMail } from 'react-icons/hi';
import { AiTwotoneLock } from 'react-icons/ai';
import { useRouter } from 'next/router';

export const LoginForm = () => {
  const router = useRouter();
  const { getFirebaseAuth, db, googleProvider, facebookProvider } = useAuth();

  const [userData, setUserData] = useState<IUserData>({
    displayName: '',
    email: '',
    password: '',
    photoURL: '',
  });

  const [authData, setAuthData] = useState<IAuthData>({
    invalidEmail: false,
    invalidPassword: false,
    wrongPassword: false,
    userNotFound: false,
  });

  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setAuthData({
      ...authData,
      invalidEmail: false,
      invalidPassword: false,
      wrongPassword: false,
      userNotFound: false,
    });
    setUserData({
      email: '',
      password: '',
      displayName: '',
      photoURL: '',
    });
  };

  const handleLogin = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(getFirebaseAuth);

    await signInWithEmailAndPassword(
      getFirebaseAuth,
      userData.email,
      userData.password
    )
      .then((userCredential) => {
        console.log(userCredential);
        router.push('/dashboard');
      })
      .catch((error) => {
        error.code === 'auth/user-not-found' &&
          setAuthData({ ...authData, userNotFound: true });
        error.code === 'auth/wrong-password' &&
          setAuthData({ ...authData, wrongPassword: true });
      });
  };

  return (
    <form
      className="w-full flex flex-col justify-center"
      onSubmit={handleLogin}
    >
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
        <HiMail className=" absolute left-4 top-3 text-gray-300 text-xl" />
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
        <AiTwotoneLock className=" absolute left-4 top-3 text-gray-300 text-xl" />
      </div>

      <button
        type="submit"
        className="bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md"
      >
        SIGN IN
      </button>
    </form>
  );
};
