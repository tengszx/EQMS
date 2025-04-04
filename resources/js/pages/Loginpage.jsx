import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../css/styles/login/Loginpage.css';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Login Form */}
        <div className="form-box">
          <div className="form-content">
            <div className="logo-section">
              <img 
                src="/images/EQMS_LOGO-removebg-preview.png" 
                alt="EQMS Logo" 
                className="logo"
              />
            </div>
            
            <h2 className="login-title">Login to your account</h2>
            
            <div className="input-group">
              <label>Email address</label>
              <input
                type="email"
                placeholder="Enter your email"
              />
            </div>
            
            <div className="input-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                />
                <button 
                  type="button" 
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
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
    </div>
  );
};

export default LoginPage;

// Mount the application
const container = document.getElementById('login-root');
const root = createRoot(container);
root.render(<LoginPage />);