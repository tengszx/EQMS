import React, { useState } from 'react';
import { Clock, Edit2, Trash2 } from 'lucide-react';

const EventControl = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventTime, setEventTime] = useState({ 
        start: { hour: '12', minute: '00', period: 'AM' },
        end: { hour: '01', minute: '00', period: 'PM' }
    });
    const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState({
        start: false,
        end: false
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [updateType, setUpdateType] = useState('');
    const [description, setDescription] = useState('');

    const hours = Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'));
    const minutes = Array.from({length: 60}, (_, i) => i.toString().padStart(2, '0'));
    const periods = ['AM', 'PM'];

    const formatTime = (timeObj) => {
        return `${timeObj.hour}:${timeObj.minute} ${timeObj.period}`;
    };

    const handleTimeSelect = (value, type, field) => {
        const updatedTime = {
            ...eventTime,
            [type]: {
                ...eventTime[type],
                [field]: value
            }
        };
        
        setEventTime(updatedTime);
        
        // Only close dropdown if all selections are made
        const isComplete = 
            updatedTime[type].hour !== '' && 
            updatedTime[type].minute !== '' && 
            updatedTime[type].period !== '';
        
        if (isComplete) {
            setIsTimeDropdownOpen(prev => ({
                ...prev,
                [type]: false
            }));
        }
    };

    const toggleTimeDropdown = (type) => {
        setIsTimeDropdownOpen(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handlePostEvent = () => {
        if (!updateType || !description) {
            alert('Please fill in all required fields');
            return;
        }

        const newEvent = {
            time: `${formatTime(eventTime.start)} - ${formatTime(eventTime.end)}`,
            date: `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
            type: updateType,
            description: description
        };

        setEvents([...events, newEvent]);
        resetForm();
    };

    const resetForm = () => {
        setEventTime({ 
            start: { hour: '12', minute: '00', period: 'AM' },
            end: { hour: '01', minute: '00', period: 'PM' }
        });
        setStartDate(new Date());
        setEndDate(new Date());
        setUpdateType('');
        setDescription('');
        setSelectedEvent(null);
    };

    const handleEditEvent = (index) => {
        const eventToEdit = events[index];
        const [startTime, endTime] = eventToEdit.time.split(' - ');
        
        const parseTime = (timeStr) => {
            const [time, period] = timeStr.split(' ');
            const [hour, minute] = time.split(':');
            return { hour, minute, period };
        };

        setSelectedEvent(index);
        setEventTime({
            start: parseTime(startTime),
            end: parseTime(endTime)
        });
        
        setStartDate(new Date());
        setEndDate(new Date());
        setUpdateType(eventToEdit.type);
        setDescription(eventToEdit.description);
    };

    const handleUpdateEvent = () => {
        if (selectedEvent !== null) {
            const updatedEvents = [...events];
            updatedEvents[selectedEvent] = {
                time: `${formatTime(eventTime.start)} - ${formatTime(eventTime.end)}`,
                date: `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
                type: updateType,
                description: description
            };
            setEvents(updatedEvents);
            resetForm();
        }
    };

    const handleDeleteEvent = (index) => {
        const updatedEvents = events.filter((_, i) => i !== index);
        setEvents(updatedEvents);
    };

    return (
        <div className="event-control-container">
            <div className="set-event-container">
                <h2>Create/Edit Event</h2>
                <div className="time-input">
                    <label>Event Time</label>
                    <div className="time-range">
                        <div className="start-time-select">
                            <label>Start Time</label>
                            <div className="time-picker-container">
                                <div 
                                    className="time-input-with-icon"
                                    onClick={() => toggleTimeDropdown('start')}
                                >
                                    <span>{formatTime(eventTime.start)}</span>
                                    <Clock size={20} />
                                </div>
                                {isTimeDropdownOpen.start && (
                                    <div className="time-dropdown">
                                        <div className="time-selection-grid">
                                            <div className="time-column hours-column">
                                                {hours.map(hour => (
                                                    <div 
                                                        key={hour} 
                                                        className={`time-option ${eventTime.start.hour === hour ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(hour, 'start', 'hour')}
                                                    >
                                                        {hour}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="time-column minutes-column">
                                                {minutes.map(minute => (
                                                    <div 
                                                        key={minute} 
                                                        className={`time-option ${eventTime.start.minute === minute ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(minute, 'start', 'minute')}
                                                    >
                                                        {minute}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="time-column period-column">
                                                {periods.map(period => (
                                                    <div 
                                                        key={period} 
                                                        className={`time-option ${eventTime.start.period === period ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(period, 'start', 'period')}
                                                    >
                                                        {period}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="end-time-select">
                            <label>End Time</label>
                            <div className="time-picker-container">
                                <div 
                                    className="time-input-with-icon"
                                    onClick={() => toggleTimeDropdown('end')}
                                >
                                    <span>{formatTime(eventTime.end)}</span>
                                    <Clock size={20} />
                                </div>
                                {isTimeDropdownOpen.end && (
                                    <div className="time-dropdown">
                                        <div className="time-selection-grid">
                                            <div className="time-column hours-column">
                                                {hours.map(hour => (
                                                    <div 
                                                        key={hour} 
                                                        className={`time-option ${eventTime.end.hour === hour ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(hour, 'end', 'hour')}
                                                    >
                                                        {hour}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="time-column minutes-column">
                                                {minutes.map(minute => (
                                                    <div 
                                                        key={minute} 
                                                        className={`time-option ${eventTime.end.minute === minute ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(minute, 'end', 'minute')}
                                                    >
                                                        {minute}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="time-column period-column">
                                                {periods.map(period => (
                                                    <div 
                                                        key={period} 
                                                        className={`time-option ${eventTime.end.period === period ? 'selected' : ''}`}
                                                        onClick={() => handleTimeSelect(period, 'end', 'period')}
                                                    >
                                                        {period}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="date-input">
                        <div className="start-date">
                            <label>Start Date</label>
                            <input 
                                type="date" 
                                value={startDate.toISOString().split('T')[0]} 
                                onChange={(e) => setStartDate(new Date(e.target.value))}
                            />
                        </div>
                        <div className="end-date">
                            <label>End Date</label>
                            <input 
                                type="date" 
                                value={endDate.toISOString().split('T')[0]} 
                                onChange={(e) => setEndDate(new Date(e.target.value))}
                            />
                        </div>
                    </div>

                    <div className="update-type-input">
                        <label>Update Type</label>
                        <select 
                            value={updateType} 
                            onChange={(e) => setUpdateType(e.target.value)}
                        >
                            <option value="">Select Type</option>
                            <option value="Update">Update</option>
                            <option value="New Features">New Features</option>
                            <option value="System Maintenance">System Maintenance</option>
                        </select>
                    </div>

                    <div className="description-input">
                        <label>Description</label>
                        <textarea 
                            value={description} 
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter event description"
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <div className="form-action-buttons">
                            <button 
                                className="post-btn" 
                                onClick={selectedEvent !== null ? handleUpdateEvent : handlePostEvent}
                            >
                                {selectedEvent !== null ? 'Update Event' : 'Post Event'}
                            </button>
                            {selectedEvent !== null && (
                                <button 
                                    className="cancel-btn" 
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}
                            <button 
                                className="clear-btn" 
                                onClick={resetForm}
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="ongoing-events-container">
                <h2>Ongoing Events</h2>
                {events.length === 0 ? (
                    <div className="no-events-message">No events created yet</div>
                ) : (
                    events.map((event, index) => (
                        <div key={index} className="event-item">
                            <div className="event-details">
                                <div className="event-time">
                                    <span className="start-time">{event.time.split(' - ')[0]}</span>
                                    <span className="separator">to</span>
                                    <span className="end-time">{event.time.split(' - ')[1]}</span>
                                </div>
                                <div className="event-date">{event.date}</div>
                                <div className="event-type">{event.type}</div>
                                <div className="event-description">{event.description}</div>
                            </div>
                            <div className="event-actions">
                                <button 
                                    className="edit-btn" 
                                    onClick={() => handleEditEvent(index)}
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button 
                                    className="delete-btn" 
                                    onClick={() => handleDeleteEvent(index)}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventControl;