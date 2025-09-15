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
import Loader from '../global/Loader';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const schemaFor = (mode: 'register' | 'login') =>
  Yup.object({
    displayName: mode === 'register'
      ? Yup.string().trim().min(3, 'At least 3 chars').required('Required')
      : Yup.string().strip(),
    email: Yup.string().trim().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Min 6 chars').required('Required'),
  });

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

  const [isLoading, setIsLoading] = useState(false);
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
      setIsLoading(true);
      const { user } = await signInWithEmailAndPassword(
        getFirebaseAuth,
        email,
        password
      );
      setIsLoading(false);
      const userDetails = await getDoc(doc(db, 'users', user.uid));
      dispatch(setUser({ ...userDetails.data(), isAuth: true } as IUser));
      router.push('/dashboard/profile');
    } catch (error: any) {
      setIsLoading(false);
      if (error.code === 'auth/user-not-found') {
        sendErrorToast('There is no user with these credentials');
      }
      if (error.code === 'auth/wrong-password') {
        sendErrorToast('Provided password is incorrect');
      }
    }
  };

  // const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   if (mode === 'register') {
  //     setIsLoading(true);
  //     await createUserWithEmailAndPassword(
  //       getFirebaseAuth,
  //       userData.email,
  //       userData.password
  //     )
  //       .then(async (userCredential: any) => {
  //         const user = userCredential.user;

  //         await updateProfile(user, {
  //           displayName: userData.displayName,
  //         });

  //         try {
  //           await setDoc(doc(db, 'users', user.uid), {
  //             uid: user.uid,
  //             displayName: user.displayName || '',
  //             email: user.email,
  //             photoURL: user.photoURL,
  //             createdAt:
  //               user.metadata.creationTime &&
  //               +new Date(user.metadata.creationTime).getTime(),
  //           });

  //           dispatch(setUser(user));
  //           logExistingUser(userData.email, userData.password);
  //           setIsLoading(false);
  //         } catch (e) {
  //           console.error('Error adding document: ', e);
  //           setIsLoading(false);
  //         }
  //       })
  //       .catch((error) => {
  //         error.code === 'auth/invalid-email' &&
  //           sendErrorToast('Invald email!');
  //         error.code === 'auth/email-already-in-use' &&
  //           sendErrorToast('This email is already in use!');
  //         error.code === 'auth/weak-password' &&
  //           sendErrorToast('Password chosen is too insecure!');
  //       });
  //   } else {
  //     logExistingUser(userData.email, userData.password);
  //   }
  // };
  const formik = useFormik({
    initialValues: { displayName: '', email: '', password: '' },
    enableReinitialize: true,             
    validationSchema: schemaFor(mode as 'register' | 'login'),
    validateOnMount: true,                 
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);
      setIsLoading(true);
      try {
        if (mode === 'register') {
          const { user } = await createUserWithEmailAndPassword(getFirebaseAuth, values.email, values.password);
          await updateProfile(user, { displayName: values.displayName });
          await setDoc(doc(db, 'users', user.uid), {
            uid: user.uid,
            displayName: user.displayName || '',
            email: user.email,
            photoURL: user.photoURL,
            createdAt: user.metadata.creationTime && +new Date(user.metadata.creationTime).getTime(),
          });
          dispatch(setUser(user as IUser));
          await logExistingUser(values.email, values.password);
        } else {
          await logExistingUser(values.email, values.password);
        }
        // resetForm(); 
      } catch (e: any) {
          e.code === 'auth/invalid-email' &&
            sendErrorToast('Invald email!');
          e.code === 'auth/email-already-in-use' &&
            sendErrorToast('This email is already in use!');
          e.code === 'auth/weak-password' &&
            sendErrorToast('Password chosen is too insecure!');
      } finally {
        setIsLoading(false);
        setSubmitting(false);
      }
    },
  });

  const { values, handleChange, handleSubmit, isValid, dirty, isSubmitting, errors, touched, getFieldProps } = formik;
  const disableSubmit = isLoading || isSubmitting || !isValid || !dirty;
  return (
    <form
      className="w-full flex flex-col justify-center overflow-x-hidden"
      onSubmit={handleSubmit}
    >
      {mode === 'register' && (
        <>
        <div className='flex flex-col items-start justify-start w-full'>
          <span>User name</span>
          <div className="relative h-[48px] w-full mb-2">
            <input
              className="absolute w-full border-b border-gray-300 focus:border-black bg-transparent outline-none p-1 pl-8 text-[16px] mt-1"
              type="text"              
              required         
              {...getFieldProps('displayName')}
            />
            <Person2Icon className="absolute left-1 top-2 text-gray-300 text-xl" />
          </div>  
        </div>
        </>
      )}
       <div className='flex flex-col items-start justify-start w-full'>
          <span>Email address</span>
          <div className="relative h-[48px] w-full">
              <input
                className="w-full border-b border-gray-300 focus:border-black bg-transparent outline-none p-1 pl-8 text-[16px] mt-1 mb-2"
                type="email"
                required
                {...getFieldProps('email')}
              />
              <MailOutlineIcon className="absolute left-1 top-2 text-gray-300 text-xl" />
          </div>
        </div>
      <div className='flex flex-col items-start justify-start w-full'>
        <span>Password</span>   
        <div className="relative h-[48px] w-full">
          <input
          className='absolute w-full border-b border-gray-300 focus:border-black bg-transparent outline-none p-1 pl-8 text-[16px] mt-1'
            type={isPasswordVisible ? 'text' : 'password'}
            required
            {...getFieldProps('password')}
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
         {touched.password && errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
   </div>
      <button
        type="submit"
        className="bg-[#FFD95A] p-2 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mt-4 mb-3 text-[18px] rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disableSubmit}
      >
        {isLoading || isSubmitting ? <Loader /> : <span>{mode === 'register' ? 'Create account' : 'Sign in'}</span>}
      </button>
    </form>
  );
};

export default AuthForm;
