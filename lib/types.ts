export interface PatientInput {
  age: number;
  sex: number; // 0 = Female, 1 = Male
  chest_pain: number; // 1: Typical Angina, 2: Atypical Angina, 3: Non-anginal, 4: Asymptomatic
  resting_bp: number; // mm Hg
  cholesterol: number; // mg/dl
  fasting_blood_sugar: number; // 0 = <=120, 1 = >120
  resting_ecg: number; // 0 = Normal, 1 = ST-T wave, 2 = LVH
  max_heart_rate: number; // bpm
  exercise_angina: number; // 0 = No, 1 = Yes
  st_depression: number; // ST depression
  thalassemia: number; // 3 = Normal, 6 = Fixed, 7 = Reversible
  slope?: number; // 1: Upsloping, 2: Flat, 3: Downsloping
  major_vessels?: number; // 0 - 3
  model_name?: string;
}

export interface SHAPFeature {
  feature: string;
  label: string;
  raw_value: number;
  shap_value: number;
  abs_shap: number;
  direction: "increases_risk" | "decreases_risk";
  impact: string;
}

export interface SHAPExplanation {
  base_value: number;
  top_features: SHAPFeature[];
  positive_factors: SHAPFeature[];
  negative_factors: SHAPFeature[];
  summary?: string[];
  disclaimer: string;
}

export interface ClusterCharacteristics {
  age: number;
  trestbps: number;
  chol: number;
  thalach: number;
  oldpeak: number;
  exang_pct: number;
  male_pct: number;
  disease_rate_pct: number;
}

export interface ClusterProfile {
  profile_index: number;
  raw_cluster_id: number;
  name: string;
  short_name: string;
  description: string;
  size: number;
  percentage: number;
  disease_rate_pct: number;
  characteristics: ClusterCharacteristics;
  distance_to_center?: number;
  disclaimer?: string;
}

export interface PredictionResponse {
  prediction: number;
  prediction_label: string;
  risk_level: "Low" | "Moderate" | "High";
  risk_badge: string;
  probability: number;
  probability_pct: number;
  selected_model: string;
  cluster: ClusterProfile;
  shap_explanation: SHAPExplanation;
  disclaimer: string;
  input_echo?: PatientInput;
}

export interface ModelMetric {
  model_name: string;
  filename: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  roc_auc: number;
  clinical_score: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  roc_points: { fpr: number; tpr: number }[];
}

export interface ModelEvaluationData {
  evaluation_timestamp: string;
  test_sample_count: number;
  test_positive_count: number;
  test_negative_count: number;
  best_model: string;
  selection_rationale: string;
  models: ModelMetric[];
}
