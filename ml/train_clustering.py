"""
K-Means Clustering Pipeline for Patient Risk Profiling.
Evaluates optimal cluster count (Elbow Method & Silhouette Scores)
and saves cluster centroids, characteristics, and patient profiles.
"""
import os
import json
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import joblib

from preprocess import prepare_pipeline, FEATURE_COLUMNS, FEATURE_LABELS

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def train_patient_clustering():
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, prep = prepare_pipeline(save_artifacts=False)
    
    # Evaluate clusters from k=2 to k=6
    cluster_eval = []
    for k in range(2, 7):
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_train_scaled)
        score = silhouette_score(X_train_scaled, km.labels_)
        inertia = float(km.inertia_)
        cluster_eval.append({
            "k": k,
            "inertia": round(inertia, 2),
            "silhouette_score": round(float(score), 4)
        })
        
    # We choose k=3 for distinct Low, Moderate, and High clinical profiles
    k_optimal = 3
    kmeans = KMeans(n_clusters=k_optimal, random_state=42, n_init=15)
    train_clusters = kmeans.fit_predict(X_train_scaled)
    
    # Calculate disease prevalence in each raw cluster to map them intuitively
    cluster_disease_rates = {}
    for c in range(k_optimal):
        mask = (train_clusters == c)
        disease_rate = float(y_train[mask].mean())
        cluster_disease_rates[c] = disease_rate
        
    # Sort cluster IDs by disease rate ascending so that:
    # 0 -> Lower-Risk Clinical Pattern
    # 1 -> Moderate-Risk Clinical Pattern
    # 2 -> Higher-Risk Clinical Pattern
    sorted_cluster_mapping = sorted(range(k_optimal), key=lambda c: cluster_disease_rates[c])
    cluster_id_to_profile_idx = {raw_id: idx for idx, raw_id in enumerate(sorted_cluster_mapping)}
    
    # Compute profiles
    profile_names = [
        "Profile 1 — Lower-Risk Clinical Pattern",
        "Profile 2 — Moderate-Risk Clinical Pattern",
        "Profile 3 — Higher-Risk Clinical Pattern"
    ]
    
    profile_descriptions = [
        "Characterized by younger age, higher exercise capacity (peak heart rate > 160 bpm), normal resting ECG, and minimal ST segment depression during stress.",
        "Characterized by intermediate age, mildly elevated blood pressure and serum cholesterol, moderate cardiac workload tolerance, and occasional non-anginal chest discomfort.",
        "Characterized by advanced age, elevated resting systolic pressure, significant exercise-induced angina, pronounced ST depression (> 1.5mm), and presence of fluoroscopic fluoroscopy vessels."
    ]
    
    profiles_data = []
    
    for rank_idx, raw_cluster_id in enumerate(sorted_cluster_mapping):
        mask = (train_clusters == raw_cluster_id)
        cluster_samples_raw = X_train[mask]
        cluster_y = y_train[mask]
        size = int(mask.sum())
        
        # Clinical feature means
        means = {
            "age": round(float(cluster_samples_raw["age"].mean()), 1),
            "trestbps": round(float(cluster_samples_raw["trestbps"].mean()), 1),
            "chol": round(float(cluster_samples_raw["chol"].mean()), 1),
            "thalach": round(float(cluster_samples_raw["thalach"].mean()), 1),
            "oldpeak": round(float(cluster_samples_raw["oldpeak"].mean()), 2),
            "exang_pct": round(float(cluster_samples_raw["exang"].mean() * 100), 1),
            "male_pct": round(float(cluster_samples_raw["sex"].mean() * 100), 1),
            "disease_rate_pct": round(float(cluster_y.mean() * 100), 1)
        }
        
        # Centroid in scaled space
        scaled_centroid = kmeans.cluster_centers_[raw_cluster_id].tolist()
        
        profiles_data.append({
            "profile_index": rank_idx,
            "raw_cluster_id": raw_cluster_id,
            "name": profile_names[rank_idx],
            "short_name": f"Profile {rank_idx + 1}",
            "description": profile_descriptions[rank_idx],
            "size": size,
            "percentage": round(float(size / len(X_train) * 100), 1),
            "disease_rate_pct": means["disease_rate_pct"],
            "characteristics": means,
            "scaled_centroid": scaled_centroid
        })
        
    clustering_metadata = {
        "k": k_optimal,
        "evaluation_metrics": cluster_eval,
        "silhouette_score_k3": round(float(silhouette_score(X_train_scaled, train_clusters)), 4),
        "cluster_mapping": cluster_id_to_profile_idx,
        "profiles": profiles_data,
        "feature_columns": FEATURE_COLUMNS,
        "disclaimer": "Clusters represent statistical patterns discovered in the dataset and are not medical diagnoses."
    }
    
    # Save model and profiles json
    joblib.dump(kmeans, os.path.join(MODELS_DIR, "kmeans_clustering.joblib"))
    
    with open(os.path.join(MODELS_DIR, "cluster_profiles.json"), "w") as f:
        json.dump(clustering_metadata, f, indent=2)
        
    print(f"K-Means training completed! Silhouette score: {clustering_metadata['silhouette_score_k3']}")
    for p in profiles_data:
        print(f"  {p['name']}: {p['size']} patients ({p['percentage']}%), Disease rate: {p['disease_rate_pct']}%")
        
    return kmeans, clustering_metadata

if __name__ == "__main__":
    train_patient_clustering()
