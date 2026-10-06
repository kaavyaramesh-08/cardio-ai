"""
Orchestration Script: Trains the complete CardioAI Machine Learning Pipeline.
Executes data collection, preprocessing, clustering, supervised training,
evaluation, SHAP attribution, and web asset compilation.
"""
import os
import sys
import time

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ML_DIR = os.path.join(BASE_DIR, "ml")
if ML_DIR not in sys.path:
    sys.path.append(ML_DIR)

from download_data import download_and_prepare_dataset
from preprocess import prepare_pipeline
from train_clustering import train_patient_clustering
from train_models import train_supervised_models
from evaluate_models import evaluate_all_models
from explain import compute_global_shap_summary
from export_model_assets import export_assets

def run_full_pipeline():
    print("=" * 65)
    print("CARDIOAI: FULL MACHINE LEARNING PIPELINE TRAINING")
    print("=" * 65)
    start_time = time.time()
    
    print("\n[Step 1/7] Downloading and verifying UCI Cleveland Heart Disease dataset...")
    df = download_and_prepare_dataset()
    print(f"-> Dataset ready with {len(df)} samples and 13 clinical features.")
    
    print("\n[Step 2/7] Preprocessing, stratified 80/20 split, and feature scaling...")
    X_train, X_test, y_train, y_test, X_train_s, X_test_s, prep = prepare_pipeline(save_artifacts=True)
    print(f"-> Train samples: {len(X_train)}, Test samples: {len(X_test)}.")
    
    print("\n[Step 3/7] Training K-Means Unsupervised Patient Profiling (k=3)...")
    km, cluster_info = train_patient_clustering()
    print(f"-> Silhouette score: {cluster_info['silhouette_score_k3']}. 3 distinct clinical profiles generated.")
    
    print("\n[Step 4/7] Training 6 Supervised Classification Models...")
    models = train_supervised_models()
    print("-> Trained: Logistic Regression, SVM, Decision Tree, Random Forest, XGBoost, Deep Neural Network.")
    
    print("\n[Step 5/7] Evaluating Hold-Out Performance (Recall, ROC-AUC, F1, Accuracy)...")
    metrics = evaluate_all_models()
    print(f"-> Primary Selected Model: {metrics['best_model']}.")
    
    print("\n[Step 6/7] Computing Global SHAP Feature Importances...")
    shap_summary = compute_global_shap_summary()
    print("-> Top features computed via TreeExplainer.")
    
    print("\n[Step 7/7] Exporting Model Parameters & Assets for Web Inference...")
    export_assets()
    
    elapsed = round(time.time() - start_time, 2)
    print("\n" + "=" * 65)
    print(f"TRAINING COMPLETE IN {elapsed}s!")
    print("All models serialized in ml/models/ and web assets updated in lib/ml-data/")
    print("=" * 65)

if __name__ == "__main__":
    run_full_pipeline()
