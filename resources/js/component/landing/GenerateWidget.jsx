// GenerateWidget.jsx
import React from 'react';
import '../../../css/styles/landing/GenerateWidget.css';

const GenerateWidget = () => {
    return (
        <div className="widget">
            <div className="widget-content">
                <img src="/images/generatereport.png" alt="Generate Report" className="logo" />
                <div className="widget-header">
                    <div className="widget-name">Generate Report</div>
                    <div className="widget-text">
                    The process of analyzing data to generate insights and actionable reports that help organizations make informed decisions based on historical and real-time information.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateWidget;