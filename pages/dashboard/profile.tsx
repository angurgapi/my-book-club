import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import ProfileLayout from '@/layouts/profile';
import UserEvents from '@/components/events/UserEvents';
import placeholder from '@/images/avatar-placeholder.webp';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import {
  getStorage,
  getDownloadURL,
  ref,
  uploadString,
} from 'firebase/storage';

import { setUser, removeUser } from '@/store/reducers/UserSlice';
import {
  Avatar,
  Button,
  IconButton,
  Input,
  InputAdornment,
  Typography,
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import { CropperModal } from '@/components/events/CropperModal';

const DashboardProfile = () => {
  const user = useAppSelector((state) => state.user);
  const { db, getFirebaseAuth } = useAuth();
  const [imgSrc, setImgSrc] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);

  //   const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(user.displayName || '');
  const [edit, setEdit] = useState(false);

  const dispatch = useAppDispatch();

  const openFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const onImageSelect = (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const preview = reader.result?.toString() || '';
        console.log(preview);
        if (preview) {
          setImgSrc(preview);
          setCropperOpen(true);
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropApply = (file: Blob) => {
    console.log(file);
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        setProfilePic(readerEvent.target?.result);
        console.log('profilePic', profilePic);
        handleUpdateAvatar();

        setCropperOpen(false);
      };
    }
  };

  const handleUpdateAvatar = async () => {
    if (profilePic) {
      const storage = getStorage();
      const imageRef = ref(storage, `users/${user.uid}/image`);
      const docRef = doc(db, 'users', user.uid);
      await uploadString(imageRef, profilePic, 'data_url').then(async () => {
        const downloadURL = await getDownloadURL(imageRef);

        await updateDoc(doc(db, 'users', docRef.id), {
          photoURL: downloadURL,
        });
        dispatch(
          setUser({
            ...user,
            photoURL: downloadURL,
          })
        );
      });
    }
  };

  const changeUpdateMode = () => {
    edit ? handleUpdateProfile() : setEdit(true);
  };

  //   const router = useRouter();

  const handleUpdateProfile = async () => {
    if (!user.uid || !getFirebaseAuth.currentUser) return;
    if (userName?.trim().length === 0) {
      setUserName(user.displayName || '');
      setEdit(false);
      return;
    }

    await updateProfile(getFirebaseAuth.currentUser, {
      displayName: userName?.trim(),
    });

    const docRef = doc(db, 'users', user.uid);
    await updateDoc(docRef, { displayName: userName?.trim() });
    dispatch(
      setUser({
        ...user,
        displayName: userName?.trim(),
      })
    );
    setEdit(false);
  };
  return (
    <ProfileLayout>
      <PageHead pageTitle="Dashboard" />
      <div className="flex flex-col md:flex-row items-center md:items-start">
        <Card className="w-full">
          <CardContent>
            <Typography variant="h3" gutterBottom>
              My profile
            </Typography>
            <div className="flex flex-col md:flex-row items-start md:items-start">
              <div className="relative h-[100px] w-[100px]">
                <input
                  type="file"
                  id="fileInput"
                  name="coverUrl"
                  accept="image/*"
                  onChange={onImageSelect}
                  className="hidden"
                />
                <Image fill alt="userpic" src={user.photoURL || placeholder} />
                <IconButton
                  aria-label="Upload avatar picture"
                  color="primary"
                  className="bg-white"
                  onClick={openFileInput}
                >
                  <CameraAltIcon />
                </IconButton>
              </div>
              <div className="flex flex-col items-start justify-start md:ml-5">
                <label htmlFor="name" className="mr-2">
                  Username
                </label>

                <Input
                  placeholder="username"
                  disabled={!edit}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  sx={{
                    input: { color: 'primary.main' },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000',
                    },
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={changeUpdateMode}>
                        {edit && <CheckCircleIcon className="text-lime-600" />}
                        {!edit && <EditIcon className="text-teal-500" />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <CropperModal
          openModal={cropperOpen}
          cropAspect={1 / 1}
          handleCloseModal={() => setCropperOpen(false)}
          onCropApply={onCropApply}
          imgSrc={imgSrc}
        />
      </div>
    </ProfileLayout>
  );
};

export default DashboardProfile;
