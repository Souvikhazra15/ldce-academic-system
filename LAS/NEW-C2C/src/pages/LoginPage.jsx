import React, { useState } from 'react';
import '../styles/LoginPage.css';

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('faculty');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      const userData = {
        id: `user-${Math.random()}`,
        name: email.split('@')[0],
        email: email,
        picture: '',
        loginTime: new Date().toISOString(),
        token: `token-${Math.random()}`,
        role: role
      };

      if (role === 'hod') {
        userData.dept = 'Computer Engineering';
      }

      localStorage.setItem('facultyAuth', JSON.stringify(userData));
      localStorage.setItem('authToken', userData.token);

      onLoginSuccess(userData);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Logo Section */}
        <div className="login-logo-section">
          <div className="logo-circle">
            <img src="/LAS-Logo.svg" alt="LAS Logo" className="logo-image" />
          </div>
        </div>

        {/* Animated Title */}
        <div className="animated-title-container">
          <div className="animated-text-wrapper">
            <span className="letter">L</span>
            <span className="letter">D</span>
            <span className="letter">C</span>
            <span className="letter">E</span>
            <span className="letter"> </span>
            <span className="letter">A</span>
            <span className="letter">c</span>
            <span className="letter">a</span>
            <span className="letter">d</span>
            <span className="letter">e</span>
            <span className="letter">m</span>
            <span className="letter">i</span>
            <span className="letter">c</span>
            <span className="letter"> </span>
            <span className="letter">S</span>
            <span className="letter">y</span>
            <span className="letter">s</span>
            <span className="letter">t</span>
            <span className="letter">e</span>
            <span className="letter">m</span>
          </div>
        </div>

        {/* Welcome Text */}
        <div className="welcome-section">
          <h2>Welcome</h2>
        </div>

        {/* Login Label and Buttons */}
        <div className="login-label-section">
          <span className="login-label">Login as</span>
        </div>

        <div className="login-buttons-section">
          <button
            type="button"
            className={`btn-faculty-login ${role === 'faculty' ? 'active' : ''}`}
            onClick={() => setRole('faculty')}
          >
            Faculty
          </button>

          <button
            type="button"
            className={`btn-hod-login ${role === 'hod' ? 'active' : ''}`}
            onClick={() => setRole('hod')}
          >
            HoD
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="login-form">
          {/* Email Input */}
          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Login Button */}
          <button
            type="submit"
            className="login-submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Note Section */}
        <div className="login-note">
          <p>Note: Only college domain emails are allowed to access this system</p>
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>For support, contact admin@college.ac.in</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
