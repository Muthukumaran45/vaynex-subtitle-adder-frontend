import React, { useState } from "react";
import "../style/Auth.css";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLogin && formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match");
    }
    // Temporary: just trigger login flow for UI demo
    onLogin();
  };

  return (
    <div className="auth-root">
      {/* Animated background */}
      <div className="auth-bg">
        <div className="film-strip film-strip--left">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="film-frame" />
          ))}
        </div>
        <div className="film-strip film-strip--right">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="film-frame" />
          ))}
        </div>
        <div className="glow-orb glow-orb--1" />
        <div className="glow-orb glow-orb--2" />
        <div className="scan-line" />
      </div>

      <div className="auth-center">
        {/* Brand */}
        <div className="auth-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M8 14h24M8 20h16M8 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <circle cx="30" cy="23" r="5" fill="currentColor" opacity="0.3" />
              <path d="M28 23l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="brand-name">SubtitleAI</h1>
          <p className="brand-tagline">Captions, crafted by intelligence</p>
        </div>

        {/* Card */}
        <div className="auth-card">
          {/* Toggle tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${isLogin ? "auth-tab--active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button
              className={`auth-tab ${!isLogin ? "auth-tab--active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
            <div className={`auth-tab-indicator ${!isLogin ? "auth-tab-indicator--right" : ""}`} />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className={`form-fields ${!isLogin ? "form-fields--signup" : ""}`}>
              {!isLogin && (
                <div className="field-group">
                  <label className="field-label">Full Name</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.5"/><path d="M3 17c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </span>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="field-input"
                    />
                  </div>
                </div>
              )}

              <div className="field-group">
                <label className="field-label">Email Address</label>
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg viewBox="0 0 20 20" fill="none"><rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M2 7l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              <div className="field-group">
                <label className="field-label">Password</label>
                <div className="field-wrap">
                  <span className="field-icon">
                    <svg viewBox="0 0 20 20" fill="none"><rect x="4" y="9" width="12" height="9" rx="2" stroke="currentColor" strokeWidth="1.5"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="field-input"
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="field-group">
                  <label className="field-label">Confirm Password</label>
                  <div className="field-wrap">
                    <span className="field-icon">
                      <svg viewBox="0 0 20 20" fill="none"><path d="M5 10l4 4 6-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required={!isLogin}
                      className="field-input"
                    />
                  </div>
                </div>
              )}
            </div>

            {isLogin && (
              <div className="forgot-wrap">
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
            )}

            <button type="submit" className="submit-btn">
              <span>{isLogin ? "Sign In" : "Create Account"}</span>
              <svg viewBox="0 0 20 20" fill="none"><path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>

          <p className="auth-switch">
            {isLogin ? "New here?" : "Already a member?"}
            <button className="auth-switch-btn" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? " Create account" : " Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;