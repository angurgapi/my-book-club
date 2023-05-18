import Image from 'next/image';
import Navbar from '@/components/global/Navbar'
import Hero from '@/components/global/Hero';
import Footer from '@/components/global/Footer';
import PageHead from '@/components/global/Head';

export default function Home() {
  return (
    <>
    <PageHead pageTitle="Home" />
    <main className="flex min-h-screen flex-col items-center justify-start p-0">
      <Navbar />
      <Hero />      
      <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
       </div>
      <Footer />
    </main>
    </>
  )
}
