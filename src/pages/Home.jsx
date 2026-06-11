import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { BACKEND_API } from "../api";

/* ─── inline styles (no external CSS dependency) ─── */
const S = {
  /* layout */
  root: { minHeight: "100vh", background: "#0a0a0a", color: "#f0f0f0", fontFamily: "'Inter', 'Segoe UI', sans-serif", position: "relative", overflowX: "hidden" },
  bgGrid: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 },
  bgGlow1: { position: "fixed", top: "-20%", left: "30%", width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },
  bgGlow2: { position: "fixed", bottom: "-10%", right: "10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle,rgba(168,85,247,0.05) 0%,transparent 70%)", pointerEvents: "none", zIndex: 0 },

  /* navbar */
  nav: { position: "sticky", top: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 32px", height: 60, borderBottom: "0.5px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", background: "rgba(10,10,10,0.7)" },
  brand: { display: "flex", alignItems: "center", gap: 10, fontWeight: 600, fontSize: 16, letterSpacing: "-0.3px" },
  brandIcon: { width: 32, height: 32, borderRadius: 8, background: "rgba(99,102,241,0.15)", border: "0.5px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8" },
  navActions: { display: "flex", alignItems: "center", gap: 12 },
  logoutBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer" },

  /* main */
  main: { position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto", padding: "48px 24px 80px" },

  /* hero */
  heroBadge: { display: "inline-flex", alignItems: "center", gap: 7, padding: "4px 12px", borderRadius: 20, border: "0.5px solid rgba(99,102,241,0.3)", background: "rgba(99,102,241,0.08)", fontSize: 12, color: "#a5b4fc", marginBottom: 20 },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#818cf8" },
  heroTitle: { fontSize: "clamp(28px,5vw,42px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-1px", margin: "0 0 14px", color: "#f8f8f8" },
  heroAccent: { background: "linear-gradient(135deg,#818cf8,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 500 },

  /* upload */
  dropZone: { border: "1.5px dashed rgba(255,255,255,0.12)", borderRadius: 16, padding: 40, textAlign: "center", cursor: "pointer", transition: "all 0.2s", marginBottom: 14, background: "rgba(255,255,255,0.02)" },
  dropZoneOver: { border: "1.5px dashed rgba(99,102,241,0.6)", background: "rgba(99,102,241,0.06)" },
  dropZoneFilled: { borderStyle: "solid", borderColor: "rgba(99,102,241,0.3)", cursor: "default", textAlign: "left" },
  dropIcon: { width: 48, height: 48, margin: "0 auto 14px", color: "rgba(255,255,255,0.2)" },
  dropTitle: { fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.7)", margin: "0 0 6px" },
  dropSub: { fontSize: 13, color: "rgba(255,255,255,0.3)" },
  dropSubAccent: { color: "#818cf8" },
  filePreview: { display: "flex", alignItems: "center", gap: 14 },
  fileThumb: { width: 44, height: 44, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#818cf8", flexShrink: 0 },
  fileName: { fontSize: 14, fontWeight: 500, color: "#f0f0f0", margin: 0 },
  fileSize: { fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "3px 0 0" },
  fileRemove: { marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", padding: 6, borderRadius: 6, display: "flex" },

  /* buttons */
  generateBtn: { width: "100%", padding: "14px 20px", borderRadius: 12, border: "none", background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, letterSpacing: "-0.2px", transition: "opacity 0.2s" },
  generateBtnDisabled: { opacity: 0.4, cursor: "not-allowed" },

  /* steps */
  processSteps: { display: "flex", gap: 24, margin: "24px 0", justifyContent: "center" },
  step: { display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,0.4)" },
  stepDot: { width: 8, height: 8, borderRadius: "50%", background: "#6366f1", animation: "pulse 1.5s ease-in-out infinite" },

  /* error */
  errorBanner: { display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "0.5px solid rgba(239,68,68,0.2)", color: "#fca5a5", fontSize: 13, margin: "16px 0" },

  /* ── EDITOR SECTION ── */
  editorWrap: { marginTop: 32 },
  sectionTitle: { fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 14 },

  /* video stage */
  stageWrap: { position: "relative", width: "100%", aspectRatio: "16/9", background: "#111", borderRadius: 14, overflow: "hidden", border: "0.5px solid rgba(255,255,255,0.1)" },
  stagePlaceholder: { width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "rgba(255,255,255,0.15)", fontSize: 13 },
  stageVideo: { width: "100%", height: "100%", objectFit: "contain" },
  subtitleOverlay: { position: "absolute", cursor: "grab", padding: "5px 14px", borderRadius: 4, fontWeight: 600, fontSize: 18, whiteSpace: "nowrap", maxWidth: "90%", textAlign: "center", lineHeight: 1.4, userSelect: "none", touchAction: "none", transform: "translate(-50%,-50%)" },

  /* quick position bar */
  presetBar: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", margin: "12px 0" },
  presetLabel: { fontSize: 12, color: "rgba(255,255,255,0.3)" },
  presetBtn: { padding: "5px 12px", fontSize: 12, borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.45)", cursor: "pointer" },

  /* style controls grid */
  controlsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 },
  controlCard: { background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" },
  controlCardFull: { gridColumn: "1 / -1", background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" },
  controlLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10, display: "block" },
  styleRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },

  /* timeline */
  timeline: { marginTop: 12, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px" },
  timelineLabel: { fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 },
  segList: { display: "flex", flexDirection: "column", gap: 2, maxHeight: 160, overflowY: "auto" },
  segItem: { display: "flex", alignItems: "center", gap: 12, padding: "7px 10px", borderRadius: 8, cursor: "pointer", fontSize: 13 },
  segItemActive: { background: "rgba(99,102,241,0.12)", border: "0.5px solid rgba(99,102,241,0.25)" },
  segTime: { color: "rgba(255,255,255,0.25)", fontFamily: "monospace", fontSize: 11, width: 72, flexShrink: 0 },
  segText: { color: "rgba(255,255,255,0.7)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },

  /* export bar */
  exportBar: { display: "flex", alignItems: "center", gap: 12, marginTop: 14 },
  exportBtn: { display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.7)", fontSize: 13, cursor: "pointer", fontFamily: "inherit" },
  burnBtn: { display: "flex", alignItems: "center", gap: 7, padding: "9px 18px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#6366f1,#7c3aed)", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" },
  posReadout: { fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "monospace", marginLeft: "auto" },

  /* result */
  resultCard: { marginTop: 32, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 24 },
  resultHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 },
  resultBadge: { display: "flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 20, background: "rgba(34,197,94,0.1)", border: "0.5px solid rgba(34,197,94,0.2)", color: "#86efac", fontSize: 12 },
  resultVideo: { width: "100%", borderRadius: 10, marginBottom: 14 },
  downloadBtn: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 10, border: "0.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#f0f0f0", fontSize: 14, cursor: "pointer", fontFamily: "inherit" },

  /* how it works */
  howItWorks: { marginTop: 48, textAlign: "center" },
  hiwLabel: { fontSize: 12, color: "rgba(255,255,255,0.25)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 24 },
  hiwSteps: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 },
  hiwStep: { background: "rgba(255,255,255,0.02)", border: "0.5px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "20px 16px" },
  hiwN: { display: "block", fontSize: 11, color: "rgba(99,102,241,0.6)", fontFamily: "monospace", marginBottom: 8 },
  hiwTitle: { display: "block", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  hiwDesc: { fontSize: 12, color: "rgba(255,255,255,0.3)", lineHeight: 1.6, margin: 0 },
};

/* ─── colour swatches & size/bg pill components ─── */
function ColorSwatch({ color, active, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 24, height: 24, borderRadius: "50%", cursor: "pointer", flexShrink: 0,
        background: color,
        border: active ? "2.5px solid #fff" : "2px solid rgba(255,255,255,0.15)",
        boxSizing: "border-box",
      }}
    />
  );
}

function Pill({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px", fontSize: 12, borderRadius: 8, cursor: "pointer", fontFamily: "inherit",
        border: active ? "0.5px solid rgba(99,102,241,0.6)" : "0.5px solid rgba(255,255,255,0.1)",
        background: active ? "rgba(99,102,241,0.15)" : "transparent",
        color: active ? "#a5b4fc" : "rgba(255,255,255,0.45)",
      }}
    >
      {label}
    </button>
  );
}

/* ─── spinner ─── */
function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" style={{ animation: "spin 0.8s linear infinite" }}>
      <circle cx="9" cy="9" r="7" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
      <path d="M9 2 A7 7 0 0 1 16 9" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── MAIN COMPONENT ─── */
export default function Home({ onLogout }) {
  /* upload state */
  const [file, setFile] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  /* editor state — populated after transcription */
  const [rawVideoUrl, setRawVideoUrl] = useState("");     // original video (no subs)
  const [segments, setSegments] = useState([]);           // [{id,start,end,text,x,y}]
  const [activeSegId, setActiveSegId] = useState(0);

  /* subtitle style */
  const [color, setColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("18px");
  const [bgStyle, setBgStyle] = useState("rgba(0,0,0,0.6)");
  const [bgRadius, setBgRadius] = useState("4px");

  /* drag */
  const stageRef = useRef();
  const isDragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ox: 0, oy: 0 });

  /* final burned result */
  const [finalVideoUrl, setFinalVideoUrl] = useState("");

  /* ── file handling ── */
  const handleFileChange = (f) => {
    if (f && f.type.startsWith("video/")) {
      setFile(f);
      setFinalVideoUrl("");
      setRawVideoUrl("");
      setSegments([]);
      setError("");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileChange(e.dataTransfer.files[0]);
  };

  /* ── Step 1: Transcribe only (no burn) ── */
  const handleUpload = async () => {
    if (!file) return;
    setProcessing(true);
    setFinalVideoUrl("");
    setError("");
    setRawVideoUrl("");
    setSegments([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        `${BACKEND_API}/transcribe`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data.success) {
        const segs = response.data.segments.map((s) => ({
          ...s,
          x: 50,
          y: 85,
        }));
        setSegments(segs);
        setRawVideoUrl(response.data.video_url);
        setActiveSegId(0);
      }
    } catch {
      setError("Failed to process video. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ── Step 2: Burn with positions ── */
  const handleBurn = async () => {
    if (!rawVideoUrl || segments.length === 0) return;
    setProcessing(true);
    setFinalVideoUrl("");
    setError("");

    try {
      const response = await axios.post(`${BACKEND_API}/burn-positioned`, {
        video_url: rawVideoUrl,
        segments,
        style: { color, fontSize, background: bgStyle },
      });

      if (response.data.success) setFinalVideoUrl(response.data.video_url);
    } catch {
      setError("Failed to burn subtitles. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  /* ── drag handlers ── */
  const activeSeg = segments.find((s) => s.id === activeSegId) || { x: 50, y: 85, text: "" };

  const onPointerDown = (e) => {
    isDragging.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragStart.current = { mx: e.clientX, my: e.clientY, ox: activeSeg.x, oy: activeSeg.y };
    e.preventDefault();
  };

  const onPointerMove = useCallback(
    (e) => {
      if (!isDragging.current || !stageRef.current) return;
      const rect = stageRef.current.getBoundingClientRect();
      const dx = ((e.clientX - dragStart.current.mx) / rect.width) * 100;
      const dy = ((e.clientY - dragStart.current.my) / rect.height) * 100;
      const nx = Math.max(5, Math.min(95, dragStart.current.ox + dx));
      const ny = Math.max(5, Math.min(95, dragStart.current.oy + dy));
      setSegments((prev) =>
        prev.map((s) => (s.id === activeSegId ? { ...s, x: nx, y: ny } : s))
      );
    },
    [activeSegId]
  );

  const onPointerUp = () => { isDragging.current = false; };

  const moveTo = (x, y) =>
    setSegments((prev) =>
      prev.map((s) => (s.id === activeSegId ? { ...s, x, y } : s))
    );

  /* ── export config ── */
  const exportConfig = () => {
    const config = {
      style: { color, fontSize, background: bgStyle },
      segments: segments.map((s) => ({
        id: s.id, start: s.start, end: s.end, text: s.text,
        x: Math.round(s.x), y: Math.round(s.y),
      })),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "subtitle-config.json";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  /* ── download final video ── */
  const handleDownload = async () => {
    try {
      const res = await fetch(finalVideoUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file ? file.name.replace(/\.[^.]+$/, "_subtitled.mp4") : "subtitled_video.mp4";
      document.body.appendChild(a); a.click(); a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Download failed. Try right-clicking the video to save.");
    }
  };

  const showEditor = segments.length > 0 && rawVideoUrl;

  return (
    <div style={S.root}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .home-seg-item:hover { background: rgba(255,255,255,0.04) !important; }
        .preset-btn-h:hover { border-color:rgba(99,102,241,0.4) !important; color:rgba(255,255,255,0.7) !important; }
        .export-btn-h:hover { background:rgba(255,255,255,0.06) !important; }
        .logout-btn-h:hover { color:rgba(255,255,255,0.8) !important; }
      `}</style>

      <div style={S.bgGrid} />
      <div style={S.bgGlow1} />
      <div style={S.bgGlow2} />

      {/* ── Navbar ── */}
      <nav style={S.nav}>
        <div style={S.brand}>
          <div style={S.brandIcon}>
            <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
              <rect x="2" y="8" width="36" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
              <path d="M8 14h24M8 20h16M8 26h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          SubtitleAI
        </div>
        <div style={S.navActions}>
          <button className="logout-btn-h" style={S.logoutBtn} onClick={onLogout}>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M13 15l4-5-4-5M17 10H8M8 4H5a1 1 0 00-1 1v10a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Sign out
          </button>
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={S.main}>

        {/* Hero */}
        <div style={{ marginBottom: 36 }}>
          <div style={S.heroBadge}>
            <span style={S.badgeDot} />
            AI-Powered Transcription
          </div>
          <h1 style={S.heroTitle}>
            Add subtitles to<br />
            <span style={S.heroAccent}>any video</span>
          </h1>
          <p style={S.heroSub}>
            Upload your video, position captions exactly where you want them, then export with subtitles burned in.
          </p>
        </div>

        {/* Upload zone — only show when no editor open */}
        {!showEditor && (
          <>
            <div
              style={{
                ...S.dropZone,
                ...(dragOver ? S.dropZoneOver : {}),
                ...(file ? S.dropZoneFilled : {}),
              }}
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
                <div>
                  <div style={S.dropIcon}>
                    <svg viewBox="0 0 48 48" fill="none" width="100%" height="100%">
                      <rect x="4" y="10" width="40" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="34" cy="18" r="3" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M4 32l10-10 8 8 6-6 8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M24 2v10M20 6l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p style={S.dropTitle}>Drop your video here</p>
                  <p style={S.dropSub}>
                    or <span style={S.dropSubAccent}>browse files</span> · MP4, MOV, AVI, MKV
                  </p>
                </div>
              ) : (
                <div style={S.filePreview}>
                  <div style={S.fileThumb}>
                    <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                      <rect x="4" y="6" width="32" height="28" rx="3" fill="currentColor" fillOpacity=".15" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M16 14l10 6-10 6V14z" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <p style={S.fileName}>{file.name}</p>
                    <p style={S.fileSize}>{(file.size / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                  <button
                    style={S.fileRemove}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            <button
              style={{ ...S.generateBtn, ...((!file || processing) ? S.generateBtnDisabled : {}) }}
              onClick={handleUpload}
              disabled={!file || processing}
            >
              {processing ? (
                <><Spinner /> Transcribing audio…</>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Transcribe Video
                </>
              )}
            </button>

            {processing && (
              <div style={S.processSteps}>
                {["Uploading", "Transcribing audio", "Preparing editor"].map((step, i) => (
                  <div key={i} style={{ ...S.step, animationDelay: `${i * 0.4}s` }}>
                    <span style={{ ...S.stepDot, animationDelay: `${i * 0.4}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── Error ── */}
        {error && (
          <div style={S.errorBanner}>
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4M10 13v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {error}
          </div>
        )}

        {/* ══════════════════════════════════════
             SUBTITLE EDITOR
        ══════════════════════════════════════ */}
        {showEditor && (
          <div style={{ animation: "fadeIn 0.35s ease" }}>

            {/* back button */}
            <button
              onClick={() => { setFile(null); setSegments([]); setRawVideoUrl(""); setFinalVideoUrl(""); }}
              style={{ ...S.exportBtn, marginBottom: 20, padding: "7px 14px", fontSize: 12 }}
              className="export-btn-h"
            >
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                <path d="M12 4l-8 6 8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload different video
            </button>

            <p style={S.sectionTitle}>Position subtitles</p>

            {/* ── Video stage with draggable subtitle ── */}
            <div
              ref={stageRef}
              style={{ ...S.stageWrap, cursor: "crosshair" }}
            >
              {/* video preview */}
              <video
                src={rawVideoUrl}
                style={S.stageVideo}
                controls={false}
                muted
                playsInline
                preload="metadata"
              />

              {/* draggable subtitle overlay */}
              <div
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                style={{
                  ...S.subtitleOverlay,
                  left: `${activeSeg.x}%`,
                  top: `${activeSeg.y}%`,
                  color,
                  fontSize,
                  background: bgStyle,
                  borderRadius: bgRadius,
                  outline: "2px solid rgba(99,102,241,0.7)",
                  outlineOffset: 3,
                }}
              >
                {activeSeg.text || "No subtitle"}
              </div>
            </div>

            {/* Quick position presets */}
            <div style={S.presetBar}>
              <span style={S.presetLabel}>Quick position:</span>
              {[
                { label: "Bottom center", x: 50, y: 85 },
                { label: "Top center", x: 50, y: 12 },
                { label: "Bottom left", x: 18, y: 85 },
                { label: "Bottom right", x: 82, y: 85 },
                { label: "Center", x: 50, y: 50 },
              ].map((p) => (
                <button
                  key={p.label}
                  className="preset-btn-h"
                  style={S.presetBtn}
                  onClick={() => moveTo(p.x, p.y)}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Style controls */}
            <div style={S.controlsGrid}>
              <div style={S.controlCard}>
                <span style={S.controlLabel}>Text colour</span>
                <div style={S.styleRow}>
                  {["#ffffff", "#ffff00", "#00d4ff", "#ff8c00", "#111111"].map((c) => (
                    <ColorSwatch key={c} color={c} active={color === c} onClick={() => setColor(c)} />
                  ))}
                </div>
              </div>

              <div style={S.controlCard}>
                <span style={S.controlLabel}>Font size</span>
                <div style={S.styleRow}>
                  {[["S", "14px"], ["M", "18px"], ["L", "24px"], ["XL", "32px"]].map(([lbl, sz]) => (
                    <Pill key={lbl} label={lbl} active={fontSize === sz} onClick={() => setFontSize(sz)} />
                  ))}
                </div>
              </div>

              <div style={S.controlCardFull}>
                <span style={S.controlLabel}>Background style</span>
                <div style={S.styleRow}>
                  {[
                    { label: "Dark box", bg: "rgba(0,0,0,0.6)", r: "4px" },
                    { label: "No bg", bg: "rgba(0,0,0,0)", r: "0" },
                    { label: "Black box", bg: "rgba(0,0,0,0.88)", r: "4px" },
                    { label: "Frosted", bg: "rgba(255,255,255,0.12)", r: "4px" },
                  ].map((opt) => (
                    <Pill
                      key={opt.label}
                      label={opt.label}
                      active={bgStyle === opt.bg}
                      onClick={() => { setBgStyle(opt.bg); setBgRadius(opt.r); }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Segment timeline */}
            <div style={S.timeline}>
              <p style={S.timelineLabel}>
                Segments — click to select, drag to reposition on stage
              </p>
              <div style={S.segList}>
                {segments.map((seg) => (
                  <div
                    key={seg.id}
                    className="home-seg-item"
                    style={{
                      ...S.segItem,
                      ...(seg.id === activeSegId ? S.segItemActive : {}),
                    }}
                    onClick={() => setActiveSegId(seg.id)}
                  >
                    <span style={S.segTime}>{seg.start}</span>
                    <span style={S.segText}>{seg.text}</span>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "monospace" }}>
                      {Math.round(seg.x)}%·{Math.round(seg.y)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Export / Burn bar */}
            <div style={S.exportBar}>
              <button className="export-btn-h" style={S.exportBtn} onClick={exportConfig}>
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Export config
              </button>
              <button
                style={{ ...S.burnBtn, ...(processing ? S.generateBtnDisabled : {}) }}
                onClick={handleBurn}
                disabled={processing}
              >
                {processing ? <><Spinner /> Burning…</> : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Burn subtitles
                  </>
                )}
              </button>
              <span style={S.posReadout}>
                x: {Math.round(activeSeg.x)}% · y: {Math.round(activeSeg.y)}%
              </span>
            </div>

            {processing && (
              <div style={{ ...S.processSteps, justifyContent: "flex-start", marginTop: 12 }}>
                {["Downloading video", "Generating ASS file", "Burning with FFmpeg", "Uploading result"].map((step, i) => (
                  <div key={i} style={S.step}>
                    <span style={{ ...S.stepDot, animationDelay: `${i * 0.35}s` }} />
                    {step}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Final result ── */}
        {finalVideoUrl && (
          <div style={{ ...S.resultCard, animation: "fadeIn 0.4s ease" }}>
            <div style={S.resultHeader}>
              <div style={S.resultBadge}>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Ready
              </div>
              <h2 style={{ margin: 0, fontSize: 16, fontWeight: 500, color: "#f0f0f0" }}>
                Your subtitled video
              </h2>
            </div>
            <video controls src={finalVideoUrl} style={S.resultVideo} />
            <button style={S.downloadBtn} onClick={handleDownload}>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Download video
            </button>
          </div>
        )}

        {/* ── How it works (only on empty state) ── */}
        {!showEditor && !finalVideoUrl && !processing && (
          <div style={S.howItWorks}>
            <p style={S.hiwLabel}>How it works</p>
            <div style={S.hiwSteps}>
              {[
                { n: "01", title: "Upload", desc: "Drop any video up to 2 GB" },
                { n: "02", title: "Position", desc: "Drag captions to any spot on the frame" },
                { n: "03", title: "Export", desc: "Download with subtitles burned in" },
              ].map((s) => (
                <div key={s.n} style={S.hiwStep}>
                  <span style={S.hiwN}>{s.n}</span>
                  <strong style={S.hiwTitle}>{s.title}</strong>
                  <p style={S.hiwDesc}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}