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
import { fetchHolidays } from '@/redux/slice/holidaySlice';
import EditHolidayDrawer from './EditHolidayDrawer';
import DeleteHolidayDrawer from './DeleteHolidayDrawer';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { toast } from 'sonner';
import HolidayDetailsDrawer from './HolidayDetailsDrawer';
import { FaEye } from 'react-icons/fa6';

const localizer = momentLocalizer(moment);

export interface HolidayEvent {
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  type: string;
  description?: string;
  _id: string;
}

const HolidayInfo = () => {
  const [selectedDateRange, setSelectedDateRange] = useState<{ start: Date; end: Date } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [events, setEvents] = useState<HolidayEvent[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayEvent | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const holidayTypes = useSelector((state: RootState) => state.holidayTypesList.holidayTypesList?.data) || [];
  const { holidays, error, loading } = useSelector((state: RootState) => state.holidays);
  // holiday types
  useEffect(() => {
    dispatch(fetchHolidayTypesList())
  }, [dispatch])

  // holidays

  useEffect(() => {
    dispatch(fetchHolidays())
  }, [dispatch])

  // Map fetched holidays to calendar events
  useEffect(() => {
    if (holidays?.data) {
      const mappedEvents = holidays.data.flatMap((holiday: any) =>
        (holiday.dates || []).map((date: string) => ({
          title: holiday.title,
          start: new Date(date),
          end: new Date(date),
          allDay: true,
          type: holiday.holiday_type?.name || "default",
          description: holiday.description,
          _id: holiday._id
        }))
      );
      setEvents(mappedEvents);
    }
  }, [holidays]);

  // Helper to check if a date is already a holiday
  const isDateHoliday = (date: Date) => {
    return events.some(event =>
      event.start.toDateString() === date.toDateString()
    );
  };

  // Custom event component for calendar
  const EventComponent = ({ event }: { event: HolidayEvent }) => {
    return (
      <div>
        <div className='bg-success rounded ps-1 mb-1'>
          <span className='text-xs' >{event.title}</span>
        </div>
        <div className='text-sm flex justify-end items-center gap-2 py-1'>
            <FaEdit
              className="cursor-pointer text-primary hover:text-blue-700"
              onClick={e => {
                e.stopPropagation();
                console.log(event)

                setSelectedHoliday(event);
                setEditDrawerOpen(true);
              }}
            />
            <FaEye
            className='cursor-pointer text-black'
              onClick={e => {
                e.stopPropagation();
                setSelectedHoliday(event);
                setDetailsDrawerOpen(true);
              }}
             />
            <FaTrash
              className="cursor-pointer text-danger "
              onClick={e => {
                e.stopPropagation();
                setSelectedHoliday(event);
                setDeleteDrawerOpen(true);
              }}
            />
        </div>
      </div>
    );
  };


  // Show details drawer for existing holiday
  const handleDateClick = (slot: SlotInfo) => {
    const foundHoliday = events.find(event => event.start.toDateString() === slot.start.toDateString());

    if (foundHoliday) {
      setSelectedHoliday(foundHoliday);
      setDetailsDrawerOpen(true);
      return;
    }
    setSelectedDateRange({ start: slot.start, end: slot.end });
    setDrawerOpen(true);
  };

  const addEvent = (event: HolidayEvent) => {
    setEvents((prev) => [...prev, event]);
  };

  // Add colors based on type
  const eventPropGetter = (event: HolidayEvent) => {
    let backgroundColor = 'transparent';
    if (event.type === 'optional') backgroundColor = '#f59e0b'; // amber
    if (event.type === 'restricted') backgroundColor = '#ef4444'; // red

    return {
      style: {
        backgroundColor,
        color: 'white',
        borderRadius: '5px',
        padding: '2px',
        border: 'none',
        cursor: "pointer"
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
        components={{ event: EventComponent }}
      />

      <CreateHolidayDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        selectedDateRange={selectedDateRange}
        addEvent={addEvent}
        holidayTypes={holidayTypes}
      />

      <EditHolidayDrawer
        open={editDrawerOpen}
        onClose={() => setEditDrawerOpen(false)}
        holiday={selectedHoliday}
        holidayTypes={holidayTypes}
      />
      <DeleteHolidayDrawer
        open={deleteDrawerOpen}
        onClose={() => setDeleteDrawerOpen(false)}
        holiday={selectedHoliday}
      />
      <HolidayDetailsDrawer
        open={detailsDrawerOpen}
        onClose={() => setDetailsDrawerOpen(false)}
        holiday={selectedHoliday}
      />
    </div>
  );
};

export default HolidayInfo;
