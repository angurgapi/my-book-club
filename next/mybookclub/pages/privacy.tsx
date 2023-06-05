import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';

import { useRouter } from 'next/router';
import { useAppSelector } from '@/hooks/redux';
import { useEffect } from 'react';
import { Card, CardContent } from '@mui/material';

const PrivacyPolicy = () => {
  return (
    <DefaultLayout>
      <PageHead pageTitle="New book club meeting" />
      <div className="flex flex-col p-2 items-center mt-4">
        <Card>
          <CardContent>
            <h2>Privacy Policy </h2>
            <p>
              This Privacy Policy governs the manner in which MyBookClub
              collects, uses, maintains, and discloses information collected
              from users (referred to as "User(s)") of the MyBookClub. Personal
              Information 1.1 Collection of Personal Information We may collect
              personal identification information from Users in various ways,
              including but not limited to: When Users register an account using
              Facebook, Google, or email authentication. When Users create or
              participate in events. 1.2 Types of Personal Information The
              personal information that we may collect can include, but is not
              limited to: Name Email address Profile picture Any additional
              information voluntarily provided by the User during the
              registration process or event creation/participation. How We Use
              Collected Information 2.1 General Use We may use the collected
              personal information for the following purposes: To create and
              manage user accounts. To authenticate users during the login
              process. To personalize user experience and display relevant
              content. To send periodic emails regarding account updates, event
              notifications, or other relevant information. To improve our
              website/app based on feedback and user behavior. How We Protect
              Your Information 3.1 Data Security We adopt appropriate data
              collection, storage, and processing practices, as well as security
              measures, to protect against unauthorized access, alteration,
              disclosure, or destruction of your personal information, username,
              password, transaction information, and data stored on our
              website/app. Sharing Personal Information 4.1 Third-Party Services
              We may use third-party services to assist in the operation of our
              website/app and to provide certain features. These third-party
              service providers may have access to your personal information
              solely for the purposes of performing their functions and are
              obligated not to disclose or use it for any other purpose. 4.2
              Legal Requirements We may disclose your personal information if
              required to do so by law or in response to valid requests by
              public authorities (e.g., a court or government agency). Consent
              and Changes to this Privacy Policy 5.1 Consent By using our
              website/app, you signify your acceptance of this Privacy Policy.
              If you do not agree to this policy, please do not use our
              website/app. 5.2 Changes to the Privacy Policy We reserve the
              right to update or modify this Privacy Policy at any time. We will
              notify Users of any changes by updating the "Last Updated" date at
              the top of this page. It is the responsibility of the User to
              review this Privacy Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default PrivacyPolicy;
