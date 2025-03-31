import React from 'react';
import '../../../css/styles/landing/GenerateWidget.css';

const GenerateWidget = () => {
  const handleClick = () => {
    console.log('Generate Reports widget clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="generate-widget" onClick={handleClick}>
      <div className="generate-content">
        <h2>Generate Reports</h2>
        <p>
          The process of analyzing data to generate insights and actionable
          reports that help organizations make informed decisions based
          on historical and real-time information.
        </p>
      </div>
    </div>
  );
};

export default GenerateWidget;