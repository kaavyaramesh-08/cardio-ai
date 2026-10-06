"""
Supervised Model Training Pipeline.
Trains 6 distinct algorithms:
1. Logistic Regression
2. Support Vector Machine (SVM)
3. Decision Tree
4. Random Forest
5. XGBoost
6. Deep Neural Network (MLP)
"""
import os
import joblib
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from xgboost import XGBClassifier

from preprocess import prepare_pipeline

MODELS_DIR = os.path.join(os.path.dirname(__file__), "models")

def train_supervised_models():
    os.makedirs(MODELS_DIR, exist_ok=True)
    X_train, X_test, y_train, y_test, X_train_scaled, X_test_scaled, prep = prepare_pipeline(save_artifacts=True)
    
    models = {
        "Logistic Regression": LogisticRegression(
            C=1.0, 
            penalty="l2", 
            solver="liblinear", 
            random_state=42
        ),
        "Support Vector Machine": SVC(
            C=1.0, 
            kernel="rbf", 
            probability=True, 
            random_state=42
        ),
        "Decision Tree": DecisionTreeClassifier(
            max_depth=4, 
            min_samples_split=5, 
            random_state=42
        ),
        "Random Forest": RandomForestClassifier(
            n_estimators=120, 
            max_depth=5, 
            min_samples_split=4, 
            random_state=42
        ),
        "XGBoost": XGBClassifier(
            n_estimators=100, 
            max_depth=4, 
            learning_rate=0.08, 
            subsample=0.8,
            random_state=42, 
            eval_metric="logloss"
        ),
        "Deep Neural Network": MLPClassifier(
            hidden_layer_sizes=(64, 32), 
            activation="relu", 
            max_iter=600, 
            alpha=0.005,
            random_state=42
        )
    }
    
    trained_models = {}
    
    print("Beginning supervised model training...")
    for name, model in models.items():
        print(f"Training {name}...")
        model.fit(X_train_scaled, y_train)
        
        # Save model to disk
        filename = name.lower().replace(" ", "_") + ".joblib"
        save_path = os.path.join(MODELS_DIR, filename)
        joblib.dump(model, save_path)
        trained_models[name] = model
        print(f"  Saved {name} -> {filename}")
        
    print("All 6 supervised models successfully trained and serialized.")
    return trained_models

if __name__ == "__main__":
    train_supervised_models()
