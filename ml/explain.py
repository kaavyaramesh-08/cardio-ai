"""
Explainable AI (XAI) using SHAP (SHapley Additive exPlanations).
Explains XGBoost / Random Forest predictions with exact local and global feature attribution.
"""
import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
import shap

# Ensure current directory is in path
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
if CURRENT_DIR not in sys.path:
    sys.path.append(CURRENT_DIR)

from preprocess import FEATURE_COLUMNS, FEATURE_LABELS, prepare_pipeline

MODELS_DIR = os.path.join(CURRENT_DIR, "models")

class CardioSHAPExplainer:
    def __init__(self, model_name="xgboost"):
        self.model_name = model_name
        model_path = os.path.join(MODELS_DIR, f"{model_name}.joblib")
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found.")
        self.model = joblib.load(model_path)
        self.explainer = shap.TreeExplainer(self.model)
        
    def explain(self, scaled_features_df, raw_features_df=None):
        """
        Computes SHAP values for a single sample or batch.
        scaled_features_df: DataFrame with FEATURE_COLUMNS in scaled format.
        raw_features_df: Optional DataFrame with raw user inputs for readable values.
        """
        shap_values = self.explainer.shap_values(scaled_features_df)
        
        # If batch with 1 row
        if len(shap_values.shape) == 2:
            row_shap = shap_values[0]
        else:
            row_shap = shap_values
            
        base_val = float(self.explainer.expected_value)
        if isinstance(base_val, np.ndarray):
            base_val = float(base_val[0])
            
        contributions = []
        for i, col in enumerate(FEATURE_COLUMNS):
            sv = float(row_shap[i])
            raw_val = float(raw_features_df[col].iloc[0]) if raw_features_df is not None else float(scaled_features_df[col].iloc[0])
            
            contributions.append({
                "feature": col,
                "label": FEATURE_LABELS.get(col, col),
                "raw_value": round(raw_val, 2),
                "shap_value": round(sv, 4),
                "abs_shap": round(abs(sv), 4),
                "direction": "increases_risk" if sv > 0 else "decreases_risk",
                "impact": "Higher Risk" if sv > 0 else "Lower Risk"
            })
            
        # Sort by absolute SHAP impact
        contributions.sort(key=lambda x: x["abs_shap"], reverse=True)
        
        pos_factors = [c for c in contributions if c["shap_value"] > 0]
        neg_factors = [c for c in contributions if c["shap_value"] < 0]
        
        return {
            "base_value": round(base_val, 4),
            "top_features": contributions,
            "positive_factors": pos_factors,
            "negative_factors": neg_factors,
            "summary": [
                f"{c['label']} ({'+' if c['shap_value'] > 0 else ''}{c['shap_value']})"
                for c in contributions[:5]
            ],
            "disclaimer": "SHAP shows how individual features contributed to this model prediction. It explains model behavior and should not be interpreted as a medical diagnosis."
        }

def compute_global_shap_summary():
    """Calculates global mean absolute SHAP values across training set for dashboard."""
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, prep = prepare_pipeline(save_artifacts=False)
    
    explainer = CardioSHAPExplainer("xgboost")
    all_shap = explainer.explainer.shap_values(X_train_scaled)
    
    mean_abs_shap = np.mean(np.abs(all_shap), axis=0)
    
    global_importance = []
    for i, col in enumerate(FEATURE_COLUMNS):
        global_importance.append({
            "feature": col,
            "label": FEATURE_LABELS.get(col, col),
            "importance": round(float(mean_abs_shap[i]), 4)
        })
        
    global_importance.sort(key=lambda x: x["importance"], reverse=True)
    
    summary_data = {
        "model_used": "XGBoost",
        "global_importance": global_importance,
        "base_value": round(float(explainer.explainer.expected_value), 4)
    }
    
    with open(os.path.join(MODELS_DIR, "shap_summary.json"), "w") as f:
        json.dump(summary_data, f, indent=2)
        
    print("Saved global SHAP summary to ml/models/shap_summary.json")
    for g in global_importance[:5]:
        print(f"  {g['label']}: importance {g['importance']}")
        
    return summary_data

if __name__ == "__main__":
    compute_global_shap_summary()
