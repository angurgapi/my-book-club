import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import DefaultLayout from '../layouts/default';
import UserEvents from '@/components/events/UserEvents';
import placeholder from '@/images/avatar-placeholder.webp';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setUser, removeUser } from '@/store/reducers/UserSlice';
import { Button } from '@mui/material';

const DashboardProfile = () => {
  const user = useAppSelector((state) => state.user);
  const { db, getFirebaseAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(user.displayName || '');
  const [edit, setEdit] = useState(false);

  const getAvatarUrl = () => {
    return user.photoURL || placeholder;
  };

  const changeUpdateMode = () => {
    edit ? handleUpdateProfile() : setEdit(true);
  };
  const dispatch = useAppDispatch();
  const router = useRouter();

  const logOut = () => {
    signOut(getFirebaseAuth);
    dispatch(removeUser());
    router.push('/');
  };

  const handleUpdateProfile = async () => {
    if (!user.uid || !getFirebaseAuth.currentUser) return;
    if (userName?.trim().length === 0) {
      console.log('enter something');
      return;
    }

    await updateProfile(getFirebaseAuth.currentUser, {
      displayName: userName?.trim(),
    });

    const docRef = doc(db, 'users', user.uid);
    await setDoc(docRef, { displayName: userName?.trim() }, { merge: true });
    dispatch(
      setUser({
        ...user,
        displayName: userName?.trim(),
      })
    );
    setEdit(false);
  };
  return (
    <DefaultLayout>
    <PageHead pageTitle="Dashboard" />
    <div className="flex flex-col md:flex-row items-center md:items-start">
      <Card className="w-fit">
        <CardContent>
          {/* <Image
                  src={getAvatarUrl()}
                  alt="userPic"
                  width={100}
                  height={100}
                  className="rounded m-auto"
                /> */}
          <div className="flex flex-col items-start justify-center my-2">
            <label htmlFor="name" className="mr-2">
              Username
            </label>
            <div className="max-w-[300px] h-[42px]">
              <div className="w-full h-full relative">
                <input
                  type="text"
                  name="name"
                  className="w-full border px-2 py-2 mb-3 rounded-md"
                  required
                  disabled={!edit}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />

                <button
                  className="absolute right-4 top-3 text-gray-300 text-xl"
                  onClick={changeUpdateMode}
                >
                  {edit && <CheckCircleIcon className="text-lime-600" />}
                  {!edit && <EditIcon className="text-teal-500" />}
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
    </DefaultLayout>
    
};

export default DashboardProfile;
