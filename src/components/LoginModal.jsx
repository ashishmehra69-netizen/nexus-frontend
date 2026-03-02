import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setError('');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (data.success) {
        // Store email in localStorage
        localStorage.setItem('userEmail', email);
        onLoginSuccess(data);
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-modal">
        <div className="login-header">
          <h2>🧠 Welcome to NEXUS</h2>
          <p>Login to generate professional training programs</p>
        </div>

        {!otpSent ? (
          // Email input stage
          <div className="login-body">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendOtp()}
              disabled={loading}
            />

            {error && <div className="error-message">{error}</div>}

            <button 
              className="btn-primary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>

            <div className="login-benefits">
              <p>✨ <strong>FREE:</strong> 1 program generation</p>
              <p>📦 <strong>Packages:</strong> From ₹7,500/program</p>
              <p>🚀 <strong>Instant:</strong> Generate in 60 seconds</p>
            </div>
          </div>
        ) : (
          // OTP input stage
          <div className="login-body">
            <div className="otp-sent-message">
              📧 OTP sent to <strong>{email}</strong>
              <button 
                className="change-email-btn"
                onClick={() => { setOtpSent(false); setOtp(''); setDevOtp(''); }}
              >
                Change
              </button>
            </div>

            <label>Enter 6-Digit OTP</label>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              onKeyPress={(e) => e.key === 'Enter' && handleVerifyOtp()}
              disabled={loading}
              className="otp-input"
            />

            {error && <div className="error-message">{error}</div>}

            <button 
              className="btn-primary"
              onClick={handleVerifyOtp}
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>

            <button 
              className="btn-secondary"
              onClick={handleSendOtp}
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginModal;
