"""
Unified Prediction, Profiling, and Explainability Engine.
Takes raw clinical inputs, runs preprocessing, executes supervised model inference,
assigns K-Means patient cluster profile, and generates SHAP local explanations.
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
from explain import CardioSHAPExplainer

MODELS_DIR = os.path.join(CURRENT_DIR, "models")

class CardioPredictor:
    def __init__(self, primary_model="xgboost"):
        self.primary_model_name = primary_model
        self.preprocessor = joblib.load(os.path.join(MODELS_DIR, "preprocessor.joblib"))
        self.scaler = self.preprocessor["scaler"]
        
        # Load supervised models
        self.models = {}
        for m_name in ["xgboost", "random_forest", "logistic_regression", "support_vector_machine", "decision_tree", "deep_neural_network"]:
            p = os.path.join(MODELS_DIR, f"{m_name}.joblib")
            if os.path.exists(p):
                self.models[m_name] = joblib.load(p)
                
        # Load clustering
        self.kmeans = joblib.load(os.path.join(MODELS_DIR, "kmeans_clustering.joblib"))
        with open(os.path.join(MODELS_DIR, "cluster_profiles.json"), "r") as f:
            self.cluster_meta = json.load(f)
            
        # Explainer
        self.explainer = CardioSHAPExplainer(self.primary_model_name)
        
    def _normalize_input_dict(self, input_dict):
        """Standardizes input keys from form submissions."""
        # Map alternate keys
        key_map = {
            "chest_pain": "cp",
            "chest_pain_type": "cp",
            "resting_bp": "trestbps",
            "blood_pressure": "trestbps",
            "cholesterol": "chol",
            "fasting_blood_sugar": "fbs",
            "resting_ecg": "restecg",
            "max_heart_rate": "thalach",
            "heart_rate": "thalach",
            "exercise_angina": "exang",
            "st_depression": "oldpeak",
            "major_vessels": "ca",
            "thalassemia": "thal"
        }
        
        normalized = {}
        for k, v in input_dict.items():
            mapped_k = key_map.get(k.lower(), k.lower())
            try:
                normalized[mapped_k] = float(v)
            except (ValueError, TypeError):
                normalized[mapped_k] = 0.0
                
        # Fill missing with standard defaults
        defaults = {
            "age": 54.0,
            "sex": 1.0,
            "cp": 2.0,
            "trestbps": 130.0,
            "chol": 240.0,
            "fbs": 0.0,
            "restecg": 0.0,
            "thalach": 150.0,
            "exang": 0.0,
            "oldpeak": 0.0,
            "slope": 2.0,
            "ca": 0.0,
            "thal": 3.0
        }
        
        for feat in FEATURE_COLUMNS:
            if feat not in normalized:
                normalized[feat] = defaults.get(feat, 0.0)
                
        # Ensure ordering
        raw_df = pd.DataFrame([{col: normalized[col] for col in FEATURE_COLUMNS}])
        return raw_df
        
    def predict(self, input_data, requested_model=None):
        raw_df = self._normalize_input_dict(input_data)
        
        # Scale features using training scaler
        scaled_array = self.scaler.transform(raw_df)
        scaled_df = pd.DataFrame(scaled_array, columns=FEATURE_COLUMNS)
        
        # Model selection
        model_key = (requested_model or self.primary_model_name).lower().replace(" ", "_")
        model = self.models.get(model_key, self.models.get("xgboost"))
        
        # Supervised prediction
        if hasattr(model, "predict_proba"):
            probs = model.predict_proba(scaled_df)[0]
            prob_disease = float(probs[1])
        elif hasattr(model, "decision_function"):
            decision = float(model.decision_function(scaled_df)[0])
            prob_disease = 1 / (1 + np.exp(-decision))
        else:
            prob_disease = float(model.predict(scaled_df)[0])
            
        pred_binary = int(prob_disease >= 0.5)
        
        # Risk indicator
        if prob_disease < 0.35:
            risk_level = "Low"
            risk_badge = "Lower Risk"
        elif prob_disease < 0.65:
            risk_level = "Moderate"
            risk_badge = "Moderate Risk"
        else:
            risk_level = "High"
            risk_badge = "Higher Risk"
            
        prediction_label = "Higher likelihood of cardiovascular disease" if pred_binary == 1 else "Lower likelihood of cardiovascular disease"
        
        # K-Means clustering assignment
        raw_cluster_id = int(self.kmeans.predict(scaled_df)[0])
        cluster_center = self.kmeans.cluster_centers_[raw_cluster_id]
        dist_to_center = float(np.linalg.norm(scaled_df.iloc[0].values - cluster_center))
        
        # Match profile mapping
        profile_idx = self.cluster_meta["cluster_mapping"].get(str(raw_cluster_id), raw_cluster_id)
        profile_data = next((p for p in self.cluster_meta["profiles"] if p["profile_index"] == profile_idx), self.cluster_meta["profiles"][0])
        
        # SHAP Explainability
        try:
            shap_result = self.explainer.explain(scaled_df, raw_df)
        except Exception as e:
            shap_result = {
                "base_value": 0.5,
                "top_features": [],
                "positive_factors": [],
                "negative_factors": [],
                "error": str(e),
                "disclaimer": "SHAP explanation calculation encountered an issue."
            }
            
        model_display_names = {
            "xgboost": "XGBoost",
            "random_forest": "Random Forest",
            "logistic_regression": "Logistic Regression",
            "support_vector_machine": "Support Vector Machine",
            "decision_tree": "Decision Tree",
            "deep_neural_network": "Deep Neural Network"
        }
        
        return {
            "prediction": pred_binary,
            "prediction_label": prediction_label,
            "risk_level": risk_level,
            "risk_badge": risk_badge,
            "probability": round(prob_disease, 4),
            "probability_pct": round(prob_disease * 100, 1),
            "selected_model": model_display_names.get(model_key, model_key),
            "cluster": {
                "raw_cluster_id": raw_cluster_id,
                "profile_index": profile_idx,
                "profile_name": profile_data["name"],
                "short_name": profile_data["short_name"],
                "description": profile_data["description"],
                "distance_to_center": round(dist_to_center, 3),
                "disease_rate_pct": profile_data["disease_rate_pct"],
                "characteristics": profile_data["characteristics"],
                "disclaimer": "Clusters represent statistical patterns discovered in the dataset and are not medical diagnoses."
            },
            "shap_explanation": shap_result,
            "disclaimer": "Educational/Research Prototype — Not a Medical Diagnosis"
        }

if __name__ == "__main__":
    predictor = CardioPredictor()
    sample_input = {
        "age": 62,
        "sex": 1,
        "cp": 4, # Asymptomatic
        "trestbps": 140,
        "chol": 268,
        "fbs": 0,
        "restecg": 2,
        "thalach": 120,
        "exang": 1,
        "oldpeak": 2.6,
        "slope": 2,
        "ca": 2,
        "thal": 7
    }
    res = predictor.predict(sample_input)
    print("--- INFERENCE TEST ---")
    print(f"Prediction: {res['prediction_label']} ({res['probability_pct']}%)")
    print(f"Risk Level: {res['risk_level']}")
    print(f"Assigned Cluster: {res['cluster']['profile_name']}")
    print("Top Contributing Factors:")
    for f in res["shap_explanation"]["top_features"][:4]:
        print(f"  {f['label']}: SHAP={f['shap_value']} ({f['impact']})")
