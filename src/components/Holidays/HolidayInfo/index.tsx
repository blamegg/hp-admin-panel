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
import { color } from '@mui/system';
import { useHasPermission } from '@/hooks/useUserPermissions';
import PermissionDenied from '@/components/common/PermissionDenied';

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
  const [createHolidayDrawerOpen, setCreateHolidayDrawerOpen] = useState(false);
  const [events, setEvents] = useState<HolidayEvent[]>([]);
  const [editDrawerOpen, setEditDrawerOpen] = useState(false);
  const [deleteDrawerOpen, setDeleteDrawerOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<HolidayEvent | null>(null);
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const holidayTypes = useSelector((state: RootState) => state.holidayTypesList.holidayTypesList?.data) || [];
  const { holidays, error, loading } = useSelector((state: RootState) => state.holidays);
  const hasPermission = useHasPermission();

  // holiday types
  useEffect(() => {
    dispatch(fetchHolidayTypesList())
  }, [dispatch])

  // holidays

  useEffect(() => {
    dispatch(fetchHolidays())
  }, [dispatch])

  console.log(holidays, "HOlidays");

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
    const [isHoverd, setIsHovered] = useState(false);

    return (
      <div className='flex items-center border flex-col gap-[2px]'
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className='bg-success rounded px-3 mb-1'>
          <span className='text-xs' >{event.title}</span>
        </div>
        {isHoverd && (
          <div className='text-sm flex justify-end items-center gap-2'>
            {hasPermission('Edit holiday') && (
              <FaEdit
                className="cursor-pointer text-primary hover:text-blue-700"
                onClick={e => {
                  e.stopPropagation();
                  setSelectedHoliday(event);
                  setEditDrawerOpen(true);
                }}
              />
            )}
            {hasPermission('View holiday details') && (
              <FaEye
                className='cursor-pointer text-black'
                onClick={e => {
                  e.stopPropagation();
                  setSelectedHoliday(event);
                  setDetailsDrawerOpen(true);
                }}
              />
            )}
            {hasPermission('Delete holiday') && (
              <FaTrash
                className="cursor-pointer text-danger "
                onClick={e => {
                  e.stopPropagation();
                  setSelectedHoliday(event);
                  setDeleteDrawerOpen(true);
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  };


  // Show details drawer for existing holiday
  const handleDateClick = (slot: SlotInfo) => {
    if (!hasPermission('Create holiday')) return;
    const foundHoliday = events.find(event => event.start.toDateString() === slot.start.toDateString());

    if (foundHoliday) {
      setSelectedHoliday(foundHoliday);
      setDetailsDrawerOpen(true);
      return;
    }
    setSelectedDateRange({ start: slot.start, end: slot.end });
    setCreateHolidayDrawerOpen(true);
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
    const day = date.getDay();

    if (day === 0 || day === 6) {
      return {
        className: 'weekend-cell',
      };
    }

    return {};
  };



  return (
    <div className="p-4">
      {hasPermission('View holidays') ? (<>
        <div className="no-time-gutter p-4" style={{ height: 'calc(100vh - 160px)' }}>
          <Calendar
            localizer={localizer}
            views={["month", "week", 'day']}
            events={events}
            startAccessor="start"
            endAccessor="end"
            selectable
            style={{ height: "100%" }}
            onSelectSlot={handleDateClick}
            eventPropGetter={eventPropGetter}
            dayPropGetter={dayPropGetter}
            components={{
              event: EventComponent,
            }}
          />
        </div>
      </>) : (
        <PermissionDenied />
      )}


      <CreateHolidayDrawer
        open={createHolidayDrawerOpen}
        onClose={() => setCreateHolidayDrawerOpen(false)}
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
