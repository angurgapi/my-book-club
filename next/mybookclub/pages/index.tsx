import DefaultLayout from '@/layouts/default';
import Hero from '@/components/global/Hero';
import PageHead from '@/components/global/Head';

export default function Home() {
  return (
    <DefaultLayout>
    <PageHead pageTitle="Home" />
    <div className="flex flex-col items-center justify-start p-0">
      <Hero />           
    </div>
    </DefaultLayout>
  )
}
