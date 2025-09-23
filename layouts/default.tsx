import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';

type LayoutProps = {
  children: ReactNode;
};

const DefaultLayout: React.FC<LayoutProps> = ({
  children,
}) => {
  return (
    <>
      <Header />
      <main className="wrapper">
        <div className='w-full flex-1 flex items-center justify-center h-full'>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
