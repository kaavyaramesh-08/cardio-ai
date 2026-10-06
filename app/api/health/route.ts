import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    framework: "CardioAI Next.js + Python ML Framework",
    dataset: "UCI Cleveland Heart Disease (303 records, 13 features)",
    models_available: [
      "Logistic Regression",
      "Support Vector Machine",
      "Decision Tree",
      "Random Forest",
      "XGBoost",
      "Deep Neural Network"
    ],
    selected_primary_model: "XGBoost",
    clustering: "K-Means (k=3 Clinical Profiles)",
    explainability: "SHAP (TreeExplainer)",
    disclaimer: "Educational/Research Prototype — Not a Medical Diagnosis"
  });
}
