import React, { useState } from 'react';
import PageHead from '@/components/global/Head';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegistrationForm } from '@/components/auth/RegForm';
import { Card, CardContent } from '@mui/material';

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState('login');

  return (
    <div>
      <PageHead pageTitle="Sign in/Sign up" />
      <main className="w-full flex items-center justify-between min-h-[100vh]">
        <div className="md:w-[60%] bg-[#fffade] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative">
          {/* <Card>
            <CardContent> */}
          <div className="flex my-3">
            <button
              className={`tab-btn mx-2 ${
                currentTab === 'login' ? 'tab-btn--active' : ''
              }`}
              onClick={() => setCurrentTab('login')}
            >
              login
            </button>
            <button
              className={`tab-btn mx-2 ${
                currentTab === 'register' ? 'tab-btn--active' : ''
              }`}
              onClick={() => setCurrentTab('register')}
            >
              register
            </button>
          </div>
          <div className="flex flex-col">
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
          {/* </CardContent>
          </Card> */}
        </div>
        <div className="login md:w-[40%] h-[100vh] relative" />
      </main>
    </div>
  );
};

export default AuthPage;