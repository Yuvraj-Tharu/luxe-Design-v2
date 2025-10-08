import React, { useState } from 'react';
import Stack from '@mui/material/Stack';
import '@mui/lab';

// third-party
import { Box, Tab } from '@mui/material';
import CareerLeadList from 'views/careers/careerIndex';
import { FormattedMessage } from 'react-intl';

// ==============================|| CREATE INVOICE ||============================== //

function CreatePage({ entityName }: { entityName: string }) {
  const [activeTab, setActiveTab] = useState(0);

  const links = [
    {
      label: <FormattedMessage id="about-us-main" />,
      id: 'about-us',
    },
    {
      label: <FormattedMessage id="aboutus-section" />,
      id: 'aboutus-section',
    },
    {
      label: <FormattedMessage id="stats" />,
      id: 'stats',
    },
    {
      label: <FormattedMessage id="vision-mission" />,
      id: 'vision-mission',
    },
  ];

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const TabPanel = ({
    children,
    value,
    index,
  }: {
    children: React.ReactNode;
    value: number;
    index: number;
  }) => {
    return (
      <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  };

  return (
    <>
      <Stack direction="row" spacing={1} flexWrap="wrap">
        {links.map((link, index) => (
          <Tab
            key={link.id}
            label={link.label}
            onClick={(event) => handleTabChange(event, index)}
            sx={{
              cursor: 'pointer',
              color: activeTab === index ? 'primary.main' : 'text.black',
              opacity: 1,
              fontWeight: activeTab === index ? 'bold' : 'normal',
              textTransform: 'none',
            }}
          />
        ))}
      </Stack>

      {links.map((link, index) => (
        <TabPanel key={link.id} value={activeTab} index={index}>
          <CareerLeadList entityName={link.id} />
        </TabPanel>
      ))}
    </>
  );
}

export default CreatePage;
