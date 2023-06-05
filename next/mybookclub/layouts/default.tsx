import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Navbar from '../components/global/Navbar';
import Header from '@/components/global/Header';

type LayoutProps = {
  children: ReactNode;
};

const DefaultLayout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      {/* <Navbar /> */}
      <Header />
      <main className="wrapper flex flex-col bg-amber-50">
        <div className="wrapper__content">{children}</div>
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
