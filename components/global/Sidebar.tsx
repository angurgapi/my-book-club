import Link from 'next/link';
import { useRouter } from 'next/router';

import { List, ListItem, Divider, Icon } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

const Sidebar = () => {
  const router = useRouter();

  const sidebarLinks = [
    {
      url: '/dashboard/profile',
      title: 'Profile',
      icon: <AccountCircleIcon />,
    },
    {
      url: '/dashboard/events/attending',
      title: 'Attending',
      icon: <EventAvailableIcon />,
    },
    {
      url: '/dashboard/events/hosting',
      title: 'Hosting',
      icon: <SupervisorAccountIcon />,
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
