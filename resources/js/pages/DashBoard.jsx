import React from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot
import '../../css/styles/dash/DashBoard.css'; // Ensure the path is correct

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="welcome-message">Welcome to your dashboard! Here you can manage your settings and view your information.</p>
      {/* Placeholder for additional components or features */}
      <div className="dashboard-content">
        <p>More features coming soon!</p>
      </div>
    </div>
  );
};

export default Dashboard;

// Mount the application
const container = document.getElementById('dashboard-root');
const root = createRoot(container);
root.render(<Dashboard />); // Use uppercase 'D' here