import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';

import { updateUserProfile } from '../utils/updateProfile';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import DefaultLayout from '../layouts/default';

import { BsFillPencilFill } from 'react-icons/bs';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setUser } from '@/store/reducers/UserSlice';
import { useAppDispatch } from '@/hooks/redux';

const Dashboard = () => {
  const router = useRouter();
  const { uid, displayName } = useAppSelector((state) => state.user);
  const { db, getFirebaseAuth } = useAuth();
  //   const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(displayName || '');
  const [edit, setEdit] = useState(false);

  const changeUpdateMode = () => {
    edit ? handleUpdateProfile() : setEdit(true);
  };
  const dispatch = useAppDispatch();

  const handleUpdateProfile = async () => {
    if (!uid || !getFirebaseAuth.currentUser) return;
    if (userName?.trim().length === 0) {
      console.log('enter something');
      return;
    }

    await updateProfile(getFirebaseAuth.currentUser, {
      displayName: userName?.trim(),
    });

    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, { displayName: userName?.trim() }, { merge: true });
    dispatch(
      setUser({
        displayName: userName?.trim(),
      })
    );
    setEdit(false);
  };

  return (
    <DefaultLayout>
      <PageHead pageTitle="Dashboard" />
      {!loading && (
        <div className="p-2 md:p-5 text-center">
          <h2 className="text-xl">Welcome to dashboard</h2>
          <div className="user-data flex flex-col ">
            <div className="flex flex-col items-center justify-center md:flex-row my-2">
              <label htmlFor="name" className="mr-2">
                Your name
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
                    {edit && <IoMdCheckmarkCircle className="text-lime-600" />}
                    {!edit && <BsFillPencilFill className="text-teal-500" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button className="my-2">Log out</button>
        </div>
      )}
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Dashboard;
