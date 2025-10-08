import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Cookies, useCookies } from 'react-cookie';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Transitions from 'ui-component/extended/Transitions';
import User1 from 'assets/images/icons/logo.png';
import { IconLogout, IconSettings } from '@tabler/icons-react';
import useConfig from 'hooks/useConfig';

const ProfileSection = () => {
  const theme = useTheme();
  const { mode, borderRadius } = useConfig();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies([
    'accessToken',
    'userId',
  ]);

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<any>(null);

  const handleLogout = async () => {
    try {
      removeCookie('accessToken', { path: '/' });
      removeCookie('userId', { path: '/' });

      navigate('/');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement>,
    index: number,
    route: string = ''
  ) => {
    setSelectedIndex(index);
    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (
    event: React.MouseEvent<HTMLDivElement> | MouseEvent | TouchEvent
  ) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Chip
        sx={{
          height: '50px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor:
            theme.palette.mode === 'dark'
              ? theme.palette.dark.main
              : theme.palette.primary.light,
          backgroundColor:
            theme.palette.mode === 'dark'
              ? theme.palette.dark.main
              : theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.secondary.dark,
            background: `${theme.palette.secondary[200]}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.secondary.dark,
            },
          },
          '& .MuiChip-label': {
            lineHeight: 0,
          },
        }}
        icon={
          <Avatar
            src={User1}
            sx={{
              height: '40px',
              width: 'auto',
              maxWidth: '130px',
              fontSize: '1.2rem',
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              color: '#ffffff',
              borderRadius: 0,
              backgroundColor: 'transparent',
              paddingY: 1,
              objectFit: 'contain',
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={
          <IconSettings
            stroke={1.5}
            size="24px"
            // color={theme.palette.secondary.dark}
          />
        }
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper
                elevation={3}
                sx={{
                  backgroundColor: '#f5f5f5', // Smokey white
                  borderRadius: 2,
                }}
              >
                <Box sx={{ p: 2, pb: 0 }}>
                  <Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Typography variant="h4">Welcome,</Typography>
                      <Typography
                        component="span"
                        variant="h4"
                        sx={{
                          textTransform: 'capitalize',
                          fontWeight: 400,
                        }}
                      >
                        {cookies.userId?.name}{' '}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ textTransform: 'capitalize', paddingTop: 1 }}
                      variant="subtitle2"
                    >
                      {cookies.userId?.name}
                    </Typography>
                  </Stack>
                </Box>
                <PerfectScrollbar
                  style={{
                    height: '100%',
                    maxHeight: 'calc(100vh - 250px)',
                    overflowX: 'hidden',
                  }}
                >
                  <Box sx={{ p: 2, pt: 0 }}>
                    <List
                      component="nav"
                      sx={{
                        width: '100%',
                        maxWidth: 350,
                        minWidth: 300,
                      }}
                    >
                      <ListItemButton
                        // selected={selectedIndex === 0}
                        onClick={(event) =>
                          handleListItemClick(event, 0, '/user/account-profile')
                        }
                        sx={{
                          '&:hover': {
                            color: '#FFFFFF',
                            '& .MuiTypography-root': {
                              color: '#FFFFFF',
                            },
                          },
                        }}
                      >
                        <ListItemIcon>
                          <IconSettings stroke={1.5} size="20px" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">
                              Account Settings
                            </Typography>
                          }
                        />
                      </ListItemButton>

                      <ListItemButton
                        selected={selectedIndex === 4}
                        onClick={handleLogout}
                        sx={{
                          '&:hover': {
                            color: '#FFFFFF',
                            '& .MuiTypography-root': {
                              color: '#FFFFFF',
                            },
                          },
                        }}
                      >
                        <ListItemIcon>
                          <IconLogout stroke={1.5} size="20px" />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography variant="body2">Logout</Typography>
                          }
                        />
                      </ListItemButton>
                    </List>
                  </Box>
                </PerfectScrollbar>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
