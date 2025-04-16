import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../../js/component/landing/Header';
import Startup from '../component/landing/Startup';
import Footer from '../component/landing/Footerlanding';
import '../../css/styles/pages/Landingpage.css';

const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content scroll-container">
                <Startup />
                <div className="widget-section">
                    <div className="dashboard-grid">
                        <div className="left-column">
                            {/* DocumentWidget was here */}
                        </div>
                        <div className="right-column">
                            <div className="top-row">
                                {/* GenerateWidget was here */}
                                {/* ProcessWidget was here */}
                            </div>
                            <div className="bottom-row">
                                {/* ReportingWidget was here */}
                                {/* TrackWidget was here */}
                            </div>
                        </div>
                    </div>
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