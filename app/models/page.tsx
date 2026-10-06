"use client";

import Link from "next/link";
import { Cpu, ArrowRight, CheckCircle2 } from "lucide-react";
import mlBundle from "@/lib/ml-data/ml_bundle.json";
import ModelComparison from "@/components/ModelComparison";
import Disclaimer from "@/components/Disclaimer";
import { ModelEvaluationData, ModelMetric } from "@/lib/types";

export default function ModelsPage() {
  const metricsData = mlBundle.metrics as unknown as ModelEvaluationData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D3E8DA]">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#52796F] mb-1">
            <Cpu className="w-4 h-4" />
            Supervised Machine Learning Evaluation
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1F3D2B]">
            Model Comparison &amp; Benchmarks
          </h1>
          <p className="text-sm text-[#4F6B58] mt-1 max-w-2xl">
            Empirical benchmarking of 6 distinct machine learning architectures evaluated on an independent 20% holdout test partition from the UCI Cleveland cohort.
          </p>
        </div>

        <Link
          href="/assessment"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-[#8FBF9F] text-white hover:bg-[#7CAE8E] transition-all shadow-xs self-start sm:self-auto"
        >
          Test Clinical Models
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Main Model Comparison Component */}
      <ModelComparison metricsData={metricsData} />

      {/* Detailed Confusion Matrix Section */}
      <div className="bg-white rounded-2xl border border-[#D3E8DA] p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#1F3D2B] mb-2">
          Diagnostic Confusion Matrices (Test Set n=61)
        </h3>
        <p className="text-xs text-[#52796F] mb-6">
          Comparing True Positives (TP), True Negatives (TN), False Positives (FP), and critical False Negatives (FN)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metricsData.models.slice(0, 3).map((m: ModelMetric) => {
            const cm = m.confusion_matrix;
            return (
              <div
                key={m.model_name}
                className="p-4 rounded-xl bg-[#F7FBF8] border border-[#D3E8DA]"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm text-[#1F3D2B]">
                    {m.model_name}
                  </span>
                  <span className="text-[11px] font-semibold text-[#52796F]">
                    Recall: {(m.recall * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-3 bg-white rounded-lg border border-[#D3E8DA]">
                    <span className="text-[10px] text-[#718E7B] block">True Negative (TN)</span>
                    <span className="text-lg font-bold text-[#1F3D2B]">{cm.tn}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#D3E8DA]">
                    <span className="text-[10px] text-[#718E7B] block">False Positive (FP)</span>
                    <span className="text-lg font-bold text-amber-700">{cm.fp}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rose-200 bg-rose-50/40">
                    <span className="text-[10px] text-rose-700 block font-semibold">
                      False Negative (FN)
                    </span>
                    <span className="text-lg font-bold text-rose-700">{cm.fn}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-[#8FBF9F] bg-[#EAF6EE]/40">
                    <span className="text-[10px] text-[#1F3D2B] block font-semibold">
                      True Positive (TP)
                    </span>
                    <span className="text-lg font-bold text-[#1F3D2B]">{cm.tp}</span>
                  </div>
                </div>

                <p className="mt-3 text-[11px] text-[#718E7B]">
                  {cm.fn === 1
                    ? "★ Only 1 false negative out of 28 positive disease cases!"
                    : `${cm.fn} false negatives out of 28 positive disease cases.`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clinical Rationale Box */}
      <div className="p-6 rounded-2xl bg-[#EAF6EE] border border-[#8FBF9F]/60 space-y-3">
        <h4 className="font-bold text-sm text-[#1F3D2B] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#52796F]" />
          Why Recall is Prioritized Over Naive Accuracy in Clinical Screening
        </h4>
        <p className="text-xs sm:text-sm text-[#4F6B58] leading-relaxed">
          In diagnostic cardiovascular applications, the cost of a <strong>False Negative</strong> (failing to detect an individual with ischemic heart disease who is subsequently sent home without treatment) is far higher than a <strong>False Positive</strong> (prompting an additional echocardiogram or confirmation workup). XGBoost attained <strong>96.43% Recall</strong> (only 1 missed case on test partition) with a high <strong>ROC-AUC of 0.9459</strong>, making it the most clinically sound screening model.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
}
