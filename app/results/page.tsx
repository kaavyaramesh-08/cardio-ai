"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PredictionResponse, PatientInput } from "@/lib/types";
import RiskCard from "@/components/RiskCard";
import PredictionCard from "@/components/PredictionCard";
import SHAPChart from "@/components/SHAPChart";
import ClusterCard from "@/components/ClusterCard";
import Disclaimer from "@/components/Disclaimer";
import {
  RotateCcw,
  BarChart2,
  Activity,
} from "lucide-react";

// Default benchmark sample if accessed directly without form submission
const DEFAULT_SAMPLE_RESULT: PredictionResponse = {
  prediction: 1,
  prediction_label: "Higher likelihood of cardiovascular disease",
  risk_level: "High",
  risk_badge: "Higher Risk",
  probability: 0.892,
  probability_pct: 89.2,
  selected_model: "XGBoost",
  cluster: {
    profile_index: 2,
    raw_cluster_id: 2,
    name: "Profile 3 — Higher-Risk Clinical Pattern",
    short_name: "Profile 3",
    description:
      "Characterized by advanced age, elevated resting systolic pressure, significant exercise-induced angina, pronounced ST depression (> 1.5mm), and presence of fluoroscopic vessels.",
    size: 87,
    percentage: 36.0,
    disease_rate_pct: 89.7,
    distance_to_center: 1.42,
    characteristics: {
      age: 58.4,
      trestbps: 134.8,
      chol: 253.2,
      thalach: 132.5,
      oldpeak: 1.76,
      exang_pct: 72.4,
      male_pct: 83.9,
      disease_rate_pct: 89.7,
    },
    disclaimer:
      "Clusters represent statistical patterns discovered in the dataset and are not medical diagnoses.",
  },
  shap_explanation: {
    base_value: 0.46,
    top_features: [
      {
        feature: "ca",
        label: "Major Vessels Count",
        raw_value: 2,
        shap_value: 1.224,
        abs_shap: 1.224,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "thal",
        label: "Thalassemia",
        raw_value: 7,
        shap_value: 0.97,
        abs_shap: 0.97,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "cp",
        label: "Chest Pain Type",
        raw_value: 4,
        shap_value: 0.823,
        abs_shap: 0.823,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "oldpeak",
        label: "ST Depression",
        raw_value: 2.6,
        shap_value: 0.672,
        abs_shap: 0.672,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "thalach",
        label: "Maximum Heart Rate",
        raw_value: 122,
        shap_value: 0.451,
        abs_shap: 0.451,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "exang",
        label: "Exercise-Induced Angina",
        raw_value: 1,
        shap_value: 0.395,
        abs_shap: 0.395,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "age",
        label: "Age",
        raw_value: 62,
        shap_value: 0.284,
        abs_shap: 0.284,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "trestbps",
        label: "Resting Blood Pressure",
        raw_value: 145,
        shap_value: 0.198,
        abs_shap: 0.198,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "chol",
        label: "Serum Cholesterol",
        raw_value: 275,
        shap_value: 0.124,
        abs_shap: 0.124,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
      {
        feature: "sex",
        label: "Sex",
        raw_value: 1,
        shap_value: 0.115,
        abs_shap: 0.115,
        direction: "increases_risk",
        impact: "Higher Risk",
      },
    ],
    positive_factors: [],
    negative_factors: [],
    disclaimer:
      "SHAP shows how individual features contributed to this model prediction. It explains model behavior and should not be interpreted as a medical diagnosis.",
  },
  disclaimer: "Educational/Research Prototype — Not a Medical Diagnosis",
};

export default function ResultsPage() {
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [inputData, setInputData] = useState<PatientInput | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResult = sessionStorage.getItem("cardio_last_result");
      const storedInput = sessionStorage.getItem("cardio_last_input");
      if (storedResult) {
        try {
          setResult(JSON.parse(storedResult));
        } catch {
          setResult(DEFAULT_SAMPLE_RESULT);
        }
      } else {
        setResult(DEFAULT_SAMPLE_RESULT);
      }

      if (storedInput) {
        try {
          setInputData(JSON.parse(storedInput));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  if (!result) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#718E7B]">
        Loading evaluation result...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
            <Activity className="w-4 h-4" />
            Decision-Support Assessment Output
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B]">
            Clinical Evaluation Results
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/assessment"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#1F3D2B] border border-[#D3E8DA] hover:bg-[#EAF6EE] transition-all"
          >
            <RotateCcw className="w-4 h-4 text-[#52796F]" />
            Test Another Patient
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-xs"
          >
            <BarChart2 className="w-4 h-4" />
            View Dashboard
          </Link>
        </div>
      </div>

      {/* 1. Primary Risk Card */}
      <RiskCard
        probability={result.probability}
        probabilityPct={result.probability_pct}
        riskLevel={result.risk_level}
        predictionLabel={result.prediction_label}
        selectedModel={result.selected_model}
      />

      {/* 2. Key Summary Tiles */}
      <PredictionCard result={result} />

      {/* 3. SHAP Explainability & Patient Profiling Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SHAP Chart (2 Columns wide) */}
        <div className="lg:col-span-2 space-y-4">
          <SHAPChart explanation={result.shap_explanation} />
        </div>

        {/* K-Means Assigned Cluster (1 Column wide) */}
        <div className="space-y-4">
          <ClusterCard cluster={result.cluster} />
        </div>
      </div>

      {/* 4. Input Biomarkers Recap */}
      {inputData && (
        <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-xs">
          <h3 className="text-base font-bold text-[#1F3D2B] mb-3">
            Evaluated Patient Clinical Biomarkers
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">Age</span>
              <span className="font-semibold text-[#1F3D2B]">{inputData.age} years</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">Sex</span>
              <span className="font-semibold text-[#1F3D2B]">
                {inputData.sex === 1 ? "Male" : "Female"}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">Resting BP</span>
              <span className="font-semibold text-[#1F3D2B]">{inputData.resting_bp} mm Hg</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">Cholesterol</span>
              <span className="font-semibold text-[#1F3D2B]">{inputData.cholesterol} mg/dl</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">Peak Heart Rate</span>
              <span className="font-semibold text-[#1F3D2B]">{inputData.max_heart_rate} bpm</span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#F7FBF8] border border-[#D3E8DA]">
              <span className="text-[#718E7B] block">ST Depression</span>
              <span className="font-semibold text-[#1F3D2B]">{inputData.st_depression} mm</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Comprehensive Disclaimer */}
      <Disclaimer customText="Educational/Research Prototype — Not a Medical Diagnosis. These machine learning inferences, K-Means cluster representations, and SHAP factor attributions are purely decision-support aids trained on the historical UCI Cleveland dataset and must not be used for direct patient diagnostic or pharmacological decisions." />
    </div>
  );
}
