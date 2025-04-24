// ChartDashboard.jsx
import React, { useState } from 'react';
import InProgressCompleteChart from '../../component/chart/InProgressCompleteChart';
import TotalAuditChart from '../../component/chart/TotalAuditChart';
import RevisionControlChart from '../../component/chart/RevisionControlChart';
import '../../../css/styles/admin/ChartDashboard.css';

const ChartDashboard = () => {
  const [auditStatus, setAuditStatus] = useState('Complete');
  
  const handleStatusChange = (e) => {
    setAuditStatus(e.target.value);
  };
  
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Chart Dashboard</h1>
      
      <div className="dashboard-grid">
        <div className="chart-container">
          <InProgressCompleteChart />
        </div>
        
        <div className="chart-container">
          <div className="chart-header">
            <select 
              className="status-dropdown" 
              value={auditStatus} 
              onChange={handleStatusChange}
            >
              <option value="Complete">Complete</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Incomplete">Incomplete</option>
            </select>
          </div>
          <TotalAuditChart status={auditStatus} />
        </div>
        
        <div className="chart-container">
          <RevisionControlChart />
        </div>
      </div>
    </div>
  );
};

export default ChartDashboard;