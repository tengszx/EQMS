import React from 'react';
import '../../../css/styles/landing/TrackWidget.css';
import { BookOpenText } from 'lucide-react'; // Import the icon

const TrackWidget = () => {
    return (
        <div className="track-widget">
            <h1 className="track-title">
                <BookOpenText className="item-icon" /> {/* Place the icon here */}
                Track Revisions
            </h1>
        </div>
    );
};

export default TrackWidget;