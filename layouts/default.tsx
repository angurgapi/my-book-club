import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';

type LayoutProps = {
  children: ReactNode;
  landing?: boolean;
};

const DefaultLayout: React.FC<LayoutProps> = ({
  children,
  landing = false,
}) => {
  return (
    <>
      <Header />
      <main className="wrapper flex flex-col">
        <div
          className={
            'wrapper__content' + (landing ? '' : ' wrapper__content--sided')
          }
        >
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
