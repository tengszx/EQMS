import React from 'react';
import '../../../css/styles/landing/ReportingWidget.css';

const ReportingWidget = () => {
  const handleClick = () => {
    console.log('Reporting & Analytics widget clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="reporting-widget" onClick={handleClick}>
      <div className="reporting-content">
        <h2>Reporting & Analytics</h2>
        <p>
          The act of creating structured documents that summarize data,
          findings, or insights, often used for review, compliance, or
          decision-making purposes.
        </p>
      </div>
    </div>
  );
};

export default ReportingWidget;