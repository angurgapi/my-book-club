import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';
import Sidebar from '@/components/global/Sidebar';

import { useMediaQuery, useTheme } from '@mui/material';

type LayoutProps = {
  children: ReactNode;
};

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Header />
      <main className="wrapper flex flex-col">
        <div className="wrapper__content wrapper__content--sided profile-page">
          {!isMobile && <Sidebar />}
          <>{children}</>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfileLayout;
