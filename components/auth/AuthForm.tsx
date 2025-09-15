import React, { useEffect, useState, SyntheticEvent, useCallback } from 'react';
import { useRouter } from 'next/router';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

import { useAuth } from '@/hooks/useAuth';
import { IUser } from '@/types/user';
import { IAuthData } from '@/types/auth';
import { setUser } from '@/store/reducers/UserSlice';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import KeyIcon from '@mui/icons-material/Key';
import Person2Icon from '@mui/icons-material/Person2';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAppDispatch } from '@/hooks/redux';
import { Input, InputAdornment, InputLabel } from '@mui/material';

interface AuthFormProps {
  mode: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { getFirebaseAuth, db } = useAuth();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [userData, setUserData] = useState<IAuthData>({
    displayName: '',
    email: '',
    password: '',
  });

  const sendErrorToast = (message: string) => {
    toast.error(message, {
      position: 'top-right',
      autoClose: 5000,
      closeOnClick: true,
      pauseOnHover: true,
      theme: 'light',
    });
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    setUserData({ displayName: '', email: '', password: '' });
  }, [mode]);

  const logExistingUser = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(
        getFirebaseAuth,
        email,
        password
      );
      const userDetails = await getDoc(doc(db, 'users', user.uid));
      dispatch(setUser({ ...userDetails.data(), isAuth: true } as IUser));
      router.push('/dashboard/profile');
    } catch (error: any) {
      if (error.code === 'auth/user-not-found') {
        sendErrorToast('There is no user with these credentials!');
      }
      if (error.code === 'auth/wrong-password') {
        sendErrorToast('The password is wrong!');
      }
    }
  };

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
              photoURL: user.photoURL,
              createdAt:
                user.metadata.creationTime &&
                +new Date(user.metadata.creationTime).getTime(),
            });

            dispatch(setUser(user));
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
    }
  };
  return (
    <form
      className="w-full flex flex-col h-full grow justify-center overflow-x-hidden"
      onSubmit={handleSubmit}
    >
      {mode === 'register' && (
        <>
          <InputLabel htmlFor="displayName">User name</InputLabel>

          <Input
            type="text"
            name="displayName"
            required
            value={userData.displayName}
            onChange={(e) =>
              setUserData({ ...userData, displayName: e.target.value })
            }
            startAdornment={
              <InputAdornment position="start">
                <Person2Icon className="text-gray-300 text-xl" />
              </InputAdornment>
            }
            sx={{ mb: 2 }}
          />
        </>
      )}
      <InputLabel htmlFor="email">Email address</InputLabel>

      <Input
        type="email"
        name="email"
        required
        value={userData.email}
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
        startAdornment={
          <InputAdornment position="start">
            <MailOutlineIcon className="text-gray-300 text-xl" />
          </InputAdornment>
        }
        sx={{ mb: 2 }}
      />

      <div className='flex flex-col items-start justify-start w-full'>
        <span>Password</span>
   
      <div className="relative h-[48px] w-full">
        <input
        className='absolute w-full border-b border-gray-300 focus:border-black bg-transparent outline-none p-1 pl-8 text-[16px] mt-1'
          type={isPasswordVisible ? 'text' : 'password'}
          name="password"
          value={userData.password}
          onChange={(e) =>
            setUserData({ ...userData, password: e.target.value })
          }
          required
        />

        <KeyIcon className="absolute left-1 top-2 text-gray-300 text-xl" />
        <button className='h-[32px] w-[32px] absolute right-0 top-1 flex items-center justify-center text-gray-300' type="button" onClick={() => setIsPasswordVisible(!isPasswordVisible)}>
          {isPasswordVisible ? (
            <VisibilityOff className="text-gray-300 text-xl" />
          ) : (
            <Visibility className="text-gray-300 text-xl" />
          )}
        </button>
      </div>
   </div>
      <button
        type="submit"
        className="bg-[#FFD95A] p-2 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mt-4 mb-3 text-[18px] rounded-md"
      >
        {mode === 'register' ? 'Create account' : 'Sign in'}
      </button>
    </form>
  );
};

export default AuthForm;
