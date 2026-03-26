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
      const response = await fetch('http://127.0.0.1:8511/predict', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error analyzing image:', error);
      setResult({ error: error.message ? `Fetch Error: ${error.message}` : 'Failed to analyze image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="brand">
          <svg className="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" stroke="none" fill="#1a583e"/>
            <path d="M12 3v10c0 1.66-1.34 3-3 3S6 14.66 6 13M12 3v10c0 1.66 1.34 3 3 3s3-1.66 3-3" stroke="#1a583e" />
          </svg>
          PlantCare
        </div>
        <div className="nav-links">
          <a href="#scanner">Scanner</a>
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
        </div>
        <div className="nav-auth">
          <button className="login-btn">Log In</button>
          <button className="signup-btn">Get Started</button>
        </div>
        <div className="hamburger-menu">
          <span></span>
          <span></span>
          <span className="short"></span>
        </div>
      </nav>

      <div className="hero-scanner-wrapper">
        {/* ── 3D Waving Nature SVGs (Background) ── */}
        <div className="nature-layer">
          <svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice" className="main-svg">
            <g className="layer-back">
              <path d="M 200,400 Q 150,200 250,50 Q 280,150 200,400" fill="#a5d7b5" opacity="0.8"/>
              <path d="M 800,400 Q 850,200 750,50 Q 720,150 800,400" fill="#a5d7b5" opacity="0.8"/>
              <path d="M 500,400 Q 400,100 550,20 Q 580,100 500,400" fill="#9bcba8" opacity="0.8"/>
            </g>
            <g className="layer-mid">
              <path d="M 300,400 Q 200,250 150,150 Q 250,250 300,400" fill="#4ab987"/>
              <path d="M 350,400 Q 250,200 320,100 Q 400,200 350,400" fill="#35a77a"/>
              <path d="M 700,400 Q 800,250 850,150 Q 750,250 700,400" fill="#4ab987"/>
              <path d="M 650,400 Q 750,200 680,100 Q 600,200 650,400" fill="#35a77a"/>
              <path d="M 450,400 Q 400,250 480,150 Q 550,250 450,400" fill="#329e74"/>
              <path d="M 550,400 Q 600,250 520,150 Q 450,250 550,400" fill="#2d8e6a"/>
            </g>
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
          <svg viewBox="0 0 200 400" preserveAspectRatio="xMinYMax slice" className="side-svg left-svg">
            <g className="layer-sidebar">
              <path d="M -50,400 Q 50,300 80,100 Q -20,200 -50,400" fill="#4ab987"/>
              <path d="M -30,400 Q 80,350 120,200 Q 30,300 -30,400" fill="#35a77a"/>
              <ellipse cx="60" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(-30 60 220)"/>
              <ellipse cx="80" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(-40 80 180)"/>
            </g>
          </svg>
          <svg viewBox="0 0 200 400" preserveAspectRatio="xMaxYMax slice" className="side-svg right-svg">
            <g className="layer-sidebar" style={{ animationDirection: 'alternate', animationDelay: '-2s' }}>
              <path d="M 250,400 Q 150,300 120,100 Q 220,200 250,400" fill="#4ab987"/>
              <path d="M 230,400 Q 120,350 80,200 Q 170,300 230,400" fill="#35a77a"/>
              <ellipse cx="140" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(30 140 220)"/>
              <ellipse cx="120" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(40 120 180)"/>
            </g>
          </svg>
        </div>

        {/* ── Hero Section ── */}
        <header className="hero-section">
          <div className="hero-badge">New AI Model 2.0 Released ✨</div>
          <h1 className="hero-title">AI-Powered Plant<br/>Health Diagnostics</h1>
          <p className="hero-subtitle">Instantly detect diseases, find treatments, and keep your crops thriving with our enterprise-grade computer vision platform.</p>
          <div className="hero-actions">
            <a href="#scanner" className="btn-primary">Scan Plant Now</a>
            <a href="#features" className="btn-secondary">Explore Features</a>
          </div>
        </header>

        {/* ── Main Content / Scanner ── */}
        <main className="main-content" id="scanner">
          <div className="scanner-wrapper">
            <div className="scanner-header">
              <h2 className="scanner-title">Live Diagnostics</h2>
              <p className="scanner-desc">Upload a picture of a leaf to instantly identify potential diseases.</p>
            </div>

            <div className="upload-container">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />

              {!previewUrl ? (
                <div className="search-bar" onClick={handleUploadClick}>
                  <span className="placeholder">Drag & drop or click to upload leaf...</span>
                  <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
              ) : (
                <div className="preview-card">
                  <img src={previewUrl} alt="Leaf Preview" className="preview-image" />
                  
                  {!result && !loading && (
                     <div className="action-row">
                       <button className="reset-btn-outline" onClick={() => { setPreviewUrl(null); setSelectedImage(null); }}>
                          Cancel
                       </button>
                       <button className="analyze-btn" onClick={handleAnalyze}>
                          Analyze Disease
                       </button>
                     </div>
                  )}

                  {loading && (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Processing with AI Models...</p>
                    </div>
                  )}

                  {result && !result.error && (
                    <div className={`result-box ${result.healthy ? 'healthy' : 'disease'}`}>
                      <div className="result-header">
                        <h2>{result.healthy ? '✅ Healthy Plant' : '⚠️ Disease Detected'}</h2>
                        <span className="confidence-badge">99% Match</span>
                      </div>
                      <p className="disease-name">{result.disease_name}</p>
                      <div className="recommendations">
                         <h3>Recommended Action</h3>
                         <p>{result.healthy ? 'Continue current care routine. Ensure adequate sunlight and water.' : 'Isolate plant. Consider applying appropriate fungicide or adjusting water conditions based on the specific disease.'}</p>
                      </div>
                      <button className="reset-btn" onClick={() => { setPreviewUrl(null); setSelectedImage(null); setResult(null); }}>
                        Scan Another Plant
                      </button>
                    </div>
                  )}
                  {result && result.error && (
                     <div className="result-box disease">
                       <div className="result-header">
                         <h2>❌ Analysis Failed</h2>
                       </div>
                       <p className="disease-name">{result.error}</p>
                       <button className="reset-btn" onClick={() => { setPreviewUrl(null); setSelectedImage(null); setResult(null); }}>Try Again</button>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ── Features Section ── */}
      <section className="features-section" id="features">
        <div className="section-header">
          <h2>Why Choose PlantCare SaaS?</h2>
          <p>The most advanced agricultural AI platform built for both hobbyists and commercial farms.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon bg-green">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3>Instant Diagnostics</h3>
            <p>Get accurate results in milliseconds. Our edge-optimized models deliver real-time insights for your crops.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon bg-blue">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3>Extensive Database</h3>
            <p>Trained on millions of images covering over 50+ crop species and hundreds of potential diseases.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon bg-orange">
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3>Historical Tracking</h3>
            <p>Monitor plant health over time. Keep logs of applied treatments and chart recovery progress intuitively.</p>
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section className="pricing-section" id="pricing">
        <div className="section-header">
          <h2>Simple, Transparent Pricing</h2>
          <p>Choose the plan that fits your agricultural needs.</p>
        </div>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-name">Hobbyist</div>
            <div className="plan-price">Free</div>
            <p className="plan-desc">Perfect for indoor plant lovers.</p>
            <ul className="plan-features">
              <li>✓ 50 scans per month</li>
              <li>✓ Basic disease detection</li>
              <li>✓ Community support</li>
            </ul>
            <button className="plan-btn btn-outline">Current Plan</button>
          </div>
          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <div className="plan-name">Pro Farmer</div>
            <div className="plan-price">$29<span>/mo</span></div>
            <p className="plan-desc">For serious gardeners and boutique farms.</p>
            <ul className="plan-features">
              <li>✓ Unlimited scans</li>
              <li>✓ Advanced treatment guides</li>
              <li>✓ Priority email support</li>
              <li>✓ API Access (1K reqs)</li>
            </ul>
            <button className="plan-btn btn-primary">Upgrade to Pro</button>
          </div>
          <div className="pricing-card">
            <div className="plan-name">Enterprise</div>
            <div className="plan-price">Custom</div>
            <p className="plan-desc">For large scale agricultural operations.</p>
            <ul className="plan-features">
              <li>✓ Dedicated API instance</li>
              <li>✓ Custom AI model tuning</li>
              <li>✓ 24/7 Phone support</li>
              <li>✓ Drone integration</li>
            </ul>
            <button className="plan-btn btn-outline">Contact Sales</button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand" style={{justifyContent: 'flex-start', color: 'white'}}>PlantCare</div>
            <p style={{marginTop: '1rem', color: '#9ca3af', lineHeight: '1.6'}}>Empowering agriculture through artificial intelligence and computer vision.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#pricing">Pricing</a>
              <a href="#">API Documentation</a>
            </div>
            <div className="link-group">
              <h4>Company</h4>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
           <p>&copy; {new Date().getFullYear()} PlantCare SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
