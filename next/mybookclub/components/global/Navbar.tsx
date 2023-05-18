import React, { useState } from "react";
import Link from "next/link";
import Image from 'next/image'

const Navbar = () => {
	const [hamburger, setHamburger] = useState(false);
	return (
		
		<nav className='w-full h-[10vh] flex items-center flex-wrap justify-between sticky top-0 bg-teal-500 px-[20px]'>
			<Link href='/' className="flex">	
			<Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/books.svg"
          alt="books"
          width={22}
          height={22}
          
        />			
				<span className='mx-[16px] text-xl font-bold text-amber-300'>my book club</span>			
			</Link>
			<div className='md:flex items-center justify-between hidden space-x-8'>
				<Link href='/login' className='text-lg text-amber-400 font-semibold hover:text-white'>
					Login
				</Link>
				<Link href='/register' className='text-lg text-amber-400 font-semibold hover:text-white'>
					Register
				</Link>
				
			</div>
			<div className='md:hidden block'>
			<button
							className='text-4xl text-[#C07F00] cursor-pointer hover:text-white'
							onClick={() => setHamburger(true)}
						>

		<Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/svg/burger.svg"
          alt="hamburger"
          width={16}
          height={16}
          
        />
						</button>
			</div>
			{hamburger && (
				<div className='fixed top-0 right-0 w-full h-[100vh] bg-teal-500 p-6'>
					<div className='w-full flex items-center justify-end mb-8'>
						<button
							className='text-4xl text-[#C07F00] cursor-pointer hover:text-white'
							onClick={() => setHamburger(false)}
						>
									<Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/svg/times.svg"
		  alt="close"
          width={16}
          height={16}
          
        />
						</button>
					</div>
					<div className='flex w-screen flex-col space-y-8'>
						<Link href='/login' className='text-white hover:text-[#C07F00]'>
							Login
						</Link>
						<Link href='/register' className='text-white hover:text-[#C07F00]'>
							Register
						</Link>
						
					</div>
				</div>
			)}
		</nav>
	);
};

export default Navbar;