import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';

import Image from 'next/image';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import Link from '@mui/material/Link';
import { useAuth } from '@/hooks/useAuth';
import { removeUser } from '@/store/reducers/UserSlice';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { AddCircleOutline } from '@mui/icons-material';

function Header() {
  const { getFirebaseAuth } = useAuth();
  const { isAuth, displayName, photoURL } = useAppSelector(
    (state) => state.user
  );
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(
    null
  );
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(
    null
  );

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const logOut = () => {
    handleCloseUserMenu();
    signOut(getFirebaseAuth);
    dispatch(removeUser());
    router.push('/');
  };

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            noWrap
            component="a"
            href="/"
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}
          >
            <Image src="/svg/logo2.svg" alt="logo" height={20} width={120} />
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ pl: 0 }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/events">events</Link>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            noWrap
            component="a"
            href=""
            sx={{
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
            }}
          >
            <Image src="/svg/logo2.svg" alt="logo" height={36} width={130} />
          </Typography>
          {/* <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}> */}
          <Link
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
            href="/events"
          >
            events
          </Link>

          {/* </Box> */}

          {isAuth ? (
            <>
              <Toolbar sx={{ backgroundColor: '#0b074a', mr: 1 }}>
                <Link
                  className="flex"
                  href="/event/create"
                  sx={{ display: 'flex', height: '100%', color: '#fff' }}
                >
                  <AddCircleOutline />{' '}
                  <span className="hidden md:flex ml-2">New event</span>
                </Link>
              </Toolbar>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="userpic" src={photoURL || ''} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link href="/dashboard/profile">Dashboard</Link>
                  </MenuItem>
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Link href="/dashboard/events">My events</Link>
                  </MenuItem>

                  <Button
                    sx={{
                      pl: '16px',
                      '&:hover': {
                        color: '#898791',
                        background: 'none',
                      },
                    }}
                    onClick={logOut}
                  >
                    Log out
                  </Button>
                </Menu>
              </Box>
            </>
          ) : (
            <Link href="/auth">log in</Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
