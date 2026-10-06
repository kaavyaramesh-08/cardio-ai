"""
Export model parameters, coefficients, centroids, and evaluation metrics
to frontend JSON assets for resilient serverless and client-side execution.
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd

CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)

from preprocess import FEATURE_COLUMNS, FEATURE_LABELS

MODELS_DIR = os.path.join(CURRENT_DIR, "models")
LIB_DATA_DIR = os.path.join(CURRENT_DIR, "..", "lib", "ml-data")

def export_assets():
    os.makedirs(LIB_DATA_DIR, exist_ok=True)
    
    # 1. Preprocessor info
    prep = joblib.load(os.path.join(MODELS_DIR, "preprocessor.joblib"))
    scaler = prep["scaler"]
    
    scaler_info = {
        "features": FEATURE_COLUMNS,
        "labels": FEATURE_LABELS,
        "means": [round(float(m), 6) for m in scaler.mean_],
        "scales": [round(float(s), 6) for s in scaler.scale_]
    }
    
    # 2. Logistic Regression weights
    lr_model = joblib.load(os.path.join(MODELS_DIR, "logistic_regression.joblib"))
    lr_weights = {
        "intercept": round(float(lr_model.intercept_[0]), 6),
        "coefficients": [round(float(c), 6) for c in lr_model.coef_[0]]
    }
    
    # 3. Random Forest and XGBoost feature importances
    rf_model = joblib.load(os.path.join(MODELS_DIR, "random_forest.joblib"))
    xgb_model = joblib.load(os.path.join(MODELS_DIR, "xgboost.joblib"))
    dt_model = joblib.load(os.path.join(MODELS_DIR, "decision_tree.joblib"))
    
    feature_importances = {
        "random_forest": [round(float(fi), 6) for fi in rf_model.feature_importances_],
        "xgboost": [round(float(fi), 6) for fi in xgb_model.feature_importances_],
        "decision_tree": [round(float(fi), 6) for fi in dt_model.feature_importances_]
    }
    
    # 4. K-Means Clustering Centroids & Profiles
    with open(os.path.join(MODELS_DIR, "cluster_profiles.json"), "r") as f:
        clustering_info = json.load(f)
        
    # 5. Model Evaluation Metrics
    with open(os.path.join(MODELS_DIR, "model_metrics.json"), "r") as f:
        metrics_info = json.load(f)
        
    # 6. Global SHAP Summary
    with open(os.path.join(MODELS_DIR, "shap_summary.json"), "r") as f:
        shap_summary = json.load(f)
        
    # 7. Dataset Metadata
    with open(os.path.join(CURRENT_DIR, "data", "dataset_metadata.json"), "r") as f:
        dataset_meta = json.load(f)
        
    # Combined package
    export_bundle = {
        "scaler": scaler_info,
        "logistic_regression": lr_weights,
        "feature_importances": feature_importances,
        "clustering": clustering_info,
        "metrics": metrics_info,
        "shap_summary": shap_summary,
        "dataset_meta": dataset_meta,
        "export_timestamp": pd.Timestamp.now().isoformat()
    }
    
    bundle_path = os.path.join(LIB_DATA_DIR, "ml_bundle.json")
    with open(bundle_path, "w") as f:
        json.dump(export_bundle, f, indent=2)
        
    print(f"Exported complete ML parameters and metrics bundle to: {bundle_path}")
    return export_bundle

if __name__ == "__main__":
    export_assets()
