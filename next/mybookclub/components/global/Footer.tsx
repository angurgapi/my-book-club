import React from 'react';

const Footer = () => {
  return (
    <div className="w-full flex bg-white text-slate-600 h-[10vh] flex flex-col space-y-4 items-center justify-center p-[20px]">
      <p>
        &copy;{' '}
        <a href="https://github.com/angurgapi" target="_blank">
          MyBookClub
        </a>{' '}
        {new Date().getFullYear()}
      </p>
    </div>
  );
};

export default Footer;
