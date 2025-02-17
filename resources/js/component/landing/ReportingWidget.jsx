import React from 'react';
import '../../../css/styles/landing/ReportingWidget.css';
import { FileChartColumnIncreasing } from 'lucide-react'; // Import the icon

const ReportingWidget = () => {
    return (
        <div className="reporting-widget">
            <h1 className="reporting-title">
                <FileChartColumnIncreasing className="item-icon" /> {/* Place the icon here */}
                Reporting & Analytics
            </h1>
        </div>
    );
};

export default ReportingWidget;