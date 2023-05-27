import React from 'react';
import ProvidersAuth from './ProvidersAuth';
import AuthForm from './AuthForm';

export const RegistrationForm = () => {
  return (
    <>
      <AuthForm mode="register" />
      <ProvidersAuth />
    </>
  );
};
