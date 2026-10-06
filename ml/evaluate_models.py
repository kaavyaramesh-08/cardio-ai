"""
Comprehensive Model Evaluation Module.
Calculates Accuracy, Precision, Recall, F1 Score, and ROC-AUC on hold-out test set.
Ranks models with emphasis on clinical Recall and ROC-AUC to prevent false negatives.
"""
import os
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score, 
    roc_auc_score, roc_curve, confusion_matrix
)

from preprocess import prepare_pipeline

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

MODEL_NAMES = [
    "Logistic Regression",
    "Support Vector Machine",
    "Decision Tree",
    "Random Forest",
    "XGBoost",
    "Deep Neural Network"
]

def evaluate_all_models():
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, prep = prepare_pipeline(save_artifacts=False)
    
    evaluation_results = []
    
    for name in MODEL_NAMES:
        filename = name.lower().replace(" ", "_") + ".joblib"
        model_path = os.path.join(MODELS_DIR, filename)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file {model_path} not found. Run train_models.py first.")
            
        model = joblib.load(model_path)
        
        # Predictions & probabilities
        y_pred = model.predict(X_test_scaled)
        if hasattr(model, "predict_proba"):
            y_proba = model.predict_proba(X_test_scaled)[:, 1]
        elif hasattr(model, "decision_function"):
            decision = model.decision_function(X_test_scaled)
            y_proba = 1 / (1 + np.exp(-decision))
        else:
            y_proba = y_pred.astype(float)
            
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        roc_auc = float(roc_auc_score(y_test, y_proba))
        
        # Confusion matrix
        cm = confusion_matrix(y_test, y_pred).tolist() # [[TN, FP], [FN, TP]]
        
        # ROC Curve sample points
        fpr, tpr, _ = roc_curve(y_test, y_proba)
        # Sample ~10 points for clean rendering in JSON
        indices = np.linspace(0, len(fpr) - 1, min(10, len(fpr))).astype(int)
        roc_points = [{"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)} for i in indices]
        
        # Clinical composite score: Weighted toward Recall (0.4), ROC-AUC (0.3), F1 (0.2), Accuracy (0.1)
        # False negatives in cardiovascular detection can be life-threatening!
        clinical_score = (0.40 * rec) + (0.30 * roc_auc) + (0.20 * f1) + (0.10 * acc)
        
        evaluation_results.append({
            "model_name": name,
            "filename": filename,
            "accuracy": round(acc, 4),
            "precision": round(prec, 4),
            "recall": round(rec, 4),
            "f1_score": round(f1, 4),
            "roc_auc": round(roc_auc, 4),
            "clinical_score": round(clinical_score, 4),
            "confusion_matrix": {
                "tn": cm[0][0],
                "fp": cm[0][1],
                "fn": cm[1][0],
                "tp": cm[1][1]
            },
            "roc_points": roc_points
        })
        
    # Sort models by clinical composite score
    evaluation_results.sort(key=lambda m: m["clinical_score"], reverse=True)
    
    best_model_info = evaluation_results[0]
    
    output_data = {
        "evaluation_timestamp": pd.Timestamp.now().isoformat(),
        "test_sample_count": len(y_test),
        "test_positive_count": int(y_test.sum()),
        "test_negative_count": int((y_test == 0).sum()),
        "best_model": best_model_info["model_name"],
        "selection_rationale": (
            f"{best_model_info['model_name']} was selected as the primary clinical model because it achieved "
            f"an optimal balance of Recall ({round(best_model_info['recall'] * 100, 1)}%) to minimize life-threatening false negatives, "
            f"a superior ROC-AUC of {round(best_model_info['roc_auc'], 3)}, and an F1 score of {round(best_model_info['f1_score'], 3)}. "
            f"In cardiovascular clinical screening, minimizing undetected pathology takes precedence over naive accuracy alone."
        ),
        "models": evaluation_results
    }
    
    # Save metrics JSON
    with open(os.path.join(MODELS_DIR, "model_metrics.json"), "w") as f:
        json.dump(output_data, f, indent=2)
        
    print("\n--- MODEL PERFORMANCE EVALUATION (TEST SET) ---")
    print(f"{'Model':<25} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1':<10} {'ROC-AUC':<10}")
    print("-" * 75)
    for res in evaluation_results:
        print(f"{res['model_name']:<25} {res['accuracy']:<10.4f} {res['precision']:<10.4f} {res['recall']:<10.4f} {res['f1_score']:<10.4f} {res['roc_auc']:<10.4f}")
        
    print(f"\nBest Selected Model: {best_model_info['model_name']}")
    print(f"Selection Rationale: {output_data['selection_rationale']}")
    return output_data

if __name__ == "__main__":
    evaluate_all_models()
