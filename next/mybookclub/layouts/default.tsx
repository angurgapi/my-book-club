import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Navbar from '../components/global/Navbar';

type LayoutProps = {
  children: ReactNode;
};

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main className='wrapper flex flex-col'>{children}</main>
      <Footer />
    </div>
  );
};

export default DefaultLayout;