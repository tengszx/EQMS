// DashboardMetrics.jsx
import React from 'react';
import { Mail, Users, Hammer, MoveRight, NotebookText } from 'lucide-react';
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
        <div 
          className="metric-card documents"
          onClick={() => handleCardClick('Documents')}
        >
          <div className="metric-icon">
            <Mail size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Documents</h3>
            <p className="metric-value">120 Active</p>
          </div>
        </div>

        <div 
          className="metric-card cases"
          onClick={() => handleCardClick('CAPA Cases')}
        >
          <div className="metric-icon">
            <Users size={24} />
          </div>
          <div className="metric-content">
            <h3>Open CAPA Cases</h3>
            <p className="metric-value">5 pending</p>
          </div>
        </div>

        <div 
          className="metric-card compliance"
          onClick={() => handleCardClick('Training Compliance')}
        >
          <div className="metric-icon">
            <Hammer size={24} />
          </div>
          <div className="metric-content training-compliance">
            <h3>Training Compliance</h3>
            <div className="gauge-container">
              <div className="gauge">
                <div className="gauge-fill"></div>
                <div className="gauge-center">
                  <span className="percentage">85%</span>
                  <span className="completed">Completed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="metrics-row">
        <div 
          className="metric-card audits"
          onClick={() => handleCardClick('Upcoming Audits')}
        >
          <div className="metric-icon">
            <MoveRight size={24} />
          </div>
          <div className="metric-content">
            <h3>Upcoming Audits</h3>
            <p className="metric-value">3 Scheduled</p>
          </div>
        </div>

        <div 
          className="metric-card regulatory"
          onClick={() => handleCardClick('Regulatory Compliance')}
        >
          <div className="metric-icon">
            <NotebookText size={24} />
          </div>
          <div className="metric-content">
            <h3>Regulatory Compliance Status:</h3>
            <p className="metric-value">ISO 9001: Compliant</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardMetrics;