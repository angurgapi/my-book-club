import React from "react";
import Head from "next/head";

interface PageHeadProps {
    pageTitle: string;
  }

const PageHead:React.FC<PageHeadProps> = ({pageTitle}) => {
    return (
        <Head>
				<title>{pageTitle} | My Book Club</title>
        <meta
					name='description'
					content='Start and attend your own book club anywhere'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
                <link rel='icon' href='/books.svg' />
                </Head>
    )
}

export default PageHead