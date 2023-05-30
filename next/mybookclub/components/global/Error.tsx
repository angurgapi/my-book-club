import React from 'react';
import PageHead from './Head';
import DefaultLayout from '@/layouts/default';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <DefaultLayout>
      <PageHead pageTitle="Error" />
      <div>
        <h2 className="text-xl text-[#C07F00]">
          Oops, something went wrong! 😪
        </h2>
        <Link
          href="/"
          className="p-4 bg-slate-100 shadow-md hover:bg-[#C07F00] hover:text-slate-100 rounded-md"
        >
          Go home
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default ErrorPage;
