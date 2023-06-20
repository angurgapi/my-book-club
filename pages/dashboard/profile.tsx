import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChangeEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'firebase/auth';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import ProfileLayout from '@/layouts/profile';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import EditIcon from '@mui/icons-material/Edit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { useAppSelector, useAppDispatch } from '@/hooks/redux';

import { updateUser, uploadUserpic } from '@/utils/profileApi';
import { setUser, removeUser } from '@/store/reducers/UserSlice';
import {
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
  const { getFirebaseAuth } = useAuth();

  const [imgSrc, setImgSrc] = useState('');

  const [profilePic, setProfilePic] = useState('');
  const [cropperOpen, setCropperOpen] = useState(false);

  //   const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState(user.displayName || '');
  const [edit, setEdit] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();

  const openFileInput = () => {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click();
    }
  };

  const onImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
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

  const onCropApply = async (file: any) => {
    setCropperOpen(false);
    const picUrl = await uploadUserpic(user.uid, file);

    if (picUrl) {
      setProfilePic(picUrl);
      await updateUser(user.uid, { photoURL: picUrl });
      dispatch(
        setUser({
          ...user,
          photoURL: picUrl,
        })
      );
    }
  };

  const changeUpdateMode = () => {
    edit ? updateUsername() : setEdit(true);
  };

  const updateUsername = async () => {
    setEdit(false);
    if (userName?.trim().length) {
      await updateUser(user.uid, { displayName: userName?.trim() });
      setUserName(userName.trim());

      dispatch(
        setUser({
          ...user,
          displayName: userName.trim(),
        })
      );
    } else {
      setUserName(user.displayName);
    }
  };

  const logout = async () => {
    await signOut(getFirebaseAuth);
    dispatch(removeUser());
    // router.push('/');
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
                <Image
                  fill
                  alt="userpic"
                  src={user.photoURL || '/images/avatar-placeholder.webp'}
                />
                <IconButton
                  aria-label="Upload avatar picture"
                  size="small"
                  color="primary"
                  onClick={openFileInput}
                  sx={{ backgroundColor: '#fff' }}
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
              <div className="flex flex-col items-start justify-start md:ml-5">
                <label htmlFor="name" className="mr-2">
                  E-mail
                </label>
                <Input
                  placeholder="e-mail"
                  disabled
                  value={user.email}
                  sx={{
                    input: { color: 'primary.main' },
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: '#000',
                    },
                  }}
                />
              </div>
            </div>
            <Button variant="contained" onClick={logout} sx={{ mt: 4 }}>
              Log out
            </Button>
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
