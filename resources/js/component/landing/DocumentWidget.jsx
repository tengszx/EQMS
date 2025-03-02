// DocumentWidget.jsx
import React from 'react';
import '../../../css/styles/landing/DocumentWidget.css';

const DocumentWidget = () => {
    return (
        <div className="widget">
            <div className="widget-content">
                <img src="/images/documentcontrol.png" alt="Document Control" className="logo" />
                <div className="widget-header">
                    <div className="widget-name">Document Control</div>
                    <div className="widget-text">
                    A systematic approach to managing, storing, and tracking documents to ensure accuracy, accessibility, and compliance within an organization.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentWidget;