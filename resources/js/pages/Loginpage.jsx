import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { loadFull } from "tsparticles";
import Particles from 'react-tsparticles';
import '../../css/styles/login/Loginpage.css';

const LoginPage = () => {
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

  return (
    <div className="login-container">
      {/* Particles Component */}
      <Particles
        id="tsparticles-login"
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
              value: 80,
              density: {
                enable: true,
                value_area: 800
              }
            },
            color: {
              value: "#0000AA"
            },
            opacity: {
              value: 0.5,
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
              speed: 1.5,
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
      
      <div className="login-wrapper">
        {/* Left side - Login Form */}
        <div className="form-section">
          <div className="form-box">
            <div className="form-content">
              <div className="input-group">
                <label>Email address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="input-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              
              <div className="forgot-password">
                <a href="#">Forgot password?</a>
              </div>
              
              <button className="login-button">
                Login
              </button>
            </div>
          </div>
        </div>

        {/* Right side - Logo */}
        <div className="logo-container">
          <img 
            src="/images/NewEQMSLOGO.png" 
            alt="Logo" 
            className="logo"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// Mount the application
const container = document.getElementById('login-root');
const root = createRoot(container);
root.render(<LoginPage />);