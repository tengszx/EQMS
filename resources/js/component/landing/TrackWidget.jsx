import React from 'react';
import '../../../css/styles/landing/TrackWidget.css';
import { BookOpenText } from 'lucide-react'; // Import the icon

const TrackWidget = () => {
    return (
        <div className="widget"> {/* Changed class name to match the structure */}
            <BookOpenText className="widget-icon" /> {/* Use the icon for tracking revisions */}
            <div className="widget-header">
                <div className="widget-name">Track Revisions</div> {/* Title for the track widget */}
                <div className="widget-settings"> {/* Button for settings */}
                    <button>⋮</button>
                </div>
            </div>
        </div>
    );
};

export default TrackWidget;