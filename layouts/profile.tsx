import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';
import Sidebar from '@/components/global/Sidebar';

import { useTheme } from '@mui/material';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { SCREENS } from '@/styles/breakpoints';
import { useMediaQuery } from '@/hooks/useMediaQuery';

type LayoutProps = {
  children: ReactNode;
};

const ProfileLayout: React.FC<LayoutProps> = ({ children }) => {
  const theme = useTheme();
  const { isAuth } = useRequireAuth();
const isMdUp = useMediaQuery(`(min-width: ${SCREENS.md})`);

  if (!isAuth) {
    return null;
  }
  return (
    <>
      <Header />
      <main className="wrapper flex flex-col">
        <div className={`w-full max-w-[1100px] mx-auto grid grid-cols-1 gap-4 px-2 md:px-0 ${isMdUp ? 'wrapper__grid' : ''}`}>
          <aside className="hidden md:block md:bg-[#ebb2b6]">
            <Sidebar />
          </aside>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfileLayout;
