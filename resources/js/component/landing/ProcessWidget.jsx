import React from 'react';
import '../../../css/styles/landing/ProcessWidget.css';

const ProcessWidget = () => {
  const handleClick = () => {
    console.log('Process Monitoring widget clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="process-widget" onClick={handleClick}>
      <div className="process-content">
        <h2>Process Monitoring</h2>
        <p>
          The continuous observation and evaluation of processes
          to ensure they operate efficiently, meet predefined
          standards, and identify areas for improvement.
        </p>
      </div>
    </div>
  );
};

export default ProcessWidget;