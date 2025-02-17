// DocumentWidget.jsx
import React from 'react';
import { File } from 'lucide-react';
import '../../../css/styles/landing/DocumentWidget.css';

const DocumentWidget = () => {
    return (
        <div className="widget">
            <File className="widget-icon" />
            <div className="widget-header">
                <div className="widget-name">Document Control</div>
                <div className="widget-settings">
                    <button>⋮</button>
                </div>
            </div>
        </div>
    );
};

export default DocumentWidget;