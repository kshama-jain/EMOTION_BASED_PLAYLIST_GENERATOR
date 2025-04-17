import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Sidebar from "@/components/Sidebar";
import CreateEventDialog from "@/components/CreateEventDialog";
import { CalendarViewType, CalendarDisplayType } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import axios from "axios";

export default function Calendar() {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [calendarView, setCalendarView] = useState<CalendarViewType>("fullCalendar");
  const [displayView, setDisplayView] = useState<CalendarDisplayType>("month");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!token) return;
    axios.get("http://localhost:8000/playlist-events", { headers: { token } })
      .then(res => setEvents(res.data));
  }, [token]);

  if (!isAuthenticated) {
    return null;
  }

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.time ? `${event.date}T${event.time}` : event.date,
    allDay: !event.time,
    backgroundColor: getEventColor(event.color),
    borderColor: getEventColor(event.color),
    extendedProps: {
      type: event.type,
      description: event.description
    }
  }));

  function getEventColor(color: string | undefined) {
    switch (color) {
      case 'green': return '#1DB954';
      case 'purple': return '#6A39AF';
      case 'blue': return '#3083DC';
      case 'yellow': return '#E7B040';
      default: return '#1DB954';
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white">
      <Sidebar />
      
      <div className="flex-grow p-6 md:p-8 overflow-y-auto bg-[#121212]">
        <div className="pb-16">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold">Your Music Calendar</h1>
              <p className="text-gray-400">
                View your playlist creation history and plan your music listening schedule.
              </p>
            </div>
          </div>

          {/* Calendar Navigation Tabs */}
          <Tabs 
            defaultValue="fullCalendar" 
            value={calendarView}
            onValueChange={(value) => setCalendarView(value as CalendarViewType)}
            className="mb-4"
          >
            <TabsList className="bg-[#181818] rounded-lg p-1">
              <TabsTrigger 
                value="fullCalendar" 
                className="data-[state=active]:bg-[#282828] data-[state=active]:text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Full Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="simple" 
                className="data-[state=active]:bg-[#282828] data-[state=active]:text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Simple
              </TabsTrigger>
              <TabsTrigger 
                value="playlists" 
                className="data-[state=active]:bg-[#282828] data-[state=active]:text-white"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                </svg>
                Playlists
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* View Content */}
          {calendarView === "fullCalendar" && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
                <h2 className="text-xl font-bold">Full Calendar View</h2>
                <div className="flex space-x-2">
                  <Tabs 
                    defaultValue="month" 
                    value={displayView}
                    onValueChange={(value) => setDisplayView(value as CalendarDisplayType)}
                  >
                    <TabsList className="bg-[#282828] rounded-md">
                      <TabsTrigger 
                        value="month" 
                        className="text-sm data-[state=active]:bg-gray-700"
                      >
                        month
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>

              <div className="bg-[#181818] rounded-lg p-4 overflow-hidden">
                <div className="fc-theme-standard">
                  <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView={"dayGridMonth"}
                    headerToolbar={{
                      left: "prev,next today",
                      center: "title",
                      right: "",
                    }}
                    events={calendarEvents}
                    height="auto"
                    themeSystem="standard"
                    nowIndicator={true}
                    dayMaxEvents={true}
                    eventClick={(info) => {
                      alert(`Event: ${info.event.title}`);
                    }}
                    dateClick={(info) => {
                      setShowCreateModal(true);
                    }}
                  />
                </div>
              </div>
            </div>
          )}
          
          {calendarView === "simple" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Simple View</h2>
              <div className="bg-[#181818] rounded-lg p-4">
                <div className="space-y-2">
                  {events.length > 0 ? (
                    events.map((event) => (
                      <div key={event.id} className="p-4 bg-[#282828] rounded-md hover:bg-opacity-80 transition-colors">
                        <div className="font-medium">{event.title}</div>
                        <div className="text-sm text-gray-400">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                          {event.time && ` at ${event.time}`}
                        </div>
                        {event.description && (
                          <div className="mt-2 text-sm">{event.description}</div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      No events to display. Create your first event!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {calendarView === "playlists" && (
            <div>
              <h2 className="text-xl font-bold mb-4">Playlist Calendar</h2>
              <p className="text-gray-400 mb-4">Track when you created your playlists.</p>
              <div className="space-y-3">
                {events.length > 0 ? (
                  events.map((event) => (
                    <div 
                      key={event.id} 
                      className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div 
                          className={`w-4 h-4 rounded-full`}
                          style={{ backgroundColor: getEventColor(event.color) }}
                        ></div>
                        <div className="ml-4">
                          <h3 className="font-medium">{event.title}</h3>
                          <p className="text-sm text-gray-400">{event.date}</p>
                          <p className="text-xs text-gray-500">{event.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No playlist events to display.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <CreateEventDialog
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
