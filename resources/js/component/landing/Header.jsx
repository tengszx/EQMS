// Header.jsx
import React, { useEffect, useState } from 'react';
import '../../../css/styles/landing/Header.css';

const LPHeader = () => {
    const [isVisible, setIsVisible] = useState(true);
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
        if (window.scrollY > lastScrollY) {
            setIsVisible(false); // Hides the header when scrolling down
        } else {
            setIsVisible(true); // Shows the header when scrolling up
        }
        lastScrollY = window.scrollY; // Update last scroll position
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`header ${isVisible ? 'visible' : 'hidden'}`}>
            <style type="text/css">
                {`
                    @font-face {
                        font-family: "Helvetica";
                        src: url("https://candyfonts.com/wp-data/2018/10/26/11538/HELR45W.ttf") format("woff"),
                             url("https://candyfonts.com/wp-data/2018/10/26/11538/HELR45W.ttf") format("opentype"),
                             url("https://candyfonts.com/wp-data/2018/10/26/11538/HELR45W.ttf") format("truetype");
                    }
                    .header {
                        font-family: "Helvetica", sans-serif; /* Use Helvetica */
                    }
                `}
            </style>
            <div className="header-container">
                <div className="left-container">
                    <div className="logo-container">
                        <img src="/images/NewEQMSLOGO.png" alt="Logo" className="logo" />
                    </div>
                </div>
                <div className="middle-container">
                    <a href="/home" className="link">Home</a>
                    <a href="/about" className="link">About</a>
                    <a href="/resources" className="link">Resources</a>
                    <a href="/help" className="link">Help</a>
                    <a href="/contact" className="link">Contact Us</a>
                    <button className="login-button">Login</button>
                </div>
            </div>
        </header>
    );
};

export default LPHeader;