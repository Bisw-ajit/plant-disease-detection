import os
import json
import numpy as np
import tensorflow as tf
from PIL import Image
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="PlantMD API")

# Allow CORS for local React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
working_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(working_dir, "trained_model", "plant_disease_prediction_model.h5")
class_indices_path = os.path.join(working_dir, "class_indices.json")

print("Loading model from:", model_path)
model = tf.keras.models.load_model(model_path)

with open(class_indices_path, 'r') as f:
    class_indices = json.load(f)

def preprocess_image(image: Image.Image, target_size=(224, 224)):
    img = image.convert("RGB").resize(target_size)
    arr = np.array(img, dtype="float32") / 255.0
    return np.expand_dims(arr, axis=0)

@app.post("/predict")
async def predict_disease(file: UploadFile = File(...)):
    try:
        image = Image.open(file.file)
        arr = preprocess_image(image)
        preds = model.predict(arr)
        idx = int(np.argmax(preds, axis=1)[0])
        
        disease_key = class_indices[str(idx)]
        formatted_name = disease_key.replace("___", " — ").replace("_", " ").title()
        is_healthy = "healthy" in formatted_name.lower()
        
        return {
            "disease_name": formatted_name,
            "healthy": is_healthy
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
