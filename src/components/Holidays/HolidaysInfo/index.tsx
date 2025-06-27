'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Drawer from '@mui/material/Drawer';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';
import Input from '@/components/common/Input';
import ModalHeader from '@/components/common/ModalHeader';

const HOLIDAY_TYPES = [
  { value: 'public', label: 'Public Holiday' },
  { value: 'optional', label: 'Optional Holiday' },
  { value: 'restricted', label: 'Restricted Holiday' },
];

const HolidayInfo = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [holidayType, setHolidayType] = useState('public');
  const [holidayName, setHolidayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDrawerOpen(true);
    setHolidayType('public');
    setHolidayName('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Call your API to create the holiday
    setTimeout(() => {
      setLoading(false);
      setDrawerOpen(false);
    }, 1000);
  };

  return (
    <div className="w-screen h-screen p-0 m-0 flex flex-col bg-white">
      <h1 className="text-2xl font-bold mb-4 p-4 bg-white shadow sticky top-0 z-10">Holiday Calendar</h1>
      <div className="flex-1 flex items-center justify-center">
        <Calendar
          onClickDay={handleDateClick}
          className="rounded-lg shadow border"
        />
      </div>
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: '30%' } }}>
        <ModalHeader text="Create Holiday" toggleDrawer={() => setDrawerOpen(false)} />
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="font-medium text-gray-600 block mb-1">Date</label>
            <p className="px-2 py-1 bg-blue-50 rounded border border-blue-200 w-fit">{selectedDate ? selectedDate.toLocaleDateString() : ''}</p>
          </div>
          <div>
            <Select
              label="Holiday Type"
              options={HOLIDAY_TYPES}
              value={holidayType}
              onChange={e => setHolidayType(e.target.value)}
            />
          </div>
          <div>
            <Input
              label="Holiday Name/Description"
              value={holidayName}
              onChange={e => setHolidayName(e.target.value)}
              placeholder="Enter holiday name or description"
              type="text"
            />
          </div>
          <div className="flex justify-end gap-2 border-t-2 border-gray pt-4">
            <Button type="button" name="Cancel" className="bg-graydark" onClick={() => setDrawerOpen(false)} />
            <Button
              type="submit"
              name={loading ? 'Creating...' : 'Create'}
              className="bg-success text-white min-w-[100px]"
              disabled={loading}
              loading={loading}
            />
          </div>
        </form>
      </Drawer>
    </div>
  );
};

export default HolidayInfo;