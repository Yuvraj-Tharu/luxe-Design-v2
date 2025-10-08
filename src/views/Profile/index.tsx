import { useState, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

// project imports

import ChangePassword from './ChangePassword';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import LockTwoToneIcon from '@mui/icons-material/LockTwoTone';

// types
import { ThemeMode } from 'types/config';
import { TabsProps } from 'types';

// tabs panel
function TabPanel({ children, value, index, ...other }: TabsProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// tabs option
const tabsOption = [
  {
    label: 'Change Password',
    icon: <LockTwoToneIcon sx={{ fontSize: '1.3rem' }} />,
  },
];

// ==============================|| PROFILE 1 ||============================== //

const Profile1 = () => {
  const theme = useTheme();

  const [value, setValue] = useState<number>(0);
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <MainCard>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Tabs
            value={value}
            indicatorColor="primary"
            textColor="primary"
            onChange={handleChange}
            aria-label="simple tabs example"
            variant="scrollable"
            sx={{
              mb: 3,
              '& a': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.25,
                color:
                  theme.palette.mode === ThemeMode.DARK
                    ? 'grey.600'
                    : 'grey.900',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              },
              '& a.Mui-selected': {
                color: 'primary.main',
              },
              '& .MuiTabs-indicator': {
                bottom: 2,
              },
              '& a > svg': {
                marginBottom: '0px !important',
                mr: 1.25,
              },
            }}
          >
            {tabsOption.map((tab, index) => (
              <Tab
                key={index}
                component={Link}
                to="#"
                icon={tab.icon}
                label={tab.label}
                {...a11yProps(index)}
              />
            ))}
          </Tabs>
          <TabPanel value={value} index={0}>
            <ChangePassword />{' '}
          </TabPanel>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default Profile1;
