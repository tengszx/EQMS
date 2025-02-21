import React from 'react';
import '../../../css/styles/landing/QuickAccessSection.css';

const QuickAccessSection = () => {
    const actions = [
      {
        id: 1,
        title: "Submit Quality Report",
        description: "A quality report is a document that assesses the performance, standards, and compliance of a product or service, highlighting areas for improvement and ensuring adherence to regulatory requirements.",
        link: "/quality-report"
      },
      {
        id: 2,
        title: "View Reports",
        description: "View reports refers to the action of accessing and reviewing documented analyses or summaries that provide insights into performance, findings, data, or data related to a specific subject or project.",
        link: "/reports"
      },
      {
        id: 3,
        title: "Manage Documents",
        description: "Manage documents involves organizing, storing, retrieving, and maintaining files to ensure efficient access and compliance with relevant standards or protocols.",
        link: "/documents"
      },
      {
        id: 4,
        title: "View Dashboard",
        description: "View dashboard means accessing a visual interface that displays key metrics, data, and performance indicators for quick analysis and decision-making.",
        link: "/dashboard"
      }
    ];
  
    return (
      <div className="quick-access-container">
        <div className="quick-access-header">
          <h2>Quick Access Action</h2>
        </div>
  
        <div className="timeline-container">
          <div className="timeline-line"></div>
          <div className="trophy-icon">🏆</div>
  
          <div className="actions-grid">
            {actions.map((action) => (
              <div 
                key={action.id} 
                className={`action-item ${action.id % 2 === 0 ? 'action-right' : 'action-left'}`}
              >
                <div className={`number-indicator indicator-${action.id}`}>
                  #{action.id}
                </div>
  
                <a href={action.link} className="action-card-link">
                  <div className="action-card">
                    <h3>{action.title}</h3>
                    <p>{action.description}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
};
  
export default QuickAccessSection;