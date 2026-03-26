# Plant Disease Detection (PlantCare SaaS)

**Live Demo:** [https://plant-disease-detection-liart-two.vercel.app](https://plant-disease-detection-liart-two.vercel.app)

An AI-powered web application for early detection and identification of plant diseases from leaf images. The platform combines a FastAPI-based backend machine learning engine with a responsive, modern React frontend.

## Features
- **Real-Time Analysis**: Upload photos to securely identify plant diseases and determine overall plant health.
- **High-Accuracy Computer Vision**: Powered by a robust classification model trained on over 50+ crop species.
- **Modern User Interface**: Designed with React and Vite for blisteringly fast performance and stunning aesthetics.

---

## Tech Stack
- **Frontend**: React, Vite, Vanilla CSS
- **Backend API**: FastAPI, Uvicorn, Python Multipart
- **Machine Learning**: TensorFlow (or `tensorflow-macos` on Apple Silicon), Keras, NumPy, Pillow

---

## Getting Started

### Prerequisites
- Python 3.9+ 
- Node.js 18+

### 1. Setting Up the Backend
We recommend using a virtual environment to manage dependencies locally.

```bash
# Navigate to the base directory
cd app

# Create a virtual environment
python3 -m venv .app_venv

# Activate the virtual environment (macOS/Linux)
source .app_venv/bin/activate

# Install the dependencies
pip install -r requirements.txt

# IF YOU ARE ON A MAC APPLE SILICON (M1/M2/M3), RUN:
export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES

# Start the API server
python api.py
```
> The API will be available at http://0.0.0.0:8511

### 2. Setting Up the Frontend
In a new terminal window, navigate to the frontend directory:

```bash
cd frontend

# Install Node modules
npm install

# Start the development server
npm run dev -- --host
```
> The web application will automatically be available at http://localhost:5173

---

## License
Created for Plant Disease Detection (Minor Project 1). All rights reserved.
