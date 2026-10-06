"""
FastAPI Microservice for Cardiovascular Disease AI & ML System.
Exposes clean REST API endpoints for real-time model inference,
K-Means patient profiling, SHAP explainability, and model benchmarks.
"""
import os
import sys
import json
from typing import Optional, Dict, Any, List
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Add ml directory to sys.path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")
if ML_DIR not in sys.path:
    sys.path.append(ML_DIR)

from predict import CardioPredictor
from preprocess import FEATURE_COLUMNS, FEATURE_LABELS

app = FastAPI(
    title="CardioAI Prediction & Profiling API",
    description="Educational/Research Prototype for Early Cardiovascular Risk Assessment and Patient Profiling",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Singleton predictor instance
try:
    predictor = CardioPredictor()
except Exception as e:
    print(f"Warning: Predictor failed to load initially: {e}")
    predictor = None

class PatientInput(BaseModel):
    age: float = Field(..., ge=1, le=120, description="Age in years")
    sex: float = Field(..., ge=0, le=1, description="0 = Female, 1 = Male")
    chest_pain: float = Field(..., ge=1, le=4, description="Chest pain type (1: Typical, 2: Atypical, 3: Non-anginal, 4: Asymptomatic)")
    resting_bp: float = Field(..., ge=50, le=300, description="Resting systolic blood pressure (mm Hg)")
    cholesterol: float = Field(..., ge=50, le=700, description="Serum cholesterol (mg/dl)")
    fasting_blood_sugar: float = Field(..., ge=0, le=1, description="Fasting blood sugar > 120 mg/dl (1 = True, 0 = False)")
    resting_ecg: float = Field(..., ge=0, le=2, description="Resting ECG results (0: Normal, 1: ST-T wave, 2: LVH)")
    max_heart_rate: float = Field(..., ge=50, le=250, description="Maximum heart rate achieved (bpm)")
    exercise_angina: float = Field(..., ge=0, le=1, description="Exercise-induced angina (1 = Yes, 0 = No)")
    st_depression: float = Field(..., ge=0.0, le=10.0, description="ST depression induced by exercise (oldpeak)")
    thalassemia: float = Field(..., ge=1, le=7, description="Thalassemia (3: Normal, 6: Fixed, 7: Reversible)")
    slope: Optional[float] = Field(2.0, ge=1, le=3, description="ST segment slope (1: Upsloping, 2: Flat, 3: Downsloping)")
    major_vessels: Optional[float] = Field(0.0, ge=0, le=4, description="Major vessels count colored by fluoroscopy (0-3)")
    model_name: Optional[str] = Field("xgboost", description="Selected supervised model")

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "CardioAI ML Inference Backend",
        "models_loaded": predictor is not None,
        "primary_model": predictor.primary_model_name if predictor else None,
        "disclaimer": "Educational/Research Prototype — Not a Medical Diagnosis"
    }

@app.post("/api/predict")
def predict_cardio_risk(patient: PatientInput):
    if predictor is None:
        raise HTTPException(status_code=503, detail="ML inference engine is not initialized. Please run training pipeline.")
        
    try:
        input_data = patient.model_dump()
        result = predictor.predict(input_data, requested_model=patient.model_name)
        return {
            "prediction": result["prediction"],
            "prediction_label": result["prediction_label"],
            "risk_level": result["risk_level"],
            "probability": result["probability"],
            "probability_pct": result["probability_pct"],
            "cluster": result["cluster"]["profile_name"],
            "cluster_profile": result["cluster"],
            "model_name": result["selected_model"],
            "shap_features": result["shap_explanation"]["top_features"],
            "shap_summary": result["shap_explanation"],
            "disclaimer": result["disclaimer"]
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")

@app.get("/api/models")
def get_available_models():
    metrics_path = os.path.join(ML_DIR, "models", "model_metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Model metrics file not found. Run evaluation script.")
        
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
        
    return {
        "best_model": metrics.get("best_model"),
        "selection_rationale": metrics.get("selection_rationale"),
        "models": metrics.get("models", [])
    }

@app.get("/api/metrics")
def get_model_metrics():
    metrics_path = os.path.join(ML_DIR, "models", "model_metrics.json")
    if not os.path.exists(metrics_path):
        raise HTTPException(status_code=404, detail="Model metrics not found.")
        
    with open(metrics_path, "r") as f:
        metrics = json.load(f)
    return metrics

@app.get("/api/clusters")
def get_cluster_profiles():
    clusters_path = os.path.join(ML_DIR, "models", "cluster_profiles.json")
    if not os.path.exists(clusters_path):
        raise HTTPException(status_code=404, detail="Cluster profiles not found.")
        
    with open(clusters_path, "r") as f:
        clusters = json.load(f)
    return clusters

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
