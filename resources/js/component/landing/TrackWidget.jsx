import React from 'react';
import '../../../css/styles/landing/TrackWidget.css';

const TrackWidget = () => {
  const handleClick = () => {
    console.log('Track Revisions widget clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="track-widget" onClick={handleClick}>
      <div className="track-content">
        <h2>Track Revisions</h2>
        <p>
          The practice of monitoring changes made to documents or
          processes over time, enabling organizations to maintain
          version control and ensure that the most current information is
          used.
        </p>
      </div>
    </div>
  );
};

export default TrackWidget;