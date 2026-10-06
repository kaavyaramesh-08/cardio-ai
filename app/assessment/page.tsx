"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClinicalForm from "@/components/ClinicalForm";
import Disclaimer from "@/components/Disclaimer";
import { PatientInput, PredictionResponse } from "@/lib/types";
import { Activity } from "lucide-react";

export default function AssessmentPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (input: PatientInput) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Prediction request failed.");
      }

      const result: PredictionResponse = await response.json();

      // Persist result in sessionStorage for Results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("cardio_last_result", JSON.stringify(result));
        sessionStorage.setItem("cardio_last_input", JSON.stringify(input));
      }

      // Navigate to results
      router.push("/results");
    } catch (err: unknown) {
      console.error("Submission error:", err);
      const message = err instanceof Error ? err.message : "An unexpected error occurred.";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF6EE] text-xs font-semibold text-[#1F3D2B] mb-2 border border-[#8FBF9F]/50">
          <Activity className="w-3.5 h-3.5 text-[#52796F]" />
          Decision-Support Input Form
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#1F3D2B] tracking-tight">
          Patient Clinical Assessment
        </h1>
        <p className="text-sm sm:text-base text-[#4F6B58] mt-2 leading-relaxed">
          Provide routine non-invasive clinical biomarkers to evaluate cardiovascular risk likelihood,
          discover the patient&apos;s statistical cluster archetype, and inspect local SHAP explainability.
        </p>
      </div>

      {/* Error alert if any */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm">
          <p className="font-semibold">Assessment Error</p>
          <p className="text-xs text-rose-700 mt-0.5">{errorMessage}</p>
        </div>
      )}

      {/* Main Clinical Form */}
      <ClinicalForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* Bottom Disclaimer */}
      <div className="max-w-3xl">
        <Disclaimer customText="This input module evaluates clinical parameters based on empirical patterns identified in the UCI Cleveland cardiovascular dataset. It should not be used as a primary diagnostic instrument or a substitute for expert cardiology consultation." />
      </div>
    </div>
  );
}
