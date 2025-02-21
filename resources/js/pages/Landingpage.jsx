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
import QuickAccessSection from '../component/landing/QuickAccessSection'; // Importing QuickAccessSection
import SystemMaintenance from '../component/landing/SystemMaintenance';
import Updates from '../component/landing/Updates';
import NewFeatures from '../component/landing/NewFeatures';
import Calendar from '../component/landing/Calendar';
import Footer from '../component/landing/Footerlanding';
import '../../css/styles/pages/Landingpage.css';

const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Startup />
                <CarouselEvent /> 
            </div>
            <div className="widget-section">
                <h2 className="widget-title">Overview and Features</h2>
                <div className="widget-grid">
                    <DocumentWidget /> 
                    <ReportingWidget />
                    <ProcessWidget />
                    <GenerateWidget />
                    <TrackWidget />
                </div>
            </div>
            <div className="quick-access-wrapper">
                <QuickAccessSection /> {/* Use the imported QuickAccessSection */}
            </div>
            <div className="system-container">
                <div className="system-left">
                    <SystemMaintenance />
                    <NewFeatures />
                    <Updates />
                </div>
                <div className="system-right">
                    <Calendar />
                </div>
            </div>
            <Footer />
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);