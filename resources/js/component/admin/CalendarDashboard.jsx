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
    startTime: '00:00',
    endTime: '00:00',
    title: '',
    description: '',
    to: '',
    from: ''
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
    
    const eventToSave = {
      ...newEvent
    };
    
    let updatedEvents;
    
    if (editingEventId) {
      // Update existing event
      updatedEvents = events.map(event => 
        event.id === editingEventId ? { ...eventToSave, id: editingEventId } : event
      );
    } else {
      // Add new event
      updatedEvents = [...events, { ...eventToSave, id: Date.now() }];
    }
    
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    resetForm();
  };

  const editEvent = (eventId) => {
    const eventToEdit = events.find(event => event.id === eventId);
    if (eventToEdit) {
      setNewEvent({
        ...eventToEdit
      });
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
      startTime: '00:00',
      endTime: '00:00',
      title: '',
      description: '',
      to: '',
      from: ''
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

  // Format for display in the date card
  const formatDisplayDate = (date) => {
    return format(new Date(date), 'd MMMM yyyy');
  };

  // Convert time to 12-hour format
  const convertTo12HourFormat = (time) => {
    const [hours, minutes] = time.split(':');
    const hoursAsNumber = parseInt(hours);
    const period = hoursAsNumber < 12 ? 'AM' : 'PM';
    const hoursIn12HourFormat = hoursAsNumber % 12 === 0 ? 12 : hoursAsNumber % 12;
    return `${hoursIn12HourFormat}:${minutes} ${period}`;
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
          <div>MON</div>
          <div>TUE</div>
          <div>WED</div>
          <div>THU</div>
          <div>FRI</div>
          <div>SAT</div>
          <div>SUN</div>
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

        {/* New Event Form Design */}
        {showForm && (
          <div className="event-form-container">
            <div className="date-time-card">
              <div className="date-time-header">
                <span>Date & Time</span>
              </div>
              <div className="date-display">
                <Calendar size={16} />
                <span>{formatDisplayDate(newEvent.date)}</span>
              </div>
              <div className="time-display">
                <Clock size={16} />
                <span>
                  <span className="start-time">{convertTo12HourFormat(newEvent.startTime)}</span>
                  {" - "}
                  <span className="end-time">{convertTo12HourFormat(newEvent.endTime)}</span>
                </span>
              </div>
            </div>
            
            <div className="form-card">
              <div className="form-field">
                <label>Purpose</label>
                <input
                  type="text"
                  name="title"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder=""
                />
              </div>
              
              <div className="form-row">
                <div className="form-field half">
                  <label>Start</label>
                  <div className="time-input-container">
                    <input
                      type="time"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                      className="time-input"
                    />
                  </div>
                </div>
                <div className="form-field half">
                  <label>End</label>
                  <div className="time-input-container">
                    <input
                      type="time"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                      className="time-input"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="description-card">
              <div className="description-header">Description</div>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleInputChange}
                rows="4"
              ></textarea>
            </div>
            
            {/* Hidden inputs for actual form submission */}
            <input
              type="date"
              name="date"
              value={newEvent.date}
              onChange={handleInputChange}
              hidden
            />
            
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
                    <span>
                      <span className="start-time-display">{convertTo12HourFormat(event.startTime)}</span>
                      {" - "}
                      <span className="end-time-display">{convertTo12HourFormat(event.endTime)}</span>
                    </span>
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