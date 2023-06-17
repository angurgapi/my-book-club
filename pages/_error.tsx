import { NextPage, GetServerSideProps } from 'next';

interface ErrorProps {
  statusCode: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on the server`
        : 'An error occurred on the client'}
    </p>
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
