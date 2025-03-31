import React from 'react';
import '../../../css/styles/landing/DocumentWidget.css';

const DocumentWidget = () => {
  const handleClick = () => {
    console.log('Document Control widget clicked');
    // Add your navigation or action logic here
  };

  return (
    <div className="document-widget" onClick={handleClick}>
      <div className="document-content">
        <h2>Document Control</h2>
        <p>
          A systematic approach to managing, storing, and tracking
          documents to ensure accuracy, accessibility, and compliance
          within an organization.
        </p>
      </div>
    </div>
  );
};

export default DocumentWidget;