import React, { ReactNode } from 'react';
import Footer from '@/components/global/Footer';
import Header from '@/components/global/Header';

type LayoutProps = {
  children: ReactNode;
  isLanding?: boolean;
};

const DefaultLayout: React.FC<LayoutProps> = ({
  children,
  isLanding = false,
}) => {
  return (
    <>
      <Header />
      <main className="wrapper">
        <div
          className={
            'wrapper__content' + (isLanding ? '' : ' wrapper__content--sided')
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
