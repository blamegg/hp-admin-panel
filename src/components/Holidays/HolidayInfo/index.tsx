'use client';
import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { AppDispatch, RootState } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { fetchHolidayTypesList } from '@/redux/slice/holidayTypesListSlice';
import CreateHolidayDrawer from './CreateHolidayDrawer';

const localizer = momentLocalizer(moment);

export interface HolidayEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
  description?: string;
}

const HolidayInfo = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<HolidayEvent[]>([]);
  
  const dispatch = useDispatch<AppDispatch>();
  const holidayTypes = useSelector((state:RootState)=> state.holidayTypesList.holidayTypesList?.data) || [];

  useEffect(()=>{
    dispatch(fetchHolidayTypesList())
  },[dispatch])

  const handleDateClick = (slot: SlotInfo) => {
    setSelectedDateRange({ start: slot.start, end: slot.end });
    setDrawerOpen(true);
  };
  
  const addEvent = (event: HolidayEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  // Add colors based on type
  const eventPropGetter = (event: HolidayEvent) => {
    let backgroundColor = '#219653'; 
    if (event.type === 'optional') backgroundColor = '#f59e0b'; // amber
    if (event.type === 'restricted') backgroundColor = '#ef4444'; // red

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        padding: '2px',
        border: 'none',
      },
    };
  };

const dayPropGetter = (date: Date) => {
  const day = date.getDay(); // 0 = Sunday, 6 = Saturday

  if (day === 0 || day === 6) {
    return {
      className: 'text-red-500 font-semibold', // Tailwind class for red text
    };
  }
  
  
  return {};
};

  return (
    <div className="p-4">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        style={{ height: 450 }}
        onSelectSlot={handleDateClick}
        eventPropGetter={eventPropGetter}
        dayPropGetter={dayPropGetter}
      />

      <CreateHolidayDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedDateRange={selectedDateRange}
        addEvent={addEvent}
        holidayTypes={holidayTypes}
      />
    </div>
  );
};

export default HolidayInfo;
