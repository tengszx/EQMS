import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../../js/component/landing/Header';
import Startup from '../component/landing/Startup';
import CarouselEvent from '../component/landing/CarouselEvent'; 

const LandingPage = () => {
    return (
        <div className="app">
            <Header />
            <div className="main-content">
                <Startup />
                <CarouselEvent /> 
            </div>
        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);