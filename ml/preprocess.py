"""
Preprocessing pipeline for Cardiovascular Disease Dataset.
Handles data loading, feature scaling, train/test splitting, and serialization.
"""
import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import json

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "heart.csv")
MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

FEATURE_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", 
    "restecg", "thalach", "exang", "oldpeak", "slope", 
    "ca", "thal"
]

NUMERICAL_COLS = ["age", "trestbps", "chol", "thalach", "oldpeak", "ca"]
CATEGORICAL_COLS = ["sex", "cp", "fbs", "restecg", "exang", "slope", "thal"]

# Human-readable label map
FEATURE_LABELS = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest Pain Type",
    "trestbps": "Resting Blood Pressure",
    "chol": "Serum Cholesterol",
    "fbs": "Fasting Blood Sugar",
    "restecg": "Resting ECG",
    "thalach": "Maximum Heart Rate",
    "exang": "Exercise-Induced Angina",
    "oldpeak": "ST Depression",
    "slope": "ST Segment Slope",
    "ca": "Major Vessels Count",
    "thal": "Thalassemia"
}

def load_data():
    if not os.path.exists(DATA_PATH):
        from download_data import download_and_prepare_dataset
        return download_and_prepare_dataset()
    return pd.read_csv(DATA_PATH)

def prepare_pipeline(save_artifacts=True):
    os.makedirs(MODELS_DIR, exist_ok=True)
    df = load_data()
    
    X = df[FEATURE_COLUMNS].copy()
    y = df["target"].copy()
    
    # Stratified 80/20 train-test split with reproducible seed
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Fit StandardScaler on training features
    scaler = StandardScaler()
    X_train_scaled = pd.DataFrame(
        scaler.fit_transform(X_train),
        columns=FEATURE_COLUMNS,
        index=X_train.index
    )
    X_test_scaled = pd.DataFrame(
        scaler.transform(X_test),
        columns=FEATURE_COLUMNS,
        index=X_test.index
    )
    
    preprocessor = {
        "scaler": scaler,
        "feature_columns": FEATURE_COLUMNS,
        "numerical_cols": NUMERICAL_COLS,
        "categorical_cols": CATEGORICAL_COLS,
        "means": {col: float(scaler.mean_[i]) for i, col in enumerate(FEATURE_COLUMNS)},
        "scales": {col: float(scaler.scale_[i]) for i, col in enumerate(FEATURE_COLUMNS)},
        "feature_labels": FEATURE_LABELS
    }
    
    if save_artifacts:
        joblib.dump(preprocessor, os.path.join(MODELS_DIR, "preprocessor.joblib"))
        
        # Save JSON metadata for lightweight web inference
        preprocessor_json = {
            "feature_columns": FEATURE_COLUMNS,
            "means": {col: round(float(scaler.mean_[i]), 4) for i, col in enumerate(FEATURE_COLUMNS)},
            "scales": {col: round(float(scaler.scale_[i]), 4) for i, col in enumerate(FEATURE_COLUMNS)},
            "feature_labels": FEATURE_LABELS,
            "train_size": len(X_train),
            "test_size": len(X_test),
            "positive_train_ratio": round(float(y_train.mean()), 4)
        }
        with open(os.path.join(MODELS_DIR, "preprocessor_meta.json"), "w") as f:
            json.dump(preprocessor_json, f, indent=2)
            
        print("Preprocessor saved successfully to ml/models/preprocessor.joblib")
        
    return X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, preprocessor

if __name__ == "__main__":
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, prep = prepare_pipeline()
    print(f"X_train shape: {X_train.shape}, X_test shape: {X_test.shape}")
    print(f"y_train disease count: {y_train.sum()} / {len(y_train)}")
    print(f"y_test disease count: {y_test.sum()} / {len(y_test)}")
