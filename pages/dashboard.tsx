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

const Dashboard = () => {
  const { uid, displayName, photoURL } = useAppSelector((state) => state.user);
  const { db, getFirebaseAuth } = useAuth();

  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(displayName || '');
  const [edit, setEdit] = useState(false);

  const getAvatarUrl = () => {
    return photoURL || placeholder;
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
        <div className="p-[24px] md:p-5 text-center">
          <div className="flex items-center justify-center mb-3">
            <h2 className="text-3xl">Welcome to dashboard </h2>
            <button
              className="ml-3 flex items-center text-slate-500"
              onClick={logOut}
            >
              Log out
              {/* <LogoutIcon /> */}
            </button>
          </div>

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

            <div className="flex flex-col w-full justify-center items-center bg-slate-100 p-3">
              <div className="flex items-center">
                {' '}
                <h3 className="text-2xl">My events</h3>
                {/* <Link
                  href="/event/create"
                  className="btn ml-2 bg-teal-600 text-white p-2"
                >
                  <AddCircleOutlineIcon className="mr-2 text-white" /> New
                </Link> */}
                <Button
                  component={Link}
                  href="/event/create"
                  variant="contained"
                  color="primary"
                >
                  <AddCircleOutlineIcon className="mr-2 text-white" /> New
                </Button>
                {/* <button
                onClick={() => setModalOpen(true)}
                className="flex items-center rounded ml-2 bg-teal-600 text-white p-2"
              >
                New <AiFillPlusSquare className="ml-3 text-white" />
              </button> */}
              </div>
              <UserEvents uid={uid} />
            </div>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </DefaultLayout>
  );
};

export default Dashboard;
