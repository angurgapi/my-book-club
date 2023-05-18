import Image from 'next/image'
import Head from "next/head";
import Navbar from '@/components/global/Navbar'
import Hero from '@/components/global/Hero';

export default function Home() {
  return (
    <>
    <Head>
    <title>MyBookClub</title>
    <meta
      name='description'
      content='Start and attend your own book club anywhere'
    />
    <meta name='viewport' content='width=device-width, initial-scale=1' />
    <link rel='icon' href='/books.svg' />
  </Head>
    <main className="flex min-h-screen flex-col items-center justify-start p-0">
      <Navbar />
      <Hero />      
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">     

       

        
      
      </div>
    </main>
    </>
  )
}
