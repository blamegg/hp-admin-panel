'use client';
import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface FullScreenCalendarProps {
  onDayClick?: (date: Date) => void;
  title?: string;
}

const FullScreenCalendar: React.FC<FullScreenCalendarProps> = ({
  onDayClick,
  title = 'Calendar',
}) => {
  return (
    <div className="w-screen h-screen p-0 m-0 flex flex-col bg-white">
      <h1 className="text-2xl font-bold mb-4 p-4 bg-white shadow sticky top-0 z-10">
        {title}
      </h1>
      <div className="flex-1 flex items-center justify-center">
        <Calendar
          onClickDay={onDayClick}
          className="rounded-lg shadow border"
        />
      </div>
    </div>
  );
};

export default FullScreenCalendar; 