import React from 'react';
import '../../../css/styles/landing/ProcessWidget.css';
import { FileCog } from 'lucide-react'; // Import the icon

const ProcessWidget = () => {
    return (
        <div className="widget"> {/* Changed class name to match the DocumentWidget */}
            <FileCog className="widget-icon" />
            <div className="widget-header">
                <div className="widget-name">Process Monitoring</div> {/* Corrected closing tag */}
                <div className="widget-settings"> {/* Moved button inside the settings div */}
                    <button>⋮</button>
                </div>
            </div>
        </div>
    );
};

export default ProcessWidget;