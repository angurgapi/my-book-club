import React, { useEffect, useState } from 'react';
import { auth } from '@/utils/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';

// import { registerByGoogle } from '@/utils/googleAuth';

const GoogleAuth = () => {
  const router = useRouter();
  const registerByGoogle = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      //   successMessage("Authentication successful");
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
    }
  };
  const [user, setUser] = useAuthState(auth);
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <div className="flex">
      <button className="flex" onClick={registerByGoogle}>
        Sign in with
        <FcGoogle className="mx-[12px] text-xl" />
      </button>
    </div>
  );
};

export default GoogleAuth;
