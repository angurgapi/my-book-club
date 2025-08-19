import Link from 'next/link';
import { useRouter } from 'next/router';

import { List, ListItem } from '@mui/material';
import {
  AddCircleOutline,
  SupervisorAccount,
  EventAvailable,
  AccountCircle,
} from '@mui/icons-material';

const Sidebar = () => {
  const router = useRouter();

  const sidebarLinks = [
    {
      url: '/dashboard/profile',
      title: 'Profile',
      icon: <AccountCircle />,
    },
    {
      url: '/dashboard/events/attending',
      title: 'Attending',
      icon: <EventAvailable />,
    },
    {
      url: '/dashboard/events/hosting',
      title: 'Hosting',
      icon: <SupervisorAccount />,
    },
    {
      url: '/dashboard/events/create',
      title: 'New event',
      icon: <AddCircleOutline />,
    },
  ];
  return (
    <List className="sidebar">
      {/* <ListItem>
        <Link href="/">Home</Link>
      </ListItem> */}

      {sidebarLinks.map((link) => (
        <ListItem key={link.url}>
          <Link
            className={
              router.pathname === link.url
                ? 'sidebar__link sidebar__link--active'
                : 'sidebar__link'
            }
            href={link.url}
          >
            <span className="text-[#0b074a]">{link.icon}</span>
            <span className="ml-2">{link.title}</span>
          </Link>
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
