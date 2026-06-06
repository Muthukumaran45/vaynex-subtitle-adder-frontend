import React, { useState, useRef } from "react";
import axios from "axios";
import "../style/Home.css";

function Home({ onLogout }) {
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const handleFileChange = (f) => {
    if (f && f.type.startsWith("video/")) {
      setFile(f);
      setVideoUrl("");
      setError("");
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file ? file.name.replace(/\.[^.]+$/, "_subtitled.mp4") : "subtitled_video.mp4";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Please try right-clicking the video to save.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    handleFileChange(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setVideoUrl("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8000/generate-subtitles",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) setVideoUrl(response.data.video_url);
    } catch (err) {
      setError("Failed to process video. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="home-root">
      {/* Background */}
      <div className="home-bg">
        <div className="bg-grid" />
        <div className="bg-glow bg-glow--1" />
        <div className="bg-glow bg-glow--2" />
      </div>

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="nav-icon">
            <svg viewBox="0 0 40 40" fill="none">
              <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M8 14h24M8 20h16M8 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <span>SubtitleAI</span>
        </div>

        <div className="nav-actions">
          <div className="nav-user">
            <div className="user-avatar">J</div>
            <span>My Account</span>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            <svg viewBox="0 0 20 20" fill="none"><path d="M13 15l4-5-4-5M17 10H8M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Sign out
          </button>
        </div>
      </nav>

      {/* Main */}
      <main className="home-main">
        <div className="hero">
          <div className="hero-badge">
            <span className="badge-dot" />
            AI-Powered Transcription
          </div>
          <h1 className="hero-title">
            Add subtitles to<br />
            <span className="hero-accent">any video</span>
          </h1>
          <p className="hero-sub">
            Upload your video and let our AI automatically transcribe and burn in perfectly timed captions.
          </p>
        </div>

        {/* Upload card */}
        <div className="upload-section">
          <div
            className={`drop-zone ${dragOver ? "drop-zone--over" : ""} ${file ? "drop-zone--filled" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !file && inputRef.current.click()}
          >
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            {!file ? (
              <div className="drop-content">
                <div className="drop-icon">
                  <svg viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="34" cy="18" r="3" stroke="currentColor" strokeWidth="2" />
                    <path d="M4 32l10-10 8 8 6-6 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24 2v10M20 6l4-4 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="drop-title">Drop your video here</p>
                <p className="drop-sub">or <span>browse files</span> · MP4, MOV, AVI, MKV</p>
              </div>
            ) : (
              <div className="file-preview">
                <div className="file-thumb">
                  <svg viewBox="0 0 40 40" fill="none">
                    <rect x="4" y="6" width="32" height="28" rx="3" fill="currentColor" opacity="0.1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M16 14l10 6-10 6V14z" fill="currentColor" />
                  </svg>
                </div>
                <div className="file-info">
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button
                  className="file-remove"
                  onClick={(e) => { e.stopPropagation(); setFile(null); }}
                >
                  <svg viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </button>
              </div>
            )}
          </div>

          <button
            className="generate-btn"
            onClick={handleUpload}
            disabled={!file || processing}
          >
            {processing ? (
              <>
                <span className="btn-spinner" />
                Processing your video…
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="none"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.5"/><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Generate Subtitles
              </>
            )}
          </button>
        </div>

        {/* Processing steps */}
        {processing && (
          <div className="process-steps">
            {["Uploading video", "Transcribing audio", "Burning subtitles"].map((step, i) => (
              <div key={i} className="step" style={{ animationDelay: `${i * 0.4}s` }}>
                <div className="step-dot" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="error-banner">
            <svg viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5"/><path d="M10 6v4M10 13v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
            {error}
          </div>
        )}

        {/* Result */}
        {videoUrl && (
          <div className="result-card">
            <div className="result-header">
              <div className="result-badge">
                <svg viewBox="0 0 16 16" fill="none"><path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Ready
              </div>
              <h2>Your subtitled video</h2>
            </div>
            <video controls src={videoUrl} className="result-video" />
            <button onClick={handleDownload} className="download-btn">
              <svg viewBox="0 0 20 20" fill="none"><path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Download Video
            </button>
          </div>
        )}

        {/* How it works */}
        {!videoUrl && !processing && (
          <div className="how-it-works">
            <p className="hiw-label">How it works</p>
            <div className="hiw-steps">
              {[
                { n: "01", title: "Upload", desc: "Drop any video file up to 2GB" },
                { n: "02", title: "Transcribe", desc: "AI detects speech and timings" },
                { n: "03", title: "Download", desc: "Get your video with burned-in captions" },
              ].map((s) => (
                <div key={s.n} className="hiw-step">
                  <span className="hiw-n">{s.n}</span>
                  <strong>{s.title}</strong>
                  <p>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;