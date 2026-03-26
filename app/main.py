import os
import json
from PIL import Image
import numpy as np
import tensorflow as tf
import streamlit as st

# ── Page config ──────────────────────────────────────────────────────────────
st.set_page_config(
    page_title="earthplants - Disease Detector",
    page_icon="🌿",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Nature Waving CSS & Layout ───────────────────────────────────────────────
st.markdown("""<style>
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
/* Base Reset & Variables */
* {
box-sizing: border-box;
}
html, body, [class*="css"] {
font-family: 'Outfit', sans-serif;
background: transparent !important;
}
/* Background Application Gradient (Matches the image) */
.stApp {
background: linear-gradient(180deg, #6fdca5 0%, #a4e1ae 35%, #f1dc9c 80%, #ffde99 100%) !important;
overflow-x: hidden;
}
/* Hide default streamlit UI elements */
#MainMenu, footer, header { visibility: hidden !important; }
.block-container {
padding-top: 2rem !important;
max-width: 100% !important;
z-index: 10;
position: relative;
padding-bottom: 250px !important;
}
/* ── Custom Navbar ── */
.custom-nav {
display: flex;
justify-content: space-between;
align-items: center;
padding: 1rem 4rem;
color: #1a583e;
}
.nav-brand {
font-size: 1.5rem;
font-weight: 500;
letter-spacing: 0.1em;
flex-grow: 1;
text-align: center;
}
.nav-menu {
cursor: pointer;
}
.hamburger {
width: 28px;
height: 3px;
background-color: #f8f9fa;
margin: 5px 0;
border-radius: 999px;
box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
/* ── Typography & Centering ── */
.headline-container {
text-align: center;
margin-top: 6rem;
margin-bottom: 2.5rem;
}
.headline {
font-size: clamp(2rem, 4vw, 3rem);
font-weight: 700;
color: #ffffff;
text-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
letter-spacing: 0.02em;
}
/* ── Streamlit Element Styling (The "Search Bar") ── */
.upload-wrapper {
max-width: 600px;
margin: 0 auto;
background: rgba(255, 255, 255, 0.3);
border: 2px solid rgba(255, 255, 255, 0.7);
border-radius: 999px; /* Pill shape */
padding: 0.5rem 2rem;
backdrop-filter: blur(10px);
box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
transition: all 0.3s ease;
}
.upload-wrapper:hover {
background: rgba(255, 255, 255, 0.45);
box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
transform: translateY(-2px);
}
/* Make Streamlit Uploader transparent and mimic the search bar */
[data-testid="stFileUploadDropzone"] {
background: transparent !important;
border: none !important;
padding: 1rem !important;
min-height: 80px !important;
display: flex;
align-items: center;
justify-content: center;
}
[data-testid="stFileUploadDropzone"] button {
display: none !important; /* Hide default browse files button */
}
[data-testid="stFileUploadDropzone"] div[data-testid="stMarkdownContainer"] p {
font-size: 1.2rem;
color: #1a583e;
font-weight: 500;
}
/* Button Styling for "Analyse" */
[data-testid="stButton"] button {
background: linear-gradient(135deg, #22c55e 0%, #10b981 100%) !important;
color: white !important;
border: none !important;
border-radius: 999px !important;
padding: 0.8rem 3rem !important;
font-weight: 700 !important;
font-size: 1.1rem !important;
box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3) !important;
margin: 1.5rem auto !important;
display: block !important;
transition: all 0.3s !important;
}
[data-testid="stButton"] button:hover {
transform: translateY(-3px) !important;
box-shadow: 0 12px 25px rgba(16, 185, 129, 0.4) !important;
}
/* Result Card */
.result-card {
background: rgba(255, 255, 255, 0.9);
border-radius: 20px;
padding: 2rem;
margin: 2rem auto;
max-width: 600px;
text-align: center;
box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
backdrop-filter: blur(20px);
}
.result-healthy {
color: #10b981;
}
.result-disease {
color: #ef4444;
}
.result-card img {
border-radius: 12px;
max-width: 300px;
box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
margin-bottom: 1.5rem;
}
/* ── 3D Waving Plants Animations (The magic) ── */
.nature-layer {
position: fixed;
bottom: -10%;
left: 0;
width: 100vw;
height: 60vh;
pointer-events: none;
z-index: 1; /* Behind UI, but in front of background */
overflow: visible;
transform-style: preserve-3d;
perspective: 1000px;
}
/* We style SVGs directly inside the layer */
.nature-layer svg {
position: absolute;
bottom: 0px;
width: 100%;
height: 100%;
}
/* Waving keyframes for 3D realism */
@keyframes breeze-back {
0%, 100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1); }
50% { transform: rotateX(10deg) rotateY(5deg) rotateZ(2deg) scale(1.02); }
}
@keyframes breeze-mid {
0%, 100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
33% { transform: rotateX(-5deg) rotateY(-8deg) rotateZ(-3deg); }
66% { transform: rotateX(5deg) rotateY(3deg) rotateZ(2deg); }
}
@keyframes breeze-front {
0%, 100% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
50% { transform: rotateX(15deg) rotateY(-10deg) rotateZ(-1deg); }
}
/* Apply animations to groupings within the SVG */
.layer-back {
transform-origin: bottom center;
animation: breeze-back 12s infinite ease-in-out;
}
.layer-mid {
transform-origin: bottom center;
animation: breeze-mid 9s infinite ease-in-out;
}
.layer-front {
transform-origin: bottom center;
animation: breeze-front 7s infinite ease-in-out;
}
.layer-tulip {
transform-origin: bottom center;
animation: breeze-mid 8s infinite ease-in-out alternate-reverse;
}
.layer-sidebar {
transform-origin: center center;
animation: breeze-back 15s infinite ease-in-out alternate-reverse;
}
</style>
<!-- ── Custom Navbar (HTML insertion) ── -->
<div class="custom-nav" style="position: absolute; top:0; left:0; width:100%; z-index: 50;">
<div style="width: 30px;"></div> <!-- spacer -->
<div class="nav-brand">earthplants</div>
<div class="nav-menu">
<div class="hamburger"></div>
<div class="hamburger"></div>
<div class="hamburger" style="width: 20px; margin-left: auto;"></div>
</div>
</div>
<!-- ── SVGs for Waving Nature (3D look) ── -->
<div class="nature-layer">
<svg viewBox="0 0 1000 400" preserveAspectRatio="xMidYMax slice">
<!-- Back Layer (Lighter, taller) -->
<g class="layer-back">
<!-- Left tall back leaf -->
<path d="M 200,400 Q 150,200 250,50 Q 280,150 200,400" fill="#a5d7b5" opacity="0.8"/>
<!-- Right tall back leaf -->
<path d="M 800,400 Q 850,200 750,50 Q 720,150 800,400" fill="#a5d7b5" opacity="0.8"/>
<!-- Center large background -->
<path d="M 500,400 Q 400,100 550,20 Q 580,100 500,400" fill="#9bcba8" opacity="0.8"/>
</g>
<!-- Mid Layer -->
<g class="layer-mid">
<!-- Left medium -->
<path d="M 300,400 Q 200,250 150,150 Q 250,250 300,400" fill="#4ab987"/>
<path d="M 350,400 Q 250,200 320,100 Q 400,200 350,400" fill="#35a77a"/>
<!-- Right medium -->
<path d="M 700,400 Q 800,250 850,150 Q 750,250 700,400" fill="#4ab987"/>
<path d="M 650,400 Q 750,200 680,100 Q 600,200 650,400" fill="#35a77a"/>
<!-- Center cluster -->
<path d="M 450,400 Q 400,250 480,150 Q 550,250 450,400" fill="#329e74"/>
<path d="M 550,400 Q 600,250 520,150 Q 450,250 550,400" fill="#2d8e6a"/>
</g>
<!-- Small patterned leaves (ferns) -->
<g class="layer-tulip">
<!-- Left fern/tulip stems and bulbs -->
<path d="M 250,400 Q 200,300 150,200" stroke="#35a77a" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="145" cy="190" rx="15" ry="25" fill="#f98f26" transform="rotate(-30 145 190)"/>
<path d="M 320,400 Q 250,300 220,250" stroke="#35a77a" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="215" cy="240" rx="12" ry="20" fill="#f9a826" transform="rotate(-40 215 240)"/>
<!-- Right fern/tulip stems and bulbs -->
<path d="M 750,400 Q 800,300 850,200" stroke="#35a77a" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="855" cy="190" rx="15" ry="25" fill="#f98f26" transform="rotate(30 855 190)"/>
<path d="M 680,400 Q 750,300 780,250" stroke="#35a77a" stroke-width="8" fill="none" stroke-linecap="round"/>
<ellipse cx="785" cy="240" rx="12" ry="20" fill="#f9a826" transform="rotate(40 785 240)"/>
</g>
<!-- Front Layer (Darkest, sharpest) -->
<g class="layer-front">
<!-- Left base -->
<path d="M 380,400 Q 280,300 200,280 Q 300,350 380,400" fill="#1d664b"/>
<path d="M 400,400 Q 350,300 300,220 Q 400,320 400,400" fill="#17563f"/>
<!-- Right base -->
<path d="M 620,400 Q 720,300 800,280 Q 700,350 620,400" fill="#1d664b"/>
<path d="M 600,400 Q 650,300 700,220 Q 600,320 600,400" fill="#17563f"/>
<!-- Center spikes (grass) -->
<path d="M 480,400 Q 450,350 490,280 Q 500,350 480,400" fill="#1a583e"/>
<path d="M 520,400 Q 550,350 510,280 Q 500,350 520,400" fill="#154a35"/>
</g>
<!-- Base line matching the image horizon -->
<path d="M 150,400 L 850,400" stroke="#1d664b" stroke-width="6" stroke-linecap="round"/>
</svg>
<!-- Left Sidebar Plant Element -->
<svg viewBox="0 0 200 400" preserveAspectRatio="xMinYMax slice" style="left: -50px; bottom: 50px;">
<g class="layer-sidebar">
<path d="M -50,400 Q 50,300 80,100 Q -20,200 -50,400" fill="#4ab987"/>
<path d="M -30,400 Q 80,350 120,200 Q 30,300 -30,400" fill="#35a77a"/>
<!-- Little offshoot leaves -->
<ellipse cx="60" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(-30 60 220)"/>
<ellipse cx="80" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(-40 80 180)"/>
</g>
</svg>
<!-- Right Sidebar Plant Element -->
<svg viewBox="0 0 200 400" preserveAspectRatio="xMaxYMax slice" style="right: -50px; bottom: 50px;">
<g class="layer-sidebar" style="animation-direction: alternate; animation-delay: -2s;">
<path d="M 250,400 Q 150,300 120,100 Q 220,200 250,400" fill="#4ab987"/>
<path d="M 230,400 Q 120,350 80,200 Q 170,300 230,400" fill="#35a77a"/>
<!-- Little offshoot leaves -->
<ellipse cx="140" cy="220" rx="20" ry="10" fill="#a5d7b5" transform="rotate(30 140 220)"/>
<ellipse cx="120" cy="180" rx="15" ry="8" fill="#a5d7b5" transform="rotate(40 120 180)"/>
</g>
</svg>
</div>""", unsafe_allow_html=True)

# ── Header ───────────────────────────────────────────────────────────────────
st.markdown("""
<div class="headline-container">
    <div class="headline">analyze your plant.</div>
</div>
""", unsafe_allow_html=True)


# ── Model & Data Loading ─────────────────────────────────────────────────────
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = f"{working_dir}/trained_model/plant_disease_prediction_model.h5"

@st.cache_resource
def load_model():
    return tf.keras.models.load_model(model_path)

model = load_model()
class_indices = json.load(open(f"{working_dir}/class_indices.json"))

def preprocess_image(image_path, target_size=(224, 224)):
    img = Image.open(image_path).convert("RGB").resize(target_size)
    arr = np.array(img, dtype="float32") / 255.0
    return np.expand_dims(arr, axis=0)

def predict(model, image_path, class_indices):
    arr = preprocess_image(image_path)
    preds = model.predict(arr)
    idx = int(np.argmax(preds, axis=1)[0])
    return class_indices[str(idx)]


# ── Streamlit UI Elements ─────────────────────────────────────────────────────
st.markdown('<div class="upload-wrapper">', unsafe_allow_html=True)
uploaded_image = st.file_uploader(
    label="leaf_upload",
    type=["jpg", "jpeg", "png"],
    label_visibility="collapsed",
    help="Upload leaf image"
)
st.markdown('</div>', unsafe_allow_html=True)

# Process logic
if uploaded_image is not None:
    # Adding some space above results
    st.markdown("<br><br>", unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([1,2,1])
    with col2:
        image = Image.open(uploaded_image)
        
        if st.button("🔍 Analyze Disease", use_container_width=True):
            with st.spinner("Analyzing plant..."):
                label = predict(model, uploaded_image, class_indices)

            formatted = label.replace("___", " — ").replace("_", " ").title()
            is_healthy = "healthy" in formatted.lower()

            # Result styling
            if is_healthy:
                st.markdown(f"""
                <div class="result-card">
                    <img src="data:image/png;base64,{st.image(image, output_format='PNG')}"/>
                    <h2 class="result-healthy">✅ Healthy Plant</h2>
                    <h3>{formatted}</h3>
                </div>
                """, unsafe_allow_html=True)
                st.balloons()
            else:
                st.markdown(f"""
                <div class="result-card">
                    <h2 class="result-disease">⚠️ Disease Detected</h2>
                    <h3>{formatted}</h3>
                </div>
                """, unsafe_allow_html=True)
                st.image(image, use_column_width=True)
