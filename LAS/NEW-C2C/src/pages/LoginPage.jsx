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

    try {
      // Call backend API to login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.message || 'Login failed. Please try again.');
        setLoading(false);
        return;
      }

      const { data } = result;
      const userData = {
        id: data.user.id,
        name: data.user.fullName,
        email: data.user.email,
        picture: data.user.avatarUrl || '',
        loginTime: new Date().toISOString(),
        token: data.accessToken,
        role: data.user.role,
        profileId: data.user.facultyProfile?.id || null,
        designation: data.user.facultyProfile?.designation || '',
      };

      if (role === 'hod') {
        userData.dept = 'Computer Engineering';
      }

      localStorage.setItem('facultyAuth', JSON.stringify(userData));
      localStorage.setItem('authToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      onLoginSuccess(userData);
      setLoading(false);
    } catch (err) {
      console.error('Login error:', err);
      setError('Network error. Please check if the server is running.');
      setLoading(false);
    }
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
