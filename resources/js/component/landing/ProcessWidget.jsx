import React from 'react';
import '../../../css/styles/landing/ProcessWidget.css';
import { FileCog } from 'lucide-react'; // Import the icon

const ProcessWidget = () => {
    return (
        <div className="process-widget">
            <h1 className="process-title">
                <FileCog className="item-icon" /> {/* Place the icon here */}
                Process Monitoring
            </h1>
        </div>
    );
};

export default ProcessWidget;