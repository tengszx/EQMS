import React, { useState } from 'react';
import '../../../css/styles/landing/Startup.css';

const Startup = () => {
    const [isActive, setIsActive] = useState(false);

    return (
        <div className="startup-container">
            <div className="background-overlay"></div>
            <div className="content-wrapper">
                <h1 className={`main-title hover-underline`} onMouseEnter={() => setIsActive(true)} onMouseLeave={() => setIsActive(false)}>
                    Quality Management System
                </h1>
                <h2 className="sub-title">Ensure excellence in processes and quality</h2>
                <p className="footer-text">NATIONAL RESEARCH COUNCIL OF THE PHILIPPINES</p>
                <button className="get-started-button">Get Started</button>
            </div>
        </div>
    );
};

export default Startup;
