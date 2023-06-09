import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <div className="hero w-full h-[75vh] md:px-[80px] px-[20px] flex flex-col md:items-center justify-center">
      <h1 className="sigmar md:text-6xl text-[32px] font-extrabold mb-5 md:text-center">
        Reading is much more fun{' '}
        <span className="sigmar md:text-[#14b8a6]">with friends</span>
      </h1>
      {/* <p className='mb-2 md:text-center md:text-lg'>
				Discover book club meetings in any location or create your own. Invite your friends, set the event capacity and produce the details!
			</p>
			<p className='mb-6 md:text-center md:text-lg'>
				No need to be lonely!
			</p> */}
      <Link href="/events">
        <button className="bg-white md:px-6 px-4 py-4 text-[#C07F00] rounded font-bold">
          Explore
        </button>
      </Link>
    </div>
  );
};

export default Hero;
