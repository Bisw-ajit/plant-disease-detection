import React, { useState, useRef } from 'react';
import './index.css';

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleUploadClick = () => {
    if (previewUrl && !result && !loading) {
        handleAnalyze();
    } else {
        fileInputRef.current.click();
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({ error: 'Failed to analyze image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="spacer"></div>
        <div className="brand">earthplants</div>
        <div className="hamburger-menu">
          <span></span>
          <span></span>
          <span className="short"></span>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="main-content">
        <h1 className="headline">
          {result ? 'analysis complete.' : 'search for plants.'}
        </h1>

        <div className="upload-container">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          {!previewUrl ? (
            <div className="search-bar" onClick={handleUploadClick}>
              <span className="placeholder">upload leaf image...</span>
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          ) : (
            <div className="preview-card">
              <img src={previewUrl} alt="Leaf Preview" className="preview-image" />
              
              {!result && !loading && (
                 <button className="analyze-btn" onClick={handleAnalyze}>
                    Analyze Disease
                 </button>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Analyzing with AI...</p>
                </div>
              )}

              {result && !result.error && (
                <div className={`result-box ${result.healthy ? 'healthy' : 'disease'}`}>
                  <h2>{result.healthy ? '✅ Healthy' : '⚠️ Disease Detected'}</h2>
                  <p className="disease-name">{result.disease_name}</p>
                  <button className="reset-btn" onClick={() => { setPreviewUrl(null); setSelectedImage(null); setResult(null); }}>
                    Scan Another Plant
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* ── 3D Waving Nature SVGs ── */}
      <div className="nature-layer">
        <svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" className="main-svg">
          {/* Back Layer (Lighter, taller) */}
          <g className="layer-back">
            <path d="M 200,400 Q 150,200 250,50 Q 280,150 200,400" fill="#a5d7b5" opacity="0.8"/>
            <path d="M 800,400 Q 850,200 750,50 Q 720,150 800,400" fill="#a5d7b5" opacity="0.8"/>
            <path d="M 500,400 Q 400,100 550,20 Q 580,100 500,400" fill="#9bcba8" opacity="0.8"/>
          </g>
          
          {/* Mid Layer */}
          <g className="layer-mid">
            <path d="M 300,400 Q 200,250 150,150 Q 250,250 300,400" fill="#4ab987"/>
            <path d="M 350,400 Q 250,200 320,100 Q 400,200 350,400" fill="#35a77a"/>
            <path d="M 700,400 Q 800,250 850,150 Q 750,250 700,400" fill="#4ab987"/>
            <path d="M 650,400 Q 750,200 680,100 Q 600,200 650,400" fill="#35a77a"/>
            <path d="M 450,400 Q 400,250 480,150 Q 550,250 450,400" fill="#329e74"/>
            <path d="M 550,400 Q 600,250 520,150 Q 450,250 550,400" fill="#2d8e6a"/>
          </g>
          
          {/* Ferns / Tulips Layer */}
          <g className="layer-tulip">
            <path d="M 250,400 Q 200,300 150,200" stroke="#35a77a" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <ellipse cx="145" cy="190" rx="15" ry="25" fill="#f98f26" transform="rotate(-30 145 190)"/>
            
            <path d="M 320,400 Q 250,300 220,250" stroke="#35a77a" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <ellipse cx="215" cy="240" rx="12" ry="20" fill="#f9a826" transform="rotate(-40 215 240)"/>
            
            <path d="M 750,400 Q 800,300 850,200" stroke="#35a77a" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <ellipse cx="855" cy="190" rx="15" ry="25" fill="#f98f26" transform="rotate(30 855 190)"/>
            
            <path d="M 680,400 Q 750,300 780,250" stroke="#35a77a" strokeWidth="8" fill="none" strokeLinecap="round"/>
            <ellipse cx="785" cy="240" rx="12" ry="20" fill="#f9a826" transform="rotate(40 785 240)"/>
          </g>
          
          {/* Front Layer (Darkest, sharpest) */}
          <g className="layer-front">
            <path d="M 380,400 Q 280,300 200,280 Q 300,350 380,400" fill="#1d664b"/>
            <path d="M 400,400 Q 350,300 300,220 Q 400,320 400,400" fill="#17563f"/>
            <path d="M 620,400 Q 720,300 800,280 Q 700,350 620,400" fill="#1d664b"/>
            <path d="M 600,400 Q 650,300 700,220 Q 600,320 600,400" fill="#17563f"/>
            <path d="M 480,400 Q 450,350 490,280 Q 500,350 480,400" fill="#1a583e"/>
            <path d="M 520,400 Q 550,350 510,280 Q 500,350 520,400" fill="#154a35"/>
          </g>
          
          <path d="M 150,400 L 850,400" stroke="#1d664b" strokeWidth="6" strokeLinecap="round"/>
        </svg>

        {/* Left Sidebar Plant */}
        <svg viewBox="0 0 200 400" preserveAspectRatio="xMinYMax slice" className="side-svg left-svg">
          <g className="layer-sidebar">
            <path d="M -50,400 Q 50,300 80,100 Q -20,200 -50,400" fill="#4ab987"/>
            <path d="M -30,400 Q 80,350 120,200 Q 30,300 -30,400" fill="#35a77a"/>
            <ellipse cx="60" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(-30 60 220)"/>
            <ellipse cx="80" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(-40 80 180)"/>
          </g>
        </svg>

        {/* Right Sidebar Plant */}
        <svg viewBox="0 0 200 400" preserveAspectRatio="xMaxYMax slice" className="side-svg right-svg">
          <g className="layer-sidebar" style={{ animationDirection: 'alternate', animationDelay: '-2s' }}>
            <path d="M 250,400 Q 150,300 120,100 Q 220,200 250,400" fill="#4ab987"/>
            <path d="M 230,400 Q 120,350 80,200 Q 170,300 230,400" fill="#35a77a"/>
            <ellipse cx="140" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(30 140 220)"/>
            <ellipse cx="120" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(40 120 180)"/>
          </g>
        </svg>
      </div>
    </div>
  );
}

export default App;
