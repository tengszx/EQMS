import React, { useState, useEffect } from 'react';
import { 
  add, 
  eachDayOfInterval, 
  endOfMonth, 
  format, 
  getDay, 
  isEqual, 
  isToday, 
  parse, 
  startOfToday, 
  startOfMonth 
} from 'date-fns';
import { Calendar, Clock, Trash2, Edit, X } from 'lucide-react';
import '../../../css/styles/admin/CalendarDashboard.css'

const CalendarDashboard = () => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const [events, setEvents] = useState([]);
  const [editingEventId, setEditingEventId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: format(today, 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '10:00',
    title: '',
    description: ''
  });

  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());
  const days = eachDayOfInterval({
    start: startOfMonth(firstDayCurrentMonth),
    end: endOfMonth(firstDayCurrentMonth)
  });
  const startingDayIndex = getDay(days[0]);

  const previousMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  };

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    const formattedDate = format(day, 'yyyy-MM-dd');
    setNewEvent(prev => ({
      ...prev,
      date: formattedDate
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const saveEvent = () => {
    if (newEvent.title.trim() === '') return;
    
    let updatedEvents;
    
    if (editingEventId) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === editingEventId ? { ...newEvent, id: editingEventId } : event
      );
    } else {
      // Add new event
      updatedEvents = [...events, { ...newEvent, id: Date.now() }];
    }
    
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    resetForm();
  };

  const editEvent = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setNewEvent(eventToEdit);
      setEditingEventId(eventId);
      setShowForm(true);
    }
  };

  const deleteEvent = (eventId) => {
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const resetForm = () => {
    setNewEvent({
      date: format(selectedDay, 'yyyy-MM-dd'),
      startTime: '09:00',
      endTime: '10:00',
      title: '',
      description: ''
    });
    setEditingEventId(null);
    setShowForm(false);
  };

  // Get events from localStorage on component mount
  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Check if a day has events
  const dayHasEvents = (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    return events.some(event => event.date === formattedDate);
  };

  // Get events for selected day
  const getEventsForDay = (day) => {
    const formattedDate = format(day, 'yyyy-MM-dd');
    return events.filter(event => event.date === formattedDate);
  };

  return (
    <div className="calendar-dashboard">
      <div className="calendar-container">
        <div className="calendar-header">
          <h2 className="month-title">{format(firstDayCurrentMonth, 'MMMM yyyy')}</h2>
          <div className="month-navigation">
            <button className="nav-button" onClick={previousMonth}>&lt;</button>
            <button className="nav-button" onClick={nextMonth}>&gt;</button>
          </div>
        </div>

        <div className="weekday-header">
          <div>MO</div>
          <div>TU</div>
          <div>WE</div>
          <div>TH</div>
          <div>FR</div>
          <div>SA</div>
          <div>SU</div>
        </div>

        <div className="calendar-grid">
          {/* Empty cells for days of previous month */}
          {Array.from({ length: startingDayIndex }).map((_, index) => (
            <div key={`empty-${index}`} className="calendar-day empty"></div>
          ))}

          {/* Calendar days */}
          {days.map((day) => (
            <div
              key={day.toString()}
              className={`calendar-day ${
                isEqual(day, selectedDay) ? 'selected' : ''
              } ${isToday(day) ? 'today' : ''} ${
                dayHasEvents(day) ? 'has-events' : ''
              }`}
              onClick={() => handleDayClick(day)}
            >
              <span className="day-number">{format(day, 'd')}</span>
              {dayHasEvents(day) && (
                <div className="event-indicator"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Events container with inline form */}
      <div className="events-container">
        <h3 className="events-header">
          <Calendar size={18} />
          <span>Events for {format(selectedDay, 'MMMM d, yyyy')}</span>
          <button 
            className={`add-event-button ${showForm ? 'active' : ''}`} 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancel' : 'Add Event'}
          </button>
        </h3>

        {/* Inline event form */}
        {showForm && (
          <div className="event-form">
            <div className="form-group">
              <label>Date & Time</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label>Purpose</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                placeholder="Enter event title"
                className="form-control"
              />
            </div>

            <div className="form-row">
              <div className="form-group half">
                <label>Start</label>
                <input
                  type="time"
                  name="startTime"
                  value={newEvent.startTime}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
              <div className="form-group half">
                <label>End</label>
                <input
                  type="time"
                  name="endTime"
                  value={newEvent.endTime}
                  onChange={handleInputChange}
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                rows="3"
                className="form-control"
              ></textarea>
            </div>

            <div className="form-actions">
              <button className="save-button" onClick={saveEvent}>
                {editingEventId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        )}

        {/* Events list */}
        <div className="events-list">
          {getEventsForDay(selectedDay).length > 0 ? (
            getEventsForDay(selectedDay).map(event => (
              <div key={event.id} className="event-item">
                <div className="event-content">
                  <div className="event-time">
                    <Clock size={14} />
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                  <div className="event-title">{event.title}</div>
                  {event.description && (
                    <div className="event-description">{event.description}</div>
                  )}
                </div>
                <div className="event-actions">
                  <button className="event-action-btn edit" onClick={() => editEvent(event.id)}>
                    <Edit size={16} />
                  </button>
                  <button className="event-action-btn delete" onClick={() => deleteEvent(event.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="no-events">No events scheduled for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarDashboard;