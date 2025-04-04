// DashboardMetrics.jsx
import React from 'react';
import '../../../css/styles/admin/Metrics.css';

const DashboardMetrics = () => {
  // Add click handlers for each card
  const handleCardClick = (metricType) => {
    console.log(`${metricType} card clicked`);
    // Add navigation or further actions here
  };

  return (
    <div className="dashboard-metrics">
      <div className="metrics-row">
        {/* Metric cards will be added here */}
      </div>
      <div className="metrics-row">
        {/* Metric cards will be added here */}
      </div>
    </div>
  );
};

export default DashboardMetrics;