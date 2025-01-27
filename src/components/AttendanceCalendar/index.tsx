"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar, momentLocalizer, Navigate, ToolbarProps, EventProps } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Tooltip } from "@mui/material";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import BasicTabs from "../tabs";

// Setup the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

// Type definitions for events
interface AttendanceEvent {
  start: Date;
  end: Date;
  title: string;
  hours?: number;
  name?: string;
  role?: string;
  isHoliday?: boolean;
}

// Mock data for demonstration
const attendanceData: AttendanceEvent[] = [
  { start: new Date(2025, 1, 15), end: new Date(2025, 1, 15), title: "Present", hours: 8, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 16), end: new Date(2025, 1, 16), title: "Present", hours: 7.5, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 17), end: new Date(2025, 1, 17), title: "Absent", hours: 0, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 18), end: new Date(2025, 1, 18), title: "Present", hours: 8, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 19), end: new Date(2025, 1, 19), title: "Present", hours: 6, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 22), end: new Date(2025, 1, 22), title: "Present", hours: 8, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 23), end: new Date(2025, 1, 23), title: "Present", hours: 7.5, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 24), end: new Date(2025, 1, 24), title: "Present", hours: 8, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 25), end: new Date(2025, 1, 25), title: "Absent", hours: 0, name: "John Doe", role: "Developer" },
  { start: new Date(2025, 1, 26), end: new Date(2025, 1, 26), title: "Present", hours: 6, name: "John Doe", role: "Developer" },
];

// Sample holidays
const holidays: AttendanceEvent[] = [
  { start: new Date(2025, 1, 29), end: new Date(2025, 1, 29), title: "Memorial Day", isHoliday: true },
  { start: new Date(2025, 2, 4), end: new Date(2025, 2, 4), title: "Independence Day", isHoliday: true },
  { start: new Date(2025, 1, 4), end: new Date(2025, 1, 4), title: "Labor Day", isHoliday: true },
];

const allEvents: AttendanceEvent[] = [...attendanceData, ...holidays];

export default function AttendanceCalendar() {
  const [selectedEvent, setSelectedEvent] = useState<AttendanceEvent | null>(null);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const handleSelectEvent = (event: AttendanceEvent) => {
    setSelectedEvent(event);
  };

  const closeSidebar = () => {
    setSelectedEvent(null);
  };

  const eventStyleGetter = (event: AttendanceEvent) => {
    if (event.isHoliday) {
      return { style: { backgroundColor: "#FCD34D", color: "#000000" } };
    }
    const backgroundColor = event.title === "Present" ? "#10B981" : "#EF4444";
    return { style: { backgroundColor } };
  };

  const dayPropGetter = (date: Date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      return {
        style: {
          backgroundColor: "#F3F4F6",
        },
      };
    }
    return {};
  };

  const CustomToolbar = ({ label }: ToolbarProps) => (
    <div className="rbc-toolbar">
      <span className="rbc-toolbar-label">{label}</span>
    </div>
  );

  const CustomEvent = ({ event }: EventProps<AttendanceEvent>) => (
    <Tooltip
      title={
        event.isHoliday ? (
          <p>Holiday: {event.title}</p>
        ) : (
          <>
            <p>Name: {event.name}</p>
            <p>Role: {event.role}</p>
            <p>Status: {event.title}</p>
            <p>Hours: {event.hours}</p>
          </>
        )
      }
    >
      <div className="rbc-event-content">
        {event.title} {!event.isHoliday && `- ${event.hours} hours`}
      </div>
    </Tooltip>
  );

  const CustomNavigation = ({ onNavigate }: { onNavigate: (action: Navigate) => void }) => (
    <>
      <button
        onClick={() => onNavigate(Navigate.PREVIOUS)}
        className="absolute -left-6 top-1/2 transform -translate-y-1/2 bg-red p-1 rounded-full shadow-md z-10"
        aria-label="Previous"
      >
        <AiOutlineLeftCircle className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={() => onNavigate(Navigate.NEXT)}
        className="absolute -right-6 top-1/2 transform -translate-y-1/2 bg-red p-1 rounded-full shadow-md z-10"
        aria-label="Next"
      >
        <AiOutlineRightCircle className="h-6 w-6 text-white" />
      </button>
    </>
  );

  const { components, defaultDate } = useMemo(
    () => ({
      components: {
        toolbar: CustomToolbar,
        event: CustomEvent,
      },
      defaultDate: new Date(),
    }),
    []
  );

  useEffect(() => {
    console.log("Current date changed:", currentDate);
  }, [currentDate]);

  return (
    <div className="h-[600px] w-[93%] mx-auto p-4 py-4 relative">
      <Calendar
        localizer={localizer}
        events={allEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        components={components}
        defaultDate={defaultDate}
        defaultView="month"
        views={["month", "week"]}
        date={currentDate}
        onNavigate={(newDate) => setCurrentDate(newDate)}
      />
      <CustomNavigation
        onNavigate={(action) => {
          const newDate = new Date(currentDate);
          switch (action) {
            case Navigate.PREVIOUS:
              newDate.setMonth(newDate.getMonth() - 1);
              break;
            case Navigate.NEXT:
              newDate.setMonth(newDate.getMonth() + 1);
              break;
          }
          setCurrentDate(newDate);
        }}
      />
      {selectedEvent && (
      <div className="fixed right-0 bg-white top-0 h-full w-80 shadow-xl p-6 z-50 flex flex-col">
      {/* Close Button */}
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl transition duration-300"
        onClick={closeSidebar}
        aria-label="Close Sidebar"
      >
        ✖
      </button>
    
      {/* Header Section */}
      <div className="flex items-center justify-center mb-6">
        <h2
          className={`text-2xl font-bold ${
            selectedEvent?.isHoliday ? "text-yellow-500" : "text-blue-600"
          }`}
        >
          {selectedEvent?.isHoliday ? "Holiday" : "Attendance Details"}
        </h2>
      </div>
    
      {/* Event Details */}
      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-600 text-lg font-medium mb-4">
          <span className="font-semibold text-gray-800">Date:</span>{" "}
          {moment(selectedEvent?.start).format("MMMM D, YYYY")}
        </p>
    
        {selectedEvent?.isHoliday ? (
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-md">
            <p className="text-gray-800 font-semibold">🎉 {selectedEvent.title}</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-green-100 border-l-4 border-green-500 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">Name:</span> {selectedEvent?.name}
              </p>
            </div>
            <div className="p-4 bg-blue-100 border-l-4 border-blue-500 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">Role:</span> {selectedEvent?.role}
              </p>
            </div>
            <div className="p-4 bg-indigo-100 border-l-4 border-indigo-500 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">Status:</span> {selectedEvent?.title}
              </p>
            </div>
            <div className="p-4 bg-purple-100 border-l-4 border-purple-500 rounded-md">
              <p className="text-gray-800">
                <span className="font-semibold">Hours:</span> {selectedEvent?.hours}
              </p>
            </div>
          </div>
        )}
      </div>
    
      {/* Footer Section */}
      <div className="mt-6">
        <button
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-lg font-medium hover:bg-blue-700 transition duration-300"
          onClick={closeSidebar}
        >
          Close
        </button>
      </div>
    </div>
    
      )}
    </div>
  );
}
