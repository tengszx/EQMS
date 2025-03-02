import React from 'react';
import '../../../css/styles/landing/TrackWidget.css';

const TrackWidget = () => {
    return (
        <div className="widget">
            <div className="widget-content">
                <img src="/images/trackrevision.png" alt="Track Revision" className="logo" />
                <div className="widget-header">
                    <div className="widget-name">Track Revision</div>
                    <div className="widget-text">
                    The practice of monitoring changes made to documents or processes over time, enabling organizations to maintain version control and ensure that the most current information is used.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrackWidget;