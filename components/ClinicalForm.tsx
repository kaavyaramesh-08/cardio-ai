"use client";

import { useState } from "react";
import { PatientInput } from "@/lib/types";
import {
  Sparkles,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

interface ClinicalFormProps {
  onSubmit: (input: PatientInput) => Promise<void>;
  isLoading: boolean;
}

const SAMPLE_PROFILES: { label: string; desc: string; data: PatientInput }[] = [
  {
    label: "Case A: Higher-Risk Presentation",
    desc: "62yo Male, Asymptomatic pain, ST depression 2.6, Low exercise capacity",
    data: {
      age: 62,
      sex: 1,
      chest_pain: 4,
      resting_bp: 145,
      cholesterol: 275,
      fasting_blood_sugar: 0,
      resting_ecg: 2,
      max_heart_rate: 122,
      exercise_angina: 1,
      st_depression: 2.6,
      slope: 2,
      major_vessels: 2,
      thalassemia: 7,
      model_name: "XGBoost",
    },
  },
  {
    label: "Case B: Lower-Risk Presentation",
    desc: "42yo Female, Atypical pain, high heart rate, normal ST segment",
    data: {
      age: 42,
      sex: 0,
      chest_pain: 2,
      resting_bp: 118,
      cholesterol: 198,
      fasting_blood_sugar: 0,
      resting_ecg: 0,
      max_heart_rate: 172,
      exercise_angina: 0,
      st_depression: 0.2,
      slope: 1,
      major_vessels: 0,
      thalassemia: 3,
      model_name: "XGBoost",
    },
  },
  {
    label: "Case C: Moderate-Risk Borderline",
    desc: "56yo Male, Non-anginal pain, borderline systolic pressure & lipids",
    data: {
      age: 56,
      sex: 1,
      chest_pain: 3,
      resting_bp: 135,
      cholesterol: 245,
      fasting_blood_sugar: 1,
      resting_ecg: 1,
      max_heart_rate: 148,
      exercise_angina: 0,
      st_depression: 1.1,
      slope: 2,
      major_vessels: 1,
      thalassemia: 3,
      model_name: "XGBoost",
    },
  },
];

export default function ClinicalForm({ onSubmit, isLoading }: ClinicalFormProps) {
  const [formData, setFormData] = useState<PatientInput>({
    age: 55,
    sex: 1,
    chest_pain: 3,
    resting_bp: 130,
    cholesterol: 240,
    fasting_blood_sugar: 0,
    resting_ecg: 0,
    max_heart_rate: 150,
    exercise_angina: 0,
    st_depression: 1.0,
    slope: 2,
    major_vessels: 0,
    thalassemia: 3,
    model_name: "XGBoost",
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PatientInput, value: number | string | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const loadSample = (sample: typeof SAMPLE_PROFILES[0]) => {
    setFormData(sample.data);
    setValidationErrors({});
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.age || formData.age < 18 || formData.age > 100) {
      errors.age = "Please provide age between 18 and 100 years.";
    }
    if (!formData.resting_bp || formData.resting_bp < 80 || formData.resting_bp > 240) {
      errors.resting_bp = "Systolic BP typically ranges 80-240 mm Hg.";
    }
    if (!formData.cholesterol || formData.cholesterol < 100 || formData.cholesterol > 600) {
      errors.cholesterol = "Serum cholesterol typically ranges 100-600 mg/dl.";
    }
    if (!formData.max_heart_rate || formData.max_heart_rate < 60 || formData.max_heart_rate > 220) {
      errors.max_heart_rate = "Max HR typically ranges 60-220 bpm.";
    }
    if (formData.st_depression < 0 || formData.st_depression > 6.5) {
      errors.st_depression = "ST depression typically ranges 0.0 - 6.5.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validate()) return;
    await onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#D3E8DA] shadow-sm p-6 sm:p-8">
      {/* Sample presets */}
      <div className="mb-6 p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-[#1F3D2B] uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#52796F]" />
            Pre-loaded Academic Benchmark Cases
          </span>
          <span className="text-[11px] text-[#718E7B]">Click to test instantly</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {SAMPLE_PROFILES.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadSample(sample)}
              className="text-left p-2.5 rounded-lg border border-[#D3E8DA] bg-white hover:border-[#8FBF9F] hover:bg-[#EAF6EE]/50 transition-all text-xs group"
            >
              <div className="font-semibold text-[#1F3D2B] group-hover:text-[#52796F]">
                {sample.label}
              </div>
              <div className="text-[11px] text-[#718E7B] mt-0.5 truncate">
                {sample.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Model Selection */}
        <div className="p-4 rounded-xl bg-[#EAF6EE]/60 border border-[#D3E8DA] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="text-sm font-bold text-[#1F3D2B]">
              Inference Algorithm Selection
            </label>
            <p className="text-xs text-[#52796F]">
              Select from the 6 trained supervised classifiers
            </p>
          </div>
          <select
            value={formData.model_name}
            onChange={(e) => handleInputChange("model_name", e.target.value)}
            className="px-3.5 py-2 rounded-xl text-sm font-medium bg-white border border-[#D3E8DA] text-[#1F3D2B] focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]"
          >
            <option value="XGBoost">XGBoost (Recommended — 96.4% Recall)</option>
            <option value="Random Forest">Random Forest (88.5% Acc, 0.950 ROC)</option>
            <option value="Logistic Regression">Logistic Regression (Linear baseline)</option>
            <option value="Support Vector Machine">Support Vector Machine (RBF kernel)</option>
            <option value="Decision Tree">Decision Tree (Interpretable tree)</option>
            <option value="Deep Neural Network">Deep Neural Network (MLP 64-32)</option>
          </select>
        </div>

        {/* Clinical Parameters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Patient Age (years)
            </label>
            <input
              type="number"
              min="18"
              max="100"
              value={formData.age}
              onChange={(e) => handleInputChange("age", Number(e.target.value))}
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border ${
                validationErrors.age ? "border-rose-400" : "border-[#D3E8DA]"
              } text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]`}
            />
            <p className="text-[11px] text-[#718E7B] mt-1">
              Patient chronological age in years
            </p>
            {validationErrors.age && (
              <p className="text-[11px] text-rose-600 mt-0.5">{validationErrors.age}</p>
            )}
          </div>

          {/* Sex */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Biological Sex
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("sex", 1)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.sex === 1
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                Male (1)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("sex", 0)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.sex === 0
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                Female (0)
              </button>
            </div>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Cardiovascular sex-specific baseline
            </p>
          </div>

          {/* Chest Pain Type */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Chest Pain Type (cp)
            </label>
            <select
              value={formData.chest_pain}
              onChange={(e) => handleInputChange("chest_pain", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border border-[#D3E8DA] text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]"
            >
              <option value="1">1: Typical Angina</option>
              <option value="2">2: Atypical Angina</option>
              <option value="3">3: Non-anginal Pain</option>
              <option value="4">4: Asymptomatic (High CVD prevalence)</option>
            </select>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Clinical angina presentation classification
            </p>
          </div>

          {/* Resting Blood Pressure */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Resting Blood Pressure (mm Hg)
            </label>
            <input
              type="number"
              min="80"
              max="240"
              value={formData.resting_bp}
              onChange={(e) => handleInputChange("resting_bp", Number(e.target.value))}
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border ${
                validationErrors.resting_bp ? "border-rose-400" : "border-[#D3E8DA]"
              } text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]`}
            />
            <p className="text-[11px] text-[#718E7B] mt-1">
              Resting systolic blood pressure upon admission
            </p>
            {validationErrors.resting_bp && (
              <p className="text-[11px] text-rose-600 mt-0.5">{validationErrors.resting_bp}</p>
            )}
          </div>

          {/* Serum Cholesterol */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Serum Cholesterol (mg/dl)
            </label>
            <input
              type="number"
              min="100"
              max="600"
              value={formData.cholesterol}
              onChange={(e) => handleInputChange("cholesterol", Number(e.target.value))}
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border ${
                validationErrors.cholesterol ? "border-rose-400" : "border-[#D3E8DA]"
              } text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]`}
            />
            <p className="text-[11px] text-[#718E7B] mt-1">
              Total fasting serum cholesterol measurement
            </p>
            {validationErrors.cholesterol && (
              <p className="text-[11px] text-rose-600 mt-0.5">{validationErrors.cholesterol}</p>
            )}
          </div>

          {/* Fasting Blood Sugar */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Fasting Blood Sugar &gt; 120 mg/dl
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("fasting_blood_sugar", 0)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.fasting_blood_sugar === 0
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                ≤ 120 mg/dl (Normal)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("fasting_blood_sugar", 1)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.fasting_blood_sugar === 1
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                &gt; 120 mg/dl (Elevated)
              </button>
            </div>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Diabetic/impaired fasting glucose marker
            </p>
          </div>

          {/* Resting ECG */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Resting ECG Results (restecg)
            </label>
            <select
              value={formData.resting_ecg}
              onChange={(e) => handleInputChange("resting_ecg", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border border-[#D3E8DA] text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]"
            >
              <option value="0">0: Normal</option>
              <option value="1">1: ST-T Wave Abnormality</option>
              <option value="2">2: Left Ventricular Hypertrophy (LVH)</option>
            </select>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Baseline electrocardiogram tracing
            </p>
          </div>

          {/* Maximum Heart Rate */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Max Heart Rate Achieved (thalach)
            </label>
            <input
              type="number"
              min="60"
              max="220"
              value={formData.max_heart_rate}
              onChange={(e) => handleInputChange("max_heart_rate", Number(e.target.value))}
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border ${
                validationErrors.max_heart_rate ? "border-rose-400" : "border-[#D3E8DA]"
              } text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]`}
            />
            <p className="text-[11px] text-[#718E7B] mt-1">
              Peak heart rate during treadmill stress test (bpm)
            </p>
            {validationErrors.max_heart_rate && (
              <p className="text-[11px] text-rose-600 mt-0.5">{validationErrors.max_heart_rate}</p>
            )}
          </div>

          {/* Exercise-Induced Angina */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Exercise-Induced Angina (exang)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange("exercise_angina", 0)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.exercise_angina === 0
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                No Angina (0)
              </button>
              <button
                type="button"
                onClick={() => handleInputChange("exercise_angina", 1)}
                className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                  formData.exercise_angina === 1
                    ? "bg-[#8FBF9F] text-white border-[#8FBF9F]"
                    : "bg-[#F7FBF8] text-[#1F3D2B] border-[#D3E8DA] hover:bg-[#EAF6EE]"
                }`}
              >
                Yes Angina (1)
              </button>
            </div>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Presence of chest discomfort provoked by physical exertion
            </p>
          </div>

          {/* ST Depression */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              ST Depression (oldpeak)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="6.5"
              value={formData.st_depression}
              onChange={(e) => handleInputChange("st_depression", Number(e.target.value))}
              className={`w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border ${
                validationErrors.st_depression ? "border-rose-400" : "border-[#D3E8DA]"
              } text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]`}
            />
            <p className="text-[11px] text-[#718E7B] mt-1">
              ST depression induced by exercise relative to rest (mm)
            </p>
            {validationErrors.st_depression && (
              <p className="text-[11px] text-rose-600 mt-0.5">{validationErrors.st_depression}</p>
            )}
          </div>

          {/* Thalassemia */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Thalassemia Scintigraphy (thal)
            </label>
            <select
              value={formData.thalassemia}
              onChange={(e) => handleInputChange("thalassemia", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border border-[#D3E8DA] text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]"
            >
              <option value="3">3: Normal Blood Flow</option>
              <option value="6">6: Fixed Defect (Previous Infarction)</option>
              <option value="7">7: Reversible Defect (Ischemia)</option>
            </select>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Myocardial perfusion scintigraphy status
            </p>
          </div>

          {/* Major Vessels Count (ca) */}
          <div>
            <label className="block text-xs font-semibold text-[#1F3D2B] mb-1">
              Major Fluoroscopy Vessels (0-3)
            </label>
            <select
              value={formData.major_vessels}
              onChange={(e) => handleInputChange("major_vessels", Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-sm bg-[#F7FBF8] border border-[#D3E8DA] text-[#1F3D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#8FBF9F]"
            >
              <option value="0">0: Zero vessels colored</option>
              <option value="1">1: One vessel colored</option>
              <option value="2">2: Two vessels colored</option>
              <option value="3">3: Three vessels colored</option>
            </select>
            <p className="text-[11px] text-[#718E7B] mt-1">
              Coronary vessels observed with fluoroscopic dye
            </p>
          </div>
        </div>

        {/* Privacy & Clinical Notice */}
        <div className="p-3.5 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA] text-xs text-[#4F6B58] flex items-center justify-between">
          <span>
            🔒 <strong>Zero PII Collected:</strong> Only anonymous physiological metrics are evaluated. No names or identification required.
          </span>
          <span className="text-[11px] text-[#718E7B]">UCI Cleveland Schema Compliant</span>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-xl font-semibold text-white bg-[#8FBF9F] hover:bg-[#7CAE8E] disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow flex items-center justify-center gap-2 text-base"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing clinical profile…</span>
              </>
            ) : (
              <>
                <span>Analyze Cardiovascular Risk</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
