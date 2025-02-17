import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../../js/component/landing/Header';
import Startup from '../component/landing/Startup';
import CarouselEvent from '../component/landing/CarouselEvent'; 
import DocumentWidget from '../component/landing/DocumentWidget';
import ReportingWidget from '../component/landing/ReportingWidget';
import ProcessWidget from '../component/landing/ProcessWidget';
import GenerateWidget from '../component/landing/GenerateWidget';
import TrackWidget from '../component/landing/TrackWidget';
import '../../css/styles/pages/Landingpages.css';

const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Startup />
                <CarouselEvent /> 
            </div>
            <div className="widget-section">
                <div className="widget-title-container">
                    <h2 className="widget-title">Overview and Features</h2>
                </div>
                <div className="widget-grid">
                    <DocumentWidget /> 
                    <ReportingWidget />
                    <ProcessWidget />
                    <GenerateWidget />
                    <TrackWidget />
                </div>
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);