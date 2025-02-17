import React from 'react';
import '../../../css/styles/landing/GenerateWidget.css';
import { FilePlus } from 'lucide-react'; // Import the icon

const GenerateWidget = () => {
    return (
        <div className="widget"> {/* Changed class name to match the structure */}
            <FilePlus className="widget-icon" /> {/* Use the icon for generating reports */}
            <div className="widget-header">
                <div className="widget-name">Generate Reports</div> {/* Title for the generate widget */}
                <div className="widget-settings"> {/* Button for settings */}
                    <button>⋮</button>
                </div>
            </div>
        </div>
    );
};

export default GenerateWidget;