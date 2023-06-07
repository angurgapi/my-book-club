import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/hooks/redux';

import PageHead from '@/components/global/Head';
import Loader from '@/components/global/Loader';
import ProfileLayout from '@/layouts/profile';
import UserEvents from '@/components/events/UserEvents';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button } from '@mui/material';

const HostedEvents = () => {
  const { uid } = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <ProfileLayout>
      <PageHead pageTitle="Dashboard" />
      {!loading && (
        <div className="p-[24px] md:p-5 text-center">
          <div className="flex items-center justify-center mb-3">
            <h2 className="text-3xl">Hosted events</h2>
            <Button
              component={Link}
              href="/event/create"
              variant="contained"
              color="primary"
            >
              <AddCircleOutlineIcon className="mr-2 text-white" /> New
            </Button>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start">
            <div className="flex flex-col w-full justify-center items-center bg-slate-100 p-3">
              <UserEvents uid={uid} />
            </div>
          </div>
        </div>
      )}
      {loading && <Loader />}
    </ProfileLayout>
  );
};

export default HostedEvents;
