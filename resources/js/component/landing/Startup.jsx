import React, { useEffect } from 'react';
import { loadFull } from "tsparticles";
import Particles from 'react-tsparticles';
import '../../../css/styles/landing/Startup.css';

const Startup = () => {
    const particlesInit = async (main) => {
        console.log("Initializing particles engine");
        try {
            await loadFull(main);
            console.log("Particles engine initialized successfully");
        } catch (error) {
            console.error("Error initializing particles:", error);
        }
    };

    const particlesLoaded = (container) => {
        console.log("Particles container loaded", container);
    };

    useEffect(() => {
        console.log("Startup component mounted");
        return () => {
            console.log("Startup component unmounted");
        };
    }, []);

    return (
        <div className="startup-container">
            {/* Particles component with full container coverage */}
            <Particles
                id="tsparticles"
                init={particlesInit}
                loaded={particlesLoaded}
                className="particles-container"
                options={{
                    fullScreen: { enable: false },
                    background: {
                        color: {
                            value: "transparent",
                        },
                    },
                    fpsLimit: 120,
                    particles: {
                        number: {
                            value: 100, // More particles for better coverage
                            density: {
                                enable: true,
                                value_area: 800
                            }
                        },
                        color: {
                            value: "#0000AA"
                        },
                        opacity: {
                            value: 0.5, // Medium opacity to be visible but not overwhelm text
                        },
                        size: {
                            value: 3,
                            random: true,
                        },
                        line_linked: {
                            enable: true,
                            distance: 150,
                            color: "#0000AA",
                            opacity: 0.4,
                            width: 1.2
                        },
                        move: {
                            enable: true,
                            speed: 1.5, // Slightly slower for less distraction
                            out_mode: "bounce",
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: {
                                enable: true,
                                mode: "repulse"
                            },
                            onclick: {
                                enable: true,
                                mode: "push"
                            },
                            resize: true
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                                duration: 0.4
                            },
                            push: {
                                particles_nb: 4
                            }
                        }
                    },
                    retina_detect: true
                }}
            />
            
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