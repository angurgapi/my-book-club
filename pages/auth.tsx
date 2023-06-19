import React, { useState } from 'react';
import PageHead from '@/components/global/Head';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegistrationForm } from '@/components/auth/RegForm';
import { Card, CardContent, CardMedia } from '@mui/material';
import DefaultLayout from '@/layouts/default';

const AuthPage = () => {
  const [currentTab, setCurrentTab] = useState('login');

  return (
    <DefaultLayout>
      <PageHead pageTitle="Sign in/Sign up" />
      <Card sx={{ display: 'flex' }}>
        <div className="bg-[#fffade] w-full flex flex-col items-center justify-center px-[30px] py-[30px] relative">
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
        <CardMedia
          className="login md:w-[40%] relative"
          component="img"
          image="signin.jpg"
          alt="user authorization"
          sx={{ display: { xs: 'none', md: 'flex' } }}
        />
      </Card>
    </DefaultLayout>
  );
};

export default AuthPage;
