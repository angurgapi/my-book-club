import DefaultLayout from '@/layouts/default';
import Hero from '@/components/index/Hero';
import Stages from '@/components/index/Stages';
import Begin from '@/components/index/Begin';
import PageHead from '@/components/global/Head';

export default function Home() {
  return (
    <DefaultLayout landing={true}>
      <PageHead pageTitle="Home" />
      <div className="flex flex-col items-center justify-start p-0">
        <Hero />
        <Stages />
        <Begin />
      </div>
    </DefaultLayout>
  );
}
