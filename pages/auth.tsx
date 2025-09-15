import React, { useState } from 'react';
import Image from 'next/image';
import PageHead from '@/components/global/Head';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegistrationForm } from '@/components/auth/RegForm';
import { AuthTabs } from '@/components/auth/AuthTabs';
import DefaultLayout from '@/layouts/default';

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState('login');

  return (
    <DefaultLayout>
      <PageHead pageTitle="Sign in/Sign up" />
      <div className="flex flex-col w-full h-full grow items-center justify-center">
        <div className="bg-[#fff] w-[90vw] md:w-[600px] rounded-[18px] p-[20px] h-[80vh] md:h-[60vh] border border-gray flex flex-col md:flex-row items-start justify-center gap-[20px]">
          <div className="flex flex-col w-full">
            <AuthTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            {currentTab === 'login' && (
              <div>
                <LoginForm />
              </div>
            )}
            {currentTab === 'register' && (
              <div>
                <RegistrationForm />
              </div>
            )}
          </div>
          <Image
            className="login w-[45%] h-auto hidden md:flex"
            src="/images/signin.jpg"
            alt="user authorization"
            width={600}
            height={400}
            priority
          />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default AuthPage;
