"""
Data downloader and cleaner for UCI Cleveland Heart Disease Dataset.
"""
import os
import urllib.request
import pandas as pd
import numpy as np
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
CSV_PATH = os.path.join(DATA_DIR, "heart.csv")
INFO_PATH = os.path.join(DATA_DIR, "dataset_metadata.json")

# Primary and fallback URLs
UCI_URL = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"
KAGGLE_CLEAN_URL = "https://raw.githubusercontent.com/ammarr1/Heart-Disease-UCI/master/heart.csv"

COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", 
    "restecg", "thalach", "exang", "oldpeak", "slope", 
    "ca", "thal", "target"
]

def download_and_prepare_dataset():
    os.makedirs(DATA_DIR, exist_ok=True)
    df = None
    
    print("Attempting to download Cleveland Heart Disease dataset from UCI...")
    try:
        df = pd.read_csv(UCI_URL, header=None, names=COLUMNS, na_values="?")
        print(f"Downloaded from UCI: shape {df.shape}")
    except Exception as e:
        print(f"Failed from UCI ({e}), trying GitHub mirror...")
        try:
            df = pd.read_csv(KAGGLE_CLEAN_URL)
            print(f"Downloaded from mirror: shape {df.shape}")
        except Exception as e2:
            print(f"Failed from mirror ({e2})")
            raise RuntimeError("Could not download UCI Cleveland dataset")

    # Clean missing values
    missing_before = int(df.isna().sum().sum())
    
    # Impute missing values: median for numerical, mode for categorical
    for col in df.columns:
        if df[col].isna().sum() > 0:
            if df[col].dtype in [np.float64, np.int64]:
                df[col] = df[col].fillna(df[col].median())
            else:
                df[col] = df[col].fillna(df[col].mode()[0])
                
    missing_after = int(df.isna().sum().sum())
    
    # Binarize target: 0 = No heart disease, 1 = Heart disease present (>0)
    df["target"] = (df["target"] > 0).astype(int)
    
    # Save clean dataset
    df.to_csv(CSV_PATH, index=False)
    print(f"Saved clean dataset to {CSV_PATH}")
    
    # Dataset statistics
    metadata = {
        "dataset_name": "UCI Cleveland Heart Disease",
        "num_samples": int(len(df)),
        "num_features": 13,
        "target_column": "target",
        "class_distribution": {
            "no_disease": int((df["target"] == 0).sum()),
            "disease": int((df["target"] == 1).sum()),
            "disease_prevalence_pct": round(float((df["target"] == 1).mean() * 100), 2)
        },
        "missing_values_handled": missing_before,
        "features": {
            "age": {"type": "numerical", "unit": "years", "range": [int(df["age"].min()), int(df["age"].max())], "mean": round(float(df["age"].mean()), 1)},
            "sex": {"type": "categorical", "values": {"0": "Female", "1": "Male"}},
            "cp": {"type": "categorical", "values": {"1": "Typical Angina", "2": "Atypical Angina", "3": "Non-anginal Pain", "4": "Asymptomatic"}},
            "trestbps": {"type": "numerical", "unit": "mm Hg", "range": [int(df["trestbps"].min()), int(df["trestbps"].max())], "mean": round(float(df["trestbps"].mean()), 1)},
            "chol": {"type": "numerical", "unit": "mg/dl", "range": [int(df["chol"].min()), int(df["chol"].max())], "mean": round(float(df["chol"].mean()), 1)},
            "fbs": {"type": "categorical", "values": {"0": "<= 120 mg/dl", "1": "> 120 mg/dl"}},
            "restecg": {"type": "categorical", "values": {"0": "Normal", "1": "ST-T Wave Abnormality", "2": "Left Ventricular Hypertrophy"}},
            "thalach": {"type": "numerical", "unit": "bpm", "range": [int(df["thalach"].min()), int(df["thalach"].max())], "mean": round(float(df["thalach"].mean()), 1)},
            "exang": {"type": "categorical", "values": {"0": "No", "1": "Yes"}},
            "oldpeak": {"type": "numerical", "unit": "depression", "range": [float(df["oldpeak"].min()), float(df["oldpeak"].max())], "mean": round(float(df["oldpeak"].mean()), 2)},
            "slope": {"type": "categorical", "values": {"1": "Upsloping", "2": "Flat", "3": "Downsloping"}},
            "ca": {"type": "numerical", "unit": "vessels", "range": [int(df["ca"].min()), int(df["ca"].max())]},
            "thal": {"type": "categorical", "values": {"3": "Normal", "6": "Fixed Defect", "7": "Reversible Defect"}}
        }
    }
    
    with open(INFO_PATH, "w") as f:
        json.dump(metadata, f, indent=2)
        
    print(f"Saved dataset metadata to {INFO_PATH}")
    return df

if __name__ == "__main__":
    download_and_prepare_dataset()
