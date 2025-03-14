import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../css/styles/login/Loginpage.css';

const LoginPage = () => {
  return (
    <div className="login-container">
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
            src="/images/EQMS_LOGO-removebg-preview.png" 
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