import React from 'react';
import '../../../css/styles/landing/ReportingWidget.css';
import { FileChartColumnIncreasing } from 'lucide-react'; // Import the icon

const ReportingWidget = () => {
    return (
        <div className="widget"> {/* Changed class name to match the structure */}
            <FileChartColumnIncreasing className="widget-icon" /> {/* Use the report icon */}
            <div className="widget-header">
                <div className="widget-name">Reporting & Analytics</div> {/* Title for the report */}
                <div className="widget-settings"> {/* Button for settings */}
                    <button>⋮</button>
                </div>
            </div>
        </div>
    );
};

export default ReportingWidget;