import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';
import Sidebar from '@/components/global/Sidebar';

import { useMediaQuery, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppSelector } from '@/hooks/redux';

type LayoutProps = {
  children: ReactNode;
};

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const router = useRouter();
  const { isAuth } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isAuth) {
      router.replace('/auth');
    }
  }, [isAuth, router]);

  return (
    <>
      <Header />
      <main className="wrapper flex flex-col">
        {isAuth ? (
          <div className="wrapper__content wrapper__content--sided profile-page">
            {!isMobile && <Sidebar />}
            {children}
          </div>
        ) : (
          <span>...redirecting to main</span>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ProfileLayout;
