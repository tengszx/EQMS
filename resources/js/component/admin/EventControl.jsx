import React, { useState } from 'react';
import { Clock, Edit2, Trash2, X } from 'lucide-react';
import '../../../css/styles/admin/EventControl.css';

const CustomTimePicker = ({ 
    value, 
    onChange, 
    label = "Select Time" 
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('12');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const [selectedPeriod, setSelectedPeriod] = useState('am');

    const hourOptions = Array.from({ length: 12 }, (_, i) => 
        String(i + 1).padStart(2, '0')
    );

    const minuteOptions = Array.from({ length: 60 }, (_, i) => 
        String(i).padStart(2, '0')
    );

    const handleTimeSelect = () => {
        const formattedTime = `${selectedHour}:${selectedMinute} ${selectedPeriod}`;
        onChange(formattedTime);
        setIsOpen(false);
    };

    return (
        <div className="custom-time-picker">
            <div className="time-display-container">
                <input 
                    type="text" 
                    value={value || '12:00 AM'} 
                    readOnly 
                    className="time-display"
                />
                <div className="time-icon-wrapper">
                    <Clock 
                        size={18} 
                        className="time-icon" 
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="time-dropdown">
                    <div className="time-select-grid">
                        <div className="hour-column">
                            <div className="column-header">Hour</div>
                            <div className="scrollable-column">
                                {hourOptions.map(hour => (
                                    <div 
                                        key={hour} 
                                        className={`time-option ${selectedHour === hour ? 'selected' : ''}`}
                                        onClick={() => setSelectedHour(hour)}
                                    >
                                        {hour}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="minute-column">
                            <div className="column-header">Minute</div>
                            <div className="scrollable-column">
                                {minuteOptions.map(minute => (
                                    <div 
                                        key={minute} 
                                        className={`time-option ${selectedMinute === minute ? 'selected' : ''}`}
                                        onClick={() => setSelectedMinute(minute)}
                                    >
                                        {minute}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="period-column">
                            <div className="column-header">Period</div>
                            <div className="scrollable-column">
                                {['AM', 'PM'].map(period => (
                                    <div 
                                        key={period} 
                                        className={`time-option ${selectedPeriod === period ? 'selected' : ''}`}
                                        onClick={() => setSelectedPeriod(period)}
                                    >
                                        {period}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="time-select-actions">
                        <button 
                            className="select-time-btn"
                            onClick={handleTimeSelect}
                        >
                            Select Time
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const EventControl = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventTime, setEventTime] = useState({ 
        start: '12:00 AM', 
        end: '12:00 PM' 
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [updateType, setUpdateType] = useState('');
    const [description, setDescription] = useState('');

    const handlePostEvent = () => {
        if (!updateType || !description) {
            alert('Please fill in all required fields');
            return;
        }

        const newEvent = {
            time: `${eventTime.start} - ${eventTime.end}`,
            date: `${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
            type: updateType,
            description: description
        };

        setEvents([...events, newEvent]);
        resetForm();
    };

    const resetForm = () => {
        setEventTime({ 
            start: '12:00 AM', 
            end: '12:00 PM' 
        });
        setStartDate(new Date());
        setEndDate(new Date());
        setUpdateType('');
        setDescription('');
        setSelectedEvent(null);
    };

    const handleEditEvent = (index) => {
        const eventToEdit = events[index];
        setSelectedEvent(index);
        
        const [startTime, endTime] = eventToEdit.time.split(' - ');
        
        setEventTime({
            start: startTime,
            end: endTime
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
                time: `${eventTime.start} - ${eventTime.end}`,
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
                <div className="time-input">
                    <label>Time</label>
                    <div className="time-range">
                        <div className="start-time-select">
                            <label>Start Time</label>
                            <CustomTimePicker 
                                value={eventTime.start}
                                onChange={(time) => setEventTime(prev => ({...prev, start: time}))}
                            />
                        </div>
                        <div className="end-time-select">
                            <label>End Time</label>
                            <CustomTimePicker 
                                value={eventTime.end}
                                onChange={(time) => setEventTime(prev => ({...prev, end: time}))}
                            />
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
                    <label>Update</label>
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
                    <button 
                        className="post-btn" 
                        onClick={selectedEvent !== null ? handleUpdateEvent : handlePostEvent}
                    >
                        {selectedEvent !== null ? 'Update' : 'Post'}
                    </button>
                    {selectedEvent !== null && (
                        <button 
                            className="cancel-btn" 
                            onClick={resetForm}
                        >
                            <X size={16} /> Cancel
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

            <div className="ongoing-events-container">
                <h2>Ongoing Events</h2>
                {events.map((event, index) => (
                    <div key={index} className="event-item">
                        <div className="event-details">
                            <div className="event-time">
                                <span className="start-time">{event.time.split(' - ')[0]}</span>
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
                ))}
            </div>
        </div>
    );
};

export default EventControl;