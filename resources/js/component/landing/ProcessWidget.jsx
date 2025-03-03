// ProcessWidget.jsx
import React from 'react';
import '../../../css/styles/landing/ProcessWidget.css';

const ProcessWidget = () => {
    return (
        <div className="widget">
            <div className="widget-content">
                <img src="/images/processmonitoring.png" alt="Process Monitoring" className="logo" />
                <div className="widget-header">
                    <div className="widget-name">Process Monitoring</div>
                    <div className="widget-text">
                    he continuous observation and evaluation of processes to ensure they operate efficiently, meet predefined standards, and identify areas for improvement.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProcessWidget;