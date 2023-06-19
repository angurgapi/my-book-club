import PageHead from '@/components/global/Head';
import DefaultLayout from '@/layouts/default';
import { Typography } from '@mui/material';
import { NextPage, GetServerSideProps } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <DefaultLayout>
      <PageHead pageTitle="Error" />
      <div className="flex flex-col justify-center items-center">
        <Typography variant="h3" gutterBottom>
          Oops!
        </Typography>
        <p>
          {statusCode
            ? `An error ${statusCode} occurred on the server`
            : 'An error occurred on the client'}
        </p>
        <Link className="text-xl text-teal-700 mt-3" href="/">
          Back home
        </Link>
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<ErrorProps> = async ({
  res,
}) => {
  const statusCode = res ? res.statusCode : 404;
  return {
    props: {
      statusCode,
    },
  };
};

export default Error;
