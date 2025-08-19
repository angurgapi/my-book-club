import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <div className="min-h-[60px] w-full flex">
      <div className="wrapper__content wrapper__content--sided flex items-center flex-col md:flex-row md:justify-between justify-start bg-white text-slate-600 p-[20px]">
        <a href="https://github.com/angurgapi" target="_blank">
          ©MyBookClub {new Date().getFullYear()}
        </a>{' '}
        <div className="flex items-center flex-col md:flex-row justify-between">
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </div>
  );
};

export default Footer;
