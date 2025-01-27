import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AttendanceCalendar from '../AttendanceCalendar';
import Report from '../Report';
import LeaveInfo from '../LeaveInfo';
import EmployeeDetailsCard from '../Documents';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '90%', margin: "1px auto",  }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Calendar" {...a11yProps(0)} />
          <Tab label="Report" {...a11yProps(1)} />
          <Tab label="Leaves" {...a11yProps(2)} />
          <Tab label="Document" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
      <AttendanceCalendar />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
       <Report/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <LeaveInfo/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
      <EmployeeDetailsCard/>
      </CustomTabPanel>
    </Box>
  );
}
