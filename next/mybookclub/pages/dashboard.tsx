import React, { useState } from 'react';
import { useRouter } from 'next/router';
import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import DefaultLayout from '../layouts/default';

import { BsFillPencilFill } from 'react-icons/bs';
import { AiFillPlusSquare } from 'react-icons/ai';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { useAppSelector } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { setUser, removeUser } from '@/store/reducers/UserSlice';
import { useAppDispatch } from '@/hooks/redux';
import UserEvents from '@/components/events/UserEvents';
import { EventModal } from '@/components/events/EventModal';

const Dashboard = () => {
  const { uid, displayName } = useAppSelector((state) => state.user);
  const { db, getFirebaseAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(displayName || '');
  const [edit, setEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

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
          <h2 className="text-3xl">Welcome to dashboard</h2>
          <div className="user-data flex flex-col ">
            <div className="flex flex-col items-center justify-center md:flex-row my-2">
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
                    {edit && <IoMdCheckmarkCircle className="text-lime-600" />}
                    {!edit && <BsFillPencilFill className="text-teal-500" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button className="my-2 text-slate-500" onClick={logOut}>
            Log out
          </button>

          <div className="flex flex-col justify-center items-center bg-slate-100 p-3">
            <div className="flex items-center">
              {' '}
              <h3 className="text-2xl">My events</h3>
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center rounded ml-2 bg-teal-600 text-white p-2"
              >
                New <AiFillPlusSquare className="ml-3 text-white" />
              </button>
            </div>
            <UserEvents uid={uid} />
          </div>

          <EventModal
            openModal={modalOpen}
            handleCloseModal={() => setModalOpen(false)}
          />
        </div>
      )}
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Dashboard;
