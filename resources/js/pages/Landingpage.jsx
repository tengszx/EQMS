import React from 'react';
import { createRoot } from 'react-dom/client';
import Header from '../../js/component/landing/Header';
import Startup from '../component/landing/Startup'; // Ensure the path is correct

const LandingPage = () => {
    return (
        <div className="app">
            <Header />

            <div className="main-content">
                <Startup /> 
                
               
            </div>


        </div>
    );
};

// Mount the application
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<LandingPage />);