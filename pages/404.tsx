import PageHead from '@/components/global/Head';
import DefaultLayout from '@/layouts/default';
import { Typography } from '@mui/material';
import { NextPage } from 'next';
import Link from 'next/link';

const PageNotFound: NextPage = () => {
  return (
    <DefaultLayout>
      <PageHead pageTitle="Error" />
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h3" gutterBottom>
          404 - Page Not Found
        </Typography>
        <p>The page you are looking for does not exist.</p>
        <Link className="text-xl text-teal-700 mt-3" href="/">
          Back home
        </Link>
      </div>
    </DefaultLayout>
  );
};

export default PageNotFound;
