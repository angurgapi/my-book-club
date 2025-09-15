import React, { useState } from 'react';
import Image from 'next/image';
import PageHead from '@/components/global/Head';
import { AuthTabs } from '@/components/auth/AuthTabs';
import DefaultLayout from '@/layouts/default';
import ProvidersAuth from '@/components/auth/ProvidersAuth';
import AuthForm from '@/components/auth/AuthForm';

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState('login');

  return (
    <DefaultLayout>
      <div className="flex flex-col w-full flex-1 items-center justify-center">
      <PageHead pageTitle="Sign in/Sign up" />
        <div className="bg-[#fff] w-[90vw] md:w-[600px] lg:w-[800px] rounded-[18px] h-[70vh] md:h-[60vh] border border-gray flex flex-col md:flex-row items-start justify-center gap-[20px]">
          <div className="w-[50%] bg-[#fcf0c7] h-full rounded-tl-[18px] rounded-bl-[18px] hidden md:flex items-center justify-center">
            <Image
            className="w-full h-auto object-fit rounded-lg"
            src="/images/pile.png"
            alt="user authorization"
            width={250}
            height={400}
            priority
          />
          </div>
          
          <div className="flex flex-col items-between md:items-start w-full h-full p-[20px]">
            <AuthTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <div className='flex flex-col grow items-center md:items-start justify-center md:justify-start w-full gap-4 mt-4'>
              <AuthForm mode={currentTab} />
              <ProvidersAuth />
            </div>
          </div>
          
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AuthPage;
