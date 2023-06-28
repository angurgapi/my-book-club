import DefaultLayout from '@/layouts/default';
import PageHead from '@/components/global/Head';
import { Card, CardContent, Typography } from '@mui/material';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: 'Personal Information',
      subsections: [
        {
          title: '1.1 Collection of Personal Information',
          content: `We may collect personal identification information from Users in
          various ways, including but not limited to: When Users register
          an account using Facebook, Google, or email authentication. When
          Users create or participate in events.`,
        },
        {
          title: '1.2 Types of Personal Information',
          content: `The personal information that we may collect can include, but is
          not limited to: Name Email address Profile picture Any
          additional information voluntarily provided by the User during
          the registration process or event creation/participation.`,
        },
      ],
    },
    {
      title: 'How We Use Collected Information',
      subsections: [
        {
          title: '2.1 General Use',
          content: ` We may use the collected personal information for the following
          purposes: To create and manage user accounts. To authenticate
          users during the login process. To personalize user experience
          and display relevant content. To send periodic emails regarding
          account updates, event notifications, or other relevant
          information. To improve our website/app based on feedback and
          user behavior.`,
        },
      ],
    },
    {
      title: 'How We Protect Your Information',
      subsections: [
        {
          title: '3.1 Data Security',
          content: `We adopt appropriate data collection, storage, and processing
        practices, as well as security measures, to protect against
        unauthorized access, alteration, disclosure, or destruction of
        your personal information, username, password, transaction
        information, and data stored on our website/app.`,
        },
      ],
    },
    {
      title: 'Third parties',
      subsections: [
        {
          title: '4.1 Third-Party Services',
          content: ` We may use third-party services to assist in the operation of
          our website/app and to provide certain features. These
          third-party service providers may have access to your personal
          information solely for the purposes of performing their
          functions and are obligated not to disclose or use it for any
          other purpose.`,
        },
        {
          title: '4.2 Legal Requirements',
          content: `We may disclose your personal information if required to do so
        by law or in response to valid requests by public authorities
        (e.g., a court or government agency).`,
        },
      ],
    },
    {
      title: 'Consent and Changes to this Privacy Policy',
      subsections: [
        {
          title: '5.1 Consent',
          content: `By using our website/app, you signify your acceptance of this
          Privacy Policy. If you do not agree to this policy, please do
          not use our website/app. `,
        },
        {
          title: ' 5.2 Changes to the Privacy Policy',
          content: ` We reserve the right to update or modify this Privacy Policy at any
          time. We will notify Users of any changes by updating the
          &quot;Last Updated&quot; date at the top of this page. It is the
          responsibility of the User to review this Privacy Policy
          periodically for any changes.`,
        },
      ],
    },
  ];
  return (
    <DefaultLayout>
      <PageHead pageTitle="New book club meeting" />
      <div className="flex flex-col p-2 items-center mt-4">
        <Card>
          <CardContent>
            <Typography variant="h3" gutterBottom>
              Privacy Policy
            </Typography>
            <Typography variant="h5" gutterBottom>
              This Privacy Policy governs the manner in which MyBookClub
              collects, uses, maintains, and discloses information collected
              from users (referred to as &quot;User(s)&quot;) of the MyBookClub.
            </Typography>
            {sections.map((section, index) => (
              <section key={index} className="mt-2">
                <Typography variant="h6" gutterBottom>
                  {section.title}
                </Typography>
                {section.subsections.map((subsection, subindex) => (
                  <div key={subindex}>
                    {' '}
                    <p className="italic mt-2 mb-2">{subsection.title}</p>
                    <p>{subsection.content}</p>
                  </div>
                ))}
              </section>
            ))}
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
};

export default PrivacyPolicy;
