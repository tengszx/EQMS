// Header.jsx
import React from 'react';
import '../../../css/styles/landing/Header.css';

const LPHeader = () => {
    return (
        <header className="header">
            <div className="header-container">
                <div className="left-container">
                    <div className="logo-container">
                        <img src="/images/EQMS_LOGO.webp" alt="Logo" className="logo" />
                    </div>
                </div>
                <div className="middle-container">
                    <a href="/home" className="link">Home</a>
                    <a href="/about" className="link">About</a>
                    <a href="/resources" className="link">Resources</a>
                    <a href="/help" className="link">Help</a>
                    <a href="/contact" className="link">Contact Us</a>
                    <button className="login-button">Login</button> {/* Moved here */}
                </div>
            </div>
        </header>
    );
};

export default LPHeader;