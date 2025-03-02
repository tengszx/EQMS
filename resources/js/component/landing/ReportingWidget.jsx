import React from 'react';
import '../../../css/styles/landing/ReportingWidget.css';

const ReportingWidget = () => {
    return (
        <div className="widget">
            <div className="widget-content">
                <img src="/images/reportinganalytics.png" alt="Reporting Analytics" className="logo" />
                <div className="widget-header">
                    <div className="widget-name">Reporting Analytic</div>
                    <div className="widget-text">
                    The act of creating structured documents that summarize data, findings, or insights, often used for review, compliance, or decision-making purposes.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportingWidget;