import React, { useEffect } from 'react';
import '../../../css/styles/landing/Startup.css';

const Startup = () => {
    useEffect(() => {
        console.log("Startup component mounted");
        return () => {
            console.log("Startup component unmounted");
        };
    }, []);

    return (
        <div className="startup-container" style={{ backgroundImage: `url(/images/startupbackground.png)` }}>
            {/* Content wrapper with enhanced text readability */}
            <div className="content-wrapper">
                <h1 className="main-title">
                    {"QualityManagementSystem".split("").map((letter, index) => (
                        <span key={index} className="bubble-letter">
                            {letter}
                        </span>
                    ))}
                </h1>
                <h2 className="sub-title">Ensure excellence in process and quality</h2>
                <p className="footer-text">NATIONAL RESEARCH COUNCIL OF THE PHILIPPINES</p>
                <button className="learn-more-button">Learn More</button>
            </div>
        </div>
    );
};

export default Startup;
