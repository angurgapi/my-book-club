import React, { useEffect, useState, SyntheticEvent, useCallback } from 'react';
import ProvidersAuth from './ProvidersAuth';
import AuthForm from './AuthForm';

export const LoginForm = () => {
  return (
    <>
      <AuthForm mode="login" />
      <ProvidersAuth />
    </>
  );
};
