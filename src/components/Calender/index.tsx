"use client";
import React from "react";
import FullCalender from "@fullcalendar/react";
import Breadcrumb from "../Breadcrumbs/Breadcrumb";
import dayGridPugins from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, {
  Draggable,
  DropArg,
} from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
// import dayjs from "dayjs";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

interface Event {
  title: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}
const Calendar = () => {
  const [events, setEvents] = useState([
    { title: "event 1", id: "1" },
    { title: "event 2", id: "2" },
    { title: "event 3", id: "3" },
    { title: "event 4", id: "4" },
    { title: "event 5", id: "5" },
  ]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  // const [showmodal, setShowModal] = useState(false);
  // const [showDeleteModal, setShowDeleteModal] = useState(false);
  // const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    start: "",
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    let draggableEl = document.getElementById("draggable-el");
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: ".fc-event",
        eventData: function (eventEl) {
          let title = eventEl.getAttribute("title");
          let id = eventEl.getAttribute("data");
          let start = eventEl.getAttribute("start");
          return { title, id, start };
        },
      });
    }
  }, []);
  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col  ">
      <Breadcrumb pageName="Calendar" />

      {/* <div className="flex flex-grow items-center justify-center">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="h-full w-full max-w-[400px]">
            <DateCalendar
              defaultValue={dayjs("2022-04-17")}
              views={["year", "month", "day"]}
              className="h-full"
            />
          </div>
        </LocalizationProvider>
      </div> */}

      <h1 className="flex-col items-center justify-between ">
        <div className="grid grid-cols-10">
          <div className="col-span-8">
            <FullCalender
              plugins={[dayGridPugins, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "resourcetimelinework, dayGridMonth,timeGridWeek",
              }}
              events={allEvents}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              // dateClick={handleDateClick}
              // drop={true}
              // eventClick={ }
            />
          </div>
          <div
            id="draggable-el"
            className="bg-purple ml-8 mt-16 w-full rounded-md border-2 p-2 lg:h-1/2"
          >
            <h1 className="text-center text-lg font-bold">Drag Event</h1>
            {events.map((event) => (
              <div
                className=" m-2 ml-auto w-full rounded-md border-2 bg-white p-1 text-center"
                title={event.title}
                key={event.id}
              >
                {event.title}
              </div>
            ))}
          </div>
        </div>
      </h1>
    </div>
  );
};

export default Calendar;
