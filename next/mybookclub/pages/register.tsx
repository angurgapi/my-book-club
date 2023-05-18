import React, { useState, useEffect } from "react";
import Link from "next/link";
import { HiMail } from "react-icons/hi";
import { AiTwotoneLock, AiFillCheckCircle } from "react-icons/ai";
import {FcGoogle} from 'react-icons/fc'
import { firebaseCreateUser } from "../utils/util";
import { registerByGoogle } from "@/utils/googleAuth";
import { useRouter } from "next/router";
import PageHead from "@/components/global/Head";

const Register:React.FC = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [cpassword, setCPassword] = useState("");
	const router = useRouter();

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === cpassword) {
			firebaseCreateUser(email, password, router);
			setEmail("");
			setPassword("");
			setCPassword("");
		}
	};

    const googleAuth = () => {
        console.log('user clicked google btn')
        registerByGoogle(router)

    }
	return (
		<div>			
            <PageHead pageTitle="Register" />				
			
			<main className='w-full flex items-center justify-between min-h-[100vh]'>
				<div className='md:w-[60%] w-full flex flex-col items-center justify-center min-h-[100vh] px-[30px] py-[30px] relative'>
					<Link href='/'>
						<h2 className='text-2xl font-medium mb-6'>Create an account</h2>
					</Link>
					<form
						className='w-full flex flex-col justify-center'
						onSubmit={handleSubmit}
					>
						<label htmlFor='email'>Email address</label>
						<div className='w-full relative'>
							<input
								type='email'
								name='email'
								className='border px-10 py-2 mb-3 rounded-md w-full'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<HiMail className=' absolute left-4 top-3 text-gray-300 text-xl' />
						</div>
						<label htmlFor='password'>Password</label>
						<div className='w-full relative'>
							<input
								type='password'
								name='password'
								className='border px-10 py-2 mb-4 rounded-md w-full'
								minLength={6}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<AiTwotoneLock className=' absolute left-4 top-3 text-gray-300 text-xl' />
							{password === cpassword && cpassword !== "" && (
								<AiFillCheckCircle className=' absolute right-4 top-3 text-green-500 text-xl' />
							)}
						</div>
						<label htmlFor='cpassword'>Confirm Password</label>
						<div className='w-full relative'>
							<input
								type='password'
								name='cpassword'
								className='border px-10 py-2 mb-4 rounded-md w-full'
								required
								minLength={6}
								value={cpassword}
								onChange={(e) => setCPassword(e.target.value)}
							/>
							<AiTwotoneLock className=' absolute left-4 top-3 text-gray-300 text-xl' />
							{password === cpassword && cpassword !== "" && (
								<AiFillCheckCircle className=' absolute right-4 top-3 text-green-500 text-xl' />
							)}
						</div>
						{password !== cpassword && (
							<p className='text-red-500 mb-2'>Password does not match</p>
						)}
						<button
							type='submit'
							className='bg-[#FFD95A] p-3 font-medium hover:bg-[#C07F00] hover:text-[#FFF8DE] mb-3 rounded-md'
						>
							REGISTER
						</button>

                       

						<p className='text-center'>
							Already have an account?{" "}
							<Link href='/login' className='text-[#C07F00]'>
								Sign in
							</Link>
						</p>
					</form>
                    <button onClick={googleAuth}>
                        <FcGoogle className="text-xl"  />
                        </button>
					<div className='absolute bottom-5 left-5'>
						<p className='opacity-50 text-sm'>
							<Link href='/'>MyBookClub</Link> &copy; Copyright{" "}
							{new Date().getFullYear()}{" "}
						</p>
					</div>
				</div>
				<div className='register md:w-[40%] h-[100vh] relative'/>
			</main>
		</div>
	);
};

export default Register;
