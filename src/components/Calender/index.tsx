"use client";
import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import {
  addEvent,
  removeEvent,
  editEvent,
} from "../../redux/slice/calendarSlice";
// import { MdDelete } from "react-icons/md";

const Calendar = () => {
  const dispatch = useDispatch();
  const events = useSelector((state: RootState) => state.calendar.events);

  const filteredEvents = events.filter((event) => event.id !== "2");

  const handleDateSelect = (selectInfo: any) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    if (title) {
      const newEvent = {
        id: String(events.length + 1),
        title,
        start: selectInfo.startStr,
        allDay: selectInfo.allDay,
      };
      dispatch(addEvent(newEvent));
    }
  };

  const handleEventClick = (clickInfo: any) => {
    const eventId = clickInfo.event.id;
    const existingEvent = events.find((event) => event.id === eventId);

    if (existingEvent) {
      const newTitle = prompt("Edit event title:", existingEvent.title);
      if (newTitle) {
        const updatedEvent = {
          ...existingEvent,
          title: newTitle,
        };
        dispatch(editEvent(updatedEvent));
      }
    }
  };

  const handleEventRemove = (eventId: string) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      dispatch(removeEvent(eventId));
    }
  };

  return (
    <div className="container mx-auto px-4 pb-8 pt-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        events={filteredEvents}
        select={handleDateSelect}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        eventDidMount={(info) => {
          const deleteButtonWrapper = document.createElement("div");
          deleteButtonWrapper.className = "flex items-center space-x-2";

          const deleteIcon = document.createElement("span");
          deleteIcon.innerHTML = `<svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>`;
          deleteIcon.style.color = "red";

          const deleteText = document.createElement("span");
          deleteText.innerText = "Delete";
          deleteText.style.color = "red";
          deleteText.className = "text-red-500 cursor-pointer";

          deleteButtonWrapper.appendChild(deleteIcon);
          deleteButtonWrapper.appendChild(deleteText);

          deleteButtonWrapper.onclick = () => handleEventRemove(info.event.id);

          info.el.appendChild(deleteButtonWrapper);
        }}
      />
    </div>
  );
};

export default Calendar;
