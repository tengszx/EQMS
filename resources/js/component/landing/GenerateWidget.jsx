import React from 'react';
import '../../../css/styles/landing/GenerateWidget.css';
import { FilePlus } from 'lucide-react'; // Import the icon

const GenerateWidget = () => {
    return (
        <div className="generate-widget">
            <h1 className="generate-title">
                <FilePlus className="item-icon" /> {/* Place the icon here */}
                Generate Reports
            </h1>
        </div>
    );
};

export default GenerateWidget;